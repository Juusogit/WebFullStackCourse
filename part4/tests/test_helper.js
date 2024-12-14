const Blog = require('../models/blog')

const initialBlogs = [
    {
      title: 'tiikeri',
      author: 'juuso',
      url: 'paskonhousuun',
      likes: 42
    },
    {
      title: 'johnypony',
      author: 'juustis',
      url: 'urlinbasga',
      likes: 27
    },
  ]

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  module.exports = {initialBlogs, blogsInDb}