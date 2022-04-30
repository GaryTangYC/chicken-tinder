const dotenv = require('dotenv');

dotenv.config();

let development;
let production;

if (process.env.DATABASE_URL) {
  development = {
    use_env_variable: 'DATABASE_URL',
    dialect: process.env.PG_DIALECT,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
    production = {
      use_env_variable: 'DATABASE_URL',
      dialect: process.env.DB_DIALECT,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    };
} else {
  development = {
    username: process.env.PG_USER, // postgres
    password: process.env.PG_PASSWORD, // postgres
    database: process.env.PG_DB_NAME, // database namne
    host: process.env.PG_HOST, // host I.P.
    dialect: process.env.PG_DIALECT, // PG
  },
    production = {
      username: process.env.PG_USER, // postgres
      password: process.env.PG_PASSWORD, // postgres
      database: process.env.PG_DB_NAME, // database namne
      host: process.env.PG_HOST, // host I.P.
      dialect: process.env.PG_DIALECT, // PG
    };
}

module.exports = {
  development,
  production,
};

// const config = {
//   development: {
//     username: process.env.PG_USER || '<YOUR_UNIX_USERNAME_HERE>',
//     password: process.env.PG_PASSWORD || null,
//     database: process.env.PG_DB_NAME || 'proj4_development',
//     host: process.env.PG_HOST || '127.0.0.1',
//     dialect: process.env.PG_DIALECT || 'postgres',
//   },
//   production: {
//     use_env_variable: 'DATABASE_URL',
//     dialect: 'postgres',
//     protocol: 'postgres',
//     dialectOptions: {
//       ssl: { // https://github.com/sequelize/sequelize/issues/12083
//         require: true,
//         rejectUnauthorized: false,
//       },
//     },
//   },
// };

// module.exports = config;
