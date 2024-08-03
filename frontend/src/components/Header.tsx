import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      sx={{ bgcolor: "transparent", position: "static", boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="gold"
                to="/saved-plans"
                text="Saved Lifting Plans"
                textColor="black"
              />
              <NavigationLink
                bg="gold"
                to="/lifting-plans"
                text="Lifting Plans"
                textColor="black"
              />
              <NavigationLink
                bg="gold"
                to="/saved-videos"
                text="Saved Videos"
                textColor="black"
              />
              <NavigationLink
                bg="gold"
                to="/chat"
                text="Go To Chat"
                textColor="black"
              />
              <NavigationLink
                bg="gold"
                textColor="black"
                to="/"
                text="Logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
              <NavigationLink
                bg="gold"
                to="/login"
                text="Login"
                textColor="black"
              />
              <NavigationLink
                bg="gold"
                textColor="black"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;