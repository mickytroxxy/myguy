import React, { memo } from 'react'
import { View,TouchableOpacity } from 'react-native'
import {Feather} from "react-native-vector-icons"
const BackBtn = memo(({navigation}) => {
    return (
        <View style={{position:'absolute',zIndex:5,top:2,left:2,padding:1,borderRadius:100,backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
            <TouchableOpacity>
                <Feather backgroundColor="#fff" name="arrow-left-circle" size={32} color="#fff" onPress={()=>{
                    navigation.goBack();
                }}></Feather>
            </TouchableOpacity>
        </View>
    )
})
export default BackBtn