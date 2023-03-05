import React from "react";
import uuid from 'react-uuid';
import Alerts from './alerts.js';
import Chart from 'chart.js/auto';
import { getData } from './api.js';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataChart: [],
      message: "",
      status: "",
      requestId: ""
    };
    this.myChartInstance = null;
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleGetData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.myChartInstance) {
      this.myChartInstance.destroy();
    }
  }
  //Redimensionner le chart
  handleResize = () => {
    const canvas = document.getElementById('myChart');
    const parent = canvas.parentNode;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    if (this.myChartInstance) {
      this.myChartInstance.destroy();
      this.myChartInstance = null; // Réinitialiser la référence de l'instance
    }
    this.drawChartInstance(this.state.dataChart);
  };
  
  
  //Appeler HandleGetData when tebleKey change
  componentDidUpdate(prevProps) {
    if (prevProps.graphKey !== this.props.graphKey) {
      this.handleGetData();
    }
  }

  drawChartInstance = (counts) => {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (this.myChartInstance) { // Vérifier si une instance de Chart existe déjà
      this.myChartInstance.destroy(); // Détruire l'instance précédente avant de créer une nouvelle instance
    }
    this.myChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: Array.from({ length: 24 }).map((_, i) => {
          return {
            label: `${i}h-${i+1}h`,
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
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  drawChart = (data) => {
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
    this.setState({ dataChart: counts });
    this.drawChartInstance(counts);
  }

  handleGetData = () => {
    getData()
      .then((data) => {
        this.drawChart(data);
      })
      .catch((error) => {
        this.setState({
          message: error.message,
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
