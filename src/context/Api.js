import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, where, deleteDoc, updateDoc, onSnapshot   } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import * as st from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyADeaY6ODRICSJoK4ThUXedwMrFwc2ZP40",
    authDomain: "myguy-a78d0.firebaseapp.com",
    projectId: "myguy-a78d0",
    storageBucket: "myguy-a78d0.appspot.com",
    messagingSenderId: "743810339840",
    appId: "1:743810339840:web:e9a54dd0e53c8cd61074e5"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore();
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
export const getDocuments = async (documentOwner,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "documents"), where("documentOwner", "==", documentOwner)));
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
export const getMyProducts = async (accountId,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "purchases"), where("accountId", "==", accountId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getTrending = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "purchases")));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const verifyItem = async (itemId,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "productItems"), where("itemId", "==", itemId)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getScans = async (productOwner,cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "scans"), where("productOwner", "==", productOwner)));
        const data = querySnapshot.docs.map(doc => doc.data());
        cb(data)
    } catch (e) {
        cb(e);
    }
}
export const getProductList = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "productList")));
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
export const getCategories = async (cb) => {
    try {
        const querySnapshot = await getDocs(query(collection(db, "categories")));
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
export const uploadAsPDF = async (file,path,cb) =>{
    const storage = st.getStorage(app);
    const fileRef = st.ref(storage, path);
    const response = await fetch(file);
    const metadata = {contentType: 'application/pdf'};
    const blob = await response.blob();
    const uploadTask = await st.uploadBytesResumable(fileRef, blob,metadata);
    const url = await st.getDownloadURL(uploadTask.ref);
    cb(url)
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