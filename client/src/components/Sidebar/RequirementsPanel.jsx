import { useState } from 'react';

const CATEGORY_ORDER = ['CS Core', 'Math/Science', 'Religion', 'Gen Ed', 'CS Electives'];

export default function RequirementsPanel({ requirements, plannedCourseIds }) {
  const [open, setOpen] = useState({ 'CS Core': true });

  const sorted = [...requirements].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );

  return (
    <div className="p-3 space-y-1">
      {sorted.map((group) => {
        const plannedInGroup = group.courses.filter((c) => plannedCourseIds.has(c.id));
        const totalCr = group.courses.reduce((s, c) => s + c.credits, 0) || group.required_credits;
        const earnedCr = plannedInGroup.reduce((s, c) => s + c.credits, 0);
        const pct = totalCr > 0 ? Math.min((earnedCr / totalCr) * 100, 100) : 0;
        const isOpen = open[group.category] ?? false;
        const allDone = pct >= 100;

        return (
          <div key={group.category} style={{ borderRadius: '5px', overflow: 'hidden', border: '1px solid #e0e0e0' }}>
            {/* Accordion header — blue like the real site */}
            <button
              onClick={() => setOpen((prev) => ({ ...prev, [group.category]: !prev[group.category] }))}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              style={{
                backgroundColor: allDone ? '#3da348' : '#0a6cb5',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 300,
              }}
            >
              <span>{group.category}</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '11px', opacity: 0.85 }}>{earnedCr}/{totalCr} cr</span>
                <span style={{ fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
              </div>
            </button>

            {/* Progress bar */}
            <div style={{ height: '4px', backgroundColor: '#e0e0e0' }}>
              <div
                style={{
                  height: '4px',
                  width: `${pct}%`,
                  backgroundColor: allDone ? '#3da348' : '#50b95b',
                  transition: 'width 0.3s',
                }}
              />
            </div>

            {/* Expanded content */}
            {isOpen && (
              <div className="bg-white">
                {group.courses.map((c) => {
                  const planned = plannedCourseIds.has(c.id);
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 last:border-0"
                    >
                      {/* Checkbox-style indicator */}
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '3px',
                          border: planned ? 'none' : '2px solid #d1d2d2',
                          backgroundColor: planned ? '#50b95b' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {planned && <span style={{ color: '#fff', fontSize: '9px', fontWeight: 700 }}>✓</span>}
                      </div>
                      <span
                        style={{
                          fontSize: '11px',
                          color: planned ? '#aaa' : '#515252',
                          textDecoration: planned ? 'line-through' : 'none',
                          flex: 1,
                          fontFamily: 'open_sansbold, Open Sans',
                          textTransform: 'uppercase',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {c.code}
                      </span>
                      <span style={{ fontSize: '10px', color: '#888' }}>{c.credits}cr</span>
                    </div>
                  );
                })}
                {group.required_credits > 0 && group.courses.length === 0 && (
                  <div className="px-3 py-2 text-xs text-gray-500 italic">
                    Choose {group.required_credits} elective credits from the catalog
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
