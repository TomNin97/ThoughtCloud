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

const TABLE_MODIFIER = ["create", "calendar", "notes", "classlist"];

/* Function to check request validity 
   Disect HTTP request and flag as invalid if any 
   key is not in a predefined list of valid keys
*/

const VALID_COURSE_KEYS = [
  "departmentID",
  "courseID",
  "courseSection",
  "courseName",
  "professorID",
  "assistantID",
];
const VALID_CLASSLIST_KEYS = [
  "ID",
  "firstName",
  "lastName"
];
const VALID_CALENDAR_KEYS = [
  "posterID",
  "eventDate",
  "startTime",
  "endTime",
  "eventTitle",
  "description",
];
const VALID_NOTES_KEYS = [
  "posterID",
  "uploadDT",
  "dateTaken",
  "format",
  "contentLink",
  "hidden",
  "hideStart",
  "hideEnd",
];

function requestCheck(req) {
  var VALID_KEYS;
  /* use the request parameters to determine the set of keys
     that should be in the request so that they can be checked */
  if (req.params === undefined) VALID_KEYS = VALID_COURSE_KEYS;
  else if (req.params.content == TABLE_MODIFIER[1]) {
    VALID_KEYS = VALID_CALENDAR_KEYS;
  } else if (req.params.content == TABLE_MODIFIER[2]) {
    VALID_KEYS = VALID_NOTES_KEYS;
  } else if (req.params.content == TABLE_MODIFIER[3]) {
    VALID_KEYS = VALID_CLASSLIST_KEYS;
  /* abort if unrecognized request parameter */
  } else {
    console.log("Bad HTTP Request");
    return false;
  }
  /* check keys in request against allowed keys */
  for (const prop in req.body) {
    console.log(`${prop}`);
    if (!VALID_KEYS.includes(`${prop}`)) {
      console.log(`${prop}` + " in request is not a valid key");
      return false;
    }
  }
  return true;
}

// const AUTHORIZE_EDIT_KEYS = [
//   "ID",
//   "type",
//   "action",
//   "posterID",
//   "contentID",
// ];

// /* function to check that a user is authorized to delete or edit cotnent */
// function authCheck(req) {

// }

/* function to create queries for inserting data in subtables 
 READ: THIS FUNCTION REQUIRES THE KEYS IN THE HTTP REQUEST TO BE
       THE SAME AS THE ATTRIBUTES IN THE TABLE THAT IS BEING INSERTED INTO
*/
function formQuery(req) {
  var query = "";
  var i = 0;
  /* form query from request contents */
  for (const prop in req.body) {
    //console.log(`${prop}`+ " = " + req.body[prop]);
    /* need to not encase nulls in the HTTP request in '' */
    if(req.body[prop] == null)
      query += (`${prop}` + " = " + req.body[prop]);
    else
      query += (`${prop}` + " = '" + req.body[prop] + "'");
    // https://stackoverflow.com/questions/6756104/get-size-of-json-object
    if(i != Object.keys(req.body).length - 1){
      query += ", ";
    }
    i++;
  }
  return query; 
}

/* error handler to determine which parameter is the issue? */

/* Create a new course */
exports.create = (req, res) => {
  /* validate the request */
  if (requestCheck(req.body) == false) {
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
exports.removeCourse = (req, res) => {
  Course.removeCourse(req, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when removing data",
      });
    else res.send({ message: "course successfully removed" });
  });
};

/* return course information from primary key */
exports.getCourseInfo = (req, res) => {
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
  var dbTable =
    req.params.departmentID +
    req.params.courseID +
    req.params.sectionID +
    req.params.content;
  Course.getAllInfo(dbTable, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when retrieving data",
      });
    else res.send(data);
  });
};

/* delete all of a subtable's information */
exports.deleteAllSubtableContent = (req, res) => {
  //console.log(req.params);
  var dbTable =
    req.params.departmentID +
    req.params.courseID +
    req.params.sectionID +
    req.params.content;
  Course.deleteAllSubtableContent(dbTable, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when deleting data",
      });
    else res.send(data);
  });
};

/* post a new record to one of the course's subtables */
exports.postContent = (req, res) => {
  /* validate the http request */
  if (requestCheck(req) == false) {
    res.status(400).send({
      message: "Invalid HTTP Request",
    });
    return;
  }

  //console.log(req.params);
  var dbTable =
    req.params.departmentID +
    req.params.courseID +
    req.params.sectionID +
    req.params.content;

   var masterInfo = {
     ID : req.body.ID,
     departmentID : req.params.departmentID,
     courseID : req.params.courseID,
     sectionID : req.params.sectionID,
     dest : req.params.content
   } 

  Course.postContent(masterInfo, dbTable, formQuery(req), (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when deleting data",
      });
    else res.send(data);
  });
};

/* find all the clases that a student is a member of */
exports.getCourseMembership = (req, res) => {
  var idToFInd = req.params.userID;
  Course.getCourseMembership(idToFInd, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when finding user's courses",
      });
    else res.send(data);
  });
}; 

// exports.deleteRecord = (req, res) => {
//   Course.deleteRecord((err, data) => {
//     if (err)
//       res.status(500).send({
//         message: err.message || "Error when removing record",
//       });
//     else res.send({ message: "record successfully removed" });
//   });
// };

