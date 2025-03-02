const lodash = require('lodash')


const dummy = () => {
    return (1)
  }

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const blog = blogs.reduce((favourite, current) =>
    favourite.likes > current.likes ? favourite : current
  )
  return {title: blog.title, author: blog.author, likes: blog.likes}
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCount = lodash.countBy(blogs, getBlogAuthor)
  const mostBlogsAuthor = findMostBlogsAuthor(authorCount)
  return { author: mostBlogsAuthor, blogs: authorCount[mostBlogsAuthor] }
}

const getBlogAuthor = (blog) => {return blog.author}

const findMostBlogsAuthor = (authorCount) => {
  return Object.keys(authorCount).reduce((a, b) => authorCount[a] > authorCount[b] ? a : b)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorsBlogs = lodash.groupBy(blogs, getBlogAuthor)
  const authorsTotalLikes = countTotalLikesForAuthors(authorsBlogs)
  return authorsTotalLikes.reduce((mostLikes, current) =>
    mostLikes.likes > current.likes ? mostLikes : current
  )
}

const countTotalLikesForAuthors = (authorsBlogs) => {
  return Object.entries(authorsBlogs).map(([author, blogs]) => {
    const totalLikes = blogs.reduce((total, blog) => total + blog.likes, 0)
    return { author: author, likes: totalLikes}
  })
}
  
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}