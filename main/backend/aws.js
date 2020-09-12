// Load the SDK and UUID
const AWS = require('aws-sdk');
const fs = require('fs')
const UserNew = require('./models/User.js');
AWS.config.update({ region: 'us-east-1' });

const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

class AWSManager {
  constructor() { }
  createBucket = (BUCKET_NAME) => {
    s3.createBucket({ Bucket: BUCKET_NAME }, function (err, data) {
      if (err) console.log(err, err.stack)
      else {
        console.log('done', data.location)
      }
    })
  }

  uploadPhotoToBucket = (BUCKET_NAME) => {
    const photo_params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: fileContent
    };

    s3.upload(photo_params, function (err, data) {
      if (err) {
        throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
    });

  }
  createCollection = (parametros) => {
    rekognition.createCollection(parametros, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }

  deleteCollection = (parametros) => {
    rekognition.deleteCollection(parametros, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }

  addFace = (parametros) => {
    rekognition.indexFaces(parametros, function (err, data) {
      if (err) console.log('no', err);
      else console.log('ok', data);
    });
  }

  deleteFaces = (parametros) => {
    rekognition.deleteFaces(parametros, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }

  listCollections = (collection_params) => {
    rekognition.listCollections(collection_params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data['CollectionIds']);
    });
  }

  listCollectionsAndAddFaces = (collection_params, create_params, face_list, dni) => {
    var faceIdArray = []
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
    rekognition.listCollections(collection_params, function (err, data) {
      var check = false;
      if (err) console.log(err, err.stack);
      else {
        for (const key in data['CollectionIds']) {
          if (data['CollectionIds'].hasOwnProperty(key)) {
            const element = data['CollectionIds'][key];
            if (create_params.CollectionId == element) {
              check = true;
            }
          }
        }
        if(!check)
        {
          rekognition.createCollection(create_params, function (err, data) {
            if (err) console.log(err, err.stack);
            face_list.forEach(face => {
              var params = {
                CollectionId: create_params.CollectionId,
                Image: {
                  Bytes: Buffer.from(face)
                },
                ExternalImageId: dni,
                MaxFaces: 1
              };
              rekognition.indexFaces (params, async (err, data)=> {
                if (err) console.log('no', err);
                else{
                  data['FaceRecords'].forEach(element =>{
                    console.log(element['Face'].FaceId)
                    faceIdArray.push(element['Face'].FaceId)
                    
                  })
                  await UserNew.findOne({dni:dni}, function(err, doc){
                    var actualArray = doc.faceIds
                    for(var key in faceIdArray){
                      actualArray.push(faceIdArray[key])
                    }
                    var finalArray = actualArray.filter(onlyUnique);
                    doc.faceIds = finalArray
                    doc.save()
                  })
                }
              });
            });
          });
        }else{
          face_list.forEach(face => {
            var params = {
              CollectionId: create_params.CollectionId,
              Image: {
                Bytes: Buffer.from(face)
              },
              ExternalImageId: dni,
              MaxFaces: 1
            };
            rekognition.indexFaces(params, async (err, data)=> {
              if (err) console.log('no', err);
              else{
                data['FaceRecords'].forEach(element =>{
                  console.log(element['Face'].FaceId)

                  faceIdArray.push(element['Face'].FaceId)
                })
                await UserNew.findOne({dni:dni}, function(err, doc){
                  var actualArray = doc.faceIds
                  console.log(faceIdArray)
                  for(var key in faceIdArray){
                    actualArray.push(faceIdArray[key])
                  }
                  doc.faceIds = actualArray
                  doc.save()
                })
              }
            });
          });
        }
      }
    });
   
  }

  listFaces = (faces_params) => {
    rekognition.listFaces(faces_params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }

  searchByImage = (parametros) => {
    rekognition.searchFacesByImage(parametros, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });
  }

}
const manager = new AWSManager()
module.exports = manager