import * as React from 'react';
import { View } from 'react-native'
import { Switch, Text  } from 'react-native-paper';
import { human } from 'react-native-typography'

const CustomSwitch = (props) => {
  return(
    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={[human.headline, {color: '#fff', paddingTop: 0, paddingRight: 5}]}>
            {props.label}
        </Text>
        <Switch value={props.value} onValueChange={props.toggle} />
    </View>
  )
};

export default CustomSwitch;