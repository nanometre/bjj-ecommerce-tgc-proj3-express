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
  return db.addColumn('product_images', 'variant_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'product_img_product_var_fk',
      table: 'variants',
      rules: {
        onDelete: 'CASCADE',
        onUpdate: 'RESTRICT'
      },
      mapping: 'variant_id'
    }
  });
};

exports.down = function(db) {
  return db.removeForeignKey('product_images', 'product_img_product_var_fk')
  .then(() => {
    db.removeColumn('product_images', 'variant_id')
  });
};

exports._meta = {
  "version": 1
};
