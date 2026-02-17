import { useState } from 'react';
import { Info } from 'lucide-react';

function MapLegend() {
  const [isOpen, setIsOpen] = useState(false);

  const legendItems = [
    { type: 'accident', label: 'Accidents', color: 'bg-red-500' },
    { type: 'user', label: 'Users', color: 'bg-blue-500' },
    { type: 'responder', label: 'Responders', color: 'bg-green-500' }
  ];

  return (
    <div className="absolute bottom-4 left-[10.8px] z-[1000]">
   

      {/* Legend Panel */}
      {isOpen && (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 min-w-[160px]">
          <div className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
            Legend
          </div>
          <div className="space-y-2">
            {legendItems.map((item) => (
              <div key={item.type} className="flex items-center gap-3">
                <div 
                  className={`${item.color} w-6 h-6 rounded-full border-2 border-white shadow-sm`}
                />
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

         {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white w-8 h-8 rounded border-2 border-gray-400 shadow-md hover:bg-gray-50 flex items-center justify-center mb-2"
        title="Legend"
      >
        <Info size={18} className="text-gray-700" />
      </button>
    </div>
  );
}

export default MapLegend;
