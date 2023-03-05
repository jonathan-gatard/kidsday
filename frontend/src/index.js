
import React from "react";
import { createRoot } from 'react-dom/client';
import "./index.css";
import Form from './form.js';
import Table from './table.js';
import Graph from './graph.js';
import Stats from './stats.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableKey: 0,
      graphKey: 0
    };
  }

  render() {
    console.log("Refresh App");
    return (
      <div>
        <Form handleRefreshTable={this.setState(prevState => ({ tableKey: prevState.tableKey + 1 }))}/>
        <Stats/>
        <Graph handleRefreshGraph={this.setState(prevState => ({ tableKey: prevState.graphKey + 1 }))}/>
        <Table key={this.state.tableKey}/>
      </div>
    );
  }
}

const root = createRoot(document.getElementById('root'));
root.render(<App/>);