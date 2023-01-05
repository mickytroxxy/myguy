import PropTypes from 'prop-types'
import React, { memo,useContext,useEffect,useState } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform, ActivityIndicator } from 'react-native'
import { AppContext } from '../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { createData, getTrending, uploadFile } from '../context/Api';
import moment from 'moment';
import * as DocumentPicker from 'expo-document-picker'
import { FontAwesome, AntDesign, Feather } from "@expo/vector-icons";
const AddDocument = memo(({navigation}) => {
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},setModalState,handleFileUpload,accountInfo,documentTypes,documents,setDocuments
    }} = useContext(AppContext);
    
    const [selectedDocument,setSelectedDocument] = useState(null);
    useEffect(()=>{
        //getTrending(response => setDocumentTypes(response))
    },[])
    const browseDocument = async (document) => {
        setSelectedDocument(document);
        const result = await DocumentPicker.getDocumentAsync({type:'application/pdf'})
        if (result.type === 'success') {
            handleFileUpload(document,result.uri,navigation)
        }
        
        // setConfirmDialog({isVisible:true,text:`You are about to upload a ${document} document. Press Upload to proceed`,okayBtn:'UPLOAD',cancelBtn:'Cancel',response:(res) => { 
        //     if(res){
        //         const time = Date.now();
        //         const documentId = (time + Math.floor(Math.random()*89999+10000)).toString()
        //         uploadFile("https://firebasestorage.googleapis.com/v0/b/wetowing-9fcd4.appspot.com/o/documents%2F27655205898%2Fb09c2a1e-1d65-461e-a451-35ad7778c9b5.pdf?alt=media&token=4492130a-c436-4bdc-bf45-3b38707fb11e",`documents/${documentId}`, url => {
        //             const obj = {documentOwner:accountInfo.id,url,documentType:document,documentId,time,signies:[]};
        //             if(createData("documents",documentId,obj)){
        //                 setDocuments([...documents,obj])
        //                 navigation.navigate("DocumentView",{documentType:document,documentId,url})
        //             }
        //         })
        //     }
        // }})
    }
    const checkLogin = async (item) =>{
        if(accountInfo){
            if(item === 'upload'){
                setModalState({isVisible:true,attr:{headerText:'SELECT DOCUMENT',list:docTypesArray,cb:browseDocument}});
            }else{
                navigation.navigate("GenerateDocs",{item});
            }
        }else{
            navigation.navigate("Register");
        }
    }
    const docTypesArray = [...new Set( documentTypes?.map(obj => obj.type))]
    return (
        <View>
            <ScrollView style={{marginTop:15}} showsVerticalScrollIndicator={false}>
                <TouchableOpacity  style={{borderWidth:2,borderColor:'green',borderRadius:10,flex:1,marginBottom:15}} onPress={() => checkLogin("upload")}>
                    <View style={{flexDirection:'row',flex:1,padding:10}}>
                        <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><AntDesign name='upload' color={"green"} size={36} /></View>
                        <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><Text style={{fontFamily:fontBold,fontSize:11,color:'green'}}>UPLOAD DOCUMENT</Text></View>
                    </View>
                </TouchableOpacity>
                <Animatable.View style={{marginTop:10}} animation="fadeInUpBig" duration={1000} useNativeDriver={true}> 
                    <View style={{marginBottom:15}}><Text style={{fontFamily:fontBold,fontSize:11}}>Let Our Powerful AI Generate A Professional Document For You. Simply Choose The Document Type You Want, Tell Us A Little About Your Document Then Leave The Rest To The AI</Text></View>
                    {documentTypes.map((item,i) => 
                        <TouchableOpacity onPress={() => checkLogin(item)} key={item.type + i} style={{borderWidth:1,borderColor:'#14678B',borderRadius:10,flex:1,marginBottom:15}}>
                            <View style={{flexDirection:'row',flex:1,padding:10}}>
                                <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><AntDesign name='addfile' color={"#14678B"} size={36} /></View>
                                <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><Text style={{fontFamily:fontBold,fontSize:11,color:'#14678B'}}>{item.type}</Text></View>
                            </View>
                            <View style={{padding:10,backgroundColor:'#fff',borderBottomRightRadius:10,borderBottomLeftRadius:10}}>
                                <Text style={{fontFamily:fontLight,fontSize:11}}>{item.text}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </Animatable.View>
            </ScrollView>
        </View>
    )
})

export default AddDocument