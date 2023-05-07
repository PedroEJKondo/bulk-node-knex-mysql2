const db = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        port: 3306,
        user: 'docker',
        password: 'docker123',
        database: 'pna_sidi'
    }
});

module.exports = db;