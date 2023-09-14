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
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const query = { nombre: "Clásica" };
        const hamburguesasCursor = await collection.find(query);
        const hamburguesas = await hamburguesasCursor.toArray();

        if (hamburguesas.length === 0) {
            return res.status(400).json({
                msg: "Hamburguesas no encontradas."
            });
        }

        for (const hamburguesa of hamburguesas) {
            await collection.updateOne(
                { _id: hamburguesa._id },
                { $push: { ingredientes: "Maiz" } }
            );
        }

        client.close();

        res.json({
            hamburguesas,
            msg: "Ingredientes actualizados."
        });
    } catch (error) {
        console.log(error, "Error endpoint8.");
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

router.get('/endpoint9', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const query = { "ingredientes": "Pan integral"};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Hamburguesas con pan integral",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint9.");
    }
});

router.get('/endpoint10', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Chefs');
        const query = { "nombre": "ChefC" };
        const result = await collection.updateOne(query, { $set: { especialidad: "Cocina internacional"}});
        res.json({
            msg: `Especialidad del Chef C actualizado.`,
            result
        })
    } catch (error) {
        console.log(error, "Error endpoint10.");
    }
});

router.get('/endpoint11', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const result = await collection.findOne({}, { sort: { precio: -1 }});
        res.json({
            msg: "Ingrediente más caro.",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint11.");
    }
});

router.get('/endpoint12', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const query = { ingredientes: { $ne: "Queso cheddar" }};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Hamburguesas que no tienen Queso cheddar en sus ingredientes.",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint12.");
    }
});

router.get('/endpoint13', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const query = { nombre: "Pan" };
        const result = await collection.updateOne(query, { $inc: { stock: 100 }});
        const ingrediente = await collection.find(query).toArray();
        res.json({
            msg: "Stock del ingrediente 'Pan' incrementado en 100 unidades.",
            result,
            ingrediente
        });
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint13.");
    }
});

router.get('/endpoint14', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const query = { descripcion: { $regex: /clásico/i }};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Ingredientes que tienen la palabra 'clásico' en su descripción.",
            result
        });
        client.close();
    } catch (error) {
        console.log(error, "Error en el endpoint 14.");
    }
});

router.get('/endpoint15', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const query = { precio: { $lte: 9 }};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Hamburguesas con precio menor o igual a $9.",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint15.");
    }
});

router.get('/endpoint16', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Chefs');
        const result = await collection.countDocuments();
        res.json({
            msg: "Cantidad de chefs que hay en la base de datos.",
            result
        })
    } catch (error) {
        console.log(error, "Error endpoint16.");
    }
});

router.get('/endpoint17', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Categorias');
        const query = { descripcion: { $regex: /gourmet/i }};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Categorías que tienen en su descripción la palabra 'gourmet'.",
            result
        });
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint17.");
    }
});

router.get('/endpoint18', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const query = { $expr: { $lt: [{ $size: "$ingredientes"}, 5 ]}};
        await collection.deleteMany(query);
        res.json({
            msg: "Eliminar hamburguesas con menos de 5 ingredientes.",
        })
        client.close();
    } catch (error) {
        console.log(error, "Error ednpoint18.");
    }
});

router.post('/endpoint19', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Chefs');
        const query = { nombre: "ChefD", especialidad: "Cocina asiática" };
        const result = await collection.insertOne(query);
        const chefs = await collection.find().toArray();
        res.json({
            msg: "Nuevo Chef.",
            result,
            chefs
        });
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint19.");
    }
});

router.get('/endpoint20', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const result = await collection.find().sort({ precio: 1 }).toArray();
        res.json({
            msg: "Hamburguesas ordenadas ascendentemente según precio.",
            result
        });
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint20.");
    }
});

router.get('/endpoint21', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const query = { precio: { $lt: 5, $gt: 2 }};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Ingredientes entre $2 y $5.",
            result
        });
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint21.");
    }
});

router.put('/endpoint22', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const query = { nombre: "Pan" };
        const result = await collection.updateOne(query, { $set: { descripcion: "Pan fresco y crujiente."}});
        const ingredientes = await collection.find().toArray();
        res.json({
            msg: "Actualizar la descripción del ingrediente 'Pan'.",
            result,
            ingredientes
        })
        client.close();   
    } catch (error) {
        console.log(error, "Error endpoint22.");
    }
});

router.get('/endpoint23', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const query = { ingredientes: { $in: [ "Tomate", "Lechuga" ]}};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Hamburguesas que tienen 'Tomate' o 'Lechuga' en sus ingredientes.",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint23.");
    }
});

router.get('/enpoint24', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Chefs');
        const query = { nombre: { $ne: "ChefA"}};
        const result = await collection.find(query).toArray();
        res.json({
            msg: "Lista de chefs excepto: 'ChefA'.",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint24.");
    }
});

router.get('/endpoint25', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Hamburguesas');
        const query = { categoria: { $regex: /gourmet/i }};
        const result = await collection.updateOne(query, { $inc: { precio: 2 }});
        res.json({
            msg: "Aumentar en 2 el precio de las hamburguesas de la categoría 'gourmet'.",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint25.");
    }
});

router.get('/endpoint26', async (req, res) => {
    try {
        const client = new MongoClient(bases);
        await client.connect();
        const db = client.db(nombrebase);
        const collection = db.collection('Ingredientes');
        const result = await collection.find().sort({ nombre: 1 }).toArray();
        res.json({
            msg: "Ingredientes ordenados en orden alfabético.",
            result
        })
        client.close();
    } catch (error) {
        console.log(error, "Error endpoint26.");
    }
});

module.exports = router;