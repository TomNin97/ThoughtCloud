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
            selectedValues: new Set(),
            tags : {"sdss" : 1, "fsfs": 2},
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
                    const tags = note.noteTags.replaceAll(" ", "").split(',');
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
                <div onClick = {()=>props.onTap()} style = {{height : "6vh", flexGrow : "2", backgroundColor : `${props.isSelected ?  "#d4e09ba2" :"grey" }`, border : `1px solid ${props.isSelected ? "black": "grey"}`, margin : "3px", justifyContent : "center"}}>
                    {props.title}
                </div>
            )
    }

    filterSection =() =>{
       
        const tags = this.state.tags
        console.log("tags is ",tags);
        return (
            <span style = {{display : "flex", flexDirection : "row", width : "100vw", margin : "10px 10px"}}>
            
             {Object.keys(tags).map((tagPos)=>{
                 return  <this.FilterItem  onTap = {()=> {
                    if(this.state.selectedValues.has(tagPos)) {
                        const updatedValues = this.state.selectedValues;
                        updatedValues.delete(tagPos)
                        console.log("selected val", updatedValues, " ", this.state.selectedValues);
                        this.setState({"selectedValues" : updatedValues});
                    }
                    else {
                        const updatedValues = this.state.selectedValues;
                        updatedValues.add(tagPos);
                        console.log("selected val", updatedValues, " ", this.state.selectedValues);
                        this.setState({"selectedValues" : updatedValues});
                    }
                 }}title =  {`${tagPos}(${tags[tagPos]})`} isSelected = {this.state.selectedValues.has(tagPos)}/>
             })} 
            </span>
        )
    }


    render() {
        //another option for creating notes. We can use css to wrap  thus making it more dynamic when the screen sizes change
        return (
            
            <div className="notes-page-wrapper" style={{ display: "flex", flexWrap: "true", width: "100vw" }}>
               
                <AddNoteModal imageRequests={this.imageRequests} setState={
                    
                    ()=> {
                       this.getNotes();
                    }
                   } />

               <span>
               {this.filterSection()}
               <button id="add-note-button" onClick={
                    () => {
                        const modal = document.getElementById("add-note-modal");
                        modal.hidden = !modal.hidden;
                    }
                }>+</button>
                <div id="notes-thumbnails">
                    {this.state.notes.length != 0 ? this.state.notes.filter(e=>{
                        if(this.state.selectedValues.size == 0) return true;
                        for( const value of this.state.selectedValues) {
                            if(e.noteTags.replaceAll(" ", "").search(value) != -1) return true;
                        }

                        return false;
                    }).map(e => e.contentLink != "" ? <NoteItem imageRequests={this.imageRequests} course={this.state.course} reloadPage = {()=> {
                        this.getNotes();
                    }} note={e} /> : null) : "No Notes Yet.."}
                </div>
               </span>

                {/* {<ImageCarousel notes = {this.state.notes}/>} */}
            </div>
        );




    }
}

