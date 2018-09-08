const elasticgroup = require("../elasticsearch/grouptalk/index");

async function controller(change) {
  type = change.operationType;
  obj = change.fullDocument;
  if (type == "insert") {
  } else if (type == "update") {
    let id = change.documentKey._id.toHexString();
    let obj = change.updateDescription.updatedFields;
    let keys = Object.keys(obj);
    insertobj = {};
    try {
      if (keys[0].split(".")[0] == "talks") {
        let talk = obj[keys[0]];
        let talkobj = {
          senderid: talk.senderid,
          content: talk.content,
          time: talk.time,
          groupid: id,
          filepath: talk.filepath,
        };
        await elasticgroup.addDocument(talkobj);
      }
    } catch (e) {
      console.log(e);
    }
  }
}
exports.controller = controller;
