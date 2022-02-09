const getDataLoggerList = (callback) => {
    fetch('http://192.168.150.138:5000/api/fetch/dataloggers')
        .then(response => response.json())
        .then(data => {
            callback(data.data);
        })
}

export {
    getDataLoggerList
}