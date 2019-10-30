const router = require ('express').Router();
const db = require ('./data/db.js');

// When the client makes a `POST` request to `/api/posts`:
router.post('/', (req, res) => {
    db.insert(req.body)
    .then(newPost => {
        if(newPost) {
            res.status(201).json(newPost)
        } else {
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

// When the client makes a `POST` request to `/api/posts/:id/comments`:
router.post('/:id/comments', (req, res)=> {

    const id = req.params.id;
    const addComment = {
        ...req.body, 
        post_id:id
    };

    db.findById(id)
    .then(findPost => {
        if(findPost) {
            db.insertComment(addComment)
            .then(postComment => res.status(201).json(postComment))
            .catch(error => res.status(400).json({ errorMessage: "Please provide text for the comment." }))
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
})

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

// When the client makes a `GET` request to `/api/posts/:id`:
router.get('/:id', (req, res) => {

    db.findById(req.params.id)
    .then(postById => {
        if(postById) {
            res.status(200).json(postById)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

// When the client makes a `GET` request to `/api/posts/:id/comments`:
router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id)
    .then(postComment => {
        if(postComment) {
            res.status(200).json(postComment)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

// When the client makes a `DELETE` request to `/api/posts/:id`:
router.delete('/:id', (req,res)=> {
    db.remove(req.params.id)
    .then(postDelete => {
        if(postDelete){
            res.status(200).json(postDelete)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The post could not be removed" })
    })
})

// When the client makes a `PUT` request to `/api/posts/:id`:
router.put("/:id", (req, res) => {
    const id = req.params.id;
    const newUpdate = req.body;

    if (!newUpdate.title && !newUpdate.contents)
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      });
    else {
      db.update(id, newUpdate)
        .then(postNewUpdate => {
          if (postNewUpdate) {
            db.findById(id)
              .then(postNewUpdate => {
                res.status(200).json(postNewUpdate);
              })
              .catch(error => {
                res.send(500).json({
                  error: "The user information could not be modified."
                });
              });
          } else {
            res.status(404).json({
              message: "The user with the specified ID does not exist."
            });
          }
        })
        .catch(error => {
          res.send(500).json({
            error: "The user information could not be modified."
          });
        });
    }
  });

module.exports = router;