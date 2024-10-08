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
        const inputFeilds = [InpTitle,InpBody];
            inputFeilds.forEach(inputField => {
                inputField.addEventListener("blur", () => {
                    const updatedTitle = InpTitle.value.trim();
                    const updatedBody = InpBody.value.trim();

                    this.NoteEdit(updatedTitle, updatedBody);

                })
        })
    }
}