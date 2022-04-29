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
  return db.createTable('variants', {
    variant_id: {
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
    },
    product_image_url: {
      type: 'string',
      length: '500',
      notNull: true
    },
    product_thumbnail_url: {
      type: 'string',
      length: '500',
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('variants');
};

exports._meta = {
  "version": 1
};
