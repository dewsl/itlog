const fetchEquipmentType = (callback) => {
    fetch('http://192.168.1.2:5000/api/fetch/equipment-types')
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                callback(data.data);
            }
        })
}

const fetchLoggers = (callback) => {
    fetch('http://192.168.1.2:5000/api/fetch/data-loggers-list')
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                callback(data.data);
            }
        })
}


export {
    fetchEquipmentType,
    fetchLoggers
}