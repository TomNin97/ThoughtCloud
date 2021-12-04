import React, { useState } from 'react';
import { Header, CalenderComponent, CustomButton, SearchBar, isTeacher } from '../shared-components/shared-components';
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
            imageRequests.uploadFile(file.name, fileContent, Date.now(0), noteTitle, noteTags).then(e => {
                props.setState();
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
                        <input name="title" value={noteTitle} required onChange={(val) => setTitle(val.target.value)} type="number" min={1} />
                        <label>Tags</label>
                        <input name="tags" value={noteTags} onChange={(val) => setTags(val.target.value)} type="text" placeholder="use commas to separate multiple tags" />
                        <input type="file" id="grabbed-file" required accept="image/png, image/jpeg, application/pdf" />
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

    const togglePersistNote = () => {

        return props.imageRequests.togglePersistence(!isPersistent, props.note.postID).then(
            e => {
                props.onUpdate();
                togglePersistence(e);
            }
        )
    }

    const deleteNote = ()=> {
            return props.imageRequests.deleteNote(props.note).then(
               e=>{ 
                   props.onUpdate();
                   closeModal();}
            )
    }


    const [isPersistent, togglePersistence] = useState(props.note.persistent)
    return (
        <div id={`image-modal-wrapper${props.note.postID}`} className="image-view-modal" hidden >
            <div className="dialog-wrapper">
                <div className="mod-wrapper">
                    <div className="image-modal-header">
                        <span className = "left-buttons-wrapper">
                            {isTeacher() ? 
                            <span>
                                Persisted
                                <input type="checkbox" id="save-image" onClick={togglePersistNote} checked={(isPersistent ?? true)} />
                            </span> : null}
                            <button id="download-image" onClick = {
                                ()=>{
                                    window.open(props.note.contentLink, '_blank').focus();
                                }
                            }>Download</button>
                            {isTeacher() ? <button onClick = {deleteNote} id="delete-image">Delete</button> : null}
                        </span>
                        <h1>{props.note.noteTitle}</h1> 
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
            <ShowModal onUpdate = {props.reloadPage}  key={props.note} imageRequests={props.imageRequests} course={props.course} note={props.note} content={<img src={props.note.contentLink}  />} />

            <div onClick={() => {
                document.getElementById(`image-modal-wrapper${props.note.postID}`).hidden = false;
            }} className="note-item-wrapper" style={{ margin: "5px 5px 0px 5px" }}>
                <img src={props.note.contentLink} />
                <h1>{"Week:" + (props.note.noteTitle != null ? props.note.noteTitle : "1")}</h1>
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
            course: props.course,
            searchValue : "",
            tags : {},
        }
        this.imageRequests = new ImageRequests(props.course);
        this.getNotes();
        
    };

    getNotes() {
        this.imageRequests.getCourseNotes().then(data => {
            if (data != null) {
                console.table(data);
                const tagsMap = {};
                for(var note of data) {
                    console.table("note is",note.noteTags);
                    const tags = note.noteTags.split(',');
                    for( const tag of tags) {
                        if(tagsMap[tag] == null) {
                            tagsMap[tag] = 1;
                        }
                        else {
                            tagsMap[tag]++;
                        }
                    }
                }
                
                console.log(tagsMap)
                this.setState({"tags" : tagsMap});
                this.setState({ "notes": data });
            }
        })
    }

    FilterItem(props) {
            return (
                <div style = {{"height" : "2vh", "width" : "1vw"}}>
                    {props.title}
                </div>
            )
    }

    filterSection =() =>{
       
        const tags = this.state.tags
        console.log("tsgs is ",tags);
        return (
            <span>
            
             {Object.keys(tags).map((tagPos)=>{
                 return <span>
                     
                    <this.FilterItem title =  {`${tags[tagPos]} (${tagPos})`} />
                     </span>
             })} 
            </span>
        )
    }


    render() {
        //another option for creating notes. We can use css to wrap  thus making it more dynamic when the screen sizes change
        return (
            
            <div className="notes-page-wrapper" style={{ display: "flex", flexWrap: "true", width: "100vw" }}>
                {this.filterSection()}
                <AddNoteModal imageRequests={this.imageRequests} setState={
                    
                    ()=> {
                       this.getNotes();
                    }
                   } />

               <span>
               <button id="add-note-button" onClick={
                    () => {
                        const modal = document.getElementById("add-note-modal");
                        modal.hidden = !modal.hidden;
                    }
                }>+</button>
                <div id="notes-thumbnails">
                    {this.state.notes.length != 0 ? this.state.notes.map(e => e.contentLink != "" ? <NoteItem imageRequests={this.imageRequests} course={this.state.course} reloadPage = {()=> {
                        this.getNotes();
                    }} note={e} /> : null) : "No Notes Yet.."}
                </div>
               </span>

                {/* {<ImageCarousel notes = {this.state.notes}/>} */}
            </div>
        );




    }
}

