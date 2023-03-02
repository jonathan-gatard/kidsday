const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://jonathan:JonathanPassWorD@localhost:27017/react', { useNewUrlParser: true });

// Création du schéma de la base de données
const schema = new mongoose.Schema({
  uid: String,
  kids: Number
}, { timestamps: true });

// Création du modèle pour la base de données
const Kidsday = mongoose.model('kidsday', schema);

// Ajout de l'API pour lire la base de données
app.get('/api/read', async (req, res) => {
  try {
    const myData = await Kidsday.find();
    if (!myData) {
      return res.status(404).send({ message: "Aucune donnée trouvée dans la base de données" });
    }
    console.log(myData)
    res.status(200).send(myData);
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de la récupération des données dans la base de données" });
  }
});

//API post
app.use(express.json()); // Middleware pour parser le corps de la requête en JSON
app.post('/api/write', async (req, res) => {
  try {
    const newData = new Kidsday(req.body);
    console.log(newData);
    await newData.save();
    res.status(200).send({ message: "Données ajoutées à la collection avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Erreur lors de l'ajout des données à la base de données" });
  }
});




app.delete('/api/delete/:id', (req, res) => {
  const id = req.params.id;
  Kidsday.findByIdAndDelete(id)
    .then(() => {
      console.log(`Deleted`);
      return res.status(200).send(`Deleted`);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(err.message);
    });
});


// Démarrage du serveur
app.listen(4000, () => {
  console.log('Serveur démarré sur le port 4000');
});
