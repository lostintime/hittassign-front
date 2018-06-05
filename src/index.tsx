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

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route path="/add" render={() => (<WriteReview review={{ rating: 5 }} />)} />
      <Route path="/" component={ReviewsList} />
    </Switch>
  </BrowserRouter>
), document.getElementById("root"))
