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
  return db.addColumn('products', 'material_id', {
    type: 'smallint',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'product_material_fk',
      table: 'materials',
      rules: {
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT'
      },
      mapping: 'material_id'
    }
  }).then(() => {
    db.addColumn('products', 'weave_id', {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_weave_fk',
        table: 'weaves',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'weave_id'
      }
    })
  }).then(() => {
    db.addColumn('products', 'category_id', {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_category_fk',
        table: 'categories',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'category_id'
      }
    })
  }).then(() => {
    db.addColumn('products', 'brand_id', {
      type: 'smallint',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'product_brand_fk',
        table: 'brands',
        rules: {
          onDelete: 'RESTRICT',
          onUpdate: 'RESTRICT'
        },
        mapping: 'brand_id'
      }
    })
  });
};

exports.down = function(db) {
  return db.removeForeignKey('products', 'product_material_fk')
         .then(() => {
         db.removeColumn('products', 'material_id')
         })
         .then(() => {
         db.removeForeignKey('products', 'product_weave_fk')
         })
         .then(() => {
         db.removeColumn('products', 'weave_id')
         })
         .then(() => {
         db.removeForeignKey('products', 'product_category_fk')
         })
         .then(() => {
         db.removeColumn('products', 'category_id')
         })
         .then(() => {
         db.removeForeignKey('products', 'product_brand_fk')
         })
         .then(() => {
         db.removeColumn('products', 'brand_id')
         })
};

exports._meta = {
  "version": 1
};
