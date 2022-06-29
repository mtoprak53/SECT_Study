import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormFeedback, FormGroup, Label, Input, Button } from "reactstrap";
import "./Forms.css";

const SignupForm = ({ signup }) => {
  const history = useHistory();

  const INITIAL_STATE = {
    username: null,
    password: null,
    firstName: null,
    lastName: null, 
    email: null
  }

  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(formData => ({...formData, [name]: value}));
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    signup(formData);
    history.push("/");
  }

  return (
    <div className="Forms">
      <h3>Sign Up</h3>

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
              // valid={false}
              // invalid={false}
            />
            {/* <FormFeedback valid>
              Sweet! that name is available
            </FormFeedback> */}
          </FormGroup>

          
          <FormGroup>
            <Label for="first-name" className="label">
              First name
            </Label>
            <Input
              id="first-name"
              name="firstName"
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="last-name" className="label">
              Last name
            </Label>
            <Input
              id="last-name"
              name="lastName"
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <Label for="e-mail" className="label">
              Email
            </Label>
            <Input
              id="e-mail"
              name="email"
              type="email"
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

export default SignupForm;