"use strict";


const AWS = require('aws-sdk');
require("dotenv").config();

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

const PORT = +process.env.PORT || 3001;


AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "us-east-1"
});

function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL || "postgresql:///friender";
}
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  AWS_ACCESS_KEY,
  AWS_SECRET_ACCESS_KEY,
  getDatabaseUri,
  BCRYPT_WORK_FACTOR,
}