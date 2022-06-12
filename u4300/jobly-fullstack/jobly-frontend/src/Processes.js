import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

const Processes = ({ process }) => {
  const history = useHistory();

  useEffect(() => {
    process();
    history.push("/");
  }, []);

  return (null)
}

export default Processes;