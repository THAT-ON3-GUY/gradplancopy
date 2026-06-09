const CATEGORY_ICONS = {
  'CS Core': '💻',
  'Math/Science': '📐',
  Religion: '✝️',
  'Gen Ed': '📚',
  'CS Electives': '🔧',
};

export default function RequirementsPanel({ requirements, plannedCourseIds }) {
  return (
    <div className="p-3 space-y-4">
      {requirements.map((group) => {
        const plannedInGroup = group.courses.filter((c) => plannedCourseIds.has(c.id));
        const totalGroupCredits = group.courses.reduce((s, c) => s + c.credits, 0) || group.required_credits;
        const earnedGroupCredits = plannedInGroup.reduce((s, c) => s + c.credits, 0);
        const pct = totalGroupCredits > 0 ? Math.min((earnedGroupCredits / totalGroupCredits) * 100, 100) : 0;

        return (
          <div key={group.category} className="bg-gray-50 rounded-lg border border-byui-border p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-semibold text-byui-navy">
                {CATEGORY_ICONS[group.category] ?? '📋'} {group.category}
              </span>
              <span className="text-xs text-gray-500">
                {earnedGroupCredits}/{totalGroupCredits} cr
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? '#4ade80' : '#E1A829' }}
              />
            </div>

            {/* Course list */}
            <ul className="space-y-1">
              {group.courses.map((c) => {
                const planned = plannedCourseIds.has(c.id);
                return (
                  <li key={c.id} className="flex items-center gap-2 text-xs">
                    <span
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        planned ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}
                    >
                      {planned && (
                        <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="currentColor">
                          <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <span className={planned ? 'line-through text-gray-400' : 'text-gray-700'}>
                      {c.code} – {c.name}
                    </span>
                    <span className="ml-auto text-gray-400">{c.credits}cr</span>
                  </li>
                );
              })}
              {group.required_credits > 0 && group.courses.length === 0 && (
                <li className="text-xs text-gray-500 italic">
                  Choose {group.required_credits} elective credits from the catalog
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
