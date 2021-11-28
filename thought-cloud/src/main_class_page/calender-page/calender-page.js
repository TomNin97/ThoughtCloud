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
        
        this.getEvents(this.state.course);
        
    }
    getEvents = (course) =>{
        this.state.courseRequests.getEvents(course).then(e=>{
            this.setState({"events" :e });
        })


   
    }


    render() {
        return (

            <div className="page-wrapper">

                <AddEventModal  reloadEvents = {this.getEvents} courseRequests={this.state.courseRequests} course={this.state.course} />
                <div className="subtitle-section">
                    <h2>Calender</h2>
                    <CustomButton title="Add Event"  onClick = {
                         function onDateClick() {
                            console.log("Opening modal");
                            const modal =  document.getElementById("add-event-modal");
                            
                           modal.hidden = false;
                        }
                    }/>
                </div>
                <div className="calender-wrapper">
                    <CalenderComponent  events = {this.state.events}/>
                </div>
            </div>
        );
    }
}