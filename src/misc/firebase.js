import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config= {
    apiKey: "AIzaSyDdOwGnRGqP9gctuTO_Uj_rv-71YzfmGEc",
    authDomain: "chat-web-app-3c191.firebaseapp.com",
    projectId: "chat-web-app-3c191",
    storageBucket: "chat-web-app-3c191.appspot.com",
    messagingSenderId: "281739314512",
    appId: "1:281739314512:web:aa84fec9301708a6d75855"
  };


const app = firebase.initializeApp(config);
export const auth = app.auth();
export const database = app.database();