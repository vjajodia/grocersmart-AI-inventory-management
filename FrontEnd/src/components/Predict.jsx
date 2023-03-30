import React from "react";
import Select from "./common/Select";
import RangeSlider from 'react-bootstrap-range-slider';
import { Badge } from 'react-bootstrap';
import {Alert} from 'react-bootstrap';




var tier1_outlets = ["OUT049", "OUT046", "OUT019"];
var tier2_outlets = ["OUT045", "OUT035", "OUT017"];
var tier3_outlets = ["OUT027", "OUT013", "OUT018", "OUT010"];

class Predict extends React.Component {
  state = {
    data: {
      outletLocation: "",
      outletIdentifier: "",
      category: "",
      itemNumber: "",
      options: [],
      items: [],
      selectedItem: "",
      itemWeight: "",
      itemPrice: "",
      itemFatContent: "",
      itemVisibility: 0,
     
    },
    predictedValue: 0,
    showPrediction: false,
  };
  componentDidMount() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      window.location = "/login";
    }
  }
  handleOutletChangeFetchCategories = async (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outlet: e.currentTarget.value }),
    };
    let response = await fetch(
      "http://18.116.237.37:5000/getcategoryBasedOnOutletIdentifier",
      requestOptions
    );
    response = await response.json();
    console.log("category", response.data);
    data.options = response.data;
    this.setState({ data });
  };

  handleSelectCategory = async (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: e.currentTarget.value }),
    };
    let response = await fetch(
      "http://18.116.237.37:5000/getitemsBasedOnCategory",
      requestOptions
    );
    response = await response.json();
    console.log(response.data);
    data.items = response.data;
    this.setState({ data });
  };



  handleSelect = (e) => {

    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ data });
  };

  handleOutletIdentifier = () => {
    const data = { ...this.state.data };
    if (data.outletLocation === "Tier 1") {
      return tier1_outlets;
    } else if (data.outletLocation === "Tier 2") {
      return tier2_outlets;
    } else if (data.outletLocation === "Tier 3") {
      return tier3_outlets;
    } else {
      return [...tier1_outlets, ...tier2_outlets, ...tier3_outlets];
    }
  };

  getItemDetails = async (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemNumber: e.currentTarget.value }),
    };
    let response = await fetch(
      "http://18.116.237.37:5000/getItemDetails",
      requestOptions
    );
    response = await response.json();
    console.log(response.data);
    data.itemPrice = response.data.Item_MRP;
    data.itemWeight = response.data.Item_Weight;
    data.itemFatContent = response.data.Item_Fat_Content;
    data.itemVisibility = response.data.Item_Visibility;
    this.setState({ data });

  }

  callPredict = async () => {
    const data = { ...this.state.data };
    console.log(data);
    let requestJson = JSON.stringify({
      itemNumber: data.selectedItem,
      category: data.category,
      itemFatContent: data.itemFatContent,
      itemPrice: parseFloat(data.itemPrice),
      itemVisibility: parseFloat(data.itemVisibility),
      itemWeight: parseFloat(data.itemWeight),
      outletIdentifier: data.outletIdentifier,
      outletLocation: data.outletLocation
    });
    console.log(requestJson);
  

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestJson,
    };
  

    let response = await fetch("http://18.116.237.37:5000/getPrediction", requestOptions);
    response = await response.json();

    console.log(response);
    this.setState({
      predictedValue: response.data,
      showPrediction: true
    })


  }

  handleVisibilityChange = (e) => {
    console.log(e.target.value);
    this.setState({
      itemVisibility: parseInt(e.target.value)
    })
  }


  render() {
    console.log(this.state);
    const outletTypes = ["Tier 1", "Tier 2", "Tier 3"];
    return (
      <div style={{ paddingTop: '5%', paddingBottom: '5%' }}>
        <div className=" row container-fluid col-12">
          <div className="col-4">
            <div> <h4><Badge variant="success">
              Tier for Store
  </Badge> </h4></div>
            <Select
              name="outletLocation"
              value={this.state.data.outletLocation}
              onChange={this.handleSelect}
              options={outletTypes}
              default="Select Tier"
            />
          </div>
          <div className="col-4">
            <div> <h4><Badge variant="success">
              Outlet Name
  </Badge></h4></div>
            <Select
              name="outletIdentifier"
              value={this.state.data.outletIdentifier}
              onChange={this.handleOutletChangeFetchCategories}
              options={this.handleOutletIdentifier()}
              default="Select Outlet"
            />

          </div>
          <div className="col-4">
            <div> <h4> <Badge variant="success">
              Category of Product
  </Badge> </h4> </div>
            <Select
              name="category"
              value={this.state.data.category}
              onChange={this.handleSelectCategory}
              options={this.state.data.options}
              default="Select category"
            />
          </div>
        </div>
        <div className=" row container-fluid col-12">
          <div className="col-4">
            <div> <h4> <Badge variant="success">  Item Number</Badge> </h4></div>
            <Select
              name="selectedItem"
              value={this.state.data.selectedItem}
              onChange={this.getItemDetails}
              options={this.state.data.items}
              default="Select Items" />
          </div>
          <div className="col-4">
            <h4> <Badge variant="success">  Item Weight</Badge> </h4>
            <input className="form-select my-3" type="number" placeholder="Enter Item Weight" name="itemWeight" value={this.state.data.itemWeight} onChange={this.handleSelect} />
          </div>
          <div className="col-4">
            <h4> <Badge variant="success">  Item Price</Badge> </h4>
            <input className="form-select my-3" type="number" placeholder="Enter Item Price" name="itemPrice" value={this.state.data.itemPrice} onChange={this.handleSelect} />
          </div>

        </div>

        <div className="row col-12">

          <div className="slidecontainer" style={{ width: '100%' }}>
          <h4> <Badge variant="success">  Item Visibility</Badge> </h4>
            <input type="range" min="0" max="1" step={0.0001} value={this.state.data.itemVisibility} style={{ width: '30%' }} className="slider" name="itemVisibility" onChange={this.handleSelect} />
            <p>  <input type="number" placeholder="Enter Item Visibility" name="itemVisibility" value={this.state.data.itemVisibility} onChange={this.handleSelect} /> </p>
          </div>



        </div>

        <div className="row col-12" style={{ paddingLeft: '47%' }}>
          <button className="btn btn-success btn-lg" onClick={this.callPredict}> Predict </button>
        </div>

        <div className="row col-12" style={{paddingLeft: '35%', paddingTop: '2%'}} >
          {this.state.showPrediction && <Alert variant='success'>
       Predicted Sales for item {this.state.data.selectedItem} is {(this.state.predictedValue).toFixed(4)} thousand
  </Alert>}
        
        </div>



      </div>
    );
  }
}

export default Predict;
