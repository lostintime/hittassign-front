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
import { Review } from "../components/review/dsl"
import moment from "moment"

export class ReviewsList extends React.Component<{}, never> {
  render(): React.ReactNode {
    const reviewSubtitle = (review: Review): string => {
      const time = moment(review.time).fromNow()
      if (review.source) {
        return `${time} - ${review.source}`
      } else {
        return time
      }
    }
    const reviews: Array<Review> = [
      {
        rating: 4,
        userName: "Anonym",
        time: moment().subtract(12, "hours").toDate(),
        source: "hitta.se",
        message: "Liked it very much - probably on of the best thai restaurands in the city - recommend!"
      },
      {
        rating: 3,
        userName: "Jenny Svensson",
        time: moment().subtract(1, "days").toDate(),
        source: "hitta.se",
        message: "Maybe a bit too fast food. I personally dislike that. Good otherwise."
      },
      {
        rating: 5,
        userName: "happy56",
        time: moment().subtract(2, "days").toDate(),
        source: "yelp.com",
        message: "Super good! Love the food!",
        userPic: require("../components/review/assets/avatar-sample1.png")
      }
    ]

    return (
      <div className="container" style={{ paddingTop: "26px", paddingBottom: "15px" }}>
        <h2>Reviews</h2>
        <ReviewHeader />
        <hr />
        <ReviewAddItem />
        <hr />
        <h3>Latest reviews</h3>
        <ul className="review-list">
          {reviews.map(((review, key) => (
            <li key={key}>
              <ReviewItem
                title={review.userName || "Anonymous"}
                rating={review.rating}
                subtitle={reviewSubtitle(review)}
                text={review.message}
                picSrc={review.userPic}
              />
              {(key < (reviews.length - 1)) ? (<hr />) : null}
            </li>
          ))}
        </ul>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <b><a href="javascript:">View all reviews</a></b>
        </div>
      </div>
    )
  }
}
