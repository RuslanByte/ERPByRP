import Left from './Left';
import Profile from './Profile.js';
import React, { useState } from 'react';
function CompProfile(){

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


    return(
        <>
            <Left isRed={isBoxRed}/>
            <Profile handleCombinedClick={handleCombinedClick} gstyleTog = {gstyleTog} />
        </>
    )
}

export default CompProfile;