import heroImage from '../assets/Untitled.jpg'

function Hero() {
  return (
    <div
      className="hero min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Hero Content */}
      <div className="hero-content relative z-10 text-center lg:text-left">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Organize Live Jam Sessions in Real-Time
          </h1>
          <p className="text-lg md:text-xl mb-8 leading-relaxed text-gray-100">
            Streamline your music events with real-time coordination. Hosts manage the repertoire,
            musicians register for songs, and the audience follows along on live dashboards.
            No more spreadsheets, just seamless jam sessions.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
            <button className="btn btn-primary btn-lg">
              Start Your First Jam
            </button>
            <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-black">
              Join as Musician
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero

