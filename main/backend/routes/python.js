const {Router} =require('express');
const router = Router();
const {spawn} = require('child_process');


router.route('/train-old/:companyid')
.get(async (req,res) =>{
	var company = req.params.companyid;
	var largeDataSet = [];
    
	const python = spawn('python', ['train-bien.py', './fotitos/' + company + '/']);
	
	await python.stdout.on('data',  (data) => {
		
		largeDataSet.push(data);
		res.json({message:largeDataSet.join("")})

	});
	
	
})


// router.route('/')
// .get((req,res) => {
//     const link_user = 'https://www.freeformatter.com/json-escape.html';
    
//     var dataToSend ;
// 	var largeDataSet = [];
    
// 	const python = spawn('python', ['script1.py',link_user]);
	
// 	python.stdout.on('data', function (data) {
// 		largeDataSet.push(data);
// 	});
	
// 	python.on('close', (code) => {
//     res.json({message:largeDataSet.join("")})
// 	});
// })
// .post(async (req,res) => {

//     const link_user = req.body.link;
//     var dataToSend ;
// 	var largeDataSet = [];
    
// 	const python = spawn('python', ['script1.py',link_user]);
	
// 	await python.stdout.on('data',  (data) => {
// 		largeDataSet.push(data);
// 		res.json({message:largeDataSet.join("")})

// 	});
	
	
// })

module.exports = router