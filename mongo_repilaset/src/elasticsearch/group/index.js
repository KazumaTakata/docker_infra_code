var elasticsearch = require("elasticsearch");

var elasticClient = new elasticsearch.Client({
  host: "elasticsearch:9200",
  log: "info",
});

var indexName = "messageappgroup";
let typeName = "group";

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
        id: { type: "keyword" },
        name: { type: "text" },
        description: { type: "text" },
      },
    },
  });
}
exports.initMapping = initMapping;

function addDocument(document) {
  return elasticClient.index({
    index: indexName,
    type: typeName,
    id: document.id,
    body: {
      id: document.id,
      name: document.name,
      description: document.description,
    },
  });
}
exports.addDocument = addDocument;

function updateDocument(id, updateobj) {
  return elasticClient.update({
    index: indexName,
    type: typeName,
    id: id,
    body: {
      doc: updateobj,
    },
  });
}
exports.updateDocument = updateDocument;

function search(name) {
  return elasticClient.search({
    index: indexName,
    type: typeName,
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                name: {
                  query: name,
                  fuzziness: 1,
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
