/**
 * Calculates stats from student profile and contest data
 * @param {Object} data - The student profile data
 * @returns {Object} Computed statistics
 */
export const calculateStudentStats = (data) => {
  if (!data) return {};
  
  const profile = data.profile || {};
  const ratingHistory = data.ratingHistory || [];
  const problemBuckets = data.problemBuckets || [];
  
  // Calculate total problems solved from buckets
  const totalSolved = problemBuckets.reduce((sum, bucket) => sum + (bucket.count || 0), 0);
  
  // Calculate max solved rating
  const maxSolvedRating = problemBuckets.reduce((max, bucket) => {
    const rating = parseInt(bucket.rating, 10);
    return (bucket.count > 0 && rating > max) ? rating : max;
  }, 0);
  
  // Calculate average rating of solved problems
  let totalRatingPoints = 0;
  let totalProblems = 0;
  
  problemBuckets.forEach(bucket => {
    const count = bucket.count || 0;
    const rating = parseInt(bucket.rating, 10) || 0;
    totalRatingPoints += count * rating;
    totalProblems += count;
  });
  
  const avgRating = totalProblems > 0 ? Math.round(totalRatingPoints / totalProblems) : 0;
  
  // Calculate streak and activity metrics
  const heatmap = data.heatmap || [];
  const activeDays = heatmap.filter(day => day > 0).length;
  const maxStreak = calculateMaxStreak(heatmap);
  const currentStreak = calculateCurrentStreak(heatmap);
  
  // Calculate rating progress
  let ratingProgress = 0;
  if (ratingHistory.length >= 2) {
    const firstRating = ratingHistory[0].rating;
    const latestRating = ratingHistory[ratingHistory.length - 1].rating;
    ratingProgress = latestRating - firstRating;
  }
  
  // Calculate average problems per active day
  const avgPerDay = activeDays > 0 ? (totalSolved / activeDays).toFixed(1) : 0;
  
  // Get contest performance stats
  const contests = data.contests || [];
  const contestCount = contests.length;
  const bestRank = contests.length > 0 
    ? Math.min(...contests.map(c => c.rank || Infinity))
    : 0;
  
  const bestRankContest = contests.find(c => c.rank === bestRank)?.name || '';
  
  return {
    totalSolved,
    maxSolvedRating,
    avgRating,
    avgPerDay,
    activeDays,
    maxStreak,
    currentStreak,
    ratingProgress,
    contestCount,
    bestRank,
    bestRankContest
  };
};

/**
 * Calculate the maximum streak from heatmap data
 */
const calculateMaxStreak = (heatmap) => {
  let maxStreak = 0;
  let currentStreak = 0;
  
  heatmap.forEach(value => {
    if (value > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  });
  
  return maxStreak;
};

/**
 * Calculate the current streak from heatmap data
 */
const calculateCurrentStreak = (heatmap) => {
  let currentStreak = 0;
  
  const reversedHeatmap = [...heatmap].reverse();
  
  let startCounting = false;
  
  for (const value of reversedHeatmap) {
    if (value > 0 || startCounting) {
      startCounting = true;
      if (value > 0) {
        currentStreak++;
      } else {
        break; 
      }
    }
  }
  
  return currentStreak;
};