import React, { memo,useContext,useEffect,useState } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform } from 'react-native'
import { AppContext } from '../context/AppContext'
import * as Animatable from 'react-native-animatable';

import { getSignies } from '../context/Api';
import Banner from '../components/Banner';
import BackBtn from '../components/BackBtn';
const Participants = memo(({navigation,route}) => {
    const {signies} = route.params;
    const {appState:{
        fontFamilyObj:{fontBold,fontLight}
    }} = useContext(AppContext);
    const [participants,setParticipants] = useState([]);
    useEffect(() => {
        signies?.length > 0 && signies.map(({signatureId}) => {
            getSignies(signatureId, (response) => {
                setParticipants(prevState => ([...prevState,response[0]]))
            })
        })
    },[])
    return (
        <View style={{padding:10}}>
            <BackBtn navigation={navigation} />
            <Text style={{fontFamily:fontBold,textAlign:'center'}}>ALL PARTICIPANTS</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{marginTop:15}}>
                <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true} style={{flexDirection:'row',alignContent:'center',alignItems:'center',display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',flexWrap: 'wrap'}}>
                    {participants?.length > 0 && participants?.map((item,i)=>{
                        const {fname,selfie} = item;
                        return(
                            <TouchableOpacity key={i} style={{width:'48%',borderRadius:10,alignContent:'center',alignItems:'center',justifyContent:'center',minHeight:220,marginTop:10}}>
                                <View style={{width:'100%',height:220,backgroundColor:'#B9D9EB',borderRadius:10,padding:1,alignContent:'center',justifyContent:'center',alignItems:'center'}}>
                                    <Image source={{uri:selfie}} style={{width:'100%',height:'100%'}} resizeMode="cover" />
                                </View>
                                <View style={{backgroundColor:'rgba(0, 0, 0, 0.2)',borderRadius:0,justifyContent:'center',borderBottomRightRadius:50,borderTopLeftRadius:50,padding:10,width:'100%',marginTop:5}}><Text style={{fontFamily:fontBold,color:'#14678B',textAlign:'center',fontSize:9}} numberOfLines={1}>{fname}</Text></View>
                            </TouchableOpacity>
                        )
                    })}  
                </Animatable.View>
                <Banner navigation={navigation}/>
            </ScrollView>
        </View>
    )
})

export default Participants