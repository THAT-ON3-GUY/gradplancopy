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
      style={style}
      {...listeners}
      {...attributes}
      title={`${course.name}\n${course.description ?? ''}\nOffered: ${course.offered?.join(', ')}`}
      className={`relative transition-opacity ${
        isPlanned ? 'opacity-40 cursor-not-allowed' : isDragging ? 'opacity-30' : 'hover:opacity-80'
      }`}
    >
      <CourseChip course={course} />
      {isPlanned && (
        <span className="absolute right-1 top-0.5 text-[10px] text-gray-400 italic">added</span>
      )}
    </div>
  );
}
