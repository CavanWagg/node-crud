const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

// the CRUD object
const crud = {};
// the base directory
crud.baseDir = path.join(__dirname, './database');

//Create function
crud.create = (file, data) => {
  fs.open(`${crud.baseDir}/${file}.json`, 'wx', (err, identifier) => {
    if (!err && identifier) {
      let jsonArray = [];

      jsonArray.push(data);

      let stringData = JSON.stringify(jsonArray, null, 3);

      fs.writeFile(identifier, stringData, err => {
        if (!err) {
          fs.close(identifier, err => {
            if (!err) console.log('no errors');
          });
        } else console.log(err);
      });
    } else console.log(err);
  });
};
// crud.create('cars', { name: 'innoson', price: '$4000' });

crud.read = file => {
  fs.readFile(`${crud.baseDir}/${file}.json`, 'utf8', (err, data) => {
    if (err) return err;
    console.log(data);
  });
};
// crud.read('cars');

crud.update = (file, data) => {
  // readFile returns promises
  readFile(`${crud.baseDir}/${file}.json`, 'utf8')
    .then(newStream => {
      //Change the string to a JS object
      let newData = JSON.parse(newStream);
      // Push our update to the array
      newData.push(data);
      // return our data as a string
      return JSON.stringify(newData, null, 3);
    })
    .then(finalData => {
      // replace the content in the file, with the updated data.
      fs.truncate(`${crud.baseDir}/${file}.json`, err => {
        if (!err) {
          fs.writeFile(`${crud.baseDir}/${file}.json`, finalData, err => {
            if (err) return err;
          });
        } else return err;
      });
    })
    .catch(err => console.log(err));
};
// crud.create('cars-updated', { name: 'mercedes', price: '$400' });
// crud.update('cars-updated', { name: 'Toyota', price: '$550' });

crud.delete = file => {
  fs.unlink(`${crud.baseDir}/${file}.json`, err => {
    if (!err) console.log('deleted');
    else return err;
  });
};

crud.delete('cars');
