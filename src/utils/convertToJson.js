const documentFields = require('./documentFields.js')

function convertToJson(documents) {
  return documents.map(document => {
    const jsonObj = {};
    for (const field of documentFields) {
      jsonObj[field] = document[field]
    }
    return jsonObj
  })
}

module.exports = convertToJson