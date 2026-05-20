// Auth helper — include this in every page
const AUTH = {

  // Check if logged in — redirect to login if not
  check() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // Get current user
  getUser() {
    return {
      username: localStorage.getItem('user') || 'guest',
      role:     localStorage.getItem('role') || 'guest',
      token:    localStorage.getItem('token')
    };
  },

  // Get auth headers for API calls
  headers() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
  },

  // Update sidebar with real username
  updateSidebar() {
    const user = this.getUser();
    const footer = document.querySelector('.sidebar-footer .user');
    if (footer) {
      footer.textContent = user.username + '@netscan';
    }
    // Add role badge
    const roleEl = document.querySelector('.sidebar-footer div:last-child');
    if (roleEl) {
      roleEl.textContent = `v2.0.0 — ${user.role}`;
    }
  }
};

// Auto check on every page load
document.addEventListener('DOMContentLoaded', () => {
  // Skip check on login page
  if (!window.location.href.includes('login.html')) {
    AUTH.check();
    AUTH.updateSidebar();
  }
});