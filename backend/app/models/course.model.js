/* Interactions with the MySQL database are based on the CRUD Model:
    C: create
    R: read
    U: update
    D: delete

The user.model.js file defines the SQL queries performed on the MySQL database by the express API to implement
the above features. To create an API call that will perform a query on the users:
    1) Add the API call as a method to this file
    2) Add the path that correspnds to the API call to the file "../routes/user.routes.js", along with the 
        appropriate HTTP request type
    3) Define the backend function corresponding to the API call in the file "../controllers/user.controller.js"
*/

/* need to be connected to the DB */
const courseRoutes = require("../routes/course.routes.js");
const sql = require("./db.js");

function formQuery(courseMod){
  var query = "CREATE TABLE" + req.courseDepartment + req.courseID + req.courseSection + courseMod;
  const classlistSchema = "ID INT NOT NULL UNIQUE, firstName VARCHAR(45) NOT NULL UNIQUE, lastName VARCHAR(45) NOT NULL UNIQUE, PRIMARY KEY(idNumber, firstName, lastname), FOREIGN KEY(ID, firstName, lastName) REFERENCES thoughtcloud.users(ID, firstName, lastName)";
  const calendarSchema = "" ;
  const notesSchema = "" ;
}

/* Course constructor */
const Course = function (course) {
  this.courseDepartment = course.courseDepartment
  this.courseID = course.courseID;
  this.courseSection = course.courseSection;
  this.courseName = course.courseName;
  this.professorID = course.professorID;
  this.assistantID = course.assistantID;
};

/* Create a new course */
Course.create = (newCourse, result) => {
  sql.query("INSERT INTO courses SET ?", newCourse, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created course: ", { ...newCourse });
    result(null, { ...newCourse });
  });
}

/* Create course tables */
Course.createTable = (newCourse, courseMod, result) => {
  sql.query(formQuery(courseMod), newCourse, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("created table: ", (req.courseDepartment + req.courseID + req.courseSection + courseMod));
    result(null, (req.courseDepartment + req.courseID + req.courseSection + courseMod));
  });
}

/* Get all courses */
Course.getAll = (result) => {
  sql.query("SELECT * FROM courses", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("got courses: ", res);
    result(null, res);
  });
};

/* delete all courses */
Course.removeAll = (result) => {
  sql.query("DELETE FROM courses", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("deleted " + `${res.affectedRows}` + " users");
    result(null, res);
  });
};

// /* remove user by PK */
// User.removeByPK = (deljson, result) => {
//   sql.query(
//     "DELETE FROM users WHERE firstName = ? AND lastName = ? and ID = ?",
//     [deljson.firstName, deljson.lastName, deljson.ID],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }

//       /* handle no matching user case */
//       if (res.affectedRows == 0) {
//         result({ kind: "not found" }, null);
//         return;
//       }
//       console.log("deleted user with ID " + deljson.ID);
//       result(null, res);
//     }
//   );
// };

// User.updateInfo = (assignmentStrings, userID, result) => {
//   /* base SQL query to update users table */
//   var query = "UPDATE users SET ";

//   /* Add assignment statements to base SQL query */
//   for (var i = 0; i < assignmentStrings.length; i++) {
//     query += assignmentStrings[i];
//     /* Add a comma after every attribute update except for the last */
//     if (assignmentStrings.length == 0 || i == assignmentStrings.length - 1) {
//       /* add WHERE clause at end of query and return */
//       query += " WHERE ID = " + userID;
//       break;
//     } else query += ", ";
//   }

//   //console.log(query);

//   /* Execute update query */
//   sql.query(query, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(null, err);
//       return;
//     }

//     console.log("updated " + userID);
//     result(null, assignmentStrings);
//   });
// };

// /* get user information by primary key */
// User.getUser = (userInfo, result) => {
//   sql.query(
//     "SELECT * FROM users WHERE firstName = ? AND lastName = ? AND ID = ?",
//     [userInfo.firstName, userInfo.lastName, userInfo.ID],
//     (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }
//       /* handle no matching user case */
//       if (res.length == 0) {
//         result({ kind: "no match" }, null);
//         return;
//       }
//       console.log(
//         "Found user " +
//           userInfo.firstName +
//           " " +
//           userInfo.lastName +
//           " with ID " +
//           userInfo.ID
//       );
//       result(null, res);
//     }
//   );
// };

// /* get user information by unique ID -> alternative to using entire primary key. More for internal use */
// User.getByID = (userInfo, result) => {
//   sql.query("SELECT * FROM users WHERE ID = ?", userInfo.ID, (err, res) => {
//     if (err) {
//       console.log("error: ", err);
//       result(err, null);
//       return;
//     }
//     /* handle no matching user case */
//     if (res.length == 0) {
//       result({ kind: "no ID match" }, null);
//       return;
//     }
//     /* res is an array containing values? Need to access elements to get data
//                 since IDs are unique, this function will only ever return 1 tuple,
//                 so only res[0] has to be checked.
//           */
//     if (
//       res[0].lastName != userInfo.lastName &&
//       res[0].firstName == userInfo.firstName
//     ) {
//       result({ kind: "no last name match" }, null);
//       return;
//     } else if (
//       res[0].firstName != userInfo.firstName &&
//       res[0].lastName == userInfo.lastName
//     ) {
//       result({ kind: "no first name match" }, null);
//       return;
//     } else {
//       result({ kind: "no first or last name match" }, null);
//       return;
//     }
//   });
// };

module.exports = Course;
