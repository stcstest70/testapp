import React, { useState , useContext} from 'react';
import './login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { AdminContext } from '../../App.js';


const Login = () => {

  const { state, dispatch } = useContext(AdminContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const AdminLogin = async () => {
    if (!name || !password) {
      window.alert('Enter All Fields.')
    }
    else {
      try {
        const res = await fetch('https://testapp-sz38.onrender.com/adminLogin', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name, password
          })
        });
        if(res.status === 201){
          dispatch({ type: "ADMIN", payload: true });
          window.alert('Admin Login Successful');
          const data = await res.json();
          const { token } = data;
          sessionStorage.setItem('AdminToken', token);
          navigate('/home');
        }else if(res.status === 400){
          window.alert('Invalid username or password');
        }
        else if(res.status === 500 || res.status === 400){
          window.alert('Some Error while loggin in');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const InstructorLogin = async()=>{
    if (!name || !password) {
      window.alert('Enter All Fields.')
    }
    else {
      try {
        const res = await fetch('https://testapp-sz38.onrender.com/instructorLogin', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name, password
          })
        });
        if(res.status === 201){
          // dispatch({ type: "ADMIN", payload: true });
          window.alert('Instructor Login Successful');
          const data = await res.json();
          const { user } = data;
          console.log(user);
          sessionStorage.setItem('User', user);
          navigate('/instructor');
        }else if(res.status === 400){
          window.alert('Invalid username or password');
        }
        else if(res.status === 500 || res.status === 400){
          window.alert('Some Error while loggin in');
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className='login_container'>
      <div className="login_form">
        <div className="login_header">
          <h2>LOGIN</h2>
        </div>
        <div className="login_body">
          <div className="form_ele"><FontAwesomeIcon icon={faUser} /><input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter Name' /></div>
          <div className="form_ele"> <FontAwesomeIcon icon={faLock} /><input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' /></div>
          <div className="form_btns"><button onClick={AdminLogin}>Admin Login</button>         <button onClick={InstructorLogin}>Instructor Login</button></div>
        </div>
      </div>
    </div>
  )
}

export default Login