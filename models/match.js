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
      )
    VALUES ($1, $2, $3)
    RETURNING
       match_id AS "matchId",
       user_username_1 AS "userUserName1",
       user_username_2 AS "userUserName2",
       match_date AS "matchDate"`, [
      data.user_username_1,
      data.user_username_2,
    ]);

    return result.rows[0];
  }

  s

  static async getSuccessful(id) {
    const result = await db.query(`
        SELECT match_id AS "matchId",
               user_username_1 AS "userUserName1",
               user_username_2 AS "userUserName2",
               match_date AS "matchDate"
        FROM successful_matches
          WHERE match_id = $1`, [id]
    );

    const match = result.rows[0];

    if (!match) throw new NotFoundError(`No successful match: ${id}`);

    return match;

  }

  static async getPotential(id) {
    const result = await db.query(`
        SELECT match_id AS "matchId",
               user_username_1 AS "userUserName1",
               user_username_2 AS "userUserName2",
               match_date AS "matchDate"
        FROM potential_matches
          WHERE match_id = $1`, [id]
    );

    const match = result.rows[0];

    if (!match) throw new NotFoundError(`No potential match: ${id}`);

    return match;
  }

  static async getAllPotential(username) {
    const result = await db.query(`
        SELECT match_id AS "matchId",
               user_username_1 AS "userUserName1",
               user_username_2 AS "userUserName2",
               match_date AS "matchDate"
        FROM potential_matches
          WHERE user_username_1 = $1 OR user_username_2 = $1
        ORDER BY match_date`, [username]
    );

    return result.rows;
  }

  static async getAllSuccessful(username) {
    const result = await db.query(`
        SELECT match_id AS "matchId",
               user_username_1 AS "userUserName1",
               user_username_2 AS "userUserName2",
               match_date AS "matchDate"
        FROM successful_matches
          WHERE user_username_1 = $1 OR user_username_2 = $1
        ORDER BY match_date`, [username]
    );
    return result.rows;
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
}

module.exports = Match