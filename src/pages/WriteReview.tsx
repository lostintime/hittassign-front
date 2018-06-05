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
import { Redirect } from "react-router"

export type WriteReviewProps = {
  readonly review: Review
}

type Review = {
  readonly rating: Rating
  readonly name?: string
  readonly message?: string
}

namespace WriteReviewState {
  export type Edit = {
    readonly _tag: "Edit"
    readonly review: Review
  }

  export type ThankYou = {
    readonly _tag: "ThankYou"
    readonly review: Review
  }

  export type Done = {
    readonly _tag: "Done"
    readonly review: Review
  }
}

export type WriteReviewState =
  | WriteReviewState.Edit
  | WriteReviewState.ThankYou
  | WriteReviewState.Done

export class WriteReview extends React.Component<WriteReviewProps, WriteReviewState> {
  constructor(props: WriteReviewProps) {
    super(props)
    this.state = {
      _tag: "Edit",
      review: this.props.review
    }
  }

  private setRating(rating: Rating): void {
    this.setState(prev => ({
      ...prev,
      rating: rating
    }))
  }

  private save(): void {
    this.setState(prev => ({
      _tag: "ThankYou",
      review: prev.review
    }))
  }

  private close(): void {
    this.save()
  }

  private done(): void {
    this.setState(prev => ({
      _tag: "Done",
      review: prev.review
    }))
  }

  render(): React.ReactNode {
    switch (this.state._tag) {
      case "Edit":
      case "ThankYou": {
        return (
          <div>
            <div className="d-flex justify-content-between actionbar">
              <div className="p-2 actionbar-button">
                <a href="javascript:" style={{ color: "white" }} onClick={_ => this.close()}>Close</a>
              </div>
              <div className="p-2" style={{ color: "white" }}>Review Waan Thai</div>
              <div className="p-2 actionbar-button">
                <a href="javascript:" style={{ color: "white" }} onClick={_ => this.save()}>Save</a>
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
              <input type="text" className="form-control" placeholder="Your name" />
              <hr style={{ margin: ".25rem 0 .25rem 0" }} />
              <textarea className="form-control" placeholder="Add more details on your experience" rows={3} style={{ resize: "none" }}></textarea>
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
      case "Done": {
        return (
          <Redirect to="/" />
        )
      }
    }
  }
}
