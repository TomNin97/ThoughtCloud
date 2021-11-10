import React from 'react';
import { ClassListPage } from '../classlist_page/classlist_page';
import { NotesPage } from '../notes_page/notes_page';
import { Header, CalenderComponent, MainPageButtons } from '../shared-components/shared-components';
import { CalenderPage } from './calender-page';


//enums for identifying pages

function SubPageButton(props) {
    return (
        <div>
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
        this.state = {
            className: props.mainTitle,
            classId: props.classId,
            currentPage: Pages.ClassListPage
        }
    }

    onSubButtonClick = (buttonClick)=> {
       this.setState({ "currentPage" : buttonClick})
    }

    getCurrentPage(pageEnum) {
        switch (pageEnum) {
            case Pages.NotesPage:
                return <NotesPage />;
                break;
            case Pages.CalenderPage:
                return <CalenderPage />;
                break;
            case Pages.ClassListPage:
                return <ClassListPage />;
                break;
            default:
                return "";
        }
    }

    render() {
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