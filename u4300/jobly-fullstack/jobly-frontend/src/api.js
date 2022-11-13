import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";
// const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.1.9:3001";
// const BASE_URL = "http://192.168.1.9:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    //there are multiple ways to pass an authorization token, this is how you pass it in the header.
    //this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get details on a company by handle. */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

  // obviously, you'll add a lot here ...


  /** Get companies. */

  static async getCompanies(name) {
    let res = await this.request(`companies/`, { name });
    return res.companies;
  }
  
  /** Get jobs. */

  static async getJobs(title) {
    let res = await this.request(`jobs/`, { title });
    return res.jobs;
  }

  // static async loginUser(username="testuser", password="password") {
  // static async loginUser(username="momo", password="momo123") {
  static async loginUser(username, password) {
    try {
      const res = await this.request("auth/token", { username, password }, "post");
      this.token = res.token;
      return res.token;
    } catch(err) {
      console.log("### loginUser ERROR ###");
      // console.error(err);
      return false;
    };
    // const { token } = res;
    // console.log(token);
  }

  static async signupUser(username, password, firstName, lastName, email) {

    try {
      const res = await this.request("auth/register/", {
        username,
        password,
        firstName,
        lastName,
        email
      }, "post");
      this.token = res.token;
      return res.token;
    } catch(err) {
      console.log("### signupUser ERROR ###");
      // console.error(err);
      return false;
    };

    // console.log("API signupUser method | res:");
    // console.log(res);
    // return null;
  }

  static async getUser(username) {
    const res = await this.request(`users/${username}`);
    return res.user;
  }



  static async updateUser(username, password, firstName, lastName, email) {
    try {
      const res = await this.request(`users/${username}`, {
        firstName,
        lastName,
        password,
        email
      }, "patch");
      // this.token = res.token;
      return res;
    } catch(err) {
      console.log("### updateUser ERROR ###");
      // console.error(err);
      return false;
    };
  };

  static async applyToTheJob(username, jobId) {
    // const res = await this.request(`users/${username}/jobs/${id}`);
    await this.request(`users/${username}/jobs/${jobId}`, { username, jobId }, "post");
    // return res.user;
  }



}

// // for now, put token ("testuser" / "password" on class)
// JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";


export default JoblyApi;