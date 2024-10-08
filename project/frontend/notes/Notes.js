import App from "./App.js";

const root = document.getElementById("tag");

const app = new App(root);





// const view = new NotesView(tag, {
//     NoteAdd(){
//         console.log("Add new Note");
//     },
//
//     NoteSelect(id){
//         console.log("note selected " + id);
//     },
//
//     NoteDelete(id){
//         console.log("note Deleted " + id);
//     },
//
//     NoteEdit(newTitle, newBody) {
//         console.log(newTitle);
//         console.log(newBody);
//     },
//
// });
//
// const notes = NotesAPI.getAllNotes();
//
// view.updateNoteList(NotesAPI.getAllNotes());
// view.updateActiveNote(notes[0]);