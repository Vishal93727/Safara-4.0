


// import React, { useState } from "react";
// import { useAuthorityData } from "@/context/AuthorityDataContext";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import {
//   MapPin, Plus, Edit, Eye, Users, Shield, AlertTriangle, Clock, Trash2, Navigation, Search
// } from 'lucide-react';

// const Zones: React.FC = () => {
//   const { zones, liveAlerts, stats } = useAuthorityData();
//   const [selectedZone, setSelectedZone] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');

//   // Modals
//   const [showMapModal, setShowMapModal] = useState(false);
//   const [showCreateZoneModal, setShowCreateZoneModal] = useState(false);

//   const filteredZones = zones.filter(zone =>
//     zone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     zone.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     zone.type?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const selectedZoneData = zones.find(zone => zone.id === selectedZone);
//   const zoneResources = selectedZoneData?.resources || [];

//   // Utility functions
//   const getZoneTypeBadge = (type: string) => {
//     switch (type) {
//       case 'safe': return <Badge className="bg-success text-success-foreground">Safe Zone</Badge>;
//       case 'restricted': return <Badge className="bg-emergency text-emergency-foreground">Restricted</Badge>;
//       case 'monitored': return <Badge className="bg-info text-info-foreground">Monitored</Badge>;
//       case 'high-risk': return <Badge className="bg-warning text-warning-foreground">High Risk</Badge>;
//       default: return <Badge variant="outline">{type}</Badge>;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'active': return <Badge className="bg-success text-success-foreground">Active</Badge>;
//       case 'warning': return <Badge className="bg-warning text-warning-foreground alert-pulse">Warning</Badge>;
//       case 'inactive': return <Badge variant="outline">Inactive</Badge>;
//       default: return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getResourceStatusBadge = (status: string) => {
//     switch (status) {
//       case 'on-duty': return <Badge className="bg-success text-success-foreground">On Duty</Badge>;
//       case 'standby': return <Badge className="bg-warning text-warning-foreground">Standby</Badge>;
//       case 'off-duty': return <Badge variant="outline">Off Duty</Badge>;
//       default: return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const getOccupancyPercentage = (current: number, capacity: number) => Math.round((current / capacity) * 100);
//   const getOccupancyColor = (percentage: number) => percentage >= 90 ? 'bg-emergency' : percentage >= 70 ? 'bg-warning' : 'bg-success';

//   // Button actions
//   const handleViewMap = (zoneId?: string) => {
//     setShowMapModal(true);
//     console.log(`Viewing map for zone: ${zoneId || "all zones"}`);
//   };

//   const handleCreateZone = () => setShowCreateZoneModal(true);

//   const handleEditZone = (zoneId: string) => console.log(`Editing zone: ${zoneId}`);
//   const handleManageAccess = (zoneId: string) => console.log(`Manage access for zone: ${zoneId}`);
//   const handleDeleteZone = (zoneId: string) => {
//     if (window.confirm("Are you sure you want to delete this zone?")) {
//       console.log(`Deleting zone: ${zoneId}`);
//       // TODO: Call API to delete zone
//     }
//   };

//   return (
//     <div className="space-y-6">

//       {/* HEADER */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Zone & Resource Management</h1>
//           <p className="text-muted-foreground">Monitor restricted zones, safe areas, and deployed resources</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" onClick={() => handleViewMap()}>
//             <Navigation className="w-4 h-4 mr-2" />View Map
//           </Button>
//           <Button className="authority-gradient text-white" onClick={handleCreateZone}>
//             <Plus className="w-4 h-4 mr-2" />Create Zone
//           </Button>
//         </div>
//       </div>

//       {/* SEARCH & STATS */}
//       <div className="grid gap-4 lg:grid-cols-5">

