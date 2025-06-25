import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login"; 
import Dashboard from "./components/Dashboard/Dashboard";
import Products from "./components/Products/Products";
import Customers from "./components/Customers/Customers";
import Orders from "./components/Orders/Orders";
import Layout from "./components/Layout";
const App: React.FC = () => {
  const isLoggedIn = true;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isLoggedIn ? (
          <>
            <Route
              path="/dashboard"
              element={<Layout><Dashboard /></Layout>}
            />
            <Route
              path="/products"
              element={<Layout><Products /></Layout>}
            />
            <Route
              path="/customers"
              element={<Layout><Customers /></Layout>}
            />
            <Route
              path="/orders"
              element={<Layout><Orders /></Layout>}
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
   
    


  );
};



export default App;
