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
  return db.createTable('brands', {
    brand_id: {
      type: 'smallint',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    brand_name: {
      type: 'string',
      length: 100,
      notNull: true
    },
    brand_thumbnail_url: {
      type: 'string',
      length: 500,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('brands');
};

exports._meta = {
  "version": 1
};
