import React from 'react';
import { CalenderComponent, CustomButton } from '../shared-components/shared-components';



export class CalenderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classId: props.classId
        }
    }


    render() {
        return (
            <div className="page-wrapper">
                <div className="subtitle-section">
                    <CustomButton title="Add Event" />
                    <h2>Calender</h2>
                    <CustomButton title="Remove Event" />
                </div>
                <br />
                <br />
                <div className="calender-wrapper">
                    <CalenderComponent />
                </div>
            </div>
        );
    }
}