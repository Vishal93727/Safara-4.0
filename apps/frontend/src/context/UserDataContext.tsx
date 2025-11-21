




// import React, { createContext, useContext, useState, useEffect } from "react";
// import { getSession, getUserItem, setUserItem } from "@/lib/session";

// interface PersonalData {
//   pid_application_id?: string | null;
//   pid_full_name?: string | null;
//   pid_mobile?: string | null;
//   pid_email?: string | null;
//   pid_personal_id?: string | null;
//   pid_nationality?: string | null;
// }

// interface TouristData {
//   tid?: string | null;
//   tid_status?: string | null;
//   tid_userId?: string | null;
//   trip?: any;
// }

// interface UserDataContextType {
//   personal: PersonalData;
//   tourist: TouristData;
//   updatePersonal: (data: Partial<PersonalData>) => void;
//   updateTourist: (data: Partial<TouristData>) => void;
//   clearAll: () => void;
// }

// const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

// export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [personal, setPersonal] = useState<PersonalData>({});
//   const [tourist, setTourist] = useState<TouristData>({});

//   // ------------------------------------------------------------
//   // 1️⃣ Load session data (NO DEMO DATA)
//   // ------------------------------------------------------------
//   useEffect(() => {
//     const s = getSession();
//     console.log("🟦 Loaded session:", s);

//     if (!s) return;

//     const savedPersonal = {
//       pid_application_id: getUserItem("pid_application_id", s),
//       pid_full_name: getUserItem("pid_full_name", s),
//       pid_mobile: getUserItem("pid_mobile", s),
//       pid_email: getUserItem("pid_email", s),
//       pid_personal_id: getUserItem("pid_personal_id", s),
//       pid_nationality: getUserItem("pid_nationality", s),
//     };

//     setPersonal(savedPersonal);

//     const savedTourist = {
//       tid: localStorage.getItem("current_tid"),
//       tid_status: localStorage.getItem("current_tid_status"),
//       tid_userId: localStorage.getItem("current_tid_userId"),
//       trip: JSON.parse(localStorage.getItem("trip_draft") || "null"),
//     };

//     setTourist(savedTourist);
//   }, []);

//   // ------------------------------------------------------------
//   // 2️⃣ FETCH PERSONAL FROM BACKEND
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!personal.pid_email) return;

//     console.log("🌐 Fetching Personal From API:", personal.pid_email);

//     fetch(`/api/personal/fetch?email=${personal.pid_email}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log("🟦 Personal API Response:", data);
//         if (!data) return;

//         setPersonal(prev => ({ ...prev, ...data }));

//         // save to local storage too
//         Object.keys(data).forEach(key => {
//           setUserItem(key, data[key]);
//         });
//       })
//       .catch(err => console.error("❌ Personal API Error:", err));
//   }, [personal.pid_email]);

//   // ------------------------------------------------------------
//   // ⭐ 3️⃣ FETCH TOURIST FROM BACKEND (NEW)
//   // ------------------------------------------------------------
//   useEffect(() => {
//     if (!tourist.tid_userId) return;

//     console.log("🌐 Fetching Tourist From API:", tourist.tid_userId);

//     fetch(`/api/tourist/fetch?userId=${tourist.tid_userId}`)
//       .then(res => res.json())
//       .then(data => {
//         console.log("🟨 Tourist API Response:", data);
//         if (!data) return;

//         setTourist(prev => ({ ...prev, ...data }));

//         // Save to local storage
//         if (data.tid) localStorage.setItem("current_tid", data.tid);
//         if (data.tid_status) localStorage.setItem("current_tid_status", data.tid_status);
//         if (data.tid_userId) localStorage.setItem("current_tid_userId", data.tid_userId);
//         if (data.trip) localStorage.setItem("trip_draft", JSON.stringify(data.trip));
//       })
//       .catch(err => console.error("❌ Tourist API Error:", err));
//   }, [tourist.tid_userId]);

