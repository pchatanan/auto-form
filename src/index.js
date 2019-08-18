import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app'

ReactDOM.render(<App />, document.getElementById('root'));
const firebaseConfig = {
  apiKey: "AIzaSyDHCidfHCfmY7U5BlvonQwWTiwfThx1mFU",
  authDomain: "auto-form-7e141.firebaseapp.com",
  databaseURL: "https://auto-form-7e141.firebaseio.com",
  projectId: "auto-form-7e141",
  storageBucket: "auto-form-7e141.appspot.com",
  messagingSenderId: "421353948183",
  appId: "1:421353948183:web:9b4b5213c10494ef"
};
firebase.initializeApp(firebaseConfig)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
