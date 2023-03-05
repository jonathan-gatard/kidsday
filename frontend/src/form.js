import React from "react";
import Alerts from './alerts.js';
import { postData } from "./api.js";

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: "",
            kids: "",
            status: "",
            message: "",
            requestId: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Redefine state when values of inputs change
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value
        this.setState({ [name]: value });
    }

    //Post data when click on submit
    handleSubmit(event) {
        event.preventDefault();
        const { uid, kids } = this.state;
        postData(uid, kids)
            .then((response) => {
                console.log(response);
                this.setState({
                    requestId: response.headers["x-request-id"],
                    status: response.status,
                    message: "UID " + uid + " added with " + kids + " kids !",
                    uid: "",
                    kids: ""
                });
                this.props.handleRefreshTable();
            })
            .catch((error) => {
                this.setState({
                    requestId: error.response.data.requestId,
                    status: error.response.status,
                    message: error.response.data.message,
                });
            });
    }

    render() {
        console.log("Refresh Form");
        return (
            <div>
                <Alerts message={this.state.message} status={this.state.status} requestId={this.state.requestId} />
                <div className="formulaire">
                    <div className="form">
                        <form onSubmit={this.handleSubmit}>
                            <label htmlFor="uid">UID :</label>
                            <input type="text" id="uid" name="uid" required maxLength="8" value={this.state.uid} onChange={this.handleChange} />
                            <label htmlFor="kids">Kids :</label>
                            <input type="number" id="kids" name="kids" required maxLength="2" value={this.state.kids} onChange={this.handleChange} />
                            <button type="submit">Validate</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form