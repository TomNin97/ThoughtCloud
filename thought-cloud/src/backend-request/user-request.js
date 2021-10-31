import axios from 'axios';


const baseUrl = "http://localhost:5000";
const jsonHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

const  User = {
    id: null,
    email : null,
    firstName : null ,
    lastName : null ,
    type  : null,
    setUser : function(id, email, firstName, lastName, type) {
        this.id =  id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.type = type;
    },
    getUserMap : function() {
        return {
            "ID" : this.id,
            "email" : this.email,
            "firstName" : this.firstName,
            "lastName" : this.lastName,
            "type" : this.type
        }
   }
};

export class UserRequests {

    constructor() {
        this.user = User;
    }

        ///duplicate of function in sugnup-page will refactor later
        isUakronEmail(email) {
            if (email != null) {
                return email.includes("uakron.edu");
            }
            else return false;
        }
    
         //ensures email is a valid uakron email and then grabs the userId from email
        getIdFromEmail(email) {
            var id;
            if (this.isUakronEmail(email)) {
                id = email.substring(0, email.search('@'));
            }
            return id;
        }

    async createUser(firstName, lastName, email, password, accountType, id) {

        console.log("Creatingn user 13");

        this.user.setUser(id, email,firstName, lastName,accountType,)

        console.table (this.user.getUserMap());


        const postData = this.user.getUserMap();
        postData["password"] = password;

       await axios({
             method: "post",
           url : baseUrl + "/users",
           data :JSON.stringify(postData),
           headers : jsonHeader
           
       }).then(data=> {
          console.log("Data is:" + data);
       }).catch(error=> {
           console.log("Error");
           console.table(error);
       });
    }



    async loginUser(email, password) {
        var id = this.getIdFromEmail(email);
        if(id == null) return null;

        var credentials = {
            "email": email,
            "id" :id,
            "password": password,
        }

      return  await  axios({
            method : "post",
            data : JSON.stringify(credentials),
            headers : jsonHeader
        }).then(result=> {
            if(result.status == 200) {
               const data =  result.data;
                this.user.setUser(data['id'], data['email'], data['firstName'], data['lastName'], data['type']);
                return true;
            }
            else {
                return false;
            }
        })

    }
}