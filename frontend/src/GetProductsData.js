import React, { useState, useEffect, useCallback } from 'react';

import './GetProductsData.css';

const DataDisplay = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem('token');

  const fetchProducts = useCallback(async () => {
    const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
  
    if (response.ok) {
        const data = await response.json();
        setData(data);
    } else {
        console.error('Ошибка при получении поставщиков:', response.status);
    }
  }, [token]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
    <div className="dataProductsStyle">
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Тип</th>
            <th>Количество</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody className="dataProductsStyleT">
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.count}</td>
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