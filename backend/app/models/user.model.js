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
const userRoutes = require("../routes/user.routes.js");
const sql = require("./db.js");

/* User constructor */
const User = function (user) {
  this.ID = user.ID;
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.email = user.email;
  this.password = user.password;
  this.type = user.type;
};

/* Create a new User */
User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { ...newUser });
    result(null, { ...newUser });
  });
};

/* get user information by primary key */
User.getUser = (userInfo, result) => {
  sql.query(
    "SELECT * FROM users WHERE firstName = ? AND lastName = ? AND ID = ?",
    [userInfo.firstName, userInfo.lastName, userInfo.ID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      /* handle no matching user case */
      if (res.length == 0) {
        result({ kind: "no match" }, null);
        return;
      }
      console.log(
        "Found user " +
          userInfo.firstName +
          " " +
          userInfo.lastName +
          " with ID " +
          userInfo.ID
      );
      result(null, res);
    }
  );
};

/* get user information by unique ID -> alternative to using entire primary key. More for internal use */
User.getByID = (userInfo, result) => {
  sql.query("SELECT * FROM users WHERE ID = ?", userInfo.ID, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    /* handle no matching user case */
    if (res.length == 0) {
      result({ kind: "no ID match" }, null);
      return;
    }
    /* res is an array containing values? Need to access elements to get data
                since IDs are unique, this function will only ever return 1 tuple,
                so only res[0] has to be checked.
          */
    if (
      res[0].lastName != userInfo.lastName &&
      res[0].firstName == userInfo.firstName
    ) {
      result({ kind: "no last name match" }, null);
      return;
    } else if (
      res[0].firstName != userInfo.firstName &&
      res[0].lastName == userInfo.lastName
    ) {
      result({ kind: "no first name match" }, null);
      return;
    } else {
      result({ kind: "no first or last name match" }, null);
      return;
    }
  });
};

/* Get all users */
User.getAll = (result) => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("got users: ", res);
    result(null, res);
  });
};

/* delete all users */
User.removeAll = (result) => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("deleted ${res.affectedRwos} users");
    result(null, res);
  });
};

/* remove user by PK */
User.removeByPK = (deljson, result) => {
  sql.query(
    "DELETE FROM users WHERE firstName = ? AND lastName = ? and ID = ?",
    [deljson.firstName, deljson.lastName, deljson.ID],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      /* handle no matching user case */
      if (res.affectedRows == 0) {
        result({ kind: "not found" }, null);
        return;
      }
      console.log("deleted user with ID " + deljson.ID);
      result(null, res);
    }
  );
};

/* update user info */
User.updateInfo = (newValue, tableKey, userID, result) => {
  var query = "UPDATE users SET " + tableKey + " = '" + newValue + "' WHERE ID = " + userID;
  sql.query(
    query,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }
      
      console.log("updated " + tableKey + "of ID " + userID);
      result(null)
    }
  );
};

module.exports = User;
