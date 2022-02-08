import React, {Fragment, useEffect, useState} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground } from "react-native";
import { Button } from 'react-native-paper';
import { systemWeights } from 'react-native-typography'
import DynaslopeLogo from '../assets/dynaslope_seal.png';
import PhivolcsLogo from '../assets/dost_seal.png';
import Fingerprint from '../assets/finger_print.png';
import { TextInput } from 'react-native-paper';
import BGOne from '../assets/bg1.png';
import { signin } from './apis/UserManagementAPI';
import SweetAlert from 'react-native-sweet-alert';

const Signin = (props) => {

    const navigator = props.navigation;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [credentials, setCreds] = useState(null);

    const handleSignin = () => {
        signin({
            username: username,
            password: password
        }, setCreds);
    }

    useEffect(()=> {
        if (credentials) {
            console.log(credentials);
            if (credentials.ok == true) {
                SweetAlert.showAlertWithOptions({
                    title: 'Login success',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#000',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'success',
                    },
                    callback => navigator.navigate('Home'));
            } else {
                SweetAlert.showAlertWithOptions({
                    title: 'Login failed',
                    subTitle: 'Incorrect username/password provided',
                    confirmButtonTitle: 'Retry',
                    confirmButtonColor: '#ff0000',
                    otherButtonColor: '#ff0000',
                    style: 'error',
                  }, callback => setCreds(null));
            }
        }
    }, [credentials]);

    return(
        <Fragment>
            <ImageBackground source={BGOne} resizeMode="stretch" style={{
                flex: 1,
                justifyContent: "center"
            }}>
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
                            secureTextEntry={true}
                            onChangeText={text => setPassword(text)}
                        />
                    </View>
                    <View style={{width: '100%', padding: 10}}>
                        <Button mode="contained" style={{backgroundColor: '#16526d'}} onPress={() => {
                            handleSignin()
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
            </ImageBackground>
        </Fragment>
    )
}

export default Signin;