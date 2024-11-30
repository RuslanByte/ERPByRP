import React, { useState, useEffect, useCallback } from 'react';

import './Profile.css'
import './Right.css';


function Profile({ handleCombinedClick, gstyleTog}){

    const token = localStorage.getItem('token');

    const [data, setData] = useState(null);

    const Photo = localStorage.getItem('photoURL');

    const name = localStorage.getItem('name');

    const fetchProfile = useCallback(async () => {
      const response = await fetch('/api/employees/getEmployee', {
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
          console.error('Ошибка при получении профиля пользователя:', response.status);
      }
    }, [token]);
    
    useEffect(() => {
        fetchProfile();

    }, [fetchProfile]);

    return (
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
        <div className='Profile'>
            Профиль
        </div>
        <div className='UserNameInfo'>
            Информация о пользователе: {data && (data.username)}
        </div>
        {data &&  (
            <div className='ProfileInfo'>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Логин:</div> <div className='ProfileInfo-1'>{data.username}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Пароль:</div> <div className='ProfileInfo-2'>{data.password}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Уровень доступа:</div> <div className='ProfileInfo-3'>{data.accessrights}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Фамилия:</div> <div className='ProfileInfo-4'>{data.surname}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Имя:</div> <div className='ProfileInfo-5'>{data.name}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Отчество:</div> <div className='ProfileInfo-6'>{data.patronymic}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Город:</div> <div className='ProfileInfo-7'>{data.address}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Зарплата:</div> <div className='ProfileInfo-8'>{data.amount}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Ном. телефона:</div> <div className='ProfileInfo-9'>{data.telephone}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Комментарий:</div> <div className='ProfileInfo-10'>{data.comment}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Время регистрации:</div> <div className='ProfileInfo-11'>{data.time}</div> </div>
                <div className='SubProfileInfo'> <div className='ProfileInfoLeft'>Уникальный хеш:</div> <div className='ProfileInfo-12'>{data.uniqueHash}</div> </div>
            </div>

          )}

        </div>
    )

};

export default Profile;