import React from 'react';
import { Header, CalenderComponent, CustomButton, SearchBar } from '../shared-components/shared-components';
import ImageRequests from '../backend-request/image-requests/image-request'
import { Course } from '../backend-request/course-request';
import "../notes_page/notes-page.css";
import { ImageCarousel } from './carousel_page';



function AddNoteModal(props) {

    const closeModal = () => {
        console.log("closing modal");
        const modal = document.getElementById("add-note-modal");
        modal.hidden = true;
        console.log(modal);

    }

    const uploadNote = () => {

        const fileReader = new FileReader();
        const element = document.getElementById("grabbed-file");
        const file = element.files[0];
        if (file == null) {
            alert("Select a file");
            return;
        }

        fileReader.readAsArrayBuffer(file);
        var fileContent;
        fileReader.onloadend = () => {
            fileContent = fileReader.result;
            this.imageRequests.uploadFile(file.name, fileContent).then(e => {
                this.imageRequests.getCourseNotes().then(data => {
                    if (data != null) {
                        console.table(data);
                        this.setState({ notes: data });
                    }
                })
            });
            console.log('DONE', fileReader.result);

            //pass to firebase storage
        };

    }

    return (
        <div id="add-note-modal" hidden >
            <div className="note-dialog-wrapper">

                <div className="note-mod-wrapper">

                    <div> <h1>Add a New Note</h1>
                    </div>

                    <div className="note-form">
                        <label>Note Title</label>
                        <input name="titel" type="text" />
                        <label>Description</label>
                        <textarea></textarea>
                        <label>Tags</label>
                        <input name="tags" type="text" />

                        <div className="upload-button">
                            <input type="file" id="grabbed-file" accept="image/png, image/jpeg, application/pdf" />

                            <button onClick={uploadNote}>
                                Upload New Note
                            </button>
                        </div>
                    </div>


                    <button onClick={closeModal}>Close</button>
                </div>

            </div>

        </div>
    );
}

function ShowModal(props) {

    const closeModal = () => {
        console.log("closing modal", props.note.postID);
        const modal = document.getElementById(`image-modal-wrapper${props.note.postID}`);
        modal.hidden = true;
        console.log(modal);

    }
    return (
        <div id={`image-modal-wrapper${props.note.postID}`} className="image-view-modal" hidden >
            <div className="dialog-wrapper">

                <div className="mod-wrapper">

                    <div> <h1>{props.note.posterID}</h1>
                    </div>
                    {props.content}
                    <button onClick={closeModal}>Close</button>
                </div>

            </div>

        </div>
    )
}

function NoteItem(props) {

    return (
        <div>
            <ShowModal key={props.note} note={props.note} content={<img src={props.note.contentLink} />} />

            <div onClick={() => {
                document.getElementById(`image-modal-wrapper${props.note.postID}`).hidden = false;
            }} className="note-item-wrapper" style={{ margin: "5px 5px 0px 5px" }}>
                <img src={props.note.contentLink} />
                <h1>{props.text}</h1>
            </div>
        </div>
    );
}


export class NotesPage extends React.Component {


    constructor(props) {
        super(props);

        //temp notes
        this.state = {
            notes: [],
            course: props.course
        }
        this.imageRequests = new ImageRequests(props.course);

        this.imageRequests.getCourseNotes().then(data => {
            if (data != null) {
                console.table(data);
                this.setState({ notes: data });
            }
        })
    };


    render() {

        //another option for creating notes. We can use css to wrap  thus making it more dynamic when the screen sizes change
        return (
            <div className="notes-page-wrapper" style={{ display: "flex", flexWrap: "true", width: "100vw" }}>

                <AddNoteModal />
               <button id ="add-note-button" onClick = {
                   ()=> {
                    const modal = document.getElementById("add-note-modal") ;
                    modal.hidden = !modal.hidden;
                   }
               }>+</button>
                <div id="notes-thumbnails">
                    {this.state.notes.length != 0 ? this.state.notes.map(e => <NoteItem note={e} />) : "No Notes Yet.."}
                </div>

                {/* {<ImageCarousel notes = {this.state.notes}/>} */}
            </div>
        );




    }
}

