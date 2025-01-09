import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Info from './components/Info'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = { ...newBlog }

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      setInfoMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      )
      setTimeout(() => {
        setInfoMessage(null)
      }, 5000)
    })
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setInfoMessage('logged in!')
      setTimeout(() => {
        setInfoMessage(null)
      }, 1500)
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 1500)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedUser')
      setUser(null)
    } catch (exception) {
      setErrorMessage('cant logout')
      setTimeout(() => {
        setErrorMessage(null)
      }, 1500)
    }
  }

  return (
    <div>
      <h1>Bloggynator</h1>
      <Notification message={errorMessage} />
      {user === null ? (
        <>
          <h2>Log in</h2>
          <LoginForm
            username={username}
            password={password}
            handleLogin={handleLogin}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </>
      ) : (
        <div>
          <Info info={infoMessage} />
          <p>logged in as {user.name}</p>
          <div>
            <h2>blogs</h2>
            {blogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
          <BlogForm
            addBlog={addBlog}
            newBlog={newBlog}
            handleBlogChange={handleBlogChange}
          />
          <button onClick={handleLogout}>Logout🚪</button>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default App
