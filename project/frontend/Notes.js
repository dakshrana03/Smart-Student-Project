import NotesView from "./NotesView.js"

const tag = document.getElementById("tag");
const view = new NotesView(tag, {
    NoteAdd(){
        console.log("Add new Note");
    },

    NoteEdit(newTitle, newBody) {
        console.log(newTitle);
        console.log(newBody);
    },

});