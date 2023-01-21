import React, { memo,useContext,useEffect,useState } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform, ActivityIndicator } from 'react-native'
import * as Animatable from 'react-native-animatable';
import * as DocumentPicker from 'expo-document-picker'
import { AntDesign } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import Banner from '../components/Banner';
import BackBtn from '../components/BackBtn';
import { getDocumentsById, getUserDetails } from '../context/Api';
const AddDocument = memo(({navigation}) => {
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},setModalState,loadAIDocs,showToast,sendPushNotification,handleFileUpload,accountInfo,documentTypes,setConfirmDialog
    }} = useContext(AppContext);
    
    const [selectedDocument,setSelectedDocument] = useState(null);
    const browseDocument = async (document) => {
        setSelectedDocument(document);
        const result = await DocumentPicker.getDocumentAsync({type:'application/pdf'})
        if (result.type === 'success') {
            if(document === "ID DOCUMENT"){
                setModalState({isVisible:true,attr:{headerText:'ID | PASSPORT NUMBER',field:'AI_DOC',hint:`Enter Your Real ID Or Passport Number associated with the document you are about to upload!`,placeholder:'Enter ID Number Or Passport Number...',handleChange:(field,idNo) => {
                    if(idNo.length > 6){
                        getDocumentsById(idNo.toString().toUpperCase(),(response) => {
                            if(response.length === 0){
                                handleFileUpload(document,result.uri,navigation,idNo.toString().toUpperCase());
                            }else{
                                const {documentOwner} = response[0];
                                getUserDetails(documentOwner,(accountOwner) => {
                                    if(accountOwner.length > 0){
                                        if(accountOwner[0]?.notificationToken){
                                            sendPushNotification(accountOwner[0]?.notificationToken,"SUSPICIOUS ACTIVITY ON YOUR ID",`Hello ${accountOwner[0].fname}, Someone just tried to use your ID on our platform. If its you please contact us to resolve this!`,{});
                                        }
                                    }
                                })
                                showToast("The entered ID number is taken. For any query please contact us");
                            }
                        })
                    }else{
                        showToast("Invalid ID | Passport Number")
                    }
                }}})
            }else{
                handleFileUpload(document,result.uri,navigation);
            }
        }
    }
    const checkLogin = async (item) =>{
        if(accountInfo){
            if(item === 'upload'){
                setModalState({isVisible:true,attr:{headerText:'SELECT DOCUMENT',list:docTypesArray,cb:browseDocument}});
            }else{
                if(accountInfo.documents > 0 )
                    navigation.navigate("GenerateDocs",{item});
                else
                    loadAIDocs(navigation)
            }
        }else{
            navigation.navigate("Register");
        }
    }
    const docTypesArray = [...new Set(documentTypes?.map(obj => obj.type))]
    return (
        <View style={{paddingLeft:10,paddingRight:10,paddingBottom:30}}>
            <BackBtn navigation={navigation} />
            
            <ScrollView style={{marginTop:15}} showsVerticalScrollIndicator={false}>
                <TouchableOpacity  style={{borderWidth:2,borderColor:'green',borderRadius:10,flex:1,marginBottom:15}} onPress={() => checkLogin("upload")}>
                    <View style={{flexDirection:'row',flex:1,padding:10}}>
                        <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><AntDesign name='upload' color={"green"} size={36} /></View>
                        <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><Text style={{fontFamily:fontBold,fontSize:11,color:'green'}}>UPLOAD DOCUMENT</Text></View>
                    </View>
                </TouchableOpacity>
                <Animatable.View style={{marginTop:10,paddingBottom:100}} animation="fadeInUpBig" duration={1000} useNativeDriver={true}> 
                    <View style={{marginBottom:15}}><Text style={{fontFamily:fontBold,fontSize:11}}>Let Our Powerful AI Generate A Professional Document For You. Simply Choose The Document Type You Want, Tell Us A Little About Your Document Then Leave The Rest To The AI</Text></View>
                    {documentTypes.map((item,i) => 
                        {
                            if(item.type !== "ID DOCUMENT"){
                                return(
                                    <TouchableOpacity onPress={() => checkLogin(item)} key={item.type + i} style={{borderWidth:1,borderColor:'#14678B',borderRadius:10,flex:1,marginBottom:15}}>
                                        <View style={{flexDirection:'row',flex:1,padding:10}}>
                                            <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><AntDesign name='addfile' color={"#14678B"} size={36} /></View>
                                            <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><Text style={{fontFamily:fontBold,fontSize:11,color:'#14678B'}}>{item.type}</Text></View>
                                        </View>
                                        <View style={{padding:10,backgroundColor:'#fff',borderBottomRightRadius:10,borderBottomLeftRadius:10}}>
                                            <Text style={{fontFamily:fontLight,fontSize:11}}>{item.text}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }
                        }
                    )}
                </Animatable.View>
                <Banner navigation={navigation}/>
            </ScrollView>
        </View>
    )
})

export default AddDocument