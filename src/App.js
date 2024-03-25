import { createContext, useState } from 'react';
import './App.css';
import ChartPage from './pages/ChartPage';


 export const ContextProvider = createContext()

function App() {
  
  const [color,setColor] =  useState("#2962FF")



  return (
    <ContextProvider.Provider value={{color,setColor}} >
    <main>
    <ChartPage />
    </main>
    </ContextProvider.Provider>
  );
}

export default App;
