// start on 13 March 2025 by medha
// login page

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { api } from "../../hooks/api";
import logo from "../../images/logo.png"; // Replace with your actual logo path
import bgImage from "../../images/bg.png"; // Replace with your background image path

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isApiCall, setIsApiCall] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // call login api for  submit form
  const onSubmit = async (data) => {
    setIsApiCall(true);
    axios
      .post(`${api}/newskill/signin`, data)
      .then((response) => {
        if (
          response.data.statusCode === 200 &&
          (response.data.user.role.toString() === "0" ||
            response.data.user.role.toString() === "10")
        ) {
          document.cookie = `skillpilotquizStudentLogin=${response.data.token};`;
          localStorage.setItem(
            "skillpilotquizStudentUser",
            JSON.stringify(response.data.user)
          );
          localStorage.setItem(
            "skillpilotquizStudentUserLoginStatus",
            JSON.stringify(response.data.loginStatus)
          );
          Swal.fire({
            title: "Success!",
            text: "Login Successfully!",
            icon: "success",
            confirmButtonText: "OK",
          });
          window.location.reload();
        } else {
          Swal.fire({
            title: "Error",
            text: response.data.message.includes("success")
              ? "Invalid Email Id & Password"
              : response.data.message,
            icon: "error",
            confirmButtonText: "OK",
          });
        }
        setIsApiCall(false);
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error?.message || "Something went wrong...",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsApiCall(false);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: window.innerHeight,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          background: "rgba(0,0,0,0.1)",
          width: "100%",
        }}
      >
        <Box
          sx={{
            px: { lg: 4, sm: 2, xs: 2 },
            py: 6,
            boxShadow: "2px 0 20px 2px #000000",
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255)", // Adds a slight white background
            m: 2,
            maxWidth: 360,
          }}
        >
          {/* logo */}
          <img
            src={logo}
            style={{ height: "30px", width: "auto" }}
            alt="logo"
          />
          <Typography
            variant="h6"
            align="center"
            fontWeight="bold"
            gutterBottom
            mt={4}
            mb={3}
          >
            Login
          </Typography>
          {/* form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl fullWidth error={!!errors.email} sx={{ mb: 2 }}>
              <InputLabel>Email Id</InputLabel>
              <OutlinedInput
                label="Email Id"
                type="email"
                {...register("email", {
                  required: "Email Id is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid Email Id",
                  },
                })}
              />
              {errors.email && (
                <FormHelperText>{errors.email.message}</FormHelperText>
              )}
            </FormControl>

            <FormControl fullWidth error={!!errors.password} sx={{ mb: 3 }}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {errors.password && (
                <FormHelperText>{errors.password.message}</FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={isApiCall}
              sx={{ mt: 1 }}
            >
              {isApiCall ? <CircularProgress size={24} /> : "Log In"}
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
