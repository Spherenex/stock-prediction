// import React from 'react';

// function Header() {
//   return (
//     <header className="header">
//       <div className="container">
//         <div className="header-content">
//           <div className="logo">
//             <svg className="logo-icon" viewBox="0 0 24 24" width="24" height="24">
//               <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
//             </svg>
//             <span className="logo-text">StockPredict</span>
//           </div>
          
//           <nav className="nav">
//             <ul className="nav-list">
//               <li className="nav-item">
//                 <a href="#" className="nav-link nav-link--active">Dashboard</a>
//               </li>
//               <li className="nav-item">
//                 <a href="#" className="nav-link">Analysis</a>
//               </li>
//               <li className="nav-item">
//                 <a href="#" className="nav-link">Portfolio</a>
//               </li>
//               <li className="nav-item">
//                 <a href="#" className="nav-link">News</a>
//               </li>
//             </ul>
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Header;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  
  // Determine which nav link is active based on current path
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link nav-link--active' : 'nav-link';
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
            </svg>
            <span className="logo-text">StockPredict</span>
          </div>
          
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className={isActive('/')}>Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link to="/analysis" className={isActive('/analysis')}>Analysis</Link>
              </li>
              <li className="nav-item">
                <Link to="/portfolio" className={isActive('/portfolio')}>Portfolio</Link>
              </li>
              <li className="nav-item">
                <Link to="/news" className={isActive('/news')}>News</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;