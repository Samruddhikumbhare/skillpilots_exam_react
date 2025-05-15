// start on 6 May 2025 by medha
// Certificate page

import { Button, Typography, Box, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import bgImage from "../../images/certificate.png";

import html2canvas from "html2canvas";
import axios from "axios";
import { api } from "../../hooks/api";
import { useParams } from "react-router-dom";

const Certificate = () => {
  const i1100 = useMediaQuery("(max-width:1100px)");
  const i970 = useMediaQuery("(max-width:970px)");
  const i825 = useMediaQuery("(max-width:825px)");
  const i778 = useMediaQuery("(max-width:778px)");
  const i715 = useMediaQuery("(max-width:715px)");
  const i680 = useMediaQuery("(max-width:680px)");
  const i625 = useMediaQuery("(max-width:625px)");

  const i540 = useMediaQuery("(max-width:540px)");
  const i485 = useMediaQuery("(max-width:485px)");
  const i450 = useMediaQuery("(max-width:450px)");
  const i425 = useMediaQuery("(max-width:425px)");
  const i380 = useMediaQuery("(max-width:380px)");

  const { id } = useParams();

  const [certificateData, setCertificateData] = useState({});
  const [loader, setLoader] = useState(true);

  // get certificate
  useEffect(() => {
    axios
      .get(`${api}/newskill/score/${id}`)
      .then((response) => {
        setCertificateData(response.data[0]);
        setLoader(false);
      })
      .catch((error) => {});
    // eslint-disable-next-line
  }, []);

  const downloadHandler = () => {
    let div = document.getElementById("myCertificate");

    html2canvas(div).then(function (canvas) {
      const link = document.createElement("a");
      link.download = "skillpilot certificate.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  return (
    <>
      {/* import navbar */}
      <Navbar />
      <>
        {loader ? (
          <div className="loader"></div>
        ) : (
          <>
            <Box
              sx={{
                height: `calc(100vh - 90px)`,
                width: "auto",
                padding: {
                  xs: "10px",
                  sm: "10px 1%",
                  md: "10px 1%",
                  lg: "10px 10%",
                  xl: "10px 19%",
                },
              }}
            >
              <Box
                sx={{
                  height: {
                    xs: i380
                      ? "32%"
                      : i425
                      ? "35%"
                      : i450
                      ? "38%"
                      : i485
                      ? "40%"
                      : i540
                      ? "45%"
                      : "50%",
                    sm: i625
                      ? "58%"
                      : i680
                      ? "60%"
                      : i715
                      ? "65%"
                      : i778
                      ? "68%"
                      : i825
                      ? "70%"
                      : "80%",
                    md: i970 ? "88%" : i1100 ? "90%" : "92%",
                    lg: "95%",
                    xl: "100%",
                  },
                  position: "relative",
                }}
                id="myCertificate"
              >
                <img
                  src={bgImage}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    boxShadow: "1px 2px 5px 5px #dfdfdf",
                  }}
                  alt=""
                />
                <Box
                  sx={{
                    position: "absolute",
                    right: "5%",
                    top: "5.5%",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "none",
                      color: "#2c3072",
                      fontSize: {
                        xs: i450 ? "10px" : "12px",
                        sm: i825 ? "14px" : "16px",
                        md: "18px",
                      },
                    }}
                  >
                    {certificateData.certificate_no}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "83%",
                    position: "absolute",
                    left: "17%",
                    top: { xs: "40%", sm: "42%" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "emoji",
                      textAlign: "center",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      fontSize: {
                        xs: "18px",
                        sm: "25px",
                        md: "28px",
                      },
                      color: "#203C87",
                    }}
                  >
                    {certificateData.username}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    padding: { xs: "0 2%", sm: "0 5%" },
                    width: { xs: "79%", sm: "73%" },
                    position: "absolute",
                    left: "17%",
                    top: { xs: "50%", sm: "52%" },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      my: i540 ? 0.5 : 1,
                      fontFamily: "none",
                      width: "100%",
                      textAlign: "center",
                      fontSize: {
                        xs: i450 ? "10px" : "12px",
                        sm: i825 ? "14px" : "16px",
                        md: "18px",
                      },
                      lineHeight: {
                        xs: i450 ? "12px" : "15px",
                        sm: "20px",
                        md: "24px",
                      },
                    }}
                  >
                    In recognition of{" "}
                    {certificateData.gender === "F" ? "her" : "his"} commendable
                    achievements and valuable contributions in{" "}
                    <b>{certificateData.test_name}</b>, demonstrated by
                    successfully passing at the {certificateData.level} level
                    with a score of{" "}
                    <b>
                      {Number(
                        (certificateData?.score /
                          certificateData?.total_marks) *
                          100
                      ).toFixed(2) || 0}
                      %
                    </b>
                    , which have significantly contributed to the growth and
                    values.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    padding: { xs: "0 2%", sm: "0 5%" },
                    width: { xs: "79%", sm: "73%" },
                    position: "absolute",
                    left: "17%",
                    bottom: "5%",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontFamily: "none",
                      width: "100%",
                      fontSize: {
                        xs: i450 ? "10px" : "12px",
                        sm: i825 ? "14px" : "16px",
                        md: "18px",
                      },
                    }}
                  >
                    Date:{" "}
                    {new Date(certificateData.issued_at).toLocaleDateString(
                      "en-GB"
                    )}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  onClick={downloadHandler}
                  variant="contained"
                  sx={{ m: 2 }}
                >
                  Download Certificate
                </Button>
              </Box>
            </Box>
          </>
        )}
      </>
    </>
  );
};

export default Certificate;
