const db = require('./../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = db.users;

exports.signup = async (req, res) => {
	if(!req.body.email || !req.body.password){
		return res.status(400).send({
			message: "Must have email and password"
		});
	}
	try{
		const hash = await bcrypt.hash(req.body.password, 10)
		const user = {
			email: req.body.email,
			password: hash
		}
		await Users.create(user)
		return res.status(201).json({message: 'User Created'})
	}catch (err){
		return res.status(500).send({
			message: err.message
		});
	}

}

exports.login = async (req, res) => {
	console.log("test");
	console.log(req.body.email);
	const user = await Users.findOne({where: {email: req.body.email}});
	console.log(user);
	if(user === null){
		return res.status(404).json({message: 'user not found'})
	}else {
		const valid = await bcrypt.compare(req.body.password, user.password)
		console.log(user.password);
		if(!valid){
			console.log(valid);
			return res.status(401).json({ error: new Error('Not Authorized') })
			
		}
	
		return res.status(200).json({
			userId: user.id,
			token: jwt.sign(
				{userId : user.id},
				process.env.TOKEN_SECRET,
				{ expiresIn: '24h' }
			)
		})

	}
}
