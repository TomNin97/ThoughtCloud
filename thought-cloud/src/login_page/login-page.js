import React from 'react';
import ReactDOM from 'react-dom';
import { UserRequests } from '../backend-request/user-request';



export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.userRequests = new UserRequests();

        this.state = {
            email: props.email ?? "",
            password: props.password ?? "",
            isLoggedIn: props.isLoggedIn ?? false
        }
    }

    //this tries to login the user
    login = () => {
        alert("logging in with " + this.state.password);

    }


    //updates state email and password value
    handlePasswordChange = (newPassword) => {
        this.setState({ "password": newPassword.target.value });
    }

    handleEmailChange = (newEmail) => {
        this.setState({ "email": newEmail.target.value })
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
                    <label>UAkron Email</label>
                    <input type="email" required value={this.state.email} onChange={(content) => this.handleChange("email", content)} /><br />
                    <label>password</label>
                    <input type="password" required value={this.state.password} onChange={(content) => this.handleChange("password", content)} /><br />
                    {/* This will be activated if the sign up button is clicked */}
                    <div className="login-button-wrapper">
                        <button name="login-button" onClick={this.login}>Login</button>
                    </div>
                </div>
            </div>
        );
    }


}