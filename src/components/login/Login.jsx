import { useState, useEffect } from 'react';
import FondoRegistro from '../../assets/fondo.jpg';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import Formulario from './components/formulario/Formulario';
import { useNavigate } from 'react-router-dom';
import LogoRpp from '../../assets/gruporpp.png';
import './Login.css';

function Login({setUser}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          if(username === 'ccarhuamanta' && password == 'Cc4rhuam4nta2023'){
            setIsValid(true);
            localStorage.setItem('user',username);
            //sessionStorage.setItem('user', username);
            setUser([username]);
            navigate('/formulario');
          }else{
            setErrorMessage('Usuario y/o Contraseña incorrectos');
          }
          /**
          const response = await fetch('https://app.gruporpp.com.pe/GrupoRPP.RESTServices/AuthenticationService.svc/Login',{
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  "User": username,
                  "Password": password
              })
          });
          if(response == true){
             const data = await response.json();
             console.log(data)
          }else{
              console.log('Usuario y/o Contraseña incorrectos')
          }
          */
      }catch(error){
          console.log('Error:' + error);
      }
  }

  useEffect(() => {
    // Verificar si hay sesión activa al cargar el componente
    const userInSession = localStorage.getItem('user');
    // const userInSession = sessionStorage.getItem('user');
    if (userInSession) {
      setUser([userInSession]);
      navigate('/formulario');
    }
  }, [navigate, setUser]);

//   useEffect(() => {
//     if (isValid) {
//       navigate("/formulario");
//       console.log('cambiaa')
//     }
//   }, [isValid, navigate])

  return (
      <section className='container'>
          <img className='container-background' src={FondoRegistro} />
          <div className='container-form'>
              <h2 className='form-title'>Login</h2>
              <form id='login-form'>
                  <input 
                    type='text'
                    className='form-input'
                    id="username"
                    placeholder="Usuario"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />

                  <input 
                    type='password'
                    className='form-input'
                    id="password"
                    placeholder="Contraseña"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                   />

                  <button 
                    type='button'
                    onClick={(e)=>{handleSubmit(e)}} 
                    className='form-button'
                  >Ingresar</button>
                  {errorMessage && <p className="error-message error">{errorMessage}</p>}
              </form>
          </div>
          <div className="container-logo">
              <img src={LogoRpp} alt="Grupo Rpp"/>
          </div>
      </section>
  )
}

export default Login;
