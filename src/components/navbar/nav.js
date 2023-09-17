import React, { useState, useContext } from 'react';
import './nav.css';
import { AdminContext } from '../../App.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faBook, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { state, dispatch } = useContext(AdminContext);
  const navigate = useNavigate();
  const nav1=()=>{
    navigate('/home');
  }
  const nav2=()=>{
    navigate('/courses');
  }
  const nav3=()=>{
    sessionStorage.removeItem("AdminToken");
        sessionStorage.setItem("AdminToken", JSON.stringify([]));
        dispatch({type:"ADMIN", payload:false});
        navigate('/');
  }
  const NavLinks = ()=>{
    if(state){
      return (<div className='nav_links'><span onClick={nav1}> <FontAwesomeIcon icon={faUser} /><span>INSTRUCTORS</span> </span> <span onClick={nav2}> <FontAwesomeIcon icon={faBook} /><span>COURSES</span></span><span onClick={nav3}> <FontAwesomeIcon icon={faSignOutAlt} /><span>LOGOUT</span></span>  </div>)
    }else{
      return (<div className='nav_links'><span onClick={nav3}>Login</span></div>);
    }
  }
  return (
    <div className='nav_container'>
        <div className='nav_logo'>
            <img src="./images/logo.jpeg" alt="logo" />
        </div>
        <NavLinks />
    </div>
  )
}

export default Navbar