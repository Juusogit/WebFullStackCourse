import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')   
  const [password, setPassword] = useState('')
  const [user, setUser] = usestate(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({username, password})
            noteService.setToken(user.token)
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

return(
  <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App