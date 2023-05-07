const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { default: mongoose } = require('mongoose')
const { JWT_Secret } = require('../keys')
// const { offer } = require('../models/offers')
const Offer = mongoose.model('Offer')

const getUserByToken = (token) => {
    return new Promise((resolve, reject) => {
        if (token) {
            let userData
            try {
                userData = jwt.verify(token, JWT_Secret)
                resolve(userData)
            } catch (err) {
                reject('Invalid User Id')
            }
        } else {
            reject('User not found')
        }
    })
}

router.post("/list", async(req, res)=> {
    const validOffers = [];
    Offer.find().then((offers)=> {
        offers.filter((offer)=> {
            const rules = offer.target.split("and")
            //['age > 30', 'installed_days < 5']
            rules.forEach((rule)=> {
                let ruleKey = {}
                if(rule.includes(">")) {
                    ruleKey = {key: rule.trim().split(">")[0].trim(), value: parseInt(rule.trim().split(">")[1]) }
                    if(req.body[ruleKey.key] > ruleKey.value) {
                        validOffers.push(offer)
                        // console.log()
                    }
                    
                } else {
                    ruleKey = {key: rule.trim().split("<")[0].trim(), value: parseInt(rule.trim().split("<")[1])}
                    if(req.body[ruleKey.key] < ruleKey.value) {
                        validOffers.push(offer)
                    }
                    // console.log(validOffers)
                }
            })
        })
        res.status(200).send(validOffers);
    }).catch(()=> {
        res.status(500).send("Internal Server Error")
    })
});

router.post("/create", async(req,res)=> {
    //find the user
    getUserByToken(req.headers.authorization).then((user)=> {
        //res.status(200).send(user)
        ///create a offer based on user   
        Offer.create({...req.body, username: user.username}).then((offer)=> {
            res.status(200).send(offer);
        }).catch((err)=> {
            res.status(400).send({message: err.message})
        })
    }).catch((err)=> {
        res.status(400).send(err)
    })
});

module.exports = router






// const express = require("express");
// const req = require("express/lib/request");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const { JWT_Secret } = require("../keys");
// // const {offer} = require("../schemas/offer-schema");
// const {offer} = require("../models/offers")

// const getUserByToken = (token)=> {
//     return new Promise((resolve, reject)=> {
//         if(token) {
//             let userData
//             try {
//                 userData = jwt.verify(token, JWT_Secret);
//                 resolve(userData);
//             } catch(err) {
//                 reject("Invalid Token!")
//             }
//         } else {
//             reject("Token not found")
//         }
//     })
// }
// router.post("/list", async(req, res)=> {
//     const validOffers = [];
//     offer.find().then((offers)=> {
//         offers.filter((offer)=> {
//             const rules = offer.target.split("and")
//             //['age > 30', 'installed_days < 5']
//             rules.forEach((rule)=> {
//                 let ruleKey = {}
//                 if(rule.includes(">")) {
//                     ruleKey = {key: rule.trim().split(">")[0].trim(), value: parseInt(rule.trim().split(">")[1]) }
//                     if(req.body[ruleKey.key] > ruleKey.value) {
//                         validOffers.push(offer)
//                         console.log()
//                     }
                    
//                 } else {
//                     ruleKey = {key: rule.trim().split("<")[0], value: rule.trim().split("<")[1]}
//                     if(req.body[ruleKey.key] < ruleKey.value) {
//                         validOffers.push(offer)
//                     }
//                     console.log(validOffers)
//                 }
//             })
//         })
//         res.status(200).send(validOffers);
//     }).catch(()=> {
//         res.status(500).send("Internal Server Error")
//     })
// });

// router.post("/create", async(req,res)=> {
//     //find the user
//     getUserByToken(req.headers.authorization).then((user)=> {
//         // create a offer based on user
//         offer.create({...req.body, username: user.username}).then((offer)=> {
//             res.status(200).send(offer);
//         }).catch((err)=> {
//             res.status(400).send({message: err.message})
//             console.log(err)
//         })
//         // res.status(200).send(user)
//     }).catch((err)=> {
//         res.status(400).send(err)
//         console.log(err)
//     })
// });
// router.put("/update", async()=> {
//     offer.updateOne("identifier data", "newData");
// });
// router.delete("/delete", async()=> {
//     offer.deleteOne({_id: req.body.id})
// });
// module.exports = router;