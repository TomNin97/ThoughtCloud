import React from 'react';
import { CustomButton, Header, ClassButton } from '../shared-components/shared-components.js';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Course } from '../backend-request/course-request';
import CourseRequests from '../backend-request/course-request';
export class DashBoard extends React.Component {


    //temporary data for the available class:
    createdClasses = ["Database Management", "Parallel Processing", "Artifical Intelligence", "Database Management", "Parallel Processing", "Artifical Intelligence", "Database Management", "Parallel Processing", "Artifical Intelligence"];

    constructor(props) {
        super(props);
        this.state = {
            isTeacher: props.isTeacher,
            classes : [],
            courseRequest : new CourseRequests()
        }


        this.state.courseRequest.getUserCourses().then(
           
            value => {
                console.log("Data gotten from req is ",value )
                this.setState({"classes" : value});
                console.log("here",this.state.classes);
            }
        )


    }

    onClassButtonClicked(className = "No class", classId) {
        alert(" Simulating going to class " + className.toString() + "with id: " + classId)

        window.location = '/course-center';
    }

    getInputValueById(id) {
        return document.getElementById(id).value;
    }


    showNewCourseForm() {
        return <Popup trigger={<CustomButton title="Add New Class" position="center" />
        }>
            <div>
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
                    <input type="submit" onClick={
                        async () => {
                            alert("hi");
                            var isSuccess = await  this.state.courseRequest.addCourse(this.getInputValueById("departmentId"), 
                            this.getInputValueById("courseId"), 
                            this.getInputValueById("courseSection"), 
                            this.getInputValueById("courseName"), 
                            "myId","assId");


                            if (isSuccess) {
                                console.log("Successsssss");
                            }
                            else {
                                console.log("Failure")
                            }

                            alert(isSuccess);
                        }
                    } />
                
            </div>
        </Popup>
    }



    render() {
        return (
            <div>
                < Header title={!this.state.isTeacher ? "Teacher DashBoard" : "Student DashBoard"} />
                <div className="subsection-title">
                    {this.showNewCourseForm()}
                    <h2>Owned Classes</h2>
                </div>
                <div className="avaialble-class-list">
                    <ul>
                        {this.state.classes != null ? this.state.classes.map(classItem => <ClassButton title={classItem.courseName} onClick={() => this.onClassButtonClicked(classItem, 0) 
                        } />) : "No Classes yet"}
                    </ul>
                </div>
            </div>
        );
    }
}




