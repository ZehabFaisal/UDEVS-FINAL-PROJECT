const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers}, ...options,
  };

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Request failed');
  }

  return result;
};

export const authAPI = {
  login: (data) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  verify: () => apiRequest('/auth/verify'),
};

export const jobsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.job_type && params.job_type !== 'All') query.append('job_type', params.job_type);
    if (params.location && params.location !== 'All') query.append('location', params.location);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    const qs = query.toString();
    return apiRequest(`/api/jobs${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => apiRequest(`/api/jobs/${id}`),
  create: (data) => apiRequest('/api/jobs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/api/jobs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/api/jobs/${id}`, { method: 'DELETE' }),
};

export const applicationsAPI = {
  getAll: () => apiRequest('/api/applications'),
  submit: (data) => apiRequest('/api/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) =>
    apiRequest(`/api/applications/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  delete: (id) => apiRequest(`/api/applications/${id}`, { method: 'DELETE' }),
};

export const interviewsAPI = {
  getAll: () => apiRequest('/api/interviews'),
  schedule: (data) => apiRequest('/api/interviews', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/api/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const adminAPI = {
  getRecruiters: () => apiRequest('/api/admin/recruiters'),
  updateRecruiterStatus: (id, status) =>
    apiRequest(`/api/admin/recruiters/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  getCandidates: () => apiRequest('/api/admin/candidates'),
  getStats: () => apiRequest('/api/admin/stats'),
};

export const resumeAPI = {
  upload: async (file) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('resume', file);

    const response = await fetch(`${API_BASE}/api/resume/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Upload failed');
    return result;
  },
  get: () => apiRequest('/api/resume'),
  delete: () => apiRequest('/api/resume', { method: 'DELETE' }),
};

export default apiRequest;