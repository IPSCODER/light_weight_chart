import { ColorType, createChart, LineStyle } from 'lightweight-charts';
import React, { useContext, useEffect, useRef, useState } from 'react';
import "./chart.css";
import { ContextProvider } from '../../App';
import logo from "../../logo_matigos.png"
import Tooltip from '../tooltip/Tooltip';
import { ddperiod as drawdownData } from '../../data/ddperiod';

const Chart = (props) => {
  const chartContainerRef = useRef();
  const { color, setColor } = useContext(ContextProvider);
  const [selectedOption, setSelectedOption] = useState(0);
  const [data, setData] = useState([]);
  const [tooltipInfo, setTooltipInfo] = useState({ visible: false, x: 0, y: 0, content: '' });

  const {
    colors: {
      backgroundColor = 'white',
      lineColor = color,
      textColor = 'black',
      areaTopColor = color,
      areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = {},
    backgroundImage // URL for the background image
  } = props;

  const aspectRatio = 0.6;

  useEffect(() => {
    setData(props.arrayOfObjects[selectedOption][Object.keys(props.arrayOfObjects[selectedOption])]);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientWidth * aspectRatio });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientWidth * aspectRatio,
    });

    chart.timeScale().fitContent();
    
    // Add event listener to show/hide tooltip
    chart.subscribeCrosshairMove((param) => {
      if (param.time && param.point) {
        setTooltipInfo({ visible: true, x: param.point.x, y: param.point.y, content: { value: param.point.y , Time: param.time} });
      } else {
        setTooltipInfo({ ...tooltipInfo, visible: false });
      }
    });

    const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
    newSeries.setData(data.map((a, b, c) => {
      return { value: a.cumsum, time: a.date };
    }));

    // Highlight drawdown periods
    // drawdownData.data.forEach(drawdown => {
    //   const start = new Date(drawdown.Start_Date).getTime(); // Convert start date to timestamp
    //   const end = new Date(drawdown.End_Date).getTime(); // Convert end date to timestamp
      
    //   // Add a check for data presence and structure
    //   if (data.length > 0 && data[0].hasOwnProperty('cumsum')) {
    //     const lineSeries = chart.addLineSeries({ color: 'red', lineWidth: 2, lineStyle: LineStyle.Solid }); // Adjust line style for drawdown periods
    //     lineSeries.setData([{ time: start, value: data[0].cumsum }, { time: end, value: data[data.length - 1].cumsum }]);
    //   } else {
    //     console.warn('Data is empty or does not have the expected structure.');
    //   }
    // });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, selectedOption]);

  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`, // Set background image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  return (
    <div className='chart' style={backgroundStyle}>
      <div className='canvas' style={{ position: 'relative', zIndex: 1 }}>
        <select value={selectedOption} style={{ textTransform: "uppercase" }} onChange={(e) => { setSelectedOption(e.target.value) }}>
          {props.arrayOfObjects.map((i, index) => (
            <option key={index} value={index} style={{ textTransform: "uppercase" }}>{Object.keys(i)}</option>
          ))}
        </select>
        <div ref={chartContainerRef}>
          <Tooltip {...tooltipInfo} />
          {<img src={logo} className='png_logo' alt='logo' /> }
        </div>
      </div>
    </div>
  );
}

export default Chart;
