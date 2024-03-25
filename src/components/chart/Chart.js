import { ColorType, createChart } from 'lightweight-charts'
import React ,{useContext, useEffect,useRef, useState} from 'react'
import "./chart.css"
import { ContextProvider } from '../../App'

const Chart = (props) => {
  const {color,setColor} = useContext(ContextProvider)
  const [selectedOption, setSelectedOption] = useState(0);
  const [data, setData] = useState([]);



  const {
    colors: {
        backgroundColor = 'white',
        lineColor = color,
        textColor = 'black',
        areaTopColor = color,
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',} = {},} = props;

const chartContainerRef = useRef();

const aspectRatio = 0.6; 

useEffect(() => {
  setData(props.arrayOfObjects[selectedOption][Object.keys(props.arrayOfObjects[selectedOption])])
        const handleResize = () => {
            chart.applyOptions({ width: chartContainerRef.current.clientWidth ,height: chartContainerRef.current.clientWidth * aspectRatio });
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

        const newSeries = chart.addAreaSeries({ lineColor, topColor: areaTopColor, bottomColor: areaBottomColor });
        newSeries.setData(data.map((a,b,c) => {
          return {value:a.cumsum,time:a.date}
        }));

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    },
    [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor,selectedOption]
);
  return (
    <div className='chart' >
      <div className='canvas'  >
        <select value={selectedOption} style={{textTransform:"uppercase"}} onChange={(e) => {setSelectedOption(e.target.value)}} >
          {props.arrayOfObjects.map((i,index)=>(
            <option key={index} value={index} style={{textTransform:"uppercase"}} >{Object.keys(i)}</option>
          ))}
        </select>
      <div ref={chartContainerRef} >
      </div>
      </div>
    </div>
  )
}

export default Chart