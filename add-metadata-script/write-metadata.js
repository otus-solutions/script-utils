var fs = require('fs');

fs.readFile('./3C.9_FCO_2017-05-19.json', 'utf-8', function(err, template) {
  if (err) {
    throw err;
  }

  var _metadataDefaultSet = {};

  var _template = JSON.parse(template);
  var aux = true;
  _template.itemContainer.forEach(function(item) {
    if (_isQuestion(item)) {
      if(aux) {
        _metadataDefaultSet = item.metadata;
        aux = false;
      }
      item.metadata = _metadataDefaultSet;
    }
  });

  fs.writeFile('./3C.9_FCO_2017-05-19-COM-METADADO.json', JSON.stringify(_template), 'utf-8', function(err) {
    if (err) {
      throw err;
    }
    console.log('Done!');
  });


  function _isQuestion(item) {
    return (item.objectType === "TextItem" || item.objectType === "ImageItem") ? false : true;
  }

});
