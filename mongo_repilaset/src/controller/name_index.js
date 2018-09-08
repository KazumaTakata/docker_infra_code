const elastic = require("../elasticsearch/index");
const elastictalk = require("../elasticsearch/individualtalk/index");

async function controller(change) {
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
    try {
      if (keys[0].split(".")[0] == "talks") {
        let talk = obj[keys[0]];
        let talkobj = {
          id: id,
          content: talk.content,
          friendid: talk.friendid,
          time: talk.time,
          which: true,
          filepath: talk.filepath,
        };
        await elastictalk.addDocument(talkobj);

        let talkobj2 = {
          id: talk.friendid,
          content: talk.content,
          friendid: id,
          time: talk.time,
          which: false,
          filepath: talk.filepath,
        };
        await elastictalk.addDocument(talkobj2);
      } else {
        if (keys.includes("name")) {
          insertobj["name"] = obj["name"];
          await elastic.updateDocument(id, insertobj);
        }

        if (keys.includes("photourl")) {
          insertobj["photourl"] = obj["photourl"];
          await elastic.updateDocument(id, insertobj);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
exports.controller = controller;
