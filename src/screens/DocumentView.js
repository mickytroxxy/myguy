import { createStackNavigator } from '@react-navigation/stack';
import React, {useRef,useContext, useState } from "react";
import { StyleSheet,ScrollView, View,Text, Image, TouchableOpacity, Dimensions} from "react-native";
import {Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import { createData, updateData, uploadAsPDF, uploadFile } from '../context/Api';
import Pdf from 'react-native-pdf';
import { QRCode } from 'react-native-custom-qr-codes-expo';
import ViewShot from "react-native-view-shot";
import {captureRef} from "react-native-view-shot";
import {printToFileAsync} from 'expo-print';
import { shareAsync } from 'expo-sharing';
import { WebView } from 'react-native-webview';
const RootStack = createStackNavigator();
let object;
const { width, height } = Dimensions.get('window');
const DocumentView = ({navigation,route}) => {
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    object = route.params;
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
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
    const {appState:{showToast,setConfirmDialog,setModalState,accountInfo,fontFamilyObj:{fontBold,fontLight},documents,setDocuments} } = useContext(AppContext);
    const {url,documentId} = object;
    const [downloadedPDF,setDownloadedPDF] = useState(null)
    const viewRef = useRef();
    const documentInfo = documents.filter(doc => doc.documentId === documentId)[0]
    const selfieResponse = (url) => {
        const time = Date.now();
        const signatureId = (time + Math.floor(Math.random()*89999+10000)).toString()
        uploadFile(url,`signatures/${signatureId}`, selfie => {
            const obj = {...accountInfo,selfie,documentId,signatureId,time};
            if(createData("signatures",signatureId,obj)){
                updateData("documents",documentId,{signies:[...documentInfo.signies,{signatureId,signie:accountInfo.id}]})
                setDocuments(documents.map(doc => doc.documentId === documentId ? {...doc,signies:[...doc.signies,{signatureId,signie:accountInfo.id}]} : doc))
                showToast("All done, you have signed this document!")
            }
        })
    }
    const signBtn = () => {
        if(documentInfo?.signies?.filter(item => item.signie === accountInfo.id).length > 0){
            showToast("You have signed this document already")
        }else{
            setConfirmDialog({isVisible:true,text:`By signing this document, you confirm that you agree with whatever written on this document is true. By continuing your selfie photo will be required to confirm.`,okayBtn:'SIGN',cancelBtn:'Cancel',severity:true,response:(res) => { 
                if(res){
                    navigation.navigate("CameraScreen",selfieResponse)
                }
            }})
        }
    }
    const download = () => {
        captureRef(viewRef, {
            format: "jpg",
            quality: 1,
          }).then((QRCode) => {
            setModalState({isVisible:true,attr:{headerText:'DOWNLOAD FILE',QRCode,pdfUrl:url}})
          },(error) => console.error("Oops, snapshot failed", error)
        );
    }
    let generatePDF = async (url) => {
        const html = `
            <html>
                <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                </head>
                <body style="text-align: center;">
                    <img src=${url} style="width: 100%;" />
                </body>
            </html>
        `;
        const file = await printToFileAsync({
            html:html,base64:false
        })
        await shareAsync(file.uri)
    }
    return(
        <View style={{flex:1,backgroundColor:'#fff'}}>
            <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}}>
                <ViewShot ref={viewRef} style={{flex:1}}>
                    <Pdf
                        source={{ uri: url, cache: true }}
                        style={{width:width,height:height,flex:1,backgroundColor:'#fff'}}
                        enableAntialiasing={true}
                        fitWidth={true}
                    />
                    {/**<View style={{position:'absolute',bottom:360,right:5,backgroundColor:'#fff',padding:5,zIndex:100}}>
                    <QRCode outerEyeStyle='diamond' content={documentId} size={120}/>
                </View> */}
                </ViewShot>
            </ScrollView>
            <View style={{position:'absolute',flexDirection:'row',backgroundColor:'rgba(0, 0, 0, 0.5)',bottom:0,left:0,width:'100%',zIndex:100,padding:20,justifyContent:'center'}}>
                <TouchableOpacity onPress={() => signBtn()} style={{padding:10,flexDirection:'row',borderRadius:10,borderWidth:1,borderColor:'#fff',margin:5}}>
                    <MaterialIcons name='qr-code-scanner' color={"#fff"} size={20}/>
                    <Text style={{color:'#fff',marginTop:1,fontFamily:fontBold}}>Sign</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding:10,flexDirection:'row',borderRadius:10,borderWidth:1,borderColor:'#fff',margin:5}}>
                    <MaterialIcons name='share' color={"#fff"} size={20}/>
                    <Text style={{color:'#fff',marginTop:1,fontFamily:fontBold}}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => download()} style={{padding:10,flexDirection:'row',borderRadius:10,borderWidth:1,borderColor:'#fff',margin:5}}>
                    <MaterialIcons name='cloud-download' color={"#fff"} size={20}/>
                    <Text style={{color:'#fff',marginTop:1,fontFamily:fontBold}}>Download</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};
export default DocumentView