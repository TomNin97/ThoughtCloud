import Calender from 'react-calendar';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SessionItems } from '../backend-request/session-items';
import {FaBeer} from "react-icons/fa";
import {AiFillDelete} from "react-icons/ai";
import "../shared-components/shared-components.css";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

const sessionItems = new SessionItems();
const CustomButton = (props) => {
    return (
        <div className="button-wrapper">
            <button className="button" onClick={props.onClick}> {props.title}</button>
        </div>
    );
}

const Header = (props) => {
    return (
        <div className="header-wrapper">

            <h1 className = "header-title">{props.title}</h1>
            <div className="page-selection-section" style={{ display: "flex" }}>
                <MainPageButtons title="Home" propRoute='/dashboard' />
                {/*<MainPageButtons title="Account" propRoute='/account' />*/}

                {sessionItems.getItem("ID") == null ? <MainPageButtons title="Log In" propRoute="/login" /> : null}
                {sessionItems.getItem("ID") == null ? <MainPageButtons title="Sign Up" propRoute="/signup" /> : null}
                {sessionItems.getItem("ID") != null ? <MainPageButtons title="Sign Out" propRoute="/login" onClick={()=>localStorage.clear()} /> : null}

            </div>
            <br />
            <br />
        </div>
    );
}

const SearchBar = (props) => {
    function filter() {
    }

    return (
        <input id="searchbar" onkeyup="filter()" type="text" name="search" placeholder="Search"></input>
    );
}

const ClassButton = (props) => {
    console.log(props.delete);
    return (
        <div className="class-button-wrapper " >
           <div onClick={props.onClick} >
           {props.title} 
           </div>
         { props.delete != null ?  <div onClick = {()=> {
             console.log("dleete clicked");
             props.delete()}} ><AiFillDelete className = "delete" onClick = {props.delete}/> </div>: null}
        </div>
    );
}

const MainPageButtons = (props) => {
    return (
        <div className="button-wrapper">
            <Link to={props.propRoute}><button onClick={props.onClick}>{props.title}</button></Link>
        </div>
    );
}

const Cal = (props) => {

    function onDateClick(arg) {
        console.log("CLickeddd");
        console.table(arg);
        const modal =  document.getElementById("add-event-modal");
        document.getElementById("grabbed-date").innerHTML = arg.dateStr;
      if(isTeacher()) modal.hidden = false;
    }


    return (
        <div>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={[
                   ...props.events.map(e => {
                        return { title: e.eventTitle, date: e.eventDate }
                    }) ?? []

                ]}
                dateClick={onDateClick}

            />
        </div>
    );
}

const CalenderComponent = (props) => {
    return (
        <div className="calender-plugin-wrapper">
            <Cal events={props.events}  />
        </div>
    );
}


function AddEventModal(props) {

    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [dateTime, setDate] = useState()


    
    var addEvent = async () => {
       const result = await  props.courseRequests.addEvent(title, description, dateTime, props.course);
       if(result) {
           alert("success!");
           closeModal();
           props.reloadEvents(props.course);
       }
       else {
           alert("An error occured");
       }
    }

    const closeModal = () => {
        document.getElementById("add-event-modal").hidden = true;
    }




    return (

        <div id="add-event-modal" className="event-modal" hidden={true} >
            <div>
                <div>
                    <h2>Add New Event </h2>
                    <label>Event Title</label>
                    <input id = "event-title" type="text"  required value = {title} onChange= {(value) => setTitle(value.target.value)} name="eventTitle" />
                    {/* <label>Description</label>
                    <textarea id = "event-description" type="text"  value = {description}  onChange= {e=> setDescription(e.target.value)} line-height= "50px" name="eventDescription" /> */}
                    <label>Date</label><h1 id= "grabbed-date" hidden ></h1>
                    <input id = "event-date"  value = {dateTime} onChange = {(value)=>{
                        console.log(typeof(value.target.value));
                        setDate(value.target.value)
                    }} type="datetime-local" />
                   <span>
                   <button onClick={addEvent}>Add new Event</button>
                    <button id="close-modal" onClick={closeModal}>Return</button>
                   </span>
                </div>
            </div>
        </div>
    )
}


const isTeacher = ()=>localStorage.getItem("type") == "teacher";



export { CustomButton, Header, ClassButton, CalenderComponent, MainPageButtons, SearchBar, AddEventModal , isTeacher};






