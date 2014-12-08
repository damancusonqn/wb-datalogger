
temp = new Mongo.Collection("temp");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    dataPoints: function (){
      return temp.find({});
    }
  });
}


//return temp.find({}, {sort: {createdAt: -1}});
