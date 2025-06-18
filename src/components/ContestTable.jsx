import React, { useState, useMemo } from "react";

const ContestTable = ({ contests }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
  const [expandedRow, setExpandedRow] = useState(null);
  
  // Calculate contest statistics
  const stats = useMemo(() => {
    if (!contests || contests.length === 0) return { 
      totalContests: 0, 
      positiveChanges: 0,
      netChange: 0,
      bestRank: null,
      worstRank: null,
      avgRank: 0
    };
    
    const positiveChanges = contests.filter(c => c.change > 0).length;
    const netChange = contests.reduce((sum, c) => sum + c.change, 0);
    const ranks = contests.map(c => c.rank).filter(r => r && r > 0);
    const bestRank = ranks.length ? Math.min(...ranks) : null;
    const worstRank = ranks.length ? Math.max(...ranks) : null;
    const avgRank = ranks.length ? Math.round(ranks.reduce((sum, r) => sum + r, 0) / ranks.length) : 0;
    
    return {
      totalContests: contests.length,
      positiveChanges,
      netChange,
      bestRank,
      worstRank,
      avgRank
    };
  }, [contests]);
  
  // Format date from contest name
  const extractDate = (contestName) => {
    // Look for patterns like "Round #789 (Div. 2)" and extract the number
    const match = contestName.match(/Round #(\d+)/i);
    if (match) {
      return `Round ${match[1]}`;
    }
    // Fall back to first 20 chars if no pattern found
    return contestName.length > 20 ? contestName.substring(0, 20) + '...' : contestName;
  };
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  
  // Sort the contests
  const sortedContests = useMemo(() => {
    if (!sortConfig.key) return [...contests].reverse(); // Default to newest first
    
    return [...contests].sort((a, b) => {
      if (a[sortConfig.key] === b[sortConfig.key]) return 0;
      
      // Handle null or undefined values
      if (a[sortConfig.key] === null || a[sortConfig.key] === undefined) return 1;
      if (b[sortConfig.key] === null || b[sortConfig.key] === undefined) return -1;
      
      const result = a[sortConfig.key] < b[sortConfig.key] ? -1 : 1;
      return sortConfig.direction === 'asc' ? result : -result;
    });
  }, [contests, sortConfig]);
  
  // Get style for rating change cell
  const getRatingChangeStyle = (change) => {
    if (!change) return "text-gray-500";
    if (change > 0) return "text-green-600 font-medium";
    if (change < 0) return "text-red-500 font-medium";
    return "text-gray-500";
  };
  
  // Get style for rank cell
  const getRankStyle = (rank, allRanks) => {
    if (!rank) return "text-gray-500";
    if (!allRanks.length) return "text-gray-700 dark:text-gray-300";
    
    // Is this the best rank?
    if (rank === Math.min(...allRanks)) {
      return "text-green-600 font-medium";
    }
    
    // Is this in the top 25% of their performances?
    const sortedRanks = [...allRanks].sort((a, b) => a - b);
    const quarterIndex = Math.floor(sortedRanks.length / 4);
    if (rank <= sortedRanks[quarterIndex]) {
      return "text-blue-600 font-medium";
    }
    
    // Is this in the bottom 25%?
    const threeQuarterIndex = Math.floor(sortedRanks.length * 3 / 4);
    if (rank >= sortedRanks[threeQuarterIndex]) {
      return "text-amber-600 font-medium";
    }
    
    return "text-gray-700 dark:text-gray-300";
  };
  
  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // If parsing fails, return original
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Toggle row expansion
  const toggleRowExpansion = (index) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
    }
  };
  
  // Calculate performance metrics
  const getPerformance = (rank) => {
    if (!rank) return { text: "N/A", color: "text-gray-500" };
    
    if (rank <= 100) return { text: "Exceptional", color: "text-purple-600" };
    if (rank <= 500) return { text: "Excellent", color: "text-blue-600" };
    if (rank <= 2000) return { text: "Good", color: "text-green-600" };
    if (rank <= 5000) return { text: "Average", color: "text-yellow-600" };
    return { text: "Below Average", color: "text-red-500" };
  };
  
  const allRanks = contests.map(c => c.rank).filter(r => r && r > 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Stats header */}
      <div className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Contest History</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total: <span className="font-medium text-gray-700 dark:text-gray-300">{stats.totalContests}</span>
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
            <div className="text-gray-500 dark:text-gray-400">Net Rating Change</div>
            <div className={`text-lg font-bold ${stats.netChange > 0 ? 'text-green-600' : stats.netChange < 0 ? 'text-red-500' : 'text-gray-600'}`}>
              {stats.netChange > 0 ? '+' : ''}{stats.netChange}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
            <div className="text-gray-500 dark:text-gray-400">Best Rank</div>
            <div className="text-lg font-bold text-blue-600">
              {stats.bestRank || 'N/A'}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
            <div className="text-gray-500 dark:text-gray-400">Success Rate</div>
            <div className="text-lg font-bold text-amber-600">
              {stats.totalContests > 0 
                ? `${Math.round((stats.positiveChanges / stats.totalContests) * 100)}%`
                : '0%'
              }
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-2 rounded shadow">
            <div className="text-gray-500 dark:text-gray-400">Avg. Rank</div>
            <div className="text-lg font-bold text-indigo-600">
              {stats.avgRank > 0 ? stats.avgRank.toLocaleString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => requestSort('name')}
              >
                <div className="flex items-center">
                  Contest
                  {getSortIndicator('name') && <span className="ml-1">{getSortIndicator('name')}</span>}
                </div>
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => requestSort('change')}
              >
                <div className="flex items-center">
                  Rating Change
                  {getSortIndicator('change') && <span className="ml-1">{getSortIndicator('change')}</span>}
                </div>
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => requestSort('rank')}
              >
                <div className="flex items-center">
                  Rank
                  {getSortIndicator('rank') && <span className="ml-1">{getSortIndicator('rank')}</span>}
                </div>
              </th>
              <th 
                className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => requestSort('unsolved')}
              >
                <div className="flex items-center">
                  Unsolved
                  {getSortIndicator('unsolved') && <span className="ml-1">{getSortIndicator('unsolved')}</span>}
                </div>
              </th>
              <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {sortedContests.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No contest history available
                </td>
              </tr>
            ) : (
              sortedContests.map((contest, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="p-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${contest.change > 0 ? 'bg-green-500' : contest.change < 0 ? 'bg-red-500' : 'bg-gray-400'}`}></div>
                        <div className="truncate max-w-[200px]" title={contest.name}>
                          {extractDate(contest.name || 'Unnamed Contest')}
                        </div>
                      </div>
                    </td>
                    <td className={`p-3 whitespace-nowrap text-sm ${getRatingChangeStyle(contest.change)}`}>
                      {contest.change > 0 && '+'}{contest.change || 0}
                    </td>
                    <td className={`p-3 whitespace-nowrap text-sm ${getRankStyle(contest.rank, allRanks)}`}>
                      {contest.rank ? contest.rank.toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {contest.unsolved || 0}
                    </td>
                    <td className="p-3 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => toggleRowExpansion(index)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        {expandedRow === index ? 'Hide' : 'View'}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded row */}
                  {expandedRow === index && (
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <td colSpan="5" className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Contest Details</h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Full Name:</span> {contest.name}
                              </p>
                              {contest.date && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Date:</span> {formatDate(contest.date)}
                                </p>
                              )}
                              {contest.contestId && (
                                <p className="text-gray-600 dark:text-gray-400">
                                  <span className="font-medium">Contest ID:</span> {contest.contestId}
                                </p>
                              )}
                              <p className="text-gray-600 dark:text-gray-400">
                                <span className="font-medium">Performance:</span>{' '}
                                <span className={getPerformance(contest.rank).color}>
                                  {getPerformance(contest.rank).text}
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Statistics</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Rank</div>
                                <div className={`text-lg font-bold ${getRankStyle(contest.rank, allRanks)}`}>
                                  {contest.rank ? contest.rank.toLocaleString() : 'N/A'}
                                </div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Rating Change</div>
                                <div className={`text-lg font-bold ${getRatingChangeStyle(contest.change)}`}>
                                  {contest.change > 0 && '+'}{contest.change || 0}
                                </div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Solved</div>
                                <div className="text-lg font-bold text-green-600">
                                  {contest.unsolved !== undefined && contest.problems !== undefined
                                    ? contest.problems - contest.unsolved
                                    : 'N/A'
                                  }
                                </div>
                              </div>
                              <div className="bg-white dark:bg-gray-800 p-2 rounded shadow text-center">
                                <div className="text-xs text-gray-500 dark:text-gray-400">Unsolved</div>
                                <div className="text-lg font-bold text-red-500">
                                  {contest.unsolved || 0}
                                </div>
                              </div>
                            </div>
                            
                            {contest.contestId && (
                              <a 
                                href={`https://codeforces.com/contest/${contest.contestId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 block text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                              >
                                View on Codeforces →
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer with pagination if needed */}
      {sortedContests.length > 10 && (
        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-t border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 text-center">
          Showing {sortedContests.length} contests
        </div>
      )}
    </div>
  );
};

export default ContestTable;