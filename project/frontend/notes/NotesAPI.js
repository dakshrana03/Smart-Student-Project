export default class NotesAPI{
    static getAllNotes(){
        const notes = JSON.parse(localStorage.getItem("dataList") || "[]");
        // sort the notes list to appear from the latest note added.
        return notes.sort((a,b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNotes(savedNotes){
        const notes = NotesAPI.getAllNotes();
        // checks if the selected or updated note id equals a saved note id
        const existing = notes.find(note => note.id === savedNotes.id);

        // statement to edit/update note
        if(existing){
            existing.title = savedNotes.title;
            existing.body = savedNotes.body;
            existing.updated = new Date().toISOString();
        }
        else {
            //savedNotes.id helps to generate a random id
            savedNotes.id = Math.floor(Math.random() * 1000000);
            savedNotes.title = null;
            savedNotes.body = null;
            // gets the date when the note was updated.
            savedNotes.updated = new Date().toISOString();
            //pushes the saved notes
            notes.push(savedNotes);
        }

        localStorage.setItem("dataList", JSON.stringify(notes));
    }

    static deleteNote(id){
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(notes.filter(note => note.id !== id));

        localStorage.setItem("dataList", JSON.stringify(newNotes));
    }

}