import React from 'react';


function NoteItem(props) {

    return (
        <div className = "note-item-wrapper" style= {{margin : "5px 5px 0px 5px"}}>
            <img src = {props.url}/>
            <h1>{props.text}</h1>
           
        </div>
    );
}

export class NotesPage extends React.Component {


    constructor(props) {
        super(props);
//temp notes
        this.state= {
            notes : [1,2,3,4,5,6,7,8,9,10]
        }
    }


    render() {
        return (
            <div className = "notes-page-wrapper" style = {{display : "flex", flexWrap : "true", width : "100vw"}}>
                {this.state.notes.map(e=> <NoteItem url = "https://picsum.photos/200/300" text= {e}/>)}
            </div>
        );
    }
}