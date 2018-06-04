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
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { RatingSlider } from "./components/rating/RatingSlider"
import { RatingView } from "./components/rating/RatingView"
import { RatingText } from "./components/rating/RatingText"
import { ReviewItem } from "./components/review/ReviewItem"

class HelloWorld extends React.Component<{}, {}> {
  render(): React.ReactNode {
    return (
      <div className="container">
        <h1>Hello world!!1</h1>
        <RatingSlider onRatingChanged={r => console.log("rating", r)} />
        <RatingView rating={3}/>
        <RatingText rating={5}/>
        <ReviewItem
          title="Anonym" rating={4} subtitle="12h ago - hitta.se"
          text="Liked it very much - probably on of the bes thai restaurands in the city - recommend!"
        />
        <ReviewItem
          title="Jenny Svensson" rating={3} subtitle="1d ago - hitta.se"
          text="Maybe a bit too fast food. I personally dislike that. Good otherwise."
        />
        <ReviewItem
          title="happy56" rating={5} subtitle="1d ago - yelp.com"
          text="Super good! Love the food!" picSrc={require("./components/review/assets/avatar-sample1.png")}
        />
        {/* <div className="test-text-title">Text title</div>
        <div className="test-text-primary">Primary text</div>
        <div className="test-text-secondary">Secondary text</div>
        <div className="rating-avg"><span>4.1</span></div> */}
      </div>
    )
  }
}

ReactDOM.render((
  <BrowserRouter>
    <Switch>
      <Route path="/" component={HelloWorld} />
    </Switch>
  </BrowserRouter>
), document.getElementById("root"))
