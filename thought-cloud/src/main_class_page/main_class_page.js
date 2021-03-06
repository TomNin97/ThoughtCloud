import React from 'react';
import { ClassListPage } from '../classlist_page/classlist_page';
import { NotesPage } from '../notes_page/notes_page';
import { Header, CalenderComponent, MainPageButtons } from '../shared-components/shared-components';
import { CalenderPage } from './calender-page/calender-page';
import "../main_class_page/main-class-page.css";
import { storage } from 'firebase-admin';

//enums for identifying pages

function SubPageButton(props) {
    return (
        <div className = "navigation-button">
            <button onClick = {props.onTap}>{props.title}</button>
        </div>
    )
}
const Pages = {
    ClassListPage: "Class List",
    NotesPage: "Notes Page",
    CalenderPage: "Calender Page"
}

export class MainClassPage extends React.Component {

    constructor(props) {
        super(props);
        console.log("Appstate in course content :");
        console.table(props.appState.currentCourse);
        this.state = {
            className: props.mainTitle,
            classId: props.classId,
            currentPage: Pages.NotesPage,
            appState : props.appState
        }
    }

    onSubButtonClick = (buttonClick)=> {
       this.setState({ "currentPage" : buttonClick})
    }

    getCurrentPage(pageEnum) {
        switch (pageEnum) {
            case Pages.NotesPage:
                return <NotesPage  course = {this.state.appState.currentCourse}/>;
            case Pages.CalenderPage:
                return <CalenderPage course = {this.state.appState.currentCourse} />;
            case Pages.ClassListPage:
                return <ClassListPage course = {this.state.appState.currentCourse}/>;
            default:
                return <NotesPage />;
        }
    }

    render() {
        /* prevent access to this page if not logged in */
        if(localStorage.getItem('authenticated') != 'true')
            return (
                <div>
                 <body>You must be logged in to view this page</body>
                </div>
            ) 
        else
        return (
            <div className="page-wrapper">
                <Header title={this.state.currentPage} />
                <div className="course-subheader" style = {{display : "flex", justifyContent : "center"}}>
                    <SubPageButton title="Notes" onTap = {()=> this.onSubButtonClick(Pages.NotesPage)} propRoute='/course-center' />
                    <SubPageButton title="Calender" onTap = {()=> this.onSubButtonClick(Pages.CalenderPage)} propRoute='/course-center' />
                    <SubPageButton title="Class List"  onTap = {()=> this.onSubButtonClick(Pages.ClassListPage)}propRoute="/course-center" />
                </div>
                <div className="sub-page-wrapper">
                    {this.getCurrentPage(this.state.currentPage)}
                </div>
            </div>
        );
    }
}