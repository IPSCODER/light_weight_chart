import React, { useContext, useEffect, useRef, useState } from 'react'
import "./chart-page.css"
import Chart from '../components/chart/Chart'
import Table from '../components/tabel/Table'
import {ddperiod} from "../data/ddperiod"
import {retun} from "../data/return"
import { ChromePicker } from 'react-color';
import { ContextProvider } from '../App'

const ChartPage = (props) => {
const {color,setColor} = useContext(ContextProvider)
const [colorPicker,setColorPicker]= useState(false)
const arrayOfObjects = Object.entries(retun.data).map(([key, value]) => ({ [key]: value }));

const domNode = useRef(null)
useEffect(()=>{ 
    let mayBeHandler = (event) => {
      if (!domNode.current.contains(event.target)) {
        setColorPicker(false) 
      }
    }
    document.addEventListener('mousedown', mayBeHandler )
    return () =>{
      document.removeEventListener('mousedown',mayBeHandler)
    }
  },[])




  return (
    <>
    <div className='header' >
      <span style={{backgroundColor:color}} className='logo' >Logo</span>
      <div ref={domNode} className='color-picker' style={{backgroundColor:color}}  >
        <span onClick={()=>{setColorPicker(prev => !prev)}} >{colorPicker ? "CLOSE" : "COLOR" }</span>
      {colorPicker && <ChromePicker color={color} onChange={(e) => {setColor(e.hex)}} />}
      </div>
      </div>
    <div className='chart-page' >
      <Chart {...props} arrayOfObjects={arrayOfObjects} />
      <Table data={ddperiod.data} />
    </div>
    </>
  )
}

export default ChartPage
