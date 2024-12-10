const blogsRouter = require ('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/api/blogs', (request, response) => {
    Blog
      .find({})
      .then(Blog => {
        response.json(Blog)
      })
  })
  
  blogsRouter.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  
  module.exports = blogsRouter