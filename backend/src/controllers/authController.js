import { nanoid } from "nanoid";
import { users, sessions } from "../data/users.js";

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || "";
  return authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : null;
};

export const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const normalized = username.trim().toLowerCase();
  const user = users.find((item) => item.username.toLowerCase() === normalized);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = nanoid(20);
  sessions.set(token, user.id);

  return res.json({
    data: {
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      },
      token
    }
  });
};

export const signup = (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ message: "Username, password and name are required" });
  }

  const normalized = username.trim().toLowerCase();
  if (users.some((item) => item.username.toLowerCase() === normalized)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const user = {
    id: nanoid(10),
    username: normalized,
    password,
    name: name.trim()
  };

  users.push(user);

  const token = nanoid(20);
  sessions.set(token, user.id);

  return res.status(201).json({
    data: {
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      },
      token
    }
  });
};

export const logout = (req, res) => {
  const token = getTokenFromHeader(req);
  if (token) {
    sessions.delete(token);
  }
  return res.json({ message: "Logged out successfully" });
};

export const getMe = (req, res) => {
  const token = getTokenFromHeader(req);
  if (!token || !sessions.has(token)) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const userId = sessions.get(token);
  const user = users.find((item) => item.id === userId);
  if (!user) {
    return res.status(401).json({ message: "Invalid session" });
  }

  return res.json({
    data: {
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    }
  });
};
