import React, { useState } from "react";
import "./Jobs.css";
import { Form, FormGroup, Input, Button } from "reactstrap";
import "./SearchForm.css";

const SearchForm = ({ searchItems }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = evt => {
    setSearchTerm(evt.target.value);
  };

  const handleSubmit = evt => {
    evt.preventDefault();
    searchItems(searchTerm);
  };

  return (
    <div className="SearchForm">
      <Form clasName="SearchForm-Form" onSubmit={handleSubmit}>
        <FormGroup className="SearchForm-FormGroup">
          <Input 
            id="search-term" 
            name="search-term" 
            placeholder="Enter search term ..." 
            type="text"
            onChange={handleChange}
          />
          <Button 
            className="SearchForm-Button" 
            color="primary"
            type="submit"
          >
            SEARCH
          </Button>
        </FormGroup>
      </Form>
    </div>
  )
}

export default SearchForm;