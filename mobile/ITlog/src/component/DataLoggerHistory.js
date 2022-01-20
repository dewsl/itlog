import React, { Fragment, useEffect, useState } from 'react';
import { View, ImageBackground, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { systemWeights } from 'react-native-typography'
import BGThree from '../assets/bg3.png'

const DataLoggerHistory = () => {
    const image_length = 104;
    const [imageList, setImageList] = useState([]);
    const [row, setRows] = useState(0);

    useEffect(()=> {
        let temp = [];
        for (let x=1; x <=image_length; x++) {
            temp.push(x)
        }
        setImageList(temp);
        setRows(temp.length/4)
    }, []);

    return(
        <Fragment>
            <ImageBackground source={BGThree} resizeMode="stretch" style={{
                flex: 1,
                justifyContent: "center"
            }}>
                <View style={{flex: 1, padding: 10, height: '100%', width: '100%'}}>
                    <ScrollView>
                        {
                            imageList.length != 0 && imageList.map(element =>(
                                <View key={element} style={{flex: 1, justifyContent: 'flex-end', backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`, height: 150, width: '100%'}}>
                                    <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', height: 40, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
                                        <Text style={[systemWeights.semibold, {paddingBottom: 5}]}>Logger: {element} | Last modification: YYYY/MM/DD</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>
            </ImageBackground>
        </Fragment>
    )
}

export default DataLoggerHistory;