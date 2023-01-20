import React, { memo, useContext } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { Ionicons, MaterialIcons,AntDesign,FontAwesome, Feather } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
import { Col, Grid } from 'react-native-easy-grid';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles';
import { AppContext } from '../../../context/AppContext';
import { updateData } from '../../../context/Api';
import {TouchableRipple,Switch} from 'react-native-paper';
import moment from 'moment';
const About = memo((props) => {
    const {page,profileOwner,activeProfile,fontBold,fontLight} = props?.data;
    const {appState:{handleUploadPhotos,updateProfile,setModalState,accountInfo,setActiveProfile,showToast,nativeLink}} = useContext(AppContext)
    const handleChange = (field,value) => updateProfile(field,value);
    //console.log(activeProfile.photos)
    const editProfile = (field) => {
        if(profileOwner){
            if(field === 'facebookLink'){
                setModalState({isVisible:true,attr:{headerText:'FACEBOOK LINK',field,placeholder:'Paste Your Facebook Link...',handleChange}})
            }else if(field === 'instagramLink'){
                setModalState({isVisible:true,attr:{headerText:'INSTAGRAM LINK',field,placeholder:'Paste Your Instagram Link...',handleChange}})
            }else if(field === 'whatsApp'){
                setModalState({isVisible:true,attr:{headerText:'WHATSAPP NUMBER',field,placeholder:'Enter Your whatsApp Number...',handleChange}})
            }else if(field === 'emailAddress'){
                setModalState({isVisible:true,attr:{headerText:'EMAIL ADDRESS',field,placeholder:'Enter Your Email Address...',handleChange}})
            }else if(field === 'phoneNumber'){
                setModalState({isVisible:true,attr:{headerText:'PHONE NUMBER',field,placeholder:'Enter Your Phone Number...',handleChange}})
            }
        }else{
            if(field === 'facebookLink'){
                if(activeProfile.facebookLink){
                    nativeLink("url",{url:activeProfile.facebookLink})
                }else{
                    showToast("No facebook link is associated")
                }
            }else if(field === 'instagramLink'){
                if(activeProfile.instagramLink){
                    nativeLink("url",{url:activeProfile.instagramLink})
                }else{
                    showToast("No Instagram link is associated")
                }
            }else if(field === 'whatsApp'){
                if(activeProfile.whatsApp){
                    nativeLink("url",{url:'whatsapp://send?text=Hello there, I need help&phone='+activeProfile?.whatsApp})
                }else{
                    showToast("No whatsApp link associated")
                }
            }else if(field === 'emailAddress'){
                if(activeProfile.emailAddress){
                    nativeLink("email",{email:activeProfile.emailAddress})
                }else{
                    showToast("No email associated")
                }
            }else if(field === 'phoneNumber'){
                if(activeProfile.phoneNumber){
                    nativeLink("call",{phoneNumber:activeProfile.phoneNumber})
                }else{
                    showToast("No Phone Number associated")
                }
            }
        }
    }
    const editDetails = item => {
        setModalState({isVisible:true,attr:{headerText:'EDIT BUSINESS PLAN',item,handleDetails:(details)=>{
            let newDetails = activeProfile.details.map(item => item.section === details.section ? {...item,content:details.content} : item)
            if(activeProfile.details.filter(item => item.section === details.section).length === 0){
                newDetails = [...activeProfile.details,details]
            }
            handleChange('details',newDetails);
        }}})
    }
    const handlePrivacy = data => {
        const privacy = activeProfile.privacy.map(item => item.type === data.type ? {...item,selected:!data.selected} : item)
        handleChange('privacy',privacy);
    }
    return (
        <Animatable.View animation="bounceIn" duration={1000} useNativeDriver={true} style={{padding:5 }}>
            {activeProfile?.details?.map((item,i) => 
                <View key={i} style={{ flex:3,backgroundColor:'#f9f4f7',borderRadius:10, }}>
                    <View style={{padding:10,backgroundColor:'#eae6e8',flex:1,flexDirection:'row',borderTopLeftRadius:10,borderTopRightRadius:10}}>
                        <Text style={[styles.text, { color: "#41444B",flex:3,fontSize:14,fontFamily:fontBold,color:'#757575' }]}>{item.section}</Text>
                        {profileOwner?(
                            <TouchableOpacity onPress={() => editDetails(item)}>
                                <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                            </TouchableOpacity>
                        ):null}
                    </View>
                    <View style={{padding:10}}>
                        <Text style={[styles.text, { color: "#41444B", fontWeight: "300",fontFamily:fontLight }]}>{item.content}</Text>
                    </View>
                </View>
            )}
            {profileOwner && 
                <TouchableOpacity onPress={() => editDetails({section:"",content:""})} style={{borderRadius:10,padding:10,borderColor:'#5586cc',borderWidth:1,flexDirection:'row',marginTop:15}}>
                    <MaterialIcons name='add-circle' size={24} color="green" />
                    <View style={{marginLeft:10,justifyContent:'center'}}>
                        <Text style={{fontFamily:fontBold,color:'#5586cc',fontSize:11}}>ADD NEW SECTION</Text>
                    </View>
                </TouchableOpacity>
            }
            <View style={{backgroundColor:'#eae6e8',borderRadius:5,marginTop:20,marginBottom:20,padding:10}}><Text style={{fontFamily:fontBold,color:'#41444B'}}>PROJECT MILESTONE</Text></View>
            {activeProfile?.privacy?.map((item,i) => (
                <View key={item.type + i} style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                    <View style={{width:30}}>
                        <AntDesign name="Safety" size={24} color="#0e75b4"/>
                    </View>
                    <View style={{justifyContent:'center',alignContent:'center',flex:1}}>
                        <Text style={{color:'#2a2828',fontFamily:fontBold,paddingLeft:15,fontSize:11}}>{item.type}</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                        {profileOwner ? (
                            <TouchableRipple onPress={() => handlePrivacy(item)}>
                                <View>
                                    <View pointerEvents="none">
                                        <Switch value={item.selected} />
                                    </View>
                                </View>
                            </TouchableRipple>
                        ):(
                            <View>{item.selected ? <FontAwesome name="check-circle" size={24} color="green" alignSelf="center"/> : <FontAwesome name="times-circle" size={30} color="tomato" alignSelf="center"/>}</View>
                        )}
                    </View>
                </View>
            ))}
            <View style={{backgroundColor:'#eae6e8',borderRadius:5,marginTop:20,marginBottom:20,padding:10}}><Text style={{fontFamily:fontBold,color:'#41444B'}}>CONTACT DETAILS</Text></View>
            <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                <View style={{width:30}}>
                    <FontAwesome name="facebook" size={24} color="#0e75b4"/>
                </View>
                <TouchableOpacity onPress={() => editProfile("facebookLink")} style={{justifyContent:'center',alignContent:'center',flex:1}}>
                    <Text style={{color:'#2a2828',fontFamily:fontBold,paddingLeft:15,fontSize:11}}>FACEBOOK PAGE</Text>
                </TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#2a2828',fontFamily:fontLight,marginRight:10}}></Text>
                    {profileOwner &&(
                        <TouchableOpacity onPress={() => editProfile("facebookLink")}>
                            <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                <View style={{width:30}}><FontAwesome name="instagram" size={24} color="tomato"/></View>
                <TouchableOpacity onPress={() => editProfile("instagramLink")} style={{justifyContent:'center',alignContent:'center',flex:1}}><Text style={{color:'#2a2828',fontFamily:fontBold,paddingLeft:15,fontSize:11}}>INSTAGRAM</Text></TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#2a2828',fontFamily:fontLight,marginRight:10}}></Text>
                    {profileOwner &&(
                        <TouchableOpacity onPress={() => editProfile("instagramLink")}>
                            <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                        </TouchableOpacity>
                    )}
                </View>
            </View> 
            <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                <View style={{width:30}}><FontAwesome name="whatsapp" size={24} color="green"/></View>
                <TouchableOpacity onPress={() => editProfile("whatsApp")} style={{justifyContent:'center',alignContent:'center',flex:1}}><Text style={{color:'#2a2828',fontFamily:fontBold,paddingLeft:15,fontSize:11}}>WHATSAPP</Text></TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#2a2828',fontFamily:fontLight,marginRight:10}}></Text>
                    {profileOwner &&(
                        <TouchableOpacity onPress={() => editProfile("whatsApp")}>
                            <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                        </TouchableOpacity>
                    )}
                </View>
            </View> 
            <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                <View style={{width:30}}><Feather name="mail" size={24} color="#0e75b4"/></View>
                <TouchableOpacity onPress={() => editProfile("emailAddress")} style={{justifyContent:'center',alignContent:'center',flex:1}}><Text style={{color:'#2a2828',fontFamily:fontBold,paddingLeft:15,fontSize:11}}>EMAIL ADDRESS</Text></TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#2a2828',fontFamily:fontLight,marginRight:10}}></Text>
                    {profileOwner &&(
                        <TouchableOpacity onPress={() => editProfile("emailAddress")}>
                            <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View style={{flexDirection:'row',borderColor:'#f2eae9',borderBottomWidth:0.8,paddingBottom:10,marginBottom:10}}>
                <View style={{width:30}}><FontAwesome name="phone" size={24} color="green"/></View>
                <TouchableOpacity onPress={() => editProfile("phoneNumber")} style={{justifyContent:'center',alignContent:'center',flex:1}}><Text style={{color:'#2a2828',fontFamily:fontBold,paddingLeft:15,fontSize:11}}>PHONE NUMBER</Text></TouchableOpacity>
                <View style={{flexDirection:'row',justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                    <Text style={{color:'#2a2828',fontFamily:fontLight,marginRight:10}}></Text>
                    {profileOwner &&(
                        <TouchableOpacity onPress={() => editProfile("phoneNumber")}>
                            <FontAwesome name="edit" color="#c5c3c8" size={24}></FontAwesome>
                        </TouchableOpacity>
                    )}
                </View>
            </View> 
        </Animatable.View>
    )
})
const ageCalculator = (birthDay) =>{
    var birth = new Date(birthDay);
    var check = new Date();
    var milliDay = 1000 * 60 * 60 * 24;
    var ageInDays = (check - birth) / milliDay;
    var ageInYears =  Math.floor(ageInDays / 365 );
    var age =  ageInDays / 365 ;
    return age;
}
export default About