"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");



class Match {
    /** Create a match of either potential match or successful match
   *
   *@param {obj} data
   * data should be { user_username_1, user_username_2 }
   * @param {boolean}
   * determine match isSuccessful or potential, default is false for is successful.
   *
   *@return {object}
   * Returns { match_id,user_username_1, user_username_2 }
   **/

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
      user_username_2
      )
    VALUES ($1, $2)
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

/**
 * get successful match by id
 *
 * @param {*} id
 * id of successful match
 * @returns {obj}
 * { match_id,user_username_1, user_username_2 }
 * match_id of successful match
 */

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

  /**
 * get potential match by id
 *
 * @param {*} id
 * id of potential match
 * @returns {obj}
 * { match_id,user_username_1, user_username_2 }
 * match_id of potential match
 */
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

    /**
 * get all potential match by username
 *
 * @param {string} username
 * username to retrieve potential match for
 * @returns {array} array of objects
 * [{ match_id,user_username_1, user_username_2 },{...}]
 *
 */
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

     /**
 * get all successful match by username
 *
 * @param {string} username
 * username to retrieve successful match for
 * @returns {array} array of objects
 * [{ match_id,user_username_1, user_username_2 },{...}]
 *
 */
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

    static async updatePotentialMatch(username, id, isUser1){

      const result = await db.query(`
      UPDATE potential_matches
      SET ${isUser1 ? "user_1_like === $1" : "user_2_like === $1"  }
      WHERE match_id = ${id}
      RETURNING id,

     `
  );
    }
  /** delete when user unlike the other user
   *
   * @param {*} id
   * @param {*} isSuccessful = false
   */
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