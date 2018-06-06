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
import moment from "moment"
import { ReviewInput } from "../../components/review/WriteReview"
import { Future, Cancelable, IO } from "funfix"
import axios from "axios"
import { match, caseWhen, hasFields, isArrayOf, isString } from "typematcher"

export namespace ReviewsState {
  export type New = {
    readonly _tag: "New"
  }

  export const New: New = {
    _tag: "New"
  }

  export type Loading = {
    readonly _tag: "Loading"
    readonly task: Cancelable
  }

  export function Loading(task: Cancelable): Loading {
    return {
      _tag: "Loading",
      task: task
    }
  }

  export type Loaded = {
    readonly _tag: "Loaded"
    readonly companyName: string
    readonly reviews: Array<Review>
    readonly myRating?: Rating // this is used to store user rating if review write canceled
    readonly myReview?: Review
    readonly ratingAvg?: number
    readonly totalReviews?: number
  }

  export function Loaded(companyName: string,
                         reviews: Array<Review>,
                         myReview?: Review,
                         ratingAvg?: number,
                         totalReviews?: number): Loaded {
    return {
      _tag: "Loaded",
      companyName: companyName,
      reviews: reviews,
      myReview: myReview,
      ratingAvg: ratingAvg,
      totalReviews: totalReviews
    }
  }

  export type EditReview = {
    readonly _tag: "EditReview"
    readonly companyName: string
    readonly reviews: Array<Review>
    readonly prevReview?: Review // for canceling
    readonly myReview: Review
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
  export type Loading = {
    readonly type: "Loading"
    readonly task: Cancelable
  }

  export function Loading(task: Cancelable): Loading {
    return {
      type: "Loading",
      task: task
    }
  }

  export function Load<S>(q: string, dispatch: (a: ReviewsAction) => void): void {
    dispatch(Loading(
      // TODO: this request should live inside an API client, move it
      IO
        .deferFuture(() =>
          Future
          .fromPromise(
            axios.get(`https://cors-anywhere.herokuapp.com/https://api.hitta.se/search/v7/app/company/${encodeURIComponent(q)}`)
              .then(r => match(r.data,
                caseWhen(
                  hasFields({
                    result: hasFields({
                      companies: hasFields({
                        company: isArrayOf(hasFields({
                          id: isString,
                          displayName: isString
                        }))
                      })
                    })
                  }),
                  response => {
                    const firstCo = response.result.companies.company[0]
                    if (firstCo) {
                      return firstCo
                    } else {
                      throw new Error("Company not found")
                    }
                  }
                ).
                caseDefault(() => {
                  throw new Error("Failed to load company info")
                })
              ))
          )
        )
        .runOnComplete(_ => _.fold(
          e => {
            dispatch(Failed("Failed to load company reviews"))
          },
          r => {
            dispatch(Loaded(
              r.displayName,
              [
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
              ]
            ))
          }
        ))
    ))
  }

  export type Loaded = {
    readonly type: "Loaded"
    readonly companyName: string
    readonly reviews: Array<Review>
    readonly myReview?: Review
  }

  export function Loaded(companyName: string, reviews: Array<Review>, myReview?: Review): Loaded {
    return {
      type: "Loaded",
      companyName: companyName,
      reviews: reviews,
      myReview: myReview
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

  export type Failed = {
    readonly type: "Failed"
    readonly message: string
  }

  export function Failed(message: string): Failed {
    return {
      type: "Failed",
      message: message
    }
  }
}

export type ReviewsAction =
  | ReviewsAction.Loading
  | ReviewsAction.Loaded
  | ReviewsAction.EditReview
  | ReviewsAction.CancelEditReview
  | ReviewsAction.SaveReview
  | ReviewsAction.Failed

/**
 * Reduce new state from old state and given action
 */
export function reduceReviewsState(state: ReviewsState = ReviewsState.New, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case "Loading": {
      return ReviewsState.Loading(action.task)
    }
    case "Loaded": {
      return ReviewsState.Loaded(action.companyName, action.reviews, action.myReview)
    }
    case "EditReview": {
      switch (state._tag) {
        case "Loaded": return ({
          _tag: "EditReview",
          prevReview: state.myReview,
          myReview: action.review,
          reviews: state.reviews,
          companyName: state.companyName
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
          reviews: state.reviews,
          companyName: state.companyName
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
          reviews: state.reviews,
          companyName: state.companyName
        })
        default: return state // invalid state, ignore
      }

    }
    case "Failed": {
      return ReviewsState.Error("something went wrong")
    }
    default: {
      // this is required in order to ignore unknown actions
      return state
    }
  }
}
