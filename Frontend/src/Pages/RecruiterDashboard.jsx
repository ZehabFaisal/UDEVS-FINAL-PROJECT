import React, { useState, useEffect } from 'react';
import { Users, Calendar, Briefcase, TrendingUp, Search, X, Funnel, Brain, Check, BarChart3, Plus, Edit3, Trash2, MapPin, Clock, FileText, FileCheck, Eye } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '../store/slices/applicationsSlice';
import { fetchInterviews, scheduleInterview } from '../store/slices/interviewsSlice';
import { fetchJobs, createJob, deleteJob } from '../store/slices/jobsSlice';

const RecruiterDashboard = () => {
  const dispatch = useDispatch();
  const { applications, loading: appsLoading } = useSelector((state) => state.applications);
  const { interviews, loading: interviewsLoading } = useSelector((state) => state.interviews);
  const { jobs, loading: jobsLoading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('candidates');
  const [searchTerm, set_SearchTerm] = useState('');
  const [filter, set_Filter] = useState('All');
  const [showModal, set_ShowModal] = useState(false);
  const [selected_Candidate, set_selected_Candidate] = useState(null);
  const [Ai_Modal, set_Ai_Modal] = useState(false);
  const [Analytics_Modal, set_Analytics_Modal] = useState(false);
  const [formData, set_FormData] = useState({ date: '', time: '', location: '' });

  const [showJobModal, set_ShowJobModal] = useState(false);
  const [jobFormData, set_JobFormData] = useState({
    title: '', category: 'Engineering', location: '', job_type: 'Full-time',
    salary_min: '', salary_max: '', description: '', requirements: '',
  });
  const [selectedJobForCVs, set_SelectedJobForCVs] = useState(null);
  const recruiterJobs = jobs.filter((j) => j.recruiter?.id === user?.id);

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
    dispatch(fetchJobs());
  }, [dispatch]);

  const getStatusLabel = (status) => {
    const map = {
      new: 'New', under_review: 'Under Review', interview_scheduled: 'Interview Scheduled',
      rejected: 'Rejected', hired: 'Hired',
    };
    return map[status] || status;
  };

  const getStatusColors = (status) => {
    const colors = {
      'Interview Scheduled': { bg: 'bg-green-200', text: 'text-green-600' },
      'Under Review': { bg: 'bg-yellow-200', text: 'text-yellow-600' },
      'Rejected': { bg: 'bg-red-200', text: 'text-red-600' },
      'New': { bg: 'bg-blue-200', text: 'text-blue-600' },
      'Hired': { bg: 'bg-emerald-200', text: 'text-emerald-600' },
    };
    return colors[status] || { bg: 'bg-gray-200', text: 'text-gray-600' };
  };

  const candidatesData = applications.map((app) => ({
    ...app,
    name: app.name || app.candidate?.name || 'Unknown',
    role: app.role || app.job?.title || 'N/A',
    score: app.ai_score || 0,
    status: getStatusLabel(app.status),
    skills: app.ai_analysis?.strengths || ['N/A'],
    email: app.email || app.candidate?.email || 'N/A',
    appliedDate: app.created_at || app.appliedDate || '',
  }));

  const filtered_Candidates = candidatesData.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.skills && c.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesStatus = filter === 'All' || c.status === filter;
    return matchesSearch && matchesStatus;
  });

  const avgScore =
    applications.length > 0
      ? Math.round(applications.reduce((sum, a) => sum + (a.ai_score || 0), 0) / applications.length)
      : 0;

  const stats = [
    { title: 'Total Candidates', value: candidatesData.length, icon: <Users size={22} />, bg: 'bg-blue-100', color: 'text-blue-600' },
    { title: 'Active Interviews', value: interviews.length, icon: <Calendar size={22} />, bg: 'bg-green-100', color: 'text-green-600' },
    { title: 'Open Positions', value: recruiterJobs.length, icon: <Briefcase size={22} />, bg: 'bg-purple-100', color: 'text-purple-600' },
    { title: 'Avg Match Score', value: `${avgScore}%`, icon: <TrendingUp size={22} />, bg: 'bg-orange-100', color: 'text-orange-600' },
  ];

  const statusFilters = ['All', 'New', 'Under Review', 'Interview Scheduled', 'Rejected', 'Hired'];

  const openModal = (candidate) => {
    set_selected_Candidate(candidate);
    set_ShowModal(true);
  };

  const closeModal = () => {
    set_ShowModal(false);
    set_FormData({ date: '', time: '', location: '' });
  };

  const open_Ai_Model = (candidate) => {
    set_selected_Candidate(candidate);
    set_Ai_Modal(true);
  };

  const close_Ai_Model = () => set_Ai_Modal(false);
  const open_Analytics_Model = () => set_Analytics_Modal(true);
  const close_Analytics_Model = () => set_Analytics_Modal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected_Candidate?.id) {
      toast.error('No application selected');
      return;
    }
    try {
      await dispatch(
        scheduleInterview({
          application_id: selected_Candidate.id,
          date: formData.date,
          time: formData.time,
          location: formData.location || 'Google Meet',
          type: 'Video-Call',
        })
      ).unwrap();
      toast.success(`Interview scheduled for ${selected_Candidate.name}!`);
      dispatch(fetchApplications());
      dispatch(fetchInterviews());
      closeModal();
    } catch (err) {
      toast.error(err || 'Failed to schedule interview');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobFormData,
        salary_min: jobFormData.salary_min ? parseInt(jobFormData.salary_min) : undefined,
        salary_max: jobFormData.salary_max ? parseInt(jobFormData.salary_max) : undefined,
        requirements: jobFormData.requirements
          ? jobFormData.requirements.split(',').map((r) => r.trim()).filter(Boolean)
          : [],
      };
      await dispatch(createJob(payload)).unwrap();
      toast.success('Job created successfully!');
      set_ShowJobModal(false);
      set_JobFormData({
        title: '', category: 'Engineering', location: '', job_type: 'Full-time',
        salary_min: '', salary_max: '', description: '', requirements: '',
      });
    } catch (err) {
      toast.error(err || 'Failed to create job');
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) return;
    try {
      await dispatch(deleteJob(jobId)).unwrap();
      toast.success('Job deleted successfully!');
    } catch (err) {
      toast.error(err || 'Failed to delete job');
    }
  };

  if (appsLoading || interviewsLoading || jobsLoading) {
    return (
      <div className="min-h-screen bg-gray-300 p-6 md:p-8 flex items-center justify-center">
        <p className="text-blue-600 text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-300 p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto mt-15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
          {stats.map((s, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-sm p-5 flex justify-between items-center cursor-pointer hover:shadow-2xl">
              <div>
                <p className="text-black text-2xl font-bold underline"> {s.title} </p>
                <h2 className="text-xl font-semibold text-black mt-1"> {s.value} </h2>
              </div>
              <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}> {s.icon} </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 border-b-2 border-gray-400 pb-2">
          {[
            { key: 'candidates', label: 'Candidates', icon: <Users size={18} /> },
            { key: 'jobs', label: 'My Jobs', icon: <Briefcase size={18} /> },
            { key: 'interviews', label: 'Interviews', icon: <Calendar size={18} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); set_SearchTerm(''); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={open_Analytics_Model}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition cursor-pointer text-sm font-semibold"
          >
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>

        {activeTab === 'candidates' && (
          <>
            <div className="flex flex-col md:flex-row gap-5 mt-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute top-3 left-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search candidates by name, position, or skills..."
                  className="w-full border border-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none"
                  value={searchTerm}
                  onChange={(e) => set_SearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Funnel size={20} className="absolute top-3 left-3 text-gray-700" />
                <select
                  className="border border-gray-500 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none bg-white appearance-none cursor-pointer"
                  value={filter}
                  onChange={(e) => set_Filter(e.target.value)}
                >
                  {statusFilters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filtered_Candidates.length > 0 ? (
                filtered_Candidates.map((c, index) => {
                  const statusColor = getStatusColors(c.status);
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-2xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800 text-[22px]"> {c.name} </h3>
                          <p className="text-sm font-semibold text-gray-500"> {c.role} </p>
                          <p className="text-xs text-gray-400 mt-1"> {c.email} </p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${statusColor.bg} ${statusColor.text}`}>
                          {c.status}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between font-semibold text-sm mb-1">
                          <span> Match Score </span>
                          <span> {c.score}% </span>
                        </div>
                        <div className="w-full bg-gray-300 h-2 rounded-full">
                          <div
                            className="bg-linear-to-r from-blue-700 to-purple-900 h-2 rounded-full"
                            style={{ width: `${c.score}%` }}
                          ></div>
                        </div>
                      </div>
                      {c.skills && c.skills.length > 0 && c.skills[0] !== 'N/A' && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {c.skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                              {skill}
                            </span>
                          ))}
                          {c.skills.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                              +{c.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                      <div className="flex gap-3 mt-5">
                        <button
                          onClick={() => openModal(c)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer text-sm text-center"
                        >
                          Schedule Interview
                        </button>
                        <button
                          onClick={() => open_Ai_Model(c)}
                          className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-sm text-center cursor-pointer"
                        >
                          AI Analysis
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-xl font-bold underline text-red-600">No candidates found.</div>
              )}
            </div>
          </>
        )}

        {activeTab === 'jobs' && (
          <>
            {selectedJobForCVs ? (
              <div className="mt-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => set_SelectedJobForCVs(null)}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition cursor-pointer text-sm font-semibold"
                  >
                    &larr; Back to Jobs
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 underline">
                      {selectedJobForCVs.title}
                    </h2>
                    <div className="flex gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {selectedJobForCVs.location}</span>
                      <span className="flex items-center gap-1"><Briefcase size={14} /> {selectedJobForCVs.category}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {selectedJobForCVs.job_type}</span>
                    </div>
                  </div>
                </div>

                {(() => {
                  const jobApplications = applications.filter((app) => String(app.job_id) === String(selectedJobForCVs.id));
                  if (jobApplications.length === 0) {
                    return (
                      <div className="text-center text-xl font-bold text-red-600 py-10">
                        No candidates have applied to this job yet.
                      </div>
                    );
                  }
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {jobApplications.map((app) => {
                        const candidateName = app.candidate?.name || app.name || 'Unknown';
                        const candidateEmail = app.candidate?.email || app.email || 'N/A';
                        const candidateResume = app.candidate?.resume_url || null;
                        const statusLabel = getStatusLabel(app.status);
                        const statusColor = getStatusColors(statusLabel);
                        const score = app.ai_score || 0;
                        return (
                          <div key={app.id} className="bg-white rounded-xl shadow-sm hover:shadow-2xl p-6 transition">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-gray-800 text-lg">{candidateName}</h3>
                                <p className="text-xs text-gray-400 mt-1">{candidateEmail}</p>
                              </div>
                              <span className={`text-xs px-3 py-1 rounded-full font-bold ${statusColor.bg} ${statusColor.text}`}>
                                {statusLabel}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Briefcase size={14} className="text-blue-500" />
                                <span className="font-semibold">{selectedJobForCVs.title}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin size={14} className="text-purple-500" />
                                <span>{selectedJobForCVs.location}</span>
                              </div>
                            </div>
                            <div className="mb-3">
                              <div className="flex justify-between font-semibold text-sm mb-1">
                                <span>Match Score</span>
                                <span>{score}%</span>
                              </div>
                              <div className="w-full bg-gray-300 h-2 rounded-full">
                                <div
                                  className="bg-linear-to-r from-blue-700 to-purple-900 h-2 rounded-full"
                                  style={{ width: `${score}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              {candidateResume ? (
                                <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                  <FileCheck size={14} /> Resume Uploaded
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
                                  <FileText size={14} /> No Resume
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {candidateResume && (
                                <a
                                  href={`http://localhost:5000${candidateResume}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-semibold transition"
                                >
                                  <Eye size={14} /> View Resume
                                </a>
                              )}
                              <button
                                onClick={() => {
                                  const mappedCandidate = {
                                    id: app.id,
                                    name: candidateName,
                                    email: candidateEmail,
                                    role: selectedJobForCVs.title,
                                    score: score,
                                    status: statusLabel,
                                    skills: app.ai_analysis?.strengths || ['N/A'],
                                    appliedDate: app.created_at || '',
                                  };
                                  set_selected_Candidate(mappedCandidate);
                                  set_ShowModal(true);
                                }}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm text-center cursor-pointer transition"
                              >
                                Schedule
                              </button>
                              <button
                                onClick={() => {
                                  const mappedCandidate = {
                                    id: app.id,
                                    name: candidateName,
                                    email: candidateEmail,
                                    role: selectedJobForCVs.title,
                                    score: score,
                                    status: statusLabel,
                                    skills: app.ai_analysis?.strengths || ['N/A'],
                                    appliedDate: app.created_at || '',
                                  };
                                  set_selected_Candidate(mappedCandidate);
                                  set_Ai_Modal(true);
                                }}
                                className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-sm text-center cursor-pointer"
                              >
                                AI Analysis
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mt-6">
                  <div className="relative flex-1 max-w-md">
                    <Search size={18} className="absolute top-3 left-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search your jobs..."
                      className="w-full border border-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => set_SearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => set_ShowJobModal(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer text-sm font-semibold"
                  >
                    <Plus size={18} /> Post New Job
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  {recruiterJobs
                    .filter((j) => j.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((job) => {
                      const jobAppCount = applications.filter((app) => String(app.job_id) === String(job.id)).length;
                      return (
                        <div key={job.id} className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 transition">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-800 text-xl underline">{job.title}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                                <span className="flex items-center gap-1"><Briefcase size={14} /> {job.category}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {job.job_type}</span>
                                {job.salary_min && job.salary_max && (
                                  <span className="flex items-center gap-1"><TrendingUp size={14} /> ${job.salary_min}k - ${job.salary_max}k</span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-3 text-sm line-clamp-2">{job.description}</p>
                              {job.requirements && job.requirements.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {(Array.isArray(job.requirements) ? job.requirements : []).slice(0, 4).map((req, i) => (
                                    <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{req}</span>
                                  ))}
                                </div>
                              )}
                              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                <span>{jobAppCount} applicant{jobAppCount !== 1 ? 's' : ''}</span>
                                <span>Posted {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}</span>
                                <span className={`px-2 py-0.5 rounded-full font-semibold ${job.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                                  {job.status}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => set_SelectedJobForCVs(job)}
                                className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer text-sm font-semibold"
                              >
                                <Eye size={14} /> View Applicants
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id, job.title)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Delete job"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {recruiterJobs.filter((j) => j.title.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="text-center text-xl font-bold text-red-600 py-10">
                      No jobs posted yet. Click "Post New Job" to get started.
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'interviews' && (
          <>
            <div className="relative mt-6 max-w-md">
              <Search size={18} className="absolute top-3 left-3 text-gray-500" />
              <input
                type="text"
                placeholder="Search interviews..."
                className="w-full border border-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => set_SearchTerm(e.target.value)}
              />
            </div>

            <div className="mt-6 space-y-4">
              {interviews
                .filter((interview) => {
                  const candidateName = interview.application?.candidate?.name || '';
                  const jobTitle = interview.application?.job?.title || '';
                  return (
                    candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
                  );
                })
                .map((interview) => (
                  <div key={interview.id} className="bg-white rounded-xl shadow-sm hover:shadow-md p-6 transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {interview.application?.candidate?.name || 'Unknown Candidate'}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500">
                          {interview.application?.job?.title || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {interview.application?.candidate?.email || ''}
                        </p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        interview.status === 'scheduled' ? 'bg-green-200 text-green-600' :
                        interview.status === 'completed' ? 'bg-blue-200 text-blue-600' :
                        'bg-red-200 text-red-600'
                      }`}>
                        {interview.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {interview.date}</span>
                      <span className="flex items-center gap-1"><Clock size={14} /> {interview.time}</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> {interview.location}</span>
                      <span className="flex items-center gap-1"><Brain size={14} /> {interview.type}</span>
                    </div>
                  </div>
                ))}
              {interviews.length === 0 && (
                <div className="text-center text-xl font-bold text-red-600 py-10">
                  No interviews scheduled yet.
                </div>
              )}
            </div>
          </>
        )}

        {showModal && selected_Candidate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
              <button onClick={closeModal} className="absolute cursor-pointer top-3 right-3 text-gray-500">
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">Schedule Interview for {selected_Candidate.name} </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1"> Date </label>
                  <input type="date" className="w-full border rounded-lg px-3 py-2" required
                    value={formData.date} onChange={(e) => set_FormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block font-semibold mb-1"> Time </label>
                  <input type="time" className="w-full border rounded-lg px-3 py-2" required
                    value={formData.time} onChange={(e) => set_FormData({ ...formData, time: e.target.value })} />
                </div>
                <div>
                  <label className="block font-semibold mb-1"> Location </label>
                  <select className="w-full border rounded-lg px-3 py-2" required
                    value={formData.location} onChange={(e) => set_FormData({ ...formData, location: e.target.value })}>
                    <option value="">Select location</option>
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="Office">Office</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  Schedule
                </button>
              </form>
            </div>
          </div>
        )}

        {showJobModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg relative mt-40 mb-10">
              <button onClick={() => set_ShowJobModal(false)} className="absolute cursor-pointer top-3 right-3 text-gray-500">
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center underline">Post New Job</h2>
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block font-semibold mb-1">Job Title *</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" required
                    placeholder="e.g. Senior Frontend Developer"
                    value={jobFormData.title} onChange={(e) => set_JobFormData({ ...jobFormData, title: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Category *</label>
                    <select className="w-full border rounded-lg px-3 py-2" required
                      value={jobFormData.category} onChange={(e) => set_JobFormData({ ...jobFormData, category: e.target.value })}>
                      <option value="Engineering">Engineering</option>
                      <option value="IT Operations">IT Operations</option>
                      <option value="Data">Data</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Job Type *</label>
                    <select className="w-full border rounded-lg px-3 py-2" required
                      value={jobFormData.job_type} onChange={(e) => set_JobFormData({ ...jobFormData, job_type: e.target.value })}>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Location *</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2" required
                    placeholder="e.g. Remote, San Francisco, CA"
                    value={jobFormData.location} onChange={(e) => set_JobFormData({ ...jobFormData, location: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Min Salary</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" min="0"
                      placeholder="e.g. 80"
                      value={jobFormData.salary_min} onChange={(e) => set_JobFormData({ ...jobFormData, salary_min: e.target.value })} />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Max Salary</label>
                    <input type="number" className="w-full border rounded-lg px-3 py-2" min="0"
                      placeholder="e.g. 120"
                      value={jobFormData.salary_max} onChange={(e) => set_JobFormData({ ...jobFormData, salary_max: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Description *</label>
                  <textarea className="w-full border rounded-lg px-3 py-2" rows="4" required
                    placeholder="Describe the role, responsibilities..."
                    value={jobFormData.description} onChange={(e) => set_JobFormData({ ...jobFormData, description: e.target.value })} />
                </div>
                <div>
                  <label className="block font-semibold mb-1"> Job Requirements *</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g. 3+ years React, TypeScript, Node.js"
                    value={jobFormData.requirements} onChange={(e) => set_JobFormData({ ...jobFormData, requirements: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-semibold">
                  Post Job
                </button>
              </form>
            </div>
          </div>
        )}

        {Ai_Modal && selected_Candidate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-8 mt-40 relative shadow-xl">
              <button onClick={close_Ai_Model} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer">
                <X size={22} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-700 text-white p-3 rounded-full"><Brain /></div>
                <div>
                  <h2 className="text-2xl font-bold underline"> AI Analysis </h2>
                  <p className="text-gray-500"> {selected_Candidate.name} </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <h3 className="font-semibold mb-3"> Overall Match Score </h3>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-blue-600">{selected_Candidate.score}%</span>
                  <div className="flex-1 bg-gray-300 h-3 rounded-full">
                    <div className="bg-linear-to-r from-blue-600 to-purple-600 h-3 rounded-full"
                      style={{ width: `${selected_Candidate.score}%` }} />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-3"> Key Strengths </h3>
                <ul className="space-y-2 text-gray-700">
                  {selected_Candidate.skills &&
                    selected_Candidate.skills.filter((s) => s !== 'N/A').slice(0, 4).map((skill, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-600 font-bold"><Check /></span>
                        Strong expertise in {skill}
                      </li>
                    ))}
                  {(!selected_Candidate.skills || selected_Candidate.skills.length === 0 || selected_Candidate.skills[0] === 'N/A') && (
                    <li className="text-gray-500">No skill data available yet</li>
                  )}
                </ul>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-xl p-5">
                <h3 className="font-semibold mb-1">Recommendation</h3>
                <p className="text-green-700 font-semibold">
                  {selected_Candidate.score >= 80 ? 'Highly Recommended' :
                   selected_Candidate.score >= 60 ? 'Recommended' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
        )}

        {Analytics_Modal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-8 mt-20 relative shadow-xl">
              <button onClick={close_Analytics_Model} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer">
                <X size={22} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-700 text-white p-3 rounded-full"><BarChart3 /></div>
                <div>
                  <h2 className="text-2xl font-bold underline">Recruitment Analytics</h2>
                  <p className="text-gray-500">Overview of hiring pipeline performance</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-semibold">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-semibold">Interviews Scheduled</p>
                  <p className="text-3xl font-bold text-green-600">{interviews.length}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-semibold">Avg Match Score</p>
                  <p className="text-3xl font-bold text-purple-600">{avgScore}%</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 font-semibold">Open Positions</p>
                  <p className="text-3xl font-bold text-orange-600">{jobs.length}</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Pipeline Breakdown</h3>
                <div className="space-y-3">
                  {statusFilters.slice(1).map((status) => {
                    const count = candidatesData.filter((c) => c.status === status).length;
                    const percentage = candidatesData.length > 0 ? Math.round((count / candidatesData.length) * 100) : 0;
                    const statusColor = getStatusColors(status);
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-sm font-semibold mb-1">
                          <span>{status}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div className={`h-2 rounded-full ${statusColor.bg.replace('200', '500')}`}
                            style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold mb-1">Top Skills in Pipeline</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[...new Set(candidatesData.flatMap((c) => c.skills || []).filter((s) => s !== 'N/A'))]
                    .slice(0, 8)
                    .map((skill, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;