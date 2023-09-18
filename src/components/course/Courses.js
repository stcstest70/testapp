import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import './Courses.css';
import { AdminContext } from '../../App.js';
import { storage } from '../../Firebase.js';
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import axios from 'axios';


const Courses = () => {
  const { state, dispatch } = useContext(AdminContext);
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
      // console.log(decoded);
    }
    else if (res.status === 401) {
      navigate('/');
    }
  }
  useEffect(() => {
    CheckTokenValid();
  }, []);

  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

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

  const [formData, setFormData] = useState({
    name: '',
    level: '',
    description: '',
  });
  const [file, setFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // const handleFileChange = (e) => {
  //   setFile(e.target.files[0]);
  // };
  const [imgUploadMsg, setImgUploadMsg] = useState('');
  const [image, setImage] = useState('');

  // const handleImageUpload=()=>{
  //   if(imgUpload){

  //     const imageRef = ref(storage, `category/${imgUpload.name + Date.now().toString()}`);
  //     uploadBytes(imageRef, imgUpload).then(()=>{
  //       console.log('image uploaded');
  //       setImgUploadMsg("Image Uploaded");
  //       getDownloadURL(imageRef).then((url)=>setImage(url));
  //     }).catch((err)=> console.log(err));
  //   }
  //   else{
  //     setImgUploadMsg("Please select an image");
  //   }
  // }
  const [imgUpload, setImgUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleImageUpload = () => {
    if (imgUpload) {
      const imageRef = ref(storage, `Courses/${imgUpload.name}`);
      const uploadTask = uploadBytesResumable(imageRef, imgUpload);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% complete`);
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Error during upload:', error);
        },
        () => {
          console.log('Image uploaded successfully');
          setImgUploadMsg('Image Uploaded');
          setUploadProgress(100);

          // Get the download URL
          getDownloadURL(imageRef)
            .then((url) => {
              setImage(url);
            })
            .catch((err) => console.error('Error getting download URL:', err));
        }
      );
    } else {
      setImgUploadMsg('Please select an image');
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    setImgUpload(selectedFile);
  };

  const getData = async () => {
    try {
      const res = await fetch('https://testapp-sz38.onrender.com/getCourses', {
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
  
  useEffect(() => {
    const getInitialData = async () => {
      try {
        const response = await axios.get('https://testapp-sz38.onrender.com/getCourses', {
          headers: {
            "Accept": "application/json"
          }
        });
    
        const data = response.data;
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getInitialData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://testapp-sz38.onrender.com/upload', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name:formData.name,level: formData.level, description:formData.description, image:image
        })
      });

      if (response.status === 200) {
        alert('Data and image uploaded successfully');
        getData();
        setModalState("close")
      } else if (response.status === 400) {
        alert('Data already exist');
        setModalState("close");
      } else {
        console.log('Some Error while uploading data');
      }
    } catch (error) {
      console.error('Error uploading data and image', error);
    }
  };


  


  const [cname, setCname] = useState('');
  const [lecture, setLecture] = useState('');
  async function handleEdit(name) {
    setCname(name);
    handleShowModalTwo();
  }

  const handleSubmit2 = async () => {
    try {
      const res = await fetch('https://testapp-sz38.onrender.com/addLecture', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cname, lecture
        })
      });
      if (res.status === 201) {
        window.alert('Lecture added successfully');
        getData();
        setModalState("close");
      } else {
        window.alert('Internal server error');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='home_container'>
      <div className="home_top">
        <span>Courses </span>  <Button variant="primary" onClick={handleShowModalOne}>Add</Button>
      </div>
      <Modal
        show={modalState === "modal-one"} onHide={handleClose}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Courses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder='Enter Name'
          /><br />
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            placeholder='Enter Level'
          /><br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Description...'
          ></textarea><br />
          <input type="file" name="image" onChange={handleFileInputChange} />   
          <div className='uploadProgress'><Button variant="primary" onClick={handleImageUpload}>Upload Image</Button> Upload Progress: {uploadProgress.toFixed(2)}%</div>
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
                <th>Level</th>
                <th>Description</th>
                <th>Image</th>
                <th>Lectures</th>
                <th>Add Lecture</th>
              </tr>
            </thead>
            {loading ? (<tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name.name}</td>
                  <td>{item.name.level}</td>
                  <td>{item.name.description}</td>
                  <td>
                  <a href={item.name.imageUrl} rel="noreferrer" target="_blank">image url</a>
                    
                  </td>
                  <td>
                    <ul>
                      {item.lectures
                        ?.filter((lecture) => Object.keys(lecture?.lecture || {}).length > 0)
                        .map((lecture, lectureIndex) => (
                          <li key={lectureIndex}>
                            {lecture?.lecture?.lecture}
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td>
                    <Button onClick={() => handleEdit(item.name.name)}>Add Lecture</Button>
                    <Modal
                      show={modalState === "modal-two"} onHide={handleClose}
                      backdrop="static"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title>Add Lecture</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <span>Add Lecture for : {cname}</span>
                        <input
                          type="text"
                          name="cname"
                          placeholder='Enter Lecture'
                          value={lecture}
                          onChange={(e) => setLecture(e.target.value)}
                        /><br />

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
            </tbody>) : (<tbody>
              <tr>
                <td colSpan="6">Loading...</td>
              </tr>
            </tbody>)}


          </table>

        </div>
      </div>
    </div>
  )
}

export default Courses