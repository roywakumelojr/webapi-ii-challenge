const router = require ('express').Router();
const db = require ('./data/db.js');

// When the client makes a `GET` request to `/api/posts`:
router.get('/', (req, res) => {
    
    db.find(req.query)
    .then(db => {
      res.status(200).json(db);
    })

    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The posts information could not be retrieved." })
    });
});

module.exports = router;