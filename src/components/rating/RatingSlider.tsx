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
import { Rating } from "./dsl"

export type RatingSliderProps = {
  readonly rating?: Rating
  readonly onRatingChanged: (rating: Rating) => void
  readonly onRatingHovered?: (rating: Rating | 0) => void
}

export type RatingSliderState = {
  readonly rating: Rating | 0
  readonly displayRating: Rating | 0
}

/**
 * Rate stars
 */
export class RatingSlider extends React.Component<RatingSliderProps, RatingSliderState> {
  constructor(props: RatingSliderProps) {
    super(props)
    this.state = {
      rating: props.rating !== undefined ? props.rating : 0,
      displayRating: props.rating !== undefined ? props.rating : 0
    }
  }

  private displayRating(rating: Rating | 0): void {
    this.setState(prev => ({
      ...prev,
      displayRating: rating
    }))

    if (this.props.onRatingHovered) {
      this.props.onRatingHovered(rating)
    }
  }

  private setRating(rating: Rating): void {
    const prevRating = this.state.rating

    this.setState({
      rating: rating,
      displayRating: rating
    })

    if (this.props.onRatingChanged && rating !== prevRating) {
      this.props.onRatingChanged(rating)
    }
  }

  render(): React.ReactNode {
    const stars: Array<Rating> = [1, 2, 3, 4, 5]

    return (
      <div className="rating-slider">
        {stars.map(r => (
          <img src={r <= this.state.displayRating
            ? require("./assets/star_filled.png")
            : require("./assets/star_empty.png")}
            key={r}
            className="rating-star"
            onMouseOver={_ => this.displayRating(r)}
            onMouseOut={_ => this.displayRating(this.state.rating)}
            onClick={_ => this.setRating(r)} />
        ))}
      </div>
    )
  }
}
