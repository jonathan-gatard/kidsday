const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const uuid = require('uuid');



// Connexion à la base de données MongoDB
mongoose.connect('mongodb://jonathan:JonathanMotDePasse@localhost:27017/react', { useNewUrlParser: true });

// Création du schéma de la base de données
const schema = new mongoose.Schema({
  uid: String,
  kids: Number
}, { timestamps: true });

// Création du modèle pour la base de données
const Kidsday = mongoose.model('kidsday', schema);



//MIDDLEWARES
app.use(cors({
  origin: 'http://localhost:3000',
  exposedHeaders: ['X-Request-Id']
}));

app.use(express.json());


//API GET

app.get('/api/read', async (req, res) => {
  try {
    const myData = await Kidsday.find();
    if (!myData) {
      return res.status(204).send();
    }
    res.status(200).send(myData);
  }
  catch (err) {
    res.status(500).send();
  }
});


//API POST
app.post('/api/write', async (req, res) => {
  const requestId = uuid.v4();
  res.setHeader('X-Request-Id', requestId);
  try {
    const uid = req.body.uid;
    const existingData = await Kidsday.findOne({ uid: uid });
    if (existingData) {
      return res.status(409).send({ message: "UID " + uid + " already exists in database !", requestId });
    }
    const newData = new Kidsday(req.body);
    await newData.save();
    res.status(200).send();;
  } catch (err) {
      res.status(500).send({requestId});
  }
});


//API DELETE
app.delete('/api/delete/:id', (req, res) => {
  const id = req.params.id;
  Kidsday.findByIdAndDelete(id)
    .then(() => {
      return res.status(200).send();
    })
    .catch(err => {
      return res.status(500).send();
    });
});


//SEERVER

app.listen(4000, () => {
  console.log('Serveur démarré sur le port 4000');
});
