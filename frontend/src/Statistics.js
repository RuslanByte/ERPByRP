import React, { useState, useEffect, useCallback } from 'react';

import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';


import './Right.css';
import './Statistics.css';

Chart.register(...registerables);

function Statistics({ handleCombinedClick, gstyleTog}) {

    const token = localStorage.getItem('token');
    const [Orders, setOrders] = useState([]);
    

    const [ordersDate, setOrdersDate] = useState({
        startDate: "",
        endDate: "",
        master: "Все"
      });

    const [error, setError] = useState(null);

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setOrdersDate((prevState) => ({
          ...prevState,
          [name]: value
        }));
      };



      const [Incomes, setIncomes] = useState([1,1,1,1,1]);

      const [incomeDate, setIncomeDate] = useState({
        startDate: "",
        endDate: "",
        master: "Все"
      });
      
    const handleIncomeDataChange = (e) => {
        const {name, value} = e.target;
        setIncomeDate((prevState) => ({
            ...prevState,
            [name]: value
    }))
    }

    const Photo = localStorage.getItem('photoURL');
    const name = localStorage.getItem('name');

    const getCountOrders = useCallback( async () => {
        try {
            const response = await fetch('/api/orders/countByStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
            });

            if(response.ok){
                const data = await response.json();
                console.log("от useEffect");
                console.log(data);
                setOrders(data);
                console.log(Orders);
            } else{
                console.log("Сервер ответил с ошибкой ");
            }
        } catch (error) {
            console.log("Ошибка получения количество заказов " + error);
        }
    },[token]);

    useEffect( () => {
        getCountOrders();
    }, [getCountOrders]);

  
  const fetchOrderStats = async (event) => {
    event.preventDefault();
    if (!ordersDate.startDate || !ordersDate.endDate) {
      setError("Пожалуйста, выберите оба диапазона дат.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/getOrdersDate?startDate=${ordersDate.startDate}&endDate=${ordersDate.endDate}&master=${ordersDate.master}`, {
          method: "GET",
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке данных");
      }


      const data = await response.json();
      console.log("из функции со временем ");
      console.log(data);
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Ошибка при загрузке данных");
    }
  };




  const fetchIncomeStats = async (event) => {
    event.preventDefault();
    if (!incomeDate.startDate || !incomeDate.endDate) {
      setError("Пожалуйста, выберите оба диапазона дат.");
      return;
    }

    try {
      const response = await fetch(`/api/orders/getIncomesDate?startDate=${incomeDate.startDate}&endDate=${incomeDate.endDate}&master=${incomeDate.master}`, {
          method: "GET",
          headers: {
            'Content-Type': "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при загрузке данных");
      }

      const data = await response.json();
      const keysOrder = ["CashPayment", "CashlessPayment", "CompanyIncome", "EmployeeProfit", "NetProfitOfTheCompany"];
      const values = keysOrder.map((key) => data[key]);
      console.log("из функции с доходами ");    
      console.log(data);
      console.log(values);
      setIncomes(values);
      setError(null); 
    } catch (err) {
        setError(err.message || "Ошибка при загрузке данных");
    }
  };


  




    const data = {
        labels: ['Кол. заказов', 'Кол. Новых заказов', 'Кол. Выполненых заказов', 'Кол. заказов в работе', 'Кол. Перенесённых заказов', 'Кол. Отмененых заказов'],
        datasets: [
            {
                label: 'Кол. заказов',
                data: [
                    { x: 'Кол. заказов', y: Orders.New + Orders.Complete + Orders.InWork + Orders.Refusal +  Orders.Transferred },
                ],
                backgroundColor: 'rgba(11, 26, 233, 1)',
            },
            {
                label: 'Кол. Новых заказов',
                data: [
                    { x: 'Кол. Новых заказов', y:  Orders.New },
                ],
                backgroundColor: 'rgba(207, 25, 231, 1)',

            },
            {
                label: 'Кол. Выполненых заказов',
                data: [
                    { x: 'Кол. Выполненых заказов', y:  Orders.Complete },
                ],
                backgroundColor: 'rgba(25, 231, 25, 1)',

            },
            {
                label: 'Кол. заказов в работе',
                data: [
                    { x: 'Кол. заказов в работе', y:  Orders.InWork },
                ],
                backgroundColor: 'rgba(231, 211, 25, 1)',

            },
            {
                label: 'Кол. Перенесённых заказов',
                data: [
                    { x: 'Кол. Перенесённых заказов', y: Orders.Transferred },
                ],
                backgroundColor: 'rgba(0, 255, 255, 0.829)',
            },
            {
                label: 'Кол. Отмененых заказов',
                data: [
                    { x: 'Кол. Отмененых заказов', y:  Orders.Refusal },
                ],
                backgroundColor: 'rgba(231, 25, 25, 1)',

            },
        ],
        
    };
    const options = {
        scales: {
            x: {
                type: 'category',
                grid: {
                    color: 'rgba(200, 200, 200, 1)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 1)',
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: 'Arial',
                    },
                },
                title: {
                    display: true,
                    text: 'Заказы',
                    color: 'rgba(255, 255, 255, 1)',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Arial',
                    },
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(200, 200, 200, 0.5)',
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 1)',
                    font: {
                        size: 16,
                        weight: 'bold',
                        family: 'Arial',
                    },
                },
                title: {
                    display: true,
                    text: 'Количество',
                    color: 'rgba(255, 255, 255, 1)',
                    font: {
                        size: 18,
                        weight: 'bold',
                        family: 'Arial',
                    },
                }
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems) {
                        return tooltipItems[0].label;
                    },
                    label: function(tooltipItem) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw.y}`;
                    }
                },
                bodyFont: {
                    size: 15,
                    weight: 'bold',
                    color: 'rgba(255, 255, 255, 1)',
                },
                titleFont: {
                    size: 17,
                    weight: 'bold',
                    color: 'rgba(255, 255, 255, 1)',
                },
            },
            legend: {
                labels: {
                    color: 'rgba(255, 255, 255, 1)',
                    font: {
                        size: 16, // Укажите размер шрифта
                        weight: 'bold', // Можно указать стиль, например: 'normal', 'bold', 'bolder', 'lighter'
                        family: 'Arial', // Можно указать шрифт, например: 'Arial', 'Helvetica', 'sans-serif'
                    },
                }
            },
            title: {
                display: true,
                text: 'Статистика заказов',
                color: 'rgba(255, 255, 255, 1)',
                font: {
                    size: 20, // Укажите размер шрифта
                    weight: 'bold', // Можно указать стиль, например: 'normal', 'bold', 'bolder', 'lighter'
                    family: 'Arial', // Можно указать шрифт, например: 'Arial', 'Helvetica', 'sans-serif'
                },
            }
        }
    };



    //"Долг компании сотруднику" "Долг сотрудника компании" "rgba(40, 240, 92, 0.2)" Наличный расчет Доход компании Зарплата сотрудника
    const dataPie = {
        labels: ["Наличный расчет", "Безналичный расчет", "Доход компании", "Зарплата сотрудника","Чистая прибыль компании"],
        datasets: [
          {
            label: "Dataset Example",
            data: Incomes,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)"
            ],
            borderWidth: 2,
          },
        ],
      };
    
      const optionsPie = {
        responsive: true,
        plugins: {
          title:{
            display: true,
            text: "График дохода",
                font: {
                    size: 24,
                },
            color: "rgba(255, 255, 255, 1)",
            },
          legend: {
            position: "top",
            labels: {
                font: {
                    size: 17,
                },
            color: "rgba(255, 255, 255, 1)",
            }
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `${tooltipItem.label}: ${tooltipItem.raw} Руб`;
              },
            },
            bodyFont: {
                size: 15,
              },
              titleFont: {
                size: 16,
              },
          },
        },
      };


    
    return(
    <div className = "gnavR">
        <div className = "header">
            <form action ="/gsg">
                <input className = "search" type = "search" name = "search" placeholder = "Поиск"/>
                <input className ="btn" type ="submit" value =" "/>
            </form>
        <div className = "VerticalBar">
            <span className = "name">{name}</span>
            <img className = "photo" src = {Photo} alt = "d" width = "26px" height = "26px"></img>
        </div>
        </div>
        <div className = {gstyleTog} onClick={ handleCombinedClick }></div>
        <form className='locdate'>
        <label>
          Начальная дата:
          <input
            type="datetime-local"
            name="startDate"
            value={ordersDate.startDate}
            onChange={handleDateChange}
          />
        </label>
        <label style={{marginLeft: '1%'}}>
          Конечная дата:
          <input
            type="datetime-local"
            name="endDate"
            value={ordersDate.endDate}
            onChange={handleDateChange}
          />
        </label>
        <label style={{marginLeft: '1%'}}>
          Мастер:
          <input style={{ width: '4vw', height: '2vh', fontSize: 'medium'}}
            type="text"
            name="master"
            list='masters'
            value={ordersDate.master}
            onChange={handleDateChange}
          />
        </label>
        <datalist id='masters'>
            <option value="Все"/>
            <option value="Сергей"/>
            <option value="Ярослав"/>
            <option value="Мирза"/>
            <option value="Алексей"/>
        </datalist>
        <button style={{marginLeft: '1%'}} onClick={fetchOrderStats}>Загрузить статистику</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
         <div className='BarStyle'>
            <Bar data={data} options={options} />
        </div>
        
        <div className='GraphOfIncome'>
        <form className='locdate'>
        <label>
          Начальная дата:
          <input
            type="datetime-local"
            name="startDate"
            value={incomeDate.startDate}
            onChange={handleIncomeDataChange}
          />
        </label>
        <label style={{marginLeft: '1%'}}>
          Конечная дата:
          <input
            type="datetime-local"
            name="endDate"
            value={incomeDate.endDate}
            onChange={handleIncomeDataChange}
          />
        </label>
        <label style={{marginLeft: '1%'}}>
          Мастер:
          <input style={{ width: '4vw', height: '2vh', fontSize: 'medium'}}
            type="text"
            name="master"
            list='masters'
            value={incomeDate.master}
            onChange={handleIncomeDataChange}
          />
        </label>
        <datalist id='masters'>
            <option value="Все"/>
            <option value="Сергей"/>
            <option value="Ярослав"/>
            <option value="Мирза"/>
            <option value="Алексей"/>
        </datalist>
        <button style={{marginLeft: '1%'}} onClick={fetchIncomeStats}>Загрузить статистику</button>
      </form>
      </div>

      {error && <p style={{color: "red"}}>{error}</p>}
        <div className='PieStyle'>
            <Pie data={dataPie} options={optionsPie} />
        </div>
    </div>
    )
};

export default Statistics;