import Calender from 'react-calendar';
import React, { useState } from 'react';

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
            <h1>{props.title}</h1>
        </div>
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
            <button onClick = {props.onClick}>{props.title}</button>
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

export { CustomButton, Header, ClassButton, CalenderComponent,MainPageButtons };





