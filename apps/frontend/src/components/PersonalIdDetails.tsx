// // src/components/PersonalIdDetails.tsx
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { CheckCircle, Copy, ArrowLeft, QrCode } from 'lucide-react';
// import { getSession, getUserItem } from '@/lib/session';

// export default function PersonalIdDetails({ onBack, onShowQr }: { onBack: () => void; onShowQr: () => void; }) {
//   const s = getSession();
//   const personalId = getUserItem('pid_personal_id', s);
//   const fullName = getUserItem('pid_full_name', s);
//   const mobile = getUserItem('pid_mobile', s);
//   const email = getUserItem('pid_email', s);

//   const copy = async (v?: string | null) => v && navigator.clipboard.writeText(v).catch(() => {});

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="bg-card border-b p-4 flex items-center gap-3">
//         <Button size="icon" variant="ghost" onClick={onBack}>
//           <ArrowLeft className="w-5 h-5" />
//         </Button>
//         <h1 className="text-xl font-bold">Personal ID</h1>
//       </div>

//       <div className="p-4">
//         <Card className="p-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold">Digital Personal ID</h2>
//             <Badge variant="secondary" className="gap-1">
//               <CheckCircle className="w-4 h-4 text-green-600" />
//               Verified
//             </Badge>
//           </div>

//           <div className="mt-4 grid gap-3">
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-muted-foreground">Personal ID</div>
//               <div className="flex items-center gap-2">
//                 <code className="text-sm">{personalId || '—'}</code>
//                 <Button variant="ghost" size="icon" onClick={() => copy(personalId)} title="Copy ID">
//                   <Copy className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-muted-foreground">Name</div>
//               <div className="text-sm">{fullName || '—'}</div>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-muted-foreground">Mobile</div>
//               <div className="text-sm">{mobile || '—'}</div>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="text-sm text-muted-foreground">Email</div>
//               <div className="text-sm">{email || '—'}</div>
//             </div>
//           </div>

//           <div className="mt-6 flex gap-2">
//             <Button variant="outline" onClick={onShowQr}>
//               <QrCode className="w-4 h-4 mr-2" /> Show QR
//             </Button>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }



// src/components/PersonalIdDetails.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Copy, ArrowLeft, QrCode } from "lucide-react";
import { getSession, getUserItem } from "@/lib/session";
import { useUserData } from "@/context/UserDataContext";
import { useEffect, useState } from "react";

export default function PersonalIdDetails({
  onBack,
  onShowQr,
}: {
  onBack: () => void;
  onShowQr: () => void;
}) {
  const { personal } = useUserData(); // ✅ Fetch from global context
  const s = getSession();

  // ✅ Fallback to session storage (for older or refreshed sessions)
  const [personalId, setPersonalId] = useState<string | null>(getUserItem("pid_application_id", s));
  const [fullName, setFullName] = useState<string | null>(getUserItem("pid_full_name", s));
  const [mobile, setMobile] = useState<string | null>(getUserItem("pid_mobile", s));
  const [email, setEmail] = useState<string | null>(getUserItem("pid_email", s));

  // ✅ Auto-sync with global context if updated later
  useEffect(() => {
    if (personal) {
      setPersonalId(personal.pid_personal_id || personal.pid_application_id || personal.id || null);
      setFullName(personal.pid_full_name || personal.fullName || null);
      setMobile(personal.pid_mobile || personal.mobile || null);
      setEmail(personal.pid_email || personal.email || null);
    }
  }, [personal]);

  const copy = async (v?: string | null) => {
    if (!v) return;
    try {
      await navigator.clipboard.writeText(v);
    } catch {
      console.warn("Clipboard copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b p-4 flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Personal ID</h1>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Digital Personal ID</h2>
            <Badge variant="secondary" className="gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Verified
            </Badge>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Personal ID</div>
              <div className="flex items-center gap-2">
                <code className="text-sm">{personalId || "—"}</code>
                <Button variant="ghost" size="icon" onClick={() => copy(personalId)} title="Copy ID">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="text-sm">{fullName || "—"}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Mobile</div>
              <div className="text-sm">{mobile || "—"}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="text-sm">{email || "—"}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" onClick={onShowQr}>
              <QrCode className="w-4 h-4 mr-2" /> Show QR
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}