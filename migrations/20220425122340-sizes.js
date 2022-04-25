'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.createTable('sizes', {
    size_id: {
      type: 'smallint',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    size_name: {
      type: 'string',
      length: 50,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('sizes');
};

exports._meta = {
  "version": 1
};
