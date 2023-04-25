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
  const [jsonData, setJsonData] = useState();

  const API_Key = process.env.REACT_APP_api_key;
  const url = new URL("http://api.openweathermap.org/geo/1.0/zip");

  const HandleClick = () => {
    url.searchParams.delete("zip");
    url.searchParams.delete("appid");

    url.searchParams.append("zip", zip);
    url.searchParams.append("appid", API_Key);

    alert(API_Key);
    fetch(url)
      .then((result) => result.json())
      .then((data) => setJsonData(data.results));
  };

  const change = (event) => {
    setZip(event.target.value);
  };

  return (
    <>
      <input value={zip} onChange={change} />
      <button onClick={() => HandleClick()}>Submit</button>
      <p>Data is here: {jsonData}</p>
    </>
  );
}

export default App;
