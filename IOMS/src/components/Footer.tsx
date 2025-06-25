import { Box, Typography } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ mt: 4, p: 2, textAlign: "center" }}>
      <Typography variant="body2" color="textSecondary">
        Inventory Management System
      </Typography>
    </Box>
  );
};

export default Footer;
