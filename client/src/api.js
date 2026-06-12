// ── API abstraction layer ─────────────────────────────────────────────────────
// When VITE_USE_MOCK=true (GitHub Pages), all calls go to mockApi.
// In local dev, calls hit the real Express backend via Vite's proxy.

import * as mock from './mockApi';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const B = '/api';

// Helper — fetch + parse JSON, reject on HTTP errors
const f = async (url, opts) => {
  const res = await fetch(url, opts);
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
};
const json = (body) => ({ headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

// ── Exports ───────────────────────────────────────────────────────────────────

export const getMajors = USE_MOCK
  ? mock.getMajors
  : () => f(`${B}/majors`);

export const getCourses = USE_MOCK
  ? mock.getCourses
  : () => f(`${B}/courses`);

export const getRequirements = USE_MOCK
  ? mock.getRequirements
  : (majorId) => f(`${B}/majors/${majorId}/requirements`);

export const getPlans = USE_MOCK
  ? mock.getPlans
  : () => f(`${B}/plans`);

export const createPlan = USE_MOCK
  ? mock.createPlan
  : (name, majorId) => f(`${B}/plans`, { method: 'POST', ...json({ name, major_id: majorId }) });

export const getPlanCourses = USE_MOCK
  ? mock.getPlanCourses
  : (planId) => f(`${B}/plans/${planId}/courses`);

export const getTransferCredits = USE_MOCK
  ? mock.getTransferCredits
  : (planId) => f(`${B}/plans/${planId}/transfer-credits`);

export const addCourseToPlan = USE_MOCK
  ? mock.addCourseToPlan
  : (planId, courseId, year, term) =>
      f(`${B}/plans/${planId}/courses`, { method: 'POST', ...json({ course_id: courseId, semester_year: year, semester_term: term }) });

export const moveCourse = USE_MOCK
  ? mock.moveCourse
  : (planId, pcId, year, term) =>
      f(`${B}/plans/${planId}/courses/${pcId}`, { method: 'PATCH', ...json({ semester_year: year, semester_term: term }) });

export const adjustCredits = USE_MOCK
  ? mock.adjustCredits
  : (planId, pcId, credits) =>
      f(`${B}/plans/${planId}/courses/${pcId}`, { method: 'PATCH', ...json({ planned_credits: credits }) });

export const removeCourse = USE_MOCK
  ? mock.removeCourse
  : (planId, pcId) => f(`${B}/plans/${planId}/courses/${pcId}`, { method: 'DELETE' });

export const validatePlan = USE_MOCK
  ? mock.validatePlan
  : (planId) => f(`${B}/plans/${planId}/validate`);
