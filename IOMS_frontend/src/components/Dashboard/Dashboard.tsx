import { Box, Paper, Typography } from "@mui/material";

const dashboard: React.FC = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
      >
        <Box flex="1 1 100%" maxWidth={{ md: "48%" }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Total Orders</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Box>
        <Box flex="1 1 100%" maxWidth={{ md: "48%" }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6">Revenue</Typography>
            <Typography variant="h4">0</Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};
export default dashboard;