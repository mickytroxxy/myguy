import React, { memo, useContext } from 'react'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Ionicons,Feather, FontAwesome } from "@expo/vector-icons";
import { ProgressBar } from 'react-native-paper';
import { AppContext } from '../../../context/AppContext';
import { getUserDetails } from '../../../context/Api';
const Stats = memo((props) => {
    const {profileOwner,activeProfile,fontBold,fontLight,accountInfo} = props?.data;
    const {appState:{updateProfile,sendPushNotification}} = useContext(AppContext)
    const {target,funded,votes,funders} = activeProfile;
    const percentage = (funded / target * 100).toFixed(0);
    const iVoted = votes.indexOf(accountInfo?.id);
    const iFunded = funders.indexOf(accountInfo?.id);
    const handleVotes = () => {
        if(accountInfo){
            let currentVoters = votes;
            if(votes.indexOf(accountInfo.id) === -1){
                currentVoters = [...currentVoters,accountInfo.id];
                getUserDetails(activeProfile.projectOwner,(accountOwner) => {
                    if(accountOwner.length > 0){
                        if(accountOwner[0]?.notificationToken){
                            sendPushNotification(accountOwner[0]?.notificationToken,"YOU HAVE A NEW VOTER",`Hello ${accountOwner[0].fname}, Your project just received a vote. Keep up the good work!`,{});
                        }
                    }
                })
            }else{
                votes.splice(votes.indexOf(accountInfo.id), 1)
            }
            updateProfile("votes",currentVoters)
        }
    }
    return (
        <View style={{padding:10}}>
            <View style={{flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center'}}>
                    <ProgressBar progress={percentage / 100} color={"green"}/>
                </View>
                <View style={{justifyContent:'center',alignItems:'center',alignContent:'center'}}><Text style={{fontFamily:fontBold,color:'green'}}>{percentage}%</Text></View>
            </View>
            <View style={{flexDirection:'row'}}>
                <View style={{flex:1}}><Text style={{fontFamily:fontBold,color:'#757575',fontSize:Platform.OS === 'android' ? 10 : 12}}>Target ZAR {target.toFixed(2)}</Text></View>
                <View><Text style={{fontFamily:fontBold,color:'green',fontSize:Platform.OS === 'android' ? 10 : 12}}>Raised ZAR {funded.toFixed(2)}</Text></View>
            </View>
            <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                <TouchableOpacity style={{borderRadius:10,padding:10,borderColor:'#5586cc',borderWidth:1,flexDirection:'row',width:'48%'}}>
                    <FontAwesome name='user-o' size={24} color={iFunded === -1 ? "orange" : "green"} />
                    <View style={{marginLeft:10,justifyContent:'center'}}>
                        <Text style={{fontFamily:fontBold,color:'#5586cc',fontSize:11}}>{funders.length} FUNDERS</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleVotes()}  style={{borderRadius:10,padding:10,borderColor:'#5586cc',borderWidth:1,flexDirection:'row',width:'48%'}}>
                    <Ionicons name='heart-circle-outline' size={24} color={iVoted === -1 ? "orange" : "green"} />
                    <View style={{marginLeft:10,justifyContent:'center'}}>
                        <Text style={{fontFamily:fontBold,color:'#5586cc',fontSize:11}}>{votes.length} VOTES</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
})
const styles = StyleSheet.create({
    statsContainer: {
        alignSelf: "center",
        padding:10,
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
});
export default Stats