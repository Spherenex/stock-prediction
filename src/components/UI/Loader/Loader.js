import React from 'react';

function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader">
      <div className="loader-spinner"></div>
      {message && <div className="loader-message">{message}</div>}
    </div>
  );
}

export default Loader;