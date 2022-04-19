import { useState } from "react";
import axios from "axios";
import { v4 as uuid } from "uuid";

const useAxios = (url, name="") => {
  const [cards, setCards] = useState([]);

  const axiosData = async () => {
    try {
      const response = await axios.get(`${url}${name}`);
      setCards(cards => [...cards, { ...response.data, id: uuid() }]);
    }
    catch (err) {throw err};
  }

  return [cards, axiosData];
}

export default useAxios;