import React from 'react';
import ReactDOM from 'react-dom';
import { UserRequests } from '../backend-request/user-request';
import "../login_page/login-page.css";


export class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.userRequests = new UserRequests();

        this.state = {
            userId: props.id ?? "",
            firstName: props.firstName ?? "" ,
            lastName: props.lastName ?? "",
            accountType: "teacher",
            email: props.email ?? "",
            password: props.password ?? "",
            isLoggedIn: props.isLoggedIn ?? false
        }
    }

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

    signUp = async () => {
        console.log("Siging up 29");
        var id = this.getIdFromEmail(this.state.email);
        alert("ID is " + id);
        if (id != null) {
            this.setState({ "userId": id });

            const isSuccess = await this.userRequests.createUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password, "student", id);
            if (isSuccess) {
                console.log("sucesssfully created account");
                window.location = '/dashboard';
            }
            else {
                alert("Could not sign you up, try again! ");
            }
        }
        else {
            alert("Not a uakron email use a uakron email!!");
        }
    }
    handleChange = (field, newContent) => {
        this.setState({ [field]: newContent.target.value });
    }

    render() {
        //email & password input
        return (
            <div className="entry-body">
                <div className="entry-page-header">
                    <h1>#thoughtCloud</h1>
                    {/* <h4>Are you are Teacher?</h4> */}
                </div>
                <div className="login-form">
                <h2>SIGN UP</h2>
                    <input type="text" placeholder="First name" required value={this.state.firstName} onChange={(content) => this.handleChange("firstName", content)} />
                    <input type="text" placeholder="Last name" required value={this.state.lastName} onChange={(content) => this.handleChange("lastName", content)} />
                    <input type="text" placeholder="Account Type" required value={this.state.accountType} onChange={(content) => this.handleChange("accountType", content)} hidden />
                    <input type="email" placeholder="email" required value={this.state.email} onChange={(content) => this.handleChange("email", content)} />
                    <input type="password" placeholder="password" required value={this.state.password} onChange={(content) => this.handleChange("password", content)} /><br />
                    {/* This will be activated if the sign up button is clicked */}

                    <button className="login-button" onClick={this.signUp} >Sign Up</button>
                    <a name="login-button" onClick={() => window.location = "/login"}>Login</a>

                </div>
            </div>
        );
    }


}