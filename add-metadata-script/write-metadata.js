var fs = require('fs');

fs.readFile('./surveyTemplate.json', 'utf-8', function(err, template) {
  if (err) {
    throw err;
  }

  var _metadataDefaultSet = {};

  var _template = JSON.parse(template);
  _template.itemContainer.forEach(function(item) {
    if (_isQuestion(item)) {
      item.metadata = _metadataDefaultSet;
    }
  });

  fs.writeFile('./surveyTemplateWithMetadata.json', JSON.stringify(_template), 'utf-8', function(err) {
    if (err) {
      throw err;
    }
    console.log('Done!');
  });


  function _isQuestion(item) {
    return (item.objectType === "TextItem" || item.objectType === "ImageItem") ? false : true;
  }
});
