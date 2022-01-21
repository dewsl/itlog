import React, { Fragment, useEffect, useState } from 'react';
import { View, ImageBackground, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { systemWeights } from 'react-native-typography'
import BGThree from '../assets/bg3.png'
import Modal from "react-native-modal";

const DataLoggerHistory = () => {
    const image_length = 104;
    const [imageList, setImageList] = useState([]);
    const [row, setRows] = useState(0);
    const [showModal, setShowModal] = useState(false);

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
                                <TouchableOpacity key={element} style={{flex: 1, justifyContent: 'flex-end', backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`, height: 150, width: '100%'}} onPress={()=> {
                                    console.log("PRESS ME")
                                    setShowModal(!showModal)
                                }}>
                                    <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', height: 40, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
                                        <Text style={[systemWeights.semibold, {marginBottom: 5, marginRight: 5}]}>Logger: {element} | Last modification: YYYY/MM/DD</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>
            </ImageBackground>
            <Modal isVisible={showModal}
                onBackdropPress={()=> {setShowModal(!showModal)}}
                onBackButtonPress={()=> {setShowModal(!showModal)}}
                onSwipeComplete={() => {setShowModal(!showModal)}}
                swipeDirection="down">
                <View style={{ flex: 1,backgroundColor: 'white' }}>
                <Text>I am the modal content!</Text>
                </View>
            </Modal>
        </Fragment>
    )
}

export default DataLoggerHistory;