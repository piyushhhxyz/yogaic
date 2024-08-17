import React from 'react';

const StreaksCalendar = ({ streaks }) => {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const days = Math.floor((today - startOfYear) / (24 * 60 * 60 * 1000));
  const startDay = startOfYear.getDay();

  const weeksArray = Array.from({ length: 53 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const dayOfYear = weekIndex * 7 + dayIndex - startDay + 1;
      return dayOfYear > 0 && dayOfYear <= days ? dayOfYear : null;
    })
  );

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        {weeksArray.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {week.map((day, dayIndex) =>
              day !== null ? (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${
                    streaks.includes(day) ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              ) : (
                <div key={dayIndex} className="w-3 h-3"></div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreaksCalendar;