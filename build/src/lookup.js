'use strict';

var Fields = require('./lang/fields.js');

var lookup = function lookup(next, spec) {
  return function (cb) {
    (function iterate() {
      next(function (error, doc, idb_cur, idb_transaction) {
        if (!doc) {
          cb(error);
        } else if (true) {
          var objectStore = idb_transaction.objectStore(spec.from);
          var request = objectStore.get(doc[spec.localField]);
          request.onerror = function (event) {
            cb(new Error(event.target.errorCode));
          };
          request.onsuccess = function (event) {
            doc[spec.as] = [event.target.result];
            cb(null, doc, idb_cur);
          };
        } else {
          iterate();
        }
      });
    })();
  };
};

module.exports = lookup;