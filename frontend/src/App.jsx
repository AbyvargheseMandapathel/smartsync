import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'
import './App.css'
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Headerone from './components/Header/Headerone';

function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/')
      .then(response => {
        setMessage(response.data)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      })
  }, [])

  return (
    <>
      <Headerone />
      <div className="home-container" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Welcome to SmartSync</h1>
        <p>Backend says: {message}</p>
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