// // ------------------------------------------------------------
// // ⭐ 3️⃣ FETCH TOURIST FROM BACKEND (UPDATED)
// // ------------------------------------------------------------
// // useEffect(() => {
// //   // Try to get userId from localStorage if not already in state
// //   let userId = tourist.tid_userId || localStorage.getItem("current_tid_userId");
// //   if (!userId) return; // no userId, skip fetch
// // console.log(userId);
// // console.log(current_tid_userId);
// //   console.log("🌐 Fetching Tourist From API:", userId);

// //   fetch(`/api/tourist/fetch?email=${userId}`)
// //     .then(res => res.json())
// //     .then(data => {
// //       console.log("🟨 Tourist API Response:", data);
// //       if (!data) return;

// //       // Ensure we extract only expected fields
// //       const updatedTourist: TouristData = {
// //         tid: data.tid || null,
// //         tid_status: data.tid_status || null,
// //         tid_userId: data.tid_userId || userId, // fallback to userId
// //         trip: data.trip || null,
// //       };

// //       // Update state
// //       setTourist(updatedTourist);

// //       // Save to localStorage
// //       if (updatedTourist.tid) localStorage.setItem("current_tid", updatedTourist.tid);
// //       if (updatedTourist.tid_status) localStorage.setItem("current_tid_status", updatedTourist.tid_status);
// //       if (updatedTourist.tid_userId) localStorage.setItem("current_tid_userId", updatedTourist.tid_userId);
// //       if (updatedTourist.trip) localStorage.setItem("trip_draft", JSON.stringify(updatedTourist.trip));
// //     })
// //     .catch(err => console.error("❌ Tourist API Error:", err));
// // }, [tourist.tid_userId]);






//   // ------------------------------------------------------------
//   // 4️⃣ Update personal
//   // ------------------------------------------------------------
//   const updatePersonal = (data: Partial<PersonalData>) => {
//     console.log("🔵 Updating Personal:", data);

//     setPersonal(prev => {
//       const updated = { ...prev, ...data };

//       for (const key in data) {
//         setUserItem(key, data[key as keyof PersonalData] as string);
//       }

//       return updated;
//     });
//   };

//   // ------------------------------------------------------------
//   // 5️⃣ Update tourist
//   // ------------------------------------------------------------
//   const updateTourist = (data: Partial<TouristData>) => {
//     console.log("🟣 Updating Tourist:", data);

//     setTourist(prev => {
//       const updated = { ...prev, ...data };

//       if (data.tid) localStorage.setItem("current_tid", data.tid);
//       if (data.tid_status) localStorage.setItem("current_tid_status", data.tid_status);
//       if (data.trip) localStorage.setItem("trip_draft", JSON.stringify(data.trip));

//       return updated;
//     });
//   };

//   // ------------------------------------------------------------
//   // 6️⃣ Clear all
//   // ------------------------------------------------------------
//   const clearAll = () => {
//     console.log("🧹 Clearing All Data");

//     setPersonal({});
//     setTourist({});

//     localStorage.removeItem("current_tid");
//     localStorage.removeItem("current_tid_status");
//     localStorage.removeItem("trip_draft");
//   };

//   return (
//     <UserDataContext.Provider
//       value={{ personal, tourist, updatePersonal, updateTourist, clearAll }}
//     >
//       {children}
//     </UserDataContext.Provider>
//   );
// };

// export const useUserData = () => {
//   const ctx = useContext(UserDataContext);
//   if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
//   return ctx;
// };




import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession, getUserItem, setUserItem } from "@/lib/session";
import { TouristIdRecord,saveTouristIdFromDraft } from '@/lib/touristId';
interface PersonalData {
  pid_application_id?: string | null;
  pid_full_name?: string | null;
  pid_mobile?: string | null;
  pid_email?: string | null;
  pid_personal_id?: string | null;
  pid_nationality?: string | null;
}

interface TouristData {
  tid?: string | null;
  tid_status?: string | null;
  trip?: any;
}

interface UserDataContextType {
  personal: PersonalData;
  tourist: TouristData;
  updatePersonal: (data: Partial<PersonalData>) => void;
  updateTourist: (data: Partial<TouristData>) => void;
  clearAll: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [personal, setPersonal] = useState<PersonalData>({});
  const [tourist, setTourist] = useState<TouristData>({});
const rec = saveTouristIdFromDraft();
console.log( rec);
  
