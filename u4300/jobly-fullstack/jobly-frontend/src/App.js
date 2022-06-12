import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import JoblyApi from "./api"
import NavBar from "./NavBar";
import Home from "./Home";
import Companies from "./Companies";
import Jobs from "./Jobs";
import Company from "./Company";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Processes from "./Processes";
import LoggingForm from "./SignupForm";

import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const printStates = () => {
    console.log("States:");
    console.log(`isSignedIn => ${isSignedIn}`);
    console.log(`username => ${currUser}`);
    console.log(`token => ${token}`);
    console.log(" ");
  }

  const printLocalData = () => {
    console.log("localStorage:");
    console.log(`isSignedIn => ${localStorage.getItem("isSignedIn")}`);
    console.log(`username => ${localStorage.getItem("username")}`);
    console.log(`token => ${localStorage.getItem("token_")}`);
    console.log(" ");
  }

  const getLocalData = () => {
    setIsSignedIn(localStorage.getItem("isSignedIn"));
    setCurrUser(localStorage.getItem("username"));
    setToken(localStorage.getItem("token_"));
  }

  const setLocalData = (isSignedIn=false, currUser=null, token=null) => {
    localStorage.setItem("isSignedIn", isSignedIn);
    localStorage.setItem("username", currUser);
    localStorage.setItem("token_", token);
  }

  const login = async ({ username, password }) => {
    console.log("login");
    const TOKEN = await JoblyApi.loginUser(username, password);

    // setIsLoading(true);
    setIsSignedIn(true);
    setCurrUser(username);
    setToken(TOKEN);

    // setLocalData(true, username, password);
  };

  const signup = async ({ username, password, firstName, lastName, email }) => {
    console.log("signup");
    await JoblyApi.signupUser(username, password, firstName, lastName, email);

    // login(username, password);
    console.log("login");
    const TOKEN = await JoblyApi.loginUser(username, password);

    // setIsLoading(true);
    setIsSignedIn(true);
    setCurrUser(username);
    setToken(TOKEN);

    // setLocalData(true, username, password);
  }

  const logout = async () => {
    console.log("logout");
    
    setIsSignedIn(false);
    setCurrUser(null);
    setToken(null);
  };

  const searchCompanies = async (name=null) => {
    name = name === "" ? null : name;
    const c = await JoblyApi.getCompanies(name);
    setCompanies(c);    
  };

  const searchJobs = async (title=null) => {
    title = title === "" ? null : title;
    const j = await JoblyApi.getJobs(title);
    setJobs(j);
  };


  useEffect(() => {
    console.log("useEffect 1st");
    console.log("-------------");

    if (localStorage.getItem("isSignedIn") === "true") {
      getLocalData();
      printStates();
    }

    printLocalData();
    setIsLoading(false);
  }, []);
  


  useEffect(() => {
    console.log("useEffect state change");
    console.log("-------------");
    printStates();
    printLocalData();

    setLocalData(isSignedIn, currUser, token);

    if (isSignedIn) {
      console.log("call jobs & companies");
      console.log(`companies.length => ${companies.length}`);
      console.log(`jobs.length => ${jobs.length}`);

      searchCompanies();
      searchJobs();
    }

    setIsLoading(false);
  }, [isSignedIn, currUser, token]);


  if (isLoading) {
    return <h3 className="App-loading">Loading &hellip;</h3>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar signedIn={isSignedIn} user={currUser} />
          {
            isSignedIn
            ? 
            <main>
              <Switch>
                <Route exact path="/">
                  <Home signedIn={isSignedIn} user={currUser} />
                </Route>
                <Route exact path="/companies">
                  <Companies companies={companies} searchCompanies={searchCompanies} />
                </Route>
                <Route exact path="/companies/:handle">
                  <Company />
                </Route>
                <Route exact path="/jobs">
                  <Jobs jobs={jobs} searchJobs={searchJobs} />
                </Route>
                <Route exact path="/profile">
                  <h1>THIS IS PROFILE PAGE !!</h1>
                </Route>
                <Route exact path="/logout">
                  <Processes process={logout} />
                </Route>
                <Route exact path="/form">
                  <LoggingForm />
                </Route>
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
                <Route exact path="/form">
                  <LoggingForm />
                </Route>
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