// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
  Post.find(req.query)
    .then(posts => {
      res.json(posts)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: "The posts information could not be retrieved" })
    })
})

router.get('/:id', (req, res) => {
  const { id } = req.params

  Post.findById(id)
    .then(post => {
      if (post) {
        res.json(post)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

router.post('/', (req, res) => {
  const { title, contents } = req.body

  if (!title || !contents) {
    return res.status(400).json({
      message: "Please provide title and contents for the post"
    })
  }

  Post.insert(req.body)
    .then(postId => {
      return Post.findById(postId.id)
    })
    .then(post => {
      res.status(201).json(post)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "There was an error while saving the post to the database"
      })
    })
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  const { title, contents } = req.body

  if (!title || !contents) {
    return res.status(400).json({
      message: 'Please provide title and contents for the post',
    })
  }

  Post.findById(id)
    .then(stuff => {
      if (!stuff) {
        return res.status(404).json({
          message: "The post with the specified ID does not exist",
        })
      } else {
        return Post.update(id, req.body)
      }
    })
    .then(updated => {
      if (updated) {
        return Post.findById(id)
      }
    })
    .then(post => {
      if (post) {
        res.json(post)
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "The post information could not be received",
      })
    })
})


router.delete('/:id', (req, res) => {
  const { id } = req.params

  Post.findById(id)
    .then(post => {
      if (!post) {
        res.status(404).json({
          message: "The post with the specified ID does not exist",
        })
      } else {
        Post.remove(id)
          .then(() => {
            res.json(post)
          })
      }
    })

    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "The post could not be removed",
      })
    })
})

router.get('/:id/comments', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({
          message: "The post with the specified ID does not exist",
        })
      } else {
        return Post.findPostComments(req.params.id)
          .then(comments => {
            res.json(comments)
          })
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({
        message: "The comments information could not be retrieved",
      })
    })
})

module.exports = router