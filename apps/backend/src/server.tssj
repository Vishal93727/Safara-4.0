


// import { env } from './config/env.js';
// // import { buildApp } from './app.js';
// // import { connectMongo, disconnectMongo } from './db/mongoose.js';
// // import { Server as SocketIOServer } from 'socket.io';
// // import cors from 'cors';
// // const start = async () => {
// //   await connectMongo();
// //   const app = buildApp();
// //   app.use(cors({
// //   origin: process.env.NODE_ENV === 'production'
// //     ? process.env.FRONTEND_URL
// //     : ['http://localhost:5174', 'http://localhost:5173'],
// //   credentials: true,
// //   optionsSuccessStatus: 200
// // }));
// //   const server = app.listen(env.PORT, () =>
// //     console.log(`✅ API listening on http://localhost:${env.PORT}`)
// //   );

// //   // const io = new SocketIOServer(server, {
// //   //   cors: { origin: '*', methods: ['GET', 'POST'] },
// //   //   transports: ['websocket', 'polling'],
// //   // });

// // const io = new SocketIOServer(server, {
// //   cors: {
// //     origin: process.env.FRONTEND_URL || '*',
// //     methods: ["GET", "POST", "PUT", "DELETE"]
// //   },
// //   transports: ['websocket', 'polling']
// // });


// //   // --- In-memory state ---
// //   const zones = new Map();
// //   const boundaries = new Map();
// //   const insideZonesBySocket = new Map();
// //   const boundaryInsideBySocket = new Map();
// //   const incidents = new Map();
// //   const socketTouristInfo = new Map();

// //   /** @typedef {{ lat: number, lng: number }} LatLng */

// //   // --- Helper functions ---
// //   const toRad = (x) => (x * Math.PI) / 180;
// //   const haversine = (a, b) => {
// //     const R = 6371000;
// //     const dLat = toRad(b.lat - a.lat);
// //     const dLng = toRad(b.lng - a.lng);
// //     const s =
// //       Math.sin(dLat / 2) ** 2 +
// //       Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
// //     return 2 * R * Math.asin(Math.sqrt(s));
// //   };

// //   const pointInPolygon = (pt, poly) => {
// //     let inside = false;
// //     for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
// //       const xi = poly[i].lng, yi = poly[i].lat;
// //       const xj = poly[j].lng, yj = poly[j].lat;
// //       const intersect =
// //         yi > pt.lat !== yj > pt.lat &&
// //         pt.lng < ((xj - xi) * (pt.lat - yi)) / (yj - yi) + xi;
// //       if (intersect) inside = !inside;
// //     }
// //     return inside;
// //   };

// //   // --- Socket connections ---
// //   io.on('connection', (socket) => {
// //     console.log('✅ Client connected:', socket.id);

// //     // --- Authority joins ---
// //     socket.on('join-authority', () => {
// //       socket.join('authorities');
// //       console.log('👮 Authority joined:', socket.id);
// //     });

// //     // --- Register tourist meta ---
// //     socket.on('register-tourist', (payload) => {
// //       try {
// //         const info = {
// //           touristSocketId: socket.id,
// //           touristId: payload?.touristId || null,
// //           personalId: payload?.personalId || null,
// //           name: payload?.name || null,
// //           email: payload?.email || null,
// //           phone: payload?.phone || null,
// //           nationality: payload?.nationality || null,
// //           registeredAt: Date.now(),
// //         };
// //         socketTouristInfo.set(socket.id, info);
// //         io.to('authorities').emit('tourist-registered', info);
// //         console.log('[socket] register-tourist', socket.id, info);
// //       } catch (err) {
// //         console.warn('[socket] register-tourist error', err);
// //       }
// //     });

