const DEPT_COLORS = {
  CS: 'bg-blue-100 text-blue-800 border-blue-200',
  Math: 'bg-purple-100 text-purple-800 border-purple-200',
  Physics: 'bg-orange-100 text-orange-800 border-orange-200',
  Religion: 'bg-green-100 text-green-800 border-green-200',
  English: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Communication: 'bg-pink-100 text-pink-800 border-pink-200',
  History: 'bg-amber-100 text-amber-800 border-amber-200',
  'Political Science': 'bg-teal-100 text-teal-800 border-teal-200',
};

export default function CourseChip({ course, isDragging = false }) {
  const color = DEPT_COLORS[course.department] ?? 'bg-gray-100 text-gray-700 border-gray-200';
  return (
    <div
      className={`flex items-center justify-between rounded border px-2 py-1 text-xs font-medium w-full
        ${color} ${isDragging ? 'shadow-xl rotate-1 scale-105 cursor-grabbing' : 'cursor-grab'}`}
    >
      <span className="truncate">{course.code}</span>
      <span className="ml-2 shrink-0 font-bold">{course.credits}cr</span>
    </div>
  );
}
