
import './App.css';
import { LoginPage } from './login_page/login-page.js';
import {DashBoard} from "./account_page/account_page.js"
import { MainClassPage } from './main_class_page/main_class_page';
import { SignUpPage } from './login_page/signup-page';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
function App() {
  return (
   <Router>
      <div className="App">
   <LoginPage/>
    </div>
   </Router>
  );
}

export default App;
