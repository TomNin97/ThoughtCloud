/* Controller File defines the backend behavior of the function corresponding to the desired API call
   The format for a controller function definition is:

        exports.{method} = (req, res) => {
            func defn
        };

    Where req and res are objects representing the outgoing HTTP request 
    and incoming HTTP response respectively 
*/

/* require the corresponding model file */
const { json } = require("body-parser");
const Course = require("../models/course.model.js");

/* Function to check request validity 
   Disect HTTP request and flag as invalid if any 
   key is not in a predefined list of valid keys
*/

const VALID_KEYS = [
  "departmentID",
  "courseID",
  "courseSection",
  "courseName",
  "professorID",
  "assistantID",
];

function requestCheckCourse(req) {
  for (const prop in req) {
    console.log(`${prop}`);
    if (!VALID_KEYS.includes(`${prop}`)) {
      console.log(`${prop}` + " in request is not a valid key");
      return false;
    }
  }
  return true;
}

/* error handler to determine which parameter is the issue? */

const TABLE_MODIFIER = ["create", "calendar", "notes", "classlist"];

/* Create a new course */
exports.create = (req, res) => {
  /* validate the request */
  if (requestCheckCourse(req.body) == false) {
    res.status(400).send({
      message: "Invalid HTTP Request",
    });
    return;
  }

  /* Create new user if valid request */
  const course = new Course({
    departmentID: req.body.departmentID,
    courseID: req.body.courseID,
    courseSection: req.body.courseSection,
    courseName: req.body.courseName,
    professorID: req.body.professorID,
    assistantID: req.body.assistantID,
  });

  /* Save a new course */
  Course.create(course, (err, data) => {
    /* catch errors */
    if (err)
     return res.status(500).send({
        message: err.message || "Error when creating new course",
      });
    /* otherwise send data */ else res.send(data);
  });

};

/* delete unique course entry */
exports.removeCourse = (req, res)=> {
  Course.removeCourse(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when removing data",
      });
    else res.send({ message: "course successfully removed" });
  });
};

/* return course information from primary key */
exports.getCourseInfo = (req, res)=> {
  Course.getCourseInfo(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when retrieving data",
      });
    //else res.send({ message: "retrieved information for " + req.params.departmentID + "-" + req.params.courseID + "-" + req.params.sectionID});
    else res.send(data);
  });
};

/* return all course information */
exports.getAll = (req, res) => {
  Course.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when retrieving data",
      });
    else res.send(data);
  });
};

exports.removeAll = (req, res) => {
  Course.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when removing all data",
      });
    else res.send({ message: "all course data removed" });
  });
};

/* access all of a course's information */
exports.getAllInfo = (req, res) => {
  //console.log(req.params);
  var dbTable = req.params.departmentID + req.params.courseID + req.params.sectionID + req.params.content;
  Course.getAllInfo(dbTable, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when retrieving data",
      });
    else res.send(data);
  });
};

// exports.postContent = (req, res) => {

// }