import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Brush } from "recharts";

const ChartRating = ({ data }) => {
  const [focusBar, setFocusBar] = useState(null);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data || data.length === 0) return { max: 0, min: 0, avg: 0, change: 0 };
    
    const max = Math.max(...data.map(d => d.rating));
    const min = Math.min(...data.map(d => d.rating));
    const avg = Math.round(data.reduce((sum, d) => sum + d.rating, 0) / data.length);
    const change = data.length > 1 ? data[data.length - 1].rating - data[0].rating : 0;
    
    return { max, min, avg, change };
  }, [data]);

  // Generate custom color based on rating
  const getRatingColor = (rating) => {
    if (!rating) return "#9ca3af"; // gray-400
    if (rating < 1200) return "#6b7280"; // gray-500
    if (rating < 1400) return "#10b981"; // green-500
    if (rating < 1600) return "#06b6d4"; // cyan-500
    if (rating < 1900) return "#3b82f6"; // blue-500
    if (rating < 2100) return "#8b5cf6"; // violet-500
    if (rating < 2400) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <h4 className="text-sm font-semibold mb-1">{data.contestName || "Contest"}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{label}</p>
          <div className="flex items-center">
            <span className="text-sm font-medium mr-1">Rating:</span>
            <span 
              className="text-sm font-bold"
              style={{ color: getRatingColor(data.rating) }}
            >
              {data.rating}
            </span>
          </div>
          {data.contestId && (
            <a 
              href={`https://codeforces.com/contest/${data.contestId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-2 block"
            >
              View Contest →
            </a>
          )}
        </div>
      );
    }
    return null;
  };

  // Determine Y-axis domain with padding
  const yDomain = useMemo(() => {
    if (!data || data.length === 0) return [0, 1000];
    const min = Math.min(...data.map(d => d.rating));
    const max = Math.max(...data.map(d => d.rating));
    const padding = Math.max(100, Math.round((max - min) * 0.1)); // Add 10% padding or at least 100
    return [Math.max(0, min - padding), max + padding];
  }, [data]);

  // Get gradient ID
  const gradientId = "ratingColorGradient";

  return (
    <div className="w-full">
      {/* Stats summary */}
      <div className="flex flex-wrap justify-between mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div className="px-3 py-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Max Rating</p>
          <p className="text-lg font-bold" style={{ color: getRatingColor(stats.max) }}>{stats.max}</p>
        </div>
        <div className="px-3 py-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
          <p className="text-lg font-bold" style={{ color: getRatingColor(stats.avg) }}>{stats.avg}</p>
        </div>
        <div className="px-3 py-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Min Rating</p>
          <p className="text-lg font-bold" style={{ color: getRatingColor(stats.min) }}>{stats.min}</p>
        </div>
        <div className="px-3 py-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">Overall Change</p>
          <p className={`text-lg font-bold ${stats.change > 0 ? 'text-green-500' : stats.change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
            {stats.change > 0 ? '+' : ''}{stats.change}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 30 }}
          onMouseMove={(e) => {
            if (e && e.activeTooltipIndex !== undefined) {
              setFocusBar(e.activeTooltipIndex);
            } else {
              setFocusBar(null);
            }
          }}
          onMouseLeave={() => setFocusBar(null)}
        >
          {/* Define gradient for the line */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              {data && data.length > 0 && data.map((entry, index) => (
                <stop
                  key={index}
                  offset={`${(index / (data.length - 1)) * 100}%`}
                  stopColor={getRatingColor(entry.rating)}
                />
              ))}
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            stroke="#9ca3af"
            className="dark:stroke-gray-500"
          />
          <YAxis 
            domain={yDomain} 
            tick={{ fontSize: 12 }} 
            tickMargin={10}
            stroke="#9ca3af"
            className="dark:stroke-gray-500"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rating"
            stroke={`url(#${gradientId})`}
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, index } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={focusBar === index ? 6 : 4}
                  fill={getRatingColor(data[index].rating)}
                  stroke="#fff"
                  strokeWidth={2}
                  style={{ transition: 'r 0.2s ease-in-out' }}
                />
              );
            }}
            activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
          />

          {/* Rating boundaries */}
          <ReferenceLine y={1200} stroke="#10b981" strokeDasharray="3 3" className="opacity-50" />
          <ReferenceLine y={1400} stroke="#06b6d4" strokeDasharray="3 3" className="opacity-50" />
          <ReferenceLine y={1600} stroke="#3b82f6" strokeDasharray="3 3" className="opacity-50" />
          <ReferenceLine y={1900} stroke="#8b5cf6" strokeDasharray="3 3" className="opacity-50" />
          <ReferenceLine y={2100} stroke="#f97316" strokeDasharray="3 3" className="opacity-50" />
          <ReferenceLine y={2400} stroke="#ef4444" strokeDasharray="3 3" className="opacity-50" />

          {/* Add brush for large datasets */}
          {data && data.length > 10 && (
            <Brush 
              dataKey="date" 
              height={30} 
              stroke="#8884d8" 
              fill="#f3f4f6"
              className="dark:fill-gray-800"
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Rating levels legend */}
      <div className="flex flex-wrap justify-center mt-4 text-xs">
        <div className="flex items-center mx-2 my-1">
          <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
          <span>Newbie (&lt;1200)</span>
        </div>
        <div className="flex items-center mx-2 my-1">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
          <span>Pupil (1200-1399)</span>
        </div>
        <div className="flex items-center mx-2 my-1">
          <div className="w-3 h-3 bg-cyan-500 rounded-full mr-1"></div>
          <span>Specialist (1400-1599)</span>
        </div>
        <div className="flex items-center mx-2 my-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
          <span>Expert (1600-1899)</span>
        </div>
        <div className="flex items-center mx-2 my-1">
          <div className="w-3 h-3 bg-violet-500 rounded-full mr-1"></div>
          <span>Candidate Master (1900-2099)</span>
        </div>
        <div className="flex items-center mx-2 my-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
          <span>Master (2100-2399)</span>
        </div>
        <div className="flex items-center mx-2 my-1">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
          <span>Grandmaster (2400+)</span>
        </div>
      </div>
    </div>
  );
};

export default ChartRating;