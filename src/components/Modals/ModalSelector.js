import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text, Image, Platform, ActivityIndicator } from 'react-native'
import { AppContext } from '../../context/AppContext';
import { AntDesign, Ionicons, FontAwesome, EvilIcons} from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';
const ModalSelector = memo((props) => {
    const {list,cb} = props.attr;
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},
        setModalState
    }} = useContext(AppContext);
    return (
        <View style={{padding:10}}>
            {list?.map((item,i) => 
                <TouchableOpacity onPress={() => {
                    setModalState({isVisible:false});
                    cb(item);
                }} key={i} style={{flexDirection:'row',padding:5,borderBottomColor:'#D5E4F7',borderBottomWidth:0.7}}>
                    <Ionicons name='list' size={24} color='#5586cc' />
                    <Text style={{fontFamily:fontLight,marginLeft:10,marginTop:5}}>{item}</Text>
                </TouchableOpacity>
            )}
        </View>
    )
})

export default ModalSelector