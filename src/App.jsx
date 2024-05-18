import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Formulario from './components/formulario/Formulario';
import Login from './components/login/Login';
import './App.css'

function App() {
  const [user, setUser] = useState([]);

  const PrivateRoute = ({ element, ...props }) => {
    return user.length > 0 ? (
      element
    ) : (
      <Navigate to="/" replace state={{ from: props.location }} />
    );
  };

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route path="/formulario" element={<PrivateRoute element={<Formulario user={user} setUser={setUser} />} />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App

// return (
//   <div className='App'>
//     {
//       !user.length > 0 ? <Login setUser={setUser}/>
//       : <Formulario user={user} setUser={setUser}/>
//     }
//   </div>
// )