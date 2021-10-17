
const express = require("express");
const router = new express.Router();
const Message = require("../models/message");
const { ensureLoggedIn } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get("/:id", async (req, res, next) => {
  try {
    const message = await Message.get(req.params.id);

    let condition_1 = message.from_user.username !== req.user.username;
    let condition_2 = message.to_user.username !== req.user.username;

    if (condition_1 && condition_2) {
      return next({ status: 401, message: "Unauthorized" });
    }

    return res.json({ message: message });
  } catch (e) {
    return next(e);
  }
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", ensureLoggedIn, async (req, res, next) => {
  try {
    const { from_username, to_username, body } = req.body;
    const message = await Message.create({
      from_username, to_username, body
    });
    return res.json({ message: message });
  } catch (e) {
    return next(e);
  }
});



/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", async (req, res, next) => {
  try {
    console.log("THIS IS 'POST /:id/read'");

    const message = await Message.get(req.params.id);

    if (message.to_user.username !== req.user.username) {
      return next({ status: 401, message: "Unauthorized" });
    }

    const readAt = await Message.markRead(req.params.id);

    return res.json({ message: readAt });
  } catch (e) {
    return next(e);
  }
});


 module.exports = router;