// src/lib/session.ts
import { TouristIdRecord } from './touristId';
type Session = { userId: string; displayName?: string };

const SESSION_KEY = 'session_user';

export function setSession(userId: string, displayName?: string) {
  const s: Session = { userId, displayName };
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  return s;
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Session; } catch { return null; }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function userKey(key: string, s: Session | null = getSession()) {
  if (!s) return key;
  return `${s.userId}:${key}`;
}

export function setUserItem(key: string, value: string, s: Session | null = getSession()) {
  if (!s) return;
  localStorage.setItem(userKey(key, s), value);
}

// export function setUserItem(key: string, value: string, s: Session | null = getSession()) {
//   if (!s) {
//     // Auto-create a random session if none exists
//     s = setSession('USER-' + Math.random().toString(36).slice(2, 8).toUpperCase(), 'Visitor');
//     console.log('Session created automatically for setUserItem:', s);
//   }
//   localStorage.setItem(userKey(key, s), value);
// }

export function getUserItem(key: string, s: Session | null = getSession()) {
  if (!s) return null;
  return localStorage.getItem(userKey(key, s));
}

export function removeUserItem(key: string, s: Session | null = getSession()) {
  if (!s) return;
  localStorage.removeItem(userKey(key, s));
}

export function clearUserPidData(s: Session | null = getSession()) {
  if (!s) return;
  const keys = [
    'pid_application_id',
    'pid_personal_id',
    'pid_full_name',
    'pid_mobile',
    'pid_email',
    
  ];
  keys.forEach(k => localStorage.removeItem(userKey(k, s)));
}

// -----------------------------
// Tourist session helpers
// -----------------------------



// src/lib/session.ts


/* ... existing functions setSession, getSession, etc ... */

function emptyToNull(v: string | null): string | null {
  if (v === null) return null;
  if (v === '') return null;
  return v;
}

// export function getTouristRecord(): TouristIdRecord | null {
//   const s = getSession();
//   if (!s) return null;

//   // Try JSON whole-record first (preferred)
//   const rawJson = getUserItem('tourist_id_record', s);
//   if (rawJson) {
//     try {
//       const parsed = JSON.parse(rawJson) as TouristIdRecord;
//       return parsed;
//     } catch (e) {
//       // fall through to individual keys if JSON parse fails
//       console.warn('tourist_id_record JSON parse failed, falling back to individual keys', e);
//     }
//   }

//   // Fallback: read individual keys
//   const id = getUserItem('tourist_id', s);
//   if (!id) return null;

//   return {
//     id,
//     holderPid: emptyToNull(getUserItem('pid_personal_id', s)),
//     destination: emptyToNull(getUserItem('tourist_id_destination', s)),
//     startDate: emptyToNull(getUserItem('tourist_id_start', s)),
//     endDate: emptyToNull(getUserItem('tourist_id_end', s)),
//     status: (getUserItem('tourist_id_status', s) as 'active' | 'scheduled' | 'expired') || 'scheduled',
//     createdAt: getUserItem('tourist_id_created', s) || new Date().toISOString(),
//     itinerary: emptyToNull(getUserItem('tourist_id_itinerary', s)),
//     agencyId: emptyToNull(getUserItem('tourist_id_agency', s)),
//     homeCity: emptyToNull(getUserItem('tourist_id_home', s)),
//   };
// }

export function getTouristFromLocal(): TouristIdRecord | null {
  const raw = localStorage.getItem('YOUR_USERID:tourist_id_record'); // replace YOUR_USERID if using session key prefix
  if (!raw) return null;

  try {
    const tourist: TouristIdRecord = JSON.parse(raw);
    return tourist;
  } catch (e) {
    console.error('Failed to parse tourist record from localStorage', e);
    return null;
  }
}
// export function setTouristItem(key: string, value: string, s: Session | null = getSession()) {
//   if (!s) return;
//   localStorage.setItem(userKey(`tourist_${key}`, s), value);
// }

// export function getTouristItem(key: string, s: Session | null = getSession()): string | null {
//   if (!s) return null;
//   return localStorage.getItem(userKey(`tourist_${key}`, s));
// }

// export function removeTouristItem(key: string, s: Session | null = getSession()) {
//   if (!s) return;
//   localStorage.removeItem(userKey(`tourist_${key}`, s));
// }

// // Clear all tourist-related data for the session
// export function clearTouristData(s: Session | null = getSession()) {
//   if (!s) return;
//   const keys = ['tid', 'tid_status', 'tid_userId', 'trip_draft'];
//   keys.forEach(k => localStorage.removeItem(userKey(`tourist_${k}`, s)));
// }
