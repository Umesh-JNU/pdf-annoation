import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PdfPage from "./components/PdfPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/pdf-page/:pdf" element={<PdfPage />} />
      </Routes>
    </Router>
  );
};

export default App;
