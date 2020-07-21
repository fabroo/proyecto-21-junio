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
router.route('/tool2')
.get(async (req,res) => {

    const link_user = req.body.link;
    var dataToSend ;
	var largeDataSet = [];
    
	const python = spawn('python', ['script1.py']);
	await python.stdout.on('data',  (data) => {
		largeDataSet.push(data);
		var dataaaa = largeDataSet.join("")
		
		dataaaa = dataaaa.substring(1,dataaaa.length-3).split(",")
		dataaaa[0].replace("\'","aa")
		//console.log(dataaaa[0])

		res.json({message:dataaaa})
	});
})

module.exports = router