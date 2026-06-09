import { useDroppable } from '@dnd-kit/core';
import PlannedCourseCard from './PlannedCourseCard';

const TERM_COLORS = {
  Fall:   { bg: '#006ca5', label: 'FALL' },
  Winter: { bg: '#005a8e', label: 'WINTER' },
  Spring: { bg: '#3da348', label: 'SPRING' },
};

export default function SemesterColumn({ year, term, planCourses, onRemoveCourse }) {
  const id = `sem-${year}-${term}`;
  const { setNodeRef, isOver } = useDroppable({ id });

  const semCredits = planCourses.reduce((s, pc) => s + pc.course.credits, 0);
  const creditWarning = semCredits > 18;
  const { bg, label } = TERM_COLORS[term];

  return (
    <div className="flex flex-col" style={{ minWidth: '280px', width: '280px' }}>
      {/* Semester header — flat top, colored */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: bg, borderRadius: '10px 10px 0 0' }}
      >
        <div>
          <div className="text-white font-light text-[28px] leading-none capitalize">
            {term}
          </div>
          <div className="text-white text-xs uppercase tracking-widest opacity-80">{year}</div>
        </div>
        <div className="text-right">
          <div
            className={`text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded ${
              creditWarning ? 'bg-red-500 text-white' : 'bg-white bg-opacity-20 text-white'
            }`}
          >
            {semCredits} cr{creditWarning ? ' ⚠' : ''}
          </div>
        </div>
      </div>

      {/* Drop zone — white container, rounded bottom */}
      <div
        ref={setNodeRef}
        className="flex-1 bg-white relative"
        style={{
          borderRadius: '0 0 10px 10px',
          padding: '18px 18px 55px',
          minHeight: '300px',
          outline: isOver ? '2px dashed #006ca5' : '2px solid transparent',
          outlineOffset: '-2px',
          backgroundColor: isOver ? '#e8f4fb' : '#fff',
          transition: 'background-color 0.15s',
        }}
      >
        {/* Course cards */}
        {planCourses.map((pc) => (
          <PlannedCourseCard key={pc.plan_course_id} planCourse={pc} onRemove={onRemoveCourse} />
        ))}

        {planCourses.length === 0 && (
          <div className="flex items-center justify-center h-24 pointer-events-none">
            <span className="text-xs text-gray-300 italic">Drop course here</span>
          </div>
        )}

        {/* Total credits — bottom right, matching real site */}
        <div
          className="absolute bottom-0 right-0 flex items-baseline gap-1 px-4 py-3"
        >
          <span className="text-[10px] text-gray-400 uppercase leading-none">Total</span>
          <span
            className="text-[27px] font-light leading-none pl-2"
            style={{ borderLeft: '1px solid rgba(112,112,112,0.5)', color: '#515252' }}
          >
            {semCredits}
          </span>
        </div>
      </div>
    </div>
  );
}
