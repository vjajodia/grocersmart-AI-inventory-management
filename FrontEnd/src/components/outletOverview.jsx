import React from "react";
import { Chart } from "react-google-charts";
class OutletOverview extends React.Component {
  getBarChartData = (data) => {
    const barChartData = [["categories", "Sales"]];
    for (const [key, value] of Object.entries(data)) {
      barChartData.push([key, value]);
    }
    return barChartData;
  };
  render() {
    return (
      <div className="mt-5 mx-3">
        <Chart
          className="mt-5"
          width="100%"
          height="400px"
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={this.getBarChartData(this.props.data)}
          options={{
            colors: ['#ffab91'],
            /* title: "Sales in each category", */
            hAxis: {
              title: "Total Population",
              minValue: 0,
            },
            vAxis: {
              title: "City",
            },
          }}
          rootProps={{ "data-testid": "2" }}
        />
      </div>
    );
  }
}

export default OutletOverview;
