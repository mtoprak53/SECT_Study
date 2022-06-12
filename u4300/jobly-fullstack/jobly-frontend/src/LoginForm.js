import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import "./Forms.css";

const LoginForm = ({ login }) => {
  const history = useHistory();

  const INITIAL_STATE = {
    username: null,
    password: null
  }

  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(formData => ({...formData, [name]: value}));
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    login(formData);
    history.push("/");
  }

  return (
    <div className="Forms">
      <h3>Login</h3>

      <div className="Forms-Form">
        <Form onSubmit={handleSubmit}>

          <FormGroup>
            <Label for="username" className="label">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="password" className="label">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
            />
          </FormGroup>
        
          <div className="Forms-Form-Button">
            <Button className="button primary" color="primary" type="submit">
              Submit
            </Button>
          </div>

        </Form>
      </div>
    </div>
  )
};

export default LoginForm;