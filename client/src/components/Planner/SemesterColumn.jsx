import { useDroppable } from '@dnd-kit/core';
import PlannedCourseCard from './PlannedCourseCard';

const TERM_COLORS = {
  Fall:   '#50b95b',  // green — future planned
  Winter: '#006ca5',  // blue — recent completed
  Spring: '#50b95b',  // green
};

const TRACK_LABELS = {
  Fall: 'ON-TRACK',
  Winter: 'ON-TRACK',
  Spring: 'FLEX TRACK',
};

export default function SemesterColumn({ year, term, planCourses, onRemoveCourse }) {
  const id = `sem-${year}-${term}`;
  const { setNodeRef, isOver } = useDroppable({ id });

  const semCredits = planCourses.reduce((s, pc) => s + pc.course.credits, 0);
  const bg = TERM_COLORS[term];

  return (
    <div style={{ flex: '1 1 0', minWidth: '240px' }} className="flex flex-col">
      {/* Semester label row */}
      <div className="flex items-baseline justify-between mb-2 px-1">
        <span style={{ fontSize: '22px', fontWeight: 300, color: '#000' }}>{term} {year}</span>
        <span style={{ fontSize: '10px', fontWeight: 700, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {TRACK_LABELS[term]}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        style={{
          flex: 1,
          border: `1px solid ${isOver ? '#006ca5' : '#e0e0e0'}`,
          borderRadius: '8px',
          backgroundColor: isOver ? '#e8f4fb' : '#fff',
          padding: '12px',
          paddingBottom: '40px',
          minHeight: '280px',
          position: 'relative',
          transition: 'background-color 0.15s, border-color 0.15s',
          outline: isOver ? '2px dashed #006ca5' : 'none',
          outlineOffset: '-1px',
        }}
      >
        {planCourses.map((pc) => (
          <PlannedCourseCard
            key={pc.plan_course_id}
            planCourse={pc}
            onRemove={onRemoveCourse}
            bgColor={bg}
          />
        ))}

        {planCourses.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', color: '#ccc', fontSize: '12px', fontStyle: 'italic' }}>
            Drop course here
          </div>
        )}

        {/* Total Credits — bottom right, matching real site */}
        <div style={{ position: 'absolute', bottom: '8px', right: '12px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: '#888', textAlign: 'right', lineHeight: 1 }}>
            Total<br />Credits:
          </span>
          <span style={{ fontSize: '28px', fontWeight: 300, color: '#000', lineHeight: 1, paddingLeft: '6px', borderLeft: '1px solid rgba(112,112,112,0.4)' }}>
            {semCredits}
          </span>
        </div>
      </div>
    </div>
  );
}
