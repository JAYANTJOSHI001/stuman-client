import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getStudentProfile, getStudentPro } from "../services/StudentServices";
import ChartRating from "../components/ChatRating";
import HeatMap from "../components/HeatMap";
import BarChartSolved from "../components/BarChartSolved";
import ContestTable from "../components/ContestTable";
import { calculateStudentStats } from "../utils/statsCalculator";

function StudentProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await getStudentPro(id);
        setData(res);
        
        // Calculate stats from the response data
        const calculatedStats = calculateStudentStats(res);
        setStats(calculatedStats);
        
        console.log("Fetched student profile:", res);
      } catch (err) {
        console.error("Error fetching profile:", err);
        if (err.response && err.response.status === 500) {
          setError("The server encountered an error. This could be due to issues with Codeforces API or database connectivity.");
        } else {
          setError("Failed to load student profile. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-red-50 rounded-lg">
        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="mt-4 text-lg font-semibold text-red-800">{error}</h3>
        <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Back to Student List
        </Link>
      </div>
    );
  }

  if (!data) return null;


  if (data && !data.ratingHistory) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{data.name || 'Student'}</h1>
            <div className="mt-2 flex flex-col sm:flex-row sm:space-x-4">
              {data.email && (
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  {data.email}
                </span>
              )}
              {data.cfHandle && (
                <span className="flex items-center mt-1 sm:mt-0">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633z"></path>
                  </svg>
                  <a 
                    href={`https://codeforces.com/profile/${data.cfHandle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200"
                  >
                    {data.cfHandle}
                  </a>
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Link 
              to={`/edit-student/${id}`}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Profile
            </Link>
            <Link 
              to="/"
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Codeforces Data Unavailable</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We couldn't retrieve the Codeforces data for this student. This could be due to:
        </p>
        <ul className="text-left text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
          <li className="flex items-start mb-2">
            <span className="mr-2">•</span>
            <span>Temporary Codeforces API unavailability</span>
          </li>
          <li className="flex items-start mb-2">
            <span className="mr-2">•</span>
            <span>Invalid Codeforces handle</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Network connectivity issues</span>
          </li>
        </ul>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

 // Safely access nested properties
  const studentProfile = data.profile || {};
  const studentContests = data.contests || [];
  const ratingHistory = data.ratingHistory || [];
  const heatmap = data.heatmap || [];
  const problemBuckets = data.problemBuckets || [];

  // Helper function to determine color class based on rating
  const getRatingColorClass = (rating) => {
    if (!rating) return "text-gray-500";
    if (rating < 1200) return "text-gray-700";
    if (rating < 1400) return "text-green-600";
    if (rating < 1600) return "text-cyan-600";
    if (rating < 1900) return "text-blue-600";
    if (rating < 2100) return "text-violet-600";
    if (rating < 2400) return "text-orange-500";
    return "text-red-600";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with student info */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">{studentProfile.name || data.name || 'Student'}</h1>
            <div className="mt-2 flex flex-col sm:flex-row sm:space-x-4">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                {studentProfile.email || data.email || "No email provided"}
              </span>
              {(studentProfile.cfHandle || data.cfHandle) && (
                <span className="flex items-center mt-1 sm:mt-0">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                  <a 
                    href={`https://codeforces.com/profile/${studentProfile.cfHandle || data.cfHandle}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-200"
                  >
                    {studentProfile.cfHandle || data.cfHandle}
                  </a>
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Link 
              to="/"
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-md transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </Link>
          </div>
        </div>
      </div>
      
      {/* Enhanced Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Problems Solved Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Problems Solved</h3>
            <span className="p-1.5 bg-blue-100 text-blue-800 text-xs rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.totalSolved || 0}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Total problems solved</p>
            {studentProfile.currentRating && (
              <span className={`text-xs font-semibold ${getRatingColorClass(studentProfile.currentRating)}`}>
                Rating: {studentProfile.currentRating}
              </span>
            )}
          </div>
        </div>
        
        {/* Maximum Rating Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Maximum Difficulty</h3>
            <span className="p-1.5 bg-green-100 text-green-800 text-xs rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd"></path>
              </svg>
            </span>
          </div>
          <div className="flex items-baseline mt-1">
            <p className={`text-2xl font-bold ${getRatingColorClass(stats.maxSolvedRating)}`}>
              {stats.maxSolvedRating || 0}
            </p>
            {stats.ratingProgress > 0 && (
              <span className="ml-2 text-xs font-medium text-green-500">
                +{stats.ratingProgress} gain
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">Highest difficulty solved</p>
            {studentProfile.maxRating && studentProfile.maxRating !== studentProfile.currentRating && (
              <span className={`text-xs font-semibold ${getRatingColorClass(studentProfile.maxRating)}`}>
                Max: {studentProfile.maxRating}
              </span>
            )}
          </div>
        </div>
        
        {/* Contest Stats Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contest Stats</h3>
            <span className="p-1.5 bg-purple-100 text-purple-800 text-xs rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
            </span>
          </div>
          <p className="text-2xl font-bold mt-1">{stats.contestCount || 0}</p>
          <div className="mt-2">
            {stats.bestRank > 0 ? (
              <div className="flex flex-col">
                <p className="text-xs text-gray-500">Best rank: <span className="font-semibold text-indigo-600">{stats.bestRank}</span></p>
                <p className="text-xs text-gray-500 truncate" title={stats.bestRankContest}>
                  in {stats.bestRankContest || 'contest'}
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-500">Contests participated</p>
            )}
          </div>
        </div>
        
        {/* Streak Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Activity Stats</h3>
            <span className="p-1.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
            </span>
          </div>
          <div className="flex items-baseline mt-1">
            <p className="text-2xl font-bold">{stats.avgPerDay || 0}</p>
            <span className="ml-1 text-sm text-gray-500">/ day</span>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-2">
            <div>
              <p className="text-xs text-gray-500">Current Streak</p>
              <p className="text-sm font-medium">{stats.currentStreak || 0} days</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Max Streak</p>
              <p className="text-sm font-medium">{stats.maxStreak || 0} days</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="h-full">
          {ratingHistory && ratingHistory.length > 0 ? (
            <ChartRating data={ratingHistory} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No rating history available
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Contests */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Contests</h2>
        {studentContests && studentContests.length > 0 ? (
          <ContestTable contests={studentContests} />
        ) : (
          <div className="text-center py-8 text-gray-500">
            No contest history available
          </div>
        )}
      </div>
      
      {/* Problem Distribution and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Problem Distribution</h2>
          {problemBuckets && problemBuckets.length > 0 ? (
            <BarChartSolved data={problemBuckets} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No problem distribution data available
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Activity Heatmap</h2>
          {heatmap && heatmap.length > 0 ? (
            <HeatMap data={heatmap} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No activity data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;