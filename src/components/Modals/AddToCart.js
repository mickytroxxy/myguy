import React, { memo, useContext, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { AppContext } from '../../context/AppContext';
import AisInput from '../forms/AisInput';
import { AntDesign, Ionicons, FontAwesome} from "@expo/vector-icons";
const AddToCart = memo((props) => {
    const {productId} = props.attr;
    const {appState:{cart,setCart,setModalState}} = useContext(AppContext);
    const handleChange = (field,value) => setCart(cart.map(item => item.productId === productId ? {...item,[field]:value} : item));
    const handleQuantity = (status) => setCart(cart.map(item => item.productId === productId ? {...item,quantity : status === 'add' ? item.quantity + 1 : (item.quantity > 1 ? item.quantity - 1 : 1)} : item));
    return (
        <View>
            <View>
                <View style={{padding:30}}>
                    <AisInput attr={{field:'size',icon:{name:'md-resize',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:null,placeholder:'SIZE e.g XS, XL, 6, 7, 8',color:'#009387',handleChange}} />
                    <AisInput attr={{field:'color',icon:{name:'md-color-fill-outline',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:null,placeholder:'COLOR',color:'#009387',handleChange}} />
                    <AisInput attr={{field:'moreInfo',icon:{name:'list',type:'Ionicons',min:5,color:'#5586cc'},keyboardType:null,placeholder:'Additional Instructions',color:'#009387',handleChange}} />
                    <View style={{marginTop:30,flexDirection:'row'}}>
                        <TouchableOpacity onPress={()=> handleQuantity('add')} style={{alignContent:'center',alignItems:'center',justifyContent:'center',flex:1.8}}>
                            <Ionicons name='ios-add-circle-outline' size={48} color='green'></Ionicons>
                        </TouchableOpacity>
                            <View style={{flex:0.4}}></View>
                        <TouchableOpacity onPress={()=> handleQuantity('minus')} style={{alignContent:'center',alignItems:'center',justifyContent:'center',flex:1.8}}>
                            <AntDesign name='minuscircleo' size={40} color='tomato' />
                        </TouchableOpacity>
                    </View>
                    <View style={{alignItems:'center',marginTop:30}}>
                        <TouchableOpacity onPress={()=>setModalState({isVisible:false})}>
                            <FontAwesome name='check-circle' size={120} color="green"></FontAwesome>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
})

export default AddToCart