import React from 'react';
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
            currentPage : Pages.CalenderPage
        }
    }

    getCurrentPage(pageEnum) {
        switch (pageEnum) {
            case Pages.NotesPage :
                return "";
            break;
            case Pages.CalenderPage : 
                return <CalenderPage/>;
            break;
            case Pages.ClassListPage :
                return "";
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