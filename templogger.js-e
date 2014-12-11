
temp = new Mongo.Collection("temp");

if (Meteor.isServer) {
  Meteor.publish("datapoints", function () {
    //publish the last 25 values to the client
    return temp.find({}, {sort: {_id: -1}, limit: 50});
  });
}

if (Meteor.isClient) {

  Meteor.subscribe("datapoints");

  var data1 = temp.find({}, {sort: {_id: -1}, limit: 25});
  var tempData;
  var queryParams;

  Template.body.helpers({
    dataPoints: function (){
        //return [{'temp':1, 'batt':2}, {'temp':4, 'batt':5}];
        //Note that Autopublish is disabled, so find({})
        //will return just the published by the server
        return data1;
    }
  });

  Template.body.events({
    "keypress .nPoints input": function (event) {
      //if ENTER pressed
       if (event.which == 13){
         var value = event.target.value;
          queryParams.nPoints = value;
          //console.log(value);
      }
    },
    "keypress .yZoom input": function (event) {
       if (event.which == 13){
         var value = event.target.value;
          queryParams.yZoom = value;
          //console.log(value);
      }
    },
    //TODO: check mousedown event, not firing
    "mousedown .yZoom input": function (event) {
         var value = event.target.value;
          queryParams.yZoom = value;
          console.log(value);
    }
  });

  Template.chart.helpers({
    plotChart: function(){
      Meteor.call("getDatapoints", function (error, result) {
        var compactY =[];
        result.forEach(function(item){
          compactY.push(item[0]);
        });
        var compactX =[];
        result.forEach(function(item){
          var t = new Date(item[1]);
          compactX.push(t.getHours().toString()+':'+t.getMinutes().toString()
                       +':'+t.getSeconds().toString());
        });

        tempData = {labels: [compactX.reverse()], series:[compactY.reverse()]};
      });
    }
  });//chart helpers



  setInterval(function (){
    new Chartist.Line('.ct-chart', tempData, chartOptions);

    }, 300);


  $(document).ready(function(){
var $chart;
var $toolTip;

    $chart = $('.ct-chart');

    $toolTip = $chart
      .append('<div class="tooltip"></div>')
      .find('.tooltip')
      .hide();
    $chart.on('mouseenter', '.ct-point', function() {
      var $point = $(this),
        value = $point.attr('ct:value'),
        seriesName = $point.parent().attr('ct:series-name');
      //console.log('mouseenter');
      //$point.animate({'stroke-width': '50px'}, 300, easeOutQuad);
      $toolTip.html(seriesName + '<br>' + value).show();
    });

    $chart.on('mouseleave', '.ct-point', function() {
      var $point = $(this);
      //console.log('mouseleave');
      //$point.animate({'stroke-width': '20px'}, 300, easeOutQuad);
      $toolTip.hide();
    });

    $chart.on('mousemove', function(event) {
      $toolTip.css({
        left: (event.offsetX || event.originalEvent.layerX) - $toolTip.width() / 2 - 10,
        top: (event.offsetY || event.originalEvent.layerY) - $toolTip.height() - 40
      });
      //console.log('mousemove');
    });

    //console.log($chart);
  });


  var chartOptions = {
    // Don't draw the line chart points
    showPoint: true,
    // Disable line smoothing
    lineSmooth: true,
    showArea: true,
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
        return value.toFixed(2)+'°C ';
      }
    }
  };
}//isCLIENT

Meteor.methods({
  getDatapoints: function() {
    var datapoints = temp.find({}, {sort: {_id: -1}, limit:50});
    return datapoints.map(function (x) {
      return [x.temp,x.time];
    });
  }
});
//return temp.find({}, {sort: {createdAt: -1}});
//db.temp.find( { batt: { $gt: 1} } ); //query for battery fields
