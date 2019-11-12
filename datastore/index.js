const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('error writing counter');
    } else {
      fs.writeFile(exports.dataDir + `/${id}.txt`, text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};
/*
counter.getNextUniqueId((err, id) => {
  var filepath = path.join(exports.dataDir, `${id}.txt`)
  fs.writeFile(filepath, text, (err) => {
    if (err) {
      callback(err)
    } else {
      callback(null, {id, text})
    }
  })

*/

exports.readAll = (callback) => {
  var tempArray = [];

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error readAll files');
    } else {
      files.forEach(file => {
        tempArray.push({id: file.substring(0, file.length - 4), text: file.substring(0, file.length - 4)});
      });
      // console.log(tempArray)
      callback(err, tempArray);
    }
  });
};
/*
fs.readdir(exports.dataDir, (err, files) => {
  if (err) {
    callback(err)
  } else {
    var data = files.map(file => {
      var id = path.basename(file, '.txt')
      return {
        id: id,
        text: id
      }
    })
    callback(null, data)
  }
})
*/


exports.readOne = (id, callback) => {

  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, contents) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: contents.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, contents) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

/*
  var filepath = path.join(exports.dataDir, `${id}.txt`)
  fs.readFile(filepath, (err, contents) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};
*/

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
