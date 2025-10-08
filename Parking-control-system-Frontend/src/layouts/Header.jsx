import { Link } from "react-router-dom";
import { Button, Box } from "@mui/material";

export default function Header({ navUrl, val }) {
  return (
    <Box sx={{ p: 2 }}>
      <Button
        component={Link}
        to={navUrl}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: "9999px",
          px: 5,
          py: 2,
          fontWeight: 600,
          fontSize: "30px",
          textTransform: "none",
        }}
      >
        {val}
      </Button>
    </Box>
  );
}
