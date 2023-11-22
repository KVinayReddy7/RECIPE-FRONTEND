import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom"

import Recipes from "./components/Recipes";
import SignUp from "./components/SignUp";
import LogIn from "./components/Login";

function App() {
  return (
    <Router>
      {/* <div className=""> */}
        <Routes>
          
          <Route path="/" element={<Recipes />} />
          <Route path="/SignUp" element= {<SignUp />} />
          <Route path="/login" element={<LogIn />}/>
        </Routes>
      {/* </div> */}
      {/* <Footer /> */}
    </Router>
  )
}

export default App;
