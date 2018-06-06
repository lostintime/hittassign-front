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

import * as ReactDOM from "react-dom"
import * as React from "react"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import { ReviewsList } from "./pages/ReviewsList"
import { WriteReview } from "./pages/WriteReview"
import moment from "moment"

// Init moment
moment.updateLocale("en", {
  relativeTime : {
      future: "in %s",
      past:   "%s ago",
      s  : "1s",
      ss : "%ds",
      m:  "1min",
      mm: "%dmin",
      h:  "1h",
      hh: "%dh",
      d:  "1d",
      dd: "%dd",
      M:  "1m",
      MM: "%dm",
      y:  "1y",
      yy: "%dy"
  }
})

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route path="/add" render={() => (
        <WriteReview review={{ rating: 5 }} title="Review My Company" />
      )} />
      <Route path="/" component={ReviewsList} />
    </Switch>
  </BrowserRouter>
), document.getElementById("root"))
