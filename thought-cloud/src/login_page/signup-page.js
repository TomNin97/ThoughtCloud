import React from 'react';
import ReactDOM from 'react-dom';
import { UserRequests } from '../backend-request/user-request';



export class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.userRequests = new UserRequests();

        this.state = {
            userId: props.id ?? "",
            firstName: props.firstName ?? "Mike",
            lastName: props.lastName ?? "",
            accountType: props.accountType ?? "student",
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

            const isSuccess = await this.userRequests.createUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password, "student",id);
            if (isSuccess) {
                console.log("sucesssfully created account");
                window.location ='/dashboard';
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
            <div>
                <div className="login-page-header">
                    <h1>ThoughtCloud</h1>
                </div>
                <div className="login-form">
                    <label>First name</label>
                    <input type="text" required value={this.state.firstName} onChange={(content) => this.handleChange("firstName", content)} /><br />

                    <label>Last name</label>
                    <input type="text" required value={this.state.lastName} onChange={(content) => this.handleChange("lastName", content)} /><br />

                    <label>Account Type</label>
                    <input type="text" required value={this.state.accountType} onChange={(content) => this.handleChange("accountType", content)} /><br />

                    <label>email</label>
                    <input type="email" required value={this.state.email} onChange={(content) => this.handleChange("email", content)} /><br />
                    <label>password</label>
                    <input type="password" required value={this.state.password} onChange={(content) => this.handleChange("password", content)} /><br />
                    {/* This will be activated if the sign up button is clicked */}

                    <div>
                        <div className="sign-up-button-wrapper">
                            <button name="sign-up-button" onClick={this.signUp} >Sign Up</button>
                        </div>
                        <div className="login-button-wrapper">
                            <button name="login-button" onClick={() => window.location = "/login"}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}