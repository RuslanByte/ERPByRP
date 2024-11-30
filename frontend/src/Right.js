import React, {useEffect, useState, useCallback, useRef } from 'react';


import './Right.css';

import A from './icon/plus.svg';
import D from './icon/download.svg';


function Right({ handleCombinedClick, gstyleTog, bstyleTog, onClickAdd, addstyleTog, linestyleTog }){

  const [formData, setFormData] = useState({
    city: '',
    district: '',
    street: '',
    house: '',
    entrance: '',
    floor: '',
    apartment: '',
    coldcounter: '',
    hotcounter: '',
    pricecoldhotcounter: '',
    heatmeter: '',
    priceheatmeter: '',
    amount: '',
    telephone: '',
    comment: '',
    lat: '',
    lon: '',
    status: 'Новый',
    master: '',
    formofpayment: '',
    addOrderTime: '',
  });

  const cityRef = useRef(null);

  const token = localStorage.getItem('token');

  const Photo = localStorage.getItem('photoURL');

  const name = localStorage.getItem('name');

  const [allData, setAllData] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

      
  if (value && name === "city") {
    const filtered = cities.filter(city => city.toLowerCase().startsWith(value.toLowerCase()));
    setFilteredCities(filtered);
    setIsDropdownOpen(true);
  } else {
    setFilteredCities([]);
    setIsDropdownOpen(false);
  }
  };


  const [numOfRow, setNumOfRow] = useState(10);

  const [debouncedNumOfRow, setDebouncedNumOfRow] = useState(numOfRow);

  const handleRowChange = (event) => {
    setNumOfRow(event.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedNumOfRow(numOfRow);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [numOfRow]);

  const fetchAllData = useCallback( async () => {
    try {
      const response = await fetch(`/api/orders/limit?numOfRow=${debouncedNumOfRow}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
      if(response.ok){
        const data = await response.json();
        console.log("вызов из fetchAllData")
        console.log(data)
        setAllData(data);
      } else{
        console.error('Ошибка при получении данных')
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  },[debouncedNumOfRow, token]);

  useEffect(() => {
    fetchAllData();
  }, [debouncedNumOfRow, fetchAllData]);




  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (event) => {
    if(event.key === 'Enter'){
      event.preventDefault();

      try {
        const response = await fetch(`/api/orders/search?searchTerm=${encodeURIComponent(searchTerm)}`,{
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
        })
        
        if(!response.ok){
          throw new Error('Ошибка при выплнении запроса на поиск');
        }

        const data = await response.json();
        console.log('данные поиска');
        console.log(data);
        setAllData(data);
      } catch (error) {
        console.error('ошибка получения данных поиска');
      }
    }
  };



  const fetchCoordinates = async () => {
    const { city, district, street, house } = formData;
    const streetWithHouse = `${city}, ${district}, ${street} ${house}`; // Объединяем street и house
    console.log(streetWithHouse);
    console.log(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(streetWithHouse)}&format=json`);

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(streetWithHouse)}&format=json`
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);
        if (data && data.length > 0) {
            data.forEach(result => {
              console.log(`Адрес: ${result.display_name}, координаты: ${result.lat}, ${result.lon}`);
          });
            const { lat, lon } = data[0];
            const me = {...formData, city: "hellocity", street: "wordstreet"};
            console.log(me);
            const updatedFormData = {
              ...formData,
              lat: lat,
              lon: lon,
            };
            console.log('Обновленные данные для отправки:', updatedFormData);
               return updatedFormData;
        } else {
            console.log('No results found');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
    }
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedFormData = await fetchCoordinates();
    if (updatedFormData) {
        try {
          const cuttentTime = new Date().toISOString();
    
          const dataWithTime = {...updatedFormData, addOrderTime: cuttentTime, status: formData.status};
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataWithTime),
            });
    
            if (!response.ok) {
                throw new Error('Сеть ответила с ошибкой');
            }
    
            await fetchAllData();
            setFormData({
                city: '',
                district: '',
                street: '',
                house: '',
                entrance: '',
                floor: '',
                apartment: '',
                coldcounter: '',
                hotcounter: '',
                pricecoldhotcounter: '',
                heatmeter: '',
                priceheatmeter: '',
                amount: '',
                telephone: '',
                comment: '',
                lat: '',
                lon: '',
                status: 'Новый',
                master: '',
                formofpayment: '',
            });
    
            cityRef.current.focus();
    
            const data = await response.json();
            console.log('Ответ сервера:', data);
        } catch (error) {
            console.error('Ошибка при отправке данных:', error);
        }
    }
  };

  const PdfDownload = () => {
      fetch('/api/orders/pdf', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
          'Authorization': `Bearer ${token}`
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'report.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => console.error('Error downloading PDF:', error));
    };

    const handleDelete = async (id) => {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(id)}`,{
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
        
        if(response.ok){

          setAllData((prevData) => prevData.filter(item => item.id !== id));
        } else {
            console.error('Ошибка при удалении данных');
        }
      } catch (error) {
        console.error('ошибка удалении заказа', error);
      }
    } 

    const [editData, setEditData] = useState(null);

    const handleEditClick = (item) => {
      setEditData(item);
    };

    const handleInputChange = (e) => {
      const {name, value} = e.target;
      setEditData({...editData, [name]: value});
    }

    const handleSave = async (editData) => {
      if(editData){
        try {
          const response = await fetch(`/api/orders/${encodeURIComponent(editData.id)}/updateOrder`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(editData),
          });
          
          if(response.ok){
            setAllData((prevData) => {
              return prevData.map((item) => 
                item.id === editData.id ? editData : item
              )
            });
            setEditData(null);
          }
          
        } catch (error) {
          console.error('ошибка при обновлении данных', error);
        }
      }
    }




  useEffect(() => {
    const coldCounter = parseInt(formData.coldcounter, 10) || 0;
    const hotCounter = parseInt(formData.hotcounter, 10) || 0;
    const sumOfColdCounterAndHotCounter = coldCounter + hotCounter;


    const priceColdHotCounter = parseInt(formData.pricecoldhotcounter, 10) || 0;
    const priceHeatMeter = parseInt(formData.priceheatmeter, 10) || 0;

    
    const heatMeter = parseInt(formData.heatmeter, 10) || 0;

    const totalAmount = (priceColdHotCounter * sumOfColdCounterAndHotCounter) + (priceHeatMeter * heatMeter);

    setFormData((prevData) => ({
      ...prevData,
      amount: totalAmount.toString()
    }));
  }, [formData.coldcounter, formData.hotcounter, formData.heatmeter, formData.pricecoldhotcounter, formData.priceheatmeter]);




  useEffect(() => {
    if(editData){
    const coldCounter = parseInt(editData.coldcounter, 10) || 0;
    const hotCounter = parseInt(editData.hotcounter, 10) || 0;
    const sumOfColdCounterAndHotCounter = coldCounter + hotCounter;


    const priceColdHotCounter = parseInt(editData.pricecoldhotcounter, 10) || 0;
    const priceHeatMeter = parseInt(editData.priceheatmeter, 10) || 0;

    
    const heatMeter = parseInt(editData.heatmeter, 10) || 0;


    const totalAmount = (priceColdHotCounter * sumOfColdCounterAndHotCounter) + (priceHeatMeter * heatMeter);


    setEditData((prevData) => ({
      ...prevData,
      amount: totalAmount.toString()
    }));
  }
  }, [editData?.coldcounter, editData?.hotcounter, editData?.heatmeter, editData?.pricecoldhotcounter, editData?.priceheatmeter]);


  const [filteredCities, setFilteredCities] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0); 

  const cities = [
    "Краснодар", "Абинск", "Анапа", "Апшеронск", "Армавир",
    "Белореченск", "Геленджик", "Горячий Ключ", "Гулькевичи", "Ейск", "Кореновск",
    "Кропоткин", "Крымск", "Курганинск", "Лабинск", "Новокубанск", "Новороссийск",
    "Приморско-Ахтарск", "Славянск-на-Кубани", "Сочи", "Темрюк", "Тимашёвск",
    "Тихорецк", "Туапсе", "Усть-Лабинск", "Хадыженск",
  ];



