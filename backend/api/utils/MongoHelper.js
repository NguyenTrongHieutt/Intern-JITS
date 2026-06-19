var ObjectId = require('mongodb').ObjectID || require('mongodb').ObjectId;

function toObjectId(id) {
  return id instanceof ObjectId ? id : new ObjectId(id);
}

function getMongoDb(model) {
  var datastoreName = model.datastore || 'default';

  return model._adapter.datastores[datastoreName].manager;
}

function getCollectionName(model) {
  return model.tableName || model.identity;
}

function getCollection(model) {
  return getMongoDb(model).collection(getCollectionName(model));
}

function getFindOneAndUpdateDocument(result) {
  if (!result) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(result, 'value')) {
    return result.value;
  }

  return result;
}

module.exports = {
  toObjectId: toObjectId,
  getMongoDb: getMongoDb,
  getCollectionName: getCollectionName,
  getCollection: getCollection,
  getFindOneAndUpdateDocument: getFindOneAndUpdateDocument
};
