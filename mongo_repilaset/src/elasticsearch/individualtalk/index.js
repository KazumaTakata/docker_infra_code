var elasticsearch = require("elasticsearch");

var elasticClient = new elasticsearch.Client({
  host: "elasticsearch:9200",
  log: "info",
});

var indexName = "messageapptalk";
let typeName = "talk";

/**
 * Delete an existing index
 */
function deleteIndex() {
  return elasticClient.indices.delete({
    index: indexName,
  });
}
exports.deleteIndex = deleteIndex;

/**
 * create the index
 */
function initIndex() {
  return elasticClient.indices.create({
    index: indexName,
  });
}
exports.initIndex = initIndex;

/**
 * check if the index exists
 */
function indexExists() {
  return elasticClient.indices.exists({
    index: indexName,
  });
}
exports.indexExists = indexExists;

function initMapping() {
  return elasticClient.indices.putMapping({
    index: indexName,
    type: typeName,
    body: {
      properties: {
        userid: { type: "keyword" },
        content: { type: "text" },
        friendid: { type: "keyword" },
        time: { type: "keyword" },
        which: { type: "boolean" },
        filepath: { type: "keyword" },
      },
    },
  });
}
exports.initMapping = initMapping;

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: typeName,
    body: {
      userid: document.id,
      content: document.content,
      friendid: document.friendid,
      time: document.time,
      which: document.which,
      filepath: document.filepath,
    },
  });
}
exports.addDocument = addDocument;

function updateTalkContent(obj) {
  return elasticClient.updateByQuery({
    index: indexName,
    type: typeName,
    body: {
      query: {
        bool: {
          must: [
            { match: { userid: obj.userid } },
            { match: { friendid: obj.friendid } },
            { match: { time: obj.time } },
          ],
        },
      },
      script: { inline: `ctx._source.content = '${obj.content}'` },
    },
  });
}
exports.updateTalkContent = updateTalkContent;

function search(input, input2, content) {
  return elasticClient.search({
    index: indexName,
    type: typeName,
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                userid: {
                  query: input,
                },
              },
            },
            {
              match: {
                friendid: {
                  query: input2,
                },
              },
            },
            {
              match: {
                content: {
                  query: content,
                  fuzziness: 2,
                },
              },
            },
          ],
        },
      },
    },
  });
}
exports.search = search;
