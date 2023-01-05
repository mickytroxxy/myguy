import React,{useState,useMemo, useEffect} from 'react';
export const AppContext = React.createContext();
import AsyncStorage from "@react-native-async-storage/async-storage";
import geohash from "ngeohash";
import {Alert,ToastAndroid,Platform, Linking } from 'react-native';
import * as Font from "expo-font";
import ModalCoontroller from '../components/ModalController';
import ConfirmDialog from '../components/ConfirmDialog';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { createData, getCategories, getProductList, uploadFile } from './Api';
import axios from 'axios';
export const AppProvider = (props) =>{
    const [fontFamilyObj,setFontFamilyObj] = useState(null);
    const [accountInfo,setAccountInfo] = useState(null);
    const [modalState,setModalState] = useState({isVisible:false,attr:{headerText:'HEADER TEXT'}})
    const [confirmDialog,setConfirmDialog] = useState({isVisible:false,text:'Would you like to come today for a fist?',okayBtn:'VERIFY',cancelBtn:'CANCEL',isSuccess:false})
    const [currentLocation,setCurrentLocation] = useState(null);
    const [countryData,setCountryData] = useState({dialCode:'+27',name:'South Africa',flag:'https://cdn.kcak11.com/CountryFlags/countries/za.svg'})
    const [productCategories,setProductCategories] = useState([{category:'ANY',selected:true},{category:'SNEAKERS',selected:false},{category:'JACKETS',selected:false},{category:'BUCKET HATS',selected:false},{category:'SANDALS',selected:false},{category:'CAPS',selected:false},{category:'T-SHIRTS',selected:false},{category:'POLO NECKS',selected:false},{category:'DRESSES',selected:false},{category:'TIES',selected:false}]);
    const [productList,setProductList] = useState(null)
    const [cart,setCart] = useState([]);
    const [documentTypes,setDocumentTypes] = useState(
        [
            {type:'NON DISCLOSURE AGREEMENT',text:'A non-disclosure agreement (NDA) is a legal document that restricts access to or disclosure of confidential information shared between parties.',guideLines:[],hint:"Tell us more about your NDA, explain who is involved and what is it about"},
            {type:'CONTRACT',text:'A contract is a legally binding agreement between two or more parties that establishes the terms and conditions of a relationship or exchange. It can be written or verbal, and outlines the rights and obligations of each party.',guideLines:["Offer","Acceptance","Consideration","Intention to create legal relations","Authority and capacity","Certainty"],hint:"What is your contract about? Who is it intended to reach, what are the terms and conditions, Explain the offer, consideration and the acceptance"},
            {type:'RESUME (CV)',text:'A resume is a document that outlines your work experience, education, and skills to apply for jobs and show potential employers that you are qualified.',guideLines:["Cover Letter","Skills","Work History","School History","portfolio","Pitch"],hint:"Tell us about yourself, your ID or Passport, expected salary and current, notice period, what are your skills, work background, schools attended, do you have any portfolio if yes explain that to the AI, you can also include links. "},
            {type:'GENERAL AGREEMENT',text:'A general agreement is a broad, overarching document that outlines the terms and conditions of a relationship or exchange between parties. It may not be as specific as a contract, but still establishes the terms and expectations for the parties involved.',guideLines:[],hint:"What are you agreeing about. How will this agreement be fulfilled? What are the terms and conditions"},
            {type:'BUSINESS PROPOSAL',text:'A business proposal is a document that outlines a proposed partnership or arrangement between parties, including details about the products/services being offered and the terms of the deal. It is often used to secure new clients or partnerships.',guideLines:[],hint:"What is your proposal about and who is intended to read your proposal. What are the benefits and terms and conditions? Go in details to better your results"},
            {type:'BUSINESS PLAN',text:'A business plan is a document that outlines the strategy and goals of a business, including details on operations, marketing, finance, and more. It guides the business`s activities and decision-making.',guideLines:["Executive Summary","The Business","Innovation And Viability","Market Analysis","Market Strategy","Mission And Vision","Financial Plan","The Deal"],hint:"Tell the AI about your business, market strategies, goals, vision and financial plan. Feed the AI as much information as you can."}
        ]
    );
    const [documents,setDocuments] = useState(null)
    let customFonts = {
        'fontLight': require('..//../fonts/MontserratAlternates-Light.otf'),
        'fontBold': require('..//../fonts/MontserratAlternates-Bold.otf'),
    };
    React.useEffect( async ()=>{
        loadFontsAsync();
    },[]);
    const loadFontsAsync = async ()=> {
        await Font.loadAsync(customFonts);
        setFontFamilyObj({fontLight:'fontLight',fontBold:'fontBold'})
    }
    const getLocation = (cb)=>{
        if(currentLocation){
            cb(currentLocation);
        }else{
            getCurrentLocation((latitude,longitude,heading,hash)=>{
                setCurrentLocation({latitude,longitude,heading,hash});
                cb({latitude,longitude,heading,hash});
            })
        }
        getCurrentLocation((latitude,longitude,heading,hash) => setCurrentLocation({latitude,longitude,heading,hash}));
    }
    useEffect(()=>{
        const getUser = async() => {
            try {
                const user = await AsyncStorage.getItem("user");
                user && setAccountInfo(JSON.parse(user));
            } catch (e) {
                showToast(e);
            }
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        getUser();
    },[])
    const saveUser = async user =>{
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          setAccountInfo(user);
        } catch (e) {
          showToast(e);
        }
    }
    const checkGuestScan = async() => {
        try {
            const user = await AsyncStorage.getItem("guestScan");
            return user;
        } catch (e) {
            showToast(e);
            return null;
        }
    }
    const saveScan = async user =>{
        try {
          await AsyncStorage.setItem("guestScan", JSON.stringify(user));
        } catch (e) {
          showToast(e);
        }
    }
    const logout = async () =>{
        try {
            await AsyncStorage.removeItem("user");
            setAccountInfo(null);
        } catch (e) {
            showToast(e);
        }
    }
    const handleFileUpload = (documentType,file,navigation) => {
        setConfirmDialog({isVisible:true,text:`You are about to upload a ${documentType} document. Press Upload to proceed`,okayBtn:'UPLOAD',cancelBtn:'Cancel',response:(res) => { 
            if(res){
                const time = Date.now();
                const documentId = (time + Math.floor(Math.random()*89999+10000)).toString()
                uploadFile(file,`documents/${documentId}`, url => {
                    const obj = {documentOwner:accountInfo.id,url,documentType,documentId,time,signies:[]};
                    console.log(navigation)
                    if(createData("documents",documentId,obj)){
                        setDocuments([...documents,obj])
                        navigation.navigate("DocumentView",{documentType,documentId,url})
                        showToast("Your file has been uploaded successfully!")
                    }
                })
            }
        }})
    }
    const appState = {
        accountInfo,handleFileUpload,documentTypes,setDocumentTypes,documents,setDocuments,pickCurrentLocation,nativeLink,checkGuestScan,saveScan,setAccountInfo,saveUser,logout,fontFamilyObj,setModalState,setConfirmDialog,getLocation,sendPushNotification,showToast,takePicture,pickImage,sendSms,phoneNoValidation,productCategories,setProductCategories,productList,setProductList,cart,setCart,countryData,setCountryData
    }

    return(
        <AppContext.Provider value={{appState}}>
            {fontFamilyObj && props.children} 
            {(modalState.isVisible && fontFamilyObj ) && (<ModalCoontroller modalState={{...modalState,setModalState}}/>)}
            {(confirmDialog.isVisible  && fontFamilyObj )&& (<ConfirmDialog modalState={{...confirmDialog,setConfirmDialog}}/>)}
        </AppContext.Provider>
    )
}
const getCurrentLocation = (cb) =>{
    const latitude= -26.2163;
    const longitude=28.0369;
    if(askPermissionsAsync()){
        Location.installWebGeolocationPolyfill()
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const heading = position?.coords?.heading;
            const hash = geohash.encode(latitude, longitude);
            cb(latitude,longitude,heading,hash);
        },error => {
            showToast(error.message)
            const hash = geohash.encode(latitude, longitude);
            cb(latitude,longitude,0,hash);
        },{ 
            enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
        );
    }else{
        showToast("You did not grant us permission to get your current location");
        const hash = geohash.encode(latitude, longitude);
        cb(latitude,longitude,0,hash);
    }
}
const askPermissionsAsync = async() => {
    const { status: location } = await Permissions.askAsync(Permissions.LOCATION);
    if (location !== "granted") {
        return false;
    }else{
        return true;
    }
}
const pickCurrentLocation = (cb) =>{
    getCurrentLocation((latitude,longitude)=>{
        axios.request({method: 'post',url : "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+ longitude+"&sensor=true&key=AIzaSyB_Yfjca_o4Te7-4Lcgi7s7eTjrmer5g5Y"}).then((response) => { 
            if(response){
                const short_name = response.data.results[0].address_components.filter(item => item.types.filter(x => x === 'country')[0])[0].short_name
                const long_name = response.data.results[0].address_components.filter(item => item.types.filter(x => x === 'country')[0])[0].long_name 
                cb({latitude,longitude,venueName:response.data.results[0].formatted_address,short_name,long_name})
            }
        }).catch((e) => {
            //alert(e.response);
        });
    })
}
const showToast = (message)=>{
    if (Platform.OS == 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG); 
    }else{
        alert(message);
    }
}
const takePicture = async (type,cb) => {
    try {
        const permissionRes = await ImagePicker.requestCameraPermissionsAsync();
        const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        if(granted || permissionRes.granted){
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: type=="avatar"?[1, 1]:null,
                quality: 0.5,
            });
            if (!result.cancelled) {
                cb(result.uri)
            }
        }
    } catch (error) {
        showToast(error)
    }
}
const pickImage = async (type,cb) => {
    try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(permissionResult.granted){
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: type=="avatar"?[1, 1]:null,
                quality: 0.5,
            });
            if (!result.cancelled) {
                cb(result.uri);
            }
        }
    } catch (error) {
        showToast(error)
    }
};
const sendSms = (phoneNo,msg) =>{
    var request = new XMLHttpRequest();
    request.open('POST', 'https://rest.clicksend.com/v3/sms/send');
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', 'Basic aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA=');
    request.onreadystatechange = function (response) {
        showToast("message sent to "+phoneNo)
    };
    var body = {
        'messages': [
        {
            'source': 'javascript',
            'from': "uberFlirt",
            'body': msg,
            'to': phoneNo,
            'schedule': '',
            'custom_string': ''
        }
        ]
    };
    request.send(JSON.stringify(body));
}
const phoneNoValidation = (phone,countryCode) =>{
    countryCode = countryCode.slice(1,countryCode.length);
    let phoneNumber = phone.replace(/ /g, '');
    if ((phoneNumber.length < 16) && (phoneNumber.length > 7)) {
      if(phoneNumber[0] === "0" && phoneNumber[1] !== "0"){
        phoneNumber = phoneNumber.slice(1,phoneNumber.length)
      }else if(phoneNumber[0]!== '0'){
        phoneNumber = phoneNumber;
      }
      if(countryCode !== ""){
        if(countryCode[0] === "+"){
          countryCode = countryCode.slice(1,countryCode.length)
        }else{
          if(countryCode[0] === "0" && countryCode[1] === "0"){
            countryCode=countryCode.slice(2,countryCode.length)
          }
        }
        return countryCode+phoneNumber;
      }else{
        return false;
      }
    }else{
      return false;
    }
}
const nativeLink = (type,obj) => {
    if(type === 'map'){
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${obj.lat},${obj.lng}`;
        const label = obj.label;
        const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);
    }else if(type === 'call'){
        let phoneNumber = obj.phoneNumber;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${obj.phoneNumber}`;
        }else{
            phoneNumber = `tel:${obj.phoneNumber}`;
        }
        Linking.canOpenURL(phoneNumber).then(supported => {
            if (!supported) {
                Alert.alert('Phone number is not available');
            } else {
                return Linking.openURL(phoneNumber);
            }
        }).catch(err => console.log(err));
    }else if(type === 'email'){
        Linking.openURL(`mailto:${obj.email}`)
    }
}
const sendPushNotification = async (to,title,body,data)=> {
    if(to!=null || to!=undefined || to!=""){
        const message = {
            to: to,
            sound: 'default',
            title: title,
            body: body,
            data,
            priority: 'high',
        };
        try {
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        } catch (error) {}
    }
}
const currencyConverter = () =>{

}