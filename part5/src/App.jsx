import { useState, useEffect } from 'react'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll()
      .then(blogs => {
        setBlogs( blogs )
    })  
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)    
      }  
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      content: newBlog
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog('')
      })
  }

  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)      
            setUsername('')      
            setPassword('')    
          } catch (exception) 
          {      
            setErrorMessage('wrong credentials')
            setTimeout(() => {
            setErrorMessage(null)
            }, 5000)    
          }  
        }
     
  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedNoteappUser')
            setUser(null)
          } catch (exception) 
          {      
            setErrorMessage('cant logout')
            setTimeout(() => {
            setErrorMessage(null)
            }, 3000)
          }  
        }

  const loginForm = () => (      
    <form onSubmit={handleLogin}>        
    <div>          
      username
      <input            
      type="text"            
      value={username}            
      name="Username"
      onChange={({ target }) => setUsername(target.value)}/>
    </div>
    <div>
      password
        <input 
        type="password" 
        value={password} 
        name="Password"      
        onChange={({ target }) => setPassword(target.value)}/>
      </div>
        <button type="submit">login</button>
      </form>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <input
      value={newBlog}
      onChange={handleBlogChange}
      />
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      <h1>Bloggynator</h1>
      <Notification message={errorMessage} />
      {user === null ? (
      <>
      <h2>Log in</h2>
      {loginForm()}
      </>
  ) : (
        <div>
          <p>logged in as {user.name}</p>
          <div>
            <h2>blogs</h2>
            {blogs.map(blog => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
          {blogForm()}
        <button onClick = {handleLogout}>Logout🚪</button>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default App