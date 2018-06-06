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
import { Rating } from "../../api"

export type RatingTextProps = {
  readonly rating: Rating
}

/**
 * Reting message text
 */
export class RatingText extends React.Component<RatingTextProps, never> {

  private getRatingText(): string {
    switch (this.props.rating) {
      case 1: return "I hated it"
      case 2: return "I didn't like it"
      case 3: return "It was OK"
      case 4: return "I liked it"
      case 5: return "I loved it"
    }
  }

  render(): React.ReactNode {
    return (
      <span className="rating-text">
        {this.getRatingText()}
      </span>
    )
  }
}
