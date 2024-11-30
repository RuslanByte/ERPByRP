import './CompMap.css';
import React, {useState} from 'react';
import Map from './Map';

function CompMap() {
  const [sidePanelHide, setSidePanelHide] = useState("sidePanelHideDisable");
  const [buttonHide, setButtonHide] = useState("buttonHideDisable");

  const handleSidePanelHide = () => {
    setSidePanelHide((sidePanelHide) => {
      if(sidePanelHide === "sidePanelHideDisable"){
        return "sidePanelHideEnable";
      } else{
        return "sidePanelHideDisable";
      }
    })
  }

  const handlerButtonHideAndSidePanelHide = () => {
    setButtonHide((buttonHide) => {
      if(buttonHide === "buttonHideDisable"){
        return "buttonHideEnable";
      } else{
        return "buttonHideDisable";
      }
    })

    handleSidePanelHide();

  }

  const handleButtonHide = () => {
    setButtonHide((buttonHide) => {
      if(buttonHide === "buttonHideEnable"){
        return "buttonHideDisable";
      } else{
        return "buttonHideDisable";
      }
    })
  }

  const handlerAutoBackPanel = () => {
    setSidePanelHide((buttonHide) => {
      if(buttonHide === "sidePanelHideEnable"){
        return "sidePanelHideDisable";
      } else{
        return "sidePanelHideDisable";
      }
    })
    handleButtonHide();
  }




  const [adressSidePanelHide, setAdressSidePanelHide] = useState("adressSidePanelHideDisable");
  const [adressButtonHide, setAdressButtonHide] = useState("adressButtonHideDisable");

  const handleAdressSidePanelHide = () => {
    setAdressSidePanelHide((sidePanelHide) => {
      if(sidePanelHide === "adressSidePanelHideDisable"){
        return "adressSidePanelHideEnable";
      } else{
        return "adressSidePanelHideDisable";
      }
    })
  }

  const handlerAdressButtonHideAndSidePanelHide = () => {
    setAdressButtonHide((buttonHide) => {
      if(buttonHide === "adressButtonHideDisable"){
        return "adressButtonHideEnable";
      } else{
        return "adressButtonHideDisable";
      }
    })

    handleAdressSidePanelHide();

  }


  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <Map HideButtonAndPanel={handlerButtonHideAndSidePanelHide} sidePanelHide={sidePanelHide} buttonHide={buttonHide}
           AutoBackPanel={handlerAutoBackPanel}
           AdressButtonHideAndSidePanelHide={handlerAdressButtonHideAndSidePanelHide} adressSidePanelHide={adressSidePanelHide} adressButtonHide={adressButtonHide}/>

    </div>
  );
}

export default CompMap;