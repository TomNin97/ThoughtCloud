import React from 'react';
import ReactDOM from 'react-dom';
import { UserRequests } from '../backend-request/user-request';
import { Route, Switch } from 'react-router-dom';
import { DashBoard } from '../account_page/account_page';
import "../login_page/login-page.css"


export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.userRequests = new UserRequests();

        this.state = {
            email: props.email ?? "",
            password: props.password ?? "",
            isLoggedIn: props.isLoggedIn ?? false,
            authenticated: props.authenticated ?? false
        }
    }

    //this tries to login the user
    login = async () => {
        const success = await this.userRequests.loginUser(this.state.email, this.state.password);

        if (success) {
            console.log("Sucesss!!!!");
            window.location = '/dashboard';
        }
        else {
            alert("Try again!!!!!");
        }
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
            <div className="entry-body">
                <div className="entry-page-header">
                    <h1>#thoughtCloud</h1>
                </div>
                <div className="login-form">
                    <h2>LOGIN</h2>
                    <input type="email" placeholder="email" required value={this.state.email} onChange={(content) => this.handleChange("email", content)} />

                    <input type="password" placeholder="password" required value={this.state.password} onChange={(content) => this.handleChange("password", content)} />
                    {/* This will be activated if the sign up button is clicked */}

                    <button className="login-button" onClick={this.login}>Login</button>
                    <a name="sign-up-button" onClick={() => window.location = "/signup"}>Sign Up</a>
                </div>

            </div>
        );
    }


}