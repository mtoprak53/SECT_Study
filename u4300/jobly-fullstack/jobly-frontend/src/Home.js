import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from 'reactstrap';
import "./Home.css";

const Home = ({ signedIn=false, user }) => {

  return (
    <div className="Home">
      <h1>Jobly</h1>
      <p>All the jobs in one, convenient place.</p>
      {
        signedIn 
        ? 
        <h3>Welcome Back, {user}!</h3>
        : 
        <div className="Home-buttons">
          <div className="Home-button">
            <Link to="/login">
              {/* <Button color="primary" onClick={login}>Log in</Button> */}
              <Button color="primary">Log in</Button>
            </Link>
          </div>
          <div className="Home-button">
            <Link to="/signup">
              {/* <Button color="success" onClick={signup}>Sign up</Button> */}
              <Button color="success">Sign up</Button>
            </Link>
          </div>
        </div>
      }
    </div>
  )
}

export default Home;