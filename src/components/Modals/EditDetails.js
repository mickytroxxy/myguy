import React, { memo, useContext, useEffect, useState } from 'react'
import { View, TouchableOpacity, TextInput, Text } from 'react-native'
import { AppContext } from '../../context/AppContext';
import AisInput from '../forms/AisInput';
import { FontAwesome} from "@expo/vector-icons";
const EditDetails = memo((props) => {
    const {item,handleDetails} = props.attr;
    const {appState:{setModalState,showToast,fontFamilyObj:{fontLight,fontBold}}} = useContext(AppContext);
    const [details,setDetails] = useState({section:"",content:""});
    const onChange = content => setDetails(prevState => ({...prevState,content}))
    useEffect(() => {
        setDetails(item)
    },[])
    {/**
    1. registry
    2. wallet
    3. trusted compute

*/}
    return (
        <View>
            <View>
                <View style={{padding:30}}>
                    {item.section === "" && <AisInput attr={{field:'value',icon:{name:'list',type:'MaterialIcons',min:5,color:'#5586cc'},keyboardType:null,value:details.section,color:'#009387',placeholder:'Section header...',handleChange:(field,section)=>{
                        setDetails(prevState => ({...prevState,section}))
                    }}} />}
                    {item.section !== "" && <Text style={{fontFamily:fontBold}}>{item.section}</Text>}
                    <TextInput 
                        numberOfLines={6} 
                        editable={true} 
                        multiline maxLength={1500} 
                        onChangeText={onChange}
                        value={details.content}
                        underlineColorAndroid={'transparent'}
                        placeholder={'Briefly explain your project, show innovation, scalability and viability'}
                        style={{width:'100%',fontFamily:fontLight,padding: 10,backgroundColor: '#F5FCFF',borderRadius:10,borderWidth:1,borderColor:'#14678B',marginTop:15}} 
                    />
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>{
                            if(details.content.length > 250 && details.section.length > 8){
                                setModalState({isVisible:false})
                                handleDetails(details)
                            }else{
                                showToast("Please explain to us more!")
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

export default EditDetails