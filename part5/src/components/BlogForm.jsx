const BlogForm = ({ addBlog, newBlog, handleBlogChange }) => (
  <form onSubmit={addBlog}>
    <div>
      title
      <input name='title' value={newBlog.title} onChange={handleBlogChange} />
    </div>
    <div>
      author
      <input name='author' value={newBlog.author} onChange={handleBlogChange} />
    </div>
    <div>
      url
      <input name='url' value={newBlog.url} onChange={handleBlogChange} />
    </div>
    <button type='submit'>Add a new blog!</button>
  </form>
)

export default BlogForm
