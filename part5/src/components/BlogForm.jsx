const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => (
  <form onSubmit={addBlog}>
    <div>
      title
      <input value={newBlog.title} onChange={handleBlogChange} />
    </div>
    <div>
      url
      <input value={newBlog.url} onChange={handleBlogChange} />
    </div>
    <div>
      author
      <input value={newBlog.author} onChange={handleBlogChange} />
    </div>
    <button type='submit'>Add a new blog!</button>
  </form>
)

export default BlogForm
