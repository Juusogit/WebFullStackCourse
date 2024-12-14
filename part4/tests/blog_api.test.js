const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
})

test.only('right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test.only('the first blogs title is tiikeri', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert.strictEqual(titles.includes('tiikeri'), true)
})

test.only('blogs have id', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  blogs.forEach(blog => {
    assert.strictEqual(blog.id !== undefined, true)
    assert.strictEqual(blog._id, undefined) 
})
})

test.only('a blog can be added', async () => {
  const newBlog = {
    title: 'sup',
    author: 'jamaaal',
    url: 'www.google.com',
    likes: undefined
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
  assert(titles.includes('sup'))
})

test.only('if blogs likes are null return 0', async () => {
  const newBlog = {
    title: 'hellurei',
    author: 'myllyoja',
    url: 'www.yahoo.com',
  }

  const response = await api
  .post ('/api/blogs')
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)
  
  assert.strictEqual(response.body.likes, 0)
})

test.only('a blog without title or url cant be added', async () => {
  const newBlog = {
    title: undefined,
    author: 'myllis',
    url: undefined
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test.only ('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(r=>r.title)
  assert(!titles.includes(blogToDelete.title))
})

after(async () => {
  await mongoose.connection.close()
})