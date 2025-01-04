import firebase from 'firebase';

const firebaseConfig = {
    databaseURL: 'https://myportfolio-c4722-default-rtdb.firebaseio.com/',
  };

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

export default database;
