import './App.css';
import 'leaflet/dist/leaflet.css';

import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { PhotoProvider } from './PhotoContext'; 
import Verification from './Verification';
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Statistics from './CompStatistics';
import Profile from './CompProfile';
import Products from './CompProducts';
import Cliants from './Cliants'
import Employees from './CompEmployees'
import Suppliers from './CompSuppliers'
import Map from './CompMap'
import Notauthorized from './Notauthorized';
import NotFound from './NotFound';

function App() {


  
  return (
    <PhotoProvider>
        <Router>
        
            <Routes>
                <Route path="/" element={<Verification />} />
                <Route path="/home" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                   <Home />
                  </PrivateRoute> 
                } />
                <Route path="/statistics" element={
                  <PrivateRoute allowedRoles={'ADMIN'}>
                    <Statistics />
                  </PrivateRoute> 
                }  />
                <Route path="/profile" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                   <Profile />
                  </PrivateRoute>
                } />
                <Route path="/products" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <Products />
                  </PrivateRoute>
                } />
                <Route path="/clients" element={
                  <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <Cliants />
                  </PrivateRoute>
                } />
                <Route path="/employees" element={
                  <PrivateRoute allowedRoles={'ADMIN'}>
                  <Employees />
                  </PrivateRoute>
                }  />
                <Route path="/suppliers" element={
                  <PrivateRoute allowedRoles={'ADMIN'}>
                  <Suppliers />
                  </PrivateRoute>
                }  />
                <Route path="/map" element={<Map />} />
                <Route path="/notauthorized" element={<Notauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          
        </Router>
      </PhotoProvider>
  );
}


export default App;
