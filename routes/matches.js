"use strict";

/** Routes for matches. */

const Match = require("../models/match");
const express = require("express");

const router = express.Router();

/** DELETE /successful/[id]  =>  { deleted: id }
 *
 * route to delete a successful match by match_id
 **/
router.delete("/successful/:id", async function (req, res, next) {
  await Match.delete(req.params.id, true);
  return res.json({ deleted: req.params.id });
});

/** DELETE /potential/[id]  =>  { deleted: id }
 *
 * route to delete a potential match by match_id
 **/
router.delete("/potential/:id", async function (req, res, next) {
  await Match.delete(req.params.id);
  return res.json({ deleted: req.params.id});
});

module.exports = router;