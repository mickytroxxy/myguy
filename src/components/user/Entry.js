import React, { memo, useContext } from 'react'
import { View } from 'react-native'
import { AppContext } from '../../context/AppContext'
import Login from './Login';
import Profile from './Profile';

const Entry = memo(({navigation}) => {
    const {appState:{accountInfo}} = useContext(AppContext);
    return (
        <View>
            {accountInfo ? <Profile navigation={navigation} /> : <Login navigation={navigation} />}
        </View>
    )
})

export default Entry