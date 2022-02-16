import React, { Fragment, useEffect, useState } from 'react';
import { View, ImageBackground, Text, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { systemWeights, human } from 'react-native-typography'
import { DataTable, shadow } from 'react-native-paper';
import BGThree from '../assets/bg3.png'
import Modal from "react-native-modal";
import CustomSwitch from '../utility/customSwitch';
import { getDataLoggerList, fetchAllLoggerRecords } from './apis/DataLoggerAPI';
import moment from "moment";

const DataLoggerHistory = () => {
    const image_length = 104;
    const [row, setRows] = useState(0);
    const [loggerList, setLoggerList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showInActive, setShowInActive] = useState(false);
    const [pressHold, setPressHold] = useState(false);
    const [imageThumbnail, setImageThumbnail] = useState(null);
    const [loggerRecords, setLoggerRecords] = useState(null);
    const [highlightedRecord, setHighlightedRecord] = useState(null);

    useEffect(()=> {
        getDataLoggerList(setLoggerList);
    }, []);

    const handleLongPress = (img_path) => {
        setPressHold(true);
        setImageThumbnail(img_path)
    }

    const fetchRecords = (props) => {
        fetchAllLoggerRecords(props, setLoggerRecords);
    }

    useEffect(()=> {
        if(loggerRecords) {
            if (loggerRecords.length > 0) {
                setHighlightedRecord(loggerRecords[0]);
                setShowModal(true)
            }
        }
    }, [loggerRecords])
    
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
                                    element.last_updated != null &&
                                        <TouchableOpacity key={element.logger_id} style={{flex: 1, justifyContent: 'flex-end', backgroundColor: element.img_path == null && `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`, height: 150, width: '100%'}} onPress={()=> {
                                            if (pressHold != true) {
                                                fetchRecords(element);
                                            }
                                        }}
                                        delayLongPress={5000}
                                        onLongPress={()=> {
                                            handleLongPress(`http://192.168.150.138:5000/${element.img_path}`)
                                        }}
                                        onPressOut={()=> {
                                            setPressHold(false);
                                            setImageThumbnail(null);
                                        }}>
                                            {
                                                element.img_path != null && <ImageBackground source={{uri: `http://192.168.150.138:5000/${element.img_path}`}} resizeMode='cover' style={{flex: 1}}>
                                                    <View style={{flex: 0.74}}/>
                                                    <View style={{flex: 0.26}}>
                                                        <View style={{alignItems: 'flex-end', justifyContent: 'flex-end', height: 40, width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)'}}>
                                                            <Text style={[systemWeights.semibold, {marginBottom: 0, marginRight: 5, color: '#465242'}]}>Logger: {element.logger_name.toUpperCase()}</Text>
                                                            <Text style={[systemWeights.semibold, {marginBottom: 5, marginRight: 5, color: '#465242'}]}>Last modification: {element.last_updated != null ? moment(element.last_updated).format("YYYY-MM-DD HH:mm:ss") : 'N/A'}</Text>
                                                        </View>
                                                    </View>
                                                </ImageBackground>
                                            }
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
                {
                    highlightedRecord != undefined && highlightedRecord != null &&
                        <View style={{ flex: 1 ,backgroundColor: 'white'}}>
                            <ScrollView>
                                <View style={{flex: 0.45, flexDirection: 'row', padding: 10}}>
                                    <View style={{flex: 0.5}}>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Logger name </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{highlightedRecord.logger_name == undefined ? "N/A" : highlightedRecord.logger_name.toUpperCase()}</Text>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Last Updated </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{highlightedRecord.last_updated == undefined ? "N/A" : moment(highlightedRecord.last_updated).format("YYYY-MM-DD HH:mm:ss")}</Text>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Type </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{highlightedRecord.equipment_name == undefined ? "N/A" : highlightedRecord.equipment_name}</Text>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Status </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{highlightedRecord.status == undefined ? "N/A" : highlightedRecord.status.toUpperCase()}</Text>
                                    </View>
                                    <View style={{flex: 0.5}}>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Remarks </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{highlightedRecord.remarks === "" ? "No remarks available" : highlightedRecord.remarks === null ? "No remarks available": highlightedRecord.remarks}</Text>
                                    </View>
                                </View>
                                <View style={{flex: 0.45, margin: 10}}>
                                <Text style={[systemWeights.bold, {fontSize: 25, textAlign: 'center', padding: 10, color: '#465242'}]}>Equipment Gallery</Text>
                                <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, textAlign: 'center', paddingRight: 10, color: '#465242'}]}>No photos available</Text>
                                </View>
                                <View style={{flex: 0.10, textAlign: 'center'}}>
                                    <View style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 5}}>
                                        <ScrollView horizontal={true}>
                                            <DataTable>
                                                <DataTable.Header>
                                                    <DataTable.Title style={{width: 100}}>Serial #</DataTable.Title>
                                                    <DataTable.Title style={{width: 250}}>Equipment type</DataTable.Title>
                                                    <DataTable.Title style={{width: 100}}>Logger name</DataTable.Title>
                                                    <DataTable.Title style={{width: 100}}>Status</DataTable.Title>
                                                    <DataTable.Title style={{width: 150}}>Last updated</DataTable.Title>
                                                </DataTable.Header>
                                                {
                                                    loggerRecords != null && loggerRecords.map((row)=> (
                                                        <DataTable.Row key={row.id}>
                                                            <DataTable.Cell style={{width: 100}}>{row.serial}</DataTable.Cell>
                                                            <DataTable.Cell style={{width: 250}}>{row.equipment_type.toUpperCase()}</DataTable.Cell>
                                                            <DataTable.Cell style={{width: 100}}>{row.logger_name.toUpperCase()}</DataTable.Cell>
                                                            <DataTable.Cell style={{width: 100}}>{row.status.toUpperCase()}</DataTable.Cell>
                                                            <DataTable.Cell style={{width: 150}}>{moment(row.last_updated).format("YYYY-MM-DD HH:mm:ss")}</DataTable.Cell>
                                                        </DataTable.Row>
                                                    ))
                                                }
                                            </DataTable>
                                        </ScrollView>
                                        <DataTable.Pagination
                                            page={0}
                                            numberOfPages={3}
                                            onPageChange={(page) => console.log(page)}
                                            label="1-2 of 6"
                                            optionsPerPage={0}
                                            itemsPerPage={0}
                                            showFastPagination
                                            optionsLabel={'Rows per page'}
                                        />
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    }
            </Modal>
            <Modal isVisible={pressHold}>
                <Image source={{uri: imageThumbnail}} resizeMode='cover' style={{flex: 1}} />
            </Modal>
        </Fragment>
    )
}

export default DataLoggerHistory;