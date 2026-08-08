import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../store/slices/applicationsSlice";

const Application = () => {
  const dispatch = useDispatch();
  const { applications, loading, error } = useSelector((state) => state.applications);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const filtered =
    filterStatus === "All"
      ? applications
      : applications.filter((c) => {
          const statusMap = {
            'new': 'New',
            'under_review': 'Under Review',
            'interview_scheduled': 'Interview Scheduled',
            'rejected': 'Rejected',
            'hired': 'Hired',
          };
          return statusMap[c.status] === filterStatus || c.status === filterStatus;
        });

  const total = applications.length;
  const newCount = applications.filter(c => c.status === "new").length;
  const reviewCount = applications.filter(c => c.status === "under_review").length;
  const interviewCount = applications.filter(c => c.status === "interview_scheduled").length;

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

  const getStatusStyle = (status) => {
    const label = getStatusLabel(status);
    switch (label) {
      case "Interview Scheduled":
        return "bg-green-100 text-green-700";
      case "Under Review":
        return "bg-yellow-100 text-yellow-700";
      case "New":
        return "bg-blue-100 text-blue-700";
      case "Hired":
        return "bg-emerald-100 text-emerald-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto mt-15">
        <h1 className="text-3xl font-bold"> Application Tracking </h1>
        <p className="text-gray-500 mt-1">
          Monitor and manage all candidate applications!
        </p>

        {loading && (
          <div className="text-blue-600 mt-4 text-center">Loading applications...</div>
        )}
        {error && (
          <div className="text-red-600 mt-4 text-center">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard title="Total Applications" value={total} />
          <StatCard title="New" value={newCount} />
          <StatCard title="Under Review" value={reviewCount} />
          <StatCard title="Interviews Scheduled" value={interviewCount} />
        </div>

        <div className="flex justify-between items-center mt-6 border-gray-800 outline-1 rounded-lg">
          <div>
            <label className="mr-2 ml-3 font-medium"> Filter by Status: </label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
              className="border-none outline px-3 py-1 rounded-lg ml-2">
              <option value="All"> All </option>
              <option value="New"> New </option>
              <option value="Under Review"> Under Review </option>
              <option value="Interview Scheduled"> Interview Scheduled </option>
              <option value="Rejected"> Rejected </option>
              <option value="Hired"> Hired </option>
            </select>
          </div>

          <p className="text-sm text-gray-600 mr-3">
            Showing {filtered.length} of {total} applications
          </p>
        </div>

        <div className="sm:hidden space-y-4 mt-4">
          {filtered.map((c, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-4 space-y-3">
              <div>
                <p className="font-bold text-lg"> {c.name || 'Unknown'} </p>
                <p className="text-gray-500 text-sm"> {c.role || 'N/A'} </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1"> Match Score </p>
                <div className="flex items-center gap-3">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-linear-to-r from-blue-600 to-purple-700 h-2 rounded-full"
                      style={{ width: `${c.ai_score || 0}%` }}
                    />
                  </div>
                  <span className="text-sm"> {c.ai_score || 0}% </span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium"> Status: </span>
                <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(c.status)}`}>
                  {getStatusLabel(c.status)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="font-medium"> Applied: </span>
                <span>{formatDate(c.created_at)}</span>
              </div>

              {c.interview && (
                <div className="text-sm">
                  <p className="font-medium"> Interview: </p>
                  <div className="text-gray-600">
                    <p> {c.interview.date} </p>
                    <p> {c.interview.time} </p>
                    <p> {c.interview.location} - {c.interview.type} </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow mt-4">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-800 font-bold uppercase text-md">
              <tr>
                <th className="px-6 py-3"> Candidate </th>
                <th className="px-6 py-3"> Position </th>
                <th className="px-6 py-3"> Match Score </th>
                <th className="px-6 py-3"> Status </th>
                <th className="px-6 py-3"> Applied Date </th>
                <th className="px-6 py-3"> Interview </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium"> {c.name || 'Unknown'} </td>
                  <td className="px-6 py-4"> {c.role || 'N/A'} </td>
                  <td className="px-6 py-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="bg-linear-to-r from-blue-600 to-purple-700 h-2 rounded-full"
                          style={{ width: `${c.ai_score || 0}%` }}
                        />
                      </div>
                      <span> {c.ai_score || 0}% </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs rounded-full md:text-sm ${getStatusStyle(c.status)}`}>
                      {getStatusLabel(c.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(c.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    {c.interview ? (
                      <div className="text-sm">
                        <p> {c.interview.date} </p>
                        <p> {c.interview.time} </p>
                        <p className="text-gray-500"> {c.interview.location} </p>
                      </div>
                    ) : (
                      <span className="text-gray-400"> Not Scheduled </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && !loading && (
            <div className="text-center font-bold py-6 text-xl text-red-500 sm:mt-5">
              No applications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl p-5 shadow">
    <p className="text-black font-bold text-xl underline"> {title} </p>
    <h2 className="text-xl font-bold mt-2 text-gray-800"> {value} </h2>
  </div>
);

export default Application;
