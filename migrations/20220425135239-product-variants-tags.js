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
  return db.createTable('product_variants_tags', {
    product_var_tag_id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    product_var_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_var_tags_product_var_fk',
        table: 'product_variants',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'product_var_id'
      }
    },
    tag_id: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_var_tags_tag_fk',
        table: 'tags',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'tag_id'
      }
    }
  });
};

exports.down = function(db) {
  return db.dropTable('product_variants_tags');
};

exports._meta = {
  "version": 1
};
