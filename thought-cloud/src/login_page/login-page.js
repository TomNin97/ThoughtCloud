import React from 'react';
import ReactDOM from 'react-dom';


export class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName : props.firstName ?? "Mike",
            lastName : props.lastName ?? "",
            accountType : props.accountType ?? "student",
            email: props.email ?? "",
            password: props.password ?? "",
            isLoggedIn: props.isLoggedIn ?? false
        }
    }

    //this tries to login the user
    login = () => {
        alert("logging in with " + this.state.password);
    }

    signUp = () => {
        alert("signing up with " + this.state.password);
    }

    //updates state email and password value
    handlePasswordChange = (newPassword) => {
        this.setState({ "password": newPassword.target.value });
    }

    handleEmailChange = (newEmail) => {
        this.setState({ "email": newEmail.target.value })
    }

    handleChange = (field, newContent)=> {
        this.setState({[field]: newContent.target.value});
    }

    render() {
        //email & password input
        return (
            <div>
                <div className="login-page-header">
                    <h1>ThoughtCloud</h1>
                </div>
                <div className="login-form">
                    <form action="/">
                        <label>First name</label>
                        <input type="text" required value={this.state.firstName} onChange={(content)=> this.handleChange("firstName", content)} /><br />

                        <label>Last name</label>
                        <input type="text" required value={this.state.lastName} onChange={(content)=> this.handleChange("lastName", content)} /><br />

                        <label>Account Type</label>
                        <input type="text" required value={this.state.accountType} onChange={(content)=> this.handleChange("accountType", content)} /><br />

                        <label>email</label>
                        <input type="email" required value={this.state.email} onChange={(content)=>this.handleChange("email", content)} /><br />
                        <label>password</label>
                        <input type="password" required value={this.state.password} onChange={(content)=> this.handleChange("password", content)} /><br />
                        {/* This will be activated if the sign up button is clicked */}
                        <div className="login-button-wrapper">
                            <button name="login-button" onClick={this.login}>Login</button>
                        </div>
                        <div className="sign-up-button-wrapper">
                            <button name="sign-up-button" onClick={this.signUp} >Sign Up</button>

                        </div>
                    </form>
                </div>
            </div>
        );
    }


}