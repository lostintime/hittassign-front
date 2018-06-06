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

import moment = require("moment")
import { CompanyInfo, Api, Review, Rating, ReviewInput } from "../../api"
import { Cancelable } from "funfix"

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
    readonly company: CompanyInfo
    readonly reviews: Array<Review>
    readonly myRating?: Rating // this is used to store user rating if review write canceled
    readonly myReview?: Review
  }

  export function Loaded(company: CompanyInfo,
                         reviews: Array<Review>,
                         myReview?: Review,
                         myRating?: Rating): Loaded {
    return {
      _tag: "Loaded",
      company: company,
      reviews: reviews,
      myReview: myReview,
      myRating: myRating
    }
  }

  export type EditReview = {
    readonly _tag: "EditReview"
    readonly company: CompanyInfo
    readonly reviews: Array<Review>
    readonly myReview: Review
    readonly prevReview?: Review // for canceling
  }

  export function EditReview(company: CompanyInfo,
                             reviews: Array<Review>,
                             myReview: Review,
                             prevReview?: Review): EditReview {
    return {
      _tag: "EditReview",
      company: company,
      reviews: reviews,
      myReview: myReview,
      prevReview: prevReview
    }
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
      Api.findCompanies(q)
        .map(companies => {
          const firstCo = companies[0]
          if (firstCo) {
            return firstCo
          } else {
            throw new Error("Company not found")
          }
        })
        .flatMap(companyInfo =>
          Api.getReviews(companyInfo.id).map(reviews => ({ companyInfo, reviews }))
        )
        .runOnComplete(_ => _.fold(
          e => {
            dispatch(Failed("Failed to load company info"))
          },
          ({ companyInfo, reviews }) => dispatch(Loaded(companyInfo, reviews))
        ))
    ))
  }

  export type Loaded = {
    readonly type: "Loaded"
    readonly company: CompanyInfo
    readonly reviews: Array<Review>
    readonly myReview?: Review
  }

  export function Loaded(company: CompanyInfo, reviews: Array<Review>, myReview?: Review): Loaded {
    return {
      type: "Loaded",
      company: company,
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

  export function SaveReview(company: CompanyInfo,
                             input: ReviewInput,
                             dispatch: (a: ReviewsAction) => void): void {
    Api.saveReview(company, input).run()

    dispatch({
      type: "SaveReview",
      input: input
    })
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

  export type Unmount = {
    readonly type: "Unmount"
  }

  export const Unmount: Unmount = {
    type: "Unmount"
  }
}

export type ReviewsAction =
  | ReviewsAction.Loading
  | ReviewsAction.Loaded
  | ReviewsAction.EditReview
  | ReviewsAction.CancelEditReview
  | ReviewsAction.SaveReview
  | ReviewsAction.Failed
  | ReviewsAction.Unmount

/**
 * Reduce new state from old state and given action
 */
export function reduceReviewsState(state: ReviewsState = ReviewsState.New, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case "Loading": {
      return ReviewsState.Loading(action.task)
    }
    case "Loaded": {
      return ReviewsState.Loaded(action.company, action.reviews, action.myReview)
    }
    case "EditReview": {
      switch (state._tag) {
        case "Loaded": return ReviewsState.EditReview(
          state.company,
          state.reviews,
          action.review,
          state.myReview
        )
        default: return state // invalid state, ignore
      }
    }
    case "CancelEditReview": {
      switch (state._tag) {
        case "EditReview": return ReviewsState.Loaded(
          state.company,
          state.reviews,
          state.prevReview,
          action.input.rating
        )
        default: return state // invalid state, ignore
      }
    }
    case "SaveReview": {
      switch (state._tag) {
        case "EditReview": return ReviewsState.Loaded(
          state.company,
          state.reviews,
          {
            rating: action.input.rating,
            time: moment().toDate(),
            userName: action.input.userName,
            message: action.input.message,
            source: "hitta.se"
          }
        )
        default: return state // invalid state, ignore
      }

    }
    case "Failed": {
      return ReviewsState.Error(action.message)
    }
    case "Unmount": {
      switch (state._tag) {
        case "Loading": {
          state.task.cancel()
          return state
        }
        default: return state
      }
    }
    default: {
      // this is required in order to ignore unknown actions
      return state
    }
  }
}
