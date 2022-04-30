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
  return db.createTable('cart_items', {
    cart_item_id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    user_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cart_items_user_id',
        table: 'users',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'user_id'
      }
    },
    variant_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'cart_items_variant_id',
        table: 'variants',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'variant_id'
      }
    },
    quantity: {
      type: 'smallint',
      notNull: true,
      unsigned: true
    }
  });
};

exports.down = function(db) {
  return db.dropTable('cart_items');
};

exports._meta = {
  "version": 1
};
