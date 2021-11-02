import axios from 'axios';
import { SessionItems } from './session-items';

///todo: duplicate code;
const jsonHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
const baseUrl = "http://localhost:5000";

/* Create new user if valid request */
export var Course = {
    departmentID: null,
    courseID: null,
    courseSection: null,
    courseName: null,
    professorID: null,
    assistantID: null,
    getCourseMap: function () {
        return {
            "courseID": this.courseID,
            "departmentID": this.departmentID,
            "courseID": this.courseID,
            "courseSection": this.courseSection,
            "courseName": this.courseName,
            "professorID": this.professorID,
            "assistantID": this.assistantID,
        }
    },
    setCourse:  function(departmentID, courseID, courseSection,courseName, professorId, assistantId) {
        this.departmentID = departmentID;
        this.courseID = courseID;
        this.courseSection = courseSection;
        this.courseName = courseName;
        this.professorID =  professorId;
        this.assistantID = assistantId;
        }
};

export default class CourseRequests {
    async addCourse(departmentID, courseId, courseSection, courseName, professorID, assistantID) {
        var newCourse = Course;

        newCourse.setCourse(departmentID,courseId, courseSection,courseName, professorID, assistantID);
        console.table(newCourse.getCourseMap());

        const CourseJson = newCourse.getCourseMap();

        await axios({
            method : 'post',
            headers : jsonHeader,
            url : baseUrl + '/courses',
            data : JSON.stringify(CourseJson)
        }).then(data=> {
            console.log("Data is:" );
            console.table(data);
            if(data != null)
            return true;
            else {
                return false;
            }
         }).catch(error=> {
             console.log("Error");
             console.table(error);
             return false;
         });
    }
}