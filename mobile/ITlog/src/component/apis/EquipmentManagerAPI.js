import RNFS from 'react-native-fs';

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

const insertEquiment = (data, callback, container, images) => {
    fetch('http://192.168.150.138:5000/api/equipment/add', {method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)})
            .then(response => response.json())
            .then(res => {
                // callback(res);
                // container()

                if (res.status === 200) {
                    uploadEquipmentFiles(images, data.logger_name)
                }
            })
}

const uploadEquipmentFiles = (images, logger_name) => {
    let fileupload = [];
    images.forEach(file => {
        fileupload.push({
            name: file.fileName,
            filename: file.fileName,
            filepath: file.uri.replace("file:///", ""),
            filetype: file.type,
            filesize: file.fileSize
        });
    });

    var uploadBegin = (response) => {
        var jobId = response.jobId;
        console.log('UPLOAD HAS BEGUN! JobId: ' + jobId);
    };
      
    var uploadProgress = (response) => {
        var percentage = Math.floor((response.totalBytesSent/response.totalBytesExpectedToSend) * 100);
        console.log('UPLOAD IS ' + percentage + '% DONE!');
    };

    RNFS.uploadFiles({
        toUrl: 'http://192.168.150.138:5000/storage/upload/equipment/site',
        files: fileupload,
        method: 'POST',
        headers: {
          'Accept': 'multipart/form-data',
        },
        fields: {
          'logger_name': logger_name,
        },
        begin: uploadBegin,
        progress: uploadProgress
      }).promise.then((response) => {
        // let data = JSON.parse(response.body);
        console.log(response)
        // return {
        //   'status': true,
        //   'message': 'Upload success!',
        //   'file_path': data.file_path
        // };
      }).catch((err) => {
          console.warn(err)
        //  return {
        //   'status': false,
        //   'message': `Upload failed! Err: ${err}`
        // }
    });
}

export {
    fetchEquipmentType,
    fetchLoggers,
    fetchEquipmentStatus,
    insertEquiment,
    fetchEquipmentList
}