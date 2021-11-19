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
const Auth = require("../models/auth.model");

exports.login = (req, res) => {
    console.log("Email" +req.body.email);
    var currentSession = req.session;
    const userInfo = {
        email : req.body.email,
        password : req.body.password,
    };

    console.table(userInfo);


    /* Save a new course */
    Auth.login(userInfo, currentSession, (err, data) => {
      console.table(currentSession);
    /* catch errors */
    if (err)
      return res.status(500).send({

        message: err.message || "Error when logging in user",
      });
    /* otherwise send data */ else res.send(data); 
  });
};
