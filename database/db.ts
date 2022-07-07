import { Pool } from "pg";

import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: "localhost",
  database: "dice_betting_api",
  password: process.env.DB_PASS,
  port: 5432,
});
