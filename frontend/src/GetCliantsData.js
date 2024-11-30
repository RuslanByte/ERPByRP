import React, { useEffect, useState } from 'react';

import './GetCliantsData.css';

const DataDisplay = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => console.error('Ошибка при получении данных:', error));
  }, []);

  return (
    <>
    <div className="dataCliantsStyle">
      <table>
        <thead>
          <tr>
            <th>Населённый пункт</th>
            <th>Улица</th>
            <th>Дом</th>
            <th>Подъезд</th>
            <th>Этаж</th>
            <th>Квартира</th>
            <th>Холодный Счетчик</th>
            <th>Горячий Счетчик</th>
            <th>Тепловой Счетчик</th>
            <th>Сумма</th>
            <th>Телефон</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody className="dataCliantsStyleT">
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.city}</td>
              <td>{item.street}</td>
              <td>{item.house}</td>
              <td>{item.entrance}</td>
              <td>{item.floor}</td>
              <td>{item.apartment}</td>
              <td>{item.coldcounter}</td>
              <td>{item.hotcounter}</td>
              <td>{item.heatmeter}</td>
              <td>{item.amount}</td>
              <td>{item.telephone}</td>
              <td>{item.comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default DataDisplay;