const MongoClient = require("mongodb").MongoClient;

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
      router(change);
    });
    // insert few data with timeout so that we can watch it happening
  })
  .catch(err => {
    console.error(err);
  });

async function router(change) {
  type = change.operationType;
  obj = change.fullDocument;
  if (type == "insert") {
    let insertobj = {
      name: obj.name,
      photourl: obj.photourl,
      id: obj._id.toHexString(),
    };
    await elastic.addDocument(insertobj);
  } else if (type == "update") {
    let id = change.documentKey._id.toHexString();
    let obj = change.updateDescription.updatedFields;
    let keys = Object.keys(obj);
    insertobj = {};
    if (keys.includes("name")) {
      insertobj["name"] = obj["name"];
    }

    if (keys.includes("photourl")) {
      insertobj["photourl"] = obj["photourl"];
    }

    await elastic.updateDocument(id, insertobj);
  }
}
