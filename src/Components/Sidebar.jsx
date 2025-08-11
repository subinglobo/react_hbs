

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <ul>
        <li><a className='active' href="javascript:void(0)"><img src="" alt="Home" />Home</a></li>
        <li><a href="javascript:void(0)"><img src="" alt="Explore" />Explore</a></li>
        <li><a href="javascript:void(0)"><img src="" alt="Subscriptions" />Subscriptions</a></li>
      </ul>
      <ul>
        <li><a href="javascript:void(0)"><img src="" alt="Library" />Library</a></li>
        <li><a href="javascript:void(0)"><img src="" alt="History" />History</a></li>
        <li><a href="javascript:void(0)"><img src="" alt="Your Videos" />Your Videos</a></li>
        <li><a href="javascript:void(0)"><img src="" alt="Watch Later" />Watch Later</a></li>
        <li><a href="javascript:void(0)"><img src="" alt="Liked Videos" />Liked Videos</a></li>
        <li><a href="javascript:void(0)"><img src="" alt="arrowBottom" />Show More</a></li>
      </ul>
      {/* <Subscriptions /> */}
    </div>
  )
}

export default Sidebar
