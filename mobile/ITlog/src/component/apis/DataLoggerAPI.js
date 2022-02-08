const getDataLoggerList = (callback) => {
    fetch('http://192.168.1.2:5000/api/fetch/dataloggers')
        .then(response => response.json())
        .then(data => {
            callback(data.data);
        })
}

export {
    getDataLoggerList
}