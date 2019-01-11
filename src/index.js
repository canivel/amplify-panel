import "materialize-css/dist/css/materialize.min.css";
import "materialize-css/dist/js/materialize";
import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import awsexports from "./aws-exports";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

Amplify.configure(awsexports);

ReactDOM.render(<App />, document.querySelector("#root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
