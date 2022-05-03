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
  return db.createTable('products', {
    product_id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    product_name: {
      type: 'string',
      length: 100,
      notNull: true
    },
    description: {
      type: 'string',
      length: 1000,
      notNull: true
    },
    cost: {
      type: 'int',
      notNull: true,
      defaultValue: 0,
      unsigned: true
    },
    weight: {
      type: 'smallint',
      notNull: true,
      defaultValue: 0,
      unsigned: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('products');
};

exports._meta = {
  "version": 1
};