// //     // --- Live rich tourist data ---
// //     socket.on('live-tourist-data', (payload) => {
// //       try {
// //         const data = {
// //           touristSocketId: socket.id,
// //           touristId: payload?.touristId ?? null,
// //           personalId: payload?.personalId ?? null,
// //           name: payload?.name ?? null,
// //           email: payload?.email ?? null,
// //           phone: payload?.phone ?? null,
// //           nationality: payload?.nationality ?? null,
// //           destination: payload?.destination ?? null,
// //           tripStart: payload?.tripStart ?? null,
// //           tripEnd: payload?.tripEnd ?? null,
// //           status: payload?.status ?? 'active',
// //           location:
// //             payload?.latitude != null && payload?.longitude != null
// //               ? {
// //                   lat: Number(payload.latitude),
// //                   lng: Number(payload.longitude),
// //                   timestamp: payload?.timestamp ?? Date.now(),
// //                 }
// //               : null,
// //         };

// //         // Save latest tourist data
// //         socketTouristInfo.set(socket.id, {
// //           ...(socketTouristInfo.get(socket.id) || {}),
// //           ...data,
// //         });

// //         // Send simplified location update for maps
// //         if (data.location) {
// //           io.to('authorities').emit('receive-location', {
// //             id: data.touristSocketId,
// //             latitude: data.location.lat,
// //             longitude: data.location.lng,
// //             timestamp: data.location.timestamp,
// //             name: data.name,
// //             phone: data.phone,
// //             destination: data.destination,
// //             status: data.status,
// //           });
// //         }

// //         // Send full tourist info update
// //         io.to('authorities').emit('update-tourist-data', data);
// //       } catch (err) {
// //         console.error('[socket] live-tourist-data error', err);
// //       }
// //     });

// //     // --- Basic live location for backward compatibility ---
// //     socket.on('send-location', ({ latitude, longitude }) => {
// //       io.to('authorities').emit('receive-location', {
// //         id: socket.id,
// //         latitude,
// //         longitude,
// //       });

// //       const here = { lat: latitude, lng: longitude };
// //       const prevSet = insideZonesBySocket.get(socket.id) ?? new Set();
// //       const nextSet = new Set();

// //       // --- Zone logic ---
// //       for (const z of zones.values()) {
// //         let inside = false;
// //         if (z.type === 'circle' && z.coords && z.radius) {
// //           const center = z.coords[0];
// //           inside = haversine(here, center) <= (z.radius ?? 0);
// //         } else if (z.type === 'polygon' && z.coords?.length) {
// //           inside = pointInPolygon(here, z.coords);
// //         }
// //         if (inside) {
// //           nextSet.add(z.id);
// //           if (!prevSet.has(z.id)) {
// //             io.to('authorities').emit('zone-alert', {
// //               touristId: socket.id,
// //               zoneName: z.name,
// //               risk: z.risk ?? 'low',
// //             });
// //           }
// //         }
// //       }
// //       insideZonesBySocket.set(socket.id, nextSet);

// //       // --- Boundary check ---
// //       let insideAnyBoundary = true;
// //       if (boundaries.size > 0) {
// //         insideAnyBoundary = false;
// //         for (const b of boundaries.values()) {
// //           let inside = false;
// //           if (b.type === 'circle' && b.center && b.radius) {
// //             inside = haversine(here, b.center) <= b.radius;
// //           } else if (b.type === 'polygon' && b.coords?.length) {
// //             inside = pointInPolygon(here, b.coords);
// //           }
// //           if (inside) {
// //             insideAnyBoundary = true;
// //             break;
// //           }
// //         }
// //       }

// //       const prevInside = boundaryInsideBySocket.get(socket.id);
// //       if (prevInside === undefined || (prevInside && !insideAnyBoundary)) {
// //         if (!insideAnyBoundary) {
// //           io.to('authorities').emit('outside-boundary-alert', {
// //             touristId: socket.id,
// //             boundaryName: 'Area',
// //           });
// //         }
// //       }
// //       boundaryInsideBySocket.set(socket.id, insideAnyBoundary);
// //     });

