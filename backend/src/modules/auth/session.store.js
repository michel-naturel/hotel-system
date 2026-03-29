const sessions = new Map();

function createSession(token, user) {
  sessions.set(token, user);
}

function getSession(token) {
  return sessions.get(token);
}

function deleteSession(token) {
  sessions.delete(token);
}

module.exports = {
  createSession,
  getSession,
  deleteSession
};
