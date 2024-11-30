import React, { useState, useEffect, useCallback, useRef } from 'react';



import './Right.css';
import A from './icon/plus.svg';
import D from './icon/download.svg';


function Products({ handleCombinedClick, gstyleTog, bstyleTog, onClickAdd, addstyleTog, linestyleTog }){

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    count: '',
    comment: '',
  });

  const nameRef = useRef(null);

  const token = localStorage.getItem('token');

  const Photo = localStorage.getItem('photoURL');
  
  const name = localStorage.getItem('name');

  const [data, setData] = useState([]); // поправить на allData потом

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
      const response = await fetch(`/api/products/limit?numOfRow=${debouncedNumOfRow}`, {
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
        const response = await fetch(`/api/products/search?searchTerm=${encodeURIComponent(searchTerm)}`,{
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





  const handleSubmit = async (event) => {
     event.preventDefault();

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Сеть ответила с ошибкой');
      }

      const data = await response.json();
      setData((prevData) => [...prevData, data]);
      console.log('Ответ сервера:', data);
      setFormData({
        name: '',
        type: '',
        count: '',
        comment: '',
      });

      nameRef.current.focus();

    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
    }
  };

  const PdfDownload = () => {
    fetch('/api/products/pdf', {
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
        console.log(data);
        setData(data);
    } else {
        console.error('Ошибка при получении товаров:', response.status);
    }
  }, [token]);
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);





  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${encodeURIComponent(id)}`,{
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
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target; 
    setEditData({...editData, [name]: value});
  }

  const handleSave = async (editData) => {
    if(editData){
      try {
        const response = await fetch(`/api/products/${encodeURIComponent(editData.id)}/updateProduct`, {
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
                Товары
            </li>
            <li className = "rlus" onClick={onClickAdd}>
            <img src = {A} alt = "d" width = "18px" height = "18px" vspace = "2" hspace = "2" align ="left"/> Добавить новоый товар
            </li>
            <li className = "rlut" onClick={PdfDownload}>
            <img src = {D} alt = "d" width = "18px" height = "18px" vspace = "2" hspace = "2" align ="left"/> Создать отчет
            </li>
        </ul>
        <div className={addstyleTog}>
        <form onSubmit={handleSubmit}>
          <div className = "f">
            <div>
             <label htmlFor="name">Имя</label>
              <input 
              className = "listOfForminputs" 
              id = "name"
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder = "Имя" 
              ref={nameRef}/>
              </div>
            <div>
             <label htmlFor="type">Тип</label>
              <input 
              className = "listOfForminputs" 
              id='type'
              type="text" 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              placeholder = "Тип"/>
            </div>
            <div>
             <label htmlFor="type">Количество</label>
              <input 
              className = "listOfForminputs" 
              id = "count"
              type="text" 
              name="count" 
              value={formData.count} 
              onChange={handleChange} 
              placeholder = "Количество" />
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
            </div>
            <button className ={bstyleTog} type ="submit" onSubmit={handleSubmit}>Добавить</button>
        </form>

        
        </div>
        <div className = "info">Информация о товарах</div>
        <div>
        <div className = "infoAboutClient">
          <div>Показать Строк <input className ="numberOfRows" type = "number" value={numOfRow} onChange={handleRowChange}/></div> 
          <div className = "dsub_search"> <input className = "sub_search" placeholder = "Поиск" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleSearch}/></div> </div>
        <div className = {linestyleTog}></div>
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
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='name' value={editData.name} onChange={handleInputChange}/>) : (item.name)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='type' value={editData.type} onChange={handleInputChange}/>) : (item.type)}</td>
              <td>{editData && editData.id === item.id  ? ( <input className='editInput' type='text' name='count' value={editData.count} onChange={handleInputChange}/>) : (item.count)}</td>
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
export default Products;