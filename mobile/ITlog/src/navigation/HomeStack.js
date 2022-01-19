import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import EquipmentManager from '../component/EquipmentManager';
import DataLoggerHistory from '../component/DataLoggerHistory';

const Tab = createMaterialTopTabNavigator();

function HomeStack() {
    return (
        <Tab.Navigator
            lazyLoad={true}
            tabBarPosition='bottom'
            screenOptions={{
                tabBarInactiveTintColor: 'white',
                tabBarActiveTintColor   : '#f5981c',
                tabBarStyle: {
                    justifyContent: 'center',
                    backgroundColor: '#083451'
                }
            }}>
            <Tab.Screen name="EquipmentManagerNav"
                component={EquipmentManager} options={{
                    'tabBarLabel': 'Equipment Manager'
                }} />
            <Tab.Screen name="DataLoggerNav"
                component={DataLoggerHistory} options={{
                    'tabBarLabel': 'Data Logger History'
                }} />
        </Tab.Navigator>
    );
}

export default HomeStack;