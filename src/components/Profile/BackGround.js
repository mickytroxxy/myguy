import React, { memo, useContext } from 'react'
import { View, Image, Dimensions, Text } from 'react-native'
import * as Animatable from 'react-native-animatable';
import { AppContext } from '../../context/AppContext';
const BackGround = memo(({attr}) => {
    const {width,height} = Dimensions.get("screen");
    const {appState:{fontFamilyObj:{fontBold}}} = useContext(AppContext)
    const {activeProfile} = attr;
    const avatar = activeProfile.avatar
    return (
        <View style={{flex:1}}>
            
            {avatar !== "" && <Animatable.Image animation="slideInDown" duration={1500} useNativeDriver={true} source={{uri:avatar}} resizeMode="cover" style={{width:'100%',height:height/2}}></Animatable.Image>}
            {avatar === "" && <View style={{backgroundColor:'#14678B',width:'100%',height:height/2,borderRadius:10,justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff',fontFamily:fontBold}}>NO COMPANY LOGO</Text></View>}
        </View>
    )
})

export default BackGround;