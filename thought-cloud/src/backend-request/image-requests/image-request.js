import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Course } from "../course-request";
import { SessionItems } from "../session-items";
const fs = require('fs');

var admin = require("firebase-admin");

var serviceAccount = require("../../thought-cloud-cf6ac-ee8a591439a5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Set the configuration for your app
// TODO: Replace with your app's config object
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTepREAOWTdSS1WTKbx4rIqJgh0M9aCKk",
    authDomain: "thought-cloud-cf6ac.firebaseapp.com",
    projectId: "thought-cloud-cf6ac",
    storageBucket: "thought-cloud-cf6ac.appspot.com",
    messagingSenderId: "1065084476547",
    appId: "1:1065084476547:web:4aa79a0aa6585d00138fb6"
};

const firebaseApp = initializeApp(firebaseConfig);
function Note(posterId, uploadDate, dateTaken, format, contentLink, hidden, hideEnd, hideStart) {
  return {
        "posterId" : posterId,
        "uploadDate" : uploadDate,
        "dateTaken" : dateTaken,
        "format" : format,
        "contentLink" : contentLink,
        "hidden" : hidden,
        "hideEnd" : hideEnd,
        "hideStart" : hideStart
    }
}

export default class ImageRequests {
    constructor(course) {
        // Create a root reference
        this.storage =getStorage(firebaseApp);
        this.course = course;
        this.sessionItems = new SessionItems();
    }

    async uploadFile(fileName, file, dateTaken) {
        //create Note object
        
         //Create a reference to 'mountains.jpg'
        const timeStampedName = `${Date.now()}${fileName}`;
        const name = `${this.course.departmentID}${this.course.courseID}${this.course.courseSection}/${timeStampedName}`;
        const newNoteRef = ref(this.storage, name);

        await uploadBytes(newNoteRef, file).then((snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            //send request to backend with filename and course info
            const newNote = {...Note(this.sessionItems.getItem("userID"),this.generateCurrentDate(), dateTaken,fileName.substring(fileName.lastIndexOf('.'), fileName.length),timeStampedName,false) }

            //send request 
        }).catch(e=> {
            console.log("Error uploading", e);
        });
    }


    generateCurrentDate( hasSeconds = false) {
        const date = new Date();

       return  date.getFullYear() + '-' + (date.getMonth() + 1 )+'-' + date.getDate() + `${hasSeconds ?  ('-' + date.getSeconds()) : ''}`;

    }

    async getFileUrl(name) {
        if(name != null && name != ""){
         return  await  getDownloadURL(name);
        }

        throw "EmptyFileRefrence"
    }
}




// // While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name;           // true
// mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 
