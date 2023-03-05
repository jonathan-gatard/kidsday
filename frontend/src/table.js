import React from "react";
import uuid from 'react-uuid';
import moment from 'moment';
import Alerts from './alerts.js';
import { getData, deleteData } from './api.js';

class Table extends React.Component {
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

  //GetData from BDD
  handleGetData = () => {
    getData()
      .then((data) => {
        this.setState({ data });
      })
      .catch((error) => {
        this.setState({
          message: "Erreur lors de la récupération des données : " + error.message,
          status: 500,
          requestId: uuid()
        });
      });
  };

  //Delete data from BDD
  handleDelete = (id, uid, kids) => {
    deleteData(id)
      .then((response) => {
        this.setState({
          message: uid + " and " + kids + " kids deleted !",
          status: 200,
          requestId: uuid()
        });
        this.handleGetData();
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          message: "Erreur lors de la suppression des données : " + error.message,
          status: 500,
          requestId: uuid()
        });
      });
  };
  

  render() {
    console.log("Refresh Table");
    return (
      <div>
        <div>
          <Alerts message={this.state.message} status={this.state.status} requestId={this.state.requestId} />
        </div>
        <div className="historique">
          <table>
            <tbody>
              {(this.state.data).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map((item) => (
                <tr key={item._id}>
                  <td>{item.uid}</td>
                  <td>{item.kids}</td>
                  <td>{moment(item.updatedAt).format("DD/MM/YYYY - HH[:]mm[:]ss")}</td>
                  <td><span className="redcross" onClick={() => this.handleDelete(item._id, item.uid, item.kids)}>X</span></td>
                </tr>

              ))}
            </tbody>
          </table>
        </div>
      </div >
    );
  }
}

export default Table;
