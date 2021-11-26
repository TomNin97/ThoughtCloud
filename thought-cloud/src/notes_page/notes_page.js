import React from 'react';
import { Header, CalenderComponent, CustomButton, SearchBar } from '../shared-components/shared-components';
import ImageRequests from '../backend-request/image-requests/image-request'
import { Course } from '../backend-request/course-request';
import "../notes_page/notes-page.css";
import { ImageCarousel } from './carousel_page';





function ShowModal(props) {

    const closeModal = () => {
        console.log("closing modal", props.note.postID);
        const modal = document.getElementById(`image-modal-wrapper${props.note.postID}`);
        modal.hidden = true;
        console.log(modal);

    }
    return (
        <div id={`image-modal-wrapper${props.note.postID}`} className="image-view-modal" hidden >
            <div className = "dialog-wrapper">
                
                <div className="mod-wrapper">

                   <span> <h1>Post by {props.note.posterID}</h1></span>
                    <img src={props.note.contentLink} />
                    <button onClick={closeModal}>Close</button>
                </div>
               
            </div>

        </div>
    )
}

function NoteItem(props) {

    return (
        <div>
            <ShowModal key={props.note} note={props.note} />

            <div onClick={() => {
                document.getElementById(`image-modal-wrapper${props.note.postID}`).hidden = false;
            }} className="note-item-wrapper" style={{ margin: "5px 5px 0px 5px" }}>
                <img src={props.note.contentLink} />
                <h1>{props.text}</h1>


            </div>
        </div>
    );
}

function generate_table() {
    // get the reference for the body
    var body = document.getElementsByTagName("body")[0];

    // creates a <table> element and a <tbody> element
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");

    // creating all cells
    for (var i = 0; i < 2; i++) {
        // creates a table row
        var row = document.createElement("tr");

        for (var j = 0; j < 2; j++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
            var cell = document.createElement("td");
            var cellText = document.createTextNode("cell in row " + i + ", column " + j);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }

        // add the row to the end of the table body
        tblBody.appendChild(row);
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tbl);
    // sets the border attribute of tbl to 2;
    tbl.setAttribute("border", "2");
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


    uploadNote = () => {

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
            this.imageRequests.uploadFile(file.name, fileContent).then(e=> {
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


    render() {

        //another option for creating notes. We can use css to wrap  thus making it more dynamic when the screen sizes change
        return (
            <div className="notes-page-wrapper" style={{ display: "flex", flexWrap: "true", width: "100vw" }}>
                <div className="upload-button">
                    <input type="file" id="grabbed-file" accept="image/png, image/jpeg," />

                    <button onClick={this.uploadNote}>
                        Upload New Note
                    </button>
                </div>
                <div id="notes-thumbnails">
                    {this.state.notes.map(e => <NoteItem note={e} />)}
                </div>

                {/* {<ImageCarousel notes = {this.state.notes}/>} */}
            </div>
        );

        return (
            <div className="page-wrapper">
                <Header title="Notes" />
                <SearchBar title="Notes" />
                <CustomButton title="Add" />
                <CustomButton title="Modify" />
                <CustomButton title="Delete" />
                <table>
                    <tr>{this.VALID_NOTES_KEYS.map(e => (<th>{e}</th>))}</tr>
                </table>
            </div>
        );



    }
}

