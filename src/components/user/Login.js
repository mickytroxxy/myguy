import PropTypes from 'prop-types'
import React, { memo, useContext, useState } from 'react'
import AisInput from '../../components/forms/AisInput'
import { Text, View, TouchableOpacity } from 'react-native'
import { AppContext } from '../../context/AppContext'
import { FontAwesome} from "@expo/vector-icons";
import { loginApi } from '../../context/Api'
import CountrySelector from '../forms/CountrySelector'
const inputs = [
  {field:'phoneNumber',icon:{name:'phone',type:'FontAwesome',min:5,color:'#14678B'},keyboardType:'phone-pad',placeholder:'ENTER YOUR PHONENUMBER',color:'#009387'},
  {field:'password',icon:{name:'lock',type:'Feather',color:'#14678B',min:6},keyboardType:null,placeholder:'ENTER YOUR PASSWORD',color:'#009387'}
]
const Login = memo(({navigation}) => {
  const [formData,setFormData] = useState({phoneNumber:'',password:''});
  const {appState:{fontFamilyObj:{fontBold},showToast,countryData,saveUser,phoneNoValidation}} = useContext(AppContext);
  const handleChange = (field,value) => setFormData(v =>({...v, [field] : value}));
  const login = () =>{
    if(formData.phoneNumber.length > 9 && formData.password.length > 5){
      const phoneNumber = phoneNoValidation(formData.phoneNumber,countryData.dialCode);
      phoneNumber && loginApi(phoneNumber,formData.password,(response)=>{
        if(response[0]){
          if(response.length > 0){
            saveUser(response[0]);
          }else{
            showToast("Invalid login details")
          }
        }
      })
      //setAccountInfo({fname:'Lameck Ndhlovu',address:{latitude:'6384949',longitude:'7283939',text:'8590 Cassiopeia street, devland Soweto'},avatar:'https://d2r55xnwy6nx47.cloudfront.net/uploads/2019/07/Olivier_1500_Trptch.jpg',phoneNumber:'0658016132',id:'DN508917'})
    }else{
      showToast("Please properly fill in before proceeding!");
    }
  }
  return (
    <View style={{marginTop:30}}>
      <Text style={{fontFamily:fontBold}}>Have An Account? Login Below</Text>
      <View style={{marginTop:30}}>
        <CountrySelector />
        {inputs.map((item,i) =>(
          <AisInput attr={{...item,handleChange}} key={i} />
        ))}
        <View style={{alignItems:'center',marginTop:15}}>
            <TouchableOpacity onPress={login}>
              <FontAwesome name='check-circle' size={120} color="#14678B"></FontAwesome>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{marginTop:15}} onPress={()=>navigation.navigate("Register")}><Text style={{fontFamily:fontBold,textAlign:'center',color:'#757575'}}>Don't have an account? Register Now</Text></TouchableOpacity>
      </View>
    </View>
  )
})

Login.propTypes = {}

export default Login