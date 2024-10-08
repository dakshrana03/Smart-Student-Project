export default class NotesView{
    // constructor to directly grab the items passed in
    constructor(root, { NoteSelect, NoteAdd, NoteEdit, NoteDelete } = {}){
        this.root = root;
        this.NoteSelect = NoteSelect;
        this.NoteAdd = NoteAdd;
        this.NoteEdit = NoteEdit;
        this.NoteDelete = NoteDelete;
        this.root.innerHTML = `
            <div class="sidebar">
                <button class="add_Notes" type="button">Add note</button>
                <div class="noteList"></div>
            </div>
            <div class="preview">
                <input class="title" type="text" placeholder="New Note...">
                <textarea class="noteBody">Take Note...</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".add_Notes");
        const InpTitle = this.root.querySelector(".title");
        const InpBody = this.root.querySelector(".noteBody");

        //event listener for when the user clicks on the add note button
        btnAddNote.addEventListener("click", () => {
            this.NoteAdd();
        })

        //event listener for when the user tries to update/edit the title or body of note
        const inputFields = [InpTitle,InpBody];
            inputFields.forEach(inputField => {
                inputField.addEventListener("blur", () => {
                    const updatedTitle = InpTitle.value.trim();
                    const updatedBody = InpBody.value.trim();

                    this.NoteEdit(updatedTitle, updatedBody);

                });
        });
            

    //         TODO: HIDE THE NOTE PREVIEW BY DEFAULT
        this.updateNotePreviewVisibility(false);

    }

    _createListItemHtml(id, title, body, updated){
        let strLen = body.length;
        let maxBodyLength = strLen < 60 ? strLen : 60;
        const truncatedBody = body.substring(0, maxBodyLength);

        //to keep track of the note id for the notes sidebar
        return `

            <div class="existingNotes" data-note-id="${id}">
                <div class="noteTitle">${title}</div>
                <div class="noteContent">
                    ${truncatedBody}
<!--                    if the length of the text to be selected for the sidebar is greater than 60 add elipses if not leave it. -->
                    ${body && body.length > maxBodyLength ? "...." : ""}
                </div>
<!--                updates the time when the note was edited/updated -->
                <div class="noteUpdated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short"})}
                </div>
            </div>
        `;
    }

    updateNoteList(notes){
        const noteListContainer = this.root.querySelector(".noteList");

        // Empty List
        noteListContainer.innerHTML = "";

        for (let note of notes){
            if (note.body === null || note.title === null) {
                continue;
            }
            const html = this._createListItemHtml(note.id, note.title, note.body, new Date(note.updated));

            noteListContainer.insertAdjacentHTML("beforeend", html);
        }

        // add submit and delete event for each note
        noteListContainer.querySelectorAll(".noteList").forEach(noteListItem => {
            console.log(noteListItem);
            noteListItem.addEventListener("click", () => {
                console.log("Ive been clicked");
                this.NoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dbclick", () =>{
                const Delete = confirm("Are you sure you want to delete this note?");

                if(Delete){
                    this.NoteDelete(noteListItem.dataset.noteId);
                }
            })

        })
    }

    updateActiveNote(note){
        this.root.querySelector(".noteList").value = note.title;
        this.root.querySelector(".noteBody").value = note.body;

        this.root.querySelectorAll(".existingNotes").forEach(noteListItem => {
            noteListItem.classList.remove("selectedNotes");
        });

        // console.log(this.root.querySelector(`.existingNotes[data-note-id="${note.id}"]`));
        const Selectednote = this.root.querySelector(`.existingNotes[data-note-id="${note.id}"]`);
        if(Selectednote){
            Selectednote.classList.add("selectedNotes");

        }
        else{
            console.error(`NOTE with ID ${note.id} not found.`);
        }

    }

    updateNotePreviewVisibility(visible){
        this.root.querySelector(".preview").style.visibility = visible ? "visible" : "hidden";
    }

}