import './Left.css';
import { useNavigate } from 'react-router-dom';
import D from './icon/dashboard.svg';
import U from './icon/profile.svg';
import B from './icon/boxes.svg';
import C from './icon/crm-computer.svg';
import E from './icon/employees.svg';
import S from './icon/suppliers.svg';
import A from './icon/location.svg';
import O from './icon/sign-out.svg';

function Left({ isRed }) {
    const gstyle = isRed ? "gnavLHid" : "gnavL";
    const userRole = localStorage.getItem('role');
    const navigate = useNavigate();

    const handleExit = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className={gstyle}>
            <p className="comName">
                <span onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
                    ERP By Ruslan Pseush
                </span>
            </p>
            <nav className="nav">
                {userRole === 'ADMIN' && (
                    <li className="navli" onClick={() => navigate('/statistics')} style={{ cursor: 'pointer' }}>
                        <img src={D} alt="d" width="16px" height="16px" /> Статистика
                    </li>
                )}
                {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                    <li className="navli" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        <img src={U} alt="d" width="16px" height="16px" /> Профиль
                    </li>
                )}
                {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                    <li className="navli" onClick={() => navigate('/products')} style={{ cursor: 'pointer' }}>
                        <img src={B} alt="d" width="16px" height="16px" /> Товары
                    </li>
                )}
                {(userRole === 'ADMIN' || userRole === 'MANAGER') && (
                    <li className="navli" onClick={() => navigate('/clients')} style={{ cursor: 'pointer' }}>
                        <img src={C} alt="d" width="16px" height="16px" /> Клиенты
                    </li>
                )}
                {userRole === 'ADMIN' && (
                    <li className="navli" onClick={() => navigate('/employees')} style={{ cursor: 'pointer' }}>
                        <img src={E} alt="d" width="16px" height="16px" /> Сотрудники
                    </li>
                )}
                {userRole === 'ADMIN' && (
                    <li className="navli" onClick={() => navigate('/suppliers')} style={{ cursor: 'pointer' }}>
                        <img src={S} alt="d" width="16px" height="16px" /> Поставщики
                    </li>
                )}
                <li className="navli" onClick={() => navigate('/map')} style={{ cursor: 'pointer' }}>
                    <img src={A} alt="d" width="18px" height="18px" /> Карта
                </li>
                <li className="navliE navliHA" onClick={handleExit}>
                    <img src={O} alt="d" width="16px" height="16px" /> Выйти
                </li>
            </nav>
        </div>
    );
}

export default Left;