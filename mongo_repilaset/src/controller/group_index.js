const elasticgrouptalk = require("../elasticsearch/grouptalk/index");
const elasticgroup = require("../elasticsearch/group/index");
async function controller(change) {
  type = change.operationType;
  obj = change.fullDocument;
  if (type == "insert") {
    let insertobj = {
      name: obj.groupname,
      description: obj.groupdescription,
      id: obj._id.toHexString(),
    };
    await elasticgroup.addDocument(insertobj);
  } else if (type == "update") {
    let groupid = change.documentKey._id.toHexString();
    let obj = change.updateDescription.updatedFields;
    let keys = Object.keys(obj);
    insertobj = {};
    try {
      if (keys[0].split(".")[0] == "talks") {
        if (keys.length > 1) {
          let updatetype = obj[keys[1]].split(";")[0];
          let userid = obj[keys[1]].split(";")[1];
          let time = obj[keys[1]].split(";")[2];
          if (updatetype == "updatecontent") {
            let content = obj[keys[0]];

            let updateobj = { groupid, userid, content, time };

            await elasticgrouptalk.updateTalkContent(updateobj);
          }
        } else {
          let talk = obj[keys[0]];
          let talkobj = {
            senderid: talk.senderid,
            content: talk.content,
            time: talk.time,
            groupid: groupid,
            filepath: talk.filepath,
          };
          await elasticgrouptalk.addDocument(talkobj);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
}
exports.controller = controller;
