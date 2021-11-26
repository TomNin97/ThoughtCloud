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
export function Course(departmentID, courseID, sectionID, courseName, professorId, assistantId) {

    this.departmentID = departmentID;
    this.courseID = courseID;
    this.sectionID = sectionID;
    this.courseName = courseName;
    this.professorID = professorId;
    this.assistantID = assistantId;
    this.getCourseMap = () => {
        return {
            "courseID": this.courseID,
            "departmentID": this.departmentID,
            "courseID": this.courseID,
            "courseSection": this.sectionID,
            "courseName": this.courseName,
            "professorID": this.professorID,
            "assistantID": this.assistantID,
        }
    };
};

export function ClassMember(id, firstName, lastName) {
    return  {
        "firstName" : firstName,
        "lastName" : lastName,
        "id" : id
    }
}

export default class CourseRequests {

    constructor () {
        this.sessionItems = new SessionItems();
    }
    async addCourse(departmentID, courseId, sectionID, courseName, assistantID) {
       const creatorID = this.sessionItems.getItem("ID");
       
    var newCourse = new Course(departmentID, courseId, sectionID, courseName, creatorID, assistantID);

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
                    var course = new Course(e.departmentID, e.courseID, e.sectionID, e.courseName, e.professorID, e.assistantID);
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
      
        console.table(course);
      return await  axios({
            method : "get",
            url : baseUrl + `/courses/${course.departmentID}-${course.courseID}-${course.courseSection}/${contentNeeded}`,
            headers : jsonHeader
        }).then(response=> {
            const data  = response.data;
            console.log("Data is:");
            console.table(data);
            if (data != null)
               return data;
            else {
                return [];
            }
        })
    }


    async getClasslist(course) {

        return (await this.getCourseContent(course, "classlist").catch(e=> {
            console.log("error getting list", e);
            return [];
        })).map(item=> ClassMember(item.id, item.firstName, item.lastName));
    }


    async addUserToClass(id, firstName, lastName, course) {


        const data = {
            "ID" : id,
            "firstName" : firstName,
            "lastName" : lastName
        }


       return await axios({
            method : "post",
            data : data,
            headers : jsonHeader,
            url: baseUrl + `/courses/${course.departmentID}-${course.courseID}-${course.courseSection}/classlist/`
        }).then(result=>{
            if(result.status == 200) {
                return true;
            }
            return false;
        })
    }


    async getNotes(course) {


        return await axios({
            method : "get",
            headers : jsonHeader,
            url : baseUrl + `/courses/${course.departmentID}-${course.courseID}-${course.courseSection}/notes/`
        }).then(result=> {
            const data = result.data;

            if(data != null) {
                
            }
        })
    }
}