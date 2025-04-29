// import React from 'react';
// import './App.css';
// import Header from './components/UI/Header';
// import Footer from './components/UI/Footer';
// import Dashboard from './components/Dashboard';

// function App() {
//   return (
//     <div className="app">
//       <Header />
//       <main className="main-content">
//         <Dashboard />
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from './components/UI/Header';
import Footer from './components/UI/Footer';
import Dashboard from './components/Dashboard';
import SentimentAnalysis from './components/SentimentAnalysis';
import PredictionMetrics from './components/PredictionMetrics';
import NewsSection from './components/NewsSection';

function App() {
  return (
    <Router>
      <div className="app">
        {/* <Header /> */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
           
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
