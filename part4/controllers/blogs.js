const blogsRouter = require ('express').Router()
const Blog = require('../models/blog')
const {userExtractor} = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 })
        response.json(blogs)
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const body = request.body
    const user = request.user

    if (body.title === undefined || body.url === undefined) {
      return response.status(400).end()
    }

    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }
  
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
  })
  
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next (error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
  try{
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!user) {
    return response.status(401).json({ error: 'invalid token' })
  }

  if ( blog?.user.toString() === user._id.toString() ){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
  else{
    response.status(401).json({ error: 'unauthorized access' })
  }
})

module.exports = blogsRouter