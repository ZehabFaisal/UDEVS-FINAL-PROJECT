import React, { useState, useEffect } from 'react';
import { Users, Calendar, Briefcase, TrendingUp, Search, X, Brain, Check } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '../store/slices/applicationsSlice';
import { fetchInterviews, scheduleInterview } from '../store/slices/interviewsSlice';
import { fetchJobs } from '../store/slices/jobsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { applications, loading: appsLoading } = useSelector((state) => state.applications);
  const { interviews, loading: interviewsLoading } = useSelector((state) => state.interviews);
  const { jobs } = useSelector((state) => state.jobs);

  const [searchTerm, set_SearchTerm] = useState("");
  const [filter, set_Filter] = useState("All");
  const [showModal, set_ShowModal] = useState(false);
  const [selected_Candidate, set_selected_Candidate] = useState(null);
  const [Ai_Modal, set_Ai_Modal] = useState(false);
  const [formData, set_FormData] = useState({
    date: '', time: '', location: ''
  });

  useEffect(() => {
    dispatch(fetchApplications());
    dispatch(fetchInterviews());
    dispatch(fetchJobs());
  }, [dispatch]);

  const getStatusLabel = (status) => {
    const map = {
      'new': 'New',
      'under_review': 'Under Review',
      'interview_scheduled': 'Interview Scheduled',
      'rejected': 'Rejected',
      'hired': 'Hired',
    };
    return map[status] || status;
  };

  const stats = [
    { title: "Total Candidates", value: applications.length, icon: <Users size={22} />, bg: "bg-blue-100", color: "text-blue-600" },
    { title: "Interviews", value: interviews.length, icon: <Calendar size={22} />, bg: "bg-green-100", color: "text-green-600" },
    { title: "Active Jobs", value: jobs.length, icon: <Briefcase size={22} />, bg: "bg-purple-100", color: "text-purple-600" },
    { title: "Avg Match Score", value: applications.length > 0 ? `${Math.round(applications.reduce((sum, a) => sum + (a.ai_score || 0), 0) / applications.length)}%` : "0%", icon: <TrendingUp size={22} />, bg: "bg-orange-100", color: "text-orange-600" },
  ];

  const Candidates_Data = applications.map((app) => ({
    ...app,
    name: app.name || app.candidate?.name || 'Unknown',
    role: app.role || app.job?.title || 'N/A',
    score: app.ai_score || 0,
    status: getStatusLabel(app.status),
    skills: app.ai_analysis?.strengths || [],
  }));

  const filtered_Candidates = Candidates_Data.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.skills && c.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesStatus = filter === "All" || c.status === filter;
    return matchesSearch && matchesStatus;
  });

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

  const close_Ai_Model = () => {
    set_Ai_Modal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected_Candidate?.id) {
      toast.error('No application selected');
      return;
    }
    try {
      await dispatch(scheduleInterview({
        application_id: selected_Candidate.id,
        date: formData.date,
        time: formData.time,
        location: formData.location || 'Google Meet',
        type: 'Video-Call',
      })).unwrap();
      toast.success(`Interview scheduled for ${selected_Candidate.name}!`);
      dispatch(fetchApplications());
      dispatch(fetchInterviews());
      closeModal();
    } catch (err) {
      toast.error(err || 'Failed to schedule interview');
    }
  };

  if (appsLoading || interviewsLoading) {
    return (
      <div className='min-h-screen bg-gray-300 p-6 md:p-8 flex items-center justify-center'>
        <p className="text-blue-600 text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-300 p-6 md:p-8'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='max-w-7xl mx-auto mt-15'>
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

        <div className='flex flex-col md:flex-row gap-5 mt-6'>
          <div className='relative flex-1'>
            <Search size={18} className='absolute top-3 left-3 text-gray-500' />
            <input type="text" placeholder="Search candidates by name, position, or skills..."
              className='w-full border border-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-none'
              value={searchTerm} onChange={(e) => set_SearchTerm(e.target.value)} />
          </div>
          <select value={filter} onChange={(e) => set_Filter(e.target.value)}
            className='border border-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500'>
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
            <option value="Hired">Hired</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered_Candidates.length > 0 ? filtered_Candidates.map((c, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-2xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800 text-[22px]"> {c.name} </h3>
                  <p className="text-sm font-semibold text-gray-500"> {c.role} </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-200 font-bold text-blue-600">
                  {c.status} </span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between font-semibold text-sm mb-1">
                  <span> Match Score </span>
                  <span> {c.score}% </span>
                </div>
                <div className="w-full bg-gray-300 h-2 rounded-full">
                  <div className="bg-linear-to-r from-blue-700 to-purple-900 h-2 rounded-full"
                    style={{ width: `${c.score}%` }}>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button onClick={() => openModal(c)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 cursor-pointer text-sm text-center">
                  Schedule Interview </button>
                <button onClick={() => open_Ai_Model(c)} className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-sm text-center cursor-pointer">
                  AI Analysis </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center text-xl font-bold underline text-red-600">
              No candidates found.
            </div>
          )}
        </div>

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

        {Ai_Modal && selected_Candidate && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-8 mt-40 relative shadow-xl">
              <button onClick={close_Ai_Model} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 cursor-pointer">
                <X size={22} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-700 text-white p-3 rounded-full">
                  <Brain />
                </div>
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
                  {selected_Candidate.skills && selected_Candidate.skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold"> <Check /> </span>
                      Strong expertise in {skill}
                    </li>
                  ))}
                  {(!selected_Candidate.skills || selected_Candidate.skills.length === 0) && (
                    <li className="text-gray-500">No skill data available yet</li>
                  )}
                </ul>
              </div>
              <div className="bg-green-100 border border-green-300 rounded-xl p-5">
                <h3 className="font-semibold mb-1">Recommendation</h3>
                <p className="text-green-700 font-semibold">
                  {selected_Candidate.score >= 80 ? 'Highly Recommended' : selected_Candidate.score >= 60 ? 'Recommended' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
