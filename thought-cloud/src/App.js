
import './App.css';
import { LoginPage } from './login_page/login-page.js';
import {DashBoard} from "./account_page/account_page.js"
import { MainClassPage } from './main_class_page/main_class_page';
import { SignUpPage } from './login_page/signup-page';
import {Route, Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <Switch>
      <Route path='/' exact> <MainClassPage/> </Route>
      <Route path='/login'> <LoginPage/> </Route>
      <Route path='/signup'> <SignUpPage/> </Route>
      </Switch>
    </div>
  );
}

export default App;
