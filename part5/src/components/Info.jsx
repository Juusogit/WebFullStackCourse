const Info = ({ info }) => {
  if (info === null) {
    return null
  }

  return <div className='message'>{info}</div>
}

export default Info
