const getDataLoggerList = (callback) => {
    fetch('http://192.168.0.13:5000/api/fetch/dataloggers')
        .then(response => response.json())
        .then(data => {
            callback(data.data);
    })
}


const fetchAllLoggerRecords = (data, callback) => {
    console.log( JSON.stringify(data))
    fetch('http://192.168.0.13:5000/api/fetch/all-datalogger-records', {method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)})
            .then(response => response.json())
            .then(data => {
                callback(data.data);
            })
}

export {
    getDataLoggerList,
    fetchAllLoggerRecords
}