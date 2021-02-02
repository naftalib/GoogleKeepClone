class App{

constructor(){
	//all notes stored via empty array.
this.notes= JSON.parse(localStorage.getItem('notes')) || []
//values used to transmit note data across components
this.title =''
this.text = ''
this.id = ''
	//all referencees to the DOM pref=$, data=reg.
this.$form = document.querySelector('#form')
this.$noteTitle = document.querySelector('#note-Title')
this.$noteText = document.querySelector('#note-text')
this.$placeholder=document.querySelector('#placeholder')
this.$notes=document.querySelector('#notes')
this.$formButtons = document.querySelector('#form-Buttons')
this.$closeButton = document.querySelector('#form-close-button')
this.$modal = document.querySelector('.modal')
this.$modalTitle = document.querySelector('.modal-title')
this.$modalText = document.querySelector('.modal-text')
this.$modalCloseButton = document.querySelector('.modal-close-button')
this.$colorTooltip = document.querySelector('#color-tooltip')


//need to call the method in constructor so that it runs
//upon opnening
this.render()
this.addEventListeners()
}

//All eventListener methods.
addEventListeners(){
	//1) the click event (invokes callback func).
	document.body.addEventListener('click', event => {
		this.handleFormClick(event)
		this.selectNote(event)
		this.openModal(event)
		this.deleteNote(event)
		
	})
	//2) the submit event
	this.$form.addEventListener('submit', event =>{


		// prevents auto clear.
		event.preventDefault() 
		//grabs input value from note-title + assigns to var.
		const title = this.$noteTitle.value 
		//grabs input value from note-text + assigns to var.
		const text = this.$noteText.value
		//var checks if title/text.value = true
		const noteEntry = title || text
		//contitional calls method to add new note.
		if(noteEntry){

		this.addNewNote({title,text})
			//using obj' shorthand (title:title etc).
		}else{
			alert('What!?')
		}
	})

	//3) close form button.
	this.$closeButton.addEventListener('click', event => {
		event.stopPropagation();
		this.closeForm();
	})
 
	//4) close Modal button
	this.$modalCloseButton.addEventListener('click', event => {
		this.closeModal()
	})

	//5) open-tooltip
	document.body.addEventListener('mouseover', event => {
		this.openToolTip(event)
	})

	//6) close-tooltip

	document.body.addEventListener('mouseout', event => {
		this.closeToolTip(event)
	})

	//7) tool-tip controll

	this.$colorTooltip.addEventListener('mouseover', function(){
		this.style.display = 'flex'
	})
	this.$colorTooltip.addEventListener('mouseout', function(){
		this.style.display = 'none'
	})

	//8)change note color
	this.$colorTooltip.addEventListener('click', event => {
		const color = event.target.dataset.color
		if(color){
		this.editNoteColor(color)
		}
	})

}
	//callback func for click event.
handleFormClick(event){
	//.contains checks if the target is the form-returns boolean.
	//then assigns that to var.
	const isFormClicked = this.$form.contains(event.target)

	const title = this.$noteTitle.value 
	const text = this.$noteText.value
	const noteEntry = title || text

	//if form was clicked.
	if(isFormClicked) {
		this.openForm()
	}else if(noteEntry) {
		this.addNewNote({ title, text })
	}else{
		this.closeForm()
	}
}
	//These methods controll the css styls 
	//that generate the opening appearance.
openForm(){
	this.$form.classList.add('form-open')
	this.$noteTitle.style.display = 'block'
	this.$formButtons.style.display = 'block'
	}
closeForm(){
	this.$form.classList.remove('form-open')
	this.$noteTitle.style.display = 'none'
	this.$formButtons.style.display = 'none'
	//explicit mutation of input values to clear form. 
	this.$noteTitle.value = ''
	this.$noteText.value = ''
}

//Generating the ability to edit notes in modal.
//	open.
openModal(event){
	//'target.closest' gets the thing closest to where clicked.
	// the ref ('.note') is the style given on the html below.
if (event.target.matches('.toolbar-delete')) return;  

	if(event.target.closest('.note')){
		this.$modal.classList.toggle('open-modal')
		this.$modalTitle.value = this.title
		this.$modalText.value = this.text
	}
}
//	close
closeModal(event){
	this.editNote()
	this.$modal.classList.toggle('open-modal')
}
 //Controlls the palet pop-up to change note color
openToolTip(event){
	if (!event.target.matches('.toolbar-color')) return
		this.id = event.target.dataset.id
		const posit = event.target.getBoundingClientRect()
		const horizontal = posit.left + window.scrollX
		const vertical = posit.top + window.scrollY
		this.$colorTooltip.style.transform =`translate(${horizontal}px, 
		${vertical}px )`
		this.$colorTooltip.style.display ='flex'
}
closeToolTip(event){

	this.$colorTooltip.style.display = 'none'
}
editNoteColor(color){
	this.notes = this.notes.map( note => 
		note.id === Number(this.id) ? {...note,color} : note
		)
	this.render()
}

//	Here = getting the html element-note data
selectNote(event){
	const $selectedNote = event.target.closest('.note')
	if(!$selectedNote) return
	const [$noteTitle,$noteText] = $selectedNote.children
	this.title = $noteTitle.innerText
	this.text = $noteText.innerText
	this.id = $selectedNote.dataset.id
}

	//method that adds the notes to notes-array as obj'.
addNewNote({title, text}){
	//all notes added as obj that updates the array.
	const newNote = {
	title, //see notes *.
	text,	 //see notes *.
	color:'white',
	id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1 // see notes **
}//update the notes array with spread opr.
	this.notes = [...this.notes, newNote]
	this.render()
	this.closeForm()
}

//Here using the updated data via the modal to update notes array.
editNote(){
	const title = this.$modalTitle.value
	const text = this.$modalText.value
	this.notes = this.notes.map( note => 
		note.id === Number(this.id) ? {...note,title,text} : note
		)
	this.render()
}
//delete by removing item from array.
deleteNote(event){

	const id = event.target.dataset.id
	this.notes = this.notes.filter(note => note.id !==Number(id))
	this.render()
}
//local storage
saveNotes(){
	localStorage.setItem('notes',JSON.stringify(this.notes))
}
//universal method
render(){
	this.saveNotes()
	this.displayNotes()
}

//display notes method.
displayNotes(){

	//var, determines if there are notes.
	const hasNotes = this.notes.length > 0

	//conditional the placeholder image based on var.
	this.$placeholder.style.display = hasNotes ? 'none' : 'flex'

	//display the notes:
	//iterating over notes array (.map) to get note data.
	//returning data into temp-lits that display the html elements directly.
	//this return = displayed via innerHTML of note <div> in html doc.
	//the(.join) is to avoid the automatic comma when stringing.

	this.$notes.innerHTML = this.notes.map(note=>`
		<div style="background: ${note.color};" class="note" data-id='${note.id}'>
          <div class="${note.title && 'note-title'}">${note.title}</div>
          <div class="note-text">${note.text}</div>
          <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" data-id='${note.id}' src="https://icon.now.sh/palette">
              <img class="toolbar-delete" data-id='${note.id}' src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
		`).join('')

	console.log(this.notes)
}
}
new App()

/* Notes. 

*. note.title/text i.e: "note" = the parameter passed in
here to this method -.-the varName (title/text) above(submit event) where the input
values were assigned to.

**. Logic used here: We want to set the id of each note by gauging the
id of the last note. Therefore, check (via ternary) the length of
notes array, if greater than 0, get the last id entry (length - 1) and
increment it by 1. If the array is not greater than 0 just set it to
1. */