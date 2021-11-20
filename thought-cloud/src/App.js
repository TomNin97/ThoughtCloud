
import './App.css';
import { LoginPage } from './login_page/login-page.js';
import {DashBoard} from "./account_page/account_page.js"
import { MainClassPage } from './main_class_page/main_class_page';
import { SignUpPage } from './login_page/signup-page';

import { NotesPage } from './notes_page/notes_page.js';
import {Route, Switch} from 'react-router-dom';
import { AppState } from './app_state';
import { useState } from 'react';


function App(props) {
 
  console.log("Loading app again");
 
  const [appState, setappState] = useState(new AppState())
  return (
    <div className="App">
     <Switch>
      <Route exact path='/'> <LoginPage appState = {appState} onStateUpdate = {setappState}/> </Route>
      <Route exact path='/login'> <LoginPage appState = {appState} onStateUpdate = {setappState}/> </Route>
      <Route exact path='/dashboard'> <DashBoard appState = {appState} onStateUpdate = {setappState}/> </Route>
      <Route exact path='/signup'> <SignUpPage appState = {appState} onStateUpdate = {setappState}/> </Route>
      <Route path='/course-center' exact> <MainClassPage appState = {appState} onStateUpdate = {setappState} /> </Route>
      </Switch>
    </div>
  );
}

export default App;
