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
const User = require("../models/user.model.js");

/* Create a new user */
exports.create = (req, res) => {
  /* validate the request */
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  /* Create new user if valid request */
  const user = new User({
    ID: req.body.ID,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    type: req.body.type,
  });

  /* Save a new user */
  User.create(user, (err, data) => {
    /* catch errors */
    if (err)
      res.status(500).send({
        message: err.message || "Error when creating a new user",
      });
    /* otherwise send data */ else res.send(data);
  });
};

/* return all user information */
exports.getAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when retrieving data",
      });
    else res.send(data);
  });
};

/* remove all users */
exports.removeAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Error when removing all data",
      });
    else res.send({ message: "all user data removed" });
  });
};

/* remove users by PK */
exports.removeByPK = (req, res) => {
  /* validate the request */
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  /* object to pasS information about user to be deleted easily */
  const delInfo = {
    ID: req.body.ID, // ID from URL
    firstName: req.body.firstName, // Provided first name
    lastName: req.body.lastName, // Provided last name
  };

  // check that URL PARAM ID matches user PARAM before executing?

  User.removeByPK(delInfo, (err, data) => {
    if (err) {
      if (err.kind === "not found") {
        res.status(404).send({
          message:
            err.message ||
            "User with id " +
              delInfo.ID +
              " and name " +
              delInfo.firstName +
              " " +
              delInfo.lastName +
              " does not exist",
        });
      } else {
        res.status(500).send({
          message: err.message || "Error when deleting user",
        });
      }
    } else res.send(data);
  });
};

/* find user by primary key */
exports.findUser = (req, res) => {
  /* validate the request */
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  /* object to pass user information easily */
  const userInfo = {
    ID: req.body.ID, // ID from URL
    firstName: req.body.firstName, // Provided first name
    lastName: req.body.lastName, // Provided last name
  };

  /* get user */
  User.getUser(userInfo, (err, data) => {
    if (err) {
      /* no matching first name */
      if (err.kind === "no match") {
        User.getByID(userInfo, (err, data) => {
          if (err) {
            /* no matching first name */
            if (err.kind === "no first name match") {
              res.status(404).send({
                message:
                  err.message ||
                  "User with first name " +
                    userInfo.firstName +
                    " does not exist",
              });
            } else if (err.kind === "no last name match") {
              /* no matching last name */
              res.status(404).send({
                message:
                  err.message ||
                  "User with last name " +
                    userInfo.lastName +
                    " does not exist",
              });
            } else if (err.kind === "no ID match") {
              /* no matching ID */
              res.status(404).send({
                message:
                  err.message ||
                  "User with ID " + userInfo.ID + " does not exist",
              });
            } else if (err.kind === "no first or last name match") {
              res.status(404).send({
                message:
                  err.message ||
                  "User with ID " +
                    userInfo.ID +
                    " does not have first name " +
                    userInfo.firstName +
                    " and last name " +
                    userInfo.lastName,
              });
            } else {
              res.status(500).send({
                message: err.message || "Error when finding user",
              });
            }
          }
        });
      }
    } else res.send(data);
  });
};

/* update user info */
exports.updateUserInfo = (req, res) => {
    /* validate the request */
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!",
      });
    }

    const newInfo = {
      ID : req.params.ID,
      firstName : req.body.firstName,
      lastName : req.body.lastName,
      email : req.body.email,
      password : req.body.password,
      type : req.body.type,
    };

    /* ID is the ONLY constant 
       Force ununsed changes to be null in the HTTP request
       Preserve current values if HTTP request new value is null
    */
    var i = 0;
    const sentValueData = [];
    const sentValueKey = [];
    /* get values that are passed in the HTTP request */
    for(const prop in newInfo) {
        //console.log(`${newInfo[prop]}` == 'null');
        if(`${newInfo[prop]}` != 'null' && `${prop}` != 'ID'){
            sentValueData[i] = `${newInfo[prop]}`;
            sentValueKey[i] = `${prop}`;
            i++;
        }
    }
    console.log(sentValueData);
    console.log(sentValueKey);

   
    for(var i = 0; i < sentValueData.length; i++){
            User.updateInfo(sentValueData[i], sentValueKey[i], req.params.ID, (err, data) =>{
                if(err){
                    res.status(500).send({
                        message: "error"
                    });
                } else res.send(data);
            })
        
    }
  };
