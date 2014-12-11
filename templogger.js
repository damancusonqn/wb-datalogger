
temp = new Mongo.Collection("temp");

if (Meteor.isServer) {
  Meteor.publish("datapoints", function () {
    //publish the last 25 values to the client
    return temp.find({}, {sort: {_id: -1}, limit: 25});
  });
}

if (Meteor.isClient) {

  Meteor.subscribe("datapoints");

  var data1 = temp.find({}, {sort: {_id: -1}});

  window.data2 = data1.map(function (x) {
    return [x.temp,x.time];
  });

  data2 = temp.find({}, {sort: {_id: -1}});
  console.log(data1);
  console.log("data2:"+data2);

  Template.body.helpers({
    dataPoints: function (){
        //return [{'temp':1, 'batt':2}, {'temp':4, 'batt':5}];
        //Note that Autopublish is disabled, so find({})
        //will return just the published by the server
        return data1;
    }
  });

  Template.chart.helpers({
    getData: function(){
      var tempData;
      Meteor.call("getDatapoints", function (error, result) {
        var compactY =[];
        result.forEach(function(item){
          compactY.push(item[0]);
        });
        var compactX =[];
        result.forEach(function(item){
          compactX.push(item[1]);
        });

        tempData = {labels: [compactX.reverse()], series:[compactY.reverse()]};
        new Chartist.Line('.ct-chart', tempData, chartOptions);
} );
    }
  });

  /*var tempData;
  Meteor.call("getDatapoints", function (error, result) {
    var compact =[];
    result.forEach(function(item){
      compact.push(item[0]);
    });

    tempData = {labels: ['1', '2'], series:[compact]};
    console.log(tempData);
    new Chartist.Line('.ct-chart', tempData, chartOptions);
  } );*/

  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.



    setInterval(function () {
        //  new Chartist.Line('.ct-chart', tempData, chartOptions);
          }, 300);

//    setTimeout(function () {
//      new Chartist.Line('.ct-chart', tempData);
//    }, 300);
//  }

  var chartOptions = {
    // Don't draw the line chart points
    showPoint: true,
    // Disable line smoothing
    lineSmooth: false,
    // X-Axis specific configuration
    axisX: {
      // We can disable the grid for this axis
      showGrid: true,
      // and also don't show the label
      showLabel: true
    },
    // Y-Axis specific configuration
    axisY: {
      // Lets offset the chart a bit from the labels
      offset: 40,
      // The label interpolation function enables you to modify the values
      // used for the labels on each axis. Here we are converting the
      // values into million pound.
      labelInterpolationFnc: function(value) {
        return '$' + value + 'm';
      }
    }
  };
}//isCLIENT

Meteor.methods({
  getDatapoints: function() {
    var datapoints = temp.find({}, {sort: {_id: -1}, limit:25});
    return datapoints.map(function (x) {
      return [x.temp,x.time];
    });
  }
});
//return temp.find({}, {sort: {createdAt: -1}});
//db.temp.find( { batt: { $gt: 1} } ); //query for battery fields
