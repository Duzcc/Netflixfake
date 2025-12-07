import React from 'react';

function Titles({ title, subtitle, Icon, color = "text-white" }) {
  return (
    <div className="w-full flex flex-col sm:flex-row sm:gap-8 gap-2 sm:items-center items-start">
      <div className="flex gap-2 items-center">
        {Icon && <Icon className="sm:w-6 sm:h-6 w-4 h-4 text-subMain" />}
        <h2 className={`sm:text-xl text-lg font-bold ${color}`}>{title}</h2>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

export default Titles;
