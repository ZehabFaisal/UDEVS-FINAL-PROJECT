import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Briefcase, FileText, Clock } from 'lucide-react';
import { fetchAdminStats, fetchRecruiters, fetchCandidates, updateRecruiterStatus, } from 
  '../store/slices/adminSlice';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const {recruiters, candidates, stats, loading} = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchRecruiters());
    dispatch(fetchCandidates());
  }, [dispatch]);

  const filteredRecruiters = recruiters.filter((item) => {
    const name = item.name?.toLowerCase() || '';
    const company = item.company?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      company.includes(search)
    );
  });

  const filteredCandidates = candidates.filter((item) => {
    const name = item.name?.toLowerCase() || '';
    const role = item.role_applied?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return (
      name.includes(search) ||
      role.includes(search)
    );
  });
  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
    dispatch(updateRecruiterStatus({ id, status: newStatus }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6 md:p-10">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
          <p className="text-slate-500 text-lg">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Portal</h1>
          <p className="text-slate-600">
            Manage recruiter accounts, candidate profiles, and review hiring activity.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users size={16} />
                  <p className="text-sm">Recruiters</p>
                </div>
                <p className="text-3xl font-semibold text-slate-900">
                  {stats?.totalRecruiters ?? recruiters.length}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Users size={16} />
                  <p className="text-sm">Candidates</p>
                </div>
                <p className="text-3xl font-semibold text-slate-900">
                  {stats?.totalCandidates ?? candidates.length}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Briefcase size={16} />
                  <p className="text-sm">Total Jobs</p>
                </div>
                <p className="text-3xl font-semibold text-slate-900">
                  {stats?.totalJobs ?? 0}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-4 shadow-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={16} />
                  <p className="text-sm">Pending Reviews</p>
                </div>
                <p className="text-3xl font-semibold text-slate-900">
                  {stats?.pendingRecruiters ?? 0}
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search recruiters or candidates"
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Recruiter Accounts
            </h2>
            <div className="space-y-4">
              {
                filteredRecruiters.map((recruiter) => (
                  <div key={recruiter.id} className="rounded-3xl border border-slate-200 p-4 hover:bg-slate-50
                    transition" >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900"> {recruiter.name} </p>
                        <p className="text-sm text-slate-500"> {recruiter.company} </p>
                      </div>
                      <button
                        onClick={() => handleToggleStatus(recruiter.id, recruiter.status)}
                        className={`rounded-full px-3 py-1 text-sm cursor-pointer ${
                          recruiter.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {recruiter.status === 'verified' ? 'Verified' : 'Pending'}
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-500">{recruiter.email}</p>
                  </div>
                ))
              }

              {
                filteredRecruiters.length === 0 && (
                  <p className="text-red-600 text-sm"> Error! No recruiters are found.</p>
                )
              }
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Candidate Profiles
            </h2>
            <div className="space-y-4">
              {
                filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="rounded-3xl border border-slate-200 p-4 hover:bg-slate-50 transition"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900"> {candidate.name} </p>
                        <p className="text-sm text-slate-500"> {candidate.role_applied} </p>
                      </div>

                      <span className={`rounded-full px-3 py-1 text-sm ${
                          candidate.status === 'Interview'
                            ? 'bg-violet-100 text-violet-700'
                            : candidate.status === 'Review'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-slate-500"> {candidate.email} </p>
                  </div>
                ))
              }

              {
                filteredCandidates.length === 0 && (
                  <p className="text-red-600 text-sm"> Error! No candidates are found. </p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;