"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");

  await Company.create(
      {
        handle: "c1",
        name: "C1",
        numEmployees: 1,
        description: "Desc1",
        logoUrl: "http://c1.img",
      });
  await Company.create(
      {
        handle: "c2",
        name: "C2",
        numEmployees: 2,
        description: "Desc2",
        logoUrl: "http://c2.img",
      });
  await Company.create(
      {
        handle: "c3",
        name: "C3",
        numEmployees: 3,
        description: "Desc3",
        logoUrl: "http://c3.img",
      });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: true,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  const j1 = await Job.create({
    title: "j1",
    salary: 150000,
    equity: 0.031,
    companyHandle: "c1"
  });
  const j2 = await Job.create({
    title: "j2",
    salary: 160000,
    equity: 0.032,
    companyHandle: "c3"
  });
  const j3 = await Job.create({
    title: "j3",
    salary: 170000,
    equity: 0.033,
    companyHandle: "c3"
  });

  await db.query(`UPDATE jobs SET id = 1 WHERE title = 'j1'`);
  await db.query(`UPDATE jobs SET id = 2 WHERE title = 'j2'`);
  await db.query(`UPDATE jobs SET id = 3 WHERE title = 'j3'`);

  await User.applyJob("u1", 1);
  await User.applyJob("u1", 2);
  await User.applyJob("u3", 3);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: true });
const u3Token = createToken({ username: "u3", isAdmin: false });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
};
