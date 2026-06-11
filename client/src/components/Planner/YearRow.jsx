import { useState } from 'react';
import SemesterColumn from './SemesterColumn';

const CURRENT_YEAR = new Date().getFullYear(); // 2026

export default function YearRow({
  year,
  semesters,
  planCourses,
  onRemoveCourse,
  onViewDetails,
  onMoveCourse,
}) {
  const [open, setOpen] = useState(true);
  const isCurrent = year === CURRENT_YEAR;

  const getCoursesForSemester = (y, term) =>
    planCourses.filter((pc) => pc.semester_year === y && pc.semester_term === term);

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden', backgroundColor: '#fff' }}>
      {/* Accordion header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '16px', color: '#006ca5', fontWeight: 600 }}>
          Year {year}{isCurrent ? ' (Current)' : ''}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontSize: '13px', color: '#006ca5', textDecoration: 'underline', fontWeight: 400 }}>
            View Single Semester
          </span>
          <span style={{ fontSize: '14px', color: '#888', display: 'inline-block', transition: 'transform 0.2s', transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}>
            ▲
          </span>
        </div>
      </button>

      {/* Expanded semester columns */}
      {open && (
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: '16px', overflowX: 'auto' }}>
          {semesters.map(({ year: y, term }) => (
            <SemesterColumn
              key={`${y}-${term}`}
              year={y}
              term={term}
              planCourses={getCoursesForSemester(y, term)}
              onRemoveCourse={onRemoveCourse}
              onViewDetails={onViewDetails}
              onMoveCourse={onMoveCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
}
