import { useDroppable } from '@dnd-kit/core';
import PlannedCourseCard, { getSemesterStatus, getStatusColor } from './PlannedCourseCard';

const TRACK_LABELS = {
  Fall:   'ON-TRACK',
  Winter: 'ON-TRACK',
  Spring: 'FLEX TRACK',
};

export default function SemesterColumn({
  year,
  term,
  planCourses,
  onRemoveCourse,
  onViewDetails,
  onMoveCourse,
}) {
  const id = `sem-${year}-${term}`;
  const { setNodeRef, isOver } = useDroppable({ id });

  const semCredits = planCourses.reduce((s, pc) => s + (pc.planned_credits ?? pc.course.credits), 0);

  const status = getSemesterStatus(year, term);
  const bgColor = getStatusColor(status);

  return (
    <div style={{ flex: '1 1 0', minWidth: '240px' }} className="flex flex-col">
      {/* Semester label row */}
      <div className="flex items-baseline justify-between mb-2 px-1">
        <span style={{ fontSize: '22px', fontWeight: 300, color: '#000' }}>{term} {year}</span>
        <span
          style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: status === 'enrolled' ? '#008fdd' : status === 'completed' ? '#0072b0' : '#888',
          }}
        >
          {status === 'enrolled' ? 'ENROLLED' : status === 'completed' ? 'COMPLETED' : TRACK_LABELS[term]}
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
            onViewDetails={onViewDetails}
            onMoveCourse={onMoveCourse}
            bgColor={bgColor}
            status={status}
          />
        ))}

        {planCourses.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80px', color: '#ccc', fontSize: '12px', fontStyle: 'italic' }}>
            Drop course here
          </div>
        )}

        {/* Total Credits — bottom right */}
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
