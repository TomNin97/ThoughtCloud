/* express api to communicate with MySQL Server
    Following a guide posted at: https://www.bezkoder.com/node-js-rest-api-express-mysql/
   Joseph Garro - Thoughtcloud
*/

/* required packages */
const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const app = express();

/* session code taken from example found here: https://www.js-tutorials.com/nodejs-tutorial/node-js-user-authentication-using-mysql-express-js/ */

app.use(session({
    secret: 'cookie_secret',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 600000}
}));


// /* interprete JSON information */
 app.use(bodyParser.json());

// /* ??? */
 app.use(bodyParser.urlencoded( { extended: true }));

/* home route */
app.get("/", (req, res) => {
    res.json({ message: "thoughtcloud api homepage"});
});

/* require all route files */
require("./app/routes/auth.routes.js")(app)
require("./app/routes/user.routes.js")(app);
require("./app/routes/course.routes.js")(app);


/* open port 5000 */
app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
});
