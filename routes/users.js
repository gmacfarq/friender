"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY } = require("../config.js");
const express = require("express");
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Match = require("../models/match");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

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

/** POST / { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, isAdmin }, token }
 *
 * Authorization required: admin
 **/

router.post("/", upload.single('image'), async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userNewSchema,
    { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const imageFile = req.file;
  console.log("imageFile = ", imageFile);
  let imgUrl = `https://${bucketName}.s3.amazonaws.com/${imageFile.key}`;


  const allUsers = await User.findAll();
  const allUserNames = allUsers.map(user => user.username);

  const newUser = await User.register({ ...req.body, imgUrl });

  //TODO: arrayNearbyUsers = User.getNearbyUsers(user.zipCode, user.friendRadius)
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
  return res.status(201).json({ newUser, token });
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", async function (req, res, next) {
  const users = await User.findAll();
  return res.json({ users });
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username", async function (req, res, next) {
  const user = await User.get(req.params.username);
  return res.json({ user });
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", async function (req, res, next) {
  const validator = jsonschema.validate(
    req.body,
    userUpdateSchema,
    { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const user = await User.update(req.params.username, req.body);
  return res.json({ user });
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", async function (req, res, next) {
  await User.remove(req.params.username);
  return res.json({ deleted: req.params.username });
});


/**
 * GET /[username]/matches/potential => {[match1, match2,...]}
 *
 * get all potential matches for a user
 */
router.get("/:username/matches/potential", async function (req, res, next) {
  try {
    const allPotentialMatches = await Match.getAllPotential(req.params.username);
    return res.json({ allPotentialMatches });
  } catch (error) {
    console.error(error.message);
  }
});

/**
 * PATCH /[username]/matches/[id] => {"[username] liked match [id]"}
 *
 * Update a potential match so that is it liked
 */
router.patch("/:username/matches/:id", async function (req, res, next) {
  try {
    const update = await Match.likePotentialMatch(
      req.params.username,
      req.params.id
      );
    return res.json({ update });
  } catch (error) {
    console.error(error.message);
  }
});

/**
 * GET /[username]/matches/successful => {[match1, match2,...]}
 *
 * get all successful matches for a user
 */
router.get("/:username/matches/successful", async function (req, res, next) {
  try {
    const allSuccessfulMatches = await Match.getAllSuccessful(req.params.username);
    return res.json({ allSuccessfulMatches });
  } catch (error) {
    console.error(error.message);
  }
});



module.exports = router;
