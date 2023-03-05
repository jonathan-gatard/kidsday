import React from "react";
import uuid from 'react-uuid';
import Alerts from './alerts.js';
import Chart from 'chart.js/auto';
import { getData } from './api.js';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      message: "",
      status: "",
      requestId: ""
    };
  }

  componentDidMount() {
    this.handleGetData();
  }

  handleGetData = () => {
    getData()
      .then((data) => {
        this.props.handleRefreshGraph();
        // Transform data
        const counts = {};
        data.forEach((entry) => {
          const date = new Date(entry.updatedAt);
          const day = date.toLocaleDateString();
          const hour = date.getHours();
          if (!counts[day]) {
            counts[day] = Array.from({ length: 24 }).map(() => 0);
          }
          counts[day][hour] += entry.kids;
        });
        console.log(counts);
        this.setState({ data: counts });
        // Draw chart
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: Object.keys(counts),
            datasets: Array.from({ length: 24 }).map((_, i) => {
              return {
                label: `${i}:00`,
                data: Object.keys(counts).map((day) => {
                  return counts[day][i] || 0;
                }),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
              };
            })
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      })
      .catch((error) => {
        this.setState({
          message: "Erreur lors de la récupération des données : " + error.message,
          status: 500,
          requestId: uuid()
        });
      });
  };
  
  

  render() {
    console.log("Refresh Chart");
    return (
      <div>
        <div>
          <Alerts message={this.state.message} status={this.state.status} requestId={this.state.requestId} />
        </div>
        <canvas id="myChart"></canvas>
      </div>
    );
  }
}

export default Graph;
