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

import { Rating } from "../../components/rating"
import { Review } from "../../components/review/dsl"
import * as Redux from "redux"
import moment from "moment"
import { ReviewInput } from "../../components/review/WriteReview";

export namespace ReviewsState {
  export type New = {
    readonly _tag: "New"
  }

  export const New: New = {
    _tag: "New"
  }

  export type Loading = {
    readonly _tag: "Loading"
  }

  export function Loading(): Loading {
    return {
      _tag: "Loading"
    }
  }

  export type Loaded = {
    readonly _tag: "Loaded"
    readonly myRating?: Rating // this is used to store user rating if review write canceled

    readonly reviews: Array<Review>
    readonly myReview?: Review
    readonly ratingAvg?: number
    readonly totalReviews?: number
  }

  export function Loaded(reviews: Array<Review>, myReview?: Review, ratingAvg?: number, totalReviews?: number): Loaded {
    return {
      _tag: "Loaded",
      reviews: reviews,
      myReview: myReview,
      ratingAvg: ratingAvg,
      totalReviews: totalReviews
    }
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

  export function Error(message: string): Error {
    return {
      _tag: "Error",
      message: message
    }
  }
}

export type ReviewsState =
  | ReviewsState.New
  | ReviewsState.Loading
  | ReviewsState.Loaded
  | ReviewsState.EditReview
  | ReviewsState.Error

/**
 * Reviews actions
 */
export namespace ReviewsAction {
  export type Load = {
    readonly type: "Loading"
    readonly companyId: string
  }

  export function Load<S>(companyId: string, dispatch: Redux.Dispatch<ReviewsAction>): void {
    const load: Load = {
      type: "Loading",
      companyId: companyId
    }

    dispatch(load)

    // TODO make api call here
    setTimeout(() => {
      dispatch(Loaded([
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
          userPic: require("../../components/review/assets/avatar-sample1.png")
        }
      ]))
    }, 1000)
  }

  export type Loaded = {
    readonly type: "Loaded"
    readonly reviews: Array<Review>
    readonly myReview?: Review
    readonly ratingAvg?: number
    readonly totalReviews?: number
  }

  export function Loaded(reviews: Array<Review>, myReview?: Review, ratingAvg?: number, totalReviews?: number): Loaded {
    return {
      type: "Loaded",
      reviews: reviews,
      myReview: myReview,
      ratingAvg: ratingAvg,
      totalReviews: totalReviews
    }
  }

  export type EditReview = {
    readonly type: "EditReview"
    readonly review: Review
  }

  export function EditReview(review: Review): EditReview {
    return {
      type: "EditReview",
      review: review
    }
  }

  export type CancelEditReview = {
    readonly type: "CancelEditReview"
    readonly input: ReviewInput
  }

  export function CancelEditReview(input: ReviewInput): CancelEditReview {
    return {
      type: "CancelEditReview",
      input: input
    }
  }

  export type SaveReview = {
    readonly type: "SaveReview"
    readonly input: ReviewInput
  }

  export function SaveReview(input: ReviewInput): SaveReview {
    return {
      type: "SaveReview",
      input: input
    }
  }

  export type Error = {
    readonly type: "Error"
  }
}

export type ReviewsAction =
  | ReviewsAction.Load
  | ReviewsAction.Loaded
  | ReviewsAction.EditReview
  | ReviewsAction.CancelEditReview
  | ReviewsAction.SaveReview
  | ReviewsAction.Error

export function reduceReviewsState(state: ReviewsState = ReviewsState.New, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case "Loading": {
      return ReviewsState.Loading()
    }
    case "Loaded": {
      return ReviewsState.Loaded(action.reviews, action.myReview, action.ratingAvg, action.totalReviews)
    }
    case "EditReview": {
      switch (state._tag) {
        case "Loaded": return ({
          _tag: "EditReview",
          prevReview: state.myReview,
          myReview: action.review,
          reviews: state.reviews
        })
        default: return state // invalid state, ignore
      }
    }
    case "CancelEditReview": {
      switch (state._tag) {
        case "EditReview": return ({
          _tag: "Loaded",
          myRating: action.input.rating,
          myReview: state.prevReview,
          reviews: state.reviews
        })
        default: return state // invalid state, ignore
      }
    }
    case "SaveReview": {
      switch (state._tag) {
        case "EditReview": return ({
          _tag: "Loaded",
          myReview: {
            rating: action.input.rating,
            time: moment().toDate(),
            userName: action.input.userName,
            message: action.input.message,
            source: "hitta.se"
          },
          reviews: state.reviews
        })
        default: return state // invalid state, ignore
      }

    }
    case "Error": {
      return ReviewsState.Error("something went wrong")
    }
    default: {
      // this is required in order to ignore unknown actions
      return state
    }
  }
}
