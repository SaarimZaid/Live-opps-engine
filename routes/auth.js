const express = require('express')
const { default: mongoose } = require('mongoose')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_Secret} = require('../keys')
const User = mongoose.model('User')


router.post('/signup', (req,res)=>{
    const {email, password} = req.body
    if(!email || !password) return res.status(422).json({error:'Enter email or password'})
    else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) return res.status(422).json({error:'Invalid email'})
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            res.status(422).json({error: 'This email already exists'})
        }
        bcrypt.hash(password, 12).then((hashPassword)=>{
            const user = new User({
                email,
                password:hashPassword
            })
            user.save().then(()=>{
                res.json({message:'Successfully signed in'})
            }).catch((err)=>console.log(err))
        })
    }).catch((err)=> console.log(err))

})

const userName = (id) =>{
    id = id.split('@')
    return id[0]
}

router.post('/signin', (req,res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(422).json({error:'All fields are mandatory'})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(!savedUser){
            return res.status(422).json({error:'email id does not exits'})
        }
        bcrypt.compare(password, savedUser.password).then((doMatch)=>{
            if(doMatch){
                const token = jwt.sign({id:savedUser._id, username:userName(savedUser.email)}, JWT_Secret)
                const {_id, email} = savedUser
                res.json({token, message:'signed in successfully'})
            }else{
                res.status(422).json({error:'Wrong Credentials'})
            }
        })
        // res.json({savedUser})
    })
    .catch((err)=> console.log(err))
})

module.exports = router