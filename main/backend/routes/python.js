const {Router} =require('express');
const router = Router();
const {spawn} = require('child_process');


router.route('/tool')
.get(async (req,res) =>{
	var largeDataSet = [];
    
	const python = spawn('python', ['train-pero-bien.py','1a2b2b']);
	await python.stdout.on('data',  (data) => {
		
		largeDataSet.push(data);
		res.json({message:largeDataSet.join("")})

	});
})
router.route('/')
.post(async (req,res) => {

    const link_user = req.body.link;
    var dataToSend ;
	var largeDataSet = [];
    
	const python = spawn('python', ['script1.py',link_user]);
	await python.stdout.on('data',  (data) => {
		largeDataSet.push(data);
		res.json({message:largeDataSet.join("")})
	});
})

module.exports = router