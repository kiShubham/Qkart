import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  // const [check, setCheck] = useState(false);
  const { enqueueSnackbar } = useSnackbar(); //its a hook provided by material ui library ;
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  // const [check,setCheck] = useState(false);

  // console.log( config.endpoint )
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function

  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * response status code for every successfull register  = 201 ;
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */

  const Confirmpasswordfn = (e) => {
    const [key, value] = [e.target.name, e.target.value];
    setFormData({ ...formData, [key]: value });
  };

  // So, the complete API path for the register will be <workspace-ip>:8082/api/v1/auth/register

  const register = async (formData) => {
    // validateInput(formData);
    // console.log(check);
    // if (check === true) {
    if (validateInput(formData)) {
      setIsLoading(true);
      try {
        let res = await axios.post(`${config.endpoint}/auth/register`, {
          username: formData.username,
          password: formData.password,
        });
        setIsLoading(false);
        setFormData({ username: "", password: "", confirmPassword: "" });
        enqueueSnackbar("Registered successfully", { variant: "success" });
        history.push("/login");
        //
      } catch (error) {
        setIsLoading(false);
        // console.log(error.response); //object ;
        if (error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, {
            // enqueueSnackbar("trying to register an already registered user", {
            variant: "error",
          });
        } else {
          enqueueSnackbar(error.response.data.message, { variant: "error" });
          // enqueueSnackbar("backend is not started", { variant: "error" });
        }
        // console.log(error.response.status); //400 for already existing user ;//404 backend problem
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    // {username: 'rr', password: 'rr', confirmPassword: 'rr'}
    if (data.username === "") {
      enqueueSnackbar(" Username is a required field ", {
        variant: "warning",
      });
      return false;
      // return setCheck(false);
    }
    if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 character", {
        variant: "warning",
      });
      return false;
      // return setCheck(false);
    }
    if (data.password === "") {
      enqueueSnackbar(" Password is a required field ", {
        variant: "warning",
      });
      return false;
      // return setCheck(false);
    }
    if (data.password.length < 6) {
      enqueueSnackbar(" Password must be at least 6 character ", {
        variant: "warning",
      });
      return false;
      // return setCheck(false);
    }
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar(" password do not match ", { variant: "warning" });
      return false;
      // return setCheck(false);
    }
    // return setCheck(true);
    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons={true} />

      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
            }}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
            }}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={Confirmpasswordfn}
          />
          {isLoading ? (
            <LinearProgress color="success" />
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={(e) => register(formData)}
            >
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            {/* <a className="link" href="/login">
              Login here
            </a> */}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
