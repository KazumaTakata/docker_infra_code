const MongoClient = require("mongodb").MongoClient;
const name_constroller = require("./controller/individual_index");
const group_constroller = require("./controller/group_index");

MongoClient.connect(
  "mongodb://mongodb0:27017,mongodb0:27017,mongodb2:27017?replicaSet=rs0"
)
  .then(client => {
    console.log("Connected correctly to server");
    // specify db and collections

    const db = client.db("messageapp");
    const collection = db.collection("users");

    const changeStream = collection.watch([]);
    // start listen to changes
    changeStream.on("change", function(change) {
      console.log(change);
      name_constroller.controller(change);
    });

    const collection2 = db.collection("groups");
    const changeStream2 = collection2.watch([]);
    // start listen to changes
    changeStream2.on("change", function(change) {
      console.log(change);
      group_constroller.controller(change);
    });
  })
  .catch(err => {
    console.error(err);
  });