//         {/* Live Alerts Panel */}
//         <Card className="card-shadow col-span-1 lg:col-span-1 overflow-y-auto max-h-48">
//           <CardHeader>
//             <CardTitle className="text-lg">Live Alerts</CardTitle>
//             <CardDescription>{liveAlerts.length} active</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             {liveAlerts.map(alert => (
//               <div key={alert.id} className="p-2 border rounded bg-muted text-sm">
//                 <p className="font-medium">{alert.message}</p>
//                 <p className="text-xs text-muted-foreground">{alert.time}</p>
//               </div>
//             ))}
//             {liveAlerts.length === 0 && <p className="text-xs text-muted-foreground text-center">No alerts</p>}
//           </CardContent>
//         </Card>

//         {/* Other stats & search */}
//         <Card className="card-shadow col-span-1 lg:col-span-1">
//           <CardContent className="pt-6 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//             <Input placeholder="Search zones..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
//           </CardContent>
//         </Card>

//         <Card className="card-shadow col-span-1 lg:col-span-1">
//           <CardContent className="pt-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Total Zones</p>
//               <p className="text-2xl font-bold">{zones.length}</p>
//             </div>
//             <MapPin className="h-8 w-8 text-muted-foreground" />
//           </CardContent>
//         </Card>

//         <Card className="card-shadow col-span-1 lg:col-span-1">
//           <CardContent className="pt-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Active Officers</p>
//               <p className="text-2xl font-bold">{stats.officersOnDuty}</p>
//             </div>
//             <Shield className="h-8 w-8 text-muted-foreground" />
//           </CardContent>
//         </Card>

//         <Card className="card-shadow col-span-1 lg:col-span-1">
//           <CardContent className="pt-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm font-medium text-muted-foreground">Occupancy Alerts</p>
//               <p className="text-2xl font-bold">{zones.filter(z => getOccupancyPercentage(z.currentOccupancy, z.capacity) >= 90).length}</p>
//             </div>
//             <AlertTriangle className="h-8 w-8 text-muted-foreground" />
//           </CardContent>
//         </Card>
//       </div>

//       {/* ZONES LIST & DETAILS */}
//       <div className="grid gap-6 lg:grid-cols-3">

//         {/* Zones List */}
//         <div className="lg:col-span-2 space-y-4">
//           {filteredZones.map(zone => {
//             const occupancy = getOccupancyPercentage(zone.currentOccupancy || 0, zone.capacity || 1);
//             return (
//               <Card key={zone.id} className={`card-shadow cursor-pointer hover:shadow-lg transition-all ${selectedZone === zone.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedZone(zone.id)}>
//                 <CardHeader className="flex justify-between">
//                   <CardTitle className="flex items-center gap-3">
//                     <code className="text-sm bg-muted px-2 py-1 rounded">{zone.id}</code>
//                     <span>{zone.name}</span>
//                     {getZoneTypeBadge(zone.type)}
//                   </CardTitle>
//                   <div className="flex items-center gap-2">{getStatusBadge(zone.status)}</div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
//                     <div>
//                       <p className="font-medium flex items-center gap-1"><MapPin className="w-4 h-4" /> Location</p>
//                       <p className="text-muted-foreground">{zone.coordinates || 'N/A'}</p>
//                       <p className="text-muted-foreground">Radius: {zone.radius || 'N/A'}</p>
//                     </div>
//                     <div>
//                       <p className="font-medium flex items-center gap-1"><Users className="w-4 h-4" /> Occupancy</p>
//                       <p className={`${getOccupancyColor(occupancy)} font-semibold`}>{zone.currentOccupancy}/{zone.capacity}</p>
//                       <p className="text-muted-foreground">{occupancy}% full</p>
//                     </div>
//                     <div>
//                       <p className="font-medium flex items-center gap-1"><Shield className="w-4 h-4" /> Security</p>
//                       <p className="text-muted-foreground">{zone.assignedOfficers || 0} officers</p>
//                       <p className="text-muted-foreground">{zone.incidents || 0} incidents</p>
//                     </div>
//                     <div>
//                       <p className="font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> Updated</p>
//                       <p className="text-muted-foreground">{zone.lastUpdated || 'N/A'}</p>
//                     </div>
//                   </div>
//                   <div className="mt-4 w-full bg-muted h-2 rounded-full">
//                     <div className={`h-2 rounded-full ${getOccupancyColor(occupancy)}`} style={{ width: `${occupancy}%` }} />
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Zone Details & Actions */}
//         <div className="space-y-6">
//           {selectedZoneData ? (
//             <>
//               <Card className="card-shadow">
//                 <CardHeader><CardTitle className="text-lg">Zone Management</CardTitle></CardHeader>
//                 <CardContent className="space-y-3">
//                   <Button className="w-full authority-gradient text-white" onClick={() => handleEditZone(selectedZoneData.id)}><Edit className="w-4 h-4 mr-2" />Edit Zone</Button>
//                   <Button variant="outline" className="w-full" onClick={() => handleViewMap(selectedZoneData.id)}><Navigation className="w-4 h-4 mr-2" />View on Map</Button>
//                   <Button variant="outline" className="w-full" onClick={() => handleManageAccess(selectedZoneData.id)}><Users className="w-4 h-4 mr-2" />Manage Access</Button>
//                   <Button variant="outline" className="w-full text-emergency border-emergency" onClick={() => handleDeleteZone(selectedZoneData.id)}><Trash2 className="w-4 h-4 mr-2" />Delete Zone</Button>
//                 </CardContent>
//               </Card>
//             </>
//           ) : (
//             <Card className="card-shadow">
//               <CardContent className="py-12 text-center">
//                 <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4"/>
//                 <h3 className="text-lg font-medium mb-2">Select a Zone</h3>
//                 <p className="text-muted-foreground">Click on a zone from the list to view details.</p>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>

