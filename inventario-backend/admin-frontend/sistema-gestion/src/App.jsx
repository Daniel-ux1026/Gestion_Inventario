import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes.jsx';
import Footer from './components/Common/Footer/Footer';

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <div className="flex-grow-1">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
