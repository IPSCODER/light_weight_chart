import React, { useContext } from 'react'
import "./table.css"
import { ContextProvider } from '../../App'

const Table = ({data}) => {
  const {color,setColor} = useContext(ContextProvider)
  
  return (
    <div className='table' >
      <table>
        <thead style={{backgroundColor:color}}  >
        <tr>
          <th>Period</th>
          <th>Max DD</th>
          <th>Days</th>
        </tr>
        </thead>
        <tbody >
        {data.map((i,index)=>(
          <tr key={index} >
          <td>{i.Start_Date}<span>  -  </span>{i.End_Date}</td>
          <td>{i.Max_Drawdown.toFixed(2)}</td>
          <td>{i.Time_for_recovery}</td>  
        </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
