/** User class for message.ly */

const db = require("../db");
const ExpressError = require("../expressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
// const auth = require("../middleware/auth");


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (
            username,
            password,
            first_name,
            last_name,
            phone,
            join_at,
            last_login_at
          )
          VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
          RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    );
    return result.rows[0];
  }


  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT password FROM users WHERE username=$1`, [username]
    );
    const user = result.rows[0];
    return (user && await bcrypt.compare(password, user.password));
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const result = await db.query(
      `UPDATE users 
        SET last_login_at = current_timestamp
        WHERE username = $1
        RETURNING username, last_login_at`,
      [username]
    );

    const user = result.rows[0];

    // TO-DO: CHECK NECESSITY OF THIS IF-CLAUSE AGAIN
    if (!user) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }

    return user;  // Is it required?
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone 
      FROM users 
      ORDER BY last_name, first_name`
    );
    return result.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, 
              first_name, 
              last_name, 
              phone, 
              join_at, 
              last_login_at 
        FROM users 
        WHERE username=$1`,
      [username]
    );

    let user = result.rows[0];

    if (!user) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }

    return user;
  }


  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT f.username, 
              m.id, 
              m.to_username AS to_user, 
              m.body, 
              m.sent_at, 
              m.read_at, 
              t.username,
              t.first_name AS to_first_name, 
              t.last_name AS to_last_name, 
              t.phone AS to_phone
        FROM messages AS m
          JOIN users AS f ON f.username = m.from_username 
          JOIN users AS t ON t.username = m.to_username 
        WHERE f.username = $1`,
        [username]
    );

    let f = result.rows;

    if (!f) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }

    return result.rows.map(m => {
      return {
        id: m.id,
        to_user: {
          username: m.to_user,
          first_name: m.to_first_name,
          last_name: m.to_last_name,
          phone: m.to_phone
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at
      }
    });
  }


  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const result = await db.query(
      `SELECT t.username, 
              m.id, 
              m.from_username AS from_user, 
              m.body, 
              m.sent_at, 
              m.read_at, 
              f.username,
              f.first_name AS from_first_name, 
              f.last_name AS from_last_name, 
              f.phone AS from_phone
        FROM messages AS m
          JOIN users AS f ON f.username = m.from_username 
          JOIN users AS t ON t.username = m.to_username 
        WHERE t.username = $1`,
        [username]
    );

    let t = result.rows;

    if (!t) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }

    return result.rows.map(m => {
      return {
        id: m.id,
        from_user: {
          username: m.from_user,
          first_name: m.from_first_name,
          last_name: m.from_last_name,
          phone: m.from_phone
        },
        body: m.body,
        sent_at: m.sent_at,
        read_at: m.read_at
      }
    });
  }
}


module.exports = User;