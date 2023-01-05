import React, { memo, useContext, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AppContext } from '../../context/AppContext';
import { AntDesign, Ionicons, MaterialIcons} from "@expo/vector-icons";
import AisInput from './AisInput'
import axios from 'axios';
const Location = memo((props) => {
    const {appState:{getLocation,fontFamilyObj:{fontBold,fontLight}} } = useContext(AppContext);
    const [predictions,setPredictions] = useState({predictionsArray:null,showPredictions:false});
    const {showPredictions,predictionsArray} = predictions;
    const handleChange = (field,key_word) => {
        if(key_word.length > 2){
            getLocation(({latitude,longitude})=>{
                axios.request({method: 'post',url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyB_Yfjca_o4Te7-4Lcgi7s7eTjrmer5g5Y&input=${key_word}&location=${latitude},${longitude}&radius=1000000`}).then((response) => {
                    setPredictions({...predictions, predictionsArray:response.data.predictions,showPredictions:true});
                }).catch((e) => {
                    alert(e.response);
                });
            })
        }else{
            setPredictions({...predictions, predictionsArray:null,showPredictions:false});
        }
    };
    const getPlaceGeo = (place_id,text) =>{
        setPredictions({...predictions, predictionsArray:null,showPredictions:false});
        axios.request({method: 'post',url: `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=AIzaSyB_Yfjca_o4Te7-4Lcgi7s7eTjrmer5g5Y`,}).then((response) => {
            const {lat,lng} = response.data.result.geometry.location;
            props.handleChange('address',{lat,lng,text})
        }).catch((e) => {
            alert(e);
        });
    }
    return (
        <View>
            <AisInput attr={{field:'address',icon:{name:'location-outline',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Delivery Address',color:'#009387',handleChange}} />
            <View style={{marginTop:15}}>
                {showPredictions && predictionsArray?.map((item,i) => 
                    <TouchableOpacity onPress={() => getPlaceGeo(item.place_id,item.description.slice(0,70))} style={{marginTop:5,flexDirection:'row',borderBottomWidth:0.6,borderBottomColor:'#D9D9DF',paddingBottom:7}}>
                        <Ionicons name='ios-location-outline' size={24} color='green'></Ionicons>
                        <Text numberOfLines={1} style={{fontFamily:fontLight,marginLeft:10,fontSize:Platform.OS === 'android' ? 12 : 14,marginTop:5}}>{item.description.slice(0,60)}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
})

export default Location