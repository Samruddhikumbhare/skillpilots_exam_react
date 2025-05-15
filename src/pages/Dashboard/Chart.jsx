import React from "react";
import { Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Chart = ({ testWiseScore }) => {
  const isSmallScreen = useMediaQuery("(max-width: 400px)");
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  // Convert testWiseScore to Recharts-compatible data
  const formattedData = testWiseScore.map(({ test, percentage }) => ({
    test, // X-axis: Test Name
    percentage: parseFloat(percentage) || 0, // Y-axis: Percentage as a number
  }));

  return (
    <Box sx={{ mt: 4 }}>
      <Typography
        variant={isSmall ? "h6" : "h5"}
        fontWeight="bold"
        sx={{ textAlign: "center", mb: 3 }}
      >
        Test Scores
      </Typography>
      <Box
        sx={{
          height: isSmallScreen ? 250 : 360,
          background: "#fff",
          p: 2,
          borderRadius: 3,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="test"
              angle={-15}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12, fill: "#333" }}
              label={{
                value: "Tests",
                position: "insideBottom",
                offset: -10,
                style: { fontSize: 14, fill: "#555" },
              }}
            />

            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12, fill: "#333" }}
              label={{
                value: "Percentage (%)",
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 14, fill: "#555" },
              }}
            />

            <Tooltip
              cursor={{ fill: "rgba(0, 123, 255, 0.1)" }}
              content={({ payload, label }) => {
                if (!payload || payload.length === 0) return null;
                return (
                  <Box
                    sx={{
                      background: "#fff",
                      p: 1.5,
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: "bold" }}>
                      {label}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "#007bff" }}>
                      Percentage: {payload[0].value}%
                    </Typography>
                  </Box>
                );
              }}
            />

            <Legend wrapperStyle={{ fontSize: "14px", visibility: "hidden" }} />

            <Bar
              dataKey="percentage"
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
            />

            {/* Gradient for the bar color */}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#007bff" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#007bff" stopOpacity={0.4} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Chart;
