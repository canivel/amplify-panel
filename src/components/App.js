import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
export class App extends Component {
  render() {
    return (
      <div>
        <h1>App</h1>
      </div>
    );
  }
}

export default withAuthenticator(App);
