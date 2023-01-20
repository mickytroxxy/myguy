import React, { memo, useContext, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Platform} from 'react-native'
import { AppContext } from '../../context/AppContext'
import { FontAwesome, Ionicons, FontAwesome5 , MaterialIcons, Feather} from "@expo/vector-icons";
import Stats from './components/Stats';
import Photos from './components/Photos';
import About from './components/About';
import { RequestBtns } from './components/RequestBtns';
import { updateData } from '../../context/Api';
let return_url,cancel_url;
const mechantId = 15759218;
const BodySection = memo(({attr}) => {
    const {appState:{accountInfo,updateProfile,setConfirmDialog,showToast,setModalState,setActiveProfile,fontFamilyObj:{fontBold,fontLight}}} = useContext(AppContext);
    const {navigation,profileOwner,activeProfile,page} = attr;
    const {votes,funders} = activeProfile;
    const iVoted = votes.indexOf(accountInfo?.id);
    
    const handleFunders = () => {
        if(accountInfo){
            let currentFunders = votes;
            if(votes.indexOf(accountInfo?.id) === -1){
                currentFunders = [...currentFunders,accountInfo?.id]
            }
            updateProfile("funders",currentFunders)
        }
    }
    const handleChange = (field,amount) => {
        if(amount > 99){
            if (Platform.OS == 'android') {
                return_url = encodeURIComponent('https://lifestyle.empiredigitals.org/');
                cancel_url = encodeURIComponent('https://smartstore.empiredigitals.org/');
            }else{
                return_url = 'https://lifestyle.empiredigitals.org/';
                cancel_url = 'https://smartstore.empiredigitals.org/';
            }
            const baseUrl = "https://www.payfast.co.za/eng/process?cmd=_paynow&receiver="+mechantId+"&item_name=AI Document Generation&item_description=AI document generation for ZAR "+amount+"&amount="+amount+"&return_url="+return_url+"&cancel_url="+cancel_url+""
            const object = {type:"SUPPORT",amount,projectId:activeProfile.projectId,funder:accountInfo ? accountInfo.id : "GUEST"}
            navigation.navigate("WebBrowser",{object,baseUrl});
        }else{
            showToast("Your amount should be at least ZAR 100.00")
        }
    } 
    return (
        <View style={styles.footerStyle}>
            <View style={styles.ProfileFooterHeader}>
                <View style={{alignContent:'center',alignItems:'center',marginTop:-10}}>
                    <FontAwesome name="ellipsis-h" color="#63acfa" size={36}></FontAwesome>
                </View>
                <Stats data={{activeProfile,fontBold,fontLight,profileOwner,accountInfo}} />
            </View>
            {(activeProfile.type === 'AGENTS' || activeProfile.type === 'SAFE HOUSES') && <RequestBtns data={{activeProfile,fontBold,fontLight,profileOwner,page}} />}
            <Photos data={{activeProfile,fontBold,fontLight,profileOwner,page}} />
            <About data={{activeProfile,fontBold,fontLight,profileOwner,page}} />
            <View style={{padding:5}}>
                {!profileOwner && 
                    <TouchableOpacity onPress={() => {
                        setModalState({isVisible:true,attr:{headerText:'SUPPORT THE PROJECT',field:'AI_DOC',isNumeric:true,hint:`Thank You For Supporting the ${activeProfile.fname} project, Please enter the amount you would like to support with below.`,placeholder:'Enter Amount In ZAR...',handleChange}})
                    }} style={{borderRadius:10,padding:30,backgroundColor:'green',flexDirection:'row',width:'100%'}}>
                        <FontAwesome5 name='hands-helping' size={48} color="#fff" />
                        <View style={{marginLeft:10,justifyContent:'center'}}>
                            <Text style={{fontFamily:fontBold,color:'#fff',fontSize:18}}>SUPPORT PROJECT</Text>
                        </View>
                    </TouchableOpacity>
                }
                {profileOwner && 
                    <View>
                        {activeProfile.isActive && 
                            <TouchableOpacity onPress={() => {
                                setConfirmDialog({isVisible:true,text:`If you deactivate your account, it will no longer be visible on the platform. Which means no investor can access your account. Press Deactivate to proceed`,okayBtn:'CANCEL',severity:true,cancelBtn:'DEACTIVATE',response:(res) => { 
                                    if(!res){
                                        setActiveProfile(prevState => ({...prevState,isActive:false}));
                                        updateData("projects",activeProfile.projectId,{isActive:false});
                                        showToast("Your project has been deactivated!")
                                    }
                                }})
                            }} style={{borderRadius:10,padding:30,backgroundColor:'tomato',flexDirection:'row',width:'100%'}}>
                                <FontAwesome5 name='hands-helping' size={48} color="#fff" />
                                <View style={{marginLeft:10,justifyContent:'center'}}>
                                    <Text style={{fontFamily:fontBold,color:'#fff',fontSize:18}}>DEACTIVATE PROJECT</Text>
                                </View>
                            </TouchableOpacity>
                        }
                        {!activeProfile.isActive && 
                            <TouchableOpacity onPress={() => navigation.navigate("ActivateProject",{projectId:activeProfile.projectId})} style={{borderRadius:10,padding:30,backgroundColor:'green',flexDirection:'row',width:'100%'}}>
                                <Feather name='activity' size={48} color="#fff" />
                                <View style={{marginLeft:10,justifyContent:'center'}}>
                                    <Text style={{fontFamily:fontBold,color:'#fff',fontSize:18}}>ACTIVATE PROJECT</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                }
            </View>
        </View>
    )
})
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30,
        marginTop:-70
    },
    ProfileFooterHeader:{
        backgroundColor:'#fff',borderTopLeftRadius: 30, borderTopRightRadius: 30,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 1,
        borderBottomWidth:1,
        borderBottomColor:'#63acfa'
    },
});
export default BodySection