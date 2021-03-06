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
import moment = require("moment")
import { ReviewsList, WriteReview, ReviewHeader, MyReviewItem, AddReviewItem } from "../../components/review"
import { ReviewsState, ReviewsAction, reduceReviewsState } from "./state"

export type ReviewsProps = {}

export class Reviews extends React.Component<ReviewsProps, ReviewsState> {
  state: ReviewsState = ReviewsState.New

  private dispatch: (a: ReviewsAction) => void = (action) => {
    this.setState(reduceReviewsState(this.state, action))
  }

  componentDidMount() {
    // The query is hardcoded here as github pages doesn't support urls rewrite
    ReviewsAction.Load("Vd", this.dispatch)
  }

  componentWillUnmount() {
    this.dispatch(ReviewsAction.Unmount)
  }

  render(): React.ReactNode {
    const state = this.state
    switch (state._tag) {
      case "New": return null
      case "Loading": return (
        <div className="modal d-flex flex-column justify-content-center">
          <div className="p-2 align-self-center">
            Loading ...
          </div>
        </div>
      )
      case "Loaded": {
        const myReview = state.myReview
        const myRating = state.myRating

        return (
          <div className="container" style={{ paddingTop: "26px", paddingBottom: "15px" }}>
            <h2>{state.company.displayName} Reviews</h2>

            <ReviewHeader />
            <hr />
            {myReview ? (
              <div>
                <h3>Your review</h3>
                <MyReviewItem review={myReview}
                  onEdit={() => this.dispatch(ReviewsAction.EditReview(myReview))} />
              </div>
            ) : (
                <AddReviewItem rating={myRating}
                  onRatingChanged={r =>
                    this.dispatch(ReviewsAction.EditReview({
                      rating: r, time: moment().toDate()
                    }))} />
              )}
            <hr />

            <h3>Latest reviews</h3>
            <ReviewsList reviews={state.reviews} />

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <b><a href="javascript:">View all reviews</a></b>
            </div>
          </div>
        )
      }
      case "EditReview": return (
        <WriteReview review={state.myReview}
          title={`Review ${state.company.displayName}`}
          onClose={r => this.dispatch(ReviewsAction.CancelEditReview(r))}
          onSave={r => ReviewsAction.SaveReview(state.company, r, this.dispatch)} />
      )
      case "Error": return (
        <div className="modal d-flex flex-column justify-content-center">
          <div className="p-2 align-self-center" style={{ color: "red" }}>
            ERROR: {state.message}
          </div>
        </div>
      )
    }
  }
}
