import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const restbusURL = 'http://35.192.71.223';
const getMuniVehiclePrediction = (sid, vid, thisArg) => {
  console.log(`sid: ${sid}, vid: ${vid}`);
  return axios.get(`/agencies/sf-muni/stops/${sid}/predictions`, {
    baseURL: restbusURL
  })
    .then((response) => {
      const predictions = response.data;
      console.log(predictions);
      // for each route
      predictions.forEach((route) => {
       route.values.forEach((arrival) => {
         // check if arrival has the vehicle ID we want
         if(arrival.vehicle.id === vid) {
           console.log(arrival);
           thisArg.setState({prediction: arrival});
           return;
         }
       })
      });
    });
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      vid: '',
      sid: '1',
      prediction: null,
    };
  }
  render() {
    return (
      <div className="App">
        <h1 className="App-title">NextMuni My Vehicle Prediction</h1>
        <p className="App-intro">
          To get started, enter your Vehicle Number
        </p>
        <input value={this.state.vid} onChange={event => this.setState({vid: event.target.value.replace(/\D/,'')})}/>
        <p className="App-intro">
          Next, enter your Stop Number (5-digits)
        </p>
        <input value={this.state.sid} onChange={event => this.setState({sid: event.target.value.replace(/\D/,'')})}/>
        <p />
        <button
          style={{display: 'inline-block', background: '#367cba', fontSize: '16px', textAlign: 'center', color: '#FFFFFF'}}
          onClick={() => getMuniVehiclePrediction(this.state.sid, this.state.vid, this)}
        >
          Submit
        </button>
        <p />
        {this.state.prediction ? (
          <div>
            <p className="App-intro">
              Prediction
            </p>
            <p className="App-intro">
              {`${this.state.prediction.minutes} minutes and ${this.state.prediction.seconds - this.state.prediction.minutes*60} seconds`}
            </p>
            {this.state.prediction.affectedByLayover ? 
            (<p> - Vehicle hasn't yet departed terminal</p>)
            : null
            }
            {this.state.prediction.isScheduleBased ? 
            (<p> - prediction based on schedule rather than GPS location</p>)
            : null
            }
          </div>
        ) : null }
      </div>
    );
  }
}

export default App;