  // ------------------------------------------------------------
  // 1️⃣ Load from local storage (NO DEMO DATA)
  // ------------------------------------------------------------
  useEffect(() => {
    const s = getSession();
    console.log("🟦 Loaded session:", s);

    if (!s) {
      console.warn("⚠️ No session found — user is not logged in.");
      return; // do NOT load anything
    }

    const savedPersonal: PersonalData = {
      pid_application_id: getUserItem("pid_application_id", s),
      pid_full_name: getUserItem("pid_full_name", s),
      pid_mobile: getUserItem("pid_mobile", s),
      pid_email: getUserItem("pid_email", s),
      pid_personal_id: getUserItem("pid_personal_id", s),
      pid_nationality: getUserItem("pid_nationality", s),
    };

    console.log("🟩 Personal (localStorage):", savedPersonal);
    setPersonal(savedPersonal);

    const savedTourist: TouristData = {
      tid: localStorage.getItem("current__tid"),
      tid_status: localStorage.getItem("current_tid_status"),
      trip: JSON.parse(localStorage.getItem("trip_draft") || "null"),
    };

    console.log("🟧 Tourist (localStorage):", savedTourist);
    setTourist(savedTourist);
  }, []);

  // ------------------------------------------------------------
  // 2️⃣ Fetch backend Personal API
  // ------------------------------------------------------------
  useEffect(() => {
    if (!personal.pid_email) return;

    console.log("🌐 Fetching Personal From API:", personal.pid_email);

    fetch(`/api/personal/fetch?email=${personal.pid_email}`)
      .then(res => res.json())
      .then(data => {
        console.log("🟦 Personal API Response:", data);
        if (!data) return;
        setPersonal(prev => ({ ...prev, ...data }));
      })
      .catch(err => console.error("❌ Personal API Error:", err));
  }, [personal.pid_email]);

  // ------------------------------------------------------------
  // 3️⃣ Fetch backend Trip API
  // ------------------------------------------------------------
  useEffect(() => {
    if (!personal.pid_email) return;

    console.log("🌐 Fetching Trips From API:", personal.pid_email);

    fetch(`/api/trips/fetch?email=${personal.pid_email}`)
      .then(res => res.json())
      .then(data => {
        console.log("🟥 Trip API Response:", data);
        if (!data) return;
        setTourist(prev => ({ ...prev, ...data }));
      })
      .catch(err => console.error("❌ Trip API Error:", err));
  }, [personal.pid_email]);

  // ------------------------------------------------------------
  // 4️⃣ Update personal
  // ------------------------------------------------------------
  const updatePersonal = (data: Partial<PersonalData>) => {
    console.log("🔵 Updating Personal:", data);

    setPersonal(prev => {
      const updated = { ...prev, ...data };
      for (const key in data) {
        if (data[key as keyof PersonalData] !== undefined)
          setUserItem(key, data[key as keyof PersonalData] as string);
      }
      return updated;
    });
  };

  // ------------------------------------------------------------
  // 5️⃣ Update tourist
  // ------------------------------------------------------------
  const updateTourist = (data: Partial<TouristData>) => {
    console.log("🟣 Updating Tourist:", data);

    setTourist(prev => {
      const updated = { ...prev, ...data };
      if (rec.id) localStorage.setItem("current_tid", data.tid);
      if (data.tid_status) localStorage.setItem("current_tid_status", data.tid_status);
      if (data.trip) localStorage.setItem("trip_draft", JSON.stringify(data.trip));
      return updated;
    });
  };

  // ------------------------------------------------------------
  // 6️⃣ Clear all
  // ------------------------------------------------------------
  const clearAll = () => {
    console.log("🧹 Clearing All Data");

    setPersonal({});
    setTourist({});

    sessionStorage.clear();
   // localStorage.removeItem("current_tid");
    //localStorage.removeItem("current_tid_status");
   // localStorage.removeItem("trip_draft");
  };

  return (
    <UserDataContext.Provider value={{ personal, tourist, updatePersonal, updateTourist, clearAll }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used inside UserDataProvider");
  return ctx;
};/// this code work for personal but now add to get tourist data
