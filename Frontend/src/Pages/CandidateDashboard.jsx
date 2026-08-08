import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, TrendingUp, Search, User, FileText, CheckCircle, Clock, MapPin, Video, Upload, Trash2, File, FileCheck } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '../store/slices/applicationsSlice';
import { fetchInterviews } from '../store/slices/interviewsSlice';
import { resumeAPI } from '../services/api';

const CandidateDashboard = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.applications);
  const { interviews } = useSelector((state) => state.interviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("applications");
  const [resumeUrl, setResumeUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
    resumeAPI.get().then((res) => setResumeUrl(res.resume_url)).catch(() => {});
  }, [dispatch]);

  const getStatusLabel = (status) => {
    const map = {
      'new': 'New', 'under_review': 'Under Review', 'interview_scheduled': 'Interview Scheduled',
      'rejected': 'Rejected', 'hired': 'Hired',
    };
    return map[status] || status;
  };

  const formattedApplications = applications.map((app) => ({
    id: app.id,
    jobTitle: app.job?.title || app.role || 'N/A',
    company: app.job?.location || 'N/A',
    status: getStatusLabel(app.status),
    appliedDate: app.created_at ? new Date(app.created_at).toLocaleDateString() : 'N/A',
    matchScore: app.ai_score || 0,
  }));

  const scheduledInterviews = interviews.filter((iv) => iv.status === 'scheduled');

  const stats = [
    { title: "Applications Sent", value: formattedApplications.length, icon: <FileText size={22} />, bg: "bg-blue-100", color: "text-blue-600" },
    { title: "Interviews Scheduled", value: scheduledInterviews.length, icon: <Calendar size={22} />, bg: "bg-green-100", color: "text-green-600" },
    { title: "Hired", value: formattedApplications.filter(a => a.status === 'Hired').length, icon: <User size={22} />, bg: "bg-purple-100", color: "text-purple-600" },
    { title: "Avg Match Score", value: formattedApplications.length > 0 ? `${Math.round(formattedApplications.reduce((s, a) => s + a.matchScore, 0) / formattedApplications.length)}%` : "0%", icon: <TrendingUp size={22} />, bg: "bg-orange-100", color: "text-orange-600" },
  ];

  const filteredApplications = formattedApplications.filter((app) => {
    return app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.company.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredInterviews = scheduledInterviews.filter((iv) => {
    const jobTitle = iv.application?.job?.title || '';
    const interviewer = iv.interviewer?.name || '';
    return (
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interviewer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [".pdf", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowed.includes(ext)) {
      toast.error("Only PDF, DOC, DOCX files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const result = await resumeAPI.upload(file);
      setResumeUrl(result.resume_url);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to remove your resume?")) return;
    try {
      await resumeAPI.delete();
      setResumeUrl(null);
      toast.success("Resume removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove resume");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview Scheduled': return 'bg-green-200 text-green-600';
      case 'Under Review': return 'bg-yellow-200 text-yellow-600';
      case 'Rejected': return 'bg-red-200 text-red-600';
      case 'New': return 'bg-blue-200 text-blue-600';
      case 'Hired': return 'bg-emerald-200 text-emerald-600';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Interview Scheduled': return <CheckCircle size={16} />;
      case 'Under Review': return <Clock size={16} />;
      case 'Rejected': return <FileText size={16} />;
      case 'New': return <Briefcase size={16} />;
      default: return <FileText size={16} />;
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-300 p-6 md:p-8 flex items-center justify-center'>
        <p className="text-blue-600 text-xl">Loading your applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-300 p-6 md:p-8 flex items-center justify-center'>
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-300 p-6 md:p-8'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='max-w-7xl mx-auto mt-15'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2 underline'>Welcome to Candidate Dashboard</h1>
          <p className='text-gray-600'>Track your job applications and interview progress</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
          {stats.map((s, index) => (
            <div key={index} className='bg-white rounded-3xl shadow-sm p-5 flex justify-between items-center cursor-pointer hover:shadow-2xl'>
              <div>
                <p className='text-black text-2xl font-bold underline'> {s.title} </p>
                <h2 className="text-xl font-semibold text-black mt-1"> {s.value} </h2>
              </div>
              <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}> {s.icon} </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6 border-b-2 border-gray-400 pb-2">
          {[
            { key: 'applications', label: 'My Applications', icon: <FileText size={18} /> },
            { key: 'interviews', label: 'My Interviews', icon: <Calendar size={18} /> },
            { key: 'resume', label: 'My Resume', icon: <Upload size={18} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchTerm(''); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm cursor-pointer transition ${
                activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'applications' && (
          <>
            <div className='mt-6'>
              <div className='relative max-w-md'>
                <Search size={18} className='absolute top-3 left-3 text-black' />
                <input type="text" placeholder="Search applications by job title or company..."
                  className='w-full border border-black rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none'
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredApplications.length > 0 ? filteredApplications.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-xl"> {app.jobTitle} </h3>
                      <p className="text-sm font-semibold text-gray-500"> {app.company} </p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)} {app.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between font-semibold text-sm mb-1">
                      <span> Match Score </span>
                      <span> {app.matchScore}% </span>
                    </div>
                    <div className="w-full bg-gray-300 h-2 rounded-full">
                      <div className="bg-linear-to-r from-blue-700 to-purple-900 h-2 rounded-full"
                        style={{ width: `${app.matchScore}%` }}>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p><strong>Applied:</strong> {app.appliedDate}</p>
                    <div className="mt-2">
                      {resumeUrl ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                          <FileCheck size={14} /> Resume Uploaded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-orange-500 font-semibold">
                          <FileText size={14} /> No Resume Uploaded
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center text-xl font-bold underline text-red-600">
                  No applications found.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'interviews' && (
          <>
            <div className='mt-6'>
              <div className='relative max-w-md'>
                <Search size={18} className='absolute top-3 left-3 text-gray-500' />
                <input type="text" placeholder="Search by job title or interviewer..."
                  className='w-full border border-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredInterviews.length > 0 ? filteredInterviews.map((interview) => (
                <div key={interview.id} className="bg-white rounded-xl shadow-sm hover:shadow-2xl p-6 transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {interview.application?.job?.title || 'N/A'}
                      </h3>
                      <p className="text-sm font-semibold text-gray-500">
                        Interview with {interview.interviewer?.name || 'Recruiter'}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold bg-green-200 text-green-600">
                      <CheckCircle size={14} /> Scheduled
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-blue-500" />
                      <span><strong>Date:</strong> {interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-green-500" />
                      <span><strong>Time:</strong> {interview.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-purple-500" />
                      <span><strong>Location:</strong> {interview.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video size={14} className="text-orange-500" />
                      <span><strong>Type:</strong> {interview.type}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Interviewer: {interview.interviewer?.email || 'N/A'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center text-xl font-bold underline text-red-600">
                  No interviews scheduled yet.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'resume' && (
          <div className="mt-6 max-w-2xl">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 underline">My Resume</h2>
              <p className="text-gray-500 mb-6">Upload your resume so recruiters can review your profile.</p>

              {resumeUrl ? (
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-4 rounded-full">
                        <File size={32} className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-lg">Resume Uploaded</p>
                        <p className="text-sm text-gray-500">Your resume is visible to recruiters</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <a
                        href={`http://localhost:5000${resumeUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        View
                      </a>
                      <button
                        onClick={handleDeleteResume}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
                  <div className="bg-blue-100 p-4 rounded-full mb-4">
                    <Upload size={32} className="text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-700 text-lg">
                    {uploading ? "Uploading..." : "Click to upload your resume"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
                </label>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;