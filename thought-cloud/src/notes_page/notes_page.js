import React from 'react';
import { Header, CalenderComponent, CustomButton, SearchBar } from '../shared-components/shared-components';
import ImageRequests from '../backend-request/image-requests/image-request'
import { Course } from '../backend-request/course-request';
function NoteItem(props) {

    return (
        <div className="note-item-wrapper" style={{ margin: "5px 5px 0px 5px" }}>
            <img src={props.url} />
            <h1>{props.text}</h1>

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
            notes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
        this.imageRequests = new ImageRequests(new Course("sdf","dd","234","Something","dfd", "sfdf"));

        this.VALID_NOTES_KEYS = [
            "posterID",
            "uploadDT",
            "dateTaken",
            "format",
            "contentLink",
            "hidden",
            "hideStart",
            "hideEnd",
        ];
    };


    uploadNote = () => {

        const fileReader = new FileReader();
        const element = document.getElementById("grabbed-file");
        const file = element.files[0];
        if(file == null) {
            alert("Select a file");
            return;
        }

        fileReader.readAsArrayBuffer(file);
        var fileContent;
        fileReader.onloadend = () =>{
            fileContent = fileReader.result;
            this.imageRequests.uploadFile(file.name, fileContent);
            console.log('DONE', fileReader.result); 

            //pass to firebase storage
          };

    }


    render() {

        //another option for creating notes. We can use css to wrap  thus making it more dynamic when the screen sizes change
        return (
            <div className="notes-page-wrapper" style={{ display: "flex", flexWrap: "true", width: "100vw" }}>
                <div className="upload-button">
                    <input type="file" id="grabbed-file" accept = "image/png, image/jpeg"/>
                
                    <button onClick={this.uploadNote}>
                        Upload New Note
                    </button>
                </div>
                {this.state.notes.map(e => <NoteItem url="https://picsum.photos/200/300" text={e} />)}
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