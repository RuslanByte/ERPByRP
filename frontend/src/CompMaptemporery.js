import './CompMap.css';
import React, { useEffect, useState } from 'react';
import Map from './Map';

function CompMap() {
  const [locationData, setLocationData] = useState(null);
  const [nominatimData, setNominatimData] = useState(null);
  const [error, setError] = useState(null);

  const fetchLocationData = async () => {
    try {
      const response = await fetch('http://localhost:8080/orders/home');
      const data = await response.json();
      setLocationData(data);
    } catch (err) {
      setError('Ошибка при получении данных с сервера');
      console.error(err);
    }
  };

  const fetchNominatimData = async (city, street, house) => {
    const v = ',';
    const s = ' ';
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&street=${encodeURIComponent(street)}+${encodeURIComponent(v)}+${encodeURIComponent(s)}+${encodeURIComponent(house)}&format=json`;

    try {
      const response = await fetch(url);
      console.log(response);
      const data = await response.json();
      console.log(data);
      setNominatimData(data);
    } catch (err) {
      setError('Ошибка при получении данных от Nominatim');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocationData();
  }, []);

  useEffect(() => {
    if (locationData && locationData.length > 0) {
      const { city, street, house } = locationData[0];

      if (city && street && house) {
        fetchNominatimData(city, street, house);
      } else {
        console.error('Недостаточно данных для запроса к Nominatim');
      }
    }
  }, [locationData]);

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <Map />
      <div className="overlay-text">
        <div className="dataCliantsStyleOnMap">

          <div>Подъезд: </div>
          <div>Этаж: </div>
          <div>Квартира: </div>
          <div>Холодный Счетчик: </div>
          <div>Горячий Счетчик: </div>
          <div>Тепловой Счетчик: </div>
          <div>Сумма: </div>
          <div>Телефон: </div>
          <div>Комментарий: </div>
        </div>
      </div>
    </div>
  );
}

export default CompMap;