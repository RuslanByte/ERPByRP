import React, { useState, useEffect, useCallback, useRef } from 'react';



import './Right.css';
import A from './icon/plus.svg';
import D from './icon/download.svg';


function Employees({ handleCombinedClick, gstyleTog, bstyleTog, onClickAdd, addstyleTog, linestyleTog }){

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    accessrights: '',
    surname: '',
    name: '',
    patronymic: '',
    address: '',
    amount: '',
    telephone: '',
    comment: '',
    time: '',
  });

  const userNameRef = useRef(null);

  const [image, setImage] = useState(null);

  const token = localStorage.getItem('token')
  
  const Photo = localStorage.getItem('photoURL');

  const name = localStorage.getItem('name');

  const [data, setData] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
      const response = await fetch(`/api/employees/limit?numOfRow=${debouncedNumOfRow}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
      if(response.ok){
        const data = await response.json();
        console.log("вызов из fetchAllData")
        setData(data);
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
        const response = await fetch(`/api/employees/search?searchTerm=${encodeURIComponent(searchTerm)}`,{
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
        setData(data);
      } catch (error) {
        console.error('ошибка получения данных поиска');
      }
    }
  };




  const handleFileChange = (event) => {
    setImage(event.target.files[0]); // Выбор файла
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const cuttentTime = new Date().toISOString();

    const dataWithTime = {...formData, time: cuttentTime};

    const formDataToSend = new FormData();
    formDataToSend.append('file', image);
    formDataToSend.append("employees", JSON.stringify(dataWithTime));


    console.log('данные для отправки:', formDataToSend);

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Сеть ответила с ошибкой');
      }

      const data = await response.json();
      setData((prevData) => [...prevData, data]);
      console.log('Ответ сервера:', data); 
      setFormData({
        username: '',
        password: '',
        accessrights: '',
        surname: '',
        name: '',
        patronymic: '',
        address: '',
        amount: '',
        telephone: '',
        comment: '',
        time: '',
      });
      setImage(null);

      userNameRef.current.focus();

    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };


  const PdfDownload = () => {
    fetch('/api/employees/pdf', {
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




  const fetchEmployees = useCallback(async () => {
    const response = await fetch('/api/employees', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Замените ваши данные
        },
    });
  
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        setData(data);
    } else {
        console.error('Ошибка при получении Сотрудников:', response.status);
    }
  }, [token]);
  
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);





  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/employees/${encodeURIComponent(id)}`,{
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      
      if(response.ok){

        setData((prevData) => prevData.filter(item => item.id !== id));
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
    console.log(data);
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target; 
    setEditData({...editData, [name]: value});
  }

  const handleSave = async (editData) => {
    console.log('editData передан в handleSave:', editData);
    if(editData){
      try {
        const response = await fetch(`/api/employees/${encodeURIComponent(editData.id)}/updateEmployee`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editData),
        });
        
        if(response.ok){
          setData((prevData) => {
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
                Сотрудники
            </li>
            <li className = "rlus" onClick={onClickAdd}>
            <img src = {A} alt = "d" width = "18px" height = "18px" vspace = "2" hspace = "2" align ="left"/> Добавить нового сотрудника
            </li>
            <li className = "rlut" onClick={PdfDownload}>
            <img src = {D} alt = "d" width = "18px" height = "18px" vspace = "2" hspace = "2" align ="left"/> Создать отчет
            </li>
        </ul>
        <div className={addstyleTog}>
        <form onSubmit={handleSubmit}>
          <div className = "f">
            <div>
             <label htmlFor="username">Логин</label>
              <input 
              className = "listOfForminputs" 
              id = "username"
              type="text" 
              name="username" 
              value={formData.username} 
              onChange={handleChange} 
              placeholder = "Логин" 
              ref={userNameRef}/>
            </div>
            <div>
             <label htmlFor="password">Пароль</label>
              <input 
              className = "listOfForminputs" 
              id = "password"
              type="text" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder = "Пароль" />
              </div>
            <div>
             <label htmlFor="accessrights">Уровень дос.</label>
              <input 
              className = "listOfForminputs" 
              id = "accessrights"
              type="text" 
              list='rights' 
              name="accessrights" 
              value={formData.accessrights} 
              onChange={handleChange} 
              placeholder = "Уровень доступа" />
            </div>
            <div>
             <label htmlFor="surname">Фамилия</label>
              <input 
              className = "listOfForminputs" 
              id = "surname"
              type="text" 
              name="surname" 
              value={formData.surname} 
              onChange={handleChange} 
              placeholder = "Фамилия"/>
            </div>
            <div>
             <label htmlFor="name">Имя</label>
              <input 
              className = "listOfForminputs" 
              id="name"
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder = "Имя"/>
            </div>
            <div>
             <label htmlFor="patronymic">Отчество</label>
              <input 
              className = "listOfForminputs" 
              id = "patronymic"
              type="text" 
              name="patronymic" 
              value={formData.patronymic} 
              onChange={handleChange} 
              placeholder = "Отчество" />
            </div>
            <div>
             <label htmlFor="address">Адрес</label>
              <input 
              className = "listOfForminputs" 
              id = "address"
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder = "Адрес" />
            </div>
            <div>
             <label htmlFor="amount">Сумма</label>
              <input 
              className = "listOfForminputs"
              id = "amount"
              type="text" 
              name="amount" 
              value={formData.amount} 
              onChange={handleChange} 
              placeholder = "Сумма" />
            </div>
            <div>
             <label htmlFor="telephone">Телефон</label>
              <input 
              className = "listOfForminputs" 
              id = "telephone"
              type="text" 
              name="telephone" 
              value={formData.telephone} 
              onChange={handleChange} 
              placeholder = "Телефон" />
            </div>
            <div>
             <label htmlFor="comment">Комментарий</label>
              <input 
              className = "listOfForminputs" 
              id = "comment"
              type="text" 
              name="comment" 
              value={formData.comment} 
              onChange={handleChange} 
              placeholder = "Комментарий" />
            </div>
            <div>
             <label htmlFor="photo">Фото</label>
              <input 
              className="listOfForminputs"
              id = "photo"
              type="file" 
              name="photo" 
              accept="image/*" 
              onChange={handleFileChange} />
            </div>
            <datalist id='rights'>
              <option value="MANAGER"/>
              <option value="EMPLOYEE"/>
              <option value="ADMIN"/>
            </datalist>
            </div>
            <button className ={bstyleTog} type ="submit">Добавить</button>
        </form>

        
        </div>
        <div className = "info">Информация о сотрудниках</div>
        <div>
        <div className = "infoAboutClient">
          <div>Показать Строк <input className ="numberOfRows" type = "number" value={numOfRow} onChange={handleRowChange}/></div>
          <div className = "dsub_search"> <input className = "sub_search" placeholder = "Поиск" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleSearch}/></div> </div>
        <div className = {linestyleTog}></div>

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
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='username' value={editData.username} onChange={handleInputChange}/>) : (item.username)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='password' value={editData.password} onChange={handleInputChange}/>) : (item.password)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='accessrights' value={editData.accessrights} onChange={handleInputChange}/>) : (item.accessrights)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='surname' value={editData.surname} onChange={handleInputChange}/>) : (item.surname)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='name' value={editData.name} onChange={handleInputChange}/>) : (item.name)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='patronymic' value={editData.patronymic} onChange={handleInputChange}/>) : (item.patronymic)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='address' value={editData.address} onChange={handleInputChange}/>) : (item.address)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='amount' value={editData.amount} onChange={handleInputChange}/>) : (item.amount)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='telephone' value={editData.telephone} onChange={handleInputChange}/>) : (item.telephone)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='comment' value={editData.comment} onChange={handleInputChange}/>) : (item.comment)}</td>
              <div>
                  <div>
                      <input className ="btnGarbage" type ="button" value =" " onClick={() => handleDelete(item.id)}/>
                  </div>
                  <div>{editData && editData.id === item.id  ? (
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
    </div>
}
export default Employees;