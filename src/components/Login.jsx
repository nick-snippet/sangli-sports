import React, { useState } from 'react'
<section id="login" className="login-section">
  ...
</section>

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isRegister) {
      alert(`Account created for ${username}! You can now log in.`)
      setIsRegister(false)
      setUsername('')
      setPassword('')
    } else {
      onLogin(username, password)
    }
  }

  return (
    <section className="login-section">
      <div className="login-box">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p>
          {isRegister
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <span
            className="switch-link"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </section>
  )
}

export default Login
