const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const router = express.Router();

const bases = process.env.DDBB256;
const nombrebase = 'Hamburgueseria';

router.get('/endpoint1', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const result = await collection.find({ "stock": {$lt: 400 }}).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        console.log(error, 'Error endpoint1.');
    }
});

router.get('/endpoint2', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const result = await collection.find({ "categoria": "Vegetariana" }).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        console.log(error, 'Error endpoint2.');
    }
});

router.get('/endpoint3', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Chefs');
        const result = await collection.find({ "especialidad": "Carnes" }).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        console.log(error, 'Error endpoint3.');
    }
});

router.get('/endpoint4', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const result = await collection.updateMany({}, ({ $inc: {precio: 1.5}}));
        res.json({
            result,
            msg: "Precio aumentado en 1.5"
        });
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint4.");
    }
});

router.get('/endpoint5', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const result = await collection.find({ "chef": "ChefB" }).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint5.");
    }
});

router.get('/endpoint6', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Categorias');
        const result = await collection.aggregate([
            {
                $project: {
                    "_id": 0,
                    "nombre": 1,
                    "descripcion": 1
                }
            }
        ]).toArray();
        res.json(result);
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint6.");
    }
});

router.get('/endpoint7', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const result = await collection.deleteMany({ "stock": 0 });
        res.json({
            result,
            msg: "Ingredientes con stock 0 eliminados."
        });
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint7.");
    }
});

router.get('/endpoint8', async (req, res) => {
    try {
        
    } catch (error) {
        console.log(error, "Error endpoint8.");
    }
});

module.exports = router;