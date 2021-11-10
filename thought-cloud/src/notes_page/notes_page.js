import React from 'react';
import { Header, CalenderComponent, CustomButton, SearchBar } from '../shared-components/shared-components';



function NoteItem(props) {

    return (
        <div className = "note-item-wrapper" style= {{margin : "5px 5px 0px 5px"}}>
            <img src = {props.url}/>
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
      var cellText = document.createTextNode("cell in row "+i+", column "+j);
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
        this.state= {
            notes : [1,2,3,4,5,6,7,8,9,10]
        }

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



    render() {

        //another option for creating notes. We can use css to wrap  thus making it more dynamic when the screen sizes change
        return (
            <div className = "notes-page-wrapper" style = {{display : "flex", flexWrap : "true", width : "100vw"}}>
                {this.state.notes.map(e=> <NoteItem url = "https://picsum.photos/200/300" text= {e}/>)}
            </div>
        );

       return (
       <div className= "page-wrapper">
           <Header title= "Notes"/>
           <SearchBar title = "Notes"/>
           <CustomButton title = "Add"/>
           <CustomButton title = "Modify"/>
           <CustomButton title = "Delete"/>
           <table>
           <tr>{this.VALID_NOTES_KEYS.map(e => (<th>{e}</th>))}</tr>
           </table>
       </div>
       );

    }
}