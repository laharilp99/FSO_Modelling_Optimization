import React from 'react';

const StressSlider = ({ label, name, value, onChange, isSimulating }) => (
  <div className="mb-4 bg-slate-700 p-4 rounded-lg shadow-inner">
    <label className="text-sm font-semibold text-white flex justify-between">
      {label}
      <span className="text-yellow-300 font-mono">{value.toFixed(2)}</span>
    </label>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      name={name}
      value={value}
      onChange={(e) => onChange(name, parseFloat(e.target.value))}
      disabled={isSimulating}
      className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

export default StressSlider;
