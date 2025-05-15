// start on 12 March 2025 by medha

import React from "react";
import {
  Typography,
  Paper,
  Box,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const TestTimeline = ({ codingLanguages, bestLanguage }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const mergedAttempts = codingLanguages?.flatMap((test) =>
    test?.attempts?.map((attempt) => ({
      testName: test.name,
      level: attempt.level,
      obtained: attempt.obtainedMarks,
      total: attempt.totalMarks,
      date: attempt.date,
      status: attempt.status,
      certificateGenerated: attempt.certificateGenerated,
      certificateId: attempt.certificateId,
    }))
  );

  mergedAttempts?.sort((a, b) => new Date(b.date) - new Date(a.date));

  const highestScoreAttempt = mergedAttempts?.reduce((max, attempt) => {
    const currentScore = attempt?.obtained / attempt?.total;
    const maxScore = max?.obtained / max?.total || 0;
    return currentScore > maxScore ? attempt : max;
  }, null);

  const downloadPDF = () => {
    if (!mergedAttempts || mergedAttempts.length === 0) {
      alert("No data available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.text("Test Attempts Report", 14, 10);

    // Find the row with the highest obtained marks
    const highestMarks = Math.max(
      ...mergedAttempts.map((attempt) => attempt.obtained)
    );

    // Convert data to table format
    const tableData = mergedAttempts.map((attempt) => [
      attempt.testName,
      attempt.level,
      attempt.obtained,
      attempt.total,
      attempt.date,

      attempt.status === "D" ? "DISQUALIFIED" : attempt.status, // Replace "D" with "DISQUALIFIED"
    ]);

    // Table headers
    const headers = [
      ["Test Name", "Level", "Obtained", "Total", "Date", "Status"],
    ];

    // Generate table
    autoTable(doc, {
      head: headers,
      body: tableData,
      startY: 20,
      styles: { fontSize: 10 },
      didParseCell: function (data) {
        if (data.section === "body" && data.row.raw[2] === highestMarks) {
          data.cell.styles.fillColor = [106, 222, 98]; // Green background for highest marks row
        }
      },
    });

    // Add Best Attempt Recommendation Below Table
    let finalY = doc.lastAutoTable.finalY + 10; // Position after table
    doc.setFontSize(12);
    doc.text(`Recommendation:`, 14, finalY);
    doc.setFontSize(10);
    doc.text(
      `You should continue learning "${bestLanguage.test}" as you have the highest marks in it!`,
      14,
      finalY + 7
    );

    // Save the PDF
    doc.save("Test_Attempts_Report.pdf");
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          px: { lg: 10, md: 5, sm: 1, xs: 1 },
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          flexFlow: "wrap",
          mb: 3,
        }}
      >
        <Typography
          variant={isSmall ? "h6" : "h5"}
          fontWeight="bold"
          sx={{ textAlign: "center", pr: 2, mt: 1 }}
        >
          Test Attempts Timeline
        </Typography>
        <Button
          onClick={downloadPDF}
          variant="contained"
          size="small"
          sx={{ mt: 1 }}
        >
          Download Report
        </Button>
      </Box>
      <Box
        sx={{
          maxHeight: 380,
          overflow: "auto",
          px: { lg: 10, md: 5, sm: 1, xs: 1 },
        }}
      >
        <Timeline>
          {mergedAttempts?.map((attempt, index) => (
            <TimelineItem key={index}>
              <TimelineSeparator>
                <TimelineDot color={index === 0 ? "primary" : "grey"} />
                {index !== mergedAttempts.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  sx={{
                    p: 1,
                    background: highestScoreAttempt === attempt && "#4caf50",
                    color: highestScoreAttempt === attempt && "white",
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    variant="body2"
                    sx={{ color: highestScoreAttempt !== attempt && "#09017e" }}
                  >
                    {attempt?.testName} ({attempt?.level})
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle2">
                      Score: {attempt?.obtained} / {attempt?.total}{" "}
                      <b>
                        (
                        {(attempt?.total === 0
                          ? 0
                          : Number(attempt?.obtained / attempt?.total) * 100
                        ).toFixed(2)}
                        %){" "}
                      </b>
                    </Typography>{" "}
                    <Typography
                      fontWeight="bold"
                      variant="body2"
                      sx={{
                        background:
                          attempt?.status === "PASSED"
                            ? "green"
                            : attempt?.status === "FAILED"
                            ? "#ff690d"
                            : attempt?.status && "red",
                        color: "white",
                        ml: 1,
                        borderRadius: 1,
                        p: 0.5,
                        fontSize: 12,
                      }}
                    >
                      {attempt?.status === "D"
                        ? "DISQUALIFIED"
                        : attempt?.status}
                    </Typography>
                  </Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: "12px" }}
                    color={highestScoreAttempt !== attempt && "textSecondary"}
                  >
                    Date: {attempt?.date}
                  </Typography>
                  {attempt?.certificateGenerated === true && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{ my: 1 }}
                      onClick={() => {
                        navigate(`/certificate/${attempt?.certificateId}`);
                      }}
                    >
                      View Certificate
                    </Button>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            mb: 1,
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default TestTimeline;
