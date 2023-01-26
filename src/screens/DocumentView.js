import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useRef,useContext, useState, useCallback } from "react";
import { Platform,Share, View,Text, Image, TouchableOpacity, Dimensions, ActivityIndicator} from "react-native";
import {Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import { createData, getUserDetails, signPDF, updateData, uploadFile, uploadToNode } from '../context/Api';
import Pdf from 'react-native-pdf';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';  
import ViewShot from "react-native-view-shot";
const RootStack = createStackNavigator();
let object;
const { width, height } = Dimensions.get('window');
let documentPhoto = null;
const DocumentView = ({navigation,route}) => {
    const {appState:{fontFamilyObj,documents,showToast}} = useContext(AppContext);
    object = route.params;
    const {url,documentId} = object;
    const documentInfo = documents.filter(doc => doc.documentId === documentId)[0];
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ),
            headerRight: () => (
                <View>
                    <Feather.Button backgroundColor="#fff" name="user" size={28} color="#757575" onPress={()=>{
                        if(documentInfo?.signies?.length > 0){
                            navigation.navigate("Participants",{signies:documentInfo?.signies,documentType:documentInfo?.documentType})
                        }else{
                            showToast("No signees found!")
                        }
                    }}></Feather.Button>
                    <View style={{position:'absolute',right:5}}>
                        <Text style={{fontFamily:fontFamilyObj.fontBold,fontSize:13,color:'tomato'}}>{documentInfo?.signies?.length}</Text>
                    </View>
                </View>
            ), 
            title: object.documentType,
            headerTintColor: '#757575',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize:11,
                fontFamily:fontFamilyObj.fontBold
            },
        }}/>
        </RootStack.Navigator>
    )
};
const PageContent = ({navigation}) =>{
    const {appState:{showToast,pickCurrentLocation,loadSignatures,setConfirmDialog,setModalState,sendPushNotification,secrets,accountInfo,setAccountInfo,fontFamilyObj:{fontBold,fontLight},documents,setDocuments} } = useContext(AppContext);
    const {url,documentId} = object;
    const [isSigned,setIsSigned] = useState(false);
    const viewRef = useRef();
    const [loadingState,setLoadingState] = useState({isLoading:false,text:"Some text here, please wait"})
    const documentInfo = documents.filter(doc => doc.documentId === documentId)[0]
    const selfieResponse = (selfiePhoto) => {
        setLoadingState({isLoading:true,text:"Analyzing your document, please wait..."});
        if(documentInfo.documentType !== "ID DOCUMENT"){
            uploadToNode(selfiePhoto,documentId,secrets.BASE_URL,`image/png`,`documentPhoto`, (res) => {
                if(res?.data?.status === 1){
                    saveSignature(selfiePhoto,0);
                }else{
                    showToast("No face detected, please accurately position your camera ");
                    setLoadingState({isLoading:false,text:res?.data?.message});
                }
            })
        }else{
            verifySelfie(selfiePhoto);
        }
    }
    const saveSignature = (url,similarity) => {
        pickCurrentLocation((location) => {
            if(location.venueName !== 0 && location.short_name !== 0){
                const time = Date.now();
                const signatureId = (time + Math.floor(Math.random()*89999+10000)).toString();
                uploadFile(url,`signatures/${signatureId}`, selfie => {
                    const obj = {...accountInfo,selfie,documentId,signatureId,time,similarity,location};
                    if(createData("signatures",signatureId,obj)){
                        let signies = [...documentInfo.signies,{signatureId,signie:accountInfo.id}];
                        if(documentInfo.documentType === "ID DOCUMENT" && signies.length > 2){
                            signies.shift();
                        }
                        updateData("documents",documentId,{signies})
                        setDocuments(documents.map(doc => doc.documentId === documentId ? {...doc,signies} : doc))
                        setIsSigned(true);
                        setLoadingState({isLoading:false,text:''});
                        if(documentInfo.documentOwner === accountInfo.id){
                            const signatures = accountInfo.signatures - 1;
                            updateData("clients",accountInfo.id,{signatures})
                            setAccountInfo(prevState => ({...prevState,signatures}))
                        }
                        getUserDetails(documentInfo.documentOwner,(accountOwner) => {
                            if(accountOwner.length > 0){
                                if(accountOwner[0]?.notificationToken){
                                    sendPushNotification(accountOwner[0]?.notificationToken,"DOCUMENT SIGNED",`Hello ${accountOwner[0].fname}, Your ${documentInfo.documentType} has been signed by ${accountInfo.fname}`,{});
                                }
                            }
                        })
                    }
                })
            }else{
                showToast("YOUR LOCATION IS REQUIRED!")
            }
        })
    }
    const signBtn = () => {
        if(accountInfo){
            if((documentInfo?.signies?.filter(item => item.signie === accountInfo.id).length > 0) && (documentInfo.documentType !== "ID DOCUMENT")){
                showToast("You have signed this document already")
            }else{
                if((accountInfo.signatures > 0 && documentInfo.documentOwner === accountInfo.id) || (documentInfo.documentOwner !== accountInfo.id)){
                    if(documentInfo?.documentType === "ID DOCUMENT"){
                        screenshotView()
                    }
                    setConfirmDialog({isVisible:true,text:`By signing this document, you confirm that you agree with whatever written on this document is true. By continuing your selfie photo will be required to confirm.`,okayBtn:'SIGN',cancelBtn:'Cancel',severity:true,response:(res) => { 
                        if(res){
                            signPDF(documentId,secrets.BASE_URL,()=>{
                                navigation.navigate("CameraScreen",selfieResponse);
                            })
                        }
                    }});
                }else{
                    loadSignatures(navigation);
                }
            }
        }else{
            navigation.navigate("Register")
        }
    }
    const verifySelfie = useCallback((selfiePhoto) => {
        uploadToNode(documentPhoto,documentId,secrets.BASE_URL,`image/png`,`documentPhoto`, (res) => {
            if(res?.data?.status === 1){
                setLoadingState({isLoading:true,text:res?.data?.message});
                uploadToNode(selfiePhoto,documentId+'_selfiePhoto',secrets.BASE_URL,`image/png`,`selfiePhoto`, (res) => {
                    if(res?.data?.status === 1){
                        const similarity = res?.data?.similarity.toFixed(1);
                        saveSignature(selfiePhoto,similarity);
                    }else{
                        showToast(res?.data?.message);
                        setLoadingState({isLoading:false,text:res?.data?.message});
                    }
                })
            }else{
                showToast(res?.data?.message);
                setLoadingState({isLoading:false,text:res?.data?.message});
            }
        })
    }, []);
    const screenshotView = useCallback(() => {
        viewRef.current.capture().then(uri => {
            documentPhoto = uri;
        })
    }, []);
    const shareFile = async(uri) => {
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }
    const downloadFile = async (url) =>{ 
        let pathNoAtt = url.split("?")
        let pathWithCompany = pathNoAtt[0].split('/');
        let path = pathWithCompany[pathWithCompany.length-1];
        const file_name = path
        FileSystem.downloadAsync(url, FileSystem.documentDirectory + file_name).then(async ({ uri }) => {
            shareFile(uri)
        }).catch(error => {
            console.error(error);
        });
    }
    return(
        <View style={{flex:1,backgroundColor:'#fff'}}>
            {!isSigned && 
                <ViewShot style={{flex:1}} ref={viewRef}>
                    <Pdf
                        source={{ uri: url, cache: true }}
                        style={{width:width,height:height,flex:1,backgroundColor:'#fff'}}
                        enableAntialiasing={true}
                        fitWidth={true}
                    />
                    <View>
                        {loadingState.isLoading && 
                            <View style={{position:'absolute',flexDirection:'row',backgroundColor:'rgba(0, 0, 0, 0.5)',bottom:0,left:0,width:'100%',zIndex:100,padding:20,justifyContent:'center'}}>
                                <ActivityIndicator size={48} color="orange" />
                                <View style={{justifyContent:'center'}}><Text style={{fontFamily:fontBold,fontSize:11,color:'#fff'}}>{loadingState.text}</Text></View>
                            </View>
                        }
                        {!loadingState.isLoading && 
                            <View style={{position:'absolute',flexDirection:'row',backgroundColor:'rgba(0, 0, 0, 0.5)',bottom:0,left:0,width:'100%',zIndex:100,padding:20,justifyContent:'center'}}>
                                <TouchableOpacity onPress={() => signBtn()} style={{padding:10,flexDirection:'row',borderRadius:10,borderWidth:1,borderColor:'#fff',margin:5}}>
                                    <MaterialIcons name='qr-code-scanner' color={"#fff"} size={20}/>
                                    <Text style={{color:'#fff',marginTop:1,fontFamily:fontBold}}>Sign Document</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => downloadFile(url)} style={{padding:10,flexDirection:'row',borderRadius:10,borderWidth:1,borderColor:'#fff',margin:5}}>
                                    <MaterialIcons name='share' color={"#fff"} size={20}/>
                                    <Text style={{color:'#fff',marginTop:1,fontFamily:fontBold}}>Share Document</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </ViewShot>
            }
            {isSigned && 
                <View style={{justifyContent:'center',alignItems:'center',flex:1}}>
                    <FontAwesome name="check-circle" color="green" size={200}></FontAwesome>
                    <Text style={{color:'#2a2828',fontFamily:fontBold,padding:10,textAlign:'center'}}>All Done You Have Signed This Document!</Text>
                </View>
            }
        </View>
    )
};
export default DocumentView