import axios from 'axios';
const https = require("https")


const baseUrl = "http://localhost:5000";
const jsonHeader = {
    'Content-Type': 'application/json',
}

export class UserRequests {
    async createUser(firstName, lastName, email, password, accountType) {

        console.log("Creatingn user 13");
        const jsonHeader = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : '*',
            "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
        
        const options = {
            hostname: "localhost",
            port: 5000,
            path: "/users",
            method: 'POST',
            headers: jsonHeader
        }

        var userJson = {
            "ID" : 434343434,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password,
            "type": accountType
        }

        const postData = JSON.stringify(userJson);

       await axios({
             method: "post",
           url : baseUrl + "/users",
           data :postData,
           headers : jsonHeader
           
       }).then(data=> {
          console.log("Data is:" + data);
       }).catch(error=> {
           console.log("Error");
           console.table(error);
       });
    }

    async getUser(firstName, lastName, email, password, accountType) {
        var userJson = {
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": password,
            "type": accountType
        }

        // const response = await fetch(baseUrl + "/users/find", {
        //     method : 'post',
        //     body : JSON.stringify(userJson),
        //     headers : jsonHeader
        // })

        //   const data  = await response.json();
    }
}