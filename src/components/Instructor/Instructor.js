import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import '../home/home.css';


const Instructor = () => {
  
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);




  useEffect(() => {
    const getData = async () => {
      try {
        const name = sessionStorage.getItem('User');
        const res = await fetch('https://testapp-sz38.onrender.com/getInstructor', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body:JSON.stringify({name})
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
  return (
    <div className='home_container'>
      <div className="home_top">
        <span>Instructor Panel </span> 
      </div>
      
      <div className="home_bottom">
        <div className='tablecontainer table table-responsive'>
          <table className='content-table tableC'>
            <thead>
              <tr>
                
                <th>Name</th>
                <th>Course</th>
                <th>Lecture</th>
                <th>Date</th>
              </tr>
            </thead>

            {data? (
              <tbody>
              <tr>
                
                <td>{data.name.name}</td>
                <td>
                  {data.assign.map((assignment, assignmentIndex) => (
                    <div key={assignmentIndex}>{assignment.course}</div>
                  ))}
                </td>
                <td>
                  {data.assign.map((assignment, assignmentIndex) => (
                    <div key={assignmentIndex}>{assignment.lecture}</div>
                  ))}
                </td>
                <td>
                  {data.assign.map((assignment, assignmentIndex) => (
                    <div key={assignmentIndex}>{assignment.date}</div>
                  ))}
                </td>
              </tr>
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