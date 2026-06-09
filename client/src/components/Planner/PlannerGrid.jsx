import SemesterColumn from './SemesterColumn';

export default function PlannerGrid({ semesters, planCourses, onRemoveCourse }) {
  const getCoursesForSemester = (year, term) =>
    planCourses.filter((pc) => pc.semester_year === year && pc.semester_term === term);

  const years = [...new Set(semesters.map((s) => s.year))];

  return (
    <div className="space-y-8">
      {years.map((year) => {
        const yearSemesters = semesters.filter((s) => s.year === year);
        const yearCredits = yearSemesters.reduce(
          (sum, { year: y, term }) =>
            sum + getCoursesForSemester(y, term).reduce((s, pc) => s + pc.course.credits, 0),
          0
        );

        return (
          <div key={year}>
            {/* Year label */}
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {year}–{year + 1} Academic Year
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">{yearCredits} cr</span>
            </div>

            {/* Semester columns — horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {yearSemesters.map(({ year: y, term }) => (
                <SemesterColumn
                  key={`${y}-${term}`}
                  year={y}
                  term={term}
                  planCourses={getCoursesForSemester(y, term)}
                  onRemoveCourse={onRemoveCourse}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
