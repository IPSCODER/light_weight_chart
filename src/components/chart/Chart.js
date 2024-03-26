import { ColorType, createChart, LineStyle } from 'lightweight-charts';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const [startDate,setStartDate]= useState([])
  const [endDate,setEndDate]= useState([])

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

    for (let i = 0; i < drawdownData.data.length; i++) {
      if (data.length > 0 ) {        
        const fillAreaSeries = chart.addAreaSeries({ topColor: 'red', bottomColor: 'transparent', lineColor: 'transparent', lineWidth: 0 });
        fillAreaSeries.setData([{ time: startDate[i]?.date, value: startDate[i]?.value }, { time: endDate[i]?.date, value: endDate[i]?.value }]);
      } else {
        console.warn('Data is empty or does not have the expected structure.'); 
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, selectedOption]);


    if (startDate.length == 0 && endDate.length == 0 ) {
      for (let i = 0; i < data?.length; i++) {
        for (let j = 0; j < drawdownData.data?.length; j++) {
          if (data[i]?.date === drawdownData.data[j].Start_Date) {
            setStartDate(prevStartDate => [...prevStartDate, { date: data[i]?.date ,value: data[i]?.cumsum }]);
          }
        }
      }

      for (let i = 0; i < data?.length; i++) {
        for (let j = 0; j < drawdownData.data?.length; j++) {
          if (data[i]?.date === drawdownData.data[j].End_Date) {
            setEndDate(prevEndDate => [...prevEndDate, { date: data[i]?.date ,value:data[i]?.cumsum }]);
          }
        }
      }
    }

    useLayoutEffect(()=>{
      setStartDate([])
      setEndDate([])
    },[])
    

  
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`, // Set background image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
  };

  return (
    <div className='chart' style={backgroundStyle}>
      <div className='canvas' style={{ position: 'relative', zIndex: 1 }}>
        <select value={selectedOption} style={{ textTransform: "uppercase" }} onChange={(e) => { setSelectedOption(e.target.value);}}>
          {props.arrayOfObjects.map((i, index) => (
            <option key={index} value={index} style={{ textTransform: "uppercase" }}>{Object.keys(i)}</option>
          ))}
        </select>
        <div ref={chartContainerRef}>
          <Tooltip {...tooltipInfo} />
          <img src={logo} className='png_logo' alt='logo' /> 
        </div>
      </div>
    </div>
  );
}

export default Chart;
