import React from 'react';
import PacmanLoader from 'react-spinners/PacmanLoader';

function Loading() {
  return (
    <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
      <PacmanLoader size={70} color="#36d7b7" />
    </div>
  );
}

export default Loading;
