import React from "react";
import { Chart } from "react-google-charts";

var categories = [
  "Snack Foods",
  "Fruits and Vegetables",
  "Household",
  "Frozen Foods",
  "Dairy",
  "Baking Goods",
  "Canned",
  "Meat",
  "Health and Hygiene",
  "Soft Drinks",
  "Others",
  "Breads",
  "Breakfast",
  "Hard Drinks",
  "Seafood",
  "Starchy Foods",
];
class TierOverview extends React.Component {
  getBarChartData = (data) => {
    // console.log("original", data);
    const barChartData = [["outlets", ...categories]];
    for (const [key, value] of Object.entries(data)) {
      const arr = [key];
      let newValue = JSON.parse(value);
      for (const [key, value] of Object.entries(newValue)) {
        arr.push(value);
      }
      barChartData.push(arr);
    }
    return barChartData;
  };
  render() {
    return (
      <div>
        <Chart
          height={"500px"}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={this.getBarChartData(this.props.tierLtevelData)}
          options={{
            /* title: `Sales of outlets in ${this.props.tier}`, */
            chartArea: { width: "50%" },
            isStacked: true,
            hAxis: {
              title: "Total Sales",
              minValue: 0,
            },
            vAxis: {
              title: this.props.tier,
            },
          }}
          // For tests
          rootProps={{ "data-testid": "3" }}
        />
      </div>
    );
  }
}

export default TierOverview;