// //     // --- Zones ---
// //     socket.on('zone-update', (z) => {
// //       zones.set(z.id, z);
// //       io.emit('zone-update', z);
// //     });
// //     socket.on('zone-deleted', ({ id }) => {
// //       zones.delete(id);
// //       io.emit('zone-deleted', { id });
// //     });

// //     // --- Boundaries ---
// //     socket.on('boundary-update', (b) => {
// //       boundaries.set(b.id, b);
// //       io.emit('boundary-update', b);
// //     });
// //     socket.on('boundary-deleted', ({ id }) => {
// //       boundaries.delete(id);
// //       io.emit('boundary-deleted', { id });
// //     });

// //     // --- Heatmap updates ---
// //     socket.on('heatmap-update', (points) =>
// //       io.emit('heatmap-update', points)
// //     );

// //     // --- Tourist SOS ---
// //     socket.on('sos-create', (payload) => {
// //       console.log('🚨 sos-create payload:', payload);
// //       const id =
// //         payload.id ||
// //         `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
// //       const incident = {
// //         id,
// //         touristSocketId: socket.id,
// //         touristId: payload.touristId || null,
// //         touristName: payload.touristName || null,
// //         touristPhone: payload.touristPhone || null,
// //         location: payload.location || null,
// //         description: payload.description || null,
// //         media: payload.media || null,
// //         createdAt: Date.now(),
// //         status: 'new',
// //         officer: null,
// //       };
// //       incidents.set(incident.id, incident);
// //       io.to('authorities').emit('incident-new', incident);
// //       socket.emit('sos-received', { id: incident.id });
// //     });

// //     // --- Dashboard actions ---
// //     socket.on('incident-ack', ({ id, officer }) => {
// //       const inc = incidents.get(id);
// //       if (!inc) return;
// //       inc.status = 'acknowledged';
// //       inc.officer = officer;
// //       incidents.set(id, inc);
// //       io.to('authorities').emit('incident-updated', inc);
// //     });

// //     socket.on('incident-resolve', ({ id, notes }) => {
// //       const inc = incidents.get(id);
// //       if (!inc) return;
// //       inc.status = 'resolved';
// //       inc.notes = notes;
// //       incidents.set(id, inc);
// //       io.to('authorities').emit('incident-updated', inc);
// //     });

// //     // --- Sync incidents on reconnect ---
// //     socket.on('incident-sync', () => {
// //       const list = Array.from(incidents.values())
// //         .sort((a, b) => b.createdAt - a.createdAt)
// //         .slice(0, 100);
// //       socket.emit('incident-list', list);
// //     });

// //     // --- Disconnect cleanup ---
// //     socket.on('disconnect', () => {
// //       console.log('❌ client disconnected', socket.id);
// //       io.emit('user-disconnected', socket.id);
// //       insideZonesBySocket.delete(socket.id);
// //       boundaryInsideBySocket.delete(socket.id);
// //       socketTouristInfo.delete(socket.id);
// //     });
// //   });

// //   const shutdown = () =>
// //     server.close(async () => {
// //       await disconnectMongo();
// //       process.exit(0);
// //     });

// //   process.on('SIGINT', shutdown);
// //   process.on('SIGTERM', shutdown);
// // };

// // start();


import { env } from './config/env.js';
import { buildApp } from './app.js';
import { connectMongo, disconnectMongo } from './db/mongoose.js';
import { Server as SocketIOServer } from 'socket.io';

