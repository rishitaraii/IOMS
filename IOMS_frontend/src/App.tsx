import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login"; 
import Dashboard from "./components/Dashboard/Dashboard";
import Products from "./components/Products/Products";
import Customers from "./components/Customers/Customers";
import Orders from "./components/Orders/Orders";
import OrderDetails from "./components/Orders/OrderDetails";
import OrderForm from "./components/Orders/OrderForm";
import ProductForm from "./components/Products/ProductForm";
import CustomerForm from "./components/Customers/CustomerForm";
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
            <Route path="/products/create" element={<ProductForm />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />

            <Route
              path="/customers"
              element={<Layout><Customers /></Layout>}
            />
            <Route path="/customers/create" element={<CustomerForm />} />
            <Route path="/customers/:id/edit" element={<CustomerForm />} />
            <Route
              path="/orders"
              element={<Layout><Orders /></Layout>}
            />
            <Route
              path="/orders/:id"
              element={<Layout><OrderDetails /></Layout>}
            />
            <Route path="/orders/create" element={<OrderForm />} />
            <Route path="/orders/:id/edit" element={<OrderForm />} />

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
