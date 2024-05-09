import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";
// import Avatar from "@mui/material/Avatar";

const Header = ({ children, hasHiddenAuthButtons, search, handler }) => {
  const history = useHistory();

  const handleLogOut = (e) => {
    localStorage.clear();
    window.location.reload(false); // refersh page in react ;
    // history.push("/");
  };
  return (
    <div>
      <Box className="header">
        <Box className="header-title" onClick={() => history.push("/")}>
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Box>
        {hasHiddenAuthButtons ? (
          <Link to="/">
            <Button
              className="explore-button"
              startIcon={<ArrowBackIcon />}
              variant="text"
            >
              Back to explore
            </Button>
          </Link>
        ) : (
          <>
            {children}
            {localStorage.getItem("username") ? (
              <div className="sideheader">
                <img
                  src="avatar.png"
                  alt={localStorage.getItem("username")}
                  width="45px"
                  height="45px"
                />
                <div>{localStorage.getItem("username")}</div>
                <Button
                  className="login-button"
                  variant="text"
                  onClick={handleLogOut}
                >
                  logout
                </Button>
              </div>
            ) : (
              <div className="sideheader">
                <Link to="/login">
                  <Button className="login-button" variant="text">
                    login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained" className="register-button">
                    register
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default Header;
