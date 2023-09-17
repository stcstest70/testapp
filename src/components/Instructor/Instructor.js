import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../home/home.css';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { AdminContext } from '../../App.js'

const Instructor = () => {
  
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);


  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');



  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch('https://testapp-sz38.onrender.com/getInstructors', {
          method: 'GET',
          headers: {
            "Accept": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getData();
  }, []);

  const [data2, setData2] = useState();
  const getFormData = async () => {
    try {
      const res = await fetch('https://testapp-sz38.onrender.com/getCourses', {
        method: 'GET',
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      setData2(data);
    } catch (error) {
      console.log(error);
    }
  }




  useEffect(() => {
    getFormData();
  }, []);


  return (
    <div className='home_container'>
      <div className="home_top">
        <span>Instructors </span> 
      </div>
      
      <div className="home_bottom">
        <div className='tablecontainer table table-responsive'>
          <table className='content-table tableC'>
            <thead>
              <tr>
                <th>Sr.No.</th>
                <th>Name</th>
                <th>Course</th>
                <th>Lecture</th>
                <th>Date</th>
              </tr>
            </thead>

            {data2 ? (
              <tbody>
                {data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.name.name}</td>
                    <td> {item.assign.map((assignment, assignmentIndex) => (
                      <div key={assignmentIndex}>
                        {assignment.course}
                      </div>
                    ))}</td>
                    <td> {item.assign.map((assignment, assignmentIndex) => (
                      <div key={assignmentIndex}>
                        {assignment.lecture}
                      </div>
                    ))}</td>
                    <td> {item.assign.map((assignment, assignmentIndex) => (
                      <div key={assignmentIndex}>
                        {assignment.date}
                      </div>
                    ))}</td>
                    


                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              </tbody>
            )}




          </table>

        </div>
      </div>
    </div>
  )
}

export default Instructor