const start = async () => {
  await connectMongo();
  const app = buildApp();
  const server = app.listen(env.PORT, () =>
    console.log(`API listening on http://localhost:${env.PORT}`)
  );

  const io = new SocketIOServer(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
    transports: ['websocket', 'polling'],
  });

  type LatLng = { lat: number; lng: number };
  type Zone = { id: string; name: string; type: 'circle'|'polygon'; coords?: LatLng[]; radius?: number; risk?: string };
  type Boundary = { id: string; name: string; type: 'circle'|'polygon'; center?: LatLng; coords?: LatLng[]; radius?: number };
  type Incident = {
    id: string;
    touristSocketId: string;
    touristId?: string;
    touristName?: string;
    touristPhone?: string;
    location?: LatLng;
    description?: string;
    media?: { audio?: string; video?: string; photo?: string };
    createdAt: number;
    status: 'new' | 'acknowledged' | 'resolved';
    officer?: { id?: string; name?: string };
  };

  const zones = new Map<string, Zone>();
  const boundaries = new Map<string, Boundary>();
  const incidents = new Map<string, Incident>();
  const insideZonesBySocket = new Map<string, Set<string>>();
  const boundaryInsideBySocket = new Map<string, boolean>();

  const haversine = (a: LatLng, b: LatLng) => {
    const toRad = (x: number) => (x * Math.PI)/180;
    const R = 6371000;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const s = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
    return 2*R*Math.asin(Math.sqrt(s));
  };
const activeTourists = new Map(); // store last known tourist location

  const pointInPolygon = (pt: LatLng, poly: LatLng[]) => {
    let inside = false;
    for (let i=0,j=poly.length-1;i<poly.length;j=i++) {
      const xi = poly[i].lng, yi = poly[i].lat;
      const xj = poly[j].lng, yj = poly[j].lat;
      const intersect = yi>pt.lat !== yj>pt.lat && pt.lng<((xj-xi)*(pt.lat-yi))/(yj-yi)+xi;
      if(intersect) inside = !inside;
    }
    return inside;
  };

  io.on('connection', (socket) => {
    console.log('Client connected', socket.id);

    // Sync existing zones & boundaries
    for (const z of zones.values()) socket.emit('zone-update', z);
    for (const b of boundaries.values()) socket.emit('boundary-update', b);

    // --- 1) Tourist live data ---
    socket.on('live-tourist-data', (data: any) => {
      const { latitude, longitude, touristId, personalId, name, phone, email, nationality, destination, tripStart, tripEnd, status } = data;

      // Broadcast to authority/dashboard
      io.emit('receive-location', {
        socketId: socket.id,
        touristId,
        personalId,
        name,
        phone,
        email,
        nationality,
        destination,
        tripStart,
        tripEnd,
        status,
        latitude,
        longitude,
        timestamp: data.timestamp || Date.now(),
      });
activeTourists.set(socket.id, { 
  ...data, 
  socketId: socket.id, 
  timestamp: Date.now() 
});
socket.on("get-active-tourists", () => {
  socket.emit("active-tourist-list", Array.from(activeTourists.values()));
});

      // --- Geofence checks ---
      const here: LatLng = { lat: latitude, lng: longitude };
      const prevSet = insideZonesBySocket.get(socket.id) ?? new Set<string>();
      const nextSet = new Set<string>();

      for (const z of zones.values()) {
        let inside = false;
        if (z.type === 'circle' && z.coords && z.radius) {
          const center = z.coords[0] || z.coords;
          const centerLL = Array.isArray(center) ? { lat: center[0], lng: center[1] } : center as LatLng;
          inside = haversine(here, centerLL) <= (z.radius ?? 0);
        } else if (z.type === 'polygon' && z.coords?.length) {
          inside = pointInPolygon(here, z.coords);
        }
        if(inside){
          nextSet.add(z.id);
          if(!prevSet.has(z.id)){
            io.emit('zone-alert', { touristId, zoneName: z.name, risk: z.risk ?? 'low' });
          }
        }
      }
      insideZonesBySocket.set(socket.id, nextSet);

      // Boundaries
      let insideAnyBoundary = boundaries.size===0 ? true : false;
      if(boundaries.size>0){
        insideAnyBoundary=false;
        for(const b of boundaries.values()){
          let inside=false;
          if(b.type==='circle' && b.center && b.radius) inside=haversine(here,b.center)<=b.radius;
          else if(b.type==='polygon' && b.coords?.length) inside=pointInPolygon(here,b.coords);
          if(inside){ insideAnyBoundary=true; break; }
        }
      }
      const prevInside = boundaryInsideBySocket.get(socket.id);
      if(prevInside===undefined || (prevInside && !insideAnyBoundary)){
        if(!insideAnyBoundary) io.emit('outside-boundary-alert', { touristId, boundaryName: 'Area' });
      }
      boundaryInsideBySocket.set(socket.id, insideAnyBoundary);
    });

    // --- Authority zone/boundary management ---
    socket.on('zone-update', (z: Zone)=>{ zones.set(z.id,z); io.emit('zone-update',z); });
    socket.on('zone-deleted', ({id})=>{ zones.delete(id); io.emit('zone-deleted',{id}); });
    socket.on('boundary-update', (b: Boundary)=>{ boundaries.set(b.id,b); io.emit('boundary-update',b); });
    socket.on('boundary-deleted', ({id})=>{ boundaries.delete(id); io.emit('boundary-deleted',{id}); });

    // --- Heatmap ---
    socket.on('heatmap-update', (points:[number,number][])=> io.emit('heatmap-update', points));

    // --- Incidents/SOS ---
    socket.on('sos-create', (payload: Partial<Incident>) => {
      const id = payload.id || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
      const incident: Incident = {
        id,
        touristSocketId: socket.id,
        touristId: payload.touristId,
        touristName: payload.touristName,
        touristPhone: payload.touristPhone,
        location: payload.location,
        description: payload.description,
        media: payload.media,
        createdAt: Date.now(),
        status:'new',
      };
      incidents.set(incident.id, incident);
      io.emit('incident-new', incident);
      socket.emit('sos-received',{id:incident.id});
    });
socket.on('live-tourist-data', (data) => {
  console.log("🔥 Received from Tourist:", data);
});

    socket.on('incident-ack', ({id, officer}) => {
      const inc = incidents.get(id); if(!inc) return;
      inc.status='acknowledged'; inc.officer=officer; incidents.set(id,inc);
      io.emit('incident-updated',inc);
    });

    socket.on('incident-resolve', ({id,notes}) => {
      const inc = incidents.get(id); if(!inc) return;
      inc.status='resolved'; (inc as any).notes=notes; incidents.set(id,inc);
      io.emit('incident-updated',inc);
    });

    socket.on('disconnect', () => {
      io.emit('user-disconnected', socket.id);
      insideZonesBySocket.delete(socket.id);
      boundaryInsideBySocket.delete(socket.id);
      activeTourists.delete(socket.id);

    });
  });


  const shutdown = () => server.close(async ()=>{ await disconnectMongo(); process.exit(0); });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

 start();
