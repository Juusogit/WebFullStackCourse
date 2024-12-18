const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
const assert = require('node:assert')

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  describe('creating a new user', () => {
    test('new user if username === unique and good pw', async () => {

    const usersAtStart = await helper.usersInDb()
    const newUser = {
        username: 'unique',
        password: 'secret'
    }

    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  })
  test('fail if username !unique', async () => {
    const notUnique = {
        username: 'ella',
        password: 'secret'
    }

    await api
    .post('/api/users')
    .send(notUnique)
    .expect(400)
  })
  test('fail if password === null', async () => {
    const noPw = {
        username: 'jamaica'
    }

    await api
    .post('/api/users')
    .send(noPw)
    .expect(400)
  })
  test('fail if PW too short', async () => {
    const shortPw = {
        username: 'elluska',
        password: 'aa'
    }

    await api
    .post('/api/users')
    .send(shortPw)
    .expect(400)
  })
})

  after(async () => {
    await mongoose.connection.close()
})