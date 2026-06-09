import { useState, useMemo } from 'react';
import CourseCard from './CourseCard';

const DEPTS = ['All', 'CS', 'Math', 'Physics', 'Religion', 'English', 'Communication', 'History', 'Political Science'];

export default function CourseCatalog({ courses, plannedCourseIds }) {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchDept = dept === 'All' || c.department === dept;
      const q = search.toLowerCase();
      const matchSearch = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
      return matchDept && matchSearch;
    });
  }, [courses, search, dept]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-byui-border">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses…"
          className="w-full text-sm border border-byui-border rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-byui-navy"
        />
      </div>

      {/* Department filter */}
      <div className="px-3 py-2 flex flex-wrap gap-1 border-b border-byui-border">
        {DEPTS.map((d) => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              dept === d
                ? 'bg-byui-navy text-white border-byui-navy'
                : 'bg-white text-gray-600 border-gray-300 hover:border-byui-navy'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Course list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-6">No courses match your search.</p>
        )}
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} isPlanned={plannedCourseIds.has(course.id)} />
        ))}
      </div>

      <div className="px-3 py-2 text-xs text-gray-400 border-t border-byui-border">
        {filtered.length} course{filtered.length !== 1 ? 's' : ''} · Drag to add to a semester
      </div>
    </div>
  );
}