const handleSelectCity = (city) => {
  setFormData({ ...formData, city });
  setIsDropdownOpen(false);
};

const handleKeyDown = (event) => {
  if (filteredCities.length === 0) return;

  if (event.key === "ArrowDown") {
    setHighlightedIndex((prevIndex) => {
      const newIndex = (prevIndex + 1) % filteredCities.length;
      scrollToHighlighted(newIndex); 
      return newIndex;
    });
  } else if (event.key === "ArrowUp") {
    setHighlightedIndex((prevIndex) => {
      const newIndex = (prevIndex - 1 + filteredCities.length) % filteredCities.length;
      scrollToHighlighted(newIndex);
      return newIndex;
    });
  } else if (event.key === "Enter") {
    setFormData({
      ...formData,
      city: filteredCities[highlightedIndex],
    });
    setIsDropdownOpen(false);
  }
};

  const scrollToHighlighted = (index) => {
    const highlightedItem = document.getElementById(`city-${index}`);
    if (highlightedItem) {
      highlightedItem.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };
  


    return <div className = "gnavR">
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
        <ul className = "rlu">
            <li className = "rluf">
                Клиенты
            </li>
            <li className = "rlus" onClick={onClickAdd}>
            <img src = {A} alt = "d" width = "18px" height = "18px" vspace = "2" hspace = "2" align ="left"/> Добавить нового клиента
            </li>
            <li className = "rlut" onClick={PdfDownload}>
            <img src = {D} alt = "d" width = "18px" height = "18px" vspace = "2" hspace = "2" align ="left"/> Создать отчет
            </li>
        </ul>

        <div className={addstyleTog}>
         <form onSubmit={handleSubmit}>
           <div className="f">
             <div>
               <label htmlFor="city">Нас. пункт</label>
               <input
                 className="listOfForminputs"
                 id="city"
                 type="text"
                 name="city"
                 value={formData.city}
                 onChange={handleChange}
                 onKeyDown={handleKeyDown} 
                 placeholder="Населенный пункт"
                 ref={cityRef}
                 list="cities"
               />
         {isDropdownOpen && (
            <ul className="dropdown">
              {filteredCities.map((city, index) => (
                <li
                  key={index}
                  id={`city-${index}`}
                  onClick={() => handleSelectCity(city)}
                  style={{
                    backgroundColor: highlightedIndex === index ? '#a5a5a5a9' : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
             </div>
             <div>
               <label htmlFor="district">Округ</label>
               <input
                 className="listOfForminputs"
                 id = "district"
                 type = "text"
                 name = "district"
                 list = 'districts'
                 value={formData.district}
                 onChange={handleChange}
                 placeholder="Округ"
               />
               <datalist id='districts'>
                <option value='Центральный округ'></option>
                <option value='Западный округ'></option>
                <option value='Прикубанский округ'></option>
                <option value='Карасунский округ'></option>
               </datalist>
             </div>
             <div>
               <label htmlFor="street">Улица</label>
               <input
                 className="listOfForminputs"
                 id="street"
                 type="text"
                 name="street"
                 value={formData.street}
                 onChange={handleChange}
                 placeholder="Улица"
               />
             </div>
             <div>
               <label htmlFor="house">Дом</label>
               <input
                 className="listOfFormInputsShort"
                 id="house"
                 type="text"
                 name="house"
                 value={formData.house}
                 onChange={handleChange}
                 placeholder="Дом"
               />
             </div>
             <div>
               <label htmlFor="entrance">Подъезд</label>
               <input
                 className="listOfFormInputsShort"
                 id="entrance"
                 type="text"
                 name="entrance"
                 value={formData.entrance}
                 onChange={handleChange}
                 placeholder="Подъезд"
               />
             </div>
             <div>
               <label htmlFor="floor">Этаж</label>
               <input
                 className="listOfFormInputsShort"
                 id="floor"
                 type="text"
                 name="floor"
                 value={formData.floor}
                 onChange={handleChange}
                 placeholder="Этаж"
               />
             </div>
             <div>
               <label htmlFor="apartment">Квартира</label>
               <input
                 className="listOfFormInputsShort"
                 id="apartment"
                 type="text"
                 name="apartment"
                 value={formData.apartment}
                 onChange={handleChange}
                 placeholder="Квартира"
               />
             </div>
             <div>
               <label htmlFor="coldcounter">Хол. С.</label>
               <input
                 className="listOfFormInputsShort"
                 id="coldcounter"
                 type="text"
                 name="coldcounter"
                 value={formData.coldcounter}
                 onChange={handleChange}
                 placeholder="Хол. Счетчик"
               />
             </div>
             <div >
               <label htmlFor="hotcounter">Гор. С.</label>
               <input
                 className="listOfFormInputsShort"
                 id="hotcounter"
                 type="text"
                 name="hotcounter"
                 value={formData.hotcounter}
                 onChange={handleChange}
                 placeholder="Гор. Счетчик"
               />
             </div>
             <div>
               <label htmlFor="pricecoldhotcounter">Цена за Вод.С.</label>
               <input
                 className="listOfForminputs"
                 id="pricecoldhotcounter"
                 type="text"
                 name="pricecoldhotcounter"
                 value={formData.pricecoldhotcounter}
                 onChange={handleChange}
                 placeholder="Цена за Вод.С."
               />
             </div>
             <div>
               <label htmlFor="heatmeter">Теп. Счетчик</label>
               <input
                 className="listOfForminputs"
                 id="heatmeter"
                 type="text"
                 name="heatmeter"
                 value={formData.heatmeter}
                 onChange={handleChange}
                 placeholder="Теп. Счетчик"
               />
             </div>
             <div>
               <label htmlFor="priceheatmeter">Цена за Теп.С.</label>
               <input
                 className="listOfForminputs"
                 id="priceheatmeter"
                 type="text"
                 name="priceheatmeter"
                 value={formData.priceheatmeter}
                 onChange={handleChange}
                 placeholder="Цена за Теп.С."
               />
             </div>
             <div>
               <label htmlFor="amount">Сумма</label>
               <input
                 className="listOfFormInputsShort"
                 id="amount"
                 type="text"
                 name="amount"
                 value={formData.amount}
                 onChange={handleChange}
                 placeholder="Сумма"
                 readOnly
               />
             </div>
             <div>
               <label htmlFor="telephone">Телефон</label>
               <input
                 className="listOfForminputs"
                 id="telephone"
                 type="text"
                 name="telephone"
                 value={formData.telephone}
                 onChange={handleChange}
                 placeholder="Телефон"
               />
             </div>
             <div>
               <label htmlFor="comment">Комментарий</label>
               <input
                 className="listOfForminputs"
                 id="comment"
                 type="text"
                 name="comment"
                 value={formData.comment}
                 onChange={handleChange}
                 placeholder="Комментарий"
               />
             </div>
             <div>
               <label htmlFor="master">Мастер</label>
               <input
                 className="listOfForminputs"
                 id="master"
                 type="text"
                 name="master"
                 list="masters"
                 value={formData.master}
                 onChange={handleChange}
                 placeholder="Мастер"
               />
               <datalist id="masters">
                 <option value="Сергей" />
                 <option value="Ярослав" />
                 <option value="Мирза" />
                 <option value="Алексей" />
               </datalist>
             </div>

             <div>
               <label htmlFor="payment">Форма оплаты</label>
               <input
                 className="listOfFormInputsFormOfPayment"
                 id="payment"
                 type="text"
                 name="formofpayment"
                 list="payments"
                 value={formData.formofpayment}
                 onChange={handleChange}
                 placeholder="Форма оплаты"
               />
               <datalist id="payments">
                 <option value="Без/p" />
                 <option value="Нал/р" />
               </datalist>
             </div>

             
       
           </div>
           <button className={bstyleTog} type="submit">
               Добавить
             </button>
         </form>
       </div>


        <div className = "info">Информация о клиентах</div>
        <div>
        <div className = "infoAboutClient">
          <div>Показать Строк <input className ="numberOfRows" type = "number" value={numOfRow} onChange={handleRowChange}/></div> 
          <div className = "dsub_search"> <input className = "sub_search" placeholder = "Поиск" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleSearch}/></div> </div>
        <div className = {linestyleTog}></div>

        </div>
        <div className="dataCliantsStyle">
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Населённый пункт</th>
            <th>Округ</th>
            <th>Улица</th>
            <th>Дом</th>
            <th>Подъезд</th>
            <th>Этаж</th>
            <th>Квартира</th>
            <th>Хол. С.</th>
            <th>Гор. С.</th>
            <th>Цена В.</th>
            <th>Теп. С.</th>
            <th>Цена Т.</th>
            <th>Сумма</th>
            <th>Телефон</th>
            <th>Комментарий</th>
            <th>Мастер</th>
            <th>Статус</th>
            <th>Фор.о</th>
            <th>Время С/З</th>
            <th>Время В/З</th>
          </tr>
        </thead>
        <tbody className="dataCliantsStyleT">
          {allData.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{editData?.id === item.id ? ( <input className='editInput' type='text' name='city' value={editData.city} onChange={handleInputChange}/>) : (item.city)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInput' type='text' name='district' value={editData.district} onChange={handleInputChange}/>) : (item.district)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInput' type='text' name='street' value={editData.street} onChange={handleInputChange}/>) : (item.street)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='house' value={editData.house} onChange={handleInputChange}/>) : (item.house)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='entrance' value={editData.entrance} onChange={handleInputChange}/>) : (item.entrance)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='floor' value={editData.floor} onChange={handleInputChange}/>) : (item.floor)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='apartment' value={editData.apartment} onChange={handleInputChange}/>) : (item.apartment)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='coldcounter' value={editData.coldcounter} onChange={handleInputChange}/>) : (item.coldcounter)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='hotcounter' value={editData.hotcounter} onChange={handleInputChange}/>) : (item.hotcounter)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='pricecoldhotcounter' value={editData.pricecoldhotcounter} onChange={handleInputChange}/>) : (item.pricecoldhotcounter)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='heatmeter' value={editData.heatmeter} onChange={handleInputChange}/>) : (item.heatmeter)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNum' type='text' name='priceheatmeter' value={editData.priceheatmeter} onChange={handleInputChange}/>) : (item.priceheatmeter)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputNumAmount' type='text' name='amount' value={editData.amount} onChange={handleInputChange} readOnly/>) : (item.amount)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInput' type='text' name='telephone' value={editData.telephone} onChange={handleInputChange}/>) : (item.telephone)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInput' type='text' name='comment' value={editData.comment} onChange={handleInputChange}/>) : (item.comment)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInput' type='text' name='master' list='masters' value={editData.master} onChange={handleInputChange}/>) : (item.master)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInput' type='text' name='status' list='statuses' value={editData.status} onChange={handleInputChange}/>) : (item.status)}</td>
              <td>{editData?.id === item.id ? ( <input className='editInputFormOfPayment' type='text' name='formofpayment' list='formofpayments' value={editData.formofpayment} onChange={handleInputChange}/>) : (item.formofpayment)}</td>
              <td>{item.addOrderTime.substring(0,16)}</td>
              <td>{item.completeOrderTime != null ? item.completeOrderTime.substring(0,16) : item.completeOrderTime}</td>
              <datalist id='masters'>
              <option value="Сергей"/>
              <option value="Ярослав"/>
              <option value="Мирза"/>
              <option value="Алексей"/>
              </datalist>
              <datalist id='statuses'>
              <option value="Новый"/>
              <option value="выполнено"/>
              <option value="в работе"/>
              <option value="перенесен"/>
              <option value="отказ"/>
              </datalist>
              <datalist id='formofpayments'>
              <option value="Без/р"/>
              <option value="Нал/р"/>
              </datalist>
              <div>
                  <div>
                      <input className ="btnGarbage" type ="button" value =" " onClick={() => handleDelete(item.id)}/>
                  </div>
                  <div>{editData?.id === item.id ? (
                    <input className ="btnSave" type ="button" value =" " onClick = {() => handleSave(editData)}/> 
                  ) : (
                    <input className ="btnEdit" type ="button" value =" " onClick = {() => handleEditClick(item)}/>
                  )} 
                  </div>
              </div>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    </div>
}





export default Right;