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
  return db.createTable('product_variants', {
    product_var_id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    stock: {
      type: 'int',
      notNull: true,
      defaultValue: 0,
      unsigned: true
    }

  });
};

exports.down = function(db) {
  return db.dropTable('product_variants');
};

exports._meta = {
  "version": 1
};
