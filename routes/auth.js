"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");

const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require("../config.js");
const User = require("../models/user");
const Match = require("../models/match");
const express = require("express");
const router = new express.Router();
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");

const s3 = new S3Client({
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
  region: "us-east-1"
});

const bucketName = 'friender-bucket-rithm31';

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.fieldname + "_" + file.originalname);
    }
  })
});

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/token", async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userAuthSchema,
    { required: true }
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const { username, password } = req.body;
  const user = await User.authenticate(username, password);
  const token = createToken(user);
  return res.json({ token });
});


/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */

router.post("/register", upload.single('image'), async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userRegisterSchema,
    { required: true }
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const imageFile = req.file;
  let imgUrl = "";
  if (imageFile) {
    imgUrl = imageFile.location;
  }

  const allUsers = await User.findAll();
  const allUserNames = allUsers.map(user => user.username);

  const newUser = await User.register({ ...req.body, imgUrl, isAdmin: false });

  //TODO: arrayNearbyUsers = User.getNearbyUsers(user.zipCode, user.friendRadius)
  //create a potential match between all valid users and the new user
  for (let otherUsername of allUserNames) {
    const data = {
      user_username_1: newUser.username,
      user_username_2: otherUsername
    };
    console.log(otherUsername);
    Match.create(data);
    console.log("otherusername===", otherUsername);
  }

  const token = createToken(newUser);
  return res.status(201).json({ token });
});


module.exports = router;