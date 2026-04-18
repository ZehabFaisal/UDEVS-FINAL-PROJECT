import React, { useState } from 'react';
import { Briefcase, Calendar, TrendingUp, Search, User, FileText, CheckCircle, Clock } from 'lucide-react';

const CandidateDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { title: "Applications Sent", value: 12, icon: <FileText size={22} />, bg: "bg-blue-100", color: "text-blue-600" },
    { title: "Interviews Scheduled", value: 3, icon: <Calendar size={22} />, bg: "bg-green-100", color: "text-green-600" },
    { title: "Profile Views", value: 45, icon: <User size={22} />, bg: "bg-purple-100", color: "text-purple-600" },
    { title: "Success Rate", value: "25%", icon: <TrendingUp size={22} />, bg: "bg-orange-100", color: "text-orange-600" },
  ];

  const applications = [
    { 
      id: 1,
      jobTitle: "Frontend Developer", 
      company: "TechCorp Inc.", 
      status: "Under Review", 
      appliedDate: "2024-01-15",
      matchScore: 92
    },
    { 
      id: 2,
      jobTitle: "Full Stack Developer", 
      company: "StartupXYZ", 
      status: "Interview Scheduled", 
      appliedDate: "2024-01-10",
      matchScore: 88
    },
    { 
      id: 3,
      jobTitle: "React Developer", 
      company: "InnovateLabs", 
      status: "Rejected", 
      appliedDate: "2024-01-08",
      matchScore: 75
    },
    { 
      id: 4,
      jobTitle: "JavaScript Developer", 
      company: "WebSolutions Ltd", 
      status: "New", 
      appliedDate: "2024-01-12",
      matchScore: 85
    },
  ];

  const filteredApplications = applications.filter((app) => {
    return app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.company.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Interview Scheduled': 
        return 'bg-green-200 text-green-600';
      case 'Under Review': 
        return 'bg-yellow-200 text-yellow-600';
      case 'Rejected': 
        return 'bg-red-200 text-red-600';
      case 'New': 
        return 'bg-blue-200 text-blue-600';
      default: 
        return 'bg-gray-200 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Interview Scheduled': 
        return <CheckCircle size={16} />;
      case 'Under Review': 
        return <Clock size={16} />;
      case 'Rejected': 
        return <FileText size={16} />;
      case 'New': 
        return <Briefcase size={16} />;
      default: 
        return <FileText size={16} />;
    }
  };

  return (
    <div className='min-h-screen bg-gray-300 p-6 md:p-8'>
      <div className='max-w-7xl mx-auto mt-15'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2 underline'>Welcome to Candidate Dashboard</h1>
          <p className='text-gray-600'>Track your job applications and interview progress</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
          {
            stats.map((s, index) => (
              <div key={index} className='bg-white rounded-3xl shadow-sm p-5 flex justify-between items-center
                cursor-pointer hover:shadow-2xl'>
                <div>
                  <p className='text-black text-2xl font-bold underline'> {s.title} </p>
                  <h2 className="text-xl font-semibold text-black mt-1"> {s.value} </h2>
                </div>
                <div className={`p-3 rounded-lg ${s.bg} ${s.color}`}> {s.icon} </div>
              </div>
            ))
          }
        </div>

        <div className='mt-8'>
          <div className='flex flex-col md:flex-row gap-5'>
            <div className='relative flex-1'>
              <Search size={18} className='absolute top-3 left-3 text-black' />
              <input type="text" placeholder="Search applications by job title or company..."
                className='w-full border border-black rounded-lg pl-10 pr-4 py-2 focus:outline-none 
                focus:ring-2 focus:ring-blue-500 focus:border-none'
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {
            filteredApplications.length > 0 ? filteredApplications.map((app) => (
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
                </div>
              </div>
            )) : (
              <div className="col-span-full text-center text-xl font-bold underline text-red-600">
                Error! No applications are found.
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;