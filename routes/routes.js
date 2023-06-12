const Model = require('../model/model');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const router = express.Router()

router.use(cors());
//Post Method
router.post('/post', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const data = new Model({
        message: req.body.message,
        username: req.body.username,
        college: req.body.college,
        avatarimg: req.body.avatarimg
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})
router.get('/getAll',async (req, res) => {
    try{
        const { input } = req.query;
        const data = await Model.find({ college: { $regex: input, $options: 'i' } });
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
module.exports = router;