// import { env } from './config/env.js';
// import { buildApp } from './app.js';
// import { connectMongo, disconnectMongo } from './db/mongoose.js';
// import { Server as SocketIOServer } from 'socket.io';

// const start = async () => {
//   await connectMongo();

//   const app = buildApp();
//   const server = app.listen(env.PORT, () =>
//     console.log(`API running on http://localhost:${env.PORT}`)
//   );

//   const io = new SocketIOServer(server, {
//     cors: { origin: '*', methods: ['GET', 'POST'] },
//     transports: ['websocket', 'polling'],
//   });

//   // ---- Types ----
//   type LatLng = { lat: number; lng: number };
//   type Zone = {
//     id: string;
//     name: string;
//     type: 'circle' | 'polygon';
//     coords?: LatLng[];
//     radius?: number;
//     risk?: string;
//   };
//   type Boundary = {
//     id: string;
//     name: string;
//     type: 'circle' | 'polygon';
//     center?: LatLng;
//     coords?: LatLng[];
//     radius?: number;
//   };
//   type Tourist = {
//     id: string;
//     name: string;
//     description: string;
//     email?: string;
//     phone?: string;
//     nationality?: string;
//   };
//   type Incident = {
//     id: string;
//     touristSocketId: string;
//     touristId?: string;
//     touristName?: string;
//     touristPhone?: string;
//     location?: LatLng;
//     description?: string;
//     media?: { audio?: string; video?: string; photo?: string };
//     createdAt: number;
//     status: 'new' | 'acknowledged' | 'resolved';
//     officer?: { id?: string; name?: string };
//   };

