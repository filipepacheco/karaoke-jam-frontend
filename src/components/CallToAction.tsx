function CallToAction() {
  return (
    <div className="py-20 px-4 bg-base-200">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Organize Your Jam Session?
        </h2>
        <p className="text-xl mb-8">
          Stop using spreadsheets and manual processes. Start managing your jam sessions
          like a pro with real-time coordination and seamless communication.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button className="btn btn-primary btn-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started Now
          </button>
          <button className="btn btn-outline btn-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallToAction

