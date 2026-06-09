import SemesterColumn from './SemesterColumn';

export default function PlannerGrid({ semesters, planCourses, onRemoveCourse }) {
  const getCoursesForSemester = (year, term) =>
    planCourses.filter((pc) => pc.semester_year === year && pc.semester_term === term);

  // Group semesters by year for visual year rows
  const years = [...new Set(semesters.map((s) => s.year))];

  return (
    <div className="space-y-6">
      {years.map((year) => {
        const yearSemesters = semesters.filter((s) => s.year === year);
        return (
          <div key={year}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 pl-1">
              {year}–{year + 1} Academic Year
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1">
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
