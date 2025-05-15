// start on 12 March 2025 by medha
// instruction page

import { useNavigate, useParams } from "react-router-dom";
import { Button, Typography, Box, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { useQuestion } from "../../context/QuestionProvider";
import bgImage from "../../images/bgexam.png"; // Replace with your background image path

const Instruction = () => {
  const navigate = useNavigate();
  const { lan, level, testName } = useParams(); // Get language and level from URL
  const { getAllQuestion, setIds, loader, setLoader } = useQuestion();
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (getAllQuestion?.sections?.length > 0) {
      const getQ = getAllQuestion.sections.reduce(
        (total, sec) => (sec?.questions?.length || 0) + total,
        0
      );

      if (getQ === getAllQuestion?.noOfQuestion) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    } else {
      setIsShow(false);
    }

    setLoader(false);

    return () => {
      setIsShow(false);
    };
    // eslint-disable-next-line
  }, [getAllQuestion]);

  useEffect(() => {
    setIds({
      test: lan,
      level: level,
    });
    // eslint-disable-next-line
  }, [lan, level]);

  // show exam time
  const formatTime = () => {
    if (getAllQuestion?.timeLimit >= 60) {
      const hours = Math.floor(getAllQuestion?.timeLimit / 60);
      const remainingMinutes = getAllQuestion?.timeLimit % 60;
      return remainingMinutes > 0
        ? `${hours} hr ${remainingMinutes} min`
        : `${hours} hr`;
    }
    return `${getAllQuestion?.timeLimit} min`;
  };

  return (
    <>
      {/* import navbar */}
      <Navbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: `auto`,
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
          {loader ? (
            <div className="loader"></div>
          ) : (
            <>
              {isShow ? (
                <Box
                  mt={4}
                  textAlign="center"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight="bold"
                    mb={2}
                  >
                    {testName} -{" "}
                    {level.charAt(0).toUpperCase() + level.slice(1)} Exam
                  </Typography>

                  <Paper
                    elevation={4}
                    sx={{
                      maxWidth: 750,
                      padding: { md: 2, sm: 1, xs: 1 },
                      textAlign: "left",
                      m: 1,
                      py: 2,
                    }}
                  >
                    <Typography variant="h6" textAlign="center">
                      Instructions
                    </Typography>
                    {/* General Guidelines */}
                    <Box mt={2}>
                      <Typography
                        variant="body1"
                        color="primary"
                        fontWeight="bold"
                      >
                        📌 General Guidelines:
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        ✅ Duration: You have <strong>{formatTime()}</strong> to
                        complete the exam.
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        ✅ Questions: The exam consists of{" "}
                        <strong>
                          {getAllQuestion?.sections?.reduce(
                            (total, sec) => sec?.questions?.length + total,
                            0
                          )}{" "}
                          multiple-choice questions
                        </strong>
                        .
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        ✅ Passing Criteria: You must score at least{" "}
                        <strong>
                          {(getAllQuestion?.passingMarks /
                            (getAllQuestion?.noOfQuestion *
                              getAllQuestion?.marksPerQuestion)) * // Prevent division by zero
                            100}
                          %
                        </strong>{" "}
                        to pass.
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        ✅ Total Marks: The exam is scored out of{" "}
                        <strong>
                          {getAllQuestion?.noOfQuestion *
                            getAllQuestion?.marksPerQuestion}{" "}
                          marks
                        </strong>
                        .
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        ✅ Passing Marks: You must score at least{" "}
                        <strong>{getAllQuestion?.passingMarks} marks</strong>.
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        ✅ No Assistance: You are not allowed to use external
                        resources, books, or search engines.
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        ✅ No Pausing: The exam cannot be paused once started.
                      </Typography>
                    </Box>

                    {/* Important Rules */}
                    <Box mt={4}>
                      <Typography
                        variant="body1"
                        color="error"
                        fontWeight="bold"
                      >
                        ⚠️ Important Rules:
                      </Typography>
                      <Typography variant="body2" ml={2} color="error">
                        🚫 Do not switch tabs, refresh, or go back during the
                        exam. Doing so will result in immediate
                        disqualification.
                      </Typography>{" "}
                      <Typography variant="body2" ml={2} color="error">
                        ❌ Closing the exam window will also disqualify you.
                      </Typography>{" "}
                      <Typography variant="body2" ml={2} color="error">
                        ⏳ Time Limit: You must complete the exam within the
                        given time. If time runs out, the exam will auto-submit.
                      </Typography>
                    </Box>

                    {/* Exam Conduct Instructions */}
                    <Box mt={4}>
                      <Typography
                        variant="body1"
                        color="info.main"
                        fontWeight="bold"
                      >
                        📝 Exam Conduct Instructions:
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        📌 Read all questions carefully before selecting your
                        answers.
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        📌 Do not refresh or reload the exam page, as it may
                        lead to submission failure.
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        📌 Ensure a stable internet connection before starting
                        the exam.
                      </Typography>
                      <Typography variant="body2" ml={2}>
                        📌 Click "Submit" once you have completed the exam.
                      </Typography>
                    </Box>

                    {/* Start Exam Button */}
                    <Box mt={3} textAlign="center">
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={() => navigate(`/startexam/${lan}/${level}`)}
                      >
                        Start Exam
                      </Button>
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Box
                  mt={4}
                  textAlign="center"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight="bold"
                    mb={2}
                  >
                    {testName} -{" "}
                    {level.charAt(0).toUpperCase() + level.slice(1)} Exam
                  </Typography>

                  <Paper
                    elevation={4}
                    sx={{
                      maxWidth: 750,
                      padding: { md: 2, sm: 1, xs: 1 },
                      textAlign: "left",
                      m: 1,
                      py: 2,
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    "There are no questions available for this exam right now.
                    Please try again after some time."
                  </Paper>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Instruction;
