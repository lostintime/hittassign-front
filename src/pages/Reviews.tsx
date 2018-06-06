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
import { Review } from "../components/review/dsl"
import moment from "moment"
import { ReviewsList } from "../components/review/ReviewsList"
import { WriteReview, ReviewInput } from "../components/review/WriteReview"
import { Rating } from "../components/rating"
import { ReviewHeader } from "../components/review/ReviewHeader"
import { MyReviewItem } from "../components/review/MyReviewItem"
import { AddReviewItem } from "../components/review/AddReviewItem"

export type ReviewsProps = {

}

namespace ReviewsState {
  export type New = {
    readonly _tag: "New"
  }

  export type Loading = {
    readonly _tag: "Loading"
  }

  export type List = {
    readonly _tag: "List"
    readonly myRating?: Rating // this is used to store user rating if review write canceled
    readonly myReview?: Review
    readonly reviews: Array<Review>
    readonly ratingAvg?: number
    readonly totalReviews?: number
  }

  export type EditReview = {
    readonly _tag: "EditReview"
    readonly prevReview?: Review // for canceling
    readonly myReview: Review
    readonly reviews: Array<Review>
    readonly ratingAvg?: number
    readonly totalReviews?: number
  }

  export type Error = {
    readonly _tag: "Error"
    readonly message: string
  }
}

export type ReviewsState =
  | ReviewsState.New
  | ReviewsState.Loading
  | ReviewsState.List
  | ReviewsState.EditReview
  | ReviewsState.Error

export class Reviews extends React.Component<ReviewsProps, ReviewsState> {
  constructor(props: ReviewsProps) {
    super(props)

    this.state = {
      _tag: "New"
    }
  }

  componentDidMount() {
    this.setState({
      _tag: "Loading"
    })

    setTimeout(() => {
      this.setState({
        _tag: "List",
        reviews: [
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
        ],
        // myReview?: Review
        // readonly ratingAvg?: number
        totalReviews: 0
      })
    }, 200)
  }

  private addReview(rating: Rating): void {
    this.editReview({
      rating: rating,
      time: moment().toDate()
    })
  }

  private editReview(review: Review): void {
    this.setState((prev): ReviewsState => {
      switch (prev._tag) {
        case "List": return ({
          _tag: "EditReview",
          prevReview: prev.myReview,
          myReview: review,
          reviews: prev.reviews
        })
        default: return prev // invalid state, ignore
      }
    })
  }

  private saveReview(review: ReviewInput): void {
    this.setState((prev): ReviewsState => {
      switch (prev._tag) {
        case "EditReview": return ({
          _tag: "List",
          myReview: {
            rating: review.rating,
            time: moment().toDate(),
            userName: review.userName,
            message: review.message,
            source: "hitta.se"
          },
          reviews: prev.reviews
        })
        default: return prev // invalid state, ignore
      }
    })
  }

  private cancelReview(review: ReviewInput): void {
    this.setState((prev): ReviewsState => {
      switch (prev._tag) {
        case "EditReview": return ({
          _tag: "List",
          myRating: review.rating,
          myReview: prev.prevReview,
          reviews: prev.reviews
        })
        default: return prev // invalid state, ignore
      }
    })
  }

  render(): React.ReactNode {
    switch (this.state._tag) {
      case "New": return null
      case "Loading": return (
        <div className="modal d-flex flex-column justify-content-center">
          <div className="p-2 align-self-center">
            Loading ...
          </div>
        </div>
      )
      case "List": {
        const myReview = this.state.myReview
        const myRating = this.state.myRating

        return (
          <div className="container" style={{ paddingTop: "26px", paddingBottom: "15px" }}>
            <h2>Reviews</h2>
            <ReviewHeader />
            <hr />
            {myReview ? (
              <div>
                <h3>Your review</h3>
                <MyReviewItem review={myReview} onEdit={() => this.editReview(myReview)} />
              </div>
            ) : (
              <AddReviewItem rating={myRating} onRatingChanged={r => this.addReview(r)} />
            )}
            <hr />
            <h3>Latest reviews</h3>
            <ReviewsList reviews={this.state.reviews} />
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <b><a href="javascript:">View all reviews</a></b>
            </div>
          </div>
        )
      }
      case "EditReview": return (
        <WriteReview review={this.state.myReview}
                     title="Review My Company"
                     onClose={r => this.cancelReview(r)}
                     onSave={r => this.saveReview(r)} />
      )
      case "Error": return (
        <div className="modal d-flex flex-column justify-content-center">
          <div className="p-2 align-self-center">
            ERROR: {this.state.message}
          </div>
        </div>
      )
    }
  }
}
