import React, { useState } from 'react';
import { CustomButton, Header, ClassButton } from '../shared-components/shared-components.js';
import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import { Course } from '../backend-request/course-request';
import CourseRequests from '../backend-request/course-request';
import { AppState } from '../app_state.js';
import { Redirect } from 'react-router-dom';
import "../account_page/account_page.css"
export class DashBoard extends React.Component {


    //temporary data for the available class:
    createdClasses = ["Database Management", "Parallel Processing", "Artifical Intelligence", "Database Management", "Parallel Processing", "Artifical Intelligence", "Database Management", "Parallel Processing", "Artifical Intelligence"];

    constructor(props) {
        super(props);
        this.state = {
            isTeacher: props.isTeacher,
            classes: [],
            courseRequest: new CourseRequests(),
            appState: props.appState,
            updateAppState: props.onStateUpdate,
            redirect: false,
            showModal: false,
        }

        this.getCourses();

    }

    async getCourses() {
        await this.state.courseRequest.getUserCourses().then(
            value => {
                console.log("Data gotten from req is ", value)
                this.setState({ "classes": value });
                console.log("here", this.state.classes);
            }
        )
    }

    onClassButtonClicked(course, classId) {
        alert(" Simulating going to class " + course.toString() + "with id: " + classId)

        this.state.appState.course = course;
        this.setState({ redirect: true })
    }

    getInputValueById(id) {
        return document.getElementById(id).value;
    }


    showNewCourseForm() {

        return (
            <div>
                <CustomButton title="Add New Class" onClick={
                    () => this.setState({ "showModal": !this.state.showModal })} />
                <div className="modal-wrapper" hidden={!this.state.showModal}>
                   
                        <div className="new-class-modal" >

                            <h1>Add A New Course</h1>

                            <label>Department ID</label>
                            <input type="text" id="departmentId" />
                            <label>Course ID</label>
                            <input type="text" id="courseId" />
                            <label>Course Section</label>
                            <input type="text" id="courseSection" />
                            <label>Course Name</label>
                            <input type="text" id="courseName" />
                            <label>Assistant Email</label>
                            <input type="email" id="emailId" />
                            <div className= "buttons-wrapper">
                            <button  id = "submit" type="submit" onClick={
                                async () => {
                                    alert("hi");
                                    var isSuccess = await this.state.courseRequest.addCourse(this.getInputValueById("departmentId"),
                                        this.getInputValueById("courseId"),
                                        this.getInputValueById("courseSection"),
                                        this.getInputValueById("courseName"),
                                        "assId");
                                    if (isSuccess) {
                                       alert("Successfully Added!")

                                    }
                                    else {
                                        alert("Failed to Add Course")
                                    }
                                    this.getCourses();
                                }
                            } >Add</button>
                            <button onClick= {()=> this.setState({ "showModal": !this.state.showModal })}>Return </button>
                            </div>
                        </div>
                </div>
            </div>
        );
    }




    render() {

        if (this.state.redirect) {
            return (
                <Redirect to="/course-center" />
            )
        }
        return (
            <div>
                < Header title={"DashBoard"} />
                <div className="subsection-title">
                    {this.showNewCourseForm()}
                    <h2>Your Classes</h2>
                </div>
                <div className="divider">

                </div>
                <div className="available-class-list">

                    {this.state.classes.length != 0 ?
                        this.state.classes.map(classItem => <ClassButton title={classItem.courseName} onClick={() => this.onClassButtonClicked(classItem, 0)
                        } />) : "No Classes yet"}

                </div>
            </div>
        );
    }
}




