import React from "react";
import uuid from 'react-uuid';
import Alerts from './alerts.js';
import { getData } from './api.js';

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            message: "",
            status: "",
            requestId: ""
        };
    }

    //Appeler HandleGetData when Table appears
    componentDidMount() {
        this.handleGetData();
    }

    //AppelerHandleGetData when tebleKey change
    componentDidUpdate(prevProps) {
        if (prevProps.statsKey !== this.props.statsKey) {
            this.handleGetData();
        }
    }

    //GetData from BDD
    handleGetData = () => {
        getData()
            .then((data) => {
                this.setState({ data });
            })
            .catch((error) => {
                this.setState({
                    message: error.message,
                    status: 500,
                    requestId: uuid()
                });
            });
    };

    totalKids = () => {
        return this.state.data.reduce((acc, current) => {
            return acc + current.kids;
        }, 0);
    };

    render() {
        console.log("Refresh Table");
        return (
            <div>
                <div>
                    <Alerts message={this.state.message} status={this.state.status} requestId={this.state.requestId} />
                </div>
                <div className="statistiques">
                    <p>Numbers of UID : {this.state.data.length}</p>
                    <p>Sum of kids : {this.totalKids()}</p>
                </div>
            </div>
        );
    }
}

export default Stats;
