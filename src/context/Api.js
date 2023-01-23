import { initializeApp } from "firebase/app";
import {initializeFirestore} from 'firebase/firestore';
import { getFirestore, collection, getDocs, doc, setDoc, query, where, deleteDoc, updateDoc, onSnapshot   } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import * as st from "firebase/storage";
import axios from "axios";
const firebaseConfig = {
    apiKey: "AIzaSyADeaY6ODRICSJoK4ThUXedwMrFwc2ZP40",
    authDomain: "myguy-a78d0.firebaseapp.com",
    projectId: "myguy-a78d0",
    storageBucket: "myguy-a78d0.appspot.com",
    messagingSenderId: "743810339840",
    appId: "1:743810339840:web:e9a54dd0e53c8cd61074e5"
};
const app = initializeApp(firebaseConfig);
//const db = getFirestore();
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false,
});
export const createData = async (tableName,docId,data) => {
    try {
        await setDoc(doc(db, tableName, docId), data);
        return true;
    } catch (e) {
        alert(e)
        return false;
    }
}
export const loginApi = async (phoneNumber,password,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "clients"), where("phoneNumber", "==", phoneNumber), where("password", "==", password)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getUserDetails = async (accountId,cb) => {

    try {
        const querySnapshot = await getDocs(query(collection(db, "clients"), where("id", "==", accountId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getBusinessPlan = async (cb) => {

    try {
        const querySnapshot = await getDocs(query(collection(db, "businessPlans")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getAllProjects = async (cb) => {

    try {
        const querySnapshot = await getDocs(query(collection(db, "projects"), where("isActive", "==", true)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getMyProjects = async (projectOwner,cb) => {

    try {
        const querySnapshot = await getDocs(query(collection(db, "projects"), where("projectOwner", "==", projectOwner)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getDocuments = async (documentOwner,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "documents"), where("documentOwner", "==", documentOwner)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getDataList = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "dataList")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getSignies = async (signatureId,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "signatures"), where("signatureId", "==", signatureId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getDocumentsById = async (documentId,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "documents"), where("documentId", "==", documentId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getUserDetailsByPhone = async (phoneNumber,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "clients"), where("phoneNumber", "==", phoneNumber)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getContact = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "contact")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getSecrets = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "secrets")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const updateData = async (tableName,docId,obj) => {
    try {
        const docRef = doc(db, tableName, docId);
        await updateDoc(docRef, obj);
        return true;
    } catch (e) {
        return false;
    }
}
export const uploadFile = async (file,path,cb) =>{
    const storage = st.getStorage(app);
    const fileRef = st.ref(storage, path);
    const response = await fetch(file);
    const blob = await response.blob();
    const uploadTask = await st.uploadBytesResumable(fileRef, blob);
    const url = await st.getDownloadURL(uploadTask.ref);
    cb(url)
}
export const uploadToNode = async (uri,documentId,BASE_URL,type,fileCategory,cb)=>{
    const apiUrl = BASE_URL+"/uploadPDF";
    const name = uri.substr(uri.lastIndexOf('/') + 1);
    const formData = new FormData();
    formData.append('fileUrl', {uri,name,type});
    formData.append('documentId', documentId);
    formData.append('fileCategory', fileCategory);
    try {
        const response = await axios({
            method: "post",
            url: apiUrl,
            data: formData,
            headers: {"Content-Type": "multipart/form-data"},
        });
        cb(response);
    } catch(error) {
        console.log(error)
    }
}
export const signPDF = async (documentId,BASE_URL,cb)=>{
    try {
        const res = await axios.get(`${BASE_URL}/signPDF/${documentId}`);
        cb(true)
    } catch (e) {
        cb(e);
    }
}
export const submitToGoogle = async (image,cb) => {
    try {
        let body = JSON.stringify({
          requests: [
            {
              features: [
                { type: "TEXT_DETECTION", maxResults: 5 }
              ],
              image: {
                source: {
                  imageUri: image
                }
              }
            }
          ]
        });
        let response = await fetch("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA28v9IMc3hwxU8vVtGcOMuT_s0Ickvi3k",
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            method: "POST",
            body: body
          }
        );
        let detections = await response.json();
        const foundTexts = detections.responses[0].textAnnotations;
        if(foundTexts){
            const expectedCode = foundTexts.filter(item => item.description.toUpperCase().slice(0,1) === 'V' && item.description.toUpperCase().slice(item.description.length - 1) === 'D')[0].description
            cb(expectedCode)
        }else{
            cb(false)
        }
      } catch (error) {
        cb(false)
        console.log(error);
      }    
}