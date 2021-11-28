import React, { useState } from 'react';
import { Header, CalenderComponent, CustomButton, SearchBar } from '../shared-components/shared-components';
import ImageRequests from '../backend-request/image-requests/image-request'
import { Course } from '../backend-request/course-request';
import "../notes_page/notes-page.css";
import { ImageCarousel } from './carousel_page';



function AddNoteModal(props) {
    const imageRequests = props.imageRequests;
    const closeModal = () => {
        console.log("closing modal");
        const modal = document.getElementById("add-note-modal");
        modal.hidden = true;
        console.log(modal);

    }

    const [noteTitle, setTitle] = useState("");
    const [noteTags, setTags] = useState();

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
            imageRequests.uploadFile(file.name, fileContent,Date.now(0), noteTitle, noteTags ).then(e => {
                imageRequests.getCourseNotes().then(data => {
                    if (data != null) {
                        console.table(data);
                        props.setState({ "notes": data });
                    }
                })
            });
            console.log('DONE', fileReader.result);
        };
    }
    return (
        <div id="add-note-modal" hidden >
            <div className="note-dialog-wrapper">

                <div className="note-mod-wrapper">

                    <div> <h1>Add a New Note</h1>
                    </div>

                    <div className="note-form">
                        <label>Week Taken</label>
                        <input name="title"  value = {noteTitle} required onChange = {(val)=> setTitle(val.target.value)} type="number" min = {1} />
                        <label>Tags</label>
                        <input name="tags" value = {noteTags} onChange = {(val)=> setTags(val.target.value)} type="text" placeholder= "use commas to separate multiple tags" />
                        <input type="file" id="grabbed-file"  required accept="image/png, image/jpeg, application/pdf" />
                        <div className="upload-buttons">
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
                <h1>{"Week:" + (props.note.noteTitle!= null ? props.note.noteTitle : "1")}</h1>
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

                <AddNoteModal  imageRequests = {this.imageRequests} setState = {this.setState}/>
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

