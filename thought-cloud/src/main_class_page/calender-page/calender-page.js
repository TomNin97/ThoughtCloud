import React from 'react';
import CourseRequests from '../../backend-request/course-request';
import { AddEventModal, CalenderComponent, CustomButton } from '../../shared-components/shared-components';
import "../calender-page/calender-page.css";

export class CalenderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: props.course,
            courseRequests : new CourseRequests(),
            events : []
        }

        this.state.courseRequests.getEvents(props.course).then(e=>{
            this.setState({"events" :e });
        })
    }


    render() {
        return (

            <div className="page-wrapper">

                <AddEventModal courseRequests={this.state.courseRequests} course={this.state.course} />
                <div className="subtitle-section">
                    <h2>Calender</h2>
                    <CustomButton title="Add Event" />
                </div>
                <div className="calender-wrapper">
                    <CalenderComponent  events = {this.state.events}/>
                </div>
            </div>
        );
    }
}