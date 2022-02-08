import React, { Fragment, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ImageBackground } from 'react-native';
import { DataTable, shadow, TextInput } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { systemWeights } from 'react-native-typography'
import { Divider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { IconButton, Colors } from 'react-native-paper';
import BGTwo from '../assets/bg2.png';
import { fetchEquipmentType, fetchLoggers } from './apis/EquipmentManagerAPI';
import DateTimePicker from '@react-native-community/datetimepicker';

const EquipmentManager = () => {
    const optionsPerPage = [2, 3, 4];
    const [page, setPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(optionsPerPage[0]);
    const [temp, setTemp] = useState("");

    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);

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

    useEffect(() => {
      setPage(0);
    }, [itemsPerPage]);

    useEffect(() => {
        fetchEquipmentType(setEquipmentTypes);
        fetchLoggers(setDataLoggers);
    }, [])
    
    useEffect(() => {
        let temp = [];
        if (equipmentTypes.length > 0) {
            equipmentTypes.forEach(element => {
                temp.push(element.equipment_name);
            });
        }
        setEquipmentList(temp);
    }, [equipmentTypes]);

    useEffect(() => {
        let temp = [];
        if (dataLoggers.length > 0) {
            dataLoggers.forEach(element => {
                temp.push(element.logger_name);
            });
        }
        setDataLoggerList(temp);
    }, [dataLoggers]);

    const handleDatePicker = (event, selectedDate) => {
        const currentDate = selectedDate || equipmentEntry.timestamp;
        setEquipmentEntry({...equipmentEntry, timestamp: currentDate});
        setShow(!show);
      };

    return(
        <Fragment>
            <ImageBackground source={BGTwo} resizeMode="stretch" style={{
                flex: 1,
                justifyContent: "center"
            }}>
            <ScrollView>
                <View style={{flex: 1, padding: 10}}>
                    <View style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 5}}>
                        <Text style={[systemWeights.light, {fontSize: 25, padding: 10}]}>Equipment Manager</Text>
                        <TextInput
                            mode="outlined"
                            label="Equipment ID"
                            value={equipmentEntry.equipment_id}
                            style={styles.textInput}
                            onChangeText={text => setEquipmentEntry({...equipmentEntry, equipment_id: text})}
                        />
                        <SelectDropdown
                            data={equipmentList}
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
                            data={['Active', 'In Active']}
                            defaultButtonText={"Status"}
                            onSelect={(selectedItem, index) => {
                                setEquipmentEntry({...equipmentEntry, status: selectedItem});
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
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
                            // onChangeText={text => setTemp(text)}
                            onFocus={()=> {
                                setShow(!show)
                            }}
                        />
                        <TextInput
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
                                onPress={() => console.log('Pressed')}
                            />
                            <Text style={[systemWeights.regular, {fontSize: 15, padding: 10}]}>Attach / Take photos</Text>
                        </View>
                        <Button icon="plus-thick" mode="contained" style={{backgroundColor: '#16526d', padding: 5, margin: 10}} onPress={() => {
                            // navigator.navigate('Home');
                        }}>
                            Add Equipment
                        </Button>
                    </View>
                    <View style={{padding: 20}}>
                        <Divider/>
                    </View>
                    <View style={{width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 5}}>
                        <Text style={[systemWeights.light, {fontSize: 25, padding: 10}]}>List of Equipments</Text>
                        <ScrollView horizontal={true}>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title style={{width: 150}}>Inventory ID</DataTable.Title>
                                    <DataTable.Title style={{width: 150}}>Equipment ID</DataTable.Title>
                                    <DataTable.Title style={{width: 200}}>Datalogger name</DataTable.Title>
                                    <DataTable.Title style={{width: 150, paddingLeft: '04%'}}>Action</DataTable.Title>
                                </DataTable.Header>
                                
                                <DataTable.Row>
                                    <DataTable.Cell style={{width: 150}}>1</DataTable.Cell>
                                    <DataTable.Cell style={{width: 150}}>1</DataTable.Cell>
                                    <DataTable.Cell style={{width: 200}}>AGBSB</DataTable.Cell>
                                    <DataTable.Cell style={{width: 150}}>
                                        <View style={{flexDirection: 'row'}}>
                                            <IconButton
                                                icon="content-save-edit"
                                                color={"#16526d"}
                                                size={20}
                                                onPress={() => console.log('Pressed')}
                                            />
                                            <IconButton
                                                icon="view-grid"
                                                color={"#16526d"}
                                                size={20}
                                                onPress={() => console.log('Pressed')}
                                            />
                                        </View>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        </ScrollView>
                        <DataTable.Pagination
                            page={page}
                            numberOfPages={3}
                            onPageChange={(page) => setPage(page)}
                            label="1-2 of 6"
                            optionsPerPage={optionsPerPage}
                            itemsPerPage={itemsPerPage}
                            setItemsPerPage={setItemsPerPage}
                            showFastPagination
                            optionsLabel={'Rows per page'}
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