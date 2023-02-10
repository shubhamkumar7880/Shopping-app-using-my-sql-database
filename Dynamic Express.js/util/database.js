// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node-complete',
//     password: 'xxxxxx'
// });

// module.exports = pool.promise();

// using sequelize

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'xxxxx', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;