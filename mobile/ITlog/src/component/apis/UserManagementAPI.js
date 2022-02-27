const signin = (data, callback) => {
    fetch('http://192.168.0.13:5000/api/login', {method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)})
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
}

export {
    signin
}