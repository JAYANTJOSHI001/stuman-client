import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList, CartesianGrid } from "recharts";

const BarChartSolved = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Generate color based on rating
  const getRatingColor = (rating) => {
    if (!rating) return "#9ca3af"; // gray-400
    const ratingNum = parseInt(rating, 10);
    if (ratingNum < 1200) return "#6b7280"; // gray-500
    if (ratingNum < 1400) return "#10b981"; // green-500
    if (ratingNum < 1600) return "#06b6d4"; // cyan-500
    if (ratingNum < 1900) return "#3b82f6"; // blue-500
    if (ratingNum < 2100) return "#8b5cf6"; // violet-500
    if (ratingNum < 2400) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };
  
  // Calculate total problems and statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return { total: 0, highest: 0, mostSolved: null };
    
    const total = data.reduce((sum, item) => sum + (item.count || 0), 0);
    const mostSolved = [...data].sort((a, b) => (b.count || 0) - (a.count || 0))[0];
    const highest = data.reduce((max, item) => {
      const rating = parseInt(item.rating, 10) || 0;
      return (item.count > 0 && rating > max) ? rating : max;
    }, 0);
    
    return { total, highest, mostSolved };
  }, [data]);
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / stats.total) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-sm font-semibold mb-1" style={{ color: getRatingColor(data.rating) }}>
            Rating: {data.rating}
          </p>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <p>Problems solved: <span className="font-medium">{data.count}</span></p>
            <p>Percentage: <span className="font-medium">{percentage}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Handle mouse events
  const handleMouseEnter = (_, index) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Problems by Difficulty</h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: <span className="font-medium text-gray-700 dark:text-gray-300">{stats.total}</span>
        </div>
      </div>
      
      {/* Summary statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Most Solved Rating</p>
          {stats.mostSolved && (
            <div className="flex items-baseline">
              <span 
                className="text-lg font-bold mr-2"
                style={{ color: getRatingColor(stats.mostSolved.rating) }}
              >
                {stats.mostSolved.rating}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                ({stats.mostSolved.count} problems)
              </span>
            </div>
          )}
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <p className="text-xs text-gray-500 dark:text-gray-400">Highest Rating Solved</p>
          <div className="flex items-baseline">
            <span 
              className="text-lg font-bold"
              style={{ color: getRatingColor(stats.highest) }}
            >
              {stats.highest}
            </span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={280}>
        <BarChart 
          data={data} 
          margin={{ top: 20, right: 10, left: 10, bottom: 30 }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="rating" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            stroke="#9ca3af"
            className="dark:stroke-gray-500"
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            stroke="#9ca3af"
            className="dark:stroke-gray-500"
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="count" 
            radius={[4, 4, 0, 0]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getRatingColor(entry.rating)}
                fillOpacity={activeIndex === index ? 1 : 0.75}
                stroke={activeIndex === index ? "#000" : "none"}
                strokeWidth={1}
                className="transition-opacity duration-200"
              />
            ))}
            <LabelList 
              dataKey="count" 
              position="top" 
              style={{ 
                fontSize: '11px', 
                fill: '#6b7280',
                fontWeight: 500
              }} 
              className="dark:fill-gray-300"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Distribution explanation */}
      <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
        <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
          <span>Newbie (&lt;1200)</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Pupil (1200-1399)</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="w-3 h-3 bg-cyan-500 rounded-full mr-1"></div>
          <span>Specialist (1400-1599)</span>
        </div>
        <div className="flex items-center px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Expert (1600-1899)</span>
        </div>
      </div>
    </div>
  );
};

export default BarChartSolved;