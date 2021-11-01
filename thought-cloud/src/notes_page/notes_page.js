import React from 'react';
import { Header, CalenderComponent, MainPageButtons } from '../shared-components/shared-components';


//enums for identifying pages

export class NotesPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
       return (
       <div className= "page-wrapper">
           <Header title= "Notes"/>
       </div>
       );
    }
}