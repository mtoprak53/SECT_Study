import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Signup = (signup) => {
  const history = useHistory();

  useEffect(() => {
    signup();
    history.push("/");
  }, []);

  return (null)
}

export default Signup;