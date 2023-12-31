import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { AdminContext } from '../../App.js'

const Home = () => {
  const { state, dispatch } = useContext(AdminContext);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const CheckTokenValid = async () => {
    const token = sessionStorage.getItem('AdminToken');
    const res = await fetch('https://testapp-sz38.onrender.com/checkAdminTokenValid', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token
      })
    });
    if (res.status === 200) {
      const data = await res.json();
      const { decoded } = data;
      dispatch({ type: "ADMIN", payload: true });
    }
    else if (res.status === 401) {
      navigate('/');
    }
  }
  useEffect(() => {
    CheckTokenValid();
  }, []);

  //modal 
  const [modalState, setModalState] = useState("close");
  const handleShowModalOne = () => {
    setModalState("modal-one")
  }
  const handleShowModalTwo = () => {
    setModalState("modal-two")
  }
  const handleClose = () => {
    setModalState("close");
  }
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');



  

  const getData = async () => {
    try {
      const res = await fetch('https://testapp-sz38.onrender.com/getInstructors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      setData(data);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  useEffect(() => {
    
    getData();
  }, []);

  const handleSubmit = async () => {

    if (!name || !password || !cpassword) {
      window.alert('Please enter all fields');
    }
    else {
      if (password === cpassword) {
        try {
          const res = await fetch('https://testapp-sz38.onrender.com/addInstructor', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              name, password
            })
          });
          if (res.status === 200) {
            window.alert('Instructor Added Successfully');
            getData();
            setModalState("close");
          } else {
            window.alert('Internal server error');
          }
        } catch (error) {
          console.log(error);
        }


      } else {
        window.alert('Password and Confirm Password do not match');
      }
    }
  }
 

  const [data2, setData2] = useState();
  const getFormData = async () => {
    try {
      const res = await fetch('https://testapp-sz38.onrender.com/getCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setData2(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  const handleSubmit2 = async () => {
    try {
      const res = await fetch('https://testapp-sz38.onrender.com/assignLecture', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          iname, selectedCourse, selectedLecture, selectedDate
        })
      });
      if (res.status === 200) {
        window.alert('Lecture Assigned to User Successfully');
        getData();
        setModalState("close");
      }else if(res.status === 400){
        window.alert('Date already assigned for the Instructor, try another date');
      }
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    getFormData();
  }, []);

  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLecture, setSelectedLecture] = useState('');
  const [lectures, setLectures] = useState([]);
  const handleSelectChange = (event) => {
    const selectedOptionValue = event.target.value;
    //console.log(selectedOptionValue);
    setSelectedLecture(selectedOptionValue);

  };

  const handleCourseChange = (event) => {
    const courseName = event.target.value;
    //console.log(courseName);
    setSelectedCourse(courseName);

    // Filter lectures based on the selected course
    const filteredLectures = data2.find(course => course.name.name === courseName)?.lectures || [];
    setLectures(filteredLectures);
  };

  const [iname, setIname] = useState('');


  async function handleEdit(name) {
    setIname(name);
    handleShowModalTwo();
  }

  const [selectedDate, setSelectedDate] = useState('');

  const currentDate = new Date().toISOString().split('T')[0];

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log(event.target.value);
  };

  

  return (
    <div className='home_container'>
      <div className="home_top">
        <span>Instructors </span>  <Button variant="primary" onClick={handleShowModalOne}>Add</Button>
      </div>
      <Modal
        show={modalState === "modal-one"} onHide={handleClose}
        backdrop="static"

      >
        <Modal.Header closeButton>
          <Modal.Title>Add Instructors</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" name="name" id="name" placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} /><br />
          <input type="password" name="password" id="password" placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} /><br />
          <input type="password" name="cpassword" id="cpassword" placeholder='Confirm password' value={cpassword} onChange={(e) => setCpassword(e.target.value)} /><br />

          <div className="btns">
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSubmit}>Submit</Button>
          </div>


        </Modal.Body>
      </Modal>
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
                <th>Assign Lecture</th>
              </tr>
            </thead>

            {data && data2 ? (
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
                    <td>
                      <Button onClick={() => handleEdit(item.name.name)}>Add Lecture</Button>
                      <Modal
                        show={modalState === "modal-two"} onHide={handleClose}
                        backdrop="static"
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>Assign Lecture</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <span>Add Lecture to : {iname}</span>
                          <br /><br />

                          <div className="dropdown">
                            <span>Select Course</span>
                            <select
                              value={selectedCourse}
                              onChange={handleCourseChange}
                            >
                              <option value="">Select course : </option>
                              {data2.map((course) => (
                                <option
                                  key={course.name.name}
                                  value={course.name.name}
                                >
                                  {course.name.name}
                                </option>
                              ))}
                            </select>
                            <br />

                            {selectedCourse && (
                              <>
                                <span>Select Lecture : </span>
                                <select onChange={handleSelectChange}>
                                  {data2
                                    .find((course) => course.name.name === selectedCourse)
                                    .lectures.filter((lecture) => Object.keys(lecture).length > 0)
                                    .map((lecture, index) => (
                                      <option key={index} value={lecture.lecture.lecture}>
                                        {lecture.lecture.lecture}
                                      </option>
                                    ))}
                                </select>
                              </>

                            )}

                          </div>



                          <div className="date">
                            Select Date: <input type="date" name="date" id="date" value={selectedDate} onChange={handleDateChange} min={currentDate} />
                          </div>
                          <div className="btns">
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                            <Button variant="primary" onClick={handleSubmit2}>Submit</Button>
                          </div>


                        </Modal.Body>
                      </Modal>
                    </td>


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

export default Home