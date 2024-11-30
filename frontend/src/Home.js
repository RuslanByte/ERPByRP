
import Left from './Left';
import WelcomeERP from './WelcomeERP.js';
import React, { useState } from 'react';

function Home(){
    const [isBoxRed, setIsBoxRed] = useState(false);
    const [gstyleTog, setGstyleTog] = useState("tog")
  
    const toggleBoxColor = () => {
      setIsBoxRed(prev => !prev)
    };
  
    const handleCombinedClick = () => {
      setGstyleTog((gstyleTog) => {
        if(gstyleTog === "tog"){
          return "togHid";
        } else{
          return "tog";
        }
        })
      
      toggleBoxColor();
    }
        
    return (
    <>
    <Left isRed={isBoxRed}/>
    <WelcomeERP handleCombinedClick={handleCombinedClick} gstyleTog = {gstyleTog}/>
    </>
    );
};

export default Home;