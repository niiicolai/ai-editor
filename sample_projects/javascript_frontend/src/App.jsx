import './App.css'

function test() 
  consolelog("test")
}

function App() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>Welcome to Sample App</h1>
        <p>Your journey starts here. Discover features and get started!</p>
        <button className="get-started-btn">Get Started</button>
      </header>
    </div>
  )
}

export default App
