import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import CourseChip from './CourseChip';

export default function CourseCard({ course, isPlanned }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `catalog-${course.id}`,
    disabled: isPlanned,
  });

  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, marginBottom: '8px', opacity: isPlanned ? 0.45 : isDragging ? 0.25 : 1 }}
      {...(isPlanned ? {} : { ...listeners, ...attributes })}
      title={`${course.name}\n${course.description ?? ''}\nOffered: ${course.offered?.join(', ')}`}
      className={isPlanned ? 'cursor-not-allowed' : ''}
    >
      <CourseChip course={course} />
      {isPlanned && (
        <div style={{ textAlign: 'right', fontSize: '9px', color: '#50b95b', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          ✓ In Plan
        </div>
      )}
    </div>
  );
}
