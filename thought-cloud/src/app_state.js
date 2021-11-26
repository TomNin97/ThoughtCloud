
import { Course } from "./backend-request/course-request";

export class AppState {
   
    constructor() {
       console.log("value of instance",AppState.instance);
       AppState.instance++;
    }
    static instance = 0;
    intialized = true;
    currentCourse = new Course();

    set course(course) {
        this.currentCourse = course;
    }

    get course() { return  this.currentCourse}
}