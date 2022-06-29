import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import JoblyApi from "./api";
import NavBar from "./NavBar";
import Home from "./Home";
import Companies from "./Companies";
import Jobs from "./Jobs";
import Company from "./Company";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ProfileForm from "./ProfileForm";
import Logout from "./Logout";
// import Processes from "../obsolete/Processes";
// import LoggingForm from "./SignupForm";
import { v4 as uuid } from "uuid";
import './App.css';


function App() {
  const CURRENT_USER_INITIAL_STATE = {
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    isAdmin: null,
    applications: null,
    token: null
  }
  
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [currUser, setCurrUser] = useState(CURRENT_USER_INITIAL_STATE);

  if (!localStorage.getItem("currUser")) {
    localStorage.setItem("currUser", JSON.stringify(CURRENT_USER_INITIAL_STATE));
  }   

  // localStorage.setItem("currUser", JSON.stringify(currUser));
  // JSON.parse(localStorage.getItem("currUser"));

  const login = async ({ username, password }) => {
    console.log("login");
    const token = await JoblyApi.loginUser(username, password);
    const user = await JoblyApi.getUser(username);
    setCurrUser({...user, token});
  };

  const signup = async ({ username, password, firstName, lastName, email }) => {
    console.log("signup");
    const token = await JoblyApi.signupUser(username, password, firstName, lastName, email);
    const user = await JoblyApi.getUser(username);
    setCurrUser({...user, token});
  }

  const editProfile = async ({ username, password, firstName, lastName, email }) => {
    console.log("edit profile");
    const res = await JoblyApi.updateUser(username, password, firstName, lastName, email);
    console.log("editProfile RES:");
    console.log(res);
    setCurrUser({
      ...currUser, 
      firstName: res.user.firstName, 
      lastName: res.user.lastName, 
      email: res.user.email
    });
  }

  const passwordCheck = async (username, password) => {
    const res = await JoblyApi.loginUser(username, password);
    console.log("passwordCheck:");
    console.log(!!res);
    return !!res;
  };

  const logout = async () => {
    console.log("logout");
    setCurrUser(CURRENT_USER_INITIAL_STATE);
    localStorage.setItem("currUser", JSON.stringify(CURRENT_USER_INITIAL_STATE));
  };

  const searchCompanies = async (name=null) => {
    name = name === "" ? null : name;
    const c = await JoblyApi.getCompanies(name);
    // console.log(c);
    // setCompanies(c);
    setCompanies(c.map(co => ({...co, id: uuid()})));
  };

  const searchJobs = async (title=null) => {
    title = title === "" ? null : title;
    const j = await JoblyApi.getJobs(title);
    // setJobs(j);
    setJobs(j);
  };

  const applyJob = async (jobId, username=currUser.username) => {
    JoblyApi.token = currUser.token;   // <= WHY IS THIS NEEDED?
    await JoblyApi.applyToTheJob(username, jobId);
    const apps = currUser.applications;
    apps.push(jobId);
    setCurrUser(currUser => ({
      ...currUser, 
      // applications: currUser.applications.push(jobId)
      applications: apps
    }));

    // const user = await JoblyApi.getUser(username);
    // setCurrUser(currUser => ({
    //   ...currUser,
    //   ...user
    // }));
  };


  useEffect(() => {
    console.log("useEffect state change");
    console.log("-------------");


    // WHEN PAGE IS REFRESHED AS LOGGED IN
    const ls = JSON.parse(localStorage.getItem("currUser"));
    console.log(ls);
    // if (ls) {
    if ((ls.token  && !currUser.token)) {
      console.log("SIGNED IN REFRESH");
      setCurrUser(JSON.parse(localStorage.getItem("currUser")));
    } else {
      // setLocalData(isSignedIn, currUser, token);
    }
    // }


    // WHEN JUST SIGNED IN
    if (currUser.token && !(ls && ls.token)) {
      console.log("JUST SIGNED IN");
      // console.log(ls);
      // console.log(ls.token);
      console.log("call jobs & companies");
      console.log(`companies.length => ${companies.length}`);
      console.log(`jobs.length => ${jobs.length}`);

      searchCompanies();
      searchJobs();

      localStorage.setItem("currUser", JSON.stringify(currUser));
    }

    if (JSON.stringify(currUser) !== localStorage.getItem("currUser")) {
      console.log("PROFILE EDITED");
      localStorage.setItem("currUser", JSON.stringify(currUser));
    }

    console.log(currUser);
    console.log(JSON.parse(localStorage.getItem("currUser")));
    setIsLoading(false);
  }, [currUser]);


  if (isLoading) {
    return <h3 className="App-loading">Loading &hellip;</h3>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar 
          signedIn={!!currUser.token} 
          username={currUser.username} 
          user={JSON.stringify(currUser)} 
        />
        {
          !!currUser.token
          ? 
          <main>
            <Switch>
              <Route exact path="/">
                <Home signedIn={!!currUser.token} user={currUser.username} />
              </Route>
              <Route exact path="/companies">
                <Companies companies={companies} searchCompanies={searchCompanies} />
              </Route>
              <Route exact path="/companies/:handle">
                <Company applications={currUser.applications} applyJob={applyJob} />
                {/* <Company username={currUser.username} /> */}
              </Route>
              <Route exact path="/jobs">
                <Jobs 
                  jobs={jobs} 
                  // username={currUser.username}
                  applications={currUser.applications} 
                  searchJobs={searchJobs} 
                  applyJob={applyJob} 
                />
              </Route>
              <Route exact path="/profile">
                {/* <h1>THIS IS PROFILE PAGE !!</h1> */}
                <ProfileForm 
                  user={JSON.stringify(currUser)} 
                  editProfile={editProfile} 
                  passwordCheck={passwordCheck}
                />
              </Route>
              <Route exact path="/logout">
                <Logout logout={logout} />
              </Route>
              {/* <Route exact path="/form">
                <LoggingForm />
              </Route> */}
              <Route>
                <h3>No such a page...</h3>
              </Route>
            </Switch>
          </main>
          : 
          <main>
            <Switch>
              <Route exact path="/">
                <Home login={login} signup={signup} />
              </Route>
              <Route exact path="/login">
                <LoginForm login={login} />
              </Route>
              <Route exact path="/signup">
                <SignupForm signup={signup} />
              </Route>
              {/* <Route exact path="/form">
                <LoggingForm />
              </Route> */}
              <Route>
                <h3>No such a page...</h3>
              </Route>
            </Switch>
          </main>
        }   
      </BrowserRouter>
    </div>
  );
}

export default App;