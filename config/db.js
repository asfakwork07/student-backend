const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.log(err));

module.exports = pool;

//For production deployment on Heroku, you can use the following code instead of the above code:
// const { Pool } = require("pg");

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

// module.exports = pool;