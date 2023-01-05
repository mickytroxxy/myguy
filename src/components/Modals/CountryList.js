import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity,Platform, Text,ScrollView } from 'react-native'
import { AppContext } from '../../context/AppContext';
import AisInput from '../forms/AisInput';
import { countries } from '../../context/countries';
import { SvgUri } from 'react-native-svg';
const CountryList = memo((props) => {
    const {appState:{setCountryData,setModalState,fontFamilyObj:{fontBold,fontLight}}} = useContext(AppContext);
    const [filteredList,setFilteredList] = useState(countries);
    return (
        <View style={{padding:10}}>
            <AisInput attr={{field:'search',icon:{name:'search',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Search...',color:'#009387',handleChange:(field,value)=>{
                value.length > 2 ? setFilteredList(countries.filter(country => country.name.toUpperCase().includes(value.toUpperCase()))) : setFilteredList(countries)
            }}} />
            <ScrollView style={{marginTop:10}}>
                {filteredList.map(country => (
                    <TouchableOpacity onPress={()=>{
                        setCountryData({name:country.name,dialCode:country.dialCode,flag:country.flag})
                        setModalState({visible:false})
                    }} style={{backgroundColor:'#f7f5f5',padding:12,borderRadius:5,flexDirection:'row',marginBottom:5}}>
                        {Platform.OS !== "ios" && (
                            <SvgUri
                                width={20}
                                height={18}
                                uri={country.flag}
                            />
                        )}
                        <Text style={{flex:1,marginLeft:10,fontFamily:fontBold,bottom:2}}>{country.dialCode}</Text>
                        <Text style={{fontFamily:fontLight,bottom:2}}>{country.name.slice(0,36)}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
})

export default CountryList