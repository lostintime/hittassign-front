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

export class ReviewHeader extends React.Component<{}, never> {
  render(): React.ReactNode {
    return (
      <div className="review-item clearfix">
        <div className="review-col1" style={{ paddingTop: "0px" }}>
          <div className="rating-avg">4.1</div>
        </div>
        <div className="review-col2">
          <div style={{ position: "relative", lineHeight: "35px" }}>
            <div className="text-secondary" style={{ float: "left", margin: 0, padding: 0, lineHeight: "35px" }}>
              from 27 reviews
            </div>
            <div style={{ float: "right", margin: 0, padding: 0, lineHeight: "35px" }}>
              <a href="javascript:">View all reviews</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
