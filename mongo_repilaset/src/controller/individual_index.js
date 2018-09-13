const elastic = require("../elasticsearch/member");
const elastictalk = require("../elasticsearch/individualtalk");

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
      if (keys[0].split(".")[0] == "talksall") {
        if (keys.length > 1) {
          let updatetype = obj[keys[1]].split(";")[0];
          if (updatetype == "updatecontent") {
            let friendid = obj[keys[1]].split(";")[1];
            let userid = change.documentKey._id.toHexString();
            let content = obj[keys[0]];
            let time = obj[keys[1]].split(";")[2];

            let updateobj = { friendid, userid, content, time };

            await elastictalk.updateTalkContent(updateobj);
          }
        } else {
          let talk = obj[keys[0]];
          let talkobj = {
            id: id,
            content: talk.content,
            friendid: talk.friendid,
            time: talk.time,
            which: talk.which == 1 ? true : false,
            filepath: talk.filepath,
          };
          await elastictalk.addDocument(talkobj);
        }
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
