import { createNativeStackNavigator as createStackNavigator } from '@react-navigation/native-stack';
import React, {useRef,useContext, useState, useEffect } from "react";
import { StyleSheet, View,Text, TextInput, TouchableOpacity, Dimensions, ScrollView} from "react-native";
import {Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { AppContext } from '../context/AppContext';
import AisInput from '../components/forms/AisInput';
import ProjectCategory from '../components/Modals/ProjectCategory';
const RootStack = createStackNavigator();
const CreateProject = ({navigation,route}) => {
    const {appState:{fontFamilyObj}} = useContext(AppContext);
    return(
        <RootStack.Navigator screenOptions={{headerStyle: {elevation: 1,shadowOpacity: 0,backgroundColor: "#fff",borderBottomWidth: 0},headerTintColor: "#fff",headerTitleStyle: { fontWeight: "bold" }}}>
        <RootStack.Screen name="AddItemScreen" component={PageContent} options={{
            headerLeft: () => (
                <Feather.Button backgroundColor="#fff" name="arrow-left-circle" size={28} color="#757575" onPress={()=>{navigation.goBack()}}></Feather.Button>
            ), 
            title: "REGISTER YOUR PROJECT",
            headerTintColor: '#757575',
            headerTitleStyle: {
                fontWeight: '900',
                fontSize:11,
                fontFamily:fontFamilyObj.fontBold
            },
        }}/>
        </RootStack.Navigator>
    )
};
const PageContent = ({navigation}) =>{
    const {appState:{showToast,setConfirmDialog,industry,selectedCategory,fontFamilyObj:{fontBold,fontLight},documents,setDocuments} } = useContext(AppContext);
    const [formData,setFormData] = useState({fname:'',summary:'',target:0});
    const handleChange = (field,value) => setFormData(v =>({...v, [field] : value}));
    const onChange = (value) => handleChange("summary",value);

    return(
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={{fontFamily:fontBold,marginBottom:15,color:'green',alignSelf:'flex-start'}}>Let our AI generate your profile in minutes. You can edit this later</Text>
                <Text style={{fontFamily:fontBold,marginBottom:15,color:'orange',alignSelf:'flex-start'}}>Please note, your project name and target amount can not be altered after project registration</Text>
                <ProjectCategory/>
                <AisInput attr={{field:'fname',icon:{name:'book',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Enter Project Name',color:'#009387',handleChange}} />
                <AisInput attr={{field:'target',icon:{name:'book',type:'FontAwesome',min:5,color:'#5586cc'},keyboardType:'numeric',placeholder:'Target Funds',color:'#009387',handleChange}} />
                <TextInput 
                    numberOfLines={6} 
                    editable={true} 
                    multiline maxLength={300} 
                    onChangeText={onChange}
                    underlineColorAndroid={'transparent'}
                    placeholder={'Briefly explain your project, show innovation, scalability and viability'}
                    style={{width:'100%',fontFamily:fontLight,padding: 10,backgroundColor: '#F5FCFF',borderRadius:10,borderWidth:1,borderColor:'#14678B',marginTop:15}} 
                />
                <TouchableOpacity onPress={() => {
                    if(industry !== "SELECT INDUSTRY"){
                        if(formData.fname.length > 2){
                            if(formData.summary !== ""){
                                if(formData.target > 0 && formData.target < 3000001){
                                    setConfirmDialog({isVisible:true,text:`Are you comfortable with the description you have give? Press CONFIRM to proceed`,okayBtn:'CONFIRM',cancelBtn:'Cancel',severity:true,response:(res) => { 
                                        if(res){
                                            navigation.navigate("Review",{item:{...formData,mainCategory:selectedCategory.type,subCategory:industry}})
                                        }
                                    }});
                                }else{
                                    showToast("Your target amount should be greater than ZAR 0.00 - ZAR 3 000 000")
                                }
                            }else{
                                showToast("Please enter your project description")
                            }
                        }else{
                            showToast("Please enter your project name!")
                        }
                    }else{
                        showToast("Please select your project category")
                    }
                }} style={{backgroundColor:'green',padding:15,borderRadius:5,marginTop:30}}><Text style={{fontFamily:fontBold,color:'#fff'}}>SAVE PROJECT</Text></TouchableOpacity>
            </ScrollView>
        </View>
    )
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
      justifyContent: 'center',
      backgroundColor:'#fff'
    },
    textareaContainer: {
      minHeight: 100,
      padding: 7,
      backgroundColor: '#F5FCFF',
      borderRadius:10,
      borderWidth:1,borderColor:'#14678B'
    },
    textarea: {
      textAlignVertical: 'top',  // hack android
      height: 100,
      fontSize: 14,
      color: '#333',
    },
  });
export default CreateProject