import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { AppContext } from '../../context/AppContext';
import AisInput from '../forms/AisInput';
import { FontAwesome} from "@expo/vector-icons";
const Input = memo((props) => {
    const {manualCodeEntered,placeHolder} = props.attr;
    const {appState:{setModalState,showToast}} = useContext(AppContext);
    const [value,setValue] = useState("");
    return (
        <View>
            <View>
                <View style={{padding:30}}>
                    <AisInput attr={{field:'value',icon:{name:'qr-code-scanner',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:null,placeholder:placeHolder,color:'#009387',handleChange:(field,val)=>{
                        setValue(val)
                    }}} />
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>{
                            if(value.length > 8){
                                setModalState({isVisible:false})
                                manualCodeEntered(value.toUpperCase())
                            }else{
                                showToast("Invalid code format!")
                            }
                        }}>
                            <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
})

export default Input