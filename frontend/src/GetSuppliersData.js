import React, { useState, useEffect, useCallback } from 'react';

import './GetSuppliersData.css';

const DataDisplay = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem('token');

const fetchSuppliers = useCallback(async () => {
  const response = await fetch('/api/suppliers', {
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
  fetchSuppliers();
}, [fetchSuppliers]);

  return (
    <>
    <div className="dataProductsStyle">
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Тип</th>
            <th>Количество</th>
            <th>Телефон</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody className="dataProductsStyleT">
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>{item.count}</td>
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