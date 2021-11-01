
import './App.css';
import { LoginPage } from './login_page/login-page.js';
import {DashBoard} from "./account_page/account_page.js"
import { MainClassPage } from './main_class_page/main_class_page';
import { SignUpPage } from './login_page/signup-page';

import { NotesPage } from './notes_page/notes_page.js';
import {Route, Switch} from 'react-router-dom';

function App() {
  return (
    <div className="App">
     <Switch>
      <Route exact path='/'> <LoginPage/> </Route>
      <Route exact path='/login'> <LoginPage/> </Route>
      <Route exact path='/dashboard'> <DashBoard/> </Route>
      <Route exact path='/signup'> <SignUpPage/> </Route>
      <Route path='/course-center' exact> <MainClassPage/> </Route>
      </Switch>
    </div>
  );
}

export default App;
