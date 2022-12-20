require('dotenv').config()
const mongoose = require('mongoose')
const express = require('express')
const bp = require('body-parser')
const app = express()
const ejs = require('ejs')
const encryption = require('mongoose-encryption')
console.log(process.env.SECRET)
app.use(bp.urlencoded({extended:true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')
mongoose.connect('mongodb://localhost:27017/admin',{useNewUrlParser:true});
const data = new mongoose.Schema({
    email:String,
    password:String
})
data.plugin(encryption,{secret:process.env.SECRET, encryptedFields: ['password']})

const Data = mongoose.model('users',data)
app.listen(3000,function(){
    console.log('On it...')
})
app.get('/',function(req, res){
    res.render('index')
})
app.post('/',function(req,res){
    var email = String(req.body.email);
    var password = String(req.body.password)
    Data.findOne({email:email},function (err,result) {
        if(err){
            console.log(err)
        }
        else{
            if (result) {
                if(result.password === password){
                    console.log('Logged In')
                } else{
                    console.log('cant enter')
                }
            }
        }
    })
})
app.get('/register', function(req,res){
    res.render('register')
})
app.post('/register', function(req,res){
    var email = String(req.body.email);
    var password = String(req.body.password)
    var confirm_password = String(req.body.confirm_password)
    if(password === confirm_password){
        const new_member =  new Data({
            email:email,
            password:password,
        })
        new_member.save();
        res.redirect('/')
    } else{
        console.log('password isnt match')
    }
})
app.delete('/delete', function(){
    Data.deleteMany(function(err){
        if(!err){
            console.log('Deleted')
        } else{
            console.log('Couldnt Deleted')
        }
    })
})