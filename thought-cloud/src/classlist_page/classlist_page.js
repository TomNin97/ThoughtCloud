import React from "react";
import CourseRequests from "../backend-request/course-request";

function MemberItem(props) {

    return (
        <div className="member-item" style={{ display: "flex" ,backgroundColor : "brown", margin : "5px", border : "2 solid", width : "80vw"}}>
           <div style = {{width : "77vw"}}>
           <h1>{props.member.name}</h1>
           </div>
            <button>Remove</button>
        </div>
    )
}

export class ClassListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            course : props.course,
            classList: ["Mike", "Caleb", "Joe", "Random somebody", "Another rand", "Randy","Mike", "Caleb", "Joe", "Random somebody", "Another rand", "Randy","Mike", "Caleb", "Joe", "Random somebody", "Another rand", "Randy"]
        }

        this.courseRequests = new CourseRequests();
            console.log("Course is ");
            console.table(this.state.course);
        this.courseRequests.getClasslist(this.state.course).then ((value)=>{
            this.setState({"classList" : value});
        })

    }



    render() {
        return (
            <div className="classlist-page-wrapper">
                {
                    <div style={{ display: "flex", flexDirection : "column", justifyContent :"center", alignItems : "center" }}>
                    {this.state.classList.length != 0 ?  this.state.classList.map(e => <MemberItem member={{"name" :e}} /> ) : "No Members Yet"}

                    </div>
                }
            </div>
        )
    }
}