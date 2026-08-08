import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobById, clearCurrentJob } from '../store/slices/jobsSlice';
import { submitApplication } from '../store/slices/applicationsSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdOutlineEngineering } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoCalendarNumber } from "react-icons/io5";

const JobDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentJob, loading, error } = useSelector((state) => state.jobs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);
  const [applying, setApplying] = useState(false);

  const hasApplied = applications.some((app) => app.job_id === parseInt(id));

  useEffect(() => {
    dispatch(fetchJobById(id));
    return () => { dispatch(clearCurrentJob()); };
  }, [dispatch, id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to apply for this job');
      navigate('/login');
      return;
    }
    if (user?.role !== 'candidate') {
      toast.error('Only candidates can apply for jobs');
      return;
    }
    setApplying(true);
    try {
      await dispatch(submitApplication({ job_id: parseInt(id) })).unwrap();
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-300 p-8 flex items-center justify-center">
        <p className="text-blue-600 text-xl"> Loading job details... </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-300 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <Link to="/jobs" className="text-blue-600 underline">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-300 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">Job not found</p>
          <Link to="/jobs" className="text-blue-600 underline">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  const job = {
    ...currentJob,
    department: currentJob.category || 'Engineering',
    type: currentJob.job_type || 'Full-time',
    salary: currentJob.salary_min && currentJob.salary_max
      ? `$${currentJob.salary_min}k - $${currentJob.salary_max}k`
      : 'Competitive',
    applicants: currentJob.applications_count || currentJob.applications?.length || 0,
    posted: currentJob.created_at
      ? new Date(currentJob.created_at).toLocaleDateString()
      : 'Recently posted',
    requirements: Array.isArray(currentJob.requirements) ? currentJob.requirements : [],
  };

  return (
    <div className="min-h-screen bg-gray-300 p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto mt-10">
        <Link to="/jobs" className="text-white rounded-full px-6 py-2 text-sm cursor-pointer
          bg-blue-500 font-bold hover:bg-blue-800">
          &larr; Back to Jobs
        </Link>

        <div className="grid md:grid-cols-2 gap-10 mt-6 bg-white p-8 rounded-xl shadow">
          <div>
            <h1 className="text-3xl mb-4 font-bold text-gray-800 underline">
              {job.title}
            </h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
              <span className='flex flex-wrap justify-between items-center gap-1'>
                <MdOutlineEngineering size={16} /> {job.department}
              </span>
              <span className='flex flex-wrap justify-between items-center gap-1'>
                <FaMapLocationDot size={16} /> {job.location}
              </span>
              <span className='flex flex-wrap justify-between items-center gap-1'>
                <IoCalendarNumber size={16} /> {job.type}
              </span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed"> {job.description} </p>

            {job.requirements.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-800 text-xl underline"> Requirements: </h3>
                <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-600">
                  {job.requirements.map((req, index) => (
                    <li key={index}> {req} </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 text-sm text-gray-500 space-y-1">
              <p> <strong className='text-[18px] font-bold'> Salary: </strong> {job.salary} </p>
              <p> <strong className='text-[18px] font-bold'> Applicants: </strong> {job.applicants} </p>
              <p> <strong className='text-[18px] font-bold'> Posted: </strong> {job.posted} </p>
            </div>

            {currentJob.recruiter && (
              <div className="mt-4 text-sm text-gray-500">
                <p><strong className='text-[18px] font-bold'> Posted by: </strong> {currentJob.recruiter.name} </p>
              </div>
            )}

            <div className="mt-6">
              {hasApplied ? (
                <span className="bg-green-200 text-green-700 px-6 py-3 rounded-lg font-bold text-lg">
                  Applied
                </span>
              ) : (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {applying ? 'Applying...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-2xl p-10 w-full h-64 flex items-center justify-center">
              <MdOutlineEngineering size={80} className="text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
