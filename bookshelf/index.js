// =================================================
// ============== Setup DB connection ==============
// =================================================
const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'ggadmin',
        password: 'GGpassword',
        database: "grapple_gears"
    }
});

const bookshelf = require('bookshelf')(knex)

module.exports = bookshelf