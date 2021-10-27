import React from 'react';
import { CustomButton, Header, ClassButton } from '../shared-components/shared-components.js';


export class DashBoard extends React.Component {


    //temporary data for the available class:
    createdClasses = ["Database Management", "Parallel Processing", "Artifical Intelligence", "Database Management", "Parallel Processing", "Artifical Intelligence", "Database Management", "Parallel Processing", "Artifical Intelligence"];

    constructor(props) {
        super(props);
        this.state = {
            isTeacher: props.isTeacher,

        }
    }

    onClassButtonClicked(className = "No class", classId) {
        alert(" Simulating going to class " + className.toString() + "with id: " + classId)
    }


    render() {
        return (
            <div>
                < Header title={!this.state.isTeacher ? "Teacher DashBoard" : "Student DashBoard"} />
                <div className="subsection-title">
                    <CustomButton title="Add New Class" />
                    <h2>Owned Classes</h2>
                </div>
                <div className="avaialble-class-list">
                    <ul>
                        {this.createdClasses.map(classItem => <ClassButton title={classItem} onClick={() => this.onClassButtonClicked(classItem, 0)} />)}
                    </ul>
                </div>
            </div>
        );
    }
}




