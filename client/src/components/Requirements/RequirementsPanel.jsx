import { useState, useMemo } from 'react';
import RequirementCourse from './RequirementCourse';

// Map main tabs to which categories appear in each
const TAB_CATEGORIES = {
  General: ['Religion', 'Gen Ed'],
  Degree:  ['CS Core', 'Math/Science'],
  Electives: ['CS Electives'],
};

// Sub-tab display names for Degree
const DEGREE_SUBTABS = ['Major', 'Certificate 1', 'Certificate 2'];

export default function RequirementsPanel({
  requirements,
  allCourses,
  plannedCourseIds,
  onAddCourse,
  onViewCourseDetails,
  majorName = 'Computer Science',
}) {
  const [tab, setTab] = useState('Degree');
  const [subTab, setSubTab] = useState(null);
  const [search, setSearch] = useState('');
  const [orExpanded, setOrExpanded] = useState({});

  const tabs = ['General', 'Degree', 'Electives'];

  const visibleCategories = TAB_CATEGORIES[tab] ?? [];

  const filteredReqs = useMemo(
    () => requirements.filter((g) => visibleCategories.includes(g.category)),
    [requirements, tab]
  );

  // Sub-tabs depend on the active main tab
  let subTabs;
  if (tab === 'Degree') {
    subTabs = DEGREE_SUBTABS;
  } else {
    subTabs = filteredReqs.map((g) => g.category);
  }

  const activeSubTab = subTab && subTabs.includes(subTab) ? subTab : subTabs[0];

  // For Degree tab, "Major" sub-tab shows all Degree categories together
  let activeGroups;
  if (tab === 'Degree') {
    if (activeSubTab === 'Major') {
      activeGroups = filteredReqs; // CS Core + Math/Science
    } else {
      activeGroups = []; // Certificate sub-tabs have no data in our mock
    }
  } else {
    const g = filteredReqs.find((gr) => gr.category === activeSubTab);
    activeGroups = g ? [g] : [];
  }

  // Search across all courses
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return allCourses
      .filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
      .slice(0, 15);
  }, [search, allCourses]);

  // Progress for the active groups
  const allCoursesInGroups = activeGroups.flatMap((g) => g.courses);
  const totalCr = allCoursesInGroups.reduce((s, c) => s + c.credits, 0);
  const plannedCr = allCoursesInGroups
    .filter((c) => plannedCourseIds.has(c.id))
    .reduce((s, c) => s + c.credits, 0);
  const completedCr = 0; // For now, treat all as unstarted (could derive from semester status)
  const pct = totalCr > 0 ? Math.min((plannedCr / totalCr) * 100, 100) : 0;

  const toggleOr = (groupKey) => setOrExpanded((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));

  return (
    <div
      style={{
        width: '360px',
        minWidth: '360px',
        borderLeft: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Heading */}
      <div style={{ padding: '20px 20px 0' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#000', margin: '0 0 14px' }}>
          Requirements &amp; Courses
        </h2>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              flex: 1, display: 'flex', alignItems: 'center',
              border: '1px solid #ccc', borderRadius: '4px',
              padding: '6px 10px', gap: '6px',
            }}
          >
            <span style={{ color: '#888', fontSize: '14px' }}>🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find Courses..."
              style={{
                border: 'none', outline: 'none', width: '100%',
                fontSize: '13px', fontFamily: 'Open Sans, sans-serif', color: '#333',
              }}
            />
          </div>
          <span style={{ fontSize: '12px', color: '#006ca5', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            View Course Availability
          </span>
        </div>
      </div>

      {/* Main tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', padding: '0 20px' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSubTab(null); setSearch(''); }}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              borderBottom: tab === t ? '3px solid #333' : '3px solid transparent',
              backgroundColor: tab === t ? '#515252' : 'transparent',
              color: tab === t ? '#fff' : '#515252',
              cursor: 'pointer',
              borderRadius: tab === t ? '4px 4px 0 0' : '0',
              marginRight: '2px',
              fontFamily: 'Open Sans, sans-serif',
            }}
          >
            {t === 'General' ? 'General Ed' : t}
          </button>
        ))}
      </div>

      {/* Sub-tab bar */}
      {!search && (
        <div
          style={{
            display: 'flex', flexWrap: 'wrap', gap: '0',
            padding: '0 20px', borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
          }}
        >
          {subTabs.map((st) => (
            <button
              key={st}
              onClick={() => setSubTab(st)}
              style={{
                fontSize: '12px',
                padding: '8px 10px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: st === activeSubTab ? '#006ca5' : '#777',
                borderBottom: st === activeSubTab ? '2px solid #006ca5' : '2px solid transparent',
                fontWeight: st === activeSubTab ? 700 : 400,
                fontFamily: 'Open Sans, sans-serif',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      )}

      {/* Degree tab — Major header */}
      {tab === 'Degree' && activeSubTab === 'Major' && !search && (
        <div style={{ padding: '12px 20px 4px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '12px', color: '#006ca5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            440 {majorName.toUpperCase()} - BACHELOR OF SCIENCE DEGREE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
            <span style={{ fontSize: '11px', color: '#888' }}>(2025–2026)</span>
            <button
              style={{
                fontSize: '11px', color: '#006ca5', background: 'none',
                border: 'none', cursor: 'pointer', fontFamily: 'Open Sans, sans-serif',
              }}
            >
              Change Major
            </button>
          </div>
        </div>
      )}

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }}>

        {/* Search results */}
        {search && (
          <div>
            <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 700 }}>
              Search Results ({searchResults.length})
            </div>
            {searchResults.length === 0 && (
              <div style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic' }}>No courses found.</div>
            )}
            {searchResults.map((c) => (
              <RequirementCourse
                key={c.id}
                course={c}
                isPlanned={plannedCourseIds.has(c.id)}
                onAdd={onAddCourse}
                onViewDetails={onViewCourseDetails}
              />
            ))}
          </div>
        )}

        {/* Requirement groups */}
        {!search && activeGroups.map((group) => (
          <div key={group.category} style={{ marginBottom: '20px' }}>
            {/* Category heading */}
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: '#000', borderBottom: '1px solid #f0f0f0', paddingBottom: '6px' }}>
              {group.category}
            </h3>

            {/* Progress bar */}
            <ProgressBar
              totalCr={group.courses.reduce((s, c) => s + c.credits, 0)}
              plannedCr={group.courses.filter((c) => plannedCourseIds.has(c.id)).reduce((s, c) => s + c.credits, 0)}
              completedCr={0}
            />

            {/* Take these courses label */}
            {group.courses.length > 0 && (
              <div style={{ fontSize: '12px', fontWeight: 700, marginBottom: '6px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Take these courses:
              </div>
            )}

            {/* Course rows */}
            {group.courses.map((c) => (
              <RequirementCourse
                key={c.id}
                course={c}
                isPlanned={plannedCourseIds.has(c.id)}
                onAdd={onAddCourse}
                onViewDetails={onViewCourseDetails}
              />
            ))}

            {/* OR TAKE OTHER OPTIONS */}
            {group.or_options && group.or_options.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <button
                  onClick={() => toggleOr(group.category)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    backgroundColor: orExpanded[group.category] ? '#3a3a3a' : '#515252',
                    color: '#fff',
                    border: 'none',
                    borderRadius: orExpanded[group.category] ? '6px 6px 0 0' : '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontFamily: 'Open Sans, sans-serif',
                  }}
                >
                  <span>OR TAKE OTHER OPTIONS</span>
                  <span style={{ fontSize: '10px', transform: orExpanded[group.category] ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>▼</span>
                </button>

                {orExpanded[group.category] && (
                  <div
                    style={{
                      backgroundColor: '#3a3a3a',
                      borderRadius: '0 0 6px 6px',
                      padding: '12px',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#aaa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                      TAKE {group.or_options.length} COURSE{group.or_options.length !== 1 ? 'S' : ''}
                    </div>
                    {group.or_options.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          backgroundColor: '#2a2a2a',
                          borderRadius: '6px',
                          marginBottom: '6px',
                          border: '1px solid #555',
                          overflow: 'hidden',
                        }}
                      >
                        <RequirementCourse
                          course={c}
                          isPlanned={plannedCourseIds.has(c.id)}
                          onAdd={onAddCourse}
                          onViewDetails={onViewCourseDetails}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Electives free-choice note */}
            {group.required_credits > 0 && group.courses.length === 0 && (
              <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', padding: '8px 0' }}>
                Choose {group.required_credits} elective credits — use the search above to find courses.
              </div>
            )}
          </div>
        ))}

        {/* Electives tab special content */}
        {!search && tab === 'Electives' && activeGroups.length > 0 && (
          <ElectivesProgress groups={activeGroups} plannedCourseIds={plannedCourseIds} />
        )}

        {!search && activeGroups.length === 0 && tab !== 'Electives' && (
          <div style={{ fontSize: '13px', color: '#aaa', fontStyle: 'italic', paddingTop: '20px', textAlign: 'center' }}>
            No requirements found for this tab.
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ totalCr, plannedCr, completedCr }) {
  if (totalCr === 0) return null;
  const completedPct = Math.min((completedCr / totalCr) * 100, 100);
  const plannedPct = Math.min(((plannedCr) / totalCr) * 100, 100);
  const unplannedPct = Math.max(100 - plannedPct, 0);

  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Bar */}
      <div style={{ height: '10px', backgroundColor: '#e8e8e8', borderRadius: '5px', overflow: 'hidden', marginBottom: '6px' }}>
        <div style={{ height: '100%', display: 'flex' }}>
          <div style={{ width: `${completedPct}%`, backgroundColor: '#0072b0', transition: 'width 0.3s' }} />
          <div style={{ width: `${plannedPct - completedPct}%`, backgroundColor: '#50b95b', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: '#666' }}>
        <span>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0072b0', marginRight: '4px', verticalAlign: 'middle' }} />
          Completed ({completedCr})
        </span>
        <span>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#50b95b', marginRight: '4px', verticalAlign: 'middle' }} />
          Planned ({plannedCr})
        </span>
        <span>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', border: '1px solid #ccc', marginRight: '4px', verticalAlign: 'middle' }} />
          Unplanned ({totalCr - plannedCr})
        </span>
      </div>
    </div>
  );
}

function ElectivesProgress({ groups, plannedCourseIds }) {
  const totalNeeded = groups.reduce((s, g) => s + g.required_credits, 0);
  const plannedElective = 0; // No specific elective tracking in mock

  return (
    <div>
      <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px', color: '#000' }}>
        CS Electives
      </div>
      <ProgressBar totalCr={totalNeeded} plannedCr={plannedElective} completedCr={0} />
      <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', padding: '8px 0' }}>
        Choose {totalNeeded} elective credits from CS courses not already required.
        Use the search above to find courses.
      </div>
    </div>
  );
}
