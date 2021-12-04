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
const async = require("async");

/* Course constructor */
const Course = function (course) {
  this.departmentID = course.departmentID;
  this.courseID = course.courseID;
  this.courseSection = course.courseSection;
  this.courseName = course.courseName;
  this.professorID = course.professorID;
  this.assistantID = course.assistantID;
};

const TABLE_MODIFIER = ["classlist", "calendar", "notes"];
/* function to form SQL queries */
function formQuery(courseInfo) {
  var q1 = "INSERT INTO courses SET ?";
  var q2 =
    "CREATE TABLE " +
    courseInfo.departmentID +
    courseInfo.courseID +
    courseInfo.courseSection +
    TABLE_MODIFIER[0] +
    " (ID VARCHAR(8) NOT NULL UNIQUE, firstName VARCHAR(45) NOT NULL, lastName VARCHAR(45) NOT NULL, PRIMARY KEY(ID, firstName, lastname), FOREIGN KEY(ID, firstName, lastName) REFERENCES thoughtcloud.users(ID, firstName, lastName) ON UPDATE CASCADE ON DELETE CASCADE)";
  var q3 =
    "CREATE TABLE " +
    courseInfo.departmentID +
    courseInfo.courseID +
    courseInfo.courseSection +
    TABLE_MODIFIER[1] +
    " (posterID VARCHAR(8) NOT NULL, eventID INT NOT NULL UNIQUE AUTO_INCREMENT, eventDate DATE NOT NULL, startTime TIME NOT NULL, endTime TIME NOT NULL, eventTitle VARCHAR(60) NOT NULL, description VARCHAR(200), PRIMARY KEY(posterID, eventID))";
  var q4 =
    "CREATE TABLE " +
    courseInfo.departmentID +
    courseInfo.courseID +
    courseInfo.courseSection +
    TABLE_MODIFIER[2] +
    " (posterID VARCHAR(8) NOT NULL, postID INT NOT NULL UNIQUE AUTO_INCREMENT, uploadDT TIMESTAMP NOT NULL, dateTaken DATE, format VARCHAR(10) NOT NULL, contentLink VARCHAR(300) NOT NULL UNIQUE, hidden BOOLEAN NOT NULL DEFAULT FALSE, persistent BOOLEAN NOT NULL DEFAULT FALSE, hideStart DATETIME, hideEnd DATETIME, noteTitle VARCHAR(30), noteTags VARCHAR(200), PRIMARY KEY(posterID, postID))";
  var q5 = "INSERT INTO masterlist SET ?";
  /* object to store formed queries */
  var queries = {
    q_insertCourse: q1,
    q_createClasslist: q2,
    q_createCalendar: q3,
    q_createNotes: q4,
    q_insertMasterList: q5,
  };

  return queries;
}

/* function to form deletion queries */
function deleteQueryGen(reqData) {
  var tableName = reqData.body.tableName;
  console.log("table name", tableName);
  if (tableName === "notes" || "Notes")
    return (
      "DELETE FROM " +
      `${reqData.params.departmentID}` +
      `${reqData.params.courseID}` +
      `${reqData.params.sectionID}` +
      "notes WHERE postID = '" +
      `${reqData.body.postID}` +
      "'"
    );
  if (tableName === "classlist" || "Classlist")
    return (
      "DELETE FROM " +
      `${reqData.params.departmentID}` +
      `${reqData.params.courseID}` +
      `${reqData.params.sectionID}` +
      "notes WHERE ID = '" +
      `${reqData.body.ID}` +
      "'"
    );
  if (tableName === "calendar" || "Calendar")
    return (
      "DELETE FROM " +
      `${reqData.params.departmentID}` +
      `${reqData.params.courseID}` +
      `${reqData.params.sectionID}` +
      "notes WHERE eventID = '" +
      `${reqData.body.eventID}` +
      "'"
    );
}

/* function to form tag search queries */
function tagQueryGen(reqData) {
  /* specify and or or tags in result */
  var searchtype = reqData.body.searchType;
  if (searchtype.toUpperCase() != "AND" && searchtype.toUpperCase() != "OR")
    return "-1";
  var i = 0;
  if (Object.keys(reqData.body.tags).length == 0) return "-2";
  var query =
    "SELECT * FROM " +
    `${reqData.params.departmentID}` +
    `${reqData.params.courseID}` +
    `${reqData.params.sectionID}` +
    "notes WHERE ";
  for (const prop in reqData.body.tags) {
    query += "(noteTags LIKE '%" + reqData.body.tags[prop] + "%')";
    if (i != Object.keys(reqData.body.tags).length - 1) {
      query += " " + searchtype + " ";
    }
    i++;
  }
  return query;
}

