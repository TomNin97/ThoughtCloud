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
  "courseDepartment",
  "courseID",
  "courseSection",
  "courseName",
  "professorID",
  "assistantID",
];
function requestCheck(req) {
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
    courseDepartment: req.body.courseDepartment,
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
      res.status(500).send({
        message: err.message || "Error when creating new course",
      });
    /* otherwise send data */ else res.send(data);
  });

  /* Create the supporting course tables */
  /* modifieres to query to create tables */
  const queryMod = ["notes", "calendar", "classlist"];
  /* Create tables using separate queries */
  for (var i = 0; i < queryMod.length; i++) {
    Course.createTable(course, queryMod[i], (err, data) => {
      /* catch errors */
      if (err) {
        res.status(500).send({
          message: err.message || "Error when creating new course",
        });
        /* if there is an error, decrement i to try and remake the table  */
        i--;
      } 
      /* otherwise send data */ else res.send(data);
    });
  }
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

/* remove all courses */
exports.removeAll = (req, res) => {
  Course.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when removing all data",
      });
    else res.send({ message: "all course data removed" });
  });
};

// /* remove users by PK */
// exports.removeByPK = (req, res) => {
//   /* validate the request */
//   if (requestCheck(req.body) == false) {
//     res.status(400).send({
//       message: "Invalid HTTP Request",
//     });
//     return;
//   }

//   /* object to pasS information about user to be deleted easily */
//   const delInfo = {
//     ID: req.body.ID, // ID from URL
//     firstName: req.body.firstName, // Provided first name
//     lastName: req.body.lastName, // Provided last name
//   };

//   // check that URL PARAM ID matches user PARAM before executing?

//   User.removeByPK(delInfo, (err, data) => {
//     if (err) {
//       if (err.kind === "not found") {
//         res.status(404).send({
//           message:
//             err.message ||
//             "User with id " +
//               delInfo.ID +
//               " and name " +
//               delInfo.firstName +
//               " " +
//               delInfo.lastName +
//               " does not exist",
//         });
//       } else {
//         res.status(500).send({
//           message: err.message || "Error when deleting user",
//         });
//       }
//     } else res.send(data);
//   });
// };

// /* find user by primary key */
// exports.findUser = (req, res) => {
//   /* validate the request */
//   if (requestCheck(req.body) == false) {
//     res.status(400).send({
//       message: "Invalid HTTP Request",
//     });
//     return;
//   }

//   /* object to pass user information easily */
//   const userInfo = {
//     ID: req.body.ID, // ID from URL
//     firstName: req.body.firstName, // Provided first name
//     lastName: req.body.lastName, // Provided last name
//   };

//   /* get user */
//   User.getUser(userInfo, (err, data) => {
//     if (err) {
//       /* no matching first name */
//       if (err.kind === "no match") {
//         User.getByID(userInfo, (err, data) => {
//           if (err) {
//             /* no matching first name */
//             if (err.kind === "no first name match") {
//               res.status(404).send({
//                 message:
//                   err.message ||
//                   "User with first name " +
//                     userInfo.firstName +
//                     " does not exist",
//               });
//             } else if (err.kind === "no last name match") {
//               /* no matching last name */
//               res.status(404).send({
//                 message:
//                   err.message ||
//                   "User with last name " +
//                     userInfo.lastName +
//                     " does not exist",
//               });
//             } else if (err.kind === "no ID match") {
//               /* no matching ID */
//               res.status(404).send({
//                 message:
//                   err.message ||
//                   "User with ID " + userInfo.ID + " does not exist",
//               });
//             } else if (err.kind === "no first or last name match") {
//               res.status(404).send({
//                 message:
//                   err.message ||
//                   "User with ID " +
//                     userInfo.ID +
//                     " does not have first name " +
//                     userInfo.firstName +
//                     " and last name " +
//                     userInfo.lastName,
//               });
//             } else {
//               res.status(500).send({
//                 message: err.message || "Error when finding user",
//               });
//             }
//           }
//         });
//       }
//     } else res.send(data);
//   });
// };

// /* update user info */
// exports.updateUserInfo = (req, res) => {
//   /* validate the request */
//   if (requestCheck(req.body) == false) {
//     res.status(400).send({
//       message: "Invalid HTTP Request",
//     });
//     return;
//   }

//   const newInfo = {
//     ID: req.params.ID,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     email: req.body.email,
//     password: req.body.password,
//     type: req.body.type,
//   };

//   /* ID is the ONLY constant
//        Force ununsed changes to be null in the HTTP request
//        Preserve current values if HTTP request new value is null
//     */

//   /* get non-null values that are passed in the HTTP request */
//   var assignmentStrings = [];
//   var i = 0;

//   for (const prop in newInfo) {
//     if (
//       `${newInfo[prop]}` != "null" &&
//       `${newInfo[prop]}` != "undefined" &&
//       `${prop}` != "ID"
//     ) {
//       /* store updates in an array of strings to attach to SQL query */
//       assignmentStrings[i] = `${prop}` + " = " + "'" + `${newInfo[prop]}` + "'";
//       i++;
//     }
//   }

//   /* if no updates, stop */
//   if (assignmentStrings.length == 0) {
//     res.status(500).send({
//       message: "All updates have null values",
//     });
//     return;
//   }

//   User.updateInfo(assignmentStrings, req.params.ID, (err, data) => {
//     if (err) {
//       res.status(500).send({
//         message: "error",
//       });
//     } else res.send(data);
//   });
// };
