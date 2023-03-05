
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
      graphKey: 0,
      statsKey: 0
    };
  }

  handleTableUpdate = () => {
    this.setState({
      tableKey: this.state.tableKey + 1,
    });
  };

  handleGraphUpdate = () => {
    this.setState({
      graphKey: this.state.graphKey + 1,
    });
  };

  handleStatsUpdate = () => {
    this.setState({
      statsKey: this.state.statsKey + 1,
    });
  };

  render() {
    console.log("Refresh App");
    return (
      <div>
        <Form
          onPostDataSuccess={() => {
            this.handleTableUpdate();
            this.handleGraphUpdate();
            this.handleStatsUpdate();
          }}
        //I don't call Table because the delete is managed in table and I can't manage refresh in the component
        />
        <Stats statsKey={this.state.statsKey} />
        <Graph graphKey={this.state.graphKey} />
        <Table
          tableKey={this.state.tableKey}
          onDeleteDataSuccess={() => {
            this.handleGraphUpdate();
            this.handleStatsUpdate();
          }} />
      </div>
    );
  }
}


const root = createRoot(document.getElementById('root'));
root.render(<App />);