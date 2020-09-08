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
      Key: filename, // File name you want to save as in S3
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
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  }

  deleteCollection = (parametros) => {
    rekognition.deleteCollection(parametros, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  }

  addFace = (parametros) => {
    rekognition.indexFaces(parametros, function (err, data) {
      if (err) console.log('no', err); // an error occurred
      else console.log('ok', data);           // successful response
    });
  }

  deleteFaces = (parametros) => {
    rekognition.deleteFaces(parametros, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  }

  listCollections = (collection_params) => {
    rekognition.listCollections(collection_params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data['CollectionIds']);           // successful response
    });
  }

  listCollectionsAndAddFaces = (collection_params, create_params, face_list, dni) => {
    var faceIdArray = []
    function onlyUnique(value, index, self) { 
      return self.indexOf(value) === index;
    }
    rekognition.listCollections(collection_params, function (err, data) {
      var check = false;
      if (err) console.log(err, err.stack); // an error occurred
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
            if (err) console.log(err, err.stack); // an error occurred
            face_list.forEach(face => {
              var params = {
                CollectionId: create_params.CollectionId, /* required */
                Image: {
                  Bytes: Buffer.from(face)
                },
                ExternalImageId: dni,
                MaxFaces: 1
              };
              rekognition.indexFaces (params, async (err, data)=> {
                if (err) console.log('no', err); // an error occurred
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
                }          // successful response
              });
            });
          });
        }else{
          face_list.forEach(face => {
            var params = {
              CollectionId: create_params.CollectionId, /* required */
              Image: {
                Bytes: Buffer.from(face)
              },
              ExternalImageId: dni,
              MaxFaces: 1
            };
            rekognition.indexFaces(params, async (err, data)=> {
              if (err) console.log('no', err); // an error occurred
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
              }            // successful response
            });
          });
        }
      }               // successful response
    });
   
  }

  listFaces = (faces_params) => {
    rekognition.listFaces(faces_params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  }

  searchByImage = (parametros) => {
    rekognition.searchFacesByImage(parametros, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  }

}
const manager = new AWSManager()
//upload a file to the bucket


//create collection
// var params = {
//   CollectionId: 'lionel' /* required */
// };

// //delete collection


// //add faces to a collection
// var parametro_add = {
//   CollectionId: 'lionel', /* required */
//   Image: {
//     Bytes:Buffer.from(fileContent)
//   },
//   ExternalImageId: 'fabro-dientes',
//   MaxFaces: 1
// };


// //delete faces inside a collection
// var params_delete = {
//   CollectionId: 'STRING_VALUE', /* required */
//   FaceIds: [ /* required */
//     'STRING_VALUE',
//     /* more items */
//   ]
// };

// //list all the existing collections
// var collection_params = {
// };


// //list faces inside a collection

// var faces_params = {
//   CollectionId: 'lionel',
// }

// //search faces by image
// var params_search = {
//   CollectionId: 'lionel', /* required */
//   Image: { /* required */
//     Bytes: Buffer.from(fileContent)
//   },
//   FaceMatchThreshold: 90,
//   MaxFaces: 1
// };

module.exports = manager