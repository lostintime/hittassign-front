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

export type RatingViewProps = {
  readonly rating: number
}

export type RatingViewState = {}

/**
 * Small stars rating view (read-only)
 */
export class RatingView extends React.Component<RatingViewProps, RatingViewState> {

  render(): React.ReactNode {
    const stars: Array<Rating> = [1, 2, 3, 4, 5]

    return (
      <div>
        {stars.map(r => (
          <img src={r <= this.props.rating
            ? require("./assets/star_filled.png")
            : require("./assets/star_empty.png")}
            key={r}
            style={{
              width: "12px",
              height: "12px",
              padding: "0px"
            }} />
        ))}
      </div>
    )
  }
}
