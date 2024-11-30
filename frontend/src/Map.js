import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { v4 as uuidv4 } from 'uuid';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css'


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function Map({HideButtonAndPanel, sidePanelHide, buttonHide, AutoBackPanel, AdressButtonHideAndSidePanelHide, adressSidePanelHide, adressButtonHide}){
  const position = [45.0448, 38.976]; 
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [markers, setMarkers] = useState([]); 
  const [selectedMarker, setSelectedMarker] = useState(null); 


  const [filteredOrders, setFilteredOrders] = useState([]); 

  const [selectedAddressOrders, setSelectedAddressOrders] = useState([]);

  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('/api/orders/filteredStatus', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
      });

      const data = await response.json();
      console.log(data);
      setOrders(data);
      
    };
    fetchOrders();
  }, [token]);



  const updateFilteredOrders = (updatedOrder) => {

    setFilteredOrders(prevOrders => 
      prevOrders.filter(order => order.id !== updatedOrder.id || (updatedOrder.status !== "выполнено" && updatedOrder.status !== "отказ"))
    );
  };




  const groupedOrders = orders.reduce((acc, order) => {
    const key = `${order.lat},${order.lon}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(order);
    return acc;
  }, {});
  

  const handleMarkerClick = (orders) => {
    setSelectedAddressOrders(orders); 
    setSelectedOrder(null); 
  };


  const handleMapClick = (event) => {

    const newMarker = {
      id:  uuidv4(),
      lat: event.latlng.lat,
      lng: event.latlng.lng,
    };
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  const handleStatus = async (selectedOrder, newStatus) => {
    if (!selectedOrder) return; 

    try {
      const response = await fetch(`/api/orders/${selectedOrder}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }), 
      });
      if (response.ok) {
        const updatedOrder = await response.json(); 
        setOrders((prevOrders) => prevOrders.map(order => 
          order.id === updatedOrder.id ? updatedOrder : order 
        ));
        updateFilteredOrders(updatedOrder); 
        setSelectedOrder(updatedOrder); 
      } else {  
        console.error('Ошибка обновления статуса');
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };




  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleCheckboxChange = (status) => {
    setSelectedStatus(prevStatus => prevStatus === status ? null : status);
  };

  const fetchOrders = async () => {
    if (selectedStatus === null) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/StatusWithOneValue?status=${selectedStatus}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data)
      } else {  
        console.error('Ошибка получения заказов со статусом');
      }
    } catch (error) {
      console.error('Ошибка сервис ответил с ошибкой:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);



  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

 {Object.entries(groupedOrders).filter(([key, orders]) => 
          orders.some(order => !["выполнено", "отказ"].includes(order.status))
        ).map(([key, orders]) => {
          const [lat, lon] = key.split(',').map(Number);
          return (
            <Marker 
              key={key} 
              position={[lat, lon]} 
              eventHandlers={{ click: () => handleMarkerClick(orders) }} 
            />
          );
        })};





        <MapClickHandler onClick={handleMapClick} />
        

        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            eventHandlers={{
              click: () => {
                setSelectedMarker(marker); 
              },
            }}
          >
            <Popup>
              Маркер {marker.id} <br /> Координаты: {marker.lat}, {marker.lng}
            </Popup>
          </Marker>
        ))}


        {selectedMarker && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'white',
            padding: '10px',
            zIndex: 1000,
            border: '1px solid #ccc',
            color: 'black',
          }}>
            <h3>Выбранный маркер</h3>
            <p>ID: {selectedMarker.id}</p>
            <p>Координаты: {selectedMarker.lat}, {selectedMarker.lng}</p>
          </div>
        )}
      </MapContainer>

      <div style={{ position: 'absolute', top: '75px', left: '0px', background: 'white', padding: '1px', zIndex: 1000, border: '1px solid #ccc', color: 'black' }}>
          Показать:
          Новые:
          <input type='checkbox' checked={selectedStatus === 'New'} onChange={() => handleCheckboxChange('New')}/>
          В работе:
          <input type='checkbox' checked={selectedStatus === 'InWork'} onChange={() => handleCheckboxChange('InWork')}/>
          Перене.
          <input type='checkbox' checked={selectedStatus === 'Transferred'} onChange={() => handleCheckboxChange('Transferred')}/>

        </div>


    <div className={adressSidePanelHide} style={{ position: 'absolute', top: '100px', left: '0px', background: 'white', padding: '1px', zIndex: 10000, border: '1px solid #ccc', color: 'black' }}>
      {selectedAddressOrders.length > 0 ? (
        <div>
          <div className={adressButtonHide} onClick={AdressButtonHideAndSidePanelHide}></div>
          <h3>Заказы по адресу</h3>
          
          <ul>
            {selectedAddressOrders.filter(order => order.status !== "выполнено" && order.status !== "отказ").map(order => (
              <li key={order.id} onClick={() => {
                setSelectedOrder(order);
                AutoBackPanel();
                }} style={{cursor: 'pointer'}}>
                Заказ ID: {order.id} - Статус: {order.status}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Выберите маркер для отображения заказов.</p>
      )}
      </div>
      
        {selectedOrder && (
        <div className={sidePanelHide}
          style={{
            position: 'absolute',
            top: '100px',
            left: '0px',
            background: 'white',
            padding: '1px',
            zIndex: 10000,
            border: '1px solid #ccc',
            color: 'black',
            userSelect: 'text',
          }}
        >
          <div className={buttonHide} onClick={HideButtonAndPanel}></div>
          <h3>Н.п: {selectedOrder.city}</h3>
          <p className='sidePanelInfoText'>ID Заказа: {selectedOrder.id}</p>
          <p className='sidePanelInfoText'>Время: {selectedOrder.addOrderTime.substring(0,16)}</p>
          <p className='sidePanelInfoText'>Статус Заказа: {selectedOrder.status}</p>
          <p className='sidePanelInfoText'>Улица: {selectedOrder.street.replace(/^\s*улица\s+/i, "")}</p>
          <p className='sidePanelInfoText'>Дом: {selectedOrder.house}</p>
          <p className='sidePanelInfoText'>Подъезд: {selectedOrder.entrance}</p>
          <p className='sidePanelInfoText'>Этаж: {selectedOrder.floor}</p>
          <p className='sidePanelInfoText'>Квартира: {selectedOrder.apartment}</p>
          <p className='sidePanelInfoText'>Вода:  {(parseInt(selectedOrder.coldcounter, 10) || 0) + (parseInt(selectedOrder.hotcounter, 10) || 0)}шт - {selectedOrder.pricecoldhotcounter} Руб.</p>
          <p className='sidePanelInfoText'>Тепло: {selectedOrder.heatmeter}шт - {selectedOrder.priceheatmeter} Руб.</p>
          <p className='sidePanelInfoText'>Сумма: {selectedOrder.amount}</p>
          <p className='sidePanelInfoText'>Форма оплаты: {selectedOrder.formofpayment}</p>
          <p className='sidePanelInfoText'>Телефон: <a className='telephone' href={`tel:${selectedOrder.telephone}`}>{selectedOrder.telephone}</a></p>
          <p className='sidePanelInfoText'  style={{width: '100%', maxWidth: '210px',}}>Комментарий: {selectedOrder.comment}</p>
          <form onSubmit={(e) => e.preventDefault()}>
              <input className='done' type='button' value='выполнено' onClick={() => handleStatus(selectedOrder.id, 'выполнено')} style={{cursor: 'pointer'}}/>
              <input className='inWork' type='button' value='в работе' onClick={() => handleStatus(selectedOrder.id, 'в работе')} style={{cursor: 'pointer'}}/>
              <input className='decline' type='button' value='отказ' onClick={() => handleStatus(selectedOrder.id, 'отказ')} style={{cursor: 'pointer'}}/>
              <br></br>
              <input className='transferred' type='button' value='перенести' onClick={() => handleStatus(selectedOrder.id, 'перенесен')} style={{cursor: 'pointer'}}/>
          </form>
        </div>
      )}



    </div>
  );
};


const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    dblclick(e) {
      onClick(e);
    },
  });
  return null;
};

export default Map;