// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import * as admin from 'firebase-admin';
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();

const refreshToken = 'https://oauth2.googleapis.com/token';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

//const app = admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyCQVnOC8HA-4n6FPSmx9leifMsy-XYDQ4Q",
    authDomain: "bolsaempleo-3b4a2.firebaseapp.com",
    projectId: "bolsaempleo-3b4a2",
    storageBucket: "bolsaempleo-3b4a2.appspot.com",
    messagingSenderId: "968911268195",
    appId: "1:968911268195:web:4c6b8a854dec40e7bccb56",
    measurementId: "G-6X9SYWKH9E"
  };
  
  // Initialize Firebase
  //firebase.initializeApp(firebaseConfig);

  export class FireBase{

    public async createBucket() {
        // Creates the new bucket
        await storage.createBucket("bolsa");
        console.log(`Bucket ${"bolsa"} created.`);
    }

    public async uploadToFireBase(base64Image:string):Promise<any>{
       /*
        app.storage.child
        //var storageRef = storage.ref();
        var metadata = {
            contentType: 'image/jpeg',
          };

        var buff =  Buffer.from(base64Image);

        var uploadTask = await storage.child('mountains.jpg').put(buff, metadata);

        console.log("uploadedData "+uploadTask);


        return uploadTask;
    */
    } 



  }



