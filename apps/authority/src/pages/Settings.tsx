

// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Switch } from '@/components/ui/switch';
// import {
//   Settings as SettingsIcon,
//   User,
//   Bell,
//   Save,
//   Users,
//   FileText,
//   Eye,
//   Lock,
//   Smartphone,
//   Database
// } from 'lucide-react';

// const Settings = () => {
//   const [notifications, setNotifications] = useState({
//     sosAlerts: true,
//     zoneViolations: true,
//     emergencyProtocols: true,
//     systemUpdates: false,
//     weeklyReports: true
//   });

//   const [preferences, setPreferences] = useState({
//     language: 'english',
//     timezone: 'IST',
//     autoRefresh: true,
//     soundAlerts: true,
//     darkMode: false
//   });

//   const [systemUsers, setSystemUsers] = useState<any[]>([]);
//   const [auditLog, setAuditLog] = useState<any[]>([]);
//   const token = localStorage.getItem('token');

//   // Fetch data from backend
//   // useEffect(() => {
//   //   const fetchSettings = async () => {
//   //     try {
//   //       const [notifRes, prefRes, usersRes, auditRes] = await Promise.all([
//   //         fetch('/api/v1/settings/notifications', {
//   //           headers: { Authorization: `Bearer ${token}` }
//   //         }),
//   //         fetch('/api/v1/settings/preferences', {
//   //           headers: { Authorization: `Bearer ${token}` }
//   //         }),
//   //         fetch('/api/v1/users', {
//   //           headers: { Authorization: `Bearer ${token}` }
//   //         }),
//   //         fetch('/api/v1/audit-log', {
//   //           headers: { Authorization: `Bearer ${token}` }
//   //         })
//   //       ]);

//   //       if (!notifRes.ok || !prefRes.ok || !usersRes.ok || !auditRes.ok) throw new Error('Failed to fetch data');

//   //       setNotifications(await notifRes.json());
//   //       setPreferences(await prefRes.json());
//   //       setSystemUsers(await usersRes.json());
//   //       setAuditLog(await auditRes.json());
//   //     } catch (error) {
//   //       console.error('Error fetching settings:', error);
//   //     }
//   //   };

//   //   fetchSettings();
//   // }, []);
// useEffect(() => {
//   const fetchSettings = async () => {
//     try {
//       const [notifRes, prefRes, usersRes, auditRes] = await Promise.all([
//         fetch('/api/v1/settings/notifications', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         fetch('/api/v1/settings/preferences', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         fetch('/api/v1/users', {
//           headers: { Authorization: `Bearer ${token}` }
//         }),
//         fetch('/api/v1/audit-log', {
//           headers: { Authorization: `Bearer ${token}` }
//         })
//       ]);

//       const [notifData, prefData, usersData, auditData] = await Promise.all([
//         notifRes.json(),
//         prefRes.json(),
//         usersRes.json(),
//         auditRes.json()
//       ]);

//       if (!notifRes.ok || !prefRes.ok || !usersRes.ok || !auditRes.ok) {
//         throw new Error('Failed to fetch data');
//       }

//       // ✅ unwrap .data if exists
//       setNotifications(notifData.data || notifData);
//       setPreferences(prefData.data || prefData);
//       setSystemUsers(usersData.data || usersData);
//       setAuditLog(auditData.data || auditData);

//     } catch (error) {
//       console.error('Error fetching settings:', error);
//     }
//   };

//   fetchSettings();
// }, [token]);
//   const getRoleBadge = (role: string) => {
//     switch (role) {
//       case 'admin': return <Badge className="bg-emergency text-emergency-foreground">Admin</Badge>;
//       case 'supervisor': return <Badge className="bg-warning text-warning-foreground">Supervisor</Badge>;
//       case 'officer': return <Badge className="bg-info text-info-foreground">Officer</Badge>;
//       default: return <Badge variant="outline">{role}</Badge>;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'active': return <Badge className="bg-success text-success-foreground">Active</Badge>;
//       case 'inactive': return <Badge variant="outline">Inactive</Badge>;
//       default: return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   // const handleSaveSettings = async () => {
//   //   try {
//   //     const res = await fetch('/api/v1/settings/update', {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         Authorization: `Bearer ${token}`
//   //       },
//   //       body: JSON.stringify({ notifications, preferences })
//   //     });
//   //     const data = await res.json();
//   //     if (data.success) {
//   //       alert('Settings saved successfully');
//   //     } else {
//   //       alert('Failed to save settings: ' + data.message);
//   //     }
//   //   } catch (error) {
//   //     console.error('Error saving settings:', error);
//   //     alert('Error saving settings');
//   //   }
//   // };
// // const handleSaveSettings = async () => {
// //   try {
// //     const res = await fetch('http://localhost:3000/api/v1/settings', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         Authorization: `Bearer ${token}`
// //       },
// //       body: JSON.stringify({ data: { notifications, preferences } })
// //     });
// //     const data = await res.json();
// //     if (data.success) {
// //       alert('Settings saved successfully');
// //     } else {
// //       alert('Failed to save settings: ' + (data.message || 'Unknown error'));
// //     }
// //   } catch (error) {
// //     console.error('Error saving settings:', error);
// //     alert('Error saving settings');
// //   }
// // };
// const handleSaveSettings = async () => {
//   try {
//     const res = await fetch('http://localhost:3000/api/v1/settings', {
//       method: 'PUT',  // ✅ must be PUT
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       // backend expects plain object, not nested in "data"
//       body: JSON.stringify({
//         notifications,
//         preferences
//       })
//     });

