const Blog = ({ blog }) => (
  <div>
    {blog.title}, {blog.author}, {blog.likes}
  </div>  
)

export default Blog