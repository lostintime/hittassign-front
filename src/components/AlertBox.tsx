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

export type ReviewAlertProps = {
  readonly title: string
  readonly message?: string
  readonly dismissText: string;
  readonly onDismiss?: () => void
}

export class AlertBox extends React.Component<ReviewAlertProps, never> {
  private dismiss(): void {
    if (this.props.onDismiss) {
      this.props.onDismiss()
    }
  }

  render(): React.ReactNode {
    return (
      <div className="alert-box">
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>
          <div className="modal fade show d-flex flex-column justify-content-center align-items-center" style={{ display: "block", zIndex: 1050 }}>
            <div className="modal-dialog p-2">
              <div className="modal-content">
                <div className="modal-header">{this.props.title}</div>
                {this.props.message ? (
                  <div className="modal-body">{this.props.message}</div>
                ) : null}
                <div className="modal-footer">
                    <button onClick={_ => this.dismiss()}>{this.props.dismissText}</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}
