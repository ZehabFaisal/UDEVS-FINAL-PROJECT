import React, { useState } from 'react';
import { Users, Calendar, Briefcase, TrendingUp, Search, X, Funnel, Brain, Check, Plus, 
    Edit, Trash2, Eye, BarChart3, Clock, MapPin, DollarSign } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecruiterDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [aiModal, setAiModal] = useState(false);
  const [jobModal, setJobModal] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState(false);
  const [formData, setFormData] = useState({
    date: '', time: '', interviewer: '', location: ''
  });
  const [jobFormData, setJobFormData] = useState({
    title: '', description: '', requirements: '', salary: '', location: '', type: 'Full-time'
  });

  const stats = [
    { title: "Total Candidates", value: 156, icon: <Users size={22} />, bg: "bg-blue-100", color: "text-blue-600", change: "+12%", changeType: "positive" },
    { title: "Active Interviews", value: 23, icon: <Calendar size={22} />, bg: "bg-green-100", color: "text-green-600", change: "+5%", changeType: "positive" },
    { title: "Open Positions", value: 12, icon: <Briefcase size={22} />, bg: "bg-purple-100", color: "text-purple-600", change: "-2%", changeType: "negative" },
    { title: "Avg Match Score", value: "87%", icon: <TrendingUp size={22} />, bg: "bg-orange-100", color: "text-orange-600", change: "+3%", changeType: "positive" },
  ];

  const candidatesData = [
    { id: 1, name: "Ahmed Khan", role: "Frontend Developer", score: 92, status: "Interview Scheduled", skills: ["React Js", "TypeScript", "HTML", "CSS", "REST APIs"], appliedDate: "2024-01-15", experience: "3 years", location: "Karachi, PK", email: "ahmed.khan@gmail.com" },
    { id: 2, name: "Ahsan Ali", role: "Backend Developer", score: 88, status: "Under Review", skills: ["Node.js", "Python", "SQL", "Microservices", "REST APIs"], appliedDate: "2024-01-14", experience: "4 years", location: "Lahore, PK", email: "ahsan.ali@gmail.com" },
    { id: 3, name: "Omar Siddiqui", role: "Full Stack Developer", score: 90, status: "New", skills: ["Node.js", "React", "MongoDB", "PostgreSQL", "CI/CD"], appliedDate: "2024-01-13", experience: "5 years", location: "Islamabad, PK", email: "omar.siddiqui@gmail.com" },
    { id: 4, name: "Ayesha Malik", role: "DevOps Engineer", score: 87, status: "Interview Scheduled", skills: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"], appliedDate: "2024-01-12", experience: "3 years", location: "Remote", email: "ayesha.malik@gmail.com" },
    { id: 5, name: "Hassan Javed", role: "Data Scientist", score: 93, status: "Under Review", skills: ["Python", "Machine Learning", "SQL", "AI", "Statistics"], appliedDate: "2024-01-11", experience: "4 years", location: "Karachi, PK", email: "hassan.javed@gmail.com" },
    { id: 6, name: "Abdur Rahman", role: "Cybersecurity Analyst", score: 89, status: "New", skills: ["Network Security", "SIEM tools", "Penetration Testing", "Incident Response"], appliedDate: "2024-01-10", experience: "6 years", location: "Lahore, PK", email: "abdur.rahman@gmail.com" },
    { id: 7, name: "Yusuf Ahmed", role: "Cloud Engineer", score: 91, status: "Interview Scheduled", skills: ["AWS", "Azure", "GCP", "Docker", "Kubernetes"], appliedDate: "2024-01-09", experience: "4 years", location: "Remote", email: "yusuf.ahmed@gmail.com" },
    { id: 8, name: "Maryam Noor", role: "AI / ML Engineer", score: 94, status: "New", skills: ["Python", "TensorFlow", "PyTorch", "Deep Learning", "Model Deployment"], appliedDate: "2024-01-08", experience: "3 years", location: "Islamabad, PK", email: "maryam.noor@gmail.com" },
  ];

  const jobsData = [
    { id: 1, title: "Senior Frontend Developer", applicants: 45, status: "Active", postedDate: "2024-01-05", location: "Remote", salary: "$80k - $120k", type: "Full-time", views: 234 },
    { id: 2, title: "Backend Engineer", applicants: 32, status: "Active", postedDate: "2024-01-07", location: "New York", salary: "$90k - $130k", type: "Full-time", views: 189 },
    { id: 3, title: "Full Stack Developer", applicants: 28, status: "Active", postedDate: "2024-01-10", location: "San Francisco", salary: "$100k - $140k", type: "Full-time", views: 156 },
    { id: 4, title: "DevOps Engineer", applicants: 19, status: "Active", postedDate: "2024-01-12", location: "Remote", salary: "$95k - $125k", type: "Full-time", views: 98 },
  ];

  const recentActivities = [
    { id: 1, type: "interview", message: "Interview scheduled with Ahmed Khan", time: "2 hours ago", icon: <Calendar size={16} /> },
    { id: 2, type: "application", message: "New application received for Frontend Developer", time: "4 hours ago", icon: <Users size={16} /> },
    { id: 3, type: "job", message: "Job posting 'Backend Engineer' went live", time: "1 day ago", icon: <Briefcase size={16} /> },
    { id: 4, type: "analysis", message: "AI analysis completed for Omar Siddiqui", time: "2 days ago", icon: <Brain size={16} /> },
  ];

  const filteredCandidates = candidatesData.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = filter === "All" || c.status === filter;
    return matchesSearch && matchesStatus;
  });

  const openModal = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ date: '', time: '', interviewer: '', location: '' });
  };

  const openAiModal = (candidate) => {
    setSelectedCandidate(candidate);
    setAiModal(true);
  };

  const closeAiModal = () => {
    setAiModal(false);
  };

  const openJobModal = () => {
    setJobModal(true);
  };

  const closeJobModal = () => {
    setJobModal(false);
    setJobFormData({ title: '', description: '', requirements: '', salary: '', location: '', 
        type: 'Full-time' });
  };

  const openAnalyticsModal = () => {
    setAnalyticsModal(true);
  };

  const closeAnalyticsModal = () => {
    setAnalyticsModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success(`Interview scheduled for ${selectedCandidate.name}!`);
    closeModal();
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    toast.success('Job posted successfully!');
    closeJobModal();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview Scheduled': return 'bg-green-200 text-green-600';
      case 'Under Review': return 'bg-yellow-200 text-yellow-600';
      case 'Rejected': return 'bg-red-200 text-red-600';
      case 'New': return 'bg-blue-200 text-blue-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'interview': return 'text-green-600';
      case 'application': return 'text-blue-600';
      case 'job': return 'text-purple-600';
      case 'analysis': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6 md:p-8'>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className='max-w-7xl mx-auto mb-8'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl underline font-bold text-gray-800 mb-2 mt-15'>Welcome To Recruiter 
                Dashboard</h1>
            <p className='text-gray-600'>Manage candidates, jobs, and interviews efficiently</p>
          </div>
          <div className='flex gap-3'>
            <button
              onClick={openAnalyticsModal}
              className='bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition
              cursor-pointer flex items-center gap-2'>
                <BarChart3 size={20} /> Show Analytics
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          {stats.map((stat, index) => (
            <div key={index} className='bg-white rounded-xl shadow-sm p-6 flex justify-between items-center
                 cursor-pointer hover:shadow-lg transition'>
              <div>
                <p className='text-gray-600 text-sm font-medium mb-1'>{stat.title}</p>
                <h2 className="text-2xl font-bold text-gray-800">{stat.value}</h2>
                <p className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' 
                    : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          ))}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          <div className='bg-gray-300 rounded-xl shadow-sm p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 underline'>Recent Activities</h2>
            <div className='space-y-8 mt-10'>
              {
                recentActivities.map((activity) => (
                    <div key={activity.id} className='flex items-start gap-3 p-3 rounded-lg
                        hover:bg-gray-50 transition'>
                    <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                        {activity.icon}
                    </div>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-800 font-medium'>{activity.message}</p>
                        <p className='text-xs text-gray-500 mt-1'>{activity.time}</p>
                    </div>
                    </div>
                ))
              }
            </div>
          </div>

          <div className='bg-gray-300 rounded-xl shadow-sm p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 underline'>Active Job Postings</h2>
            <div className='space-y-4 mt-10'>
              {
                jobsData.map((job) => (
                    <div key={job.id} className='border hover:bg-white rounded-lg p-4 hover:shadow-md transition'>
                        <div className='flex justify-between items-start mb-2'>
                            <h3 className='font-semibold text-gray-800 text-sm'>{job.title}</h3>
                            <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                                Active</span>
                        </div>
                        
                        <div className='text-xs text-gray-600 space-y-1 mb-3'>
                            <p className='flex items-center gap-1'><MapPin size={12} /> {job.location}</p>
                            <p className='flex items-center gap-1'><DollarSign size={12} /> {job.salary}</p>
                            <p className='flex items-center gap-1'><Eye size={12} /> {job.views} views</p>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='text-xs text-gray-500'>{job.applicants} applicants</span>
                        </div>
                    </div>
                ))
              }
            </div>
          </div>

          <div className='bg-gray-300 rounded-xl shadow-sm p-6'>
            <h2 className='text-2xl font-bold text-gray-800 mb-4 underline'>Quick Actions</h2>
            <div className='space-y-8 mt-10'>
              <button className='w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition text-left flex items-center gap-3'>
                <Users size={18} />
                <span className='text-sm font-medium'>Bulk Import Candidates</span>
              </button>
              <button className='w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition text-left flex items-center gap-3'>
                <Calendar size={18} />
                <span className='text-sm font-medium'>Schedule Interviews</span>
              </button>
              <button className='w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition text-left flex items-center gap-3'>
                <BarChart3 size={18} />
                <span className='text-sm font-medium'>Generate Reports</span>
              </button>
              <button className='w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition text-left flex items-center gap-3'>
                <Brain size={18} />
                <span className='text-sm font-medium'>AI Insights</span>
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-sm p-6 mt-8'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-gray-800 underline'>Candidate Management</h2>
            <div className='flex gap-4'>
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className='border rounded-lg 
                    px-3 py-2 text-sm '>
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>
          </div>

          <div className='relative mb-6'>
            <Search size={18} className='absolute top-3 left-3 text-gray-500' />
            <input type="text" placeholder="Search candidates by name, position, or skills..."
              className='w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none 
              focus:ring-2 focus:ring-blue-500 focus:border-none'
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.length > 0 ? filteredCandidates.map((candidate) => (
              <div key={candidate.id} className="bg-gray-50 rounded-xl shadow-sm p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-xl mb-1">{candidate.name}</h3>
                    <p className="text-sm font-medium text-gray-600 mb-2">{candidate.role}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{candidate.score}%</div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: `${candidate.score}%` }}></div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-gray-700 mb-2">Key Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.slice(0, 3).map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {candidate.skills.length > 3 && (
                      <span className="text-xs text-gray-500">+{candidate.skills.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4 space-y-1">
                  <p> {candidate.email}</p>
                  <p> {candidate.location}</p>
                  <p> {candidate.experience}</p>
                  <p> Applied: {candidate.appliedDate}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(candidate)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => openAiModal(candidate)}
                    className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-700 hover:text-white transition text-sm font-medium"
                  >
                    AI Analysis
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">No candidates found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Schedule Interview</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-800">{selectedCandidate.name}</h3>
              <p className="text-sm text-gray-600">{selectedCandidate.role}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interviewer</label>
                <input
                  type="text"
                  placeholder="Enter interviewer name"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.interviewer}
                  onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                >
                  <option value="">Select location</option>
                  <option value="Google Meet">Google Meet</option>
                  <option value="Zoom">Zoom</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Office">Office</option>
                  <option value="Phone">Phone</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Schedule Interview
              </button>
            </form>
          </div>
        </div>
      )}
      
      {aiModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Brain className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Analysis</h2>
                  <p className="text-gray-600">{selectedCandidate.name}</p>
                </div>
              </div>
              <button onClick={closeAiModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-3">Overall Match Score</h3>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-blue-600">{selectedCandidate.score}%</span>
                  <div className="flex-1 bg-gray-200 h-3 rounded-full">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" style={{ width: `${selectedCandidate.score}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Key Strengths</h3>
                <ul className="space-y-2">
                  {selectedCandidate.skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="text-green-600 mt-0.5" size={16} />
                      <span className="text-gray-700">Strong expertise in {skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">Development Areas</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    Could benefit from additional enterprise-level experience
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 font-bold">•</span>
                    Limited exposure to large-scale distributed systems
                  </li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-semibold mb-1 text-green-800">Recommendation</h3>
                <p className="text-green-700 font-medium">Highly Recommended for {selectedCandidate.role} position</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {analyticsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recruitment Analytics</h2>
              <button onClick={closeAnalyticsModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2">Application Trends</h3>
                <div className="text-3xl font-bold text-blue-600 mb-2">+24%</div>
                <p className="text-sm text-blue-700">Increase in applications this month</p>
              </div>
              
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">Interview Success Rate</h3>
                <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
                <p className="text-sm text-green-700">Candidates proceeding to next round</p>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="font-semibold text-purple-800 mb-2">Time to Hire</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">18 days</div>
                <p className="text-sm text-purple-700">Average time from application to offer</p>
              </div>
              
                <div className="bg-orange-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-orange-800 mb-2">Top Skills</h3>
                    <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm">React</span>
                        <span className="text-sm font-semibold">85%</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-sm">Python</span>
                        <span className="text-sm font-semibold">72%</span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-sm">AWS</span>
                        <span className="text-sm font-semibold">68%</span>
                    </div>
                    </div>
                </div>

              <div className="bg-red-50 p-6 rounded-xl">
                <h3 className="font-semibold text-red-800 mb-2">Rejection Rate</h3>
                <div className="text-3xl font-bold text-red-600 mb-2">32%</div>
                <p className="text-sm text-red-700">Applications not meeting criteria</p>
              </div>

              <div className="bg-indigo-50 p-6 rounded-xl">
                <h3 className="font-semibold text-indigo-800 mb-2">Diversity Score</h3>
                <div className="text-3xl font-bold text-indigo-600 mb-2">8.5/10</div>
                <p className="text-sm text-indigo-700">Candidate pool diversity rating</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;