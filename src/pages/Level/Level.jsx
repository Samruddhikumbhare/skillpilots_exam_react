import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  IconButton,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import bgImage from "../../images/bgexam.png"; // Replace with your background image path
import Swal from "sweetalert2";

const Level = () => {
  const { lan } = useParams();
  const language = JSON.parse(lan);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const [open, setOpen] = useState(false);
  const [msg, setMessage] = useState("");

  // Close Snackbar
  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  // Handle Level Click
  const handleLevelClick = (level) => {
    if (!language[level]) {

      if(level === "intermediate" && language?.payment === false) {


        Swal.fire({
          title: "",
          text: "To appear for the Intermediate level exam, you must complete the payment first.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Ok",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
           window.open("https://home.skillpilots.com/paymentpage")
          } 
        });
        
        return
      }
      setMessage(
        `You must pass the ${
          level === "intermediate" ? "basic" : "intermediate"
        } level before attempting ${level}.`
      );
      setOpen(true);
    } else {
      navigate(
        `/instruction/${language.name}/${language.id}/${level.toLowerCase()}`
      );
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: `calc(100vh - 72px)`,
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
            background: "rgba(255,255,255,0.8)",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: { lg: 3, md: 0 },
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: "95%",
            }}
          >
            {/* Title */}
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                color: "#333",
                mb: 2.5,
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              Select Level for {language?.name}
            </Typography>

            {/* Title */}
            <Typography
              variant="subtitle2"
              sx={{
                color: "#333",
                mb: 4,
                textAlign: "center",
              }}
            >
              {language?.description}
            </Typography>
            {/* Levels for Each language */}
            <Box key={language.id} sx={{ textAlign: "center", mb: 5 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: isSmallScreen ? "column" : "row",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#4caf50",
                    padding: "12px 24px",
                    borderRadius: "25px",
                    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                    "&:hover": { backgroundColor: "#45a049" },
                  }}
                  onClick={() => handleLevelClick("basic")}
                >
                  Basic
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ff9800",
                    padding: "12px 24px",
                    borderRadius: "25px",
                    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                    "&:hover": { backgroundColor: "#f57c00" },
                    cursor: language?.intermediate ? "pointer" : "no-drop",
                  }}
                  onClick={() => handleLevelClick("intermediate")}
                >
                  Intermediate
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#f44336",
                    padding: "12px 24px",
                    borderRadius: "25px",
                    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.2)",
                    "&:hover": { backgroundColor: "#d32f2f" },
                    cursor: language?.advanced ? "pointer" : "no-drop",
                  }}
                  onClick={() => handleLevelClick("advanced")}
                >
                  Advanced
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Snackbar */}
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={msg}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={handleClose}
                sx={{
                  position: isSmallScreen ? "absolute" : "relative",
                  top: 8,
                  right: "-2px",
                  marginTop: !isSmallScreen && "-15px",
                }} // Moves close icon to the top right
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              "& .MuiSnackbarContent-root": {
                backgroundColor: "#d32f2f",
                color: "white",
                borderRadius: "8px",
                position: "relative", // Needed to position the close button correctly
              },
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Level;
