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
  return db.createTable('users', {
    user_id: {
      type: 'smallint',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    email: {
      type: 'string',
      length: 320,
      notNull: true
    },
    password: {
      type: 'string',
      length: 80,
      notNull: true
    },
    first_name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    last_name: {
      type: 'string',
      length: 50,
      notNull: true
    },
    user_type_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'user_user_type_fk',
        table: 'user_types',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'user_type_id'
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('users');
};

exports._meta = {
  "version": 1
};
