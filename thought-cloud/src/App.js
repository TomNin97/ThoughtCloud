
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
     
      <Route path='/'> <LoginPage/> </Route>
      <Route path='/notes'> <NotesPage/> </Route>
      <Route path='/signup'> <SignUpPage/> </Route>
      {/* <Route path='/' exact> <MainClassPage/> </Route> */}
      </Switch>
    </div>
  );
}

export default App;
