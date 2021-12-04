import axios from 'axios';
import { auth } from 'firebase-admin';
import { SessionItems } from './session-items';


const baseUrl = "http://localhost:5000";
const jsonHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

const User = {
    ID: null,
    email: null,
    firstName: null,
    lastName: null,
    type: null,
    authenticated: false,

    setUser: function (id, email, firstName, lastName, type, authenticated) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.type = type;
        this.authenticated = authenticated;
    },

    getUserMap: function () {
        return {
            "ID": this.id,
            "email": this.email,
            "firstName": this.firstName,
            "lastName": this.lastName,
            "type": this.type,
            "authenticated": this.authenticated
        }
    }
};

export class UserRequests {

    constructor() {
        this.user = User;
        this.sessionItems = new SessionItems();
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

        this.user.setUser(id, email, firstName, lastName, accountType,true)
        const data = this.user.getUserMap();
        for (const item in data) {
            console.log("item:" + item + data[`${item}`]);
            this.sessionItems.setItem(`${item}`, data[`${item}`]);
        }
        console.table(this.user.getUserMap());


        const postData = this.user.getUserMap();
        postData["password"] = password;
        delete postData.authenticated;
        console.table(postData);

        return await axios({
            method: "post",
            url: baseUrl + "/users",
            data: JSON.stringify(postData),
            headers: jsonHeader

        }).then(data => {
            console.log("Course Data is:" + data);
            if (data != null)
                return true;
            else {
                return false;
            }
        }).catch(error => {
            console.log("Error");
            console.table(error);
            return false;
        });
    }



    async loginUser(email, password) {
        var id = this.getIdFromEmail(email);
        if (id == null) return null;

        var credentials = {
            "email": email,
            "password": password,
        }

        return await axios({
            method: "post",
            data: credentials,
            headers: jsonHeader,
            url: baseUrl + "/login"
        }).then(result => {
            if (result.status == 200) {
                const data = result.data;
                console.log("login data is :", data);
                if(data == null || data == "") {
                    return false;
                }
                console.log("data is:");
                console.log(data);
                for (const item in data[0]) {
                    console.log("item:" + item + data[0][`${item}`]);
                    this.sessionItems.setItem(`${item}`, data[0][`${item}`]);
                }
                /* set authenticated status */
                this.sessionItems.setItem('authenticated', true);
                this.user.setUser(data['id'], data['email'], data['firstName'], data['lastName'], data['type']);
                return true;
            }
            else {
                console.log("unsuccessful login" + result.error);
                return false;
            }
        }).catch(e => {
            console.log(e)
            return false;
        })
    }


    async findUsers(name) {
        if (name == null || name == "") return [];

        return await axios({
            method: "get",
            url: baseUrl + "/users",
            headers: jsonHeader
        }).then((result) => {
            const data = result.data;
            if (data != null) {
                console.table(data);
                const query = [];
                data.forEach(e=>
                {
                   console.log(e);
                    if(e.firstName.toLowerCase().search(name.toLowerCase()) != -1 || e.lastName.toLowerCase().search(name.toLowerCase()) != -1 || (e.lastName + e.firstName).toLowerCase().search(name.toLowerCase()) != -1){
                        query.push(e);
                    }
                })
                return query;
            }
            return [];
        })
    }
}