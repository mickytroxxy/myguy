import React, {useContext,useState} from 'react';
import { Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import { AppContext } from "../context/AppContext";
import { FontAwesome, AntDesign, Ionicons, MaterialCommunityIcons, EvilIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import Products from '../components/Documents';
import Entry from '../components/user/Entry';
import { getDocumentsById, updateData, uploadFile } from '../context/Api';
import Projects from '../components/Projects';

export default function Home({navigation}) {
  const {appState:{
    fontFamilyObj:{fontBold,fontLight},
    secrets,
    accountInfo,
    showToast,
    setConfirmDialog,
    pickImage,takePicture,saveUser
  }} = useContext(AppContext);
  const [loginTypes,setLoginTypes] = useState([{btnType:'PROJECTS',selected:true},{btnType:'DOCUMENTS',selected:false},{btnType:'MY ACCOUNT',selected:false}]);
  const selectedComponent = loginTypes.filter(item => item.selected)[0].btnType;
  const scannedResults = (documentId) => {
    getDocumentsById(documentId,(response) => {
      if(response.length > 0){
        const {documentType,url} = response[0];
        const link = `${secrets.BASE_URL}${url}`
        navigation.navigate("DocumentView",{documentType,documentId,url:link})
      }else{
        showToast("No such document exist on our servers!")
      }
    })
  };
  return (
    <ScrollView style={{backgroundColor:'#e8e9f5'}} showsVerticalScrollIndicator={false}>
      <View style={{padding:10,flex:1,backgroundColor:'#e8e9f5'}}>
        <TouchableOpacity onPress={()=>{
          if(selectedComponent === "PROJECTS"){
            if(accountInfo){
              navigation.navigate("CreateProject")
            }else{
              showToast("Please create a personal account first!")
              navigation.navigate("Register")
            }
          }else if(selectedComponent === "DOCUMENTS"){
            navigation.navigate("Scanner",{scannedResults})
          }
        }}>
          <LinearGradient colors={["#BED0D8","#14678B","#5586cc","orange"]} start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} style={{height:120,alignItems:'center',justifyContent:'center',padding:15,borderTopLeftRadius:50,borderBottomRightRadius:50}}>  
            <Animatable.View animation="bounceIn" duration={1500} useNativeDriver={true} style={{width:'100%',flexDirection:'row'}}>
              <View style={{paddingRight:30}}>
                {selectedComponent === "DOCUMENTS" && 
                  <MaterialIcons name='qr-code-scanner' color={"#fff"} size={60}/>
                }
                {selectedComponent === "PROJECTS" && 
                  <FontAwesome name='lightbulb-o' color={"orange"} size={60}/>
                }
                {selectedComponent === "MY ACCOUNT" && 
                  <View>
                    {accountInfo && 
                      <View style={{height:100,width:100,borderRadius:100,backgroundColor:'#fff',justifyContent:'center',alignItems:'center'}}>
                        {accountInfo.avatar ?  <Image source={{uri:accountInfo.avatar}} style={{height:90,width:90,borderRadius:100}}/> : <EvilIcons name='user' size={90} color='#757575' />}
                        <TouchableOpacity style={{position:'absolute',right:0,bottom:0,backgroundColor:'#14678B',borderRadius:100,width:40,height:40,alignItems:'center',justifyContent:'center',alignContent:'center'}} onPress={() => {setConfirmDialog({isVisible:true,text:`Choose your avatar source, Press camera to snap one now or choose from your gallery!`,okayBtn:'GALLERY',cancelBtn:'CAMERA',response:(res) => { 
                            if(res){
                              pickImage('avatar',(file)=>{
                                const id = accountInfo.id;
                                uploadFile(file,`avatar/${id}`,avatar =>{
                                  const obj = {...accountInfo,avatar};
                                  if(updateData("clients",id,obj)){
                                    saveUser(obj)
                                  }
                                })
                              })
                            }else{
                              takePicture('avatar',(file)=>{
                                const id = accountInfo.id;
                                uploadFile(file,`avatar/${id}`,avatar =>{
                                  const obj = {...accountInfo,avatar};
                                  if(updateData("clients",id,obj)){
                                    saveUser(obj)
                                  }
                                })
                              })
                            }
                          }})
                        }}>
                        <AntDesign name='edit' size={20} color='#fff'/>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                }
              </View>
              {selectedComponent === "DOCUMENTS" && 
                <View style={{paddingLeft:15,paddingRight:15,flex:1,backgroundColor:'rgba(0, 0, 0, 0.1)',borderRadius:15,justifyContent:'center',borderBottomRightRadius:50}}>
                  <Text style={{color:'#fff',fontFamily:fontBold}}>SCAN DOCUMENT</Text>
                </View>
              }
              {selectedComponent === "MY ACCOUNT" && 
                <View style={{paddingLeft:15,flex:1,height:70,marginTop:15,backgroundColor:'rgba(0, 0, 0, 0.1)',borderRadius:15,justifyContent:'center',borderBottomRightRadius:50}}>
                  <Text style={{color:'#fff',fontFamily:fontBold}}>{accountInfo ? accountInfo.fname : "GUEST ACCOUNT"}</Text>
                  <Text style={{color:'orange',fontFamily:fontBold}}>{accountInfo ? accountInfo.plan : "FREE PLAN"}</Text>
                </View>
              }
              {selectedComponent === "PROJECTS" && 
                <View style={{paddingLeft:15,paddingRight:15,backgroundColor:'rgba(0, 0, 0, 0.1)',borderRadius:15,justifyContent:'center',borderBottomRightRadius:50,flex:1}}>
                  <Text style={{color:'#fff',fontFamily:fontBold,fontSize:11}}>Do You Have A Great Project Or Idea? <Text style={{color:'orange',fontFamily:fontBold,fontSize:15}}>START A CAMPAIGN</Text></Text>
                </View>
              }
            </Animatable.View>
          </LinearGradient>
        </TouchableOpacity>
        <View style={{backgroundColor:'#fff',height:60,marginTop:15,borderRadius:30,borderBottomLeftRadius:5,padding:3,flexDirection:'row'}}>
          {loginTypes.map((btn,i) =>(
            <TouchableOpacity key={i} style={{flex:1,alignContent:'center',alignItems:'center',justifyContent:'center',backgroundColor:btn.selected ? '#14678B' : '#fff',borderRadius:30,padding:5}} onPress={() => setLoginTypes(loginTypes.map(item => item.btnType === btn.btnType ? {...item,selected:true} : {...item,selected:false}))}>
              <Text style={{fontFamily: btn.selected ? fontBold : fontLight,color:btn.selected ? '#fff' : '#757575',fontSize:11}}>{btn.btnType}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedComponent === 'DOCUMENTS' && <Products navigation={navigation} />}
        {selectedComponent === 'MY ACCOUNT' && <Entry navigation={navigation}/>}
        {selectedComponent === 'PROJECTS' && <Projects navigation={navigation}/>}
      </View>
    </ScrollView>
  );
}