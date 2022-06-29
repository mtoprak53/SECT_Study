import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, FormFeedback, FormGroup, Label, Input, Button } from "reactstrap";
import "./Forms.css";

const ProfileForm = ({ user, editProfile, passwordCheck }) => {
  const history = useHistory();

  // const INITIAL_STATE = {
  //   username: null,
  //   password: null,
  //   firstName: null,
  //   lastName: null, 
  //   email: null
  // }

  const u = JSON.parse(user);

  const {
    username, 
    password, 
    firstName, 
    lastName, 
    email
  } = u;

  const [formData, setFormData] = useState({
    username, 
    password, 
    firstName, 
    lastName, 
    email
  });
  const [invalidPassword, setInvalidPassword] = useState(null);

  const handleChange = evt => {
    const { name, value } = evt.target;
    setFormData(formData => ({...formData, [name]: value}));
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const passCheck = await passwordCheck(username, formData.password);
    setInvalidPassword(invalidPassword => !passCheck);
    console.log(`passCheck  =>  ${passCheck}`);
    console.log(`invalidPassword  =>  ${invalidPassword}`);
    // if (invalidPassword) return;
    if (passCheck) {
      editProfile({ ...formData });
      history.push("/");
    };
  }

  // useState()

  // const user = getUserDetails();

  return (
    <div className="Forms">
      <h3>Profile</h3>

      <div className="Forms-Form">
        <Form onSubmit={handleSubmit}>

          <FormGroup>
            <Label for="username" className="label">
              Username
            </Label>
            <p>{formData.username}</p>
          </FormGroup>
          
          <FormGroup>
            <Label for="first-name" className="label">
              First name
            </Label>
            <Input
              id="first-name"
              name="firstName"
              value={formData.firstName}
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
              value={formData.lastName}
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
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label for="password" className="label">
              Confirm password to make changes:
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              invalid={invalidPassword}
            />
            <FormFeedback>
              Password is not correct!
            </FormFeedback>
          </FormGroup>
        
          <div className="Forms-Form-Button">
            <Button block className="button primary block" color="primary" type="submit">
              Save Changes
            </Button>
          </div>

        </Form>
      </div>
    </div>
  )
};

export default ProfileForm;