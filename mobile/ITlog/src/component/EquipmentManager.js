import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, PermissionsAndroid, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { DataTable, shadow, TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { systemWeights } from 'react-native-typography'
import { Divider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { IconButton, Colors } from 'react-native-paper';
import BGTwo from '../assets/bg2.png';
import { 
    fetchEquipmentType, 
    fetchLoggers, 
    fetchEquipmentStatus, 
    insertEquiment,
    updateEquipment,
    fetchEquipmentList
} from './apis/EquipmentManagerAPI';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SweetAlert from 'react-native-sweet-alert';
import Modal from "react-native-modal";
import Ping from 'react-native-ping';

import { storeData, getData } from '../utility/cache';

const EquipmentManager = () => {

    const [equipments, setEquipments] = useState([]);

    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [equipmentListTypes, setEquipmentListTypes] = useState([]);

    const [equipmentStatus, setEquipmentStatus] = useState([]);
    const [equipmentStatusList, setEquipmentStatusList] = useState([]);

    const [returnVal, setReturnVal] = useState(null);

    const [selectedEquipment, setSelectedEquipment] = useState(null);

    const [dataLoggers, setDataLoggers] = useState([]);
    const [dataLoggerList, setDataLoggerList] = useState([]);
    const [equipmentEntry, setEquipmentEntry] = useState({
        equipment_id: '',
        type: '',
        logger: '',
        status: false,
        timestamp: new Date(),
        remarks: ''
    });

    const [imageFiles, setImageFiles] = useState([]);

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const numberOfItemsPerPageList = [10, 15, 20];
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const from = page * numberOfItemsPerPage;
    const to = Math.min((page + 1) * numberOfItemsPerPage, equipments.length);

    const [pressHold, setPressHold] = useState(false);
    const [imageThumbnail, setImageThumbnail] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const [isConnected, setIsConnected] = useState(false);
    const [isSyncing, setIsSyncing] = useState(true);

    const [dataTableContent, setDataTableContent] = useState([
        <View key={0}>
            <Text style={{ textAlign: 'center' }}>Fetching equipments...</Text>
        </View>
    ]);

    const [showModal, setShowModal] = useState(false);

    const ref_input2 = useRef();
    const ref_input1 = useRef();
    const scrollRef = useRef();

    const CheckConnectivity = async () => {
        let status = null;
        try {
            const ms = await Ping.start('192.168.0.13',{ timeout: 1000 });
            status = true;
            setIsConnected(true);
          } catch (error) {
            status = false;
            setIsConnected(false);
          } finally {
            if (status) {
                syncLocalToDB();
                initializeData(status);
            } else {
                SweetAlert.showAlertWithOptions({
                    title: 'Cannot connect to server!',
                    subTitle: 'Local data will be used.',
                    confirmButtonTitle: 'Continue',
                    confirmButtonColor: 'red',
                    otherButtonColor: '#ff0000',
                    style: 'error',
                    showCancelButton: false,
                    showConfirmButton: true
                    },
                    callback => {
                        loadCachedData();
                    });
            }
          }
    }

    useEffect(() => {
      setPage(0);
    }, [numberOfItemsPerPage]);

    useEffect(() => {
        CheckConnectivity();
    }, []);
    
    const loadCachedData = () => {
        getData('equipmentListTypes', (value)=> {
            setEquipmentListTypes(value);
        });
        getData('equipmentStatusList', (value)=> {
            setEquipmentStatusList(value)
        });
        getData('dataLoggerList', (value)=> {
            setDataLoggerList(value)
        });
        getData('equipments', (value)=> {
            setEquipments(value)
        });

        getData('equipmentTypes', (value)=> {
            setEquipmentTypes(value);
        });
        getData('equipmentStatus', (value)=> {
            setEquipmentStatus(value)
        });
        getData('dataLoggers', (value)=> {
            setDataLoggers(value)
        });
        setIsSyncing(false);
    }

    const initializeData = (status) => {
        if (status) {
            console.warn("CONNECTED")
            fetchEquipmentList(setEquipments);
            fetchEquipmentType(setEquipmentTypes);
            fetchLoggers(setDataLoggers);
            fetchEquipmentStatus(setEquipmentStatus);
            setIsSyncing(false);
        } else {
            console.warn("NOT CONNECTED")
        }
    }

    const syncLocalToDB = () => {
        getData('equipments', (value)=> {
            value.forEach(element => {
                if ('isLocal' in element) {
                    if ('id' in element) {
                        updateEquipment({
                            id: element.id,
                            type_id: element.type_id,
                            status_id: element.status_id,
                            logger_id: element.logger_id,
                            date_last_updated: moment(element.date_last_updated).format('YYYY-MM-DD HH:mm:ss'),
                            serial: element.serial,
                            remarks: element.remarks,
                        }, ()=> {}, ()=> {fetchEquipmentList(setEquipments)});
                    } else {
                        insertEquiment({
                            type_id: element.type_id,
                            status_id: element.status_id,
                            logger_id: element.logger_id,
                            date_last_updated: moment(element.date_last_updated).format('YYYY-MM-DD HH:mm:ss'),
                            serial: element.serial,
                            remarks: element.remarks,
                            storage_path: element.storage_path,
                            logger_name: element.logger_name
                        }, ()=> {}, ()=> {fetchEquipmentList(setEquipments)}, element.imageFiles)
                    }
                }
            });
        });
    }

    useEffect(() => {
        if (isConnected != false) {
            if (isSyncing == false) {
                let temp = [];
                if (equipmentTypes.length > 0) {
                    equipmentTypes.forEach(element => {
                        temp.push(element.equipment_name);
                    });
                }
                setEquipmentListTypes(temp);
                storeData('equipmentListTypes', temp);
                storeData('equipmentTypes', equipmentTypes);
                console.warn("equipmentTypes is Cached.....")
            }
        }
    }, [equipmentTypes, isConnected, isSyncing]);

    useEffect(() => {
        if (isConnected != false) {
            if (isSyncing == false) {
                let temp = [];
                if (equipmentStatus.length > 0) {
                    equipmentStatus.forEach(element => {
                        temp.push(element.status);
                    });
                }
                setEquipmentStatusList(temp);
                storeData('equipmentStatusList', temp);
                storeData('equipmentStatus', equipmentStatus);
                console.warn("equipmentStatusList is Cached.....")
            }

        }

    }, [equipmentStatus, isConnected, isSyncing]);

    useEffect(() => {
        if (isConnected != false)  {
            if (isSyncing == false) {
                let temp = [];
                if (dataLoggers.length > 0) {
                    dataLoggers.forEach(element => {
                        temp.push(element.logger_name);
                    });
                }
                setDataLoggerList(temp);
                storeData('dataLoggerList', temp);
                storeData('dataLoggers', dataLoggers);
                console.warn("dataLoggerList is Cached.....")
            }
        }

    }, [dataLoggers, isConnected, isSyncing]);

    useEffect(() => {
        if (returnVal) {
            if (returnVal.status === 200){ 
                SweetAlert.showAlertWithOptions({
                    title: isUpdate ? 'Equipment updated!' : 'New equipment added!',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#000',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'success',
                    },
                    callback => {
                        resetForm();
                        setReturnVal(null);
                        setIsUpdate(false);
                    });
            } else {
                SweetAlert.showAlertWithOptions({
                    title: `Failed to ${isUpdate ? 'update':'add'} new equipment!`,
                    subTitle: 'Please fill up all fields.',
                    confirmButtonTitle: 'Retry',
                    confirmButtonColor: '#ff0000',
                    otherButtonColor: '#ff0000',
                    style: 'error',
                  }, callback => setReturnVal(null));
            }
        }
    }, [returnVal]);

    useEffect(() => {
        if (isConnected == true) {
            if (isSyncing == false) {
                storeData('equipments', equipments);
                init(equipments);
            }
        } else {
            setDataTableContent([]);
            init(equipments);
        }
    }, [equipments, 
        isConnected, 
        equipmentListTypes, 
        equipmentStatusList, 
        dataLoggerList,
        dataLoggers,
        equipmentTypes,
        equipmentStatus,
        isSyncing
    ])

    useEffect(()=> {
        if (isSyncing == false) {
            init(equipments)
        }
    }, [from, to, isSyncing]);
    
    const submitEquipment = () => {
        let type_id = equipmentTypes.find(o => o.equipment_name === equipmentEntry.type).id;
        let status_id = equipmentStatus.find(o => o.status === equipmentEntry.status.toLowerCase()).id;
        let logger_id = dataLoggers.find(o => o.logger_name === equipmentEntry.logger.toLowerCase()).id;
        let storage_path = [];

        if (isUpdate) {
            if (isConnected == true) {
                updateEquipment({
                    id: equipmentEntry.id,
                    type_id: type_id,
                    status_id: status_id,
                    logger_id: logger_id,
                    date_last_updated: moment(equipmentEntry.timestamp).format('YYYY-MM-DD HH:mm:ss'),
                    serial: equipmentEntry.equipment_id,
                    remarks: equipmentEntry.remarks,
                }, setReturnVal, ()=> {fetchEquipmentList(setEquipments)});
            } else {
                const index = equipments.findIndex(o => o.id === equipmentEntry.id)
                let temp = [...equipments];
                temp[index] = {
                    id: equipmentEntry.id,
                    type_id: type_id,
                    status_id: status_id,
                    logger_id: logger_id,
                    date_last_updated: moment(equipmentEntry.timestamp).format('YYYY-MM-DD HH:mm:ss'),
                    serial: equipmentEntry.equipment_id,
                    remarks: equipmentEntry.remarks,
                    isLocal: true
                };
                setEquipments(temp);
                storeData('equipments', temp);
                setReturnVal({
                    status: 200
                });
            }
        } else {
    
            imageFiles.forEach(element => {
                storage_path.push(`storage/${equipmentEntry.logger}/${element.fileName}`)
            });
            if (isConnected == true) {
                insertEquiment({
                    type_id: type_id,
                    status_id: status_id,
                    logger_id: logger_id,
                    date_last_updated: moment(equipmentEntry.timestamp).format('YYYY-MM-DD HH:mm:ss'),
                    serial: equipmentEntry.equipment_id,
                    remarks: equipmentEntry.remarks,
                    storage_path: JSON.stringify(storage_path),
                    logger_name: equipmentEntry.logger
                }, setReturnVal, ()=> {fetchEquipmentList(setEquipments)}, imageFiles)
            } else {
                let temp = [...equipments];
                temp.push({
                    type_id: type_id,
                    status_id: status_id,
                    logger_id: logger_id,
                    date_last_updated: moment(equipmentEntry.timestamp).format('YYYY-MM-DD HH:mm:ss'),
                    serial: equipmentEntry.equipment_id,
                    remarks: equipmentEntry.remarks,
                    storage_path: JSON.stringify(storage_path),
                    logger_name: equipmentEntry.logger,
                    isLocal: true,
                    imageFiles: imageFiles
                });
                setEquipments(temp);
                storeData('equipments', temp);
                setReturnVal({
                    status: 200
                });
            }
        }
    }

    const handleDatePicker = (event, selectedDate) => {
        const currentDate = selectedDate || equipmentEntry.timestamp;
        setEquipmentEntry({...equipmentEntry, timestamp: currentDate});
        setShow(false);
    };

    const initializeCamera = async () => {

        let options = {
            title: 'Select Image',
            customButtons: [
              { 
                name: 'customOptionKey', 
                title: 'Choose file from Custom Option' 
              },
            ],
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
            saveToPhotos: isConnected ? false : true
        };


        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "App Camera Permission",
                    message:"App needs access to your camera ",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            const external = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                 'title': 'Open mo yung permission gago!',
                 'message': 'Pano ko issave to gago?',
                 buttonNeutral: "Ask Me Later",
                 buttonNegative: "Cancel",
                 buttonPositive: "OK"
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED && external === PermissionsAndroid.RESULTS.GRANTED) {
                console.warn("options:", options)
                launchCamera(options, (res) => {
                    if (res.didCancel) {
                        console.log('User cancelled image picker');
                    } else if (res.error) {
                        console.log('ImagePicker Error: ', res.error);
                    } else if (res.customButton) {
                        console.log('User tapped custom button: ', res.customButton);
                        alert(res.customButton);
                    } else {
                        const source = { uri: res.uri };
                        setImageFiles([...imageFiles, res.assets[0]]);
                    }
                });
            } else {
            console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const resetForm = () => {
        setEquipmentEntry({
            equipment_id: '',
            type: '',
            logger: '',
            status: false,
            timestamp: new Date(),
            remarks: ''
        });
        setImageFiles([]);
    }

    const init = (data) => {
        let temp = [];
        if (data == undefined) {
            temp.push(
                <View key={0}>
                    <Text style={{ textAlign: 'center' }}>No local data available.</Text>
                </View>
            )
        } else {
            if (data.length != 0) {
                data.slice(from,to).forEach(row => {
                    temp.push(
                        <DataTable.Row key={row.id}>
                            <DataTable.Cell style={{width: 100}}>{row.serial}</DataTable.Cell>
                            <DataTable.Cell style={{width: 250}}>{ equipmentTypes.find(o => o.id === row.type_id) === undefined ? "N/A": equipmentTypes.find(o => o.id === row.type_id).equipment_name}</DataTable.Cell>
                            <DataTable.Cell style={{width: 100}}>{ dataLoggers.find(o => o.id === row.logger_id) === undefined ? "N/A": dataLoggers.find(o => o.id === row.logger_id).logger_name.toUpperCase()}</DataTable.Cell>
                            <DataTable.Cell style={{width: 100}}>{ equipmentStatus.find(o => o.id === row.status_id) === undefined ? "N/A": equipmentStatus.find(o => o.id === row.status_id).status.toUpperCase()}</DataTable.Cell>
                            <DataTable.Cell style={{width: 150}}>{moment(row.date_last_updated).format("YYYY-MM-DD HH:mm:ss")}</DataTable.Cell>
                            <DataTable.Cell style={{width: 150}}>
                                <View style={{flexDirection: 'row'}}>
                                    <IconButton
                                        icon="content-save-edit"
                                        color={"#16526d"}
                                        size={20}
                                        onPress={() => {
                                            handleUpdate(row);
                                            setIsUpdate(true);
                                        }}
                                    />
                                    <IconButton
                                        icon="view-grid"
                                        color={"#16526d"}
                                        size={20}
                                        onPress={() => {
                                            handleView(row);
                                            setIsUpdate(true);
                                        }}
                                    />
                                </View>
                            </DataTable.Cell>
                        </DataTable.Row>
                    )
                });
            } else {
                temp.push(
                    <View key={0}>
                        <Text style={{ textAlign: 'center' }}>No available data.</Text>
                    </View>
                )
            }
        }
        setDataTableContent(temp)
    }

    useEffect(()=> {
        
    }, [isConnected])

    const handleUpdate = (props) => {
        setEquipmentEntry({
            equipment_id: props.serial,
            type:  equipmentTypes.find(o => o.id === props.type_id).equipment_name,
            logger: dataLoggers.find(o => o.id === props.logger_id).logger_name.toUpperCase(),
            status: equipmentStatus.find(o => o.id === props.status_id).status.toUpperCase(),
            timestamp: new Date(props.date_last_updated),
            remarks: props.remarks,
            is_update: true,
            id: props.id
        });

        setShowModal(false);
        ref_input1.current.focus()
        scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    }

    const handleView = (props) => {
        setSelectedEquipment(props);
        setShowModal(!show);
    }

    const handleImageViewer = (img_path) => {
        setPressHold(true);
        setImageThumbnail(img_path)
    }

    const handleImageRemove = (image_details) => {
        if (imageFiles.length > 0) {
            let temp = imageFiles;
            let image_index = imageFiles.findIndex(o => o.uri === image_details.uri);
            let new_list = temp.splice(image_index, 1);
            setImageFiles(temp);
        }
        handleCloseViewer();
    }

    const handleCloseViewer = () => {
        setPressHold(false);
        setImageThumbnail(null);
    }
    
    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        
        wait(3000).then(() => 
            {
                CheckConnectivity();
                setRefreshing(false);
            }
        );
      }, []);

    return(
        <Fragment>
            <ImageBackground source={BGTwo} resizeMode="stretch" style={{
                flex: 1,
                justifyContent: "center"
            }}>
            <ScrollView
                ref={scrollRef}
                refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }>
                <View style={{flex: 1, padding: 10}}>
                    <View style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 5}}>
                        <Text style={[systemWeights.light, {fontSize: 25, padding: 10, color: '#465242'}]}>Equipment Manager</Text>
                        <TextInput
                            ref={ref_input1}
                            mode="outlined"
                            label="Equipment ID"
                            value={equipmentEntry.equipment_id}
                            style={styles.textInput}
                            onChangeText={text => setEquipmentEntry({...equipmentEntry, equipment_id: text})}
                        />
                        <SelectDropdown
                            data={equipmentListTypes}
                            defaultButtonText={"Equipment Type"}
                            defaultValue={equipmentEntry.type ? equipmentEntry.type : ''}
                            onSelect={(selectedItem, index) => {
                                setEquipmentEntry({...equipmentEntry, type: selectedItem});
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.toUpperCase()
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.toUpperCase()
                            }}
                            buttonStyle={styles.dropdown1BtnStyle}
                            buttonTextStyle={styles.dropdown1BtnTxtStyle}
                            renderDropdownIcon={() => {
                                return (
                                    <FontAwesome name="chevron-down" color={"#444"} size={18} />
                                );
                            }}
                            dropdownIconPosition={"right"}
                            dropdownStyle={styles.dropdown1DropdownStyle}
                            rowStyle={styles.dropdown1RowStyle}
                        />
                        <SelectDropdown
                            data={dataLoggerList}
                            defaultButtonText={"Data Logger name"}
                            defaultValue={equipmentEntry.logger ? equipmentEntry.logger.toLowerCase() : ''}
                            onSelect={(selectedItem, index) => {
                                setEquipmentEntry({...equipmentEntry, logger: selectedItem});
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.toUpperCase()
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.toUpperCase()
                            }}
                            buttonStyle={styles.dropdown1BtnStyle}
                            buttonTextStyle={styles.dropdown1BtnTxtStyle}
                            renderDropdownIcon={() => {
                                return (
                                    <FontAwesome name="chevron-down" color={"#444"} size={18} />
                                );
                            }}
                            dropdownIconPosition={"right"}
                            dropdownStyle={styles.dropdown1DropdownStyle}
                            rowStyle={styles.dropdown1RowStyle}
                        />
                        <SelectDropdown
                            data={equipmentStatusList}
                            defaultButtonText={"Status"}
                            defaultValue={equipmentEntry.status ? equipmentEntry.status.toLowerCase() : ''}
                            onSelect={(selectedItem, index) => {
                                setEquipmentEntry({...equipmentEntry, status: selectedItem});
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.toUpperCase()
                            }}
                            rowTextForSelection={(item, index) => {
                                return item.toUpperCase()
                            }}
                            buttonStyle={styles.dropdown1BtnStyle}
                            buttonTextStyle={styles.dropdown1BtnTxtStyle}
                            renderDropdownIcon={() => {
                                return (
                                    <FontAwesome name="chevron-down" color={"#444"} size={18} />
                                );
                            }}
                            dropdownIconPosition={"right"}
                            dropdownStyle={styles.dropdown1DropdownStyle}
                            rowStyle={styles.dropdown1RowStyle}
                        />
                        <TextInput
                            mode="outlined"
                            label="Timestamp"
                            style={styles.textInput}
                            value={moment(equipmentEntry.timestamp).format("YYYY/MM/DD HH:mm:ss")}
                            onFocus={()=> {
                                setShow(true);
                                ref_input2.current.focus()
                            }}
                        />
                        <TextInput
                            ref={ref_input2}
                            mode="outlined"
                            multiline={true}
                            label="Remarks"
                            value={equipmentEntry.remarks}
                            style={[styles.textInput, {height: 200}]}
                            onChangeText={text => setEquipmentEntry({...equipmentEntry, remarks: text})}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <IconButton
                                icon="camera"
                                color={"#16526d"}
                                size={30}
                                onPress={initializeCamera}
                            />
                            <Text style={[systemWeights.regular, {fontSize: 15, padding: 10, color: '#465242'}]}>Attach / Take photos</Text>
                        </View>
                        <View style={{flex: 0.45, margin: 10}}>
                            <Text style={[systemWeights.bold, {fontSize: 25, textAlign: 'center', padding: 10, color: '#465242', width: '100%'}]}>Equipment Gallery</Text>
                                <ScrollView horizontal={true}>
                                    {
                                        imageFiles.length > 0 &&
                                            imageFiles.map((image)=> (
                                                <TouchableOpacity style={{padding: 5}}
                                                    onPress={()=> {
                                                        handleImageViewer(image)
                                                    }}>
                                                    <Image source={{uri: image.uri}} resizeMode='cover' style={{flex: 1, height: 50, width: 50}} />
                                                </TouchableOpacity>
                                            ))
                                    }
                                </ScrollView>
                                {
                                    imageFiles.length == 0 && <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, textAlign: 'center', paddingRight: 10, color: '#465242'}]}>No photos taken yet</Text>
                                }
                        </View>
                        <Button icon="plus-thick" mode="contained" style={{backgroundColor: '#16526d', padding: 5, margin: 10}} onPress={submitEquipment}>
                            { isUpdate ? 'Update Equipment' : 'Add Equipment'}
                        </Button>
                    </View>
                    <View style={{padding: 20}}>
                        <Divider/>
                    </View>
                    <View style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 5}}>
                        <Text style={[systemWeights.light, {fontSize: 25, padding: 10, color: '#465242'}]}>List of Equipments</Text>
                        <ScrollView horizontal={true}>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title style={{width: 100}}>Serial #</DataTable.Title>
                                    <DataTable.Title style={{width: 250}}>Equipment type</DataTable.Title>
                                    <DataTable.Title style={{width: 100}}>Logger name</DataTable.Title>
                                    <DataTable.Title style={{width: 100}}>Status</DataTable.Title>
                                    <DataTable.Title style={{width: 150}}>Last updated</DataTable.Title>
                                    <DataTable.Title style={{width: 150, paddingLeft: '04%'}}>Action</DataTable.Title>
                                </DataTable.Header>
                                { dataTableContent }
                            </DataTable>
                        </ScrollView>
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(equipments.length / numberOfItemsPerPage)}
                            onPageChange={page => setPage(page)}
                            label={`${from + 1}-${to} of ${equipments.length}`}
                            showFastPaginationControls
                            numberOfItemsPerPage={numberOfItemsPerPage}
                            onItemsPerPageChange={onItemsPerPageChange}
                        />
                    </View>
                </View>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={equipmentEntry.timestamp}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={handleDatePicker}
                    />
                )}
            </ScrollView>
            </ImageBackground>
            <Modal isVisible={showModal}
                onBackdropPress={()=> {
                    setShowModal(!showModal);
                }}
                onBackButtonPress={()=> {
                    setShowModal(!showModal);
                }}
                onSwipeComplete={() => {
                    setShowModal(!showModal);
                }}
                swipeDirection="down">
                    {
                        selectedEquipment != null &&
                            <View style={{ flex: 1 ,backgroundColor: 'white'}}>
                                <View style={{flex: 0.45, flexDirection: 'row', padding: 10}}>
                                    <View style={{flex: 0.5}}>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Logger name </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{dataLoggers.find(o => o.id === selectedEquipment.logger_id).logger_name.toUpperCase()}</Text>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Last Updated </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{moment(selectedEquipment).format("YYYY-MM-DD HH:mm:ss")}</Text>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Type </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{equipmentTypes.find(o => o.id === selectedEquipment.type_id).equipment_name}</Text>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Status </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{equipmentStatus.find(o => o.id === selectedEquipment.status_id).status.toUpperCase()}</Text>
                                    </View>
                                    <View style={{flex: 0.5}}>
                                        <Text style={[systemWeights.bold, {fontSize: 15, padding: 10, color: '#465242'}]}>Remarks </Text>
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, paddingRight: 10, color: '#465242'}]}>{selectedEquipment.remarks === "" ? "No remarks available" : selectedEquipment.remarks === null ? "No remarks available": selectedEquipment.remarks}</Text>
                                    </View>
                                </View>
                                <View style={{flex: 0.09, margin: 10}}>
                                    <View style={{flex: 1}}>
                                        <Text style={[systemWeights.bold, {fontSize: 25, textAlign: 'center', padding: 10, color: '#465242'}]}>Equipment Gallery</Text>
                                    </View>
                                </View>
                                <View style={{flex: 0.3, margin: 10}}>
                                {
                                    JSON.parse(selectedEquipment.storage_path).length == 0 ?
                                        <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, textAlign: 'center', paddingRight: 10, color: '#465242'}]}>No photos available</Text>
                                    :
                                    <View style={{flexDirection: 'row', width: '100%'}}>
                                        <ScrollView horizontal={true}>
                                            {
                                                JSON.parse(selectedEquipment.storage_path).map((image)=> (
                                                    <TouchableOpacity style={{padding: 5, minHeight: 150, minWidth: 150}}
                                                        onPress={()=> {
                                                            handleImageViewer({
                                                                uri: `http://192.168.0.13:5000/${image}`
                                                            })
                                                        }}>
                                                        <Image source={{uri: `http://192.168.0.13:5000/${image}`}} resizeMode='cover' style={{flex: 1, height: 150, width: 150}} />
                                                    </TouchableOpacity>
                                                ))
                                            }
                                        </ScrollView>
                                    </View>
                                    }
                                </View>
                                <View style={{flex: 0.2, textAlign: 'center', justifyContent: 'flex-end'}}>
                                    <Button icon="content-save-edit" mode="contained" style={{backgroundColor: '#16526d', padding: 5, margin: 10}} onPress={()=> {
                                        handleUpdate(selectedEquipment);
                                    }}>
                                        Update Equipment
                                    </Button>
                                </View>
                        </View>
                    }
            </Modal>
            <Modal isVisible={pressHold} 
                                onBackdropPress={()=> {
                                    handleCloseViewer()}}
                                onBackButtonPress={()=> {
                                    handleCloseViewer()}}
                                onSwipeComplete={() => {
                                    handleCloseViewer()}}
                                swipeDirection="down">
                {
                    imageThumbnail != null && 
                        <ImageBackground source={{uri: imageThumbnail.uri}} resizeMode='cover' style={{flex: 1}} >
                            <View style={{flex: 1}}/>
                            <Button icon="delete-forever" mode="contained" style={{backgroundColor: '#16526d', padding: 5, margin: 10}} disabled={isUpdate} onPress={()=> {
                                handleImageRemove(imageThumbnail);
                            }}>
                                Remove Photo
                            </Button>
                        </ImageBackground>
                }
            </Modal>
            <Modal isVisible={isSyncing}>
                <View style={{flex: 1, height: '100%', width: '100%', justifyContent: 'center'}}>
                    <Text style={[systemWeights.light, {fontSize: 18, paddingLeft: 10, textAlign: 'center', paddingRight: 10, color: 'white'}]}>Syncing...</Text>
                </View>
            </Modal>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    dropdown1BtnStyle: {
        width: "95%",
        height: 50,
        backgroundColor: "#f6f6f6",
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: "#a6a6a6",
        margin: 10,
      },
      dropdown1BtnTxtStyle: { color: "#717171", textAlign: "left", fontSize: 15 },
      dropdown1DropdownStyle: { backgroundColor: "#EFEFEF" },
      dropdown1RowStyle: {
        backgroundColor: "#f6f6f6",
        borderBottomColor: "#a6a6a6",
      },
      dropdown1RowTxtStyle: { color: "#444", textAlign: "left" },
      textInput: {height: 45, fontSize: 15, paddingRight: 2, margin: 10}
});

export default EquipmentManager;