import { useState } from "react";

export default function LoginPage({ onLogin, onSignup, loading, error }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isSignup = mode === "signup";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSignup) {
      onSignup({ username, password, name });
    } else {
      onLogin({ username, password });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{isSignup ? "Create a new account" : "Sign in to Guszilla Shop"}</h2>
        <p>{isSignup ? "Register a new user to start shopping." : "Welcome back! Enter your credentials to continue."}</p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Username
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />
          </label>

          <label className="password-field">
            Password
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete={isSignup ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isSignup ? "Creating account..." : "Signing in...") : (isSignup ? "Sign up" : "Sign in")}
          </button>
        </form>

        <button
          type="button"
          className="login-toggle"
          onClick={() => setMode(isSignup ? "login" : "signup")}
        >
          {isSignup ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
}
