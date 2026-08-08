import React, { useEffect, useMemo, useState } from "react";
import { MdOutlineEngineering } from "react-icons/md";
import { IoCalendarNumber } from "react-icons/io5";
import { FaMapLocationDot, FaPerson } from "react-icons/fa6";
import { BiSolidData } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import { FaDollarSign } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '../store/slices/jobsSlice';
import Image1 from '../../src/assets/Image1.jpg';
import Image2 from '../../src/assets/Image2.jpg';
import Image3 from '../../src/assets/Image3.jpg';
import Image4 from '../../src/assets/Image4.jpg';
import Image5 from '../../src/assets/Image5.jpg';
import Image6 from '../../src/assets/Image6.jpg';
const images = [Image1, Image2, Image3, Image4, Image5, Image6];

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [location, setLocation] = useState("All");

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const backendJobs = useMemo(() => {
    return (jobs || []).map((job, index) => ({
      ...job,
      id: job.id || index + 1,
      department: job.category || 'Engineering',
      location: job.location || 'Remote',
      type: job.job_type || 'Full-time',
      salary: job.salary_min && job.salary_max
        ? `$${job.salary_min}k - $${job.salary_max}k`
        : 'Competitive',
      applicants: job.applications_count || 0,
      posted: job.created_at
        ? new Date(job.created_at).toLocaleDateString()
        : 'Recently posted',
      description: job.description || 'No description provided.',
      requirements: Array.isArray(job.requirements) ? job.requirements : ['Relevant experience'],
      icon1: <MdOutlineEngineering />,
      icon2: <FaMapLocationDot />,
      icon3: <IoCalendarNumber />,
      icon_person: <FaPerson />,
      icon_dollar: <FaDollarSign />,
      image: images[index % images.length],
      isBackend: true,
    }));
  }, [jobs]);

  const allJobs = backendJobs;

  const filtered_Jobs = allJobs.filter((job) => {
    return (
      (department === "All" || job.department === department) &&
      (jobType === "All" || job.type === jobType) &&
      (location === "All" || job.location === location) &&
      job.title.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-6xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-gray-900"> Open Positions </h1>
        <p className="text-gray-500 mt-2"> Find your next great hire from our active job listings! </p>

        <div className="bg-white rounded-xl shadow-sm border mt-6 p-6">
          <input type="text" placeholder="Search jobs by title or description..."
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:border-0"
            value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-900 font-semibold mb-1"> Department </label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="All"> All </option>
                <option value="Engineering"> Engineering </option>
                <option value="IT Operations"> IT Operations </option>
                <option value="Data"> Data </option>
                <option value="Security"> Security </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-900 font-semibold mb-1"> Job Type </label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="All"> All </option>
                <option value="Full-time"> Full-time </option>
                <option value="Part-time"> Part-time </option>
                <option value="Contract"> Contract </option>
                <option value="Internship"> Internship </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-900 font-semibold mb-1"> Location </label>
              <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="All"> All </option>
                <option value="San Francisco, CA"> San Francisco, CA </option>
                <option value="New York, NY"> New York, NY </option>
                <option value="Remote"> Remote </option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-900 font-semibold underline mt-6 mb-6">
          Showing {filtered_Jobs.length} of {allJobs.length} jobs </p>

        {loading && <p className="text-blue-600 mt-4">Loading jobs from the backend...</p>}
        {error && <p className="text-red-600 mt-4">{error}</p>}

        <div className="mt-4 space-y-8">
          {filtered_Jobs.map((job) => (
            <div key={job.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 underline">
                    {job.title}
                  </h2>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex justify-between items-center gap-1"> {job.icon1} {job.department} </span>
                    <span className="flex justify-between items-center gap-1"> {job.icon2} {job.location} </span>
                    <span className="flex justify-between items-center gap-1"> {job.icon3} {job.type} </span>
                  </div>

                  <p className="mt-4 text-gray-600"> {job.description} </p>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700"> Requirements: </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.requirements.map((req, index) => (
                        <span key={index} className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-gray-500 mt-4">
                    <span className="flex justify-between items-center gap-1"> {job.icon_dollar} {job.salary} </span>
                    <span className="flex justify-between items-center gap-1"> {job.icon_person} {job.applicants} applicants </span>
                    <span className="flex justify-between items-center gap-1"> {job.icon3} Posted {job.posted} </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-5">
                  <span className="bg-green-200 text-green-600 text-md font-semibold px-3 py-1 rounded-full">
                    Active
                  </span>
                  <NavLink to={`/jobs/${job.id}`} className="bg-blue-600 text-white px-4 py-2
                    rounded-lg hover:bg-blue-700 transition md:w-30">
                    View Details
                  </NavLink>
                </div>
              </div>
            </div>
          ))}

          {filtered_Jobs.length === 0 && !loading && (
            <div className="text-center text-xl font-bold text-red-600">
              No jobs found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;