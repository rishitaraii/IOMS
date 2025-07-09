import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link , useNavigate} from "react-router-dom";
import ThemeToggleButton from "./ThemeToggleButton";
const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("access");

  

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/login");
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }} >
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/customers">Customers</Button>
          <Button color="inherit" component={Link} to="/orders">Orders</Button>
        </Box>
        <ThemeToggleButton/>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
