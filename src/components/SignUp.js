// src/components/Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "./style.css";
import { BASE_URL } from "../helper/helper";

function SignUp() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  function clicklogin(){
    navigate("/login");
  }
  
  const handleSignup = async (event) => {
    event.preventDefault();
    // console.log("Name:", name);
    // console.log("email:", email);
    // console.log("password: ", password)
   
      await axios.post(`${BASE_URL}/users/signup`, 
      { 
        "name":name, 
        "email": email, 
        "password":password 
      }, 
      {
        headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        }
      }).then(response=>{
        // console.log("1",response)
        alert("Registration Successful");
        // Redirect or navigate to the login page
        // For example, you can use the useHistory or useNavigate hook
        // history.push("/login");
        navigate("/login");
      
    }).catch(error => {
      alert("Registration failed");
      // console.error("Registration error:", error);
    })
  };
  return (
    <div>

<div className="container">
    <div className="row justify-content-center mt-5">
      <div className="col-lg-4 col-md-6 col-sm-6">
        <div className="card shadow">
          <div className="card-title text-center border-bottom">
            <h2 className="p-3 textColor">Sign Up</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSignup}>
            <div className="mb-4">
                <label for="name" className="form-label textColor">Name</label>
                <input type="text" className="form-control" id="name"placeholder="Enter your Name" onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label for="email" className="form-label textColor">Email</label>
                <input type="email" className="form-control" id="email"placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label for="password" className="form-label textColor">Password</label>
                <input type="password" className="form-control" id="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                 placeholder="Enter password"onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="d-grid rounded">
                <button type="submit" className="btn main-bg borderColor " id="submit">SignUp</button>
              </div>
              <div className="d-grid">
                <button className="btn mt-3 borderColor" onClick={clicklogin}>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>
  );
}

export default SignUp;
