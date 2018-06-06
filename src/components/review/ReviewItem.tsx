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
import { RatingView } from "../rating"
import { Review } from "./dsl"
import { reviewSubtitle } from "./utils"

export type ReviewItemProps = {
  readonly review: Review
}

export class ReviewItem extends React.Component<ReviewItemProps, never> {
  render(): React.ReactNode {
    return (
      <div className="review-item clearfix">
        <div className="review-col1">
          <img src={this.props.review.userPic ? this.props.review.userPic : require("./assets/avatar.png")} />
        </div>
        <div className="review-col2">
          <div className="review-title">{this.props.review.userName || "Anonymous"}</div>
          <div className="review-rating">
            <RatingView rating={this.props.review.rating} />
              {reviewSubtitle(this.props.review)}
          </div>
          {this.props.review.message ? (<div className="review-text">{this.props.review.message}</div>) : null}
        </div>
      </div>
    )
  }
}
