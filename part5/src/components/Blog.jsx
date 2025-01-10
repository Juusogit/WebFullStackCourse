import { useState } from 'react'

const Blog = ({ blog, likeUpdate, deleteBlog, user }) => {
  const [view, setView] = useState(false)

  const toggleVisibility = () => {
    setView(!view)
  }

  const handleDelete = async () => {
    deleteBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{view ? 'hide' : 'view'}</button>
      </div>
      {view && (
        <>
          <a href={blog.url} target='_blank' rel='noopener noreferrer'>
            {blog.url}
          </a>
          <div>
            likes {blog.likes}{' '}
            <button onClick={() => likeUpdate(blog)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {blog.user?.username === user.username && (
            <div>
              <button onClick={handleDelete}>remove</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blog
