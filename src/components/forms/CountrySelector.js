import PropTypes from 'prop-types'
import React, { memo, useContext, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { AppContext } from '../../context/AppContext'
import { countries } from '../../context/countries'
import { SvgUri } from 'react-native-svg';
const CountrySelector = memo((props) => {
    const {appState:{fontFamilyObj:{fontBold,fontLight},countryData,setModalState,setCountryData,pickCurrentLocation}} = useContext(AppContext);
    React.useEffect(()=>{
        pickCurrentLocation(({short_name,long_name})=>{
            if(short_name && long_name){
                setCountryData(countries.filter(country => country.name === long_name || country.isoCode === short_name)[0])
            }
        });
    },[])
    return (
        <View>
            <TouchableOpacity onPress={()=>{
                setModalState({isVisible:true,attr:{headerText:'SELECT COUNTRY | REGION'}});
            }} style={{padding:12,borderRadius:10,flexDirection:'row',borderColor:'#a8a6a5',borderWidth:1}}>
                <SvgUri
                    width={20}
                    height={18}
                    uri={countryData.flag}
                />
                <Text style={{flex:1,marginLeft:10,fontFamily:fontBold,bottom:2}}>{countryData.dialCode}</Text>
                <Text style={{fontFamily:fontLight,bottom:2}}>{countryData.name.slice(0,36)}</Text>
            </TouchableOpacity>
        </View>
    )
})


export default CountrySelector