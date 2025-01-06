import React from 'react';

const Top = ({ image }) => {
  return (
    <div
      className="top"
      style={{
        backgroundImage: `url('${image.src}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );
};

export default Top;