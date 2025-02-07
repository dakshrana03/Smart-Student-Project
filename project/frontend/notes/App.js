import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";

export default class App{
    constructor(root){
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());

        this._refreshNotes();
    }

    _refreshNotes(){
        const notes = NotesAPI.getAllNotes();

        this._setNotes(notes);

        if(notes.length > 0){
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes){
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _handlers(){
        return{
            NoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id === noteId);
                this._setActiveNote(selectedNote);
            },
            NoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take Note.."
                };
                NotesAPI.saveNotes(newNote);
                this._refreshNotes();
            },
            NoteEdit: (title, body)=> {
                NotesAPI.saveNotes({
                    id: this.activeNote.id,
                    title,
                    body
                });
                this._refreshNotes();
            },
            NoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            }
        }
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }
}