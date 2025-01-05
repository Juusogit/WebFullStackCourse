import { useState } from 'react'

const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setBlogVisible(true)}>Create</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={addBlog}>
          <div>
            title
            <input
              name='title'
              value={newBlog.title}
              onChange={handleBlogChange}
            />
          </div>
          <div>
            author
            <input
              name='author'
              value={newBlog.author}
              onChange={handleBlogChange}
            />
          </div>
          <div>
            url
            <input name='url' value={newBlog.url} onChange={handleBlogChange} />
          </div>
          <button
            type='submit'
            onClick={() => {
              setTimeout(() => setBlogVisible(false), 1000)
            }}
          >
            Add a new blog!
          </button>
        </form>
        <button onClick={() => setBlogVisible(false)}>cancel</button>
      </div>
    </div>
  )
}

export default BlogForm
