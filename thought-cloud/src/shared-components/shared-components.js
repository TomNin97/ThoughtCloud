import Calender from 'react-calendar';
import React, { useState } from 'react';
import {Link} from 'react-router-dom';

const CustomButton = (props) => {
    return (
        <div className="button-wrapper">
            <button className="button" onClick={props.onClick}>{props.title}</button>
        </div>
    );
}

const Header = (props) => {
    return (
        <div className="header-wrapper">
            <h1> {props.title} </h1>
            <div className = "page-selection-section">
                <MainPageButtons title = "Home" propRoute = '/'/>
                <MainPageButtons title = "Notes" propRoute = '/notes'/>
                <MainPageButtons title = "Class List"/>
                <MainPageButtons title = "Account" propRoute = '/account'/>
                <MainPageButtons title = "Log In" propRoute = "/login"/>
                <MainPageButtons title = "Sign Up" propRoute = "/signup"/>
            </div>
            <br/>
            <br/>
        </div>
    );
}

const SearchBar = (props) => {
    function filter() {
    }

    return(
        <input id="searchbar" onkeyup="filter()" type="text" name="search" placeholder="Search"></input>
    );
}

const ClassButton = (props) => {
    return (
        <div className="class-button-wrapper ">
            <button onClick={props.onClick}>{props.title}</button>
        </div>
    );
}

const MainPageButtons = (props) => {
    return (
        <div className = "button-wrapper">
            <Link to={props.propRoute}><button onClick = {props.onClick}>{props.title}</button></Link>
        </div>
    );
}


const CalenderComponent = (props) => {
    const [value, onChange] = useState(new Date());

    return (
        <div>
            <Calender onChange={onChange} value={value} />
        </div>
    );
}

export { CustomButton, Header, ClassButton, CalenderComponent,MainPageButtons, SearchBar };





