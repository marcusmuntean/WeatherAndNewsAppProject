import "./App.css";
import { useState, React } from "react";
import process from "process";

function App() {
  return (
    <>
      <header>Please Type in a Zip Code Below:</header>
      <Coordinates />
    </>
  );
}

function Coordinates() {
  const [zip, setZip] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const API_Key = process.env.REACT_APP_api_key;
  const url = new URL("http://api.openweathermap.org/geo/1.0/zip");

  const HandleClick = () => {
    url.searchParams.delete("zip");
    url.searchParams.delete("appid");

    url.searchParams.append("zip", zip);
    url.searchParams.append("appid", API_Key);

    fetch(url)
      .then((result) => result.json())
      .then((data) => {
        setLatitude(data.lat);
        setLongitude(data.lon);
      });
  };

  const change = (event) => {
    setZip(event.target.value);
  };

  return (
    <>
      <input value={zip} onChange={change} />
      <button onClick={() => HandleClick()}>Submit</button>
      <p>latitude: {latitude}</p>
      <p>longitude: {longitude}</p>
      <Weather lat={latitude} lon={longitude} />
    </>
  );
}

function Weather(props) {
  const [currentObj, setCurrentObj] = useState({});
  const [weatherObj, setWeatherObj] = useState({});
  const [hourlyArr, setHourlyArr] = useState([{}]);

  const API_Key = process.env.REACT_APP_api_key;
  const url = new URL("https://api.openweathermap.org/data/2.5/onecall");

  const HandleClick = () => {
    url.searchParams.delete("lat");
    url.searchParams.delete("lon");
    url.searchParams.delete("appid");

    url.searchParams.append("lat", props.lat);
    url.searchParams.append("lon", props.lon);
    url.searchParams.append("appid", API_Key);

    fetch(url)
      .then((result) => result.json())
      .then((data) => {
        setCurrentObj(data.current);
        setWeatherObj(data.current.weather[0]);
        setHourlyArr(data.hourly);
      });
  };

  return (
    <>
      <button onClick={() => HandleClick()}>Show Weather</button>
      <h1>Current Weather: {weatherObj.main}</h1>
      <h2>Description: {weatherObj.description}</h2>
      <h3>Temperature: {currentObj.temp}</h3>
      <h3>Feels like: {currentObj.feels_like}</h3>
      <h3>Clouds: {currentObj.clouds}</h3>
      <h3>Wind Speed: {currentObj.wind_speed}</h3>

      <h1>Next Day Hourly Forecast</h1>
      <Hourly hourlyArr={hourlyArr} />
    </>
  );
}

function Hourly(props) {
  return (
    <>
      <p>Hourly: {props.hourlyArr[0].pressure}</p>
    </>
  );
}

export default App;
