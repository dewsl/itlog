import React, { Fragment, useEffect, useState } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { systemWeights, human } from 'react-native-typography'
import BGThree from '../assets/bg3.png'
import Modal from "react-native-modal";
import CustomSwitch from '../utility/customSwitch';
import { getDataLoggerList } from './apis/DataLoggerAPI';
import moment from "moment";

const DataLoggerHistory = () => {
    const image_length = 104;
    const [row, setRows] = useState(0);
    const [loggerList, setLoggerList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showInActive, setShowInActive] = useState(false);
    const [pressHold, setPressHold] = useState(false);
    const [imageThumbnail, setImageThumbnail] = useState(null);

    useEffect(()=> {
        getDataLoggerList(setLoggerList);
    }, []);

    const handleLongPress = (img_path) => {
        setPressHold(true);
        setImageThumbnail(img_path)
    }
    
    return(
        <Fragment>
            <ImageBackground source={BGThree} resizeMode="stretch" style={{
                flex: 1,
                justifyContent: "center"
            }}>
                <View style={{flex: 1, padding: 10, height: '100%', width: '100%'}}>
                    <View style={{flex: 0.2, flexDirection: 'column', padding: 0}}>
                        <View style={{flex: 1}}>
                            <CustomSwitch value={showInActive} label="Show active loggers only" toggle={()=>{setShowInActive(!showInActive)}} />
                        </View>
                        <View style={{flex: 1,paddingBottom: 10}}>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <View style={{flex: 0.2}}>
                                    <Text style={[human.headline, {color: '#fff', paddingTop: 3, paddingRight: 5}]}>
                                        Search:
                                    </Text>
                                </View>
                                <View style={{flex: 0.8}}>
                                    <TextInput
                                        style={{
                                            backgroundColor: 'white',
                                            borderRadius: 5,
                                            paddingLeft: 10,
                                            paddingRight: 10
                                        }}
                                        placeholder="E.g. AGBSB / 2022/01/01"
                                        // onChangeText={onChangeText}
                                        // value={text}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 0.9}}>
                        <ScrollView>
                            {
                                loggerList.length != 0 && loggerList.map(element =>(
                                    <TouchableOpacity key={element.logger_id} style={{flex: 1, justifyContent: 'flex-end', backgroundColor: element.img_path == null && `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`, height: 150, width: '100%'}} onPress={()=> {
                                        if (pressHold != true) {
                                            setShowModal(!showModal)
                                        }
                                    }}
                                    onLongPress={()=> {
                                        handleLongPress(`http://192.168.1.2:5000/${element.img_path}`)
                                    }}
                                    onPressOut={()=> {
                                        setPressHold(false);
                                        setImageThumbnail(null);
                                    }}>
                                        {
                                            element.img_path != null && <Image source={{uri: `http://192.168.1.2:5000/${element.img_path}`}} resizeMode='cover' style={{flex: 1}} />
                                        }
                                        <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', height: 40, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)'}}>
                                            <Text style={[systemWeights.semibold, {marginBottom: 5, marginRight: 5}]}>Logger: {element.logger_name.toUpperCase()} | Last modification: {element.last_updated != null ? moment(element.last_updated).format("YYYY-MM-DD HH:mm:ss") : 'N/A'}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </ScrollView>
                    </View>
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
            <Modal isVisible={pressHold}>
                <Image source={{uri: imageThumbnail}} resizeMode='cover' style={{flex: 1}} />
            </Modal>
        </Fragment>
    )
}

export default DataLoggerHistory;