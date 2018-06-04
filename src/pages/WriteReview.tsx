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

export type WriteReviewProps = {
  readonly rating: Rating
}

export type WriteReviewState = {
  readonly rating: Rating
}

export class WriteReview extends React.Component<WriteReviewProps, WriteReviewState> {
  constructor(props: WriteReviewProps) {
    super(props)
    this.state = {
      rating: this.props.rating
    }
  }

  private setRating(rating: Rating): void {
    this.setState({
      rating: rating
    })
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="d-flex justify-content-between" style={{ backgroundColor: "#34AFF4" }}>
          <div className="p-2" style={{ fontSize: "14px" }}>
            <a href="javascript:" style={{ color: "white" }}>Close</a>
          </div>
          <div className="p-2" style={{ color: "white", fontSize: "14px" }}>Review Waan Thai</div>
          <div className="p-2" style={{ fontSize: "14px" }}>
            <a href="javascript:" style={{ color: "white" }}>Save</a>
          </div>
        </div>
        <div style={{ padding: "10px" }}>
          <div style={{ textAlign: "center" }}>
            <RatingSlider rating={this.state.rating} onRatingChanged={r => this.setRating(r)} />
          </div>
          <div style={{ textAlign: "center" }}>
            <RatingText rating={this.state.rating}/>
          </div>
          <hr style={{ margin: 0 }}/>
          <input type="text" className="form-control" placeholder="Your name" />
          <hr style={{ margin: 0 }}/>
          <textarea className="form-control" placeholder="Add more details on your experience"></textarea>
          <hr style={{ margin: 0 }}/>
        </div>
      </div>
    )
  }
}