//     const data = await res.json();
//     if (res.ok) {
//       alert('Settings saved successfully');
//     } else {
//       alert('Failed to save settings: ' + data.message);
//     }
//   } catch (error) {
//     console.error('Error saving settings:', error);
//     alert('Error saving settings');
//   }
// };
//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
//           <p className="text-muted-foreground">
//             Configure system preferences, user management, and audit trails
//           </p>
//         </div>
//         <Button onClick={handleSaveSettings} className="authority-gradient text-white">
//           <Save className="w-4 h-4 mr-2" />
//           Save All Changes
//         </Button>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-2">
//         {/* Notification Settings */}
//         <Card className="card-shadow">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Bell className="w-5 h-5" />
//               Notification Preferences
//             </CardTitle>
//             <CardDescription>
//               Configure alert preferences and notification channels
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {Object.keys(notifications).map((key: string) => (
//               <div key={key} className="flex items-center justify-between">
//                 <div>
//                   <p className="font-medium">{key.replace(/([A-Z])/g, ' $1')}</p>
//                   <p className="text-sm text-muted-foreground">Toggle {key}</p>
//                 </div>
//                 <Switch
//                   checked={notifications[key as keyof typeof notifications]}
//                   onCheckedChange={(checked) =>
//                     setNotifications({ ...notifications, [key]: checked })
//                   }
//                 />
//               </div>
//             ))}
//           </CardContent>
//         </Card>

//         {/* System Preferences */}
//         <Card className="card-shadow">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <SettingsIcon className="w-5 h-5" />
//               System Preferences
//             </CardTitle>
//             <CardDescription>
//               General system configuration and user interface settings
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <label className="text-sm font-medium mb-2 block">Language</label>
//               <select
//                 className="w-full p-2 border rounded-md"
//                 value={preferences.language}
//                 onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
//               >
//                 <option value="english">English</option>
//                 <option value="hindi">हिंदी (Hindi)</option>
//                 <option value="tamil">தமிழ் (Tamil)</option>
//                 <option value="telugu">తెలుగు (Telugu)</option>
//               </select>
//             </div>
//             <div>
//               <label className="text-sm font-medium mb-2 block">Timezone</label>
//               <select
//                 className="w-full p-2 border rounded-md"
//                 value={preferences.timezone}
//                 onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
//               >
//                 <option value="IST">IST (UTC+5:30)</option>
//                 <option value="UTC">UTC</option>
//                 <option value="EST">EST (UTC-5:00)</option>
//               </select>
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium">Auto-refresh Dashboard</p>
//                 <p className="text-sm text-muted-foreground">Real-time data updates</p>
//               </div>
//               <Switch
//                 checked={preferences.autoRefresh}
//                 onCheckedChange={(checked) => setPreferences({ ...preferences, autoRefresh: checked })}
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-medium">Sound Alerts</p>
//                 <p className="text-sm text-muted-foreground">Audio notifications for alerts</p>
//               </div>
//               <Switch
//                 checked={preferences.soundAlerts}
//                 onCheckedChange={(checked) => setPreferences({ ...preferences, soundAlerts: checked })}
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* User Management */}
//       <Card className="card-shadow">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle className="flex items-center gap-2">
//                 <Users className="w-5 h-5" />
//                 User Management
//               </CardTitle>
//               <CardDescription>
//                 Manage system users, roles, and permissions
//               </CardDescription>
//             </div>
//             <Button variant="outline">
//               <User className="w-4 h-4 mr-2" />
//               Add User
//             </Button>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {systemUsers.map((user) => (
//               <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 bg-primary-muted rounded-full flex items-center justify-center">
//                     <User className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2 mb-1">
//                       <p className="font-medium">{user.name}</p>
//                       {getRoleBadge(user.role)}
//                       {getStatusBadge(user.status)}
//                     </div>
//                     <p className="text-sm text-muted-foreground">{user.email}</p>
//                     <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm">
//                     <Eye className="w-3 h-3 mr-1" />
//                     View
//                   </Button>
//                   <Button variant="outline" size="sm">
//                     <Lock className="w-3 h-3 mr-1" />
//                     Permissions
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Audit Trail */}
//       <Card className="card-shadow">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <FileText className="w-5 h-5" />
//             Audit Trail
//           </CardTitle>
//           <CardDescription>
//             System activity log and user action tracking
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {auditLog.map((log) => (
//               <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1">
//                     <Badge variant="outline" className="text-xs">
//                       {log.category.replace('_', ' ')}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">{log.timestamp}</span>
//                   </div>
//                   <p className="text-sm font-medium">{log.action}</p>
//                   <p className="text-xs text-muted-foreground">by {log.user}</p>
//                 </div>
//                 <Button variant="ghost" size="sm">
//                   <Eye className="w-3 h-3" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Settings;


import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Save,
  Users,
  FileText,
  Eye,
  Lock
} from 'lucide-react';

const Settings = () => {
  const token = localStorage.getItem('token');

  const [notifications, setNotifications] = useState({
    sosAlerts: true,
    zoneViolations: true,
    emergencyProtocols: true,
    systemUpdates: false,
    weeklyReports: true
  });

  const [preferences, setPreferences] = useState({
    language: 'english',
    timezone: 'IST',
    autoRefresh: true,
    soundAlerts: true,
    darkMode: false
  });

  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<any[]>([]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/v1/settings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (!res.ok) throw new Error('Failed to fetch settings');

        setNotifications(data.notifications || notifications);
        setPreferences(data.preferences || preferences);
        setSystemUsers(Array.isArray(data.users) ? data.users : []);
        setAuditLog(Array.isArray(data.audit) ? data.audit : []);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, [token]);

  // const handleSaveSettings = async () => {
  //   try {
  //     const res = await fetch('/api/v1/settings', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({ notifications, preferences })
  //     });
  //     const data = await res.json();
  //     if (res.ok) {
  //       alert('Settings saved successfully');
  //     } else {
  //       alert('Failed to save settings: ' + (data.message || 'Unknown error'));
  //     }
  //   } catch (error) {
  //     console.error('Error saving settings:', error);
  //     alert('Error saving settings');
  //   }
  // };
  const handleSaveSettings = async () => {
  try {
    const res = await fetch('/api/v1/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notifications, preferences })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Save failed');

    alert('Settings saved successfully');

    // Refetch latest settings
    const updatedRes = await fetch('/api/v1/settings', { headers: { Authorization: `Bearer ${token}` } });
    const updatedData = await updatedRes.json();
    setNotifications(updatedData.notifications || notifications);
    setPreferences(updatedData.preferences || preferences);

  } catch (err) {
    console.error(err);
    alert('Error saving settings');
  }
};

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-emergency text-emergency-foreground">Admin</Badge>;
      case 'supervisor':
        return <Badge className="bg-warning text-warning-foreground">Supervisor</Badge>;
      case 'officer':
        return <Badge className="bg-info text-info-foreground">Officer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences, user management, and audit trails
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="authority-gradient text-white">
          <Save className="w-4 h-4 mr-2" />
          Save All Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Notification Settings */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Configure alert preferences and notification channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(notifications).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm text-muted-foreground">Toggle {key}</p>
                </div>
                <Switch
                  checked={!!notifications[key as keyof typeof notifications]}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, [key]: checked })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Preferences */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" />
              System Preferences
            </CardTitle>
            <CardDescription>
              General system configuration and user interface settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <select
                className="w-full p-2 border rounded-md"
                value={preferences.language || 'english'}
                onChange={(e) =>
                  setPreferences({ ...preferences, language: e.target.value })
                }
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी (Hindi)</option>
                <option value="tamil">தமிழ் (Tamil)</option>
                <option value="telugu">తెలుగు (Telugu)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Timezone</label>
              <select
                className="w-full p-2 border rounded-md"
                value={preferences.timezone || 'IST'}
                onChange={(e) =>
                  setPreferences({ ...preferences, timezone: e.target.value })
                }
              >
                <option value="IST">IST (UTC+5:30)</option>
                <option value="UTC">UTC</option>
                <option value="EST">EST (UTC-5:00)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto-refresh Dashboard</p>
                <p className="text-sm text-muted-foreground">Real-time data updates</p>
              </div>
              <Switch
                checked={!!preferences.autoRefresh}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, autoRefresh: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sound Alerts</p>
                <p className="text-sm text-muted-foreground">Audio notifications for alerts</p>
              </div>
              <Switch
                checked={!!preferences.soundAlerts}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, soundAlerts: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage system users, roles, and permissions
              </CardDescription>
            </div>
            <Button variant="outline">
              <User className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary-muted rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{user.name}</p>
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Last login: {user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Lock className="w-3 h-3 mr-1" />
                    Permissions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Audit Trail
          </CardTitle>
          <CardDescription>
            System activity log and user action tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLog.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {log.category?.replace('_', ' ') || 'General'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                  </div>
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">by {log.user}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;