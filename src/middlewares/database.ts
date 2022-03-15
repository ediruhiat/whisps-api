import { Knex, knex } from "knex";

const config: Knex.Config = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOSTNAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};

const DB = knex(config);

console.log(
  `⚡️[server]: Database connected to ${process.env.DB_NAME}@${process.env.DB_HOSTNAME}`
);

export default DB;
