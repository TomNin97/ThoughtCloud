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

export function ClassMember(id, firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.id = id;
    this.getClassMemberMap = {
        "firstName" : this.firstName,
        "lastName" : this.lastName,
        "id" : this.id
    }
}

export default class CourseRequests {

    constructor () {
        this.sessionItems = new SessionItems();
    }
    async addCourse(departmentID, courseId, courseSection, courseName, assistantID) {
       const creatorID = this.sessionItems.getItem("ID");
       
        var newCourse = new Course(departmentID, courseId, courseSection, courseName, creatorID, assistantID);

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

        const userId = this.sessionItems.getItem("ID");
        const authenticationCode = "authCode";

      return  await axios({
            method: 'get',
            headers: jsonHeader,
            url: baseUrl + `/${userId}/courses`,
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

    async deleteCourse(course) {

        const userId = this.sessionItems.getItem("id");

        if(userId === course.professorID) {
            axios({
                method : "delete",
                headers : jsonHeader,
                url : baseUrl + `/courses/${course.departmentID}-${course.courseID}-:${course.sectionID}/:content/delete/alls`
            })
        }

    }

    async deleteUser() {
        
    }

    //contentNeeded has to be - subtable name of a course
    async getCourseContent(course, contentNeeded) {
       await  axios({
            method : "get",
            url : baseUrl + `/courses/${course.departmentID}-${course.courseID}-${course.sectionID}/${contentNeeded}`,
            headers : jsonHeader
        }).then(response=> {
            const data  = response.data;
            console.log("Data is:");
            console.table(data);
            if (data != null)
               return data;
            else {
                return false;
            }
        })
    }


    async getClasslist(course) {

        return (await this.getCourseContent(course, "classlist").catch(e=> {
            console.log("error getting list", e);
            return [];
        })).map(item=> ClassMember(item.id, item.firstName, item.lastName));
    }
}