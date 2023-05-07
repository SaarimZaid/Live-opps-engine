const express = require('express')
const { default: mongoose } = require('mongoose')
const { MONGOURL } = require('./keys')
const app = express()
const { json } = require('express')

const PORT = 5000

mongoose.connect(MONGOURL)
mongoose.connection.on('connected',()=>{
    console.log('connected to mongo')
})
mongoose.connection.on('error',(err)=>{
    console.log('error while connecting to mongo', err)
})

require('./models/user')
require('./models/offers')
// mongoose.model('User')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/offers'))

app.listen(PORT, ()=>{
    console.log('server is running on port', PORT)
})