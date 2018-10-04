const globalConfig = require('./global-config');
const dbHost= globalConfig['DB_HOST'];
const dbPort = globalConfig['DB_PORT'];
const dbName = globalConfig['DB_NAME'];
const dbTableName= globalConfig['DB_TABLE_NAME'];
const r = require('rethinkdb');
const { ipcRenderer } = require('electron')

// ------------------------------------------------------------
// exports.insertSingleOrder = insertSingleOrder; 
// exports.insertManyOrders = insertManyOrders; 
// exports.changeFeed = changeFeed;
// ------------------------------------------------------------


// subscribe to the necessary changefeeds in rethink, then 
// send changes to main via ipcRenderer
// => change details
// db = 'OrderUp'
// table = 'orders
exports.changeFeed = () => {
  console.log('changeFeed called')

  r.connect({
    host: dbHost,
    port: dbPort
  })
  .then(conn => {
    r.db(dbName).table(dbTableName)
      .changes()
      .run(conn)
      .then(cursor => {
        // cursor.each(console.log);
        cursor.each((err, row) => {
          if (err) throw err;

          // send the row to main process via IPC 
          ipcRenderer.send('change-in-orders-table', row);
        });
      })
      .catch(err => {
        if (err) throw err;
      });
  })
  .catch(err => {
    if (err) throw err;
  });
};

exports.insertSingleOrder = (order) => {
  // rethinkdb expects an Object to insert

  console.log('in insertSingleOrder... order is:');
  console.log(order);

  // everytime insertSingleOrder is called, a new connection
  // is made to the db. good/bad??
  r.connect({
    host: dbHost,
    port: dbPort
  })
  .then(conn => {
    r.db(dbName).table(dbTableName)
      .insert(order)
      .run(conn)
      .then(results => {
        console.log('SUCCESS: inserted a single order');
        console.log(results);
      })
      .catch(err => {
        if (err) throw err;
      });
  })
  .catch(err => {
    if (err) throw err;
  });
}

exports.insertManyOrders = (orders) => {
  //orders is an array of arrays of strings
  //[['blah','yadda',...,'foo'], ['blah', 'yadda',...,'foo'],....]
  console.log('heeloo from insertManyOrders');
}