/* function to form update queries */
function updateQueryGen(reqData) {
  console.table(reqData.body);
  if (Object.keys(reqData.body.updates).length == 0) return "-2";
  if (Object.keys(reqData.body.keys).length == 0) return "-1";
  var query =
    "UPDATE " +
    `${reqData.params.departmentID}` +
    `${reqData.params.courseID}` +
    `${reqData.params.sectionID}` +
    `${reqData.params.content}` +
    " SET ";
  var i = 0;
  for (const prop in reqData.body.updates) {
    query += `${prop}` + " = '" + reqData.body.updates[prop] + "'";
    if (i != Object.keys(reqData.body.updates).length - 1) {
      query += ", ";
    }
    i++;
  }
  var j = 0;
  query += " WHERE";
  for (const prop in reqData.body.keys) {
    query += " " + `${prop}` + " = '" + reqData.body.keys[prop] + "'";
    if (j != Object.keys(reqData.body.keys).length - 1) {
      query += " AND";
    }
    j++;
  }
  return query;
}

/* Create a new course */
Course.create = (newCourse, result) => {
  var sqlQueries = formQuery(newCourse);

  /* To make sure that bad course inerstions do not generate the associated tables, the SQL queries are implemented as a transaction.
     This means that if one fails, they all fail. This ensures that valid courses are inserted, and all 3 tables are generated.
     To implement this, this lead me to doccumation describing the rollback method: https://stackoverflow.com/questions/15760067/node-js-mysql-transaction
     The rollback method doccumentation can be found here: https://github.com/mysqljs/mysql#transactions and was copied to create the code below. 
  */

  sql.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    sql.query(sqlQueries.q_insertCourse, newCourse, (err, res1) => {
      if (err) {
        return sql.rollback(function () {
          throw err;
        });
      }

      const data = {
        ID: newCourse.professorID,
        departmentId: newCourse.departmentID,
        courseID: newCourse.courseID,
        sectionID: newCourse.courseSection,
      };

      console.log("Data being added to masterlist : ", data);
      sql.query(sqlQueries.q_insertMasterList, data, (err, res3) => {
        if (err) {
          return sql.rollback(function () {
            throw err;
          });
        }
      });

      sql.query(sqlQueries.q_createClasslist, newCourse, (err, res2) => {
        if (err) {
          return sql.rollback(function () {
            throw err;
          });
        }

        sql.query(sqlQueries.q_createCalendar, newCourse, (err, res3) => {
          if (err) {
            return sql.rollback(function () {
              throw err;
            });
          }

          sql.query(sqlQueries.q_createNotes, newCourse, (err, res4) => {
            if (err) {
              return sql.rollback(function () {
                throw err;
              });
            }

            sql.commit(function (err) {
              result(null, "success");
              if (err) {
                return sql.rollback(function () {
                  throw err;
                });
              }
              console.log("success!");
            });
          });
        });
      });
    });
  });
};

Course.removeCourse = (req, result) => {
  //console.log(dbTable);
  sql.query(
    "Delete FROM courses WHERE departmentID = ? AND courseID = ? AND courseSection = ?",
    [req.params.departmentID, req.params.courseID, req.params.sectionID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("Deleted " + `${res.affectedRows}` + " row from courses");
      result(null, res);
    }
  );
};

Course.getCourseInfo = (req, result) => {
  //console.log(dbTable);
  sql.query(
    "SELECT * FROM courses WHERE departmentID = ? AND courseID = ? AND courseSection = ?",
    [req.params.departmentID, req.params.courseID, req.params.sectionID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("Returned " + `${res.affectedRows}` + " row from courses");
      result(null, res);
    }
  );
};

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

    console.log("deleted " + `${res.affectedRows}` + " courses");
    result(null, res);
  });
};

