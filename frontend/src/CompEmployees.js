import Left from './Left';
import Employees from './Employees';
import React, { useState } from 'react';

function CompEmployees(){
    const [isBoxRed, setIsBoxRed] = useState(false);
    const [gstyleTog, setGstyleTog] = useState("tog")
    const [bstyleTog, setBstyleTog] = useState("addclient")
    const [addstyleTog, setAddstyleTog] = useState("hideAddEnable")
    const [linestyleTog, setLinestyleTog] = useState("Line")
  
  
    const toggleBoxColor = () => {
      setIsBoxRed(prev => !prev)
    };
  
    const toggleBoxHide = () => {
      setAddstyleTog((addstyleTog) => {
        if(addstyleTog === "hideAddEnable"){
          return "hideAddDisable"
        } else{
          return "hideAddEnable"
        }
      })
    };
    
    const buttonBoxMargin = () => {
      setBstyleTog((bstyleTog) => {
        if(bstyleTog === "addclient"){
          return "modaddclient"
        } else{
          return "addclient"
        }
      })
    };
    const lineMod = () => {
      setLinestyleTog((linestyleTog) => {
        if(linestyleTog === "Line"){
          return "LineMod"
        } else{
          return "Line"
        }
      })
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
      buttonBoxMargin();
      lineMod();
    }
        
    return (
    <>
    <Left isRed={isBoxRed}/>
    <Employees handleCombinedClick={handleCombinedClick} gstyleTog = {gstyleTog} bstyleTog = {bstyleTog} onClickAdd = {toggleBoxHide} addstyleTog = {addstyleTog} linestyleTog = {linestyleTog}/>
    </>
    );
};

export default CompEmployees;