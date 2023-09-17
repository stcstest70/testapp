import Navbar from "./components/navbar/nav.js";
import Home from "./components/home/home.js";
import Login from "./components/login/login.js";
import { Routes, Route } from "react-router-dom";
import Courses from "./components/course/Courses.js";
import { createContext, useReducer } from 'react';
import { initialState, reducer } from "./components/reducers/AdminReducer.js";
import Instructor from "./components/Instructor/Instructor.js";

export const AdminContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  if ("AdminToken" in sessionStorage) {
    //Do nothing
  } else {
    sessionStorage.setItem("UserToken", JSON.stringify([]));
  }
  if ("UserToken" in sessionStorage) {
    //Do nothing
  } else {
    sessionStorage.setItem("UserToken", JSON.stringify([]));
  }
  return (
    <div className="App">
      <AdminContext.Provider value={{state, dispatch}}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/instructor" element={<Instructor />} />
      </Routes>
      </AdminContext.Provider>
      
    </div>
  );
}

export default App;
