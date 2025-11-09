import './App.css'
const App = ()=>{
  return(
    <>
    <div className="page">
      <nav>
        <div className='left-nav'>
          <div className='project-name'>
            TourDay
          </div>
        </div>
        <div className='right-nav'>
          <div className='me'>Me</div>
        </div>
      </nav>
      <main>
        <div className='hero-text'>TourDay: We plan, You play</div>
        <video className='hero-video' src="https://cdn.pixabay.com/video/2020/07/25/45569-443244046_large.mp4" autoPlay muted loop playsInline></video>
      </main>
    </div>
    <div className='page2'>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <footer></footer>
    </>

  )
}

export default App;