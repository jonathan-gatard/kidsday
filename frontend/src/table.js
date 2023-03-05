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
      requestId: "",
      currentPage: 1,
      itemsPerPage: 12
    };
  }

  //Appeler HandleGetData when Table appears
  componentDidMount() {
    this.handleGetData();
  }

  //Appeler HandleGetData when tebleKey change
  componentDidUpdate(prevProps) {
    if (prevProps.tableKey !== this.props.tableKey) {
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
        this.props.onDeleteDataSuccess();
      })
      .catch((error) => {
        this.setState({
          message: error.message,
          status: 500,
          requestId: uuid()
        });
      });
  };

  handleClick = (event) => {
    this.setState({
      currentPage: Number(event.target.id),
    });
  };


  render() {
    const { data, currentPage, itemsPerPage } = this.state;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map((number) => {
      return (
        <li key={number} id={number} onClick={this.handleClick} className={currentPage === number ? "highlight" : ""}>
          {number}
        </li>
      );
    });
    console.log("Refresh Table");
    return (
      <div>
        <div>
          <Alerts message={this.state.message} status={this.state.status} requestId={this.state.requestId} />
        </div>
        <div className="historique">
          <table>
          <thead>
          <tr>
                  <td className="col1">UID</td>
                  <td className="col2">Kids</td>
                  <td className="col3">Last update</td>
                  <td className="col4"></td>
                </tr>
          </thead>
            <tbody>
              {data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(indexOfFirstItem, indexOfLastItem).map((item) => (

                <tr key={item._id}>
                  <td className="col1">{item.uid}</td>
                  <td className="col2">{item.kids}</td>
                  <td className="col3">{moment(item.updatedAt).format("DD/MM/YYYY - HH[:]mm[:]ss")}</td>
                  <td className="col4"><span className="redcross" onClick={() => { this.handleDelete(item._id, item.uid, item.kids); }}>X</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ulcontent">
            <ul id="page-numbers">{renderPageNumbers}</ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
