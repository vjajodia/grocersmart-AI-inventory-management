import React from "react";
import Select from "./common/Select";
import PieChart from "./pieChart";
import { isEmpty } from "lodash";
import OutletOverview from "../components/outletOverview";
import Autocomplete from "react-autocomplete";
import Table from "react-bootstrap/Table";
import Itemsales from "../components/itemsales";
import TierOverview from "../components/tierOverview";
import CategoryView from "../components/CategoryView";
import CategorySalesView from "../components/categorysales";

var tier1_outlets = ["OUT049", "OUT046", "OUT019"];
var tier2_outlets = ["OUT045", "OUT035", "OUT017"];
var tier3_outlets = ["OUT027", "OUT013", "OUT018", "OUT010"];
const tableData = [
  {
    id: "1",
    name: "Ghost in The Wires",
    author: "Kevin Mitnick",
    released: "08/15/2011",
  },
  {
    id: "2",
    name: "Console Wars",
    author: "Blake J. Harris",
    released: "05/13/2014",
  },
  {
    id: "3",
    name: "The Phoenix Project",
    author: "Gene Kim, Kevin Behr, George Spafford",
    released: "12/01/2017",
  },
];
class Dashboard extends React.Component {
  state = {
    data: {
      selectedoutletLocation: "",
      selectedoutletIdentifier: "",
      selectedCategory: "",
      itemNumber: "",
      overallSalesOfSelectedOutlet: [],
      overallSalesOfSelectedTier: {},
      overallSalesOfSelectedCategory: {},
      itemsInCategory: [],
    },
    value: '',
    itemIdentifier: [],
    tableData: [],
    itemsalesData: [],
    categorysalesData: []
  };
  baseState = { ...this.state };

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
    let response = await fetch("http://18.116.237.37:5000/getOutletOverview", requestOptions);
    response = await response.json();
    data.overallSalesOfSelectedOutlet = response;
    data.selectedCategory = "";
    data.overallSalesOfSelectedCategory = "";
    data.itemsInCategory = [];
    this.setState({ data, tableData: [], value: "" });
  };

  searchData = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "Item_no": this.state.value,
        "category": this.state.data.selectedCategory,
        "outlet": this.state.data.selectedoutletIdentifier
      }),
    };
    let response = await fetch("http://18.116.237.37:5000/getitemdetailbasedOnitem", requestOptions);
    response = await response.json();
    console.log(response)
    let tableData = response.data
    this.setState({ tableData })
  }
  searchsData = async (e) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "Item_no": this.state.value,
      }),
    };
    let response = await fetch("http://18.116.237.37:5000/compareitemsalesacrossoutlets", requestOptions);
    response = await response.json();
    let itemsalesData = [
      ['Outlet', 'Sales']
    ]
    for (let i = 0; i < response.data.length; i++) {
      let arr = [];
      arr.push(response.data[i].Outlet);
      arr.push(response.data[i].Sales);
      itemsalesData.push(arr)
    }
    this.setState({ itemsalesData })
  }

  handleTierlevelData = async (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: e.currentTarget.value }),
    };
    let response = await fetch("http://18.116.237.37:5000/getTierLevelOverview", requestOptions);
    response = await response.json();
    data.overallSalesOfSelectedTier = response;
    data.selectedCategory = "";
    data.selectedoutletIdentifier = "";
    data.overallSalesOfSelectedCategory = "";
    data.overallSalesOfSelectedOutlet = "";
    this.setState({ data, value: "" });
  };
  handleOutletIdentifier = () => {
    const data = { ...this.state.data };
    if (data.selectedoutletLocation === "Tier 1") {
      return tier1_outlets;
    } else if (data.selectedoutletLocation === "Tier 2") {
      return tier2_outlets;
    } else if (data.selectedoutletLocation === "Tier 3") {
      return tier3_outlets;
    } else {
      return [...tier1_outlets, ...tier2_outlets, ...tier3_outlets];
    }
  };
  handleCategoryLevelData = async (e) => {
    let currVal = e.currentTarget.value;
    const data = { ...this.state.data };
    data[e.currentTarget.name] = currVal;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        outlet: this.state.data.selectedoutletIdentifier,
        category: currVal,
      }),
    };
    let response = await fetch("http://18.116.237.37:5000/getItemFatContent", requestOptions);
    response = await response.json();
    console.log(response);
    data.overallSalesOfSelectedCategory = response;
    //this.setState({ data });


    //KEsiya code
    console.log(console.log(this.state))
    const requestOptionsTwo = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: currVal, outlet: this.state.data.selectedoutletIdentifier }),
    };
    let responseTwo = await fetch("http://18.116.237.37:5000/getitemnoBasedOnCategory", requestOptionsTwo);
    responseTwo = await responseTwo.json();
    let arr = [];
    for (let i = 0; i < responseTwo.data.length; i++) {
      let obj = {};
      obj["id"] = i;
      obj["label"] = responseTwo.data[i]
      arr.push(obj);
    }
    data.itemsInCategory = arr


    //New Code
    let categorysalesDataArray = [
      ['itemno', 'Sales']
    ]
    for (let i = 0; i < 5; i++) {
      let arr = [];
      arr.push(responseTwo.outletSales[i].itemno);
      arr.push(responseTwo.outletSales[i].sales);
      categorysalesDataArray.push(arr)
    }
    console.log(categorysalesDataArray)
    data.categorysalesData = categorysalesDataArray

    this.setState({ data, value: "", tableData: [], itemsalesData: [] });
  };
  render() {
    const outletTypes = ["Tier 1", "Tier 2", "Tier 3"];
    return (
      <div >

        <div className='bannerImage'></div>
        <div className="row container-fluid pr-0">
          <div className="col-3">
            <Select
              name="selectedoutletLocation"
              value={this.state.data.selectedoutletLocation}
              onChange={this.handleTierlevelData}
              options={outletTypes}
              default="Select Tier"
            />



          </div>
          <div className="col-3">
            <Select
              name="selectedoutletIdentifier"
              value={this.state.data.selectedoutletIdentifier}
              onChange={this.handleOutletChangeFetchCategories}
              options={this.handleOutletIdentifier()}
              default="Select Outlet"
              disabled={isEmpty(this.state.data.selectedoutletLocation)}
            />
          </div>
          <div className="col-3">
            <Select
              name="selectedCategory"
              value={this.state.data.selectedCategory}
              onChange={this.handleCategoryLevelData}
              options={Object.keys(
                this.state.data.overallSalesOfSelectedOutlet
              )}
              default="Select category"
              disabled={
                isEmpty(this.state.data.selectedoutletLocation) ||
                isEmpty(this.state.data.selectedoutletIdentifier)
              }
            />



          </div>
          <div className="col-2">
            <div class="input-group mt-3 autocomplete">
              <Autocomplete style="width:100%"
                items={this.state.data.itemsInCategory}
                shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
                getItemValue={item => item.label}
                renderItem={(item, highlighted) =>
                  <div style="width: 100%;" key={item.id} style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}>{item.label}</div>
                }
                value={this.state.value}
                onChange={e => this.setState({ value: e.target.value })}
                onSelect={value => this.setState({ value })}
                inputProps={{ placeholder: 'Select item number' }}
              />
            </div>
          </div>
          <div className="col-1 pl-0 pr-0">
            <button class="btn btn-block btn-success mt-3" onClick={this.searchData}> Search </button>
          </div>
        </div>
        <div className="row container-fluid pr-0">
          {!isEmpty(this.state.data.selectedoutletLocation) &&
            isEmpty(this.state.data.selectedoutletIdentifier) &&
            isEmpty(this.state.data.selectedCategory) && (
              <div className="col mt-5">
                <h6 className="heading">
                  Total Sales in outlets in{" "}
                  {this.state.data.selectedoutletLocation}
                </h6>
                <TierOverview
                  tierLtevelData={this.state.data.overallSalesOfSelectedTier}
                  tier={this.state.data.selectedoutletLocation}
                />
              </div>
            )}
          {!isEmpty(this.state.data.selectedoutletLocation) &&
            !isEmpty(this.state.data.selectedoutletIdentifier) &&
            !isEmpty(this.state.data.selectedCategory) &&
            isEmpty(this.state.tableData) && (
              <div className="col-6 mt-5">
                <h6 className="heading">
                  Sales of {this.state.data.selectedCategory} based on fat
                  content
                </h6>
                <CategoryView
                  data={this.state.data.overallSalesOfSelectedCategory}
                />
              </div>
            )}
          {!isEmpty(this.state.data.selectedoutletLocation) &&
            !isEmpty(this.state.data.selectedoutletIdentifier) &&
            !isEmpty(this.state.data.selectedCategory) &&
            isEmpty(this.state.tableData) && (
              <div className="col-6 mt-5">
                <h6 className="heading">
                  Top 5 Item Sales in {this.state.data.selectedCategory}
                </h6>
                <CategorySalesView data={this.state.data.categorysalesData} />
              </div>
            )}
          {isEmpty(this.state.data.selectedoutletLocation) &&
            isEmpty(this.state.data.selectedoutletIdentifier) &&
            isEmpty(this.state.tableData) && (
              <div className="col-12 mt-5">
                <h6 className="heading">Stores By Location</h6>
                <PieChart />
              </div>
            )}
          {!isEmpty(this.state.data.selectedoutletIdentifier) &&
            isEmpty(this.state.tableData) &&
            isEmpty(this.state.data.selectedCategory) && (
              <div className="col-12 mt-5">
                <h6 className="heading">
                  Total sales based on categories in{" "}
                  {this.state.data.selectedoutletIdentifier}
                </h6>
                <OutletOverview
                  data={this.state.data.overallSalesOfSelectedOutlet}
                />
              </div>
            )}

          {!isEmpty(this.state.tableData) &&
            !isEmpty(this.state.data.selectedoutletIdentifier) &&
            !isEmpty(this.state.data.selectedoutletLocation) &&
            !isEmpty(this.state.data.selectedCategory) &&
            !isEmpty(this.state.value) && (
              <div className="col-12 mt-5">
                <h6 className="heading">Details for {this.state.value}</h6>

                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Fat Content</th>
                      <th>Item Identifier</th>
                      <th>MRP</th>
                      <th>Outlet Sales</th>
                      <th>Item Type</th>
                      <th>Item Visibility</th>
                      <th>Item Weight</th>
                      <th>Outlet Estd Year</th>
                      <th>Outlet Identifier</th>
                      <th>Outlet Location Type</th>
                      <th>Outlet Size</th>
                      <th>Outlet Type</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.tableData.map((value, index) => {
                      return (
                        <tr>
                          <td>{value.Item_Fat_Content}</td>
                          <td>{value.Item_Identifier}</td>
                          <td>${value.Item_MRP}</td>
                          <td>${value.Item_Outlet_Sales}</td>
                          <td>{value.Item_Type}</td>
                          <td>{value.Item_Visibility}</td>
                          <td>{value.Item_Weight}</td>
                          <td>{value.Outlet_Establishment_Year}</td>
                          <td>{value.Outlet_Identifier}</td>
                          <td>{value.Outlet_Location_Type}</td>
                          <td>{value.Outlet_Size}</td>
                          <td>{value.Outlet_Type}</td>
                          <td>
                            {" "}
                            <button
                              class="btn btn-success"
                              title="Click here to compare item sales across various Outlets"
                              onClick={this.searchsData}
                            >
                              {" "}
                              Compare
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          {!isEmpty(this.state.itemsalesData) &&
            !isEmpty(this.state.data.selectedoutletIdentifier) &&
            !isEmpty(this.state.data.selectedoutletLocation) &&
            !isEmpty(this.state.data.selectedCategory) &&
            !isEmpty(this.state.value) && (
              <div className="col-12 mt-5">
                <h6 className="heading">
                  {this.state.value} sales across outlets
                </h6>
                <Itemsales data={this.state.itemsalesData} />
              </div>
            )}
        </div>
      </div>
    );
  }
}
export default Dashboard;
