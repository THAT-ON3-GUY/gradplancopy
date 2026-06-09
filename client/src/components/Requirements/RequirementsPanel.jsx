import { useState, useMemo } from 'react';
import RequirementCourse from './RequirementCourse';

const TAB_CATEGORIES = {
  Degree: ['CS Core', 'Math/Science', 'CS Electives'],
  General: ['Religion', 'Gen Ed'],
  Electives: ['CS Electives'],
};

export default function RequirementsPanel({ requirements, allCourses, plannedCourseIds }) {
  const [tab, setTab] = useState('Degree');
  const [subTab, setSubTab] = useState(null);
  const [search, setSearch] = useState('');

  const tabs = ['General', 'Degree', 'Electives'];

  const visibleCategories = TAB_CATEGORIES[tab] ?? [];

  const filteredReqs = useMemo(() => {
    return requirements.filter((g) => visibleCategories.includes(g.category));
  }, [requirements, tab]);

  const subTabs = filteredReqs.map((g) => g.category);
  const activeSubTab = subTab && subTabs.includes(subTab) ? subTab : subTabs[0];

  const activeGroup = filteredReqs.find((g) => g.category === activeSubTab);

  // Search across all courses
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allCourses.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)).slice(0, 15);
  }, [search, allCourses]);

  // Progress bar data for active group
  const totalCr = activeGroup?.courses.reduce((s, c) => s + c.credits, 0) ?? 0;
  const plannedCr = activeGroup?.courses.filter((c) => plannedCourseIds.has(c.id)).reduce((s, c) => s + c.credits, 0) ?? 0;
  const pct = totalCr > 0 ? Math.min((plannedCr / totalCr) * 100, 100) : 0;

  return (
    <div style={{ width: '360px', minWidth: '360px', borderLeft: '1px solid #e0e0e0', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Heading */}
      <div style={{ padding: '20px 20px 0' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000', margin: '0 0 14px' }}>Requirements &amp; Courses</h2>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', padding: '6px 10px', gap: '6px' }}>
            <span style={{ color: '#888', fontSize: '14px' }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find Courses..."
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', fontFamily: 'Open Sans, sans-serif', color: '#333' }}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#006ca5', cursor: 'pointer', whiteSpace: 'nowrap' }}>View Course Availability</span>
        </div>
      </div>

      {/* Main tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', padding: '0 20px' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSubTab(null); setSearch(''); }}
            style={{
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              borderBottom: tab === t ? '3px solid #333' : '3px solid transparent',
              backgroundColor: tab === t ? '#515252' : 'transparent',
              color: tab === t ? '#fff' : '#515252',
              cursor: 'pointer',
              borderRadius: tab === t ? '4px 4px 0 0' : '0',
              marginRight: '4px',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Sub-tab bar */}
      {subTabs.length > 1 && !search && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px', padding: '8px 20px 0', borderBottom: '1px solid #e0e0e0' }}>
          {subTabs.map((st) => (
            <button
              key={st}
              onClick={() => setSubTab(st)}
              style={{
                fontSize: '11px',
                padding: '4px 8px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: st === activeSubTab ? '#000' : '#888',
                borderBottom: st === activeSubTab ? '2px solid #006ca5' : '2px solid transparent',
                fontWeight: st === activeSubTab ? 600 : 400,
              }}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

        {/* Search results */}
        {search && (
          <div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 700 }}>
              Search Results ({searchResults.length})
            </div>
            {searchResults.length === 0 && <div style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic' }}>No courses found.</div>}
            {searchResults.map((c) => (
              <RequirementCourse key={c.id} course={c} isPlanned={plannedCourseIds.has(c.id)} />
            ))}
          </div>
        )}

        {/* Requirement group */}
        {!search && activeGroup && (
          <div>
            {/* Category heading + progress bar */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '10px', color: '#000' }}>
              {activeGroup.category}
            </h3>

            {/* Progress bar — matching real site (blue=completed, green=planned, dotted=unplanned) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '12px', backgroundColor: '#e8e8e8', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#50b95b', borderRadius: '6px', transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontSize: '22px', fontWeight: 300, color: '#000', minWidth: '28px', textAlign: 'right' }}>
                {totalCr}
              </span>
              <span style={{ fontSize: '11px', color: '#888' }}>Total</span>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#666', marginBottom: '14px' }}>
              <span>🔵 Completed</span>
              <span>🟢 Planned/Enrolled</span>
              <span>⬜ Unplanned</span>
            </div>

            {/* Take these courses label */}
            {activeGroup.courses.length > 0 && (
              <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', color: '#000' }}>
                Take these courses:
              </div>
            )}

            {/* Course rows */}
            {activeGroup.courses.map((c) => (
              <RequirementCourse key={c.id} course={c} isPlanned={plannedCourseIds.has(c.id)} />
            ))}

            {activeGroup.required_credits > 0 && activeGroup.courses.length === 0 && (
              <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', padding: '8px 0' }}>
                Choose {activeGroup.required_credits} elective credits — use the search above to find courses.
              </div>
            )}
          </div>
        )}

        {!search && !activeGroup && (
          <div style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic', paddingTop: '20px', textAlign: 'center' }}>
            No requirements found for this tab.
          </div>
        )}
      </div>
    </div>
  );
}
