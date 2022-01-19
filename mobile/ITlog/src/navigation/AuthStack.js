import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ForgotPassword from '../component/ForgotPassword';
import Signin from '../component/Signin';
import Signup from '../component/Signup';
import HomeStack from '../navigation/HomeStack';

const Stack = createStackNavigator();

function AuthStack() {
    return(
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Signin" options={{
                    header: () => null
                }} component={Signin} />
                <Stack.Screen name="Signup" options={{
                    title: 'Account Registration',
                    header: () => null
                }} component={Signup} />
                <Stack.Screen name="ForgotPassword"  options={{
                    title: 'Forgot Password',
                    header: () => null
                }} component={ForgotPassword} />
                <Stack.Screen name="Home"  options={{
                    title: 'Home',
                    header: () => null
                }} component={HomeStack} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AuthStack;