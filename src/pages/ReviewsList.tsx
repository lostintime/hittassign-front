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
import { ReviewItem } from "../components/review/ReviewItem"
import { ReviewHeader } from "../components/review/ReviewHeader"
import { ReviewAddItem } from "../components/review/ReviewAddItem"

export class ReviewsList extends React.Component<{}, never> {
  render(): React.ReactNode {
    return (
      <div className="container" style={{ paddingTop: "26px", paddingBottom: "15px" }}>
        <h2>Reviews</h2>
        <ReviewHeader />
        <hr />
        <ReviewAddItem />
        <hr />
        <h3>Latest reviews</h3>
        <ReviewItem
          title="Anonym" rating={4} subtitle="12h ago - hitta.se"
          text="Liked it very much - probably on of the best thai restaurands in the city - recommend!"
        />
        <hr />
        <ReviewItem
          title="Jenny Svensson" rating={3} subtitle="1d ago - hitta.se"
          text="Maybe a bit too fast food. I personally dislike that. Good otherwise."
        />
        <hr />
        <ReviewItem
          title="happy56" rating={5} subtitle="1d ago - yelp.com"
          text="Super good! Love the food!" picSrc={require("../components/review/assets/avatar-sample1.png")}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <b><a href="javascript:">View all reviews</a></b>
        </div>
      </div>
    )
  }
}