/* Access all of a courses calendar information */
Course.getAllInfo = (dbTable, result) => {
  //console.log(dbTable);
  sqlQuery = "SELECT * FROM " + dbTable;
  sql.query(sqlQuery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Retrieved " + `${res.affectedRows}` + " rows from " + dbTable);
    result(null, res);
  });
};

/* Delete all subtable content */
Course.deleteAllSubtableContent = (dbTable, result) => {
  //console.log(dbTable);
  sqlQuery = "DELETE FROM " + dbTable;
  sql.query(sqlQuery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("Deleted " + `${res.affectedRows}` + " rows from " + dbTable);
    result(null, res);
  });
};

Course.postContent = (masterInfo, dbTable, assignment, result) => {
  var sqlQuery = "INSERT INTO " + dbTable + " SET " + assignment;
  if (masterInfo.dest == "classlist") {
    sql.beginTransaction(function (err) {
      if (err) {
        throw err;
      }
      sql.query(sqlQuery, (err, res1) => {
        if (err) {
          return sql.rollback(function () {
            throw err;
          });
        }

        sql.query(
          "INSERT INTO masterlist SET ID = ?, departmentID = ?, courseID = ?, sectionID = ?",
          [
            masterInfo.ID,
            masterInfo.departmentID,
            masterInfo.courseID,
            masterInfo.sectionID,
          ],
          (err, res2) => {
            if (err) {
              return sql.rollback(function () {
                throw err;
              });
            }
            sql.commit(function (err) {
              result(null, "success");
              if (err) {
                return sql.rollback(function () {
                  throw err;
                });
              }
              console.log("success!");
            });
          }
        );
      });
    });
  } else {
    sql.query(sqlQuery, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(
        "Inserted " + `${res.affectedRows}` + " record into " + dbTable
      );
      result(null, res);
    });
  }
};

Course.getCourseMembership = (userID, result) => {
  console.log(userID);

  sql.query(
    "SELECT * FROM  courses natural join (select courseID, departmentID, sectionID  from masterlist where ID = ? ) AS rand",
    userID,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("found " + `${res.affectedRows}` + " matches");
      result(null, res);
    }
  );
};

Course.deleteRecord = (reqData, result) => {
  var sqlQuery = deleteQueryGen(reqData);
  sql.query(sqlQuery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("deleted " + `${res.affectedRows}` + " rows");
    result(null, res);
  });
};

Course.tagSearch = (reqData, result) => {
  var sqlQuery = tagQueryGen(reqData);
  if (sqlQuery == "-2") {
    console.log("no tags supplied");
    result("no tags supplied");
    return;
  }
  if (sqlQuery == "-1") {
    console.log("no search operator supplied");
    result("no tags supplied");
    return;
  }
  sql.query(sqlQuery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("got " + `${res.length}` + " notes: ", res);
    result(null, res);
  });
};

Course.updateRecord = (req, result) => {
  var sqlQuery = updateQueryGen(req);
  if (sqlQuery == "-2") {
    console.log("no updated values suplied");
    result("no updated values suplied");
    return;
  }
  if (sqlQuery == "-1") {
    console.log("no keys supplied");
    result("no keys supplied");
    return;
  }
  sql.query(sqlQuery, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    console.log("Updated " + `${res.length}` + " records: ", res);
    result(null, res);
  });
};

//TO DO
/*
  Delete all 3 tables if the course is deleted ?

  Delete Calendar Event
  Delete from classlist
  Delete from Notes
*/

Course.removeUser = (req, result) => {
  var tableID = req.params.departmentID+req.params.courseID+req.params.sectionID+"classList";
  var classlistQuery = "DELETE FROM " + tableID + " WHERE ID = ?";
  var masterlistQuery = "DELETE FROM masterlist WHERE ID = ?"
  sql.beginTransaction(function (err) {
    if (err) {
      throw err;
    }
    /* remove from classlist */
    sql.query(classlistQuery, req.body.userID, (err, res1) => {
      if (err) {
        return sql.rollback(function () {
          throw err;
        });
      }
      /* remove from masterlist */
      sql.query(masterlistQuery, req.body.userID, (err, res2) => {
        if (err) {
          return sql.rollback(function () {
            throw err;
          });
        }
      });
      sql.commit(function (err) {
        result(null, "success");
        if (err) {
          return sql.rollback(function () {
            throw err;
          });
        }
        console.log("success!");
      });
    });
  });
};

module.exports = Course;
