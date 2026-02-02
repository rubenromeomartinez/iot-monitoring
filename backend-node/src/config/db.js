const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "database",
  user: process.env.DB_USER || "iot_user",
  password: process.env.DB_PASSWORD || "iot_pass",
  database: process.env.DB_NAME || "iot_db",
  port: 5432
});

pool.on("connect", () => {
  console.log("📦 Conectado a PostgreSQL");
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
