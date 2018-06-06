/*!
 * Copyright (c) 2017 by THIS Project Developers.
 * Some rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react"
import { RatingSlider, RatingText, Rating } from "../components/rating"
import { AlertBox } from "./AlertBox"

export type ReviewInput = {
  readonly rating: Rating
  readonly userName?: string
  readonly message?: string
}

export type WriteReviewProps = {
  readonly title: string
  readonly review: ReviewInput
  readonly onClose?: (r: ReviewInput) => void
  readonly onSave?: (r: ReviewInput) => void
}

namespace WriteReviewState {
  export type Editing = {
    readonly _tag: "Editing"
    readonly review: ReviewInput
  }

  export type ThankYou = {
    readonly _tag: "ThankYou"
    readonly review: ReviewInput
  }
}

export type WriteReviewState =
  | WriteReviewState.Editing
  | WriteReviewState.ThankYou

export class WriteReview extends React.Component<WriteReviewProps, WriteReviewState> {
  constructor(props: WriteReviewProps) {
    super(props)
    this.state = {
      _tag: "Editing",
      review: this.props.review
    }
  }

  private setRating(rating: Rating): void {
    this.setState(prev => ({
      _tag: "Editing",
      review: {
        ...prev.review,
        rating: rating
      }
    }))
  }

  private setUserName(userName: string): void {
    this.setState(prev => ({
      _tag: "Editing",
      review: {
        ...(prev.review),
        userName: userName.trim() !== "" ? userName.trim() : undefined
      }
    }))
  }

  private setMessage(message: string): void {
    this.setState(prev => ({
      _tag: "Editing",
      review: {
        ...(prev.review),
        message: message.trim() !== "" ? message.trim() : undefined
      }
    }))
  }

  private save(): void {
    this.setState(prev => ({
      _tag: "ThankYou",
      review: prev.review
    }))
  }

  private close(): void {
    if (this.props.onClose) {
      this.props.onClose(this.props.review)
    }
  }

  private done(): void {
    if (this.props.onSave) {
      this.props.onSave(this.props.review)
    }
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="d-flex justify-content-between actionbar">
          <div className="p-2 actionbar-button">
            <button onClick={_ => this.close()}>Close</button>
          </div>
          <div className="p-2" style={{ color: "white" }}>{this.props.title}</div>
          <div className="p-2 actionbar-button">
            <button onClick={_ => this.save()}>Save</button>
          </div>
        </div>
        <div style={{ padding: "1rem 0.75rem" }}>
          <div style={{ textAlign: "center" }}>
            <RatingSlider rating={this.state.review.rating} onRatingChanged={r => this.setRating(r)} />
          </div>
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <RatingText rating={this.state.review.rating} />
          </div>
          <hr style={{ margin: "1.125rem 0 .125rem 0" }} />
          <input type="text"
            className="form-control"
            placeholder="Your name"
            onChange={e => this.setUserName(e.target.value)} />
          <hr style={{ margin: ".25rem 0 .25rem 0" }} />
          <textarea className="form-control"
            placeholder="Add more details on your experience"
            rows={3}
            style={{ resize: "none" }}
            onChange={e => this.setMessage(e.target.value)}></textarea>
          <hr style={{ margin: 0 }} />
        </div>
        {this.state._tag === "ThankYou" ? (
          <AlertBox
            title="Thank you for your review"
            message="You're helping others make smarter decisions every day."
            dismissText="Okey!"
            onDismiss={() => this.done()} />
        ) : null}
      </div>
    )
  }
}
