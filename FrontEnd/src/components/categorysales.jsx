import React from "react";
import { Chart } from "react-google-charts";
class Categorysales extends React.Component {
  render() {
    return (
      <div className="mt-5 mx-3">
        <Chart
          className="mt-5"
          width="100%"
          height="400px"
          chartType="Bar"
          loader={<div>Loading Chart</div>}
          data={this.props.data}
          options={{
            title: "Top 5 Item Sales in each Category",
            hAxis: {
              title: "Item_Outlet_Sales",
              minValue: 0,
            },
            vAxis: {
              title: "Item_type",
            },
          }}
          rootProps={{ "data-testid": "2" }}
        />
      </div>
    );
  }
}

export default Categorysales;