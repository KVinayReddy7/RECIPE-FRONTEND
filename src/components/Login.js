import React, { useEffect, useState} from "react";
// import "./style.css";
import axios from "axios";
import { useNavigate} from "react-router-dom";

function LogIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  function clickSignUp(){
    navigate("/signup");
  }
  useEffect(()=>{
    if (localStorage.getItem("user-info")) {
      navigate("/");
    }
  });
  let handleSubmit = (event) => {
    const obj = { "email":email, "password": password };
    // console.log("details", obj)
    const url = "http://localhost:5500/users/login";
    axios
      .post(url, obj)
      .then((res) => {
        if(res.status===200){
          alert("Login Successfully");
          // console.log("res:",res.data.message);
          localStorage.setItem("user-info", JSON.stringify(res));
          navigate("/");
        }else{
          alert(res.data.message)
        }
      })
      .catch((err) => {
        alert(err);
        // console.log("Error",err);
      });
    event.preventDefault();
  };
 
  return (
    <div>
      <div className="container">
    <div className="row justify-content-center mt-5">
      <div className="col-lg-4 col-md-6 col-sm-6">
        <div className="card shadow">
          <div className="card-title text-center border-bottom">
            <h2 className="p-3 textColor">Login</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label for="username" className="form-label textColor">Username/Email</label>
                <input type="email" className="form-control" id="email"placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label for="password" className="form-label textColor">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Enter password" 
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                onChange={(e) => setPassword(e.target.value)} required />
              </div>
              {/* <div className="mb-4">
                <input type="checkbox" className="form-check-input" id="remember" />
                <label for="remember" className="form-label">Remember Me</label>
              </div> */}
              <div className="d-grid rounded">
                <button type="submit" className="btn main-bg borderColor" id="submit">Login</button>
              </div>
              <div className="d-grid rounded">
                <button className="btn borderColor mt-3" onClick={clickSignUp}>SignUp</button>
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
export default LogIn;
