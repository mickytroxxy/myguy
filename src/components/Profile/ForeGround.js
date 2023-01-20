import React, { memo, useContext } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native'
import { AppContext } from '../../context/AppContext'
import { useEffect } from 'react';
import BackBtn from '../BackBtn';
import { Col, Grid } from 'react-native-easy-grid';
import * as Animatable from 'react-native-animatable';
import { Ionicons,Feather } from "@expo/vector-icons";
const ForeGround = memo(({attr}) => {
    const {appState:{showToast,handleUploadPhotos,fontFamilyObj:{fontBold}}} = useContext(AppContext);
    const {navigation,profileOwner,activeProfile,page} = attr;
    return (
        <View style={{flex:1}}>
            <View style={{flex:3}}><BackBtn navigation={navigation}/></View>
            <Animatable.View style={{flex:1,flexDirection:'row',marginTop:Platform.OS === 'ios' ? -100 : -150}} animation="slideInLeft" duration={1000} useNativeDriver={true}>
                <Grid>
                    <Col style={styles.usernameView} size={2.5}><Text style={{color:'#fff',fontSize:12,fontFamily:fontBold}}>{activeProfile?.fname}</Text></Col>
                    <Col size={0.1}></Col>
                    <Col style={styles.addPhotoContainer} size={1.4}>
                        {profileOwner ? (
                            <TouchableOpacity onPress={() => handleUploadPhotos("avatar",page,activeProfile?.projectId)}>
                                <Ionicons name="ios-camera" size={50} color="#92e6f5" alignSelf="center"></Ionicons>
                            </TouchableOpacity>
                        ):(
                            <View>
                                <TouchableOpacity onPress={()=>{
                                    if(activeProfile.isVerified){
                                        showToast(activeProfile.fname +" has been verified!")
                                    }else{
                                        showToast(activeProfile.fname +" is not verified yet!")
                                    }
                                }}>
                                    {activeProfile.isVerified ? (
                                        <Ionicons name="shield-checkmark" size={44} color="green" alignSelf="center"></Ionicons>
                                    ):(
                                        <Feather name="shield-off" size={44} color="tomato" alignSelf="center"></Feather>
                                    )}
                                </TouchableOpacity>
                            </View>
                            
                        )}
                    </Col>
                </Grid>
            </Animatable.View>
        </View>
    )
})
export const styles = StyleSheet.create({
    footerStyle: {
        flex: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 10,
        paddingBottom:30,
    },
    mapStyle: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height
    },
    addPhotoContainer:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', height: 50, alignContent:"center", alignItems:"center",
        borderTopLeftRadius:50,borderTopRightRadius:50,borderBottomLeftRadius:700,marginRight:5,
        borderTopRightRadius:700,justifyContent:'center',
    },
    usernameView:{
        backgroundColor: 'rgba(0, 0, 0, 0.5)', height: 50, alignContent:"center", alignItems:"center",
        borderTopLeftRadius:50,borderTopRightRadius:50,borderBottomRightRadius:700,
        justifyContent:'center',marginLeft:5,borderTopLeftRadius:700,
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined,
    },
});
export default ForeGround