//       {/* Placeholder Modals */}
//       {showMapModal && <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"><div className="bg-white p-6 rounded-lg">Map Modal (replace with your map component) <Button onClick={() => setShowMapModal(false)}>Close</Button></div></div>}
//       {showCreateZoneModal && <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"><div className="bg-white p-6 rounded-lg">Create Zone Form <Button onClick={() => setShowCreateZoneModal(false)}>Close</Button></div></div>}

//     </div>
//   );
// };

// export default Zones;





// src/pages/Zones.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useAuthorityData } from "@/context/AuthorityDataContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MapPin,
  Plus,
  Edit,
  Eye,
  Users,
  Shield,
  AlertTriangle,
  Clock,
  Trash2,
  Navigation,
  Search,
} from "lucide-react";

import { useNavigate } from "react-router-dom";


/**
 * Zone + Resource UI
 *
 * Assumptions (based on your context):
 * - useAuthorityData() returns { zones, liveAlerts, stats, socket }
 * - zone shape: { id, name, type, status, coordinates, radius, currentOccupancy, capacity, assignedOfficers, incidents, lastUpdated, resources }
 * - resource shape: { id, type, status, officers: string[], lastUpdatconst router = useRouter();e }
 *
 * Socket events used:
 * - socket.emit('zone-update', zonePayload)       -> create/update zone
 * - socket.emit('zone-deleted', { id })           -> delete zone
 * - socket.emit('resource-assign', payload)       -> assign resource
 * - socket.emit('resource-unassign', payload)     -> unassign resource
 * - socket.emit('zone-focus', { id })             -> ask map to focus/zoom to zone
 *
 * The provider will also broadcast zone updates to all clients which keeps global state consistent.
 */

type Zone = any;
type Resource = any;

const getOccupancyPercentage = (current = 0, capacity = 1) =>
  Math.round((current / Math.max(capacity, 1)) * 100);

const getOccupancyColor = (percentage: number) =>
  percentage >= 90 ? "bg-emergency" : percentage >= 70 ? "bg-warning" : "bg-success";

