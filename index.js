const express = require('express')
const bodyParser = require('body-parser');
const cors = require ('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
// const { ObjectID } = require('bson');
require('dotenv').config();

const port = 5000

const app = express()
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eqysd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
    const servicesCollection = client.db("CarRepairCompany").collection("Services");
    const reviewCollection = client.db("CarRepairCompany").collection("Reviews");
    const orderCollection = client.db("CarRepairCompany").collection("Orders");
    const adminCollection = client.db("CarRepairCompany").collection("Admin");

    app.get('/services',(req,res)=>{
        servicesCollection.find()
        .toArray((err, service)=>{
            res.send(service)
           
        })
    })
    app.post('/addService',(req,res)=>{
        const newService = req.body;
        servicesCollection.insertOne(newService)
        .then(result=>{
        })
        
    })

    app.delete('/deleteService/:id',(req,res)=>{
        const id = ObjectID(req.params.id);
        servicesCollection.findOneAndDelete({_id: id})
        .then(document=> res.send(document.value))

    })
    app.post('/postReviews',(req,res)=>{
        const reviews = req.body;
        reviewCollection.insertOne(reviews)
        .then(result=>{
            console.log('add successfully', result);
        })
        
    })
    app.get('/reviews',(req,res)=>{
        reviewCollection.find()
        .toArray((err, review)=>{
            res.send(review)
        })
    })

    app.post('/orderService',(req,res)=>{
        const newOrder = req.body;
        orderCollection.insertOne(newOrder)
        .then(result=>{
            console.log(result)
        })
        
    })

    app.get('/order',(req,res)=>{
        orderCollection.find({email:req.query.email})
        .toArray((err, order)=>{
            res.send(order)
        })
    })

    app.post('/addAdmin',(req,res)=>{
        const admin = req.body;
        adminCollection.insertOne(admin)
        .then(result=>{
            console.log(result)
        })
        
    })
    app.post('/isAdmin',(req,res)=>{
        const email = req.body.email;
        console.log(email)
        adminCollection.find({email:email})
        .toArray((err,documents)=>{
          res.send(documents.length > 0)
        })
    })
    
});


app.listen(process.env.PORT || port)