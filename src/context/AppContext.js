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
import { createData, getAllProjects, getDataList, getDocuments, getMyProjects, getSecrets, getUserDetails, updateData, uploadFile, uploadPDF } from './Api';
import axios from 'axios';
import { users } from './users';
let return_url,cancel_url;
const mechantId = 15759218;
export const AppProvider = (props) =>{
    const [fontFamilyObj,setFontFamilyObj] = useState(null);
    const [accountInfo,setAccountInfo] = useState(null);
    const [modalState,setModalState] = useState({isVisible:false,attr:{headerText:'HEADER TEXT'}})
    const [confirmDialog,setConfirmDialog] = useState({isVisible:false,text:'Would you like to come today for a fist?',okayBtn:'VERIFY',cancelBtn:'CANCEL',isSuccess:false})
    const [currentLocation,setCurrentLocation] = useState(null);
    const [countryData,setCountryData] = useState({dialCode:'+27',name:'South Africa',flag:'https://cdn.kcak11.com/CountryFlags/countries/za.svg'})
    const [secrets,setSecrets] = useState({BASE_URL:"https://myguy-server-production.up.railway.app",OPENAI_KEY:"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",AI_DOC_PRICE:15,SIGNATURE_PRICE:50,SMS_KEY:"aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA="});
    const [clients,setClients] = useState(null);
    const [activeProfile,setActiveProfile] = useState(null);
    const [myProjects,setMyProjects] = useState(null);
    const [documentTypes,setDocumentTypes] = useState(
        [
            {type:'ID DOCUMENT',text:'A non-disclosure agreement (NDA) is a legal document that restricts access to or disclosure of confidential information shared between parties.',guideLines:null,hint:"ID DOCUMENT"},
            {type:'NON DISCLOSURE AGREEMENT',text:'A non-disclosure agreement (NDA) is a legal document that restricts access to or disclosure of confidential information shared between parties.',guideLines:null,hint:"Tell us more about your NDA, explain who is involved and what is it about"},
            {type:'BUSINESS PROPOSAL',text:'A business proposal is a document that outlines a proposed partnership or arrangement between parties, including details about the products/services being offered and the terms of the deal. It is often used to secure new clients or partnerships.',guideLines:0,hint:"What is your proposal about and who is intended to read your proposal. What are the benefits and terms and conditions? Go in details to better your results"},
            {type:'BUSINESS PLAN',text:'A business plan is a document that outlines the strategy and goals of a business, including details on operations, marketing, finance, and more. It guides the business`s activities and decision-making.',guideLines:"Executive Summary, The Business, Innovation And Viability, Market Analysis, Market Strategy, Mission And Vision, Financial Plan and The Deal",hint:"Tell the AI about your business, market strategies, goals, vision and financial plan. Feed the AI as much information as you can."},
            {type:'CONTRACT',text:'A contract is a legally binding agreement between two or more parties that establishes the terms and conditions of a relationship or exchange. It can be written or verbal, and outlines the rights and obligations of each party.',guideLines:"Offer, Acceptance, Consideration, Intention to create legal relations, Authority and capacity and Certainty",hint:"What is your contract about? Who is it intended to reach, what are the terms and conditions, Explain the offer, consideration and the acceptance"},
            {type:'GENERAL AGREEMENT',text:'A general agreement is a broad, overarching document that outlines the terms and conditions of a relationship or exchange between parties. It may not be as specific as a contract, but still establishes the terms and expectations for the parties involved.',guideLines:0,hint:"What are you agreeing about. How will this agreement be fulfilled? What are the terms and conditions"},
        ]
    );
    const [categories,setCategories] = useState([
        {type:"SMALL BUSINESS",selected:true,attr:[
            "SELECT INDUSTRY",
            "Salon",
            "Fast Food",
            "Tuck Shop",
            "Tarven"
        ]},
        {type:"STARTUP",selected:false,attr:[
            "SELECT INDUSTRY",
            "Technology",
            "Software Development",
            "Insurance",
            "Automotive",
            "Dating App",
            "Transportation",
            "Construction"
        ]}
    ]);
    const [plans,setPlans] = useState([
        {type:"STANDARD",selected:false,fee:600,documents:10,signatures:5,attr:[
            "Visibility","Access To Crowd Funders","Access To Investors",
            "+5 Bio-metric Signatures","+10 AI Document Generation",
            "No Accountant Assigned"
        ]},
        {type:"PROFESSIONAL",selected:true,fee:2250,documents:30,signatures:10,attr:[
            "100% Funding Guaranteed","Visibility","Access To Crowd Funders","Access To Investors",
            "Access Up ZAR 3 000 000.00","+10 Bio-metric Signatures","+30 AI Document Generation",
            "Accountant Is Assigned"
        ]}
    ])
    const selectedCategory = categories.filter(item => item.selected)[0];
    const [industry,setIndustry] = useState("");
    const [documents,setDocuments] = useState([])
    let customFonts = {
        'fontLight': require('..//../fonts/MontserratAlternates-Light.otf'),
        'fontBold': require('..//../fonts/MontserratAlternates-Bold.otf'),
    };
    React.useEffect(()=>{
        loadFontsAsync();
        getSecrets(secrets => secrets.length > 0 && setSecrets(secrets[0]))
        getAllProjects(projects => projects.length > 0 && setClients(projects));
        getDataList((dataList) => {
            if(dataList.length > 0){
                setCategories(dataList[0].categories);
                setDocumentTypes(dataList[0].documentTypes)
                setPlans(dataList[0].plans)
            }
        });
        //createData("dataList","123456",{documentTypes,categories,plans})
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
                if(user){
                    setAccountInfo(JSON.parse(user));
                    getUserDetails(JSON.parse(user).id,(response)=>{
                        if(response.length > 0){
                            saveUser(response[0])
                        }
                    })
                    getMyProjects(JSON.parse(user).id,(res) => {
                        if(res.length > 0){
                          setMyProjects(res);
                        }
                    })
                }
            } catch (e) {
                showToast(e);
            }
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        getUser();
    },[])
    useEffect(() => {
        if(accountInfo){
            getDocuments(accountInfo.id,(response) => {
                setDocuments(response)
            })
        }
    },[accountInfo])
    const saveUser = async user =>{
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          setAccountInfo(user);
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
    const handleFileUpload = (documentType,file,navigation,idNo) => {
        setConfirmDialog({isVisible:true,text:`You are about to upload a ${documentType} document. Press Upload to proceed`,okayBtn:'UPLOAD',cancelBtn:'Cancel',response:(res) => { 
            if(res){
                const time = Date.now();
                const documentId = documentType !== "ID DOCUMENT" ? (time + Math.floor(Math.random()*89999+10000)).toString() : idNo;
                uploadPDF(file,documentId,secrets.BASE_URL, () => {
                    const url = `/${documentId}.pdf`
                    const obj = {documentOwner:accountInfo.id,url,documentType,documentId,time,signies:[]};
                    if(createData("documents",documentId,obj)){
                        showToast("Your file has been uploaded successfully!");
                        getDocuments(accountInfo.id,(response) => setDocuments(response))
                    }
                })
            }
        }})
    }
    const handleUploadPhotos = (field,page,projectId) => {
        let location = `${field}/${accountInfo.projectId}`;
        if(field === "photos"){
            location = `${field}/${accountInfo.projectId}/${(Date.now() +  Math.floor(Math.random()*89999+10000)).toString()}`;
        }
        if(field !== "selfiePhoto"){
            setConfirmDialog({isVisible:true,text:`Would Like To Select From The Gallery Or You Would Like To Snap Using Your Camera?`,severity:false,okayBtn:'GALLERY',cancelBtn:'CAMERA',response:(res) => { 
                if(res){
                    pickImage(field,(response) => {
                        uploadFile(response,location,(url) => {
                            const photoId = (Date.now() + Math.floor(Math.random() * 899 + 1000)).toString()
                            const value = field === 'photos' ? [...activeProfile.photos,{photoId,url}] : url;
                            updateProfile(field,value)
                            showToast("You "+field+" Has Been Successfully added!")
                        })
                    })
                }else{
                    snapAPhoto(field,location,projectId,page)
                }
            }})
        }else{
            snapAPhoto(field,location,projectId,page)
        }
    }
    const snapAPhoto = (field,location,projectId,page) =>{
        takePicture(field,(response) => {
            uploadFile(response,location,(url) => {
                const photoId = (Date.now() + Math.floor(Math.random() * 899 + 1000)).toString()
                const value = field === 'photos' ? [...activeProfile.photos,{photoId,url}] : url;
                updateProfile(field,value)
                showToast("You "+field+" Has Been Successfully added!")
            })
        })
    }
    const getUserProfile = (navigation,projectId) => {
        const projectProfile = clients?.filter(client => client.projectId === projectId);
        if(projectProfile.length > 0){
            setActiveProfile(projectProfile[0]);
            navigation.navigate("Profile")
        }
    }
    const updateProfile = (field,value) => {
        setActiveProfile(prevState => ({...prevState,[field]:value}))
        updateData("projects",activeProfile.projectId,{[field]:value});
    }
    const sendSms = (phoneNo,msg) =>{
        var request = new XMLHttpRequest();
        request.open('POST', 'https://rest.clicksend.com/v3/sms/send');
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Authorization', 'Basic '+secrets.SMS_KEY);
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
    const goToWebView = (navigation,object) =>{
        if (Platform.OS == 'android') {
            return_url = encodeURIComponent('https://lifestyle.empiredigitals.org/');
            cancel_url = encodeURIComponent('https://smartstore.empiredigitals.org/');
        }else{
            return_url = 'https://lifestyle.empiredigitals.org/';
            cancel_url = 'https://smartstore.empiredigitals.org/';
        }
        let description = "";
        if(object.type === "SUBSCRIBE"){
            description = `Subscription of ${object.plan} for ZAR ${object.amount}`
        }else if(object.type === "PURCHASE"){
            description = `Purchase of signatures or AI docs generator for ZAR ${object.amount}`
        }else{
            description = `Supporting ${activeProfile.fname} with ZAR ${object.amount}`
        }
        const baseUrl = "https://www.payfast.co.za/eng/process?cmd=_paynow&receiver="+mechantId+"&item_name="+object.type+"&item_description="+description+"&amount="+object.amount+"&return_url="+return_url+"&cancel_url="+cancel_url+""
        navigation.navigate("WebBrowser",{object,baseUrl});
    }
    const loadAIDocs = (navigation) =>{
        const AI_DOC_PRICE = secrets.AI_DOC_PRICE;
        setConfirmDialog({isVisible:true,text:`Purchase more AI document generator tokens.\nBuy more to get more discount\nAI Document generator tokens allows you to generate documents within 60 seconds`,okayBtn:'PURCHASE',severity:true,cancelBtn:'Cancel',response:(res) => { 
            if(res){
                setModalState({isVisible:true,attr:{headerText:'AI DOCUMENT GENERATION',field:'AI_DOC',isNumeric:true,hint:`Each AI document generator token cost ZAR ${parseFloat(AI_DOC_PRICE).toFixed(2)}.\nWe advice you to purchase more than one token to avoid frequent purchases!\n1. 1-49 tokens = -0%\n2. 50-99 tokens = -7%\n3. 100-749 = -15%\n4. +750 tokens = 25%`,placeholder:'Enter Quantity...',handleChange:(field,quantity) => {
                    if(quantity > 0){
                        let amount = quantity * secrets.AI_DOC_PRICE;
                        if(quantity > 49 && quantity < 100){
                            amount = amount - (7 / 100) * amount;
                        }else if(quantity > 99 && quantity < 749){
                            amount = amount - (15 / 100) * amount;
                        }else if(quantity > 749){
                            amount = amount - (25 / 100) * amount;
                        }
                        const object = {type:"PURCHASE",plan:accountInfo.plan,amount,documents:parseFloat(quantity) + parseFloat(accountInfo.documents),signatures:parseFloat(accountInfo.signatures),projectId:null}
                        goToWebView(navigation,object);
                    }else{
                        showToast("Value can not be 0")
                    }
                }}})
            }
        }})
    }
    const loadSignatures = (navigation) =>{
        const SIGNATURE_PRICE = secrets.SIGNATURE_PRICE;
        setConfirmDialog({isVisible:true,text:`Purchase more AI document generator tokens.\nBuy more to get more discount\nAI Document generator tokens allows you to generate documents within 60 seconds`,okayBtn:'PURCHASE',severity:true,cancelBtn:'Cancel',response:(res) => { 
            if(res){
                setModalState({isVisible:true,attr:{headerText:'BIO-METRIC SIGNATURE',field:'AI_DOC',isNumeric:true,hint:`Each bio-metric signature cost ZAR ${parseFloat(SIGNATURE_PRICE).toFixed(2)}.\nWe advice you to purchase more than one token to avoid frequent purchases!\n1. 1-49 signatures = -0%\n2. 50-99 signatures = -7%\n3. 100-749 = -15%\n4. +750 signatures = 25%`,placeholder:'Enter Quantity...',handleChange:(field,quantity) => {
                    if(quantity > 0){
                        let amount = quantity * secrets.SIGNATURE_PRICE;
                        if(quantity > 49 && quantity < 100){
                            amount = amount - (7 / 100) * amount;
                        }else if(quantity > 99 && quantity < 749){
                            amount = amount - (15 / 100) * amount;
                        }else if(quantity > 749){
                            amount = amount - (25 / 100) * amount;
                        }
                        const object = {type:"PURCHASE",plan:accountInfo.plan,amount,documents:parseFloat(accountInfo.documents),signatures:parseFloat(quantity) + parseFloat(accountInfo.signatures),projectId:null}
                        goToWebView(navigation,object);
                    }else{
                        showToast("Value can not be 0")
                    }
                }}})
            }
        }})
    }
    const appState = {
        accountInfo,plans,myProjects,setPlans,goToWebView,loadAIDocs,loadSignatures,secrets,categories,selectedCategory,industry,setIndustry,setCategories,updateProfile,handleUploadPhotos,handleFileUpload,clients,setClients,getUserProfile,activeProfile,setActiveProfile,documentTypes,setDocumentTypes,documents,setDocuments,pickCurrentLocation,nativeLink,setAccountInfo,saveUser,logout,fontFamilyObj,setModalState,setConfirmDialog,getLocation,sendPushNotification,showToast,takePicture,pickImage,sendSms,phoneNoValidation,countryData,setCountryData
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
    const latitude = -26.2163;
    const longitude = 28.0369;
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
    }else if(type === 'url'){
        Linking.openURL(obj.url)
        
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