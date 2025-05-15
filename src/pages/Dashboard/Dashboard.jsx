// start on 11 March 2025 by medha
// show dashboard

import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  ListItemText,
  TextField,
  Checkbox,
  List,
  ListItemButton,
} from "@mui/material";
import { School } from "@mui/icons-material";
import TestStepper from "./TestStepper";
import Chart from "./Chart";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import { api } from "../../hooks/api";
import Swal from "sweetalert2";

// dashboard ui
const Dashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isIntermediateScreen = useMediaQuery(theme.breakpoints.down("md"));
  // eslint-disable-next-line
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("skillpilotquizStudentUser")) || {}
  );
  const [isFirstLogin, setIsFirstLogin] = useState(
    JSON.parse(localStorage.getItem("skillpilotquizStudentUserLoginStatus"))
  );
  const [codingLanguages, setCodingLanguages] = useState([]);
  const [technology, setTechnology] = useState([]);
  const [filterTechnology, setFilterTechnology] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState("");
  const [search, setSearch] = useState("");
  const [codingLanguagesFilter, setCodingLanguagesFilter] = useState([]);
  const [bestLanguage, setBestLanguage] = useState([]);
  const [testWiseScore, setTestWiseScore] = useState([]);
  const [loader, setLoader] = useState(true);

  // get all technology as per student
  useEffect(() => {
    if (isFirstLogin) {
      axios
        .get(`${api}/newskill/skills/${userData?.id}`)
        .then((response) => {
          setTechnology(response.data.skills.split(","));
          setFilterTechnology(response.data.skills.split(","));
          setLoader(false);
        })
        .catch((error) => {});
    }
    // eslint-disable-next-line
  }, []);

  // set the best language & score
  useEffect(() => {
    // filter the test percentage
    const testPercentages = codingLanguages.map(
      ({ name: testName, attempts }) => {
        let totalObtainedMarks = 0;
        let totalMarksAll = 0;

        attempts.forEach(({ obtainedMarks, totalMarks }) => {
          totalObtainedMarks += obtainedMarks;
          totalMarksAll += totalMarks;
        });

        const percentage =
          totalMarksAll === 0
            ? 0
            : ((totalObtainedMarks / totalMarksAll) * 100).toFixed(2);

        return {
          test: testName,
          totalObtainedMarks,
          totalMarks: totalMarksAll,
          percentage: percentage,
        };
      }
    );
    setTestWiseScore(testPercentages);

    const bestL = testPercentages.reduce((maxObj, obj) => {
      return Number(obj.percentage) > Number(maxObj.percentage) ? obj : maxObj;
    }, testPercentages[0]);

    setBestLanguage(bestL);
  }, [codingLanguages]);

  useEffect(() => {
    if (!isFirstLogin) {
      axios
        .get(`${api}/newskill/testAll?studentId=${userData?.id}`)
        .then((response) => {
          setCodingLanguagesFilter(response.data);
          setCodingLanguages(response.data);
          setLoader(false);
        })
        .catch((error) => {});
    }
    // eslint-disable-next-line
  }, [isFirstLogin]);

  // search prefer technology for select
  const handleSearch = (e) => {
    setSearch(e.target.value);
    const filtered = technology.filter((tech) =>
      tech.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterTechnology(filtered);
  };

  // select the preferred technology and call api
  const handleSelectTechnology = () => {
    axios
      .post(`${api}/newskill/addPreference`, {
        studentId: userData?.id,
        preferredSkill: selectedTechnology.trim(),
      })
      .then((response) => {
        localStorage.setItem("skillpilotquizStudentUserLoginStatus", false);
        Swal.fire({
          title: "Success!",
          text: "Preferred Set Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          setIsFirstLogin(false);
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message || "Something went wrong...",
          icon: "error",
          confirmButtonText: "OK",
        });
      });
  };

  return (
    <>
      {loader ? (
        <div className="loader"></div>
      ) : (
        <>
          {/* is studesnt login first time set preferd langauge  */}
          {isFirstLogin ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100vh"
            >
              <Card sx={{ width: 400, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    textAlign="center"
                    color="primary"
                    gutterBottom
                  >
                    Choose Your Path
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="center"
                    mb={3}
                  >
                    Select your preferred technology to get started.
                  </Typography>

                  {/* Search Bar */}
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Search"
                    value={search}
                    onChange={handleSearch}
                    sx={{ mb: 2 }}
                  />

                  {/* technology List (Always Visible) */}
                  <List sx={{ maxHeight: "60vh", overflow: "auto" }}>
                    {filterTechnology.map((tech) => (
                      <ListItemButton
                        key={tech}
                        onClick={() => setSelectedTechnology(tech)}
                        selected={selectedTechnology === tech}
                      >
                        {/* <ListItemIcon>{tech.flag}</ListItemIcon> */}
                        <ListItemText primary={tech} />
                        {selectedTechnology === tech && (
                          <Checkbox checked sx={{ padding: 0 }} />
                        )}
                      </ListItemButton>
                    ))}
                  </List>

                  {/* Continue Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, width: "100%", fontWeight: "bold", py: 1 }}
                    onClick={handleSelectTechnology}
                  >
                    Continue
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ) : (
            <>
              {/* import navbar */}
              <Navbar
                codingLanguages={codingLanguages}
                setCodingLanguagesFilter={setCodingLanguagesFilter}
              />

              <Box sx={{ p: { lg: 3, md: 2, sm: 1, xs: 1 } }}>
                {/* Message */}
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ textAlign: "center", mb: 4 }}
                >
                  Explore your skills and track your progress below.
                </Typography>

                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  sx={{ maxHeight: "63vh", overflow: "auto", p: 1 }}
                >
                  {codingLanguages?.length === 0 ? (
                    <h2 style={{ color: "red" }}>Test are not available</h2>
                  ) : (
                    <>
                      {codingLanguagesFilter?.length === 0 ? (
                        <h2 style={{ color: "red" }}>
                          "No tests match your search."
                        </h2>
                      ) : (
                        <>
                          {/* Search Bar */}

                          {codingLanguagesFilter?.map((lang) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              key={lang?.name}
                            >
                              <Card
                                elevation={6}
                                sx={{
                                  p: 2,
                                  textAlign: "center",
                                  borderRadius: 3,
                                  background:
                                    "linear-gradient(145deg, #ffffff 0%, #e8f0fe 100%)",
                                  transition: "transform 0.3s, box-shadow 0.3s",
                                  "&:hover": {
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 12px 24px rgba(0,0,0,0.2)",
                                  },
                                }}
                              >
                                <CardContent>
                                  <Typography
                                    variant="h6"
                                    fontWeight="bold"
                                    color="primary"
                                  >
                                    {lang?.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    my={2}
                                    className="description"
                                  >
                                    {lang.description}
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() =>
                                      navigate(`/exam/${JSON.stringify(lang)}`)
                                    }
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: "none",
                                      px: 3,
                                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                    }}
                                  >
                                    Start Exam
                                  </Button>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </Grid>

                {codingLanguages?.some(
                  (test) => test?.attempts?.length > 0
                ) && (
                  <>
                    <Divider sx={{ my: 5, borderColor: "#e0e0e0" }} />
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Chart testWiseScore={testWiseScore} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TestStepper
                          codingLanguages={codingLanguages}
                          bestLanguage={bestLanguage}
                        />
                      </Grid>
                    </Grid>

                    {/* Recommendation Box */}
                    {bestLanguage?.test && (
                      <Box
                        mt={5}
                        p={3}
                        sx={{
                          backgroundColor: "#4caf50",
                          borderRadius: 3,
                          color: "white",
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <School fontSize="large" sx={{ mr: 2 }} />
                        <Typography
                          variant={"h6"}
                          sx={{ fontSize: isIntermediateScreen && "14px" }}
                          fontWeight="bold"
                        >
                          Recommendation: You should continue learning{" "}
                          <span style={{ color: "#ffeb3b" }}>
                            {bestLanguage?.test}
                          </span>{" "}
                          as you have the highest marks in it!
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Dashboard;
