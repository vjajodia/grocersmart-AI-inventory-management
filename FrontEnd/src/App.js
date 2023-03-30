import React from "react";
import { GoogleCharts } from "google-charts";
import NavBar from "./components/navBar";
import Dashboard from "./components/dashboard";
import Login from "./components/login";
import "./App.css";
import { Route, Link, Switch, Router } from "react-router-dom";

import Predict from "./components/Predict";

function App() {
  let arr = [];
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const email = localStorage.getItem("email");
  return (
    <div className="App">
      <NavBar isLoggedIn={isLoggedIn} email={email} />
      <Switch>
        <Route exact path="/dashboard" component={Dashboard} />
        <Route exact path="/predict" component={Predict} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/" component={Dashboard} />
      </Switch>
    </div>
  );
  function toggleButtonState() {
    fetch("/getChartDetails")
      .then((res) => res.json())
      .then((data) => {
        arr = data.data;
        GoogleCharts.load(drawChart);
      });
    getOutletIdentifierFromTier("Tier 2");
  }
  function getOutletIdentifierFromTier(tierValue) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: tierValue }),
    };
    fetch("/getOutletNumberBasedOnTier", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        arr = data.data;
        console.log(arr);
      });
  }

  function drawChart() {
    // Standard google charts functionality is available as GoogleCharts.api after load
    //const data = GoogleCharts.api.visualization.arrayToDataTable(arr);
    const pie_1_chart = new GoogleCharts.api.visualization.ColumnChart(
      document.getElementById("chart1")
    );
    var data = GoogleCharts.api.visualization.arrayToDataTable(arr);
    var options = {
      width: "100%",
      height: 400,
      legend: { position: "bottom", maxLines: 3 },
      bar: { groupWidth: "75%" },
      isStacked: true,
    };
    pie_1_chart.draw(data, options);
  }
}

export default App;
