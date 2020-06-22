const {Router} =require('express');
const router = Router();

const {spawn} = require('child_process');

router.route('/')
.get((req,res) => {
    const link_user = 'https://www.freeformatter.com/json-escape.html';
    
    var dataToSend ;
	var largeDataSet = [];
    
	const python = spawn('python', ['script1.py',link_user]);
	
	python.stdout.on('data', function (data) {
		largeDataSet.push(data);
	});
	
	python.on('close', (code) => {
    res.json({message:largeDataSet.join("")})
	});
})
.post((req,res) =>{

    const link_user = req.body.link;
    console.log(req)
    var dataToSend ;
	var largeDataSet = [];
    
	const python = spawn('python', ['script1.py',link_user]);
	
	python.stdout.on('data', function (data) {
		largeDataSet.push(data);
	});
	
	python.on('close', (code) => {
    res.json({message:largeDataSet.join("")})
	});
})

module.exports = router