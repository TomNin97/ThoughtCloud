import React from 'react';
import ReactDOM from 'react-dom';
import { UserRequests } from '../backend-request/user-request';



export class SignUpPage extends React.Component {
    constructor(props) {
        super(props);
        this.userRequests = new UserRequests();

        this.state = {
            userId: props.firstName ?? "",
            firstName: props.firstName ?? "Mike",
            lastName: props.lastName ?? "",
            accountType: props.accountType ?? "student",
            email: props.email ?? "",
            password: props.password ?? "",
            isLoggedIn: props.isLoggedIn ?? false
        }
    }

    //this tries to login the user
    login = () => {
        alert("logging in with " + this.state.password);

    }

    signUp = async () => {
        console.log("Siging up 29");
        await this.userRequests.createUser(this.state.firstName, this.state.lastName, this.state.email, this.state.password, "student");
        alert("signing up with " + this.state.password);
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

                    <label>UanetID</label>
                    <input type="number" required value={this.state.userId} onChange={(content) => this.handleChange("userId", content)} /><br />

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
                    <div className="login-button-wrapper">
                        <button name="login-button" onClick={this.login}>Login</button>
                    </div>
                    <div className="sign-up-button-wrapper">
                        <button name="sign-up-button" onClick={this.signUp} >Sign Up</button>
                    </div>
                </div>
            </div>
        );
    }


}