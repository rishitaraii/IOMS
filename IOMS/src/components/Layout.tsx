import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "@mui/material";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
