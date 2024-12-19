const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)
const bcrypt = require('bcryptjs')
const User = require('../models/user')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany([])
  await helper.addLoginUser()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert(titles.includes('tiikeri'), true)
})

test('blogs have id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    assert.strictEqual(blog.id !== undefined, true)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a blog can be added', async () => {

  const testBlog = {
    title: 'sup',
    author: 'jamaaal',
    url: 'www.google.com',
    likes: 3
  }

  const user = {
    username: 'root',
    password: 'password',
  }
  await api
  .post('/api/users')
  .send(user)

  const loginUser = 
  await api
    .post('/api/login')
    .send(user)
    .expect(200)
  userToken = loginUser.body.token
  
  await api
  .post('/api/blogs')
  .send(testBlog)
  .set('Authorization', `Bearer ${userToken}`)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert(titles.includes('sup'))
})

test('if blogs likes are null return 0', async () => {
  const newBlog = {
    title: 'hellurei',
    author: 'myllyoja',
    url: 'www.yahoo.com',
  }
  const user = {
    username: 'root',
    password: 'password',
  }
  await api
  .post('/api/users')
  .send(user)

  const loginUser = 
  await api
    .post('/api/login')
    .send(user)
    .expect(200)
  userToken = loginUser.body.token

  const response = await api
  .post ('/api/blogs')
  .send(newBlog)
  .set('Authorization', `Bearer ${userToken}`)
  .expect(201)
  .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(response.body.likes, 0)
})

test('a blog without title or url cant be added', async () => {
  const newBlog = {
    title: undefined,
    author: 'myllis',
    url: undefined
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test ('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const testBlog = {
    title: 'sup',
    author: 'jamaaal',
    url: 'www.google.com',
    likes: 3
  }

  const user = {
    username: 'root',
    password: 'password',
  }
  await api
  .post('/api/users')
  .send(user)

  const loginUser = 
  await api
    .post('/api/login')
    .send(user)
    .expect(200)
  userToken = loginUser.body.token

  const response =
  await api
    .post('/api/blogs')
    .send(testBlog)
    .set('Authorization', `Bearer ${userToken}` )
    .expect(201)

  const blogsAfterAddition = await helper.blogsInDb()

  await api
  .delete(`/api/blogs/${response.body.id}`)
  .set('Authorization', `Bearer ${userToken}`)
  .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAfterAddition.length, blogsAtStart.length + 1)
  assert.strictEqual(blogsAtEnd.length, blogsAfterAddition.length - 1)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = { likes: blogToUpdate.likes + 1 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const blogInDb = blogsAtEnd.find(b => b.likes)
  assert.strictEqual(blogInDb.likes, blogToUpdate.likes + 1)
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })
    
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})