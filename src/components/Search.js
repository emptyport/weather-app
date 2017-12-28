import React, { Component } from 'react';
import axios from 'axios';
import '../assets/Search.css';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 0.0,
      lon: 0.0,
      unit: 'F',
      icon: '',
      tempC: null,
      tempF: null,
      city: "",
    }

    this.setLocation = this.setLocation.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.tempConvert = this.tempConvert.bind(this);
    this.toggleTemp = this.toggleTemp.bind(this);
  }

  toggleTemp() {
    var newUnit = this.state.unit === "C" ? "F" : "C";
    this.setState(function() {
      return {
        unit: newUnit
      }
    });
  }

  getWeather() {
    var self = this;
    var url = "https://fcc-weather-api.glitch.me/api/current";
    axios.get(url, {
      params: {
        lat: this.state.lat,
        lon: this.state.lon
      }
    })
    .then(function(response) {
      var data = response.data;
      var tempC = data.main.temp;
      var tempF = self.tempConvert(tempC);
      self.setState(function() {
        return {
          tempC: Math.round(tempC),
          tempF: Math.round(tempF),
          city: data.name,
          icon: data.weather[0].icon,
        }
      });
    })
    .catch(function(error) {
      console.log("error");
      console.log(error);
    });

  }

  tempConvert(tempC) {
    var tempF = tempC * 9 / 5 + 32;
    return tempF;
  }

  setLocation(pos) {
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
    this.setState(function() {
      return {
        lat: latitude,
        lon: longitude
      }
    });

    this.getWeather();
  }

  componentDidMount() {    
    navigator.geolocation.getCurrentPosition(this.setLocation);
  }

  render () {
    return (
      <div>

        <div className="weatherArea">
          The temperature is&nbsp;
          { this.state.unit === 'F' &&
            this.state.tempF
          }
          { this.state.unit === 'C' &&
            this.state.tempC
          }
          &deg;{this.state.unit} in {this.state.city}
        </div>

        <div className="iconArea">
          <img src={this.state.icon} alt="Weather icon"></img>
        </div>

        <div className="tempLabel">
          F
        </div>
        <label className="switch">
          <input type="checkbox" onClick={this.toggleTemp} />
          <span className="slider round"></span>
        </label>
        <div className="tempLabel">
          C
        </div>
        
      </div>
    )
  }
}

export default Search;