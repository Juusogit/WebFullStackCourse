import { useState, useEffect, useRef } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Info from './components/Info'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [errorMessage, setErrorMessage] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

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
      blogFormRef.current.toggleVisibility()
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

  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const likeUpdate = async (blog) => {
    const { id, title, author, url, likes } = blog
    try {
      const updatedBlog = await blogService.update({
        id,
        title,
        author,
        url,
        likes: likes + 1,
      })

      setBlogs(
        sortBlogs(
          blogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog))
        )
      )
    } catch (error) {
      setErrorMessage('cant like blog')
      setTimeout(() => setErrorMessage(null), 1500)
    }
  }

  const deleteBlog = async ({ id, title, author }) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      setInfoMessage(`blog ${title} by ${author} was deleted`, 'success')
    } catch (error) {
      setErrorMessage('cant delete blog')
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
          <p>
            logged in as {user.name}{' '}
            <button onClick={handleLogout}>Logout🚪</button>
          </p>
          <div>
            <h2>blogs</h2>
            {blogs
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  likeUpdate={likeUpdate}
                  deleteBlog={deleteBlog}
                  user={user}
                />
              ))}
          </div>
          <Togglable buttonLabel='Create a new blog' ref={blogFormRef}>
            <BlogForm
              addBlog={addBlog}
              newBlog={newBlog}
              handleBlogChange={handleBlogChange}
            />
          </Togglable>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default App
