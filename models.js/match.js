"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Match {

  static async create(data, isSuccessful = false) {
    let tableName;
    if (isSuccessful === true) {
      tableName = `successful_matches`;
    } else {
      tableName = `potential_matches`;
    }

    const result = await db.query(`
    INSERT INTO ${tableName} (
      user_username_1,
      user_username_2,
      match_date
      )
    VALUES ($1, $2, $3)
    RETURNING
       match_id AS "matchId",
       user_username_1 AS "userUserName1",
       user_username_2 AS "userUserName2",
       match_date AS "matchDate"`, [
      data.user_username_1,
      data.user_username_2,
      data.match_date,
    ]);

    return result.rows[0];
  }

  static async delete(id, isSuccessful = false) {
    let tableName;
    if (isSuccessful === true) {
      tableName = `successful_matches`;
    } else {
      tableName = `potential_matches`;
    }

    const result = await db.query(
      `DELETE
     FROM ${tableName}
     WHERE id = $1
     RETURNING id`, [id]);
    const match = result.rows[0];

    if (!match) throw new NotFoundError(`No match: ${id}`);

  }

  static async getAllPotential(username) {
    const result = await db.query(`
        SELECT ${username},
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               img_url AS "imgUrl",
               is_admin  AS "isAdmin"
        FROM users
        ORDER BY username`,
    );

    return result.rows;
  }

  static async getAllSuccessful() {
    const result = await db.query(`
    SELECT username,
           first_name AS "firstName",
           last_name  AS "lastName",
           email,
           img_url AS "imgUrl",
           is_admin  AS "isAdmin"
    FROM users
    ORDER BY username`,
    );
    return result.rows;
  }
}