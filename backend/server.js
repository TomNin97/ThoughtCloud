/* express api to communicate with MySQL Server
    Following a guide posted at: https://www.bezkoder.com/node-js-rest-api-express-mysql/
   Joseph Garro - Thoughtcloud
*/

/* required packages */
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

/* interprete JSON information */
app.use(bodyParser.json());

/* ??? */
app.use(bodyParser.urlencoded( { extended: true }));

/* home route */
app.get("/", (req, res) => {
    res.json({ message: "thoughtcloud api homepage"});
});

/* require all route files */
require("./app/routes/user.routes.js")(app);

/* open port 5000 */
app.listen(5000, ()=> {
    console.log("Server is running on port 5000");
});
