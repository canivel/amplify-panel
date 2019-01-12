import React, { Component } from "react";
import { withAuthenticator } from "aws-amplify-react";
import { API, graphqlOperation } from "aws-amplify";
import { createNote, deleteNote, updateNote } from "../graphql/mutations";
import { listNotes } from "../graphql/queries";
import {
  onCreateNote,
  onDeleteNote,
  onUpdateNote
} from "../graphql/subscriptions";

export class App extends Component {
  state = {
    id: "",
    note: "",
    notes: []
  };

  async componentDidMount() {
    this.getNotes();
    //will listen to the notes mutations and return the new notes state
    this.createNoteListener = API.graphql(
      graphqlOperation(onCreateNote)
    ).subscribe({
      next: noteData => {
        const newNote = noteData.value.data.onCreateNote;
        const prevNotes = this.state.notes.filter(
          note => note.id !== newNote.id
        );
        const updatedNotes = [...prevNotes, newNote];
        this.setState({ notes: updatedNotes });
      }
    });

    this.deleteNoteListener = API.graphql(
      graphqlOperation(onDeleteNote)
    ).subscribe({
      next: noteData => {
        const deletedNote = noteData.value.data.onDeleteNote;
        const updatedNotes = this.state.notes.filter(
          note => note.id !== deletedNote.id
        );
        this.setState({ notes: updatedNotes });
      }
    });

    this.updateNoteListener = API.graphql(
      graphqlOperation(onUpdateNote)
    ).subscribe({
      next: noteData => {
        const { notes } = this.state;
        const updatedNote = noteData.value.data.onUpdateNote;
        const index = notes.findIndex(note => note.id === updatedNote.id);
        const updatedNotes = [
          ...notes.slice(0, index),
          updatedNote,
          ...notes.slice(index + 1)
        ];
        this.setState({ notes: updatedNotes, note: "", id: "" });
      }
    });
  }

  componentWillUnmount() {
    this.createNoteListener.unsubscribe();
    this.deleteNoteListener.unsubscribe();
    this.updateNoteListener.unsubscribe();
  }

  getNotes = async () => {
    const result = await API.graphql(graphqlOperation(listNotes));
    this.setState({ notes: result.data.listNotes.items });
  };

  handleChangeNote = event => {
    return this.setState({ note: event.target.value });
  };

  hasExistingNote = () => {
    const { notes, id } = this.state;
    if (id) {
      const isNote = notes.findIndex(note => note.id === id) > -1;
      return isNote;
    }
    return false;
  };

  handleAddNote = async event => {
    event.preventDefault();
    const { note } = this.state;
    if (this.hasExistingNote()) {
      this.handleUpdatenote();
      console.log("note updated");
    } else {
      const input = {
        note
      };

      //subscription at the mount will handle the update of the state
      await API.graphql(graphqlOperation(createNote, { input }));
      // const newNote = result.data.createNote;
      // const updateNotes = [newNote, ...notes];
      this.setState({ note: "" });
    }
  };

  handleUpdatenote = async () => {
    const { note, id } = this.state;
    const input = {
      id,
      note
    };
    await API.graphql(graphqlOperation(updateNote, { input }));
    // const updatedNote = result.data.updateNote;
    // const index = notes.findIndex(note => note.id === updatedNote.id);
    // const updatedNotes = [
    //   ...notes.slice(0, index),
    //   updatedNote,
    //   ...notes.slice(index + 1)
    // ];
    // this.setState({ notes: updatedNotes, note: "", id: "" });
  };

  handleDeleteNote = async noteId => {
    // const { notes } = this.state;
    const input = {
      id: noteId
    };
    await API.graphql(graphqlOperation(deleteNote, { input }));
    // const deletedNoteId = result.data.deleteNote.id;
    // const updateNotes = notes.filter(note => note.id !== deletedNoteId);
    // this.setState({ notes: updateNotes });
  };

  handleEditNote = ({ note, id }) => {
    this.setState({ note, id });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <form className="col s12" onSubmit={this.handleAddNote}>
            <div className="row">
              <div className="input-field col s6">
                <input
                  id="note"
                  type="text"
                  className="validate"
                  onChange={this.handleChangeNote}
                  value={this.state.note}
                />
                <label htmlFor="note">Note</label>
              </div>
            </div>
            <button className="btn blue white-text" type="submit">
              {this.state.id ? "Update Note" : "Add Note"}
            </button>
          </form>
        </div>
        <div className="row">
          <ul className="collection with-header">
            <li className="collection-header">
              <h4>Notes List</h4>
            </li>
            {this.state.notes.map(item => (
              <li
                className="collection-item"
                key={item.id}
                onClick={() => this.handleEditNote(item)}
              >
                <div>
                  {item.note}

                  <a
                    href="#!"
                    onClick={() => this.handleDeleteNote(item.id)}
                    className="secondary-content"
                  >
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
