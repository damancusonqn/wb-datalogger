
temp = new Mongo.Collection("temp");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    dataPoints: function (){
        //return [{'temp':1, 'batt':2}, {'temp':4, 'batt':5}];
    return temp.find({temp: {$gt: 1}} ); //query for battery fields//temp.find({});
    }
  });

var data = {
  // A labels array that can contain any sort of values
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  // Our series array that contains series objects or in this case series data arrays
  series: [
    [5, 2, 4, 2, 0]
  ]
};

  console.log(data);

  // Create a new line chart object where as first parameter we pass in a selector
  // that is resolving to our chart container element. The Second parameter
  // is the actual data object.
  // new Chartist.Line('.ct-chart', data);
    setTimeout(function () {
      new Chartist.Line('.ct-chart', data);
    }, 1000);
}


//return temp.find({}, {sort: {createdAt: -1}});
//db.temp.find( { batt: { $gt: 1} } ); //query for battery fields
