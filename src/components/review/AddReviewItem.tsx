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
import { RatingSlider } from "../rating"
import { Rating } from "../../api"

export type AddReviewItemProps = {
  readonly rating?: Rating
  readonly onRatingChanged: (r: Rating) => void
}

export class AddReviewItem extends React.Component<AddReviewItemProps, never> {
  render(): React.ReactNode {
    return (
      <div className="review-item clearfix">
        <div className="review-col1">
          <img src={require("./assets/avatar.png")}/>
        </div>
        <div className="review-col2">
          <div className="review-title">Rate and review</div>
          <div className="review-rating">
            <span>Share your experience to help others</span>
          </div>
          <div className="review-text">
            <RatingSlider rating={this.props.rating} onRatingSelected={this.props.onRatingChanged}/>
          </div>
        </div>
      </div>
    )
  }
}
