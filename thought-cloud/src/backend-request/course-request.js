import axios from 'axios';
import { SessionItems } from './session-items';

///todo: duplicate code;
const jsonHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}
const baseUrl = "http://localhost:5000";

/* Create new user if valid request */
export function Course(departmentID, courseID, courseSection, courseName, professorId, assistantId) {

    this.departmentID = departmentID;
    this.courseID = courseID;
    this.courseSection = courseSection;
    this.courseName = courseName;
    this.professorID = professorId;
    this.assistantID = assistantId;
    this.getCourseMap = () => {
        return {
            "courseID": this.courseID,
            "departmentID": this.departmentID,
            "courseID": this.courseID,
            "courseSection": this.courseSection,
            "courseName": this.courseName,
            "professorID": this.professorID,
            "assistantID": this.assistantID,
        }
    };
};

export default class CourseRequests {
    async addCourse(departmentID, courseId, courseSection, courseName, professorID, assistantID) {
        var newCourse = Course;

        newCourse.setCourse(departmentID, courseId, courseSection, courseName, professorID, assistantID);
        console.table(newCourse.getCourseMap());

        const CourseJson = newCourse.getCourseMap();

        await axios({
            method: 'post',
            headers: jsonHeader,
            url: baseUrl + '/courses',
            data: JSON.stringify(CourseJson)
        }).then(data => {
            console.log("Data is:");
            console.table(data);
            if (data != null)
                return true;
            else {
                return false;
            }
        }).catch(error => {
            console.log("Error");
            console.table(error);
            return false;
        });
    }


    //this is temporarily using a get all course
    async getUserCourses() {

        const userId = "";
        const authenticationCode = "";
        const postBody = {
            "userId": userId,
            "authentication": authenticationCode
        };

      return  await axios({
            method: 'get',
            headers: jsonHeader,
            url: baseUrl + '/courses',
            // data : JSON.stringify(postBody)
        }).then(res => {

            if (res.data != null) {
                const data = res.data;


                console.log(data.departmentID);
                var allCourses = data.map(e => {
                    var course = new Course(e.departmentID, e.courseID, e.courseSection, e.courseName, e.professorID, e.assistantID);
                    return course.getCourseMap();
                });
                console.log("Data is", allCourses);
                return allCourses;
            }
        }).catch(error => {
            return [];
        });
    }
}