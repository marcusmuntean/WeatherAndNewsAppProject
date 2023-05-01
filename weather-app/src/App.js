import "./App.css";
import { useState, React, useEffect } from "react";
import process from "process";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

function App() {
  return (
    <>
      <Typography textAlign={"center"} variant="h4">
        Please Type in a Zip Code Below To Display The Weather:
      </Typography>
      <p> </p>
      <Coordinates />
      <News />
    </>
  );
}

function Coordinates() {
  const [zip, setZip] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [rendered, setRendered] = useState(0);

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
        setRendered(rendered + 1);
      });
  };

  const change = (event) => {
    setZip(event.target.value);
  };

  return (
    <>
      <div className="App">
        <TextField
          variant="outlined"
          label="Zip Code"
          value={zip}
          onChange={change}
        />
        <p></p>
        <Button variant="contained" onClick={() => HandleClick()}>
          Submit
        </Button>
      </div>
      <Weather lat={latitude} lon={longitude} rendered={rendered} />
    </>
  );
}

function Weather(props) {
  const [currentObj, setCurrentObj] = useState({});
  const [weatherObj, setWeatherObj] = useState({});
  const [hourlyArr, setHourlyArr] = useState([{}]);
  const [dailyArr, setDailyArr] = useState([{}]);

  const API_Key = process.env.REACT_APP_api_key;
  const url = new URL("https://api.openweathermap.org/data/2.5/onecall");

  const HandleWeatherCall = () => {
    if (!props.rendered) {
      return null;
    }

    var currentTime = new Date().getTime();
    while (currentTime + 50 >= new Date().getTime()) {}

    url.searchParams.delete("lat");
    url.searchParams.delete("lon");
    url.searchParams.delete("appid");
    url.searchParams.delete("units");

    url.searchParams.append("lat", props.lat);
    url.searchParams.append("lon", props.lon);
    url.searchParams.append("units", "imperial");
    url.searchParams.append("appid", API_Key);

    fetch(url)
      .then((result) => result.json())
      .then((data) => {
        setCurrentObj(data.current);
        setWeatherObj(data.current.weather[0]);
        setHourlyArr(data.hourly);
        setDailyArr(data.daily);
      });
  };

  useEffect(() => {
    HandleWeatherCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rendered]);

  let iconUrl;
  if (props.rendered) {
    iconUrl =
      "https://openweathermap.org/img/wn/" + weatherObj.icon + "@2x.png";
  }

  return (
    <>
      {props.rendered ? (
        <>
          <h1>
            <u>Current Weather</u>
          </h1>
          <Item>
            <Typography variant="h5">
              {weatherObj.main} - {weatherObj.description}
              <img
                src={iconUrl}
                width="50 px"
                height="50px"
                alt="Weather Icon"
              />
            </Typography>
            <h3>Temperature: {currentObj.temp} °F</h3>
            <h3>Feels like: {currentObj.feels_like} °F</h3>
            <h3>Cloudiness: {currentObj.clouds}%</h3>
            <h3>Wind Speed: {currentObj.wind_speed} mph</h3>
          </Item>

          <h1>
            <u>Next Day Hourly Forecast</u>
          </h1>

          <Grid container spacing={2}>
            {Object.keys(hourlyArr).map((hour) =>
              hour < 24 ? (
                <Grid m={3}>
                  <Item>
                    <Hourly hourObj={hourlyArr[hour]} hourNum={hour} />
                  </Item>
                </Grid>
              ) : (
                console.log()
              )
            )}
          </Grid>

          <h1>
            <u>Next Week Daily Forecast</u>
          </h1>
          {Object.keys(dailyArr).map((day) =>
            day < 7 ? (
              <Grid m={3}>
                <Item>
                  <Daily
                    dayObj={dailyArr[day]}
                    dayNum={day}
                    rendered={props.rendered}
                  />
                </Item>
              </Grid>
            ) : (
              console.log()
            )
          )}
        </>
      ) : (
        console.log()
      )}
    </>
  );
}

function Hourly(props) {
  let url;
  if (!props.hourObj.temp) {
    return null;
  }

  url =
    "https://openweathermap.org/img/wn/" +
    props.hourObj.weather[0].icon +
    "@2x.png";

  return (
    <>
      <h3>
        Hour {parseInt(props.hourNum) + 1}: {props.hourObj.weather[0].main} -{" "}
        {props.hourObj.weather[0].description}
        <img src={url} width="50 px" height="50px" alt="Weather Icon" />
      </h3>
      <p>
        Temperature: {props.hourObj.temp} °F, Feels Like:{" "}
        {props.hourObj.feels_like} °F
      </p>
      <p>Cloudiness: {props.hourObj.clouds}%</p>
      <p>Wind Speed: {props.hourObj.wind_speed} mph</p>
    </>
  );
}

function Daily(props) {
  let url;
  if (!props.dayObj.clouds) {
    return null;
  }
  if (props.rendered) {
    url =
      "https://openweathermap.org/img/wn/" +
      props.dayObj.weather[0].icon +
      "@2x.png";
  }
  return (
    <>
      {props.rendered ? (
        <>
          <h3>
            Day {parseInt(props.dayNum) + 1}: {props.dayObj.weather[0].main} -{" "}
            {props.dayObj.weather[0].description}
            <img src={url} width="50 px" height="50px" alt="Weather Icon" />
          </h3>
          <p>
            Temperature - Max: {props.dayObj.temp.max} °F, Min:{" "}
            {props.dayObj.temp.min} °F
          </p>
          <p>Cloudiness: {props.dayObj.clouds}%</p>
          <p>Wind Speed: {props.dayObj.wind_speed} mph</p>
        </>
      ) : (
        console.log()
      )}
    </>
  );
}

function News() {
  let url = new URL("https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json");
  const API_Key = process.env.REACT_APP_api_news;
  const [newsObj, setNewsObj] = useState([{}]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    url.searchParams.delete("api-key");
    url.searchParams.append("api-key", API_Key);

    fetch(url)
      .then((result) => result.json())
      .then((data) => {
        setNewsObj(data.results);
        setRendered(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {Object.keys(newsObj).map((num) =>
        num < 5 ? (
          <div className="App">
            <Article number={num} obj={newsObj[num]} rendered={rendered} />
            <Divider />
          </div>
        ) : (
          console.log()
        )
      )}
    </>
  );
}
let mediaMetadata = "media-metadata";

function Article(props) {
  return (
    <>
      <Grid>
        <h2>{props.obj.title}</h2>
        <p>{props.obj.abstract}</p>
        <p>
          <i>{props.obj.byline}</i>
        </p>

        {props.rendered ? (
          <img alt="News" src={props.obj.media[0][mediaMetadata][2].url}></img>
        ) : (
          console.log()
        )}

        <p>
          Source:{" "}
          <a href="/" style={{ cursor: "pointer" }}>
            {props.obj.url}
          </a>
        </p>
      </Grid>
    </>
  );
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default App;
