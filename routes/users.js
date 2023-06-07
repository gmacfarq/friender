"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const {AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY} = require("../config.js")
const express = require("express");
const multer = require('multer');
const AWS = require('aws-sdk');
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Match = require("../models/match")
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: "us-east-1"
});

const s3 = new AWS.S3();
const bucketName = 'friender-bucket-rithm31'


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
//TODO: handle image post and change schema too
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

  const imageFile = req.file

  const params = {
    Bucket: bucketName,
    Key: imageFile.originalname,
    Body: imageFile.buffer,
    ACL: 'public-read'
  };

  const allUsers = await User.findAll();
  const allUserNames = allUsers.map(user => user.username)

  const newUser = await User.register(req.body);

  //TODO: arrayNearbyUsers = User.getNearbyUsers(user.zipCode, user.friendRadius)
  for(otherUsername of allUserNames){
    data = {
      user_username_1: newUser.username,
      user_username_2: otherUsername
    }
    Match.create(data)
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

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
  await User.remove(req.params.username);
  return res.json({ deleted: req.params.username });
});


module.exports = router;
