"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Message {


  static async create(data) {
    const result = await db.query(`
    INSERT INTO messages (receiver_username
      sender_username,
      message_text,
      message_date)
      VALUE($1, $2, $3, $4)
      RETURNING
        message_id AS "messageId",
        receiver_username AS  "receiverUsername",
        sender_username AS "senderUsername",
      message_text AS "messageText",
      message_date AS "messageDate"
        `, [
      data.receiverUsername,
      data.senderUsername,
      data.messageText,
      data.messageDate
    ]);

    const message = result.rows[0];

    return message;
  }



  static async get(id) {

    const messageRes = await db.query(`
    SELECT message_id AS "messageId",
          receiver_username AS  "receiverUsername",
            sender_username AS "senderUsername",
           message_text AS "messageText",
           message_date AS "messageDate"
    FROM messages
    WHERE message_id = $1`, [id]);

    const message = messageRes.rows[0];

    if (!message) throw new NotFoundError(`No message: ${id}`);

    return message;

  }


}

module.exports = Message;