import AsyncStorage from '@react-native-community/async-storage';

const storeData = async (key , data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.log("ERROR: ", e);
  }
}

const getData = async (key, callback) => {
    try {
      const value = await AsyncStorage.getItem(key)
      if(value !== null) {
        callback(JSON.parse(value))
      }
    } catch(e) {
        console.log("ERROR: ", e);
    }
  }

export {
    storeData,
    getData
}