import { useState, useRef, useEffect } from 'react';
import FondoRegistro from '../../assets/fondo.jpg';
import Usuario from '../../assets/user-img.svg'
import FlechaIzquierda from '../../assets/flecha-izq.svg';
import FlechaAbajo from '../../assets/flecha-baj.svg';
import { useNavigate } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Select from 'react-select';
import axios from 'axios';
import './Formulario.css';

function Formulario({user, setUser}) {
    const navigate = useNavigate();

    // Comprobación de sesión al cargar el componente
    useEffect(() => {
        const userInSession = localStorage.getItem('user');
        // const userInSession = sessionStorage.getItem('user');
        if (!userInSession) {
            // Si no hay usuario en sessionStorage, redirigir al login
            navigate('/');
        }
    }, [navigate]);

    //Perfil
    const [flecha, setFlecha] = useState(FlechaIzquierda);
    const [mostrarBoton, setMostrarBoton] = useState(false);

    const handleLogout = () => { 
        setUser([]);
        localStorage.removeItem('user');
        // sessionStorage.removeItem('user');
        navigate('/');
    }
    
    const handleClick = () => {
        flecha === FlechaIzquierda ? setFlecha(FlechaAbajo) : setFlecha(FlechaIzquierda);
        setMostrarBoton(!mostrarBoton);
    }
    
    //Mensaje:
    const [isSend, SetIsSend] = useState(false);


    //Formulario
    const [token, setToken] = useState('');
    const nameRef = useRef(null);
    const [name, setName] = useState('');
    const lastNameRef = useRef(null);
    const [lastName, setLastName] = useState('');
    const cellPhoneRef = useRef(null);
    const [cellPhone, setCellPhone] = useState('');
    const companyRef = useRef(null);
    const [company, setCompany] = useState('');
    const rucRef = useRef(null);
    const [ruc, setRuc] = useState('');
    const emailRef = useRef(null);
    const [email, setEmail] = useState('');
    const [mediaRef, setMediaRef] = useState(false);
    const [media, setMedia] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const regexOnlyNumbers = /^[0-9\b]+$/;
    let response_global="Ok";
    let trama_utm;
    let timeoutId;

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleLastName = (e) => {
        setLastName(e.target.value);
    };

    const handleCompany = (e) => {
        setCompany(e.target.value);
    };

    const handleRuc = (e) => {
        if (e.target.value === '' || regexOnlyNumbers.test(e.target.value)) {
            setRuc(e.target.value);
        }
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleMessage = (e) => {
        setMessage(e.target.value);
    }

    const handleToken = (e) => {
        setToken(e.target.value);
    }

    const handleCellPhone = (e) => {
        if (e.target.value === '' || regexOnlyNumbers.test(e.target.value)) {
            setCellPhone(e.target.value);
        }
    };

    const resetForm = () =>{
        setName('');
        setLastName('');
        setCompany('');
        setRuc('');
        setCellPhone('');
        setEmail('');
        setMedia(null);
        setMediaRef(false);
        setMessage('');
        setToken('');
    }
    
    const options = [
        { value: 'Radio', label: 'Radio' },
        { value: 'TV', label: 'TV' },
        { value: 'Vía pública', label: 'Vía pública' },
        { value: 'Revista', label: 'Revista' },
        { value: 'Eventos', label: 'Eventos' },
        { value: 'Redes Sociales', label: 'Redes Sociales' },
        { value: 'Buscador de Google', label: 'Buscador de Google' },
        { value: 'Otros', label: 'Otros' },
    ];

    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: '#F2F2F2',
            borderColor: '#F2F2F2',
            fontSize: '16px',
            fontFamily: 'system-ui',
            fontWeight: '500',
            color: '#5C5C5C',
            boxShadow: '0 none',
            borderRadius: '3px',
            ':hover': {
                backgroundColor: '#FFF',
                borderColor: '#FF7300'
            },
        }),
        placeholder: (styles) => ({
            ...styles,
            color: '#5C5C5C',
            fontSize: '13px',
            fontFamily: 'system-ui',
            fontWeight: '500',
        }),
        singleValue: (styles) => ({ ...styles, color: '#5C5C5C' }),
        option: (styles) => ({
            ...styles,
            backgroundColor: '#FFF',
            borderColor: '#F2F2F2',
            fontSize: '16px',
            fontFamily: 'system-ui',
            fontWeight: '500',
            color: '#5C5C5C',
            ':hover': {
                backgroundColor: '#FF7300',
                color: '#FFF',
            },
        }),
    };

    const colourStylesFocus = {
        ...colourStyles,
        control: (styles) => ({
            ...styles,
            backgroundColor: '#FFF',
            borderColor: '#FF7300',
            fontSize: '16px',
            fontFamily: 'system-ui',
            fontWeight: '500',
            color: '#5C5C5C',
            boxShadow: '0 none',
            borderRadius: '3px',
            ':hover': {
                backgroundColor: '#FFF',
                borderColor: '#FF7300',
            },
        }),
    };

    const handleChangeMedia = (val) => {
        setMedia(val);
        setMediaRef(true);
    }

    const checkRecaptcha = () => {
        if (window && window.grecaptcha) {
            window.grecaptcha.ready(function () {
                window.grecaptcha
                    .execute('6Lddbc0kAAAAAEV4xOWz_nWjE9lwRaXBPPVPaRFr', { action: 'submit' })
                    .then(function (_token) {
                        setToken(_token);     
                    });
            });
        }
    }

    const getParamsFromURL = () => {
        const url = new URL(window.location.href);
        const params = {};
        for (const [key, val] of url.searchParams) {
            params[key] = val;
        }
        return params;
    }

    const sendUTMData = async (lead) => {

        //PROD: https://audioplayer.pe/testing/sendlead
        //DEV: https://dev.audioplayer.pe/testing/sendlead
        const url = 'https://audioplayer.pe/testing/sendlead';
        const params = getParamsFromURL();

        // console.log('Parámetros UTM de la URL:', params);
        if(params['utm_campaign']) {
            lead['cf_865'] = params['utm_campaign'];
        }
        if(params['utm_content']) {
            lead['cf_867'] = params['utm_content'];
        }

        if(params['utm_source']) {
            lead['cf_1942'] = params['utm_source'];
        }
        if(params['utm_medium']) {
            lead['cf_1944'] = params['utm_medium'];
        }

        const data = [lead];
        const json_data = JSON.stringify(data);
        trama_utm =json_data;

        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        // 'Access-Control-Allow-Headers': '*'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: json_data,
        };

        const response = await fetch(url, options); 
        if (response && response.error) {
            response_global = response.error_description; 
            console.log(response_global);
            throw new Error(response.error_description);
        }
        const responseJson = await response.json();
        //validate what responseJson be diferent to null
        if(responseJson && responseJson[0].recordId == null) {
            console.log(responseJson[0].Message);
            response_global = responseJson[0].Message;
        }
    }

    const submit = (e) => {
        e.preventDefault();

        if (!name || name.length < 3) {
            nameRef.current.focus();
            return;
        } else if (!lastName || lastName.length < 3) {
            lastNameRef.current.focus();
            return;
        } else if (!company || company.length < 3) {
            companyRef.current.focus();
            return;
        } else if (!ruc || ruc.length < 11) {
            rucRef.current.focus();
            return;
        } else if (!cellPhone || cellPhone.length < 9 || !(/^9/i.test(cellPhone))) {
            cellPhoneRef.current.focus();
            return;
        } else if (!email || email.length < 5 || !regexEmail.test(email)) {
            emailRef.current.focus();
            return;
        } else if (!media) {
            setMedia({ value: 'Radio', label: 'Radio' });
            setMediaRef(true);
            return;
        }

        setIsLoading(true);
        checkRecaptcha();
        sendUTMData({
            firstname: name,
            'cf_853': '',
            lastname: lastName,
            'cf_857': '',
            company,
            'cf_861': 'RUC',
            'cf_863': ruc,
            mobile: cellPhone,
            email,
            'phone' : '',
            'cf_1946': media.value,
            'cf_907': 'En Evaluación',
            leadsource: 'Evento Presencial Junio 2024',
            'cf_1953': message,
        });
   
        const payload = {
            '00Nf400000Smbsk': ruc,
            company,
            description: media.value + '-' + message,
            email,
            first_name: name,
            last_name: lastName,
            mobile: cellPhone,
        };

        const payload_bkup = {
                '00Nf400000Smbsk': ruc,
                company,
                description: media.value + '-' + message,
                email,
                first_name: name,
                last_name: lastName,
                mobile: cellPhone,
                result_trama: "['response':"+response_global+",{'trama':"+trama_utm+"}]",
            };
        // DEV: https://pi5yxo2ljf.execute-api.us-east-1.amazonaws.com/dev/save_trama
        // axios.post('https://z686qiwj7g.execute-api.us-east-1.amazonaws.com/prod/save_trama_leads', payload_bkup)

            axios.post('https://pi5yxo2ljf.execute-api.us-east-1.amazonaws.com/dev/save_trama', payload_bkup)
            .finally(() => {
                setIsLoading(false);
                resetForm();
                SetIsSend(true);
                timeoutId = setTimeout(() => {
                    SetIsSend(false);
                }, 5000);
            });

            if (timeoutId && isSend) {
                clearTimeout(timeoutId);
            }
        console.log('Datos Enviados');
    }

    return (
        <section className='formulario'>
            <img className='formulario-background' src={FondoRegistro} />
            <div className='formulario-header'>
                <div className='formulario-header-usuario'>
                    <img className='user' src={Usuario} onClick={handleClick}/>
                    <h3 className='formulario-header-txt'>{user}</h3>
                </div>
                <div className='container-perfil'>
                    <div className='formulario-header-perfil' onClick={handleClick}>
                        <img className='flecha' src={flecha} onClick={handleClick}/>
                        <p>Perfil</p>
                    </div>
                    <div className={`container-button ${mostrarBoton ? 'mostrar' : ''}`}>
                        <button onClick={handleLogout}>Cerrar Sesión</button>
                    </div>
                </div>
            </div>

            <div className='Contact-inner'>
                <h4 className='title'>Formulario</h4>
                <form className='Contact-inner-form'>
                    <div className='Contact-inner-controls'>
                        <div className='Contact-inner-input'>
                            <label className='label'>Nombre*</label>
                            <input
                                ref={nameRef}
                                className='input'
                                type='text'
                                minLength={3}
                                maxLength={250}
                                required
                                value={name}
                                onChange={handleName}
                            />
                        </div>
                        <div className='Contact-inner-input'>
                            <label className='label'>Apellidos*</label>
                            <input
                                ref={lastNameRef}
                                className='input'
                                type='text'
                                maxLength={250}
                                minLength={3}
                                required
                                value={lastName}
                                onChange={handleLastName}
                            />
                        </div>
                    </div>
                    <div className='Contact-inner-controls'>
                        <div className='Contact-inner-input'>
                            <label className='label'>Empresa*</label>
                            <input
                                ref={companyRef}
                                className='input'
                                type='text'
                                maxLength={250}
                                minLength={3}
                                required
                                value={company}
                                onChange={handleCompany}
                            />
                        </div>
                        <div className='Contact-inner-input'>
                            <label className='label'>RUC*</label>
                            <input
                                ref={rucRef}
                                className='input'
                                type='text'
                                minLength={11}
                                maxLength={11}
                                required
                                value={ruc}
                                onChange={handleRuc}
                            />
                        </div>
                    </div>
                    <div className='Contact-inner-controls'>
                        <div className='Contact-inner-input'>
                            <label className='label'>Celular*</label>
                            <input 
                                ref={cellPhoneRef} 
                                className='input' 
                                type='text' 
                                minLength={9} 
                                maxLength={9} 
                                value={cellPhone} 
                                onChange={handleCellPhone} 
                                required 
                            />
                        </div>
                        <div className='Contact-inner-input'>
                            <label className='label'>Email*</label>
                            <input
                                ref={emailRef} 
                                className='input'
                                type='text'
                                minLength={5}
                                maxLength={250}
                                required
                                value={email} 
                                onChange={handleEmail} 
                            />
                        </div>
                    </div>
                    <div className='Contact-inner-controls full'>
                        <label className='label'>¿Cómo te enteraste de esta página?</label>
                        <Select
                            isFocused={true}
                            placeholder={'Selecciona una opción'}
                            className='select-custom'
                            required
                            options={options}
                            styles={mediaRef ? colourStylesFocus : colourStyles}
                            value={media}
                            onChange={(val) => handleChangeMedia(val)}
                            autoFocus={mediaRef}
                            noOptionsMessage={() => 'Selecciona una opción'} 
                        />
                    </div>
                    <div className='Contact-inner-controls full'>
                        <label className='label'>Mensaje:</label>
                        <textarea
                            required
                            className='textarea'
                            maxLength={1000}
                            value={message}
                            onChange={handleMessage} 
                        ></textarea>
                    </div>
                    <input type='hidden' name='token' value={token} onChange={handleToken}  />
                    <input type='hidden' name='oid' value='00Df4000002d8By' />

                    <input
                        type='hidden'
                        name='lead_source'
                        value='Evento Presencial Junio 2024'
                    />
                    <input type='hidden' name='00Nf400000Smbsw' value='06' />
                    <input type='hidden' name='RPP_Cargo__c' value='Ninguno' />
                    <input
                        id='rpp_utm_source_c'
                        type='hidden'
                        name='rpp_utm_source_c'
                        value=''
                    />
                    <input
                        id='rpp_utm_medium_c'
                        type='hidden'
                        name='rpp_utm_medium_c'
                        value=''
                    />
                    <button disabled={isLoading} type='button' 
                            onClick={(e) => {
                                submit(e)
                            }}
                            className='button'>
                        ENVIAR
                    </button>
                    {isSend && <div className="message"><h2>LOS DATOS FUERON ENVIADOS</h2></div>}
                </form>
            </div>
            
        </section>    

  )
}


export default Formulario;
