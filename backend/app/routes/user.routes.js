/* Routes define the locations that the client will send requests to in order to interact with this API.
   For instance, a route defined at 'localhost:3000/test' will execute the function bound to it when a 
   cliet visits 'localhost:3000/test'. This API is following the REST model, which allows for reuse of 
   the same route to perform multiple functions by changing the type of request sent to the route. 
   
   Types of HTTP requests and their uses:
        GET     -  Read data
        POST    -  Create data
        PUT     -  Update/modify data
        DELETE  -  Remove data
   
    The definition for a route is as follows:
    app.{HTTP REQUEST TYPE}("/{path}", {method in corresponding controller class})
*/

module.exports = app => {
    const users = require("../controllers/user.controller.js");

    /* create a new user */
    app.post("/users", users.create);

    /* update a user's information */
    app.put("/users/:ID", users.updateUserInfo);

    /* find a user by their primary key */
    app.get("/users/find", users.findUser);

    /* get all users information */
    app.get("/users", users.getAll);

    /* remove all users information */
    app.delete("/users/all", users.removeAll);

    /* remove a user by their primary key */
    app.delete("/users/", users.removeByPK);

    // /* return user type and ID from email and password */
    // app.get("/users/information", users.getSessionInformation);
};