const Zones: React.FC = () => {
  const { zones: contextZones, liveAlerts, stats, tourists,socket } = useAuthorityData();




  const navigate = useNavigate(); // ✅ top level

  



  // local copy of zones for optimistic updates + local editing
  const [zones, setZones] = useState<Zone[]>(() =>
    Array.isArray(contextZones) ? contextZones : []
  );

  // search / selection state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  // create/edit modal state (simple inline form)
  const [isEditing, setIsEditing] = useState(false);
  const [formZone, setFormZone] = useState<Partial<Zone> | null>(null);

  // resource assign form
  const [assigningResourceTo, setAssigningResourceTo] = useState<string | null>(null);
  const [newResourceType, setNewResourceType] = useState("");
  const [newResourceOfficers, setNewResourceOfficers] = useState("");


const isInsideZone = (tourLat: number, tourLng: number, zone: any) => {
  const R = 6371; // Earth radius in km
  const dLat = ((tourLat - zone.lat) * Math.PI) / 180;
  const dLng = ((tourLng - zone.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(zone.lat * Math.PI / 180) *
    Math.cos(tourLat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // meters
  return distance <= (zone.radius || 0);
};

  // sync local zones when context changes
  useEffect(() => {
    // contextZones might be array or object depending on provider - handle both
    if (Array.isArray(contextZones)) setZones(contextZones);
    else if (contextZones && typeof contextZones === "object") {
      // object -> convert to array
      try {
        setZones(Object.values(contextZones));
      } catch {
        setZones([]);
      }
    } else {
      setZones([]);
    }
  }, [contextZones]);
const handleViewMap = () => {
    navigate(`/dashboard`);
  };

useEffect(() => {
  if (!Array.isArray(tourists)) return; // ✅ skip if not array

  const updatedZones = zones.map(zone => {
    const touristsInZone = tourists.filter(t =>
      t.latitude && t.longitude && isInsideZone(t.latitude, t.longitude, zone)
    );

    touristsInZone.forEach(t => {
      if (zone.type === "restricted" || zone.type === "high-risk") {
        setAlerts(prev => {
          const exists = prev.some(a => a.touristId === t.tid && a.zoneId === zone.id);
          if (exists) return prev;

          return [
            {
              id: crypto.randomUUID(),
              touristId: t.tid,
              touristName: t.pid_full_name,
              email: t.pid_email,
              mobile: t.pid_mobile,
              nationality: t.pid_nationality,
              latitude: t.latitude,
              longitude: t.longitude,
              zoneId: zone.id,
              zoneName: zone.name,
              zoneType: zone.type,
              timestamp: new Date().toISOString(),
            },
            ...prev
          ];
        });
      }
    });

    return {
      ...zone,
      currentOccupancy: touristsInZone.length,
      tourists: touristsInZone
    };
  });

  setZones(updatedZones);
}, [tourists]);




  // derived filtered list
  const filteredZones = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return zones;
    return zones.filter((z) =>
      String(z?.name || z?.id || z?.type || "")
        .toLowerCase()
        .includes(term)
    );
  }, [zones, searchTerm]);

  const selectedZone = useMemo(
    () => zones.find((z) => z.id === selectedZoneId) || null,
    [zones, selectedZoneId]
  );



  /* ---------- UI helpers ---------- */
  const getZoneTypeBadge = (type?: string) => {
    switch ((type || "").toLowerCase()) {
      case "safe":
        return <Badge className="bg-success text-success-foreground">Safe</Badge>;
      case "restricted":
        return <Badge className="bg-emergency text-emergency-foreground">Restricted</Badge>;
      case "monitored":
        return <Badge className="bg-info text-info-foreground">Monitored</Badge>;
      case "high-risk":
        return <Badge className="bg-warning text-warning-foreground">High Risk</Badge>;
      default:
        return <Badge variant="outline">{type || "—"}</Badge>;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  const getResourceStatusBadge = (status?: string) => {
    switch ((status || "").toLowerCase()) {
      case "on-duty":
        return <Badge className="bg-success text-success-foreground">On Duty</Badge>;
      case "standby":
        return <Badge className="bg-warning text-warning-foreground">Standby</Badge>;
      case "off-duty":
        return <Badge variant="outline">Off Duty</Badge>;
      default:
        return <Badge variant="outline">{status || "—"}</Badge>;
    }
  };

  /* ---------- socket helpers ---------- */
  const emitZoneUpdate = (payload: any) => {
    if (!socket) return;
    socket.emit("zone-update", payload);
  };

  const emitZoneDelete = (id: string) => {
    if (!socket) return;
    socket.emit("zone-deleted", { id });
  };

  const emitResourceAssign = (zoneId: string, resource: Resource) => {
    if (!socket) return;
    socket.emit("resource-assign", { zoneId, resource });
  };

  const emitResourceUnassign = (zoneId: string, resourceId: string) => {
    if (!socket) return;
    socket.emit("resource-unassign", { zoneId, resourceId });
  };

  const emitZoneFocus = (id: string) => {
    if (!socket) return;
    socket.emit("zone-focus", { id });
  };

  /* ---------- CRUD actions (local optimistic + emit) ---------- */
  const handleStartCreate = () => {
    setIsEditing(true);
    setFormZone({
      id: `zone-${Date.now()}`,
      name: "",
      type: "monitored",
      status: "active",
      coordinates: "",
      radius: 100,
      currentOccupancy: 0,
      capacity: 100,
      assignedOfficers: 0,
      incidents: 0,
      lastUpdated: new Date().toISOString(),
      resources: [],
    });
  };

  const handleStartEdit = (zone: Zone) => {
    setIsEditing(true);
    setFormZone({ ...zone }); // shallow copy
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormZone(null);
  };

  const handleSaveZone = () => {
    if (!formZone) return;
    const payload = {
      ...formZone,
      // ensure proper types
      currentOccupancy: Number(formZone.currentOccupancy ?? 0),
      capacity: Number(formZone.capacity ?? 1),
      radius: formZone.radius ? Number(formZone.radius) : undefined,
      lastUpdated: new Date().toISOString(),
    };

    // optimistic UI: update local zones immediately
    setZones((prev) => {
      const exists = prev.find((z) => z.id === payload.id);
      if (exists) {
        return prev.map((z) => (z.id === payload.id ? { ...z, ...payload } : z));
      } else {
        return [payload, ...prev];
      }
    });

    // emit to server
    emitZoneUpdate(payload);

    // close form
    setIsEditing(false);
    setFormZone(null);
    setSelectedZoneId(String(payload.id));
  };

  const handleDeleteZone = (id: string) => {
    if (!confirm("Delete zone? This will remove it for all users.")) return;

    // optimistic remove
    setZones((prev) => prev.filter((z) => z.id !== id));
    emitZoneDelete(id);

    if (selectedZoneId === id) setSelectedZoneId(null);
  };

  /* ---------- Resource management ---------- */
  const handleStartAssignResource = (zoneId: string) => {
    setAssigningResourceTo(zoneId);
    setNewResourceType("");
    setNewResourceOfficers("");
  };

  const handleAssignResource = () => {
    if (!assigningResourceTo) return;
    const newResource: Resource = {
      id: `res-${Date.now()}`,
      type: newResourceType || "Patrol",
      status: "on-duty",
      officers: newResourceOfficers
        ? newResourceOfficers.split(",").map((s) => s.trim())
        : [],
      lastUpdate: new Date().toISOString(),
    };

    // optimistic update
    setZones((prev) =>
      prev.map((z) =>
        z.id === assigningResourceTo
          ? { ...z, resources: [...(z.resources || []), newResource] }
          : z
      )
    );

    emitResourceAssign(assigningResourceTo, newResource);

    // clear form
    setAssigningResourceTo(null);
    setNewResourceType("");
    setNewResourceOfficers("");
  };

  const handleUnassignResource = (zoneId: string, resourceId: string) => {
    if (!confirm("Remove resource from zone?")) return;

    // optimistic
    setZones((prev) =>
      prev.map((z) =>
        z.id === zoneId ? { ...z, resources: (z.resources || []).filter((r: any) => r.id !== resourceId) } : z
      )
    );

    emitResourceUnassign(zoneId, resourceId);
  };

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Zone & Resource Management</h1>
          <p className="text-muted-foreground">
            Monitor restricted zones, safe areas, and deployed resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewMap}>
            <Navigation className="w-4 h-4 mr-2" /> View Map
          </Button>
          <Button className="authority-gradient text-white" onClick={handleStartCreate}>
            <Plus className="w-4 h-4 mr-2" /> Create Zone
          </Button>
        </div>
      </div>

      {/* Search & Summary */}
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="card-shadow">
          <CardContent className="pt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Zones</p>
              <p className="text-2xl font-bold">{zones.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Officers</p>
              <p className="text-2xl font-bold">{stats?.officersOnDuty ?? "—"}</p>
            </div>
            <Shield className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Live Alerts</p>
              <p className="text-2xl font-bold text-warning">{liveAlerts?.length ?? 0}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Main */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredZones.map((zone) => {
            const occupancy = getOccupancyPercentage(zone?.currentOccupancy || 0, zone?.capacity || 1);
            return (
              <Card
                key={zone.id}
                className={`card-shadow cursor-pointer hover:shadow-lg transition-all ${selectedZoneId === zone.id ? "ring-2 ring-primary" : ""
                  }`}
                onClick={() => setSelectedZoneId(zone.id)}
              >
                <CardHeader className="flex justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <code className="text-sm bg-muted px-2 py-1 rounded">{zone.id}</code>
                    <span>{zone.name}</span>
                    {getZoneTypeBadge(zone.type)}
                  </CardTitle>
                  <div className="flex items-center gap-2">{getStatusBadge(zone.status)}</div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="font-medium flex items-center gap-1"><MapPin className="w-4 h-4" /> Location</p>
                      <p className="text-muted-foreground">{zone.coordinates || "N/A"}</p>
                      <p className="text-muted-foreground">Radius: {zone.radius ?? "N/A"}</p>
                    </div>

                    <div>
                      <p className="font-medium flex items-center gap-1"><Users className="w-4 h-4" /> Occupancy</p>
                      <p className={`${getOccupancyColor(occupancy)} font-semibold`}>{zone.currentOccupancy ?? 0}/{zone.capacity ?? "—"}</p>
                      <p className="text-muted-foreground">{occupancy}% full</p>
                    </div>

                    <div>
                      <p className="font-medium flex items-center gap-1"><Shield className="w-4 h-4" /> Security</p>
                      <p className="text-muted-foreground">{zone.assignedOfficers ?? 0} officers</p>
                      <p className="text-muted-foreground">{zone.incidents ?? 0} incidents</p>
                    </div>

                    <div>
                      <p className="font-medium flex items-center gap-1"><Clock className="w-4 h-4" /> Updated</p>
                      <p className="text-muted-foreground">{zone.lastUpdated ? new Date(zone.lastUpdated).toLocaleString() : "N/A"}</p>
                    </div>
                  </div>

                  <div className="mt-4 w-full bg-muted h-2 rounded-full">
                    <div className={`h-2 rounded-full ${getOccupancyColor(occupancy)}`} style={{ width: `${occupancy}%` }} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Details / Actions */}{/* Details / Actions */}
<div className="space-y-6">
  {selectedZone ? (
    <>
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle className="text-lg">{selectedZone.name}</CardTitle>
              <CardDescription>{selectedZone.id} • {selectedZone.type}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => handleStartEdit(selectedZone)}><Edit className="w-4 h-4 mr-2"/> Edit</Button>
              <Button variant="outline" className="w-full" onClick={handleViewMap}>
                <Navigation className="w-4 h-4 mr-2" /> View on Map
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="text-sm">
            <p><strong>Coordinates:</strong> {selectedZone.coordinates || "N/A"}</p>

            {selectedZone.tourists?.length ? (
              selectedZone.tourists.map(t => (
                <div key={t.tid} className="border p-3 rounded mb-3">
                  <p className="font-medium">{t.pid_full_name}</p>
                  <p className="text-sm text-muted-foreground">{t.pid_email}</p>
                  <p className="text-sm">📍 {t.latitude}, {t.longitude}</p>
                  <p className="text-sm">📞 {t.mobile} | 🏳️ {t.nationality}</p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No tourists here.</p>
            )}

            <p><strong>Radius:</strong> {selectedZone.radius ?? "N/A"}</p>
            <p><strong>Occupancy:</strong> {selectedZone.currentOccupancy ?? 0}/{selectedZone.capacity ?? "—"}</p>
            <p><strong>Officers:</strong> {selectedZone.assignedOfficers ?? 0}</p>
            <p><strong>Incidents:</strong> {selectedZone.incidents ?? 0}</p>
            <p><strong>Last Updated:</strong> {selectedZone.lastUpdated ? new Date(selectedZone.lastUpdated).toLocaleString() : "N/A"}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleStartAssignResource(selectedZone.id)}><Plus className="w-4 h-4 mr-2" />Assign Resource</Button>
            <Button variant="destructive" onClick={() => handleDeleteZone(selectedZone.id)}><Trash2 className="w-4 h-4 mr-2" />Delete Zone</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Assigned resources */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Assigned Resources</CardTitle>
          <CardDescription>Officers & units deployed to {selectedZone.name}</CardDescription>
        </CardHeader>
        <CardContent>
          {Array.isArray(selectedZone.resources) && selectedZone.resources.length > 0 ? (
            <div className="space-y-3">
              {selectedZone.resources.map((r: Resource) => (
                <div key={r.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.type}</div>
                    <div className="text-sm text-muted-foreground">{(r.officers || []).join(", ") || "No officers assigned"}</div>
                    <div className="text-xs text-muted-foreground">Updated: {r.lastUpdate ? new Date(r.lastUpdate).toLocaleString() : "N/A"}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getResourceStatusBadge(r.status)}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => {/* future: view resource detail */}}><Eye className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleUnassignResource(selectedZone.id, r.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Shield className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No resources assigned</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  ) : (
    <Card className="card-shadow">
      <CardContent className="py-12 text-center">
        <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Select a Zone</h3>
        <p className="text-muted-foreground">Click on a zone from the list to view details.</p>
      </CardContent>
    </Card>
  )}



          {/* Create / Edit form */}
          {isEditing && formZone && (
            <Card className="card-shadow">
              <CardHeader><CardTitle>{zones.find(z => z.id === formZone.id) ? "Edit Zone" : "Create Zone"}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-2">
                  <label className="text-sm">Name</label>
                  <Input value={formZone.name || ""} onChange={(e) => setFormZone(prev => ({ ...(prev || {}), name: e.target.value }))} />

<label className="text-sm">Type</label>
                  <Input value={formZone.type || ""} onChange={(e) => setFormZone(prev => ({ ...(prev || {}), type: e.target.value }))} />

                  <label className="text-sm">Coordinates (lat,lng)</label>
                  <Input value={formZone.coordinates || ""} onChange={(e) => setFormZone(prev => ({ ...(prev || {}), coordinates: e.target.value }))} />

                  <label className="text-sm">Radius (meters)</label>
                  <Input type="number" value={formZone.radius ?? 0} onChange={(e) => setFormZone(prev => ({ ...(prev || {}), radius: Number(e.target.value) }))} />

                  <label className="text-sm">Capacity</label>
                  <Input type="number" value={formZone.capacity ?? 0} onChange={(e) => setFormZone(prev => ({ ...(prev || {}), capacity: Number(e.target.value) }))} />

                  <div className="flex gap-2">
                    <Button className="authority-gradient text-white" onClick={handleSaveZone}><SaveIcon /> Save</Button>
                    <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
                  
                  
                  {/* Assign Resource form (simple) */}
          {assigningResourceTo && (
            <Card className="card-shadow">
              <CardHeader><CardTitle>Assign Resource to {zones.find(z => z.id === assigningResourceTo)?.name}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <label className="text-sm">Resource Type</label>
                <Input value={newResourceType} onChange={(e) => setNewResourceType(e.target.value)} placeholder="e.g. Patrol Car" />

                <label className="text-sm">Officers (comma separated)</label>
                <Input value={newResourceOfficers} onChange={(e) => setNewResourceOfficers(e.target.value)} placeholder="Officer A, Officer B" />

                <div className="flex gap-2">
                  <Button className="authority-gradient text-white" onClick={handleAssignResource}><Plus className="w-4 h-4 mr-2" />Assign</Button>
                  <Button variant="outline" onClick={() => setAssigningResourceTo(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

/* tiny Save icon as inline component to avoid extra imports */
function SaveIcon() {
  return (
    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default Zones;
