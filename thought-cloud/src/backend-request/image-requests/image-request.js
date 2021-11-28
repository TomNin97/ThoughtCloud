import axios from "axios";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
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

const baseUrl = "http://localhost:5000";

///todo: duplicate code;
const jsonHeader = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

const firebaseApp = initializeApp(firebaseConfig);
function Note(posterId, uploadDate, dateTaken, format, contentLink, hidden,tags, noteTitle, hideEnd, hideStart ) {
    return {
        "posterID": posterId,
        "uploadDT": uploadDate,
        "dateTaken": dateTaken,
        "format": format,
        "contentLink": contentLink,
        "hidden": hidden,
        "hideEnd": hideEnd,
        "hideStart": hideStart,
        "noteTags" : tags,
        "noteTitle" : noteTitle
    }
}

export default class ImageRequests {
    constructor(course) {
        // Create a root reference
        this.storage = getStorage(firebaseApp);
        this.course = course;
        this.sessionItems = new SessionItems();
    }

    async uploadFile(fileName, file, dateTaken, noteTitle, tags) {
        //create Note object

        //Create a reference to 'mountains.jpg'
        const timeStampedName = `${Date.now()}${fileName}`;
        const name = `${this.course.departmentID}${this.course.courseID}${this.course.courseSection}/${timeStampedName}`;
        const newNoteRef = ref(this.storage, name);

        await uploadBytes(newNoteRef, file).then(async (snapshot) => {
            console.log('Uploaded a blob or file!', snapshot);
            //send request to backend with filename and course info
            const newNote = Note(this.sessionItems.getItem("ID"), this.generateCurrentDate(), this.generateCurrentDate(), fileName.substring(fileName.lastIndexOf('.'), fileName.length), timeStampedName, 0,tags, noteTitle)

            //send request 

            await axios({
                method: "post",
                data: JSON.stringify(newNote),
                headers: jsonHeader,
                url: baseUrl + `/courses/${this.course.departmentID}-${this.course.courseID}-${this.course.courseSection}/notes`,
            }).then(response => {
                if (response.status == 200) {
                    const data = response.data;
                    console.log("Data is:");
                    console.table(data);
                    if (data != null) {
                        alert("Note uploaded? : ", data);
                        return data;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    alert("Note upload error : ", response.statusText);
                }
            })
        }).catch(e => {
            console.log("Error uploading", e);
        });
    }


    generateCurrentDate(hasSeconds = false) {
        const date = new Date();

       return  date.getFullYear() + '-' + (date.getMonth() + 1 )+'-' + date.getDate() + `${hasSeconds ?  ('' + date.getHours() + ":" + date.getMinutes() + ':' + date.getSeconds()) : ''}`;

    }


    async deleteNote(note = Note()) {
        const filePath = (await this.getFileUrl(note.contentLink));
        if (filePath != null) {
            const noteRef = ref(this.storage, filePath);
            await deleteObject(noteRef);

            //delete from database
              await   axios({
                    method : "delete",
                    data : JSON.stringify({"fileName" : note.contentLink, "tableName" : "notes"}),
                    url : baseUrl + `/courses/${this.course.departmentID}-${this.course.courseID}-${this.course.courseSection}/notes`,
                    headers : jsonHeader
                }).then(response => {
                    if (response.status == 200) {
                        const data = response.data;
                        console.log("Data is:");
                        console.table(data);
                            alert("Note deleted ");
                    }
                    else {
                        alert("Note delete error : ", response.statusText);
                    }
                })
        }
    }

    async getFileUrl(name) {
        if (name != null && name != "") {
            const fileStringRef =this.course.departmentID + this.course.courseID + this.course.courseSection + "/" +name;
          console.log("String ref: ", `${fileStringRef}`);
            return await getDownloadURL(ref(this.storage,`${fileStringRef}`));
        }

        throw "EmptyFileRefrence"
    }


    async getCourseNotes() {

        return await axios ({
            method : "get",
            headers : jsonHeader,
            url : baseUrl + `/courses/${this.course.departmentID}-${this.course.courseID}-${this.course.courseSection}/notes`,
        }).then(async result =>{
            const data = result.data;
            if(data != null) {
                for( var i =0; i < data.length; i++) {
                    data[i].contentLink =  await this.getFileUrl(data[i].contentLink)
                }
                
                 return data;
            }

            return [];
        })
    }


}




// // While the file names are the same, the references point to different files
// mountainsRef.name === mountainImagesRef.name;           // true
// mountainsRef.fullPath === mountainImagesRef.fullPath;   // false 
