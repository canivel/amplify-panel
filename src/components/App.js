import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
export class App extends Component {
  state = {
    notes: [
      {
        id: 1,
        note: "My first note"
      }
    ]
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="col s12">
            <div className="row">
              <div className="input-field col s6">
                <input id="note" type="text" className="validate" />
                <label htmlFor="note">Note</label>
              </div>
            </div>
            <button className="btn blue white-text" type="submit">
              Create Note
            </button>
          </form>
        </div>
        <div className="row">
          <ul className="collection with-header">
            <li className="collection-header">
              <h4>Notes List</h4>
            </li>
            {this.state.notes.map(item => (
              <li className="collection-item" key={item.id}>
                <div>
                  {item.note}
                  <a href="#!" className="secondary-content">
                    <i className="material-icons">delete</i>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default withAuthenticator(App, { includeGreetings: true });
