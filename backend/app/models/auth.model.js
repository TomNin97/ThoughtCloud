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
const authRoutes = require("../routes/auth.routes.js");
const sql = require("./db.js");

/* Course constructor */
const Auth = function (auth) {
    this.ID = auth.ID;
    this.firstName = auth.firstName;
    this.lastName = auth.lastName;
    this.type = auth.type;
  };
  
/* Auth code created from code obtained here: https://www.js-tutorials.com/nodejs-tutorial/node-js-user-authentication-using-mysql-express-js/ */
Auth.login = (userInfo, currentSession, result) =>{
    sql.query("SELECT * FROM users WHERE email = ? and password = ?", [userInfo.email, userInfo.password], (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if(res.length){
            currentSession.userID = res[0].ID;
            currentSession.firstName = res[0].firstName;
            currentSession.lastName = res[0].lastName;
            currentSession.type = res[0].type;
            console.log("user authorized");
        }
        else{
            console.log("invalid username and/or password");
        }
        result(null, res);   
      });
    };    

module.exports = Auth;
