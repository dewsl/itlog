import React, { Fragment, useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground, PermissionsAndroid  } from 'react-native';
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
    fetchEquipmentList
} from './apis/EquipmentManagerAPI';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import SweetAlert from 'react-native-sweet-alert';

const EquipmentManager = () => {

    const [equipments, setEquipments] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);

    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [equipmentListTypes, setEquipmentListTypes] = useState([]);

    const [equipmentStatus, setEquipmentStatus] = useState([]);
    const [equipmentStatusList, setEquipmentStatusList] = useState([]);

    const [returnVal, setReturnVal] = useState(null);

    const [dataLoggers, setDataLoggers] = useState([]);
    const [dataLoggerList, setDataLoggerList] = useState([]);
    const [equipmentEntry, setEquipmentEntry] = useState({
        equipment_id: '',
        type: '',
        logger: '',
        status: false,
        timestamp: new Date(),
        remarks: ''
    })

    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const numberOfItemsPerPageList = [10, 15, 20];
    const [page, setPage] = useState(0);
    const [numberOfItemsPerPage, onItemsPerPageChange] = useState(numberOfItemsPerPageList[0]);
    const from = page * numberOfItemsPerPage;
    const to = Math.min((page + 1) * numberOfItemsPerPage, equipments.length);

    const [dataTableContent, setDataTableContent] = useState([]);

    const ref_input2 = useRef();

    useEffect(() => {
      setPage(0);
    }, [numberOfItemsPerPage]);

    useEffect(() => {
        fetchEquipmentList(setEquipments);
        fetchEquipmentType(setEquipmentTypes);
        fetchLoggers(setDataLoggers);
        fetchEquipmentStatus(setEquipmentStatus);
    }, [])
    
    useEffect(() => {
        let temp = [];
        if (equipmentTypes.length > 0) {
            equipmentTypes.forEach(element => {
                temp.push(element.equipment_name);
            });
        }
        setEquipmentListTypes(temp);
    }, [equipmentTypes]);

    useEffect(() => {
        let temp = [];
        if (equipmentStatus.length > 0) {
            equipmentStatus.forEach(element => {
                temp.push(element.status);
            });
        }
        setEquipmentStatusList(temp);
    }, [equipmentStatus]);

    useEffect(() => {
        let temp = [];
        if (dataLoggers.length > 0) {
            dataLoggers.forEach(element => {
                temp.push(element.logger_name);
            });
        }
        setDataLoggerList(temp);
    }, [dataLoggers]);

    useEffect(() => {
        let temp = [];
        if (dataLoggers.length > 0) {
            dataLoggers.forEach(element => {
                temp.push(element.logger_name);
            });
        }
        setDataLoggerList(temp);
    }, [dataLoggers]);

    useEffect(() => {
        if (returnVal) {
            if (returnVal.status === 200){ 
                SweetAlert.showAlertWithOptions({
                    title: 'New equipment added!',
                    confirmButtonTitle: 'OK',
                    confirmButtonColor: '#000',
                    otherButtonTitle: 'Cancel',
                    otherButtonColor: '#dedede',
                    style: 'success',
                    },
                    callback => {
                        resetForm();
                        setReturnVal(null);
                    });
            } else {
                SweetAlert.showAlertWithOptions({
                    title: 'Failed to add new equipment!',
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
        init(equipments);
    }, [equipments])

    useEffect(()=> {
        init(equipments)
    }, [from, to]);
    
    const submitEquipment = () => {
        let type_id = equipmentTypes.find(o => o.equipment_name === equipmentEntry.type).id;
        let status_id = equipmentStatus.find(o => o.status === equipmentEntry.status).id;
        let logger_id = dataLoggers.find(o => o.logger_name === equipmentEntry.logger).id;
        insertEquiment({
            type_id: type_id,
            status_id: status_id,
            logger_id: logger_id,
            date_last_updated: moment(equipmentEntry.timestamp).format('YYYY-MM-DD HH:mm:ss'),
            serial: equipmentEntry.equipment_id,
            remarks: equipmentEntry.remarks,
            storage_path: ''
        }, setReturnVal, ()=> {fetchEquipmentList(setEquipments)})
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
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
                    console.log('response', JSON.stringify(res));
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
        })
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
                                        onPress={() => console.log(row)}
                                    />
                                    <IconButton
                                        icon="view-grid"
                                        color={"#16526d"}
                                        size={20}
                                        onPress={() => console.log(row)}
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

    return(
        <Fragment>
            <ImageBackground source={BGTwo} resizeMode="stretch" style={{
                flex: 1,
                justifyContent: "center"
            }}>
            <ScrollView>
                <View style={{flex: 1, padding: 10}}>
                    <View style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 5}}>
                        <Text style={[systemWeights.light, {fontSize: 25, padding: 10, color: '#465242'}]}>Equipment Manager</Text>
                        <TextInput
                            mode="outlined"
                            label="Equipment ID"
                            value={equipmentEntry.equipment_id}
                            style={styles.textInput}
                            onChangeText={text => setEquipmentEntry({...equipmentEntry, equipment_id: text})}
                        />
                        <SelectDropdown
                            data={equipmentListTypes}
                            defaultButtonText={"Equipment Type"}
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
                            // key={index}
                            data={equipmentStatusList}
                            defaultButtonText={"Status"}
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
                        <Button icon="plus-thick" mode="contained" style={{backgroundColor: '#16526d', padding: 5, margin: 10}} onPress={submitEquipment}>
                            Add Equipment
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