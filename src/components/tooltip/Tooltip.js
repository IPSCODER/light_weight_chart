import React, { useContext, useState } from 'react';
import "./tooltip.css"
import { ContextProvider } from '../../App';
const Tooltip = ({ x, y, visible, content }) => {
    const { color, setColor } = useContext(ContextProvider);
  const tooltipStyle = {
    display: visible ? 'block' : 'none',
    position: 'absolute',
    left: x + 30,
    top: y + 10,
    zIndex:111,
    border:"3px solid "+ color
  };

  return (
    <div className='tooltip' style={tooltipStyle}  >
    <h2>Matic</h2>
      <h3>{content.value}</h3>
      <h4>{content.Time}</h4>
    </div>
  );
};

export default Tooltip;
