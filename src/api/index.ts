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
import { IO, Future } from "funfix"
import axios from "axios"
import { match, caseWhen, hasFields, isArrayOf, isString } from "typematcher"

export type Rating = 1 | 2 | 3 | 4 | 5

export type ReviewInput = {
  readonly rating: Rating
  readonly userName?: string
  readonly message?: string
}

/**
 * Review info
 */
export type Review = {
  readonly rating: Rating
  readonly time: Date
  readonly message?: string
  readonly userName?: string
  readonly userPic?: string
  readonly source?: string
}

export type CompanyInfo = {
  id: string
  displayName: string
}

export const isCompanyInfo = hasFields<CompanyInfo>({
  id: isString,
  displayName: isString
})

export class ApiClient {
  findCompanies(q: string): IO<Array<CompanyInfo>> {
    return IO.deferFuture(() =>
      Future.fromPromise(
        axios.get(`https://cors-anywhere.herokuapp.com/https://api.hitta.se/search/v7/app/company/${encodeURIComponent(q)}`)
          .then(r => match(r.data,
            caseWhen(
              hasFields({
                result: hasFields({
                  companies: hasFields({
                    company: isArrayOf(isCompanyInfo)
                  })
                })
              }),
              response => response.result.companies.company
            ).
            caseDefault(() => {
              throw new Error("Loaded invalid company info")
            })
          ))
      )
    )
  }

  getReviews(companyId: string): IO<Array<Review>> {
    return IO.pure<Array<Review>>(
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
          userPic: require("../components/review/assets/avatar-sample1.png")
        }
      ]
    )
  }

  saveReview(company: CompanyInfo, input: ReviewInput): IO<void> {
    return IO.deferFuture(() => {
      const params = new URLSearchParams()
      params.append("score", `${input.rating}`)
      params.append("companyId", company.id)
      if (input.message) {
        params.append("comment", input.message)
      }
      if (input.userName) {
        params.append("userName", input.userName)
      }

      return Future.fromPromise(axios.post(
          `https://cors-anywhere.herokuapp.com/https://test.hitta.se/reviews/v1/company`,
          params,
          {
            headers: {
              "X-HITTA-DEVICE-NAME": "MOBILE_WEB",
              "X-HITTA-SHARED-IDENTIFIER": "15188693697264027"
            }
          }
        ))
        .map(() => {})
    })
  }
}

export const Api: ApiClient = new ApiClient()
