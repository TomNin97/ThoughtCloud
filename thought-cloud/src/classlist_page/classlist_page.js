import React from "react";
import CourseRequests from "../backend-request/course-request";
import { UserRequests } from "../backend-request/user-request";
import { useState } from "react";
import "../classlist_page/classlist_page.css";

const userRequests = new UserRequests();
const courseRequests = new CourseRequests();

function MemberItem(props) {
  return (
    <div className="member-item">
      <div className="name-wrapper">
        <h1>{props.member.name}</h1>
      </div>
      <button>Remove</button>
    </div>
  );
}

function SearchResultItem(props) {
  const addUser = async () => {
    const member = props.member;
    const result = await courseRequests.addUserToClass(
      member.ID,
      member.firstName,
      member.lastName,
      props.course
    );

    if (result) {
      alert("successs!");
    } else {
      alert("failed to add user!");
    }
  };
  return (
    <div
      className="result-item"
      style={{
        display: "flex",
        backgroundColor: "brown",
        margin: "5px",
        border: "2 solid",
        width: "30vw",
        height: "10vh",
      }}
    >
      <div style={{ width: "25vw" }}>
        <p>{props.member.firstName + " " + props.member.lastName}</p>
      </div>
      <button onClick={addUser}>Add</button>
    </div>
  );
}

function AddMemberModal(props) {
  const [result, setState] = useState([]);
  var query = async () => {
    const inputElement = document.getElementById("member-search");
    var tempResult = await userRequests.findUsers(inputElement.value);
    if (tempResult != null) {
      setState(tempResult);
    }
  };

  return (
    <div id="member-modal" className="add-member-modal" hidden={true}>
      <h2>New Member </h2>
      <span>
        <input id="member-search" type="text" />
        <button onClick={query}>Search</button>
      </span>

      <div className="search-result">
        {result.map((e) => (
          <SearchResultItem member={e} course={props.course} />
        ))}
      </div>

      <button
        id="close-modal"
        onClick={() => {
          document.getElementById("member-modal").hidden = true;
        }}
      >
        Return
      </button>
    </div>
  );
}

export class ClassListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      course: props.course,
      classList: [
        "Mike",
        "Caleb",
        "Joe",
        "Random somebody",
        "Another rand",
        "Randy",
        "Mike",
        "Caleb",
        "Joe",
        "Random somebody",
        "Another rand",
        "Randy",
        "Mike",
        "Caleb",
        "Joe",
        "Random somebody",
        "Another rand",
        "Randy",
      ],
    };

    console.log("Course is ");
    console.table(this.state.course);
    courseRequests.getClasslist(this.state.course).then((value) => {
      this.setState({ classList: value });
    });
  }

  addNewMember() {
    const modal = document.getElementById("member-modal");
    modal.hidden = !modal.hidden;
  }

  render() {
      return (
        <div className="classlist-page-wrapper">
          <button onClick={this.addNewMember}>Add New Member</button>
          {
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.classList.length != 0
                ? this.state.classList.map((e) => (
                    <MemberItem
                      member={{ name: e.firstName + " " + e.lastName }}
                    />
                  ))
                : "No Members Yet"}
            </div>
          }

          <AddMemberModal course={this.state.course} />
        </div>
      );
  }
}
