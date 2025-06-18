import React, { useState } from "react";

const HeatMap = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Generate dates for the last 30 days (or however many days are in the data)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    // Start from the oldest date in our data
    for (let i = data.length - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - (data.length - 1 - i));
      dates.push(date);
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  // Calculate the maximum value for proper intensity scaling
  const maxValue = Math.max(...data, 1); // Ensure we don't divide by zero
  
  // Helper to get day name
  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  // Helper to get heat color based on activity level
  const getHeatColor = (value) => {
    // Use a better color scale
    const intensity = Math.min(value / maxValue, 1); // Normalize between 0 and 1
    
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (intensity < 0.2) return 'bg-green-100 dark:bg-green-900';
    if (intensity < 0.4) return 'bg-green-200 dark:bg-green-800';
    if (intensity < 0.6) return 'bg-green-300 dark:bg-green-700';
    if (intensity < 0.8) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-500 dark:bg-green-500';
  };
  
  // Helper to format the day's tooltip
  const formatDayInfo = (value, date) => {
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    if (value === 0) {
      return `No problems solved on ${formattedDate}`;
    } else if (value === 1) {
      return `1 problem solved on ${formattedDate}`;
    } else {
      return `${value} problems solved on ${formattedDate}`;
    }
  };
  
  // Group days by week for better layout
  const groupByWeek = () => {
    const weeks = [];
    let currentWeek = [];
    
    // Get the day of week for the first date (0 = Sunday, 6 = Saturday)
    const firstDay = dates[0].getDay();
    
    // Add empty cells for days before the first date
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }
    
    // Add the actual data
    data.forEach((value, index) => {
      currentWeek.push({
        value,
        date: dates[index],
      });
      
      // Start a new week after Saturday
      if (dates[index].getDay() === 6 || index === data.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    
    return weeks;
  };
  
  const weeks = groupByWeek();
  
  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Activity Heatmap</h3>
        
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-gray-500 dark:text-gray-400">Less</span>
          <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>
          <div className="w-4 h-4 bg-green-100 dark:bg-green-900 border border-gray-200 dark:border-gray-700"></div>
          <div className="w-4 h-4 bg-green-200 dark:bg-green-800 border border-gray-200 dark:border-gray-700"></div>
          <div className="w-4 h-4 bg-green-300 dark:bg-green-700 border border-gray-200 dark:border-gray-700"></div>
          <div className="w-4 h-4 bg-green-400 dark:bg-green-600 border border-gray-200 dark:border-gray-700"></div>
          <div className="w-4 h-4 bg-green-500 dark:bg-green-500 border border-gray-200 dark:border-gray-700"></div>
          <span className="text-gray-500 dark:text-gray-400">More</span>
        </div>
      </div>
      
      {/* Day names header */}
      <div className="flex mb-1">
        <div className="w-8"></div> {/* Empty space for alignment */}
        <div className="grid grid-cols-7 gap-1 flex-grow">
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">Sun</div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">Mon</div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">Tue</div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">Wed</div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">Thu</div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">Fri</div>
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">Sat</div>
        </div>
      </div>
      
      {/* Weeks */}
      <div className="relative">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex items-center mb-1">
            {/* Week label */}
            {week.some(day => day && day.date.getDate() <= 7) && (
              <div className="w-8 text-xs text-right pr-2 text-gray-500 dark:text-gray-400">
                {week.find(day => day)?.date.toLocaleDateString('en-US', { month: 'short' })}
              </div>
            )}
            {!week.some(day => day && day.date.getDate() <= 7) && <div className="w-8"></div>}
            
            {/* Days in the week */}
            <div className="grid grid-cols-7 gap-1 flex-grow">
              {week.map((day, dayIndex) => (
                day ? (
                  <div
                    key={dayIndex}
                    className={`w-full aspect-square flex items-center justify-center rounded 
                      ${getHeatColor(day.value)} border border-gray-200 dark:border-gray-700 
                      transition-all duration-200 hover:ring-2 hover:ring-blue-400 hover:z-10 hover:scale-110 
                      cursor-pointer relative`}
                    onMouseEnter={() => setHoveredDay({ value: day.value, date: day.date })}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {day.value > 0 && (
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                        {day.value}
                      </span>
                    )}
                    
                    {/* Tooltip */}
                    {hoveredDay && hoveredDay.date === day.date && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20 
                        px-3 py-1.5 bg-gray-900 text-white text-xs rounded whitespace-nowrap">
                        {formatDayInfo(day.value, day.date)}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 
                          border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={dayIndex} className="w-full aspect-square bg-transparent"></div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary stats */}
      <div className="mt-4 flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <div>
          <span className="font-medium">{data.filter(val => val > 0).length}</span> active days
        </div>
        <div>
          <span className="font-medium">{data.reduce((sum, val) => sum + val, 0)}</span> total problems
        </div>
        <div>
          Current streak: <span className="font-medium">
            {(() => {
              let streak = 0;
              for (let i = data.length - 1; i >= 0; i--) {
                if (data[i] > 0) streak++;
                else break;
              }
              return streak;
            })()}
          </span> days
        </div>
      </div>
    </div>
  );
};

export default HeatMap;