import React from "react";
import { Chart } from "react-google-charts";

class CategoryView extends React.Component {
  getBarChartData = (data) => {
    const barChartData = [["categories", "Sales", { role: "style" }]];
    const colors = ["#b87333", "gold"];
    let i = 0;
    for (const [key, value] of Object.entries(data)) {
      barChartData.push([key, value, colors[i++]]);
    }
    return barChartData;
  };
  render() {
    return (
      <div>
        <Chart
          height={"300px"}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={this.getBarChartData(this.props.data)}
          options={{
            /* title: "Sales of a category based on Fat Content", */
            width: 600,
            height: 400,
            bar: { groupWidth: "95%" },
            legend: { position: "none" },
          }}
          // For tests
          rootProps={{ "data-testid": "6" }}
        />
      </div>
    );
  }
}

export default CategoryView;
