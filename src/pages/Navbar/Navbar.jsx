// start on 13 March 2025 by medha
import React, { useState } from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import logoImage from "../../images/logo white.png";
import { Close, Logout, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Navbar = ({ codingLanguages, setCodingLanguagesFilter }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const name = JSON.parse(
    localStorage.getItem("skillpilotquizStudentUser")
  )?.name;

  const [searchTest, setSearchTest] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  // Logout function
  const logoutHandler = () => {
    document.cookie = "skillpilotquizStudentLogin=";
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Search filtering
  const handleSearchTest = (e) => {
    setSearchTest(e.target.value);
    const filtered = codingLanguages.filter((tech) =>
      tech.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setCodingLanguagesFilter(filtered);
  };

  return (
    <Box
      textAlign="center"
      sx={{
        background: "#09017e",
        color: "white",
        px: {
          lg: 2,
          md: 2,
          sm: 2,
          xs: 1,
        },
        py: {
          lg: 2,
          md: 2,
          sm: 2,
          xs: window.location.pathname === "/" ? 1 : 1.5,
        },
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <img
        src={logoImage}
        style={{
          width: isSmallScreen ? "100px" : "150px ",
          height: "auto",
        }}
        alt="logo"
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "flex-start",
          position: "relative",
        }}
      >
        {window.location.pathname === "/" && (
          <>
            {/* Search Icon */}
            <IconButton
              size="small"
              onClick={() => setSearchOpen(true)}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(128, 128, 128, 0.2)", // Light gray background on hover
                },
              }}
            >
              <Search
                sx={{ color: "white", "&:hover": { color: "gray" } }}
                fontSize="small"
              />
            </IconButton>

            {/* Persistent Search Box */}
            {searchOpen && (
              <Paper
                elevation={3}
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: -150,
                  mt: 1,
                  p: 1,
                  width: 280,
                  zIndex: 1500,
                }}
              >
                <TextField
                  autoFocus
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Search Test Name"
                  value={searchTest}
                  onChange={handleSearchTest}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            setSearchOpen(false);
                            setCodingLanguagesFilter(codingLanguages);
                            setSearchTest("");
                          }}
                        >
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Paper>
            )}
          </>
        )}

        {/* Welcome Message */}
        <Typography
          variant={isSmallScreen ? "body2" : "h6"}
          fontWeight="bold"
          sx={{ mr: { lg: 2, sm: 1, xs: 1 }, ml: 1 }}
        >
          Welcome, {name?.split(" ")[0]}!
        </Typography>

        {/* Logout Button (Hidden on exam page) */}
        {!window.location.pathname.includes("startexam") && (
          <IconButton
            sx={{
              backgroundColor: "white",
              boxShadow: "0px 1px 1px 2px rgb(40, 40, 40)",
              borderRadius: "50%",
              padding: isSmallScreen ? "5px" : "8px",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                transform: "scale(1.05)",
              },
            }}
            size="small"
            onClick={logoutHandler}
          >
            <Logout sx={{ fontSize: isSmallScreen && "12px" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;
