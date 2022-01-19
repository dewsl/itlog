import React, {Fragment, useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import { Button } from 'react-native-paper';
import { systemWeights } from 'react-native-typography'
import DynaslopeLogo from '../assets/dynaslope_seal.png';
import PhivolcsLogo from '../assets/dost_seal.png';
import Fingerprint from '../assets/finger_print.png';
import { TextInput } from 'react-native-paper';

const Signin = (props) => {

    const navigator = props.navigation;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return(
        <Fragment>
            <View style={{flex: 1}}>
                <View style={{flex: 1, padding: 20, textAlign: 'center', justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', padding: 15}}>
                        <Image source={PhivolcsLogo} />
                        <Image source={DynaslopeLogo} />
                    </View>
                    <Text style={[systemWeights.bold, {fontSize: 25, paddingBottom: 10}]}>Internal Tracking Log</Text>
                    <View style={{width: '100%', padding: 10}}>
                        <TextInput
                            label="Username"
                            value={username}
                            selectionColor='#16526d'
                            outlineColor='#16526d'
                            activeOutlineColor='#16526d'
                            mode="outlined"
                            onChangeText={text => setUsername(text)}
                        />
                    </View>
                    <View style={{width: '100%', padding: 10}}>
                        <TextInput
                            label="Password"
                            value={password}
                            selectionColor='#16526d'
                            outlineColor='#16526d'
                            activeOutlineColor='#16526d'
                            mode="outlined"
                            onChangeText={text => setPassword(text)}
                        />
                    </View>
                    <View style={{width: '100%', padding: 10}}>
                        <Button mode="contained" style={{backgroundColor: '#16526d'}} onPress={() => {
                            navigator.navigate('Home');
                        }}>
                            Signin
                        </Button>
                    </View>
                    <View style={{flexDirection: 'row', padding: 15}}>
                        <View style={[systemWeights.light, {backgroundColor: '#16526d', height: 2, flex: 1, alignSelf: 'center'}]} />
                        <Text style={[systemWeights.light, { alignSelf:'center', paddingHorizontal:5, fontSize: 20 }]}>OR</Text>
                        <View style={[systemWeights.light, {backgroundColor: '#16526d', height: 2, flex: 1, alignSelf: 'center'}]} />
                    </View>
                    <Image source={Fingerprint} />
                    <Text style={[systemWeights.light]}>Scan Fingerprint to login</Text>
                </View>
            </View>
        </Fragment>
    )
}

export default Signin;