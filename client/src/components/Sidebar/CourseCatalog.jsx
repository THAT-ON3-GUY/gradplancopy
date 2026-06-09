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
      <div className="p-3 border-b border-gray-200">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses…"
          style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '13px' }}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-byui-text"
        />
      </div>

      {/* Department filter chips */}
      <div className="px-3 py-2 flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50">
        {DEPTS.map((d) => (
          <button
            key={d}
            onClick={() => setDept(d)}
            className="text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase tracking-wide transition-colors"
            style={{
              backgroundColor: dept === d ? '#006ca5' : '#fff',
              color: dept === d ? '#fff' : '#515252',
              borderColor: dept === d ? '#006ca5' : '#d1d2d2',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Course list */}
      <div className="flex-1 overflow-y-auto p-3">
        {filtered.length === 0 && (
          <p className="text-xs text-gray-400 text-center mt-8 italic">No courses match your search.</p>
        )}
        {filtered.map((course) => (
          <CourseCard key={course.id} course={course} isPlanned={plannedCourseIds.has(course.id)} />
        ))}
      </div>

      <div className="px-3 py-2 text-[10px] text-gray-400 border-t border-gray-200 uppercase tracking-wide">
        {filtered.length} course{filtered.length !== 1 ? 's' : ''} · Drag to add
      </div>
    </div>
  );
}
