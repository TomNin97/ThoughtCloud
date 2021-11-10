import React from 'react';
import { ClassListPage } from '../classlist_page/classlist_page';
import { NotesPage } from '../notes_page/notes_page';
import { Header, CalenderComponent, MainPageButtons } from '../shared-components/shared-components';
import { CalenderPage } from './calender-page';


//enums for identifying pages

const Pages = {
    ClassListPage: "Class List",
    NotesPage: "Notes Page",
    CalenderPage: "Calender Page"
}

export class MainClassPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            className: props.mainTitle,
            classId: props.classId,
            currentPage : Pages.ClassListPage
        }
    }

    getCurrentPage(pageEnum) {
        switch (pageEnum) {
            case Pages.NotesPage :
                return <NotesPage/>;
            break;
            case Pages.CalenderPage : 
                return <CalenderPage/>;
            break;
            case Pages.ClassListPage :
                return <ClassListPage/>;
            break;
            default :
            return "";
        }
    }

    render() {
       return (
       <div className= "page-wrapper">
           <Header title= {this.state.currentPage}/>
           <div className= "sub-page-wrapper">
                {this.getCurrentPage(this.state.currentPage)}
           </div>
       </div>
       );
    }
}