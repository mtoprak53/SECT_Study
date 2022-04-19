import { useState } from "react";

const useFlip = (initialState=true) => {
  const [state, setState] = useState(initialState);
  const flipIt = () => {
    setState(state => !state);
  }
  return [state, flipIt];
}

export default useFlip;