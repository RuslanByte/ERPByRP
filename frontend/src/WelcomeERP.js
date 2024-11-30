import React, {useEffect } from 'react';
import { usePhoto } from './PhotoContext'; 
import './Right.css';
import './WelcomeERP.css'

function WelcomeERP({handleCombinedClick, gstyleTog}) {

    const { photoURL, setPhotoURL } = usePhoto();
    const name = localStorage.getItem('name');
    
    useEffect(() => {
      const fetchPhoto = async () => {
          const token = localStorage.getItem('token'); 
          try {
              const response = await fetch('/api/employees/getPhoto', {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
              });

              if (!response.ok) {
                  throw new Error('Ошибка при получении фотографии');
              }

              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              setPhotoURL(url);
              localStorage.setItem('photoURL', url);
          } catch (error) {
              console.error('Error fetching photo:', error);
          }
      };


      if (!photoURL) {
          fetchPhoto();
      }

  }, [photoURL, setPhotoURL]);


    return (
    <>
        <div className = "gnavR">
        <div className = "header">
            <form action ="/gsg">
            <input className = "search" type = "search" name = "search" placeholder = "Поиск"/>
            <input className ="btn" type ="submit" value =" "/>
            </form>
            <div className = "VerticalBar">
                <span className = "name">{name}</span>
                <img className = "photo" src = {photoURL} alt = "d" width = "26px" height = "26px"></img>
            </div>
        </div>
        <div className = {gstyleTog} onClick={ handleCombinedClick }></div>
        <h1 className="welcome">Главная страница</h1>
        <h1 className="welcome">ERP Система разработанная Ruslan Pseush</h1>
        
        </div>
    </>
    );
};

export default WelcomeERP;