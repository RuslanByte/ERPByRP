import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Verification.css';

function Verification(){

    const [username, setUsername] = useState('');

    const [password, setPassword] = useState('');
    
    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();
        
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        
        if (response.ok) {
            
        
            const data = await response.json();
            console.log(data);
            
            localStorage.setItem('token', data.token);
            
            localStorage.setItem('role', data.accessrights);

            localStorage.setItem('name', data.name);

            
            if(data && data.accessrights.includes('EMPLOYEE')){
                    navigate('/map');
            }
    
            if (data && (data.accessrights.includes('ADMIN') || data.accessrights.includes('MANAGER'))) {
    
                navigate('/home');
            }

    } else {
        
        console.error('Ошибка входа');
        alert('Не правильный логин и пароль');
        
    }
        
};


    
    return(
        <>
        <form  className='inputData' onSubmit={handleLogin}>
            <div>Вход в ERP систему</div>
            <input className='inputDataLogin' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Имя пользователя" required/>
            <input className='inputDataPass' type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required/>
            <button className='inputDataButton' type="submit">Войти</button>
        </form>
        </>
    )
}

export default Verification