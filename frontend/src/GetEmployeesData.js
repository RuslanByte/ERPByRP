import React, { useState, useEffect, useCallback } from 'react';

import './GetEmployeesData.css';

const DataDisplay = () => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem('token')


  const fetchEmployees = useCallback(async () => {
    const response = await fetch('/api/employees', {
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
    fetchEmployees();
  }, [fetchEmployees]);

  return (
    <>
    <div className="dataProductsStyle">
      <table>
        <thead>
          <tr>
            <th>Логин</th>
            <th>Пароль</th>
            <th>Уровень доступа</th>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
            <th>Адрес</th>
            <th>Сумма</th>
            <th>Телефон</th>
            <th>Комментарий</th>
          </tr>
        </thead>
        <tbody className="dataProductsStyleT">
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.username}</td>
              <td>{item.password}</td>
              <td>{item.accessrights}</td>
              <td>{item.surname}</td>
              <td>{item.name}</td>
              <td>{item.patronymic}</td>
              <td>{item.address}</td>
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