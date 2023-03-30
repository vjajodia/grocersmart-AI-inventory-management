import React from "react";
import { Chart } from "react-google-charts";

class Itemsales extends React.Component {
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
            colors: ['skyblue'],
            hAxis: {
              title: "Item_Outlet_Sales",
              minValue: 0,
              format:'$'
            },
            vAxis: {
              title: "Sales in dollars",
            },
          }}
          rootProps={{ "data-testid": "2" }}
        />
      </div>
    );
  }
}

export default Itemsales;
