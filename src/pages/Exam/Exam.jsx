// start on 14 March 2025 by medha
// exam page

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  Checkbox,
  Box,
  LinearProgress,
  Paper,
  Grid,
  useMediaQuery,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { AccessTime, ExpandMore, WarningAmber } from "@mui/icons-material";
import { Link, useNavigate, useParams } from "react-router-dom";
import Confettiful from "./Confettiful";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";
import { useQuestion } from "../../context/QuestionProvider";
import axios from "axios";
import { api } from "../../hooks/api";
import Swal from "sweetalert2";

export default function Exam() {
  // show result content
  const resultStyles = {
    passed: {
      backgroundColor:
        "radial-gradient(circle, rgb(255 255 255), rgb(132 243 147))",
      emoji: "🏆",
      title: "Congratulations!",
      message: "You have successfully passed the exam.",
    },
    failed: {
      backgroundColor: "transparent",
      emoji: "😢",
      title: "Better Luck Next Time!",
      message: "Unfortunately, you did not pass.",
    },
    disqualified: {
      backgroundColor: "transparent",
      emoji: "❌",
      title: "Disqualified",
      message:
        "You have been disqualified for leaving the page, going back, or refreshing.",
    },
  };
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { id, testId, level } = useParams();
  const { getAllQuestion, setIds, loader, setLoader } = useQuestion();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(getAllQuestion?.timeLimit * 60);
  const [userData] = useState(
    JSON.parse(localStorage.getItem("skillpilotquizStudentUser")) || {}
  );
  const [examResult, setExamResult] = useState("DISQUALIFIED");
  const [examResultResponse, setExamResultResponse] = useState({});
  const [isApiCall, setIsApiCall] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loaderSubmit, setLoaderSubmit] = useState(false);
  const [expandedSection, setExpandedSection] = useState(0); // Track expanded accordion
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const selectedAnswersRef = useRef(selectedAnswers);

  // Update ref whenever selectedAnswers changes
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  // Function to determine which section contains the current question
  const getCurrentSectionIndex = () => {
    let questionCount = 0;
    for (let i = 0; i < getAllQuestion?.sections?.length; i++) {
      const sectionQuestions = getAllQuestion.sections[i].questions.length;
      if (currentQuestionIndex < questionCount + sectionQuestions) {
        return i;
      }
      questionCount += sectionQuestions;
    }
    return 0;
  };

  // call api for get question from context
  useEffect(() => {
    setIds({ test: testId, section: id, level });
  }, [testId, id, level, setIds]);

  useEffect(() => {
    setExpandedSection(getCurrentSectionIndex()); // Set initial expanded section
    // eslint-disable-next-line
  }, [currentQuestionIndex]);

  // set the time limit and time interval for that
  useEffect(() => {
    if (!getAllQuestion?.timeLimit) return;
    timerRef.current = setTimeout(
      () => handleSubmit(false),
      getAllQuestion.timeLimit * 60 * 1000
    );
    setTimeLeft(getAllQuestion?.timeLimit * 60 || 0);
    setLoader(false);

    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line
  }, [getAllQuestion, loader, isSubmit]);

  // set timer when component load
  useEffect(() => {
    const timer = setInterval(
      () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, []);

  // when exam start open the screen in full screen
  const enterFullScreen = () => {
    if (!document.fullscreenElement)
      document.documentElement
        .requestFullscreen()
        .catch((err) => console.error(err));
  };

  // not able to back reload and close while exam open
  useEffect(() => {
    if (!isSubmit) {
      enterFullScreen(); // Enter fullscreen on mount
    }

    const handleVisibilityChange = () => {
      if (document.hidden && !isSubmit) {
        enterFullScreen();
        handleSubmit(true);
      }
    };

    const handleKeyDown = () => {
      if (!isSubmit) {
        enterFullScreen();
      }
    };

    const handleBeforeUnload = (e) => {
      if (!isSubmit) {
        handleSubmit(true);
        e.preventDefault();
      }
    };

    const handleBackButton = () => {
      if (!isSubmit) {
        handleSubmit(true);
        window.history.pushState(null, "", window.location.href);
      }
    };

    // Add event listener to the document
    // document.addEventListener("contextmenu", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleBackButton);

    // Push initial state to prevent back navigation
    window.history.pushState(null, "", window.location.href);

    return () => {
      // document.addEventListener("contextmenu", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleBackButton);
    };
    // eslint-disable-next-line
  }, [isSubmit]); // Depend on isSubmit

  // format time for show in hh:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // when select answer store it in variable
  const handleSelectAnswer = (option) => {
    const question = getAllQuestion?.sections?.flatMap((s) => s.questions)[
      currentQuestionIndex
    ];
    setSelectedAnswers((prev) => {
      const currentAnswer = prev[currentQuestionIndex]?.selectedAnswers || [];
      let newAnswer =
        question.questionType === "MULTIPLE_ANSWER"
          ? currentAnswer.includes(option)
            ? currentAnswer.filter((item) => item !== option)
            : [...currentAnswer, option]
          : [option];
      return {
        ...prev,
        [currentQuestionIndex]: {
          questionId: question.id,
          selectedAnswers: newAnswer,
        },
      };
    });
  };

  // submit exam and call api
  const handleSubmit = async (disqualified) => {
    let ans = Object.values(selectedAnswersRef.current);
    console.log(ans);
    getAllQuestion?.sections
      ?.flatMap((s) => s.questions)
      .forEach((q) => {
        if (!ans.some((a) => a.questionId === q.id))
          ans.push({ questionId: q.id, selectedAnswers: [] });
      });

    const payload = {
      testId: getAllQuestion?.testId,
      answers: ans,
      userId: userData?.id,
      status: disqualified ? "D" : "COMPLETED",
      level: level.toUpperCase(),
    };

    setIsApiCall(true);
    setLoaderSubmit(true);
    setIsSubmit(true);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const apiCall = axios.post(`${api}/newskill/submit-test`, payload);

    Promise.allSettled([apiCall, delay(2500)])
      .then(([response]) => {
        setExamResultResponse(response.value.data);
        setExamResult(response.value.data.status);
        setIsApiCall(false);

        if (timerRef.current) {
          clearTimeout(timerRef.current); // Clear the timer before submission
        }

        // Exit full-screen mode on submission
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      })
      .catch((error) => {
        setIsSubmit(false);

        Swal.fire({
          title: "Error",
          text: "Failed to submit test.",
          icon: "error",
          confirmButtonText: "OK",
        });
        setIsApiCall(false);
      })
      .finally(() => {
        setLoaderSubmit(false); // Hide loader after API call and 5 sec delay
      });
  };

  // chnage accordian as per question open and also chnage accordian according it
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedSection(isExpanded ? panel : false);
  };

  // set the current question variable
  const allQuestions =
    getAllQuestion?.sections?.flatMap((s) => s.questions) || [];
  const currentQuestion = allQuestions?.[currentQuestionIndex];
  const { backgroundColor, emoji, title, message } =
    resultStyles[examResult.toLowerCase()];

  return (
    <>
      <Navbar />
      {loader ? (
        <div className="loader"></div>
      ) : (
        <Grid container justifyContent="center" p={!isSubmit ? 1.5 : 0}>
          {isSubmit ? (
            <>
              {loaderSubmit ? (
                <>
                  {/* Loader Backdrop */}
                  <Backdrop
                    sx={{
                      color: "#fff",
                      zIndex: (theme) => theme.zIndex.drawer + 1,
                      backdropFilter: "blur(6px)",
                      backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent background
                    }}
                    open={loaderSubmit}
                  >
                    <Box
                      sx={{
                        textAlign: "center",
                        background: "white",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: 3,
                        width: "300px",
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ color: "#333" }}
                      >
                        Submitting Your Exam...
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1, mb: 2 }}
                      >
                        Please wait while we process your answers. Do not go
                        back or close the window.
                      </Typography>
                      <CircularProgress />
                    </Box>
                  </Backdrop>
                </>
              ) : (
                // Result UI (unchanged)
                // Show Result UI After Submission
                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  height="80vh"
                  className="js-container container"
                  sx={{ position: "absolute !important", left: 0 }}
                >
                  {/* Confetti Animation if PASSED*/}
                  {examResult === "PASSED" && <Confettiful />}
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    sx={{ position: "absolute !important" }}
                  >
                    {/* card for show exam output */}
                    <Paper
                      elevation={10}
                      sx={{
                        p: { lg: 6, xs: 3 },
                        borderRadius: 4,
                        background: "#fff",
                        maxWidth: 500,
                        minWidth: 300,
                        textAlign: "center",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      <Box
                        sx={{
                          width: "105px",
                          height: examResult === "PASSED" ? "105px" : "80px",
                          borderRadius: "50%",
                          background:
                            examResult === "PASSED" && backgroundColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                          position: "relative",
                          boxShadow:
                            examResult === "PASSED" &&
                            "0px 6px 12px rgba(0,0,0,0.2)",
                          fontSize: examResult === "PASSED" ? "60px" : "80px",
                          mb: 4,
                        }}
                      >
                        <motion.div
                          initial={{
                            opacity: 0,
                            y: examResult === "PASSED" ? 15 : -15,
                          }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          {emoji}
                        </motion.div>
                      </Box>

                      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {message}{" "}
                        {examResult === "DISQUALIFIED" && (
                          <span>
                            Please review the{" "}
                            <Link
                              style={{ textDecoration: "none" }}
                              to={`/instruction/${getAllQuestion?.testName}/${testId}/${level}`}
                            >
                              exam guidelines for more details.
                            </Link>
                          </span>
                        )}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {getAllQuestion?.sections?.[0]?.sectionName}{" "}
                        {examResult !== "DISQUALIFIED" && (
                          <>
                            : {examResultResponse?.totalScore || 0} /{" "}
                            {getAllQuestion?.noOfQuestion *
                              getAllQuestion?.marksPerQuestion}
                          </>
                        )}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: examResult === "PASSED" ? "green" : "red",
                        }}
                      >
                        Correct Answer:{" "}
                        {examResultResponse?.correctAnswers || 0} /{" "}
                        {getAllQuestion?.noOfQuestion}
                      </Typography>
                      {examResult !== "DISQUALIFIED" && (
                        <Typography variant="body2">
                          {examResult === "PASSED"
                            ? "Well done! Your score is"
                            : "You scored"}{" "}
                          {isNaN(
                            Number(
                              (examResultResponse?.totalScore /
                                (getAllQuestion?.noOfQuestion *
                                  getAllQuestion?.marksPerQuestion)) *
                                100
                            ).toFixed(2)
                          )
                            ? 0
                            : Number(
                                (examResultResponse?.totalScore /
                                  (getAllQuestion?.noOfQuestion *
                                    getAllQuestion?.marksPerQuestion)) *
                                  100
                              ).toFixed(2)}
                          %. {examResult === "FAILED" && "Keep trying!"}
                        </Typography>
                      )}

                      {/* show buttons */}
                      <Box
                        display="flex"
                        justifyContent="center"
                        gap={2}
                        mt={4}
                      >
                        {examResult !== "PASSED" && (
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              setIsSubmit(false);
                              setIsApiCall(false);
                              setCurrentQuestionIndex(0);
                              setSelectedAnswers({});
                            }}
                            sx={{
                              px: 4,
                              py: 1,
                              borderRadius: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                background:
                                  "linear-gradient(to right,rgb(209, 228, 247),rgb(255, 255, 255))",
                                color: "#1976d2",
                              },
                            }}
                          >
                            Retake Exam
                          </Button>
                        )}

                        {examResult === "PASSED" &&
                          examResultResponse?.certificate === true && (
                            <Button
                              variant="outlined"
                              color="primary"
                              onClick={() => {
                                navigate(`/certificate/${examResultResponse?.certificateId}`);
                              }}
                              sx={{
                                px: 4,
                                py: 1,
                                borderRadius: 2,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  background:
                                    "linear-gradient(to right,rgb(209, 228, 247),rgb(255, 255, 255))",
                                  color: "#1976d2",
                                },
                              }}
                            >
                              Certificate
                            </Button>
                          )}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => navigate("/")}
                          sx={{
                            px: 4,
                            py: 1,
                            borderRadius: 2,
                            background:
                              "linear-gradient(to right, #1976d2, #42a5f5)",
                            "&:hover": { background: "#1565c0" },
                          }}
                        >
                          Back to Dashboard
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              )}
            </>
          ) : (
            <Grid container spacing={2}>
              {/* left Side: Section-wise Question List */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: { sm: 0, xs: 0, md: 2 },
                    maxHeight: "80vh",
                    overflowY: "auto",
                    boxShadow: "none",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="#09017e"
                    mb={1}
                  >
                    {getAllQuestion?.testName}
                  </Typography>
                  {/* show section and their question numbers */}
                  {getAllQuestion?.sections?.map((section, sectionIndex) => (
                    <Accordion
                      key={sectionIndex}
                      expanded={expandedSection === sectionIndex}
                      onChange={handleAccordionChange(sectionIndex)}
                      sx={{
                        borderRadius: "8px",
                        mb: 1,
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        "&:before": { display: "none" },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color: "#0d47a1" }} />}
                        sx={{
                          backgroundColor:
                            expandedSection === sectionIndex
                              ? "#e3f2fd" // Light blue for active/expanded
                              : "#f5f6f8", // Neutral grayish-white for inactive
                          "&:hover": {
                            backgroundColor:
                              expandedSection === sectionIndex
                                ? "#bbdefb" // Slightly darker blue on hover when active
                                : "#e8ecef", // Gray-blue on hover when inactive
                          },
                          borderRadius: "8px",
                          transition: "background-color 0.2s ease",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          color="#0d47a1" // Softer deep blue for professionalism
                          sx={{ letterSpacing: "0.5px" }}
                        >
                          {section.sectionName}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          backgroundColor: "#fafafa",
                          borderRadius: "0 0 8px 8px",
                          padding: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          {section.questions.map((question, qIndex) => {
                            const globalIndex =
                              getAllQuestion.sections
                                .slice(0, sectionIndex)
                                .reduce(
                                  (acc, s) => acc + s.questions.length,
                                  0
                                ) + qIndex;

                            const isSelected =
                              selectedAnswers[globalIndex]?.selectedAnswers
                                ?.length > 0;
                            const isActive =
                              globalIndex === currentQuestionIndex;

                            return (
                              <Box
                                key={globalIndex}
                                onClick={() => {
                                  window.scrollTo({
                                    top: document.body.scrollHeight,
                                    behavior: "smooth",
                                  });
                                  setCurrentQuestionIndex(globalIndex);
                                }}
                                sx={{
                                  borderRadius: "50%",
                                  backgroundColor:
                                    isSelected && isActive
                                      ? "rgb(233 255 233)"
                                      : isSelected
                                      ? "#c8e6c9" // Green for selected
                                      : isActive
                                      ? "#e0f7fa" // Light cyan for active
                                      : "#ffffff",
                                  border:
                                    isSelected && isActive
                                      ? "2px solid rgb(38, 166, 42)"
                                      : isSelected
                                      ? "2px solid #4caf50"
                                      : isActive
                                      ? "2px solid #0288d1"
                                      : "2px solid #e0e0e0",
                                  cursor: "pointer",
                                  width: "36px",
                                  height: "36px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition: "all 0.2s ease",
                                  "&:hover": {
                                    transform: "scale(1.1)",
                                    backgroundColor:
                                      isSelected && isActive
                                        ? "rgb(233 255 233)"
                                        : isSelected
                                        ? "#a5d6a7"
                                        : "#f0f0f0",
                                  },
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: isSelected ? "bold" : "normal",
                                    color: isSelected ? "#2e7d32" : "#424242",
                                  }}
                                >
                                  {globalIndex + 1}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Paper>
              </Grid>

              {/* Right Side: Current Question */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper sx={{ p: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Typography>
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                      sx={{ width: isSmall ? "250px" : "120px" }}
                    >
                      {/* show timer and total marks */}
                      <Box display="flex" alignItems="center" gap={1}>
                        <AccessTime
                          sx={{
                            fontSize: isSmall ? "16px" : "20px",
                            color: "#d32f2f",
                            marginTop: isSmall && "2px",
                          }}
                        />
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="#d32f2f"
                        >
                          {formatTime(timeLeft)}
                        </Typography>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Total Marks:{" "}
                        {getAllQuestion?.marksPerQuestion *
                          getAllQuestion.noOfQuestion}
                      </Typography>
                    </Box>
                  </Box>
                  {/* warning show */}
                  <Typography
                    variant="body2"
                    color="#d32f2f"
                    sx={{
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <WarningAmber sx={{ fontSize: "14px" }} /> Do not go back,
                    refresh, or close the page will result in disqualification.
                  </Typography>

                  {/* linear question progress */}
                  <LinearProgress
                    variant="determinate"
                    value={(currentQuestionIndex / allQuestions.length) * 100}
                    sx={{ mb: 2, height: 10, borderRadius: 5 }}
                  />

                  {/* question number */}
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {currentQuestionIndex + 1}. {currentQuestion?.questionText}
                  </Typography>

                  {/* marks */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="right"
                  >
                    Mark: {currentQuestion?.marks}
                  </Typography>

                  {/* question and options */}
                  {currentQuestion?.questionType === "MULTIPLE_ANSWER" ? (
                    ["optionA", "optionB", "optionC", "optionD"].map(
                      (key) =>
                        currentQuestion[key] && (
                          <FormControlLabel
                            key={key}
                            control={
                              <Checkbox
                                size="small"
                                checked={
                                  selectedAnswers[
                                    currentQuestionIndex
                                  ]?.selectedAnswers?.includes(
                                    key.replace("option", "")
                                  ) || false
                                }
                                onChange={() =>
                                  handleSelectAnswer(key.replace("option", ""))
                                }
                                sx={{
                                  p: 0.2,
                                  m: 1,
                                  color: selectedAnswers[
                                    currentQuestionIndex
                                  ]?.selectedAnswers?.includes(
                                    key.replace("option", "")
                                  )
                                    ? "#4caf50" // Green when selected
                                    : "default",
                                  "&.Mui-checked": {
                                    color: "#09017e", // Green when checked
                                  },
                                }}
                              />
                            }
                            label={currentQuestion[key]}
                            sx={{
                              m: 1,
                              display: "block",
                              background: selectedAnswers[
                                currentQuestionIndex
                              ]?.selectedAnswers?.includes(key)
                                ? "#eff7ff" // Light green background
                                : "transparent",
                              "& .MuiFormControlLabel-label": {
                                mt: 1,
                                fontSize: "14px", // Change font size
                              },
                            }}
                          />
                        )
                    )
                  ) : (
                    <RadioGroup
                      value={
                        selectedAnswers[currentQuestionIndex]
                          ?.selectedAnswers?.[0] || ""
                      }
                      onChange={(e) =>
                        handleSelectAnswer(e.target.value.replace("option", ""))
                      }
                    >
                      {(currentQuestion.questionType === "TRUE_FALSE"
                        ? ["optionA", "optionB"] // Only show True/False for true/false questions
                        : ["optionA", "optionB", "optionC", "optionD"]
                      ) // Default multiple-choice options
                        .map(
                          (key) =>
                            currentQuestion[key] && (
                              <FormControlLabel
                                key={key}
                                value={key.replace("option", "")}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      p: 0.2,
                                      m: 1,
                                      mb: 0,
                                      color:
                                        selectedAnswers[currentQuestionIndex]
                                          ?.selectedAnswers?.[0] ===
                                        key.replace("option", "")
                                          ? "#4caf50" // Green when selected
                                          : "default",
                                      "&.Mui-checked": {
                                        color: "#09017e", // Green when checked
                                      },
                                    }}
                                  />
                                }
                                label={currentQuestion[key]}
                                sx={{
                                  m: 1,
                                  mb: 0,
                                  pb: 1,
                                  background:
                                    selectedAnswers[currentQuestionIndex]
                                      ?.selectedAnswers?.[0] ===
                                    key.replace("option", "")
                                      ? "#eff7ff" // Light green background
                                      : "transparent",
                                  "& .MuiFormControlLabel-label": {
                                    mt: 1,
                                    fontSize: "14px", // Change font size
                                  },
                                }}
                              />
                            )
                        )}
                    </RadioGroup>
                  )}

                  {/* btns for prev next and submit */}
                  <Box display="flex" justifyContent="flex-start" mt={4}>
                    <Button
                      style={{ marginRight: "10px " }}
                      variant="outlined"
                      disabled={currentQuestionIndex === 0}
                      onClick={() =>
                        setCurrentQuestionIndex((prev) => prev - 1)
                      }
                    >
                      Previous
                    </Button>
                    {currentQuestionIndex < allQuestions.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={() =>
                          setCurrentQuestionIndex((prev) => prev + 1)
                        }
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleSubmit(false)}
                        disabled={isApiCall}
                      >
                        {isApiCall ? "Submitting..." : "Submit"}
                      </Button>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
