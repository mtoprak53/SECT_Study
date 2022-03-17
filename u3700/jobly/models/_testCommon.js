const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM companies");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM jobs");

  await db.query(`
    INSERT INTO companies(handle, name, num_employees, description, logo_url)
    VALUES ('c1', 'C1', 1, 'Desc1', 'http://c1.img'),
           ('c2', 'C2', 2, 'Desc2', 'http://c2.img'),
           ('c3', 'C3', 3, 'Desc3', 'http://c3.img')`);

  await db.query(`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com'),
               ('u2', $2, 'U2F', 'U2L', 'u2@email.com')
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
      ]);

  const jobs = await db.query(`
          INSERT INTO jobs(title, salary, equity, company_handle)
          VALUES ('j1', 100000, 0.01, 'c1'),
                 ('j2', 200000, null, 'c2'),
                 ('j3', 300000, 0.03, 'c3')`);

  const jobRes = await db.query(
    `SELECT id, 
            title, 
            salary, 
            equity, 
            company_handle AS "companyHandle"
     FROM jobs`
  );

  const jobIds = jobRes.rows.map(j => j.id);

  const applications = await db.query(`
          INSERT INTO applications(job_id, username)
          VALUES ($1, $2), ($3, $4), ($5, $6)`,
        [jobIds[0], "u1", jobIds[0], "u2", jobIds[2], "u2"]
  );

  // const idArr = jobs.rows.map(j => j.id);
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


async function jobIds() {
  const job1 = await db.query(`SELECT id 
                               FROM jobs 
                               WHERE title = $1`, ["j1"]);
  
  const job2 = await db.query(`SELECT id 
                               FROM jobs 
                               WHERE title = $2`, ["j2"]);
  
  const job3 = await db.query(`SELECT id 
                               FROM jobs 
                               WHERE title = $3`, ["j3"]);

  return [job1.rows[0].id, job2.rows[0].id, job3.rows[0].id];
}

console.log(`jobIds()  =>  ${jobIds()}`);

// [ jobId1, jobId2, jobId3 ] = jobIds();
// (async () => const { jobId1, jobId2, jobId3 } = await jobIds();)
// const { jobId1, jobId2, jobId3 } = jobIds();


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  jobId1, 
  jobId2,
  jobId3
};