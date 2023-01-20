import React, { memo,useContext,useEffect,useState } from 'react'
import { View,TouchableOpacity,Text, ScrollView, Image, Platform } from 'react-native'
import { AppContext } from '../context/AppContext'
import * as Animatable from 'react-native-animatable';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome, MaterialIcons, Ionicons} from "@expo/vector-icons";
import { ProgressBar } from 'react-native-paper';
import Banner from './Banner';
import LuckyProjects from './LuckyProjects';
import ProjectCategory from './Modals/ProjectCategory';
let pageItems = 10;
const Projects = memo(({navigation}) => {
    const {appState:{
        fontFamilyObj:{fontBold,fontLight},
        accountInfo,clients,getUserProfile,industry
    }} = useContext(AppContext);
    const [pageContent,setPageContent] = useState(null);
    const [page,setPage]=React.useState({startAt:0,endAt:pageItems});
    const lucky10 = clients?.filter(item => item.isLucky10);
    useEffect(() => {
        industry === "SELECT INDUSTRY" ? 
            setPageContent(clients?.slice(page.startAt,page.endAt)) : 
            setPageContent(clients?.filter(item => item.subCategory === industry).slice(page.startAt,page.endAt))
    },[clients,industry]);
    const handlePagination = (direction)=>{
        let startAt = 0,endAt = pageItems;
        if(direction === "next"){
            if(clients.length > page.endAt){
                startAt = page.startAt + pageItems;
                endAt = page.endAt + pageItems;
            }
        }else{
            if(page.endAt > pageItems){
                startAt = page.startAt - pageItems;
                endAt = page.endAt - pageItems;
            }
        }
        setPage({startAt:startAt,endAt:endAt});
        setPageContent(clients?.slice(startAt,endAt))
    }
    return (
        <View>
            <Text style={{fontFamily:fontBold,color:"#757575",marginTop:10,fontSize:12}}>PROJECTS OF THE WEEK</Text>
            {lucky10 && lucky10.length > 0 && <LuckyProjects navigation={navigation} data={lucky10} />}
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProjectCategory/>
                <Animatable.View animation="slideInRight" duration={750} useNativeDriver={true} style={{}}>
                    {pageContent?.sort((a,b)=>b.votes.length - a.votes.length)?.map(({avatar,fname,funded,target,projectId,details,votes,funders,subCategory},i) =>{
                        const iVoted = votes.indexOf(accountInfo?.id);
                        const iFunded = funders.indexOf(accountInfo?.id);
                        return(
                            <View key={i} style={{flex:1}}>
                                <TouchableOpacity style={{backgroundColor:'#fff',flex:1,marginTop:10,padding:5,borderRadius:10,width:'100%',borderColor:'#F4B55A',borderWidth:0.5}} onPress={() => {getUserProfile(navigation,projectId)}}>
                                    {avatar !== "" && <Image source={{uri:avatar}} resizeMode="cover" style={{width:'100%',height:160,borderRadius:10}} />}
                                    {avatar === "" && <View style={{backgroundColor:'#14678B',width:'100%',height:160,borderRadius:10,justifyContent:'center',alignItems:'center'}}><Text style={{color:'#fff',fontFamily:fontBold}}>NO COMPANY LOGO</Text></View>}
                                    <View style={{marginTop:5}}>
                                        <Text style={{fontFamily:fontLight,fontSize:13}} numberOfLines={5}>{details[0].content}</Text>
                                    </View>
                                    <Text style={{fontFamily:fontBold,color:'#757575',fontSize:Platform.OS === 'android' ? 11 : 12,marginTop:10,marginBottom:5}}>{subCategory} - {fname}</Text>
                                    <ProgressBar progress={(funded / target * 100).toFixed(0) / 100} color={"green"} />
                                    <View style={{flexDirection:'row',marginTop:5}}>
                                        <View style={{flex:1}}><Text style={{fontFamily:fontBold,color:'#757575',fontSize:Platform.OS === 'android' ? 10 : 12}}>Target ZAR {target.toFixed(2)}</Text></View>
                                        <View><Text style={{fontFamily:fontBold,color:'green',fontSize:Platform.OS === 'android' ? 10 : 12}}>{(funded / target * 100).toFixed(0)}%</Text></View>
                                    </View>
                                    <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                                        <TouchableOpacity style={{borderRadius:10,padding:10,borderColor:'#5586cc',borderWidth:1,flexDirection:'row',width:'48%'}}>
                                            <FontAwesome name='user-o' size={24} color={iFunded === -1 ? "orange" : "green"} />
                                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                                <Text style={{fontFamily:fontBold,color:'#5586cc',fontSize:11}}>{funders.length} FUNDERS</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{borderRadius:10,padding:10,borderColor:'#5586cc',borderWidth:1,flexDirection:'row',width:'48%'}}>
                                            <Ionicons name='heart-circle-outline' size={24} color={iVoted === -1 ? "orange" : "green"} />
                                            <View style={{marginLeft:10,justifyContent:'center'}}>
                                                <Text style={{fontFamily:fontBold,color:'#5586cc',fontSize:11}}>{votes.length} VOTES</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                    {!pageContent && (
                        <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',justifyContent:'center',flex:1,marginTop:50}}>
                            <ActivityIndicator color='#757575' size={48}></ActivityIndicator>
                            <Text style={{fontFamily:fontBold,color:'#757575'}}>Fetching projects...</Text>
                        </View>
                    )}
                    {pageContent?.length === 0 && (
                        <View style={{alignItems:'center',alignContent:'center',justifyContent:'center',justifyContent:'center',flex:1,marginTop:50}}>
                            <MaterialCommunityIcons name='flask-empty-off-outline' color={"#757575"} size={72} />
                            <Text style={{fontFamily:fontBold,color:'#757575'}}>NO PROJECTS FOUND</Text>
                        </View>
                    )}
                </Animatable.View>
                {pageContent?.length > 0 && 
                    <View style={{justifyContent:'center',alignContent:'center',alignItems:'center',height:50,flexDirection:'row',flex:1}}>
                        <View style={{justifyContent:'center',alignContent:'center',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>{handlePagination("prev")}} style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                <FontAwesome name="arrow-circle-left" size={36} color="#757575" alignSelf="center"></FontAwesome>
                            </TouchableOpacity>
                        </View>
                        <View style={{justifyContent:'center',alignContent:'center',alignItems:'center',flex:1}}>
                            <TouchableOpacity onPress={()=>{handlePagination("next")}} style={{justifyContent:'center',alignContent:'center',alignItems:'center'}}>
                                <FontAwesome name="arrow-circle-right" size={36} color="#757575" alignSelf="center"></FontAwesome>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                <Banner navigation={navigation}/>
                <View style={{marginTop:30,alignContent:'center',alignItems:'center'}}>
                    <Text style={{textAlign:'center',fontFamily:fontBold}}>Contact Support</Text>
                    <TouchableOpacity onPress={()=> navigation.navigate("Contact")}>
                        <MaterialIcons name='contact-support' size={75} color="green" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
})

Projects.propTypes = {}

export default Projects