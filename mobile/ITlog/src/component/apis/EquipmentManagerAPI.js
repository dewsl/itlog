const fetchEquipmentType = (callback) => {
    fetch('http://192.168.150.138:5000/api/fetch/equipment-types')
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                callback(data.data);
            }
        })
}

const fetchEquipmentStatus = (callback) => {
    fetch('http://192.168.150.138:5000/api/fetch/equipment-status')
    .then(response => response.json())
    .then(data => {
        if (data.status === 200) {
            callback(data.data);
        }
    })
}

const fetchLoggers = (callback) => {
    fetch('http://192.168.150.138:5000/api/fetch/data-loggers-list')
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                callback(data.data);
            }
        })
}

const fetchEquipmentList = (callback) => {
    fetch('http://192.168.150.138:5000/api/fetch/equipment-list')
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                callback(data.data);
            }
        })
}

const insertEquiment = (data, callback, container) => {
    fetch('http://192.168.150.138:5000/api/equipment/add', {method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)})
            .then(response => response.json())
            .then(data => {
                callback(data);
                container()
            })
}

export {
    fetchEquipmentType,
    fetchLoggers,
    fetchEquipmentStatus,
    insertEquiment,
    fetchEquipmentList
}