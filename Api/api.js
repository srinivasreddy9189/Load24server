const express = require('express');
const router = express.Router();
const {signupData,userLoadData} = require('../Dataschemes/GlobalSchema');
const jwtAuth = require('../Middleware/Middleware');


//get the user profile details
router.get('/profile',jwtAuth,async(req,res)=>{
   try{
    const getProfile = await signupData.findOne({_id:req.id})
    return res.status(200).json({profile:getProfile})
   }catch{
       return res.status(500).json({message:'Internal Server Error'})
   }
})

//allow user to post the data 

router.post('/postload',jwtAuth,async(req,res)=>{
    try {
        const {from,to,amount,loadType,capacity,truckType,company,pickupLoc,dropLoc,contactNo,alternativeNo,createdAt} = req.body;
        if(!from || !to || !loadType || !amount || !contactNo){
            return res.status(400).json({message:'* Fields Are Required'})
        }
        if(contactNo.length<10 ||contactNo.length>10 ||alternativeNo.length<10 ||alternativeNo.length>10  ){
            return res.status(400).json({message:'Invalid Mobile Number'})
        }
        const newData = await new userLoadData({
            userId:req.id,
            from,
            to,
            amount,
            loadType,
            capacity,
            truckType,
            company,
            pickupLoc,
            dropLoc,
            contactNo,
            alternativeNo,
            createdAt:new Date(Date.now()+10*1000)
        });
        newData.save();
        return res.status(200).json({newData,message:'Load Posted!'})
        
    } catch{
        return res.status(500).json({message:'Internal Server Error'})
    }
})



//get the load by user data

router.get('/getloaddata',jwtAuth,async(req,res)=>{
    try {
        const getLoadDetails = await userLoadData.find({userId:req.id}).sort({createdAt:-1});
        return res.status(200).json({getLoadDetails,message:'User Load Details'})
    } catch {
        return res.status(500).json({message:'Internal Server Error'}) 
    }
})

//edit the posted data
router.put('/updateload/:id', jwtAuth, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            from, to, amount, loadType, capacity, truckType,
            company, pickupLoc, dropLoc, contactNo, alternativeNo
        } = req.body;

        const existingLoad = await userLoadData.findOne({ _id: id, userId: req.id });

        if (!existingLoad) {
            return res.status(404).json({ message: 'Load Data Not Found or Unauthorized' });
        }
        existingLoad.from = from;
        existingLoad.to = to;
        existingLoad.amount = amount;
        existingLoad.loadType = loadType;
        existingLoad.capacity = capacity;
        existingLoad.truckType = truckType;
        existingLoad.company = company;
        existingLoad.pickupLoc = pickupLoc;
        existingLoad.dropLoc = dropLoc;
        existingLoad.contactNo = contactNo;
        existingLoad.alternativeNo = alternativeNo;

        await existingLoad.save();

        return res.status(200).json({ existingLoad, message: 'Load Data Updated Successfully' });

    } catch (error) {
        console.error('Error updating load:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

//delete the user load data

router.delete('/deleteload/:id', jwtAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const existingLoad = await userLoadData.findOne({ _id: id, userId: req.id });

        if (!existingLoad) {
            return res.status(404).json({ message: 'Load Data Not Found or Unauthorized' });
        }

        await existingLoad.deleteOne();

        return res.status(200).json({ message: 'Load Data Deleted Successfully' });

    } catch (error) {
        console.error('Error deleting load:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});


//get loads details
router.get('/getloaddata/:id', jwtAuth, async (req, res) => {
    try {
        const { id } = req.params; 
        const loadDetails = await userLoadData.findOne({ _id: id });
        if (!loadDetails) {
            return res.status(404).json({ message: "Load data not found" });
        }

        return res.status(200).json({ loadDetails, message: "Load details fetched successfully" });
    } catch (error) {
        console.error("Error fetching load data by ID:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//get all the loads data 

router.get('/getallloads',jwtAuth,async(req,res)=>{
    try {
        const getAllLoads = await userLoadData.find().sort({createdAt:-1});
        return res.status(200).json({getAllLoads,message:'All the Loads Are Displayed'}) 
    } catch{
        return res.status(500).json({message:'Internal Server Error'}) 
    }
})






module.exports = router;