//   // ---- Demo tourists (no live location) ----
//   const demoTourists: Tourist[] = [
//     { id: 't1', name: 'Alice', description: 'Demo tourist 1', email: 'alice@example.com', phone: '1234567890', nationality: 'USA' },
//     { id: 't2', name: 'Bob', description: 'Demo tourist 2', email: 'bob@example.com', phone: '9876543210', nationality: 'UK' },
//     { id: 't3', name: 'Charlie', description: 'Demo tourist 3', email: 'charlie@example.com', phone: '5555555555', nationality: 'India' },
//   ];

//   const zones = new Map<string, Zone>();
//   const boundaries = new Map<string, Boundary>();
//   const incidents = new Map<string, Incident>();
//   const insideZonesBySocket = new Map<string, Set<string>>();
//   const boundaryInsideBySocket = new Map<string, boolean>();

//   // ---- Utility functions ----
//   const toRad = (x: number) => (x * Math.PI) / 180;
//   const haversine = (a: LatLng, b: LatLng) => {
//     const R = 6371000;
//     const dLat = toRad(b.lat - a.lat);
//     const dLng = toRad(b.lng - a.lng);
//     const lat1 = toRad(a.lat);
//     const lat2 = toRad(b.lat);
//     const s = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
//     return 2 * R * Math.asin(Math.sqrt(s));
//   };

//   const pointInPolygon = (pt: LatLng, poly: LatLng[]) => {
//     let inside = false;
//     for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
//       const xi = poly[i].lng,
//         yi = poly[i].lat;
//       const xj = poly[j].lng,
//         yj = poly[j].lat;
//       const intersect =
//         yi > pt.lat !== yj > pt.lat &&
//         pt.lng < ((xj - xi) * (pt.lat - yi)) / (yj - yi) + xi;
//       if (intersect) inside = !inside;
//     }
//     return inside;
//   };

//   // ---- Socket.IO Events ----
//   io.on('connection', (socket) => {
//     console.log('🟢 Client connected:', socket.id);

//     // Send demo tourists to dashboard
//     demoTourists.forEach((t) => {
//       socket.emit('demo-tourist', t);
//     });

//     // Send all existing zones/boundaries to new client
//     for (const z of zones.values()) socket.emit('zone-update', z);
//     for (const b of boundaries.values()) socket.emit('boundary-update', b);

//     // Handle live tourist data
//     socket.on('live-tourist-data', (data: any) => {
//       const {
//         latitude,
//         longitude,
//         touristId,
//         personalId,
//         name,
//         phone,
//         email,
//         nationality,
//         destination,
//         tripStart,
//         tripEnd,
//         status,
//       } = data;

//       // Broadcast to dashboard
//       io.emit('receive-location', {
//         socketId: socket.id,
//         touristId,
//         personalId,
//         name,
//         phone,
//         email,
//         nationality,
//         destination,
//         tripStart,
//         tripEnd,
//         status,
//         latitude,
//         longitude,
//         timestamp: data.timestamp || Date.now(),
//       });

//       // Geofencing logic
//       const here: LatLng = { lat: latitude, lng: longitude };
//       const prevSet = insideZonesBySocket.get(socket.id) ?? new Set<string>();
//       const nextSet = new Set<string>();

//       for (const z of zones.values()) {
//         let inside = false;
//         if (z.type === 'circle' && z.coords && z.radius) {
//           const center = z.coords[0] as LatLng;
//           inside = haversine(here, center) <= (z.radius ?? 0);
//         } else if (z.type === 'polygon' && z.coords?.length) {
//           inside = pointInPolygon(here, z.coords);
//         }

//         if (inside) {
//           nextSet.add(z.id);
//           if (!prevSet.has(z.id)) {
//             io.emit('zone-alert', {
//               touristId,
//               zoneName: z.name,
//               risk: z.risk ?? 'low',
//             });
//           }
//         }
//       }

//       insideZonesBySocket.set(socket.id, nextSet);

//       // Boundary detection
//       let insideAnyBoundary = boundaries.size === 0 ? true : false;
//       if (boundaries.size > 0) {
//         insideAnyBoundary = false;
//         for (const b of boundaries.values()) {
//           let inside = false;
//           if (b.type === 'circle' && b.center && b.radius)
//             inside = haversine(here, b.center) <= b.radius;
//           else if (b.type === 'polygon' && b.coords?.length)
//             inside = pointInPolygon(here, b.coords);
//           if (inside) {
//             insideAnyBoundary = true;
//             break;
//           }
//         }
//       }

//       const prevInside = boundaryInsideBySocket.get(socket.id);
//       if (prevInside === undefined || (prevInside && !insideAnyBoundary)) {
//         if (!insideAnyBoundary)
//           io.emit('outside-boundary-alert', {
//             touristId,
//             boundaryName: 'Area',
//           });
//       }
//       boundaryInsideBySocket.set(socket.id, insideAnyBoundary);
//     });

//     // Authority updates
//     socket.on('zone-update', (z: Zone) => {
//       zones.set(z.id, z);
//       io.emit('zone-update', z);
//     });
//     socket.on('zone-deleted', ({ id }) => {
//       zones.delete(id);
//       io.emit('zone-deleted', { id });
//     });
//     socket.on('boundary-update', (b: Boundary) => {
//       boundaries.set(b.id, b);
//       io.emit('boundary-update', b);
//     });
//     socket.on('boundary-deleted', ({ id }) => {
//       boundaries.delete(id);
//       io.emit('boundary-deleted', { id });
//     });

//     // Heatmap
//     socket.on('heatmap-update', (points: [number, number][]) =>
//       io.emit('heatmap-update', points)
//     );

//     // SOS / incidents
//     socket.on('sos-create', (payload: Partial<Incident>) => {
//       const id =
//         payload.id ||
//         `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
//       const incident: Incident = {
//         id,
//         touristSocketId: socket.id,
//         touristId: payload.touristId,
//         touristName: payload.touristName,
//         touristPhone: payload.touristPhone,
//         location: payload.location,
//         description: payload.description,
//         media: payload.media,
//         createdAt: Date.now(),
//         status: 'new',
//       };
//       incidents.set(incident.id, incident);
//       io.emit('incident-new', incident);
//       socket.emit('sos-received', { id: incident.id });
//     });

//     socket.on('incident-ack', ({ id, officer }) => {
//       const inc = incidents.get(id);
//       if (!inc) return;
//       inc.status = 'acknowledged';
//       inc.officer = officer;
//       incidents.set(id, inc);
//       io.emit('incident-updated', inc);
//     });

//     socket.on('incident-resolve', ({ id, notes }) => {
//       const inc = incidents.get(id);
//       if (!inc) return;
//       inc.status = 'resolved';
//       (inc as any).notes = notes;
//       incidents.set(id, inc);
//       io.emit('incident-updated', inc);
//     });

//     socket.on('disconnect', () => {
//       io.emit('user-disconnected', socket.id);
//       insideZonesBySocket.delete(socket.id);
//       boundaryInsideBySocket.delete(socket.id);
//     });
//   });

//   const shutdown = () =>
//     server.close(async () => {
//       await disconnectMongo();
//       process.exit(0);
//     });
//   process.on('SIGINT', shutdown);
//   process.on('SIGTERM', shutdown);
// };

// start();

