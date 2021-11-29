/* Routes define the locations that the client will send requests to in order to interact with this API.
   For instance, a route defined at 'localhost:3000/test' will execute the function bound to it when a 
   cliet visits 'localhost:3000/test'. This API is following the REST model, which allows for reuse of 
   the same route to perform multiple functions by changing the type of request sent to the route. 
   
   Types of HTTP requests and their uses:
        GET     -  Read data
        POST    -  Create data
        PUT     -  Update/modify data
        DELETE  -  Remove data
   
    The definition for a route is as follows:
    app.{HTTP REQUEST TYPE}("/{path}", {method in corresponding controller class})
*/

module.exports = app => {
    const courses = require("../controllers/course.controller.js");

    /* create a new course */
    app.post("/courses", courses.create);

    /* remove a course by its primary key */
    app.delete("/courses/:departmentID-:courseID-:sectionID/delete", courses.removeCourse);

    app.get("/courses")
    /* get a course by its primary key */
    app.get("/courses/:departmentID-:courseID-:sectionID/", courses.getCourseInfo);

    /* get all courses in course table */
    app.get("/courses", courses.getAll);

    /* remove all courses in course table */
    app.delete("/courses/all", courses.removeAll);

    /* get a course's information in a subtable
       in the 'content' parameter, provide the name of the subtable to print
    */
    app.get("/courses/:departmentID-:courseID-:sectionID/:content", courses.getAllInfo);

    /* tag search */
    app.get("/courses/:departmentID-:courseID-:sectionID/notes/ts", courses.tagSearch);
    
    /* delete all content from a course's subtable */
    app.delete("/courses/:departmentID-:courseID-:sectionID/:content/delete/all", courses.deleteAllSubtableContent);

    /* post to a subtable using the desired path */
    app.post("/courses/:departmentID-:courseID-:sectionID/:content/", courses.postContent);

    /* return all of the courses that a user is a part of IN PROGRESS */
    app.get("/:userID/courses", courses.getCourseMembership);

    /* delete a record that you posted 
        HTTP REQUEST: 
        {
            "ID" : "ID_OF_LOGGED_IN_USER".
            "contentID" : "ID_OF_CONTENT_TO_DELETE"
            "posterID" : "ID_OF_ORIGINAL_POSTER"
        }
    */
    app.delete("/courses/:departmentID-:courseID-:sectionID/:content/", courses.deleteRecord);

    /* delete any record */
    //app.delete("/courses/:departmentID-:courseID-:sectionID/:content/delete/", courses.deleteRecordAdmin);
};