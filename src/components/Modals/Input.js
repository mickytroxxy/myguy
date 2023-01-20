import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { AppContext } from '../../context/AppContext';
import AisInput from '../forms/AisInput';
import { FontAwesome} from "@expo/vector-icons";
const Input = memo((props) => {
    const {handleChange,field,placeholder,hint,isNumeric} = props.attr;
    const {appState:{setModalState,showToast,fontFamilyObj:{fontLight}}} = useContext(AppContext);
    const [value,setValue] = useState("");
    return (
        <View>
            <View>
                <View style={{padding:30}}>
                    {hint && <Text style={{fontFamily:fontLight}}>{hint}</Text>}
                    <AisInput attr={{field:'value',icon:{name:'list',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:isNumeric ? 'numeric' : null,height:field === 'about' ? 70 : null,placeholder:placeholder,color:'#009387',handleChange:(field,val)=>{
                        setValue(val)
                    }}} />
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>{
                            if(value.length > 2 || isNumeric){
                                setModalState({isVisible:false})
                                handleChange(field,value)
                            }else{
                                showToast("Please carefully fill in!")
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