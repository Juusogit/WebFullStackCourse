const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require ('bcryptjs')

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

const initialUsers = [
  {
    username: 'ella',
    password: 'secret'
  },
  {
    username: 'juuso',
    password: 'secret'
  }
]

  const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }

  const nonExistingId = async () => {
    const blog = new Note({ title: 'tempo.com', url: 'rary.com', author: 'temporary'})
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
  }

  const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
  }

  const addLoginUser = async () => {
    const passwordHash = await bcrypt.hash(initialUsers[0].password, 10)
    const user = new User({ username: initialUsers[0].username, passwordHash })
    await user.save()
  }

  module.exports = {initialBlogs, initialUsers, blogsInDb, nonExistingId, usersInDb, addLoginUser}