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
  return db.addColumn('product_variants', 'product_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'product_var_product_fk',
      table: 'products',
      rules: {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      },
      mapping: 'product_id'
    }
  }).then(() => {
    db.addColumn('product_variants', 'color_id', {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_var_color_fk',
        table: 'colors',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'color_id'
      }
    })
  }).then(() => {
    db.addColumn('product_variants', 'size_id', {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_var_size_fk',
        table: 'sizes',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'size_id'
      }
    })
  });
};

exports.down = function(db) {
  return db.removeForeignKey('product_variants', 'product_var_product_fk')
         .then(() => {
         db.removeColumn('product_variants', 'product_id')
         })
         .then(() => {
         db.removeForeignKey('product_variants', 'product_var_color_fk')
         })
         .then(() => {
         db.removeColumn('product_variants', 'color_id')
         })
         .then(() => {
         db.removeForeignKey('product_variants', 'product_var_size_fk')
         })
         .then(() => {
         db.removeColumn('product_variants', 'size_id')
         })
};

exports._meta = {
  "version": 1
};
