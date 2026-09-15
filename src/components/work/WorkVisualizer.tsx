'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  ShieldCheck, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Database, 
  Server, 
  Cpu, 
  ArrowRight,
  Clock,
  QrCode,
  DollarSign,
  TrendingUp,
  FileText
} from 'lucide-react';
import { WorkProject } from '@/config/work';

interface WorkVisualizerProps {
  project: WorkProject;
}

export function WorkVisualizer({ project }: WorkVisualizerProps) {
  switch (project.visualizerType) {
    case 'healthcare':
      return <HealthcareVisualizer project={project} />;
    case 'education':
      return <EducationVisualizer project={project} />;
    case 'retail':
      return <RetailVisualizer project={project} />;
    case 'hospitality':
      return <HospitalityVisualizer project={project} />;
    case 'fintech':
      return <FintechVisualizer project={project} />;
    default:
      return null;
  }
}

// ----------------------------------------------------------------------
// 1. HEALTHCARE VISUALIZER: Clinical Bed Grid & HL7/FHIR Packet Telemetry
// ----------------------------------------------------------------------
function HealthcareVisualizer({ project }: { project: WorkProject }) {
  const [selectedWard, setSelectedWard] = useState<'icu' | 'general' | 'emergency'>('icu');
  const [activeBedId, setActiveBedId] = useState<number>(102);
  const [packetTick, setPacketTick] = useState<number>(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPacketTick((prev) => (prev % 4) + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const beds = [
    { id: 101, label: 'BED ICU-01', patient: 'R. Sharma (Age 54)', status: 'Occupied', vitals: 'HR: 76 bpm | SpO2: 98% | BP: 120/80', doc: 'Dr. A. Verma (Cardiology)' },
    { id: 102, label: 'BED ICU-02', patient: 'P. Nair (Age 42)', status: 'Occupied', vitals: 'HR: 88 bpm | SpO2: 96% | BP: 135/85', doc: 'Dr. M. Roy (Pulmonology)' },
    { id: 103, label: 'BED ICU-03', patient: 'None', status: 'Cleaning', vitals: 'Sanitization in progress // Est 8m', doc: 'Housekeeping Unit 4' },
    { id: 104, label: 'BED ICU-04', patient: 'None', status: 'Available', vitals: 'Bed Prepared // Ready for Ingress', doc: 'Unassigned' },
  ];

  const activeBed = beds.find((b) => b.id === activeBedId) || beds[0];

  return (
    <div className="rounded-3xl bg-[#0f1014] border border-white/15 p-6 sm:p-10 shadow-2xl font-mono relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>CLINICAL TELEMETRY BLUEPRINT // HEALTHOS WARD GRID</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            Real-Time Bed Grid &amp; HL7/FHIR Specimen Telemetry
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setSelectedWard('icu')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedWard === 'icu' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            ICU / CCU WARD
          </button>
          <button
            onClick={() => setSelectedWard('general')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedWard === 'general' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            GENERAL WARD
          </button>
          <button
            onClick={() => setSelectedWard('emergency')}
            className={`px-3 py-1.5 rounded-lg transition-all ${selectedWard === 'emergency' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            TRIAGE / ER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Bed Matrix Interactive Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>LIVE WARD OCCUPANCY MATRIX (CLICK BED TO INSPECT)</span>
            <span className="text-emerald-400 font-bold">2/4 BEDS IN USE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {beds.map((bed) => {
              const isSelected = bed.id === activeBedId;
              const isOccupied = bed.status === 'Occupied';
              const isCleaning = bed.status === 'Cleaning';

              return (
                <div
                  key={bed.id}
                  onClick={() => setActiveBedId(bed.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                      : 'bg-black/50 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2 font-bold">
                    <span className={isSelected ? 'text-emerald-400' : 'text-slate-400'}>{bed.label}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                      isOccupied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      isCleaning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-slate-700/40 text-slate-300 border border-slate-600'
                    }`}>
                      {bed.status}
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white font-sans truncate mb-1">
                    {bed.patient}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {bed.vitals}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Bed Detailed Cockpit */}
          <div className="p-4 rounded-2xl bg-black/70 border border-white/10 text-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-white/10 pb-2">
              <span>ACTIVE ENCOUNTER: {activeBed.label}</span>
              <span className="text-slate-400 text-[10px]">EHR RECORD #EHR-9842</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-slate-500">ATTENDING CLINICIAN:</span> <span className="text-white font-bold">{activeBed.doc}</span></div>
              <div><span className="text-slate-500">TRIAGE TIMELINESS:</span> <span className="text-emerald-400 font-bold">Under 3.2 Min</span></div>
              <div><span className="text-slate-500">PHARMACY STATUS:</span> <span className="text-cyan-400 font-bold">Prescription Dispatched</span></div>
              <div><span className="text-slate-500">LAB RESULTS:</span> <span className="text-purple-400 font-bold">Automated HL7 Sync</span></div>
            </div>
          </div>
        </div>

        {/* Right: Asynchronous HL7/FHIR Packet Stream */}
        <div className="lg:col-span-5 bg-black/90 border border-white/10 rounded-2xl p-4 text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-slate-400">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                <Terminal className="w-3.5 h-3.5" />
                <span>HL7-FHIR-INGRESS.LOG</span>
              </div>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                STREAM ACTIVE
              </span>
            </div>

            <pre className="text-[11px] text-slate-300 overflow-x-auto leading-relaxed p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              {packetTick === 1 && `[HL7-V2] MSH|^~\\&|PATH_ANALYZER_01|LAB|HEALTHOS|EMR|202609142104||ORU^R01|MSG9842|P|2.5
PID|||PAT-102^^^HEALTHOS||NAIR^P||19840212|M
OBX|1|NM|GLU^Blood Glucose||108|mg/dL|70-110|N|||F
STATUS: Calibrated Pathology Ingested -> Doctor Push OK`}

              {packetTick === 2 && `[WEBSOCKET] Channel: /ward/icu/bed-102/telemetry
Event: DOCTOR_PRESCRIPTION_COMMIT
Payload: {
  "encounterId": "ENC-9941",
  "rx": ["Amoxicillin 500mg (FEFO Batch #8412)", "Paracetamol IV"],
  "pharmacyLedgerSync": "ACK_RECEIVED_740ms"
}`}

              {packetTick === 3 && `[FHIR-R4] Resource: MedicationRequest
{
  "resourceType": "MedicationRequest",
  "status": "completed",
  "intent": "order",
  "medicationCodeableConcept": { "coding": [{ "code": "ICD-10-J06" }] },
  "dispenseRequest": { "expectedSupplyDuration": { "value": 5, "unit": "days" } }
}`}

              {packetTick === 4 && `[AUDIT-LOG] Cryptographic Append Block #48102
Hash: 9f8a3c82e...d120a (SHA-256)
Author: Dr. M. Roy [Clinician ID #784]
Action: VITALS_SIGN_AND_DISCHARGE_ORDER
ACID Lock Released: 12ms`}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Latency Target: <span className="text-emerald-400 font-bold">&lt;800ms</span></span>
            <span>Compliance: <span className="text-white font-bold">NABH / HIPAA Ready</span></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. EDUCATION VISUALIZER: Multi-Campus Hierarchy & Fee Webhook Engine
// ----------------------------------------------------------------------
function EducationVisualizer({ project }: { project: WorkProject }) {
  const [activeCampus, setActiveCampus] = useState<'main' | 'north' | 'polytechnic'>('main');
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'processing' | 'settled'>('settled');

  const triggerSimulatedWebhook = () => {
    setWebhookStatus('processing');
    setTimeout(() => {
      setWebhookStatus('settled');
    }, 1200);
  };

  const campuses = {
    main: { name: 'Main University Campus', students: '12,450', feesCollected: '₹4.82 Cr', examSync: 'Edge Cached (100%)', status: 'Optimal' },
    north: { name: 'North Institute of Technology', students: '4,200', feesCollected: '₹1.64 Cr', examSync: 'Edge Cached (100%)', status: 'Optimal' },
    polytechnic: { name: 'Vocational & Polytechnic Wing', students: '2,800', feesCollected: '₹88.5 L', examSync: 'Edge Cached (100%)', status: 'Optimal' },
  };

  const curr = campuses[activeCampus];

  return (
    <div className="rounded-3xl bg-[#0f1014] border border-white/15 p-6 sm:p-10 shadow-2xl font-mono relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>DISTRIBUTED ACADEMIC MATRIX // MULTI-TENANT CAMPUS CORE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            Multi-Campus Hierarchy &amp; Idempotent Fee Webhook Engine
          </h3>
        </div>

        <button
          onClick={triggerSimulatedWebhook}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${webhookStatus === 'processing' ? 'animate-spin' : ''}`} />
          <span>SIMULATE BANK WEBHOOK</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Campus Selector and Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs text-slate-400">SELECT CAMPUS NODE FOR DEEP TELEMETRY</div>
          
          <div className="space-y-2.5">
            {(['main', 'north', 'polytechnic'] as const).map((key) => {
              const c = campuses[key];
              const isSelected = activeCampus === key;
              return (
                <div
                  key={key}
                  onClick={() => setActiveCampus(key)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-lg shadow-cyan-500/10'
                      : 'bg-black/50 border-white/10 hover:border-white/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className={isSelected ? 'text-cyan-400' : 'text-slate-400'}>{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400">
                      {c.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mt-2 pt-2 border-t border-white/5">
                    <span>Active Enrolled: <strong className="text-white">{c.students}</strong></span>
                    <span>Fee Ingress: <strong className="text-cyan-300">{c.feesCollected}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Idempotent Webhook Trace & Grade Compile Rail */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-black/80 border border-white/10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-4 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <DollarSign className="w-4 h-4" />
                <span>PAYMENT WEBHOOK EVENT BUS</span>
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                webhookStatus === 'processing' ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {webhookStatus === 'processing' ? 'PROCESSING SIGNATURE...' : 'LEDGER SETTLED (0.8s)'}
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">IDEMPOTENT KEY:</span> <span className="text-white font-mono">wh_pay_9981240182</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">ACTION:</span> <span className="text-cyan-300">Auto-credit semester tuition &amp; generate digital receipt QR</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400">EXAM ADMIT CARD:</span> <span className="text-emerald-400 font-bold">UNLOCKED IMMEDIATELY</span>
                </div>
              </div>
            </div>
          </div>

          {/* High-Throughput Exam CDN Stats */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs">
            <div className="flex items-center justify-between font-bold text-cyan-400 mb-2">
              <span>EXAMINATION CDN CACHE STATUS</span>
              <span>15,000 CONCURRENT PEAK</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Static marksheet PDFs compiled in <span className="text-emerald-400 font-bold">&lt; 2.4s</span> across all collegiate nodes with zero origin server strain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. RETAIL POS VISUALIZER: Offline-First SQLite Edge & WebSocket Depot Sync
// ----------------------------------------------------------------------
function RetailVisualizer({ project }: { project: WorkProject }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [lastScannedSku, setLastScannedSku] = useState<string>('SKU-88219 (Organic Arabica Coffee 500g)');
  const [scanLatency, setScanLatency] = useState<string>('8.4 ms (Local SQLite)');

  const handleScanItem = () => {
    const skus = [
      'SKU-99014 (Wireless Barcode Gun)',
      'SKU-44102 (Thermal Receipt Paper 80mm Roll)',
      'SKU-11293 (Whole Bean Colombian Espresso 1kg)',
      'SKU-88219 (Organic Arabica Coffee 500g)'
    ];
    const chosen = skus[Math.floor(Math.random() * skus.length)];
    setLastScannedSku(chosen);
    setScanLatency(`${(Math.random() * 4 + 7).toFixed(1)} ms (Local SQLite)`);

    if (!isOnline) {
      setOfflineQueueCount((prev) => prev + 1);
    }
  };

  const toggleNetwork = () => {
    if (!isOnline) {
      // Reconnecting
      setIsOnline(true);
      setTimeout(() => {
        setOfflineQueueCount(0);
      }, 900);
    } else {
      setIsOnline(false);
    }
  };

  return (
    <div className="rounded-3xl bg-[#0f1014] border border-white/15 p-6 sm:p-10 shadow-2xl font-mono relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
            <Database className="w-4 h-4 text-blue-400" />
            <span>OFFLINE-FIRST RETAIL RUNTIME // LOCAL SQLITE &amp; WEBSOCKET SPOOL</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            Edge Terminal Checkout &amp; Asynchronous Depot Sync
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleNetwork}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold uppercase transition-all ${
              isOnline ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? 'NETWORK: ONLINE' : 'NETWORK: OFFLINE (FAIL-SAFE)'}</span>
          </button>

          <button
            onClick={handleScanItem}
            className="px-4 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-bold text-xs uppercase tracking-wider transition-all"
          >
            TEST SCAN SKU
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Terminal Counter Cockpit */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-black/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-white/10">
            <span>TERMINAL #POS-04 (STORE OUTLET)</span>
            <span className="text-blue-400">ESC/POS THERMAL SPOOLER READY</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">LAST BARCODE LOOKUP:</span>
              <span className="text-white font-bold">{lastScannedSku}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">EDGE LOOKUP LATENCY:</span>
              <span className="text-emerald-400 font-bold">{scanLatency}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">GST TAX CALCULATION:</span>
              <span className="text-slate-200">CGST 9% + SGST 9% (Instant HSN Match)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
            <span>OFFLINE TRANSACTIONS SPOOLED:</span>
            <span className={`font-black font-mono text-sm ${offlineQueueCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {offlineQueueCount} Transactions
            </span>
          </div>
        </div>

        {/* Depot Sync Hub */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-blue-950/10 border border-blue-500/20 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-blue-400 pb-2 border-b border-blue-500/20">
            <span>REGIONAL WAREHOUSE DEPOT HUB</span>
            <span>POSTGRESQL CLUSTER</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>Depot Central Stock: <strong className="text-white">4,850 Units</strong> across 12 outlets</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>WebSocket Synchronization Daemon: <strong className="text-emerald-400">{isOnline ? 'STREAMING ACTIVE' : 'AWAITING RECONNECTION'}</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <span>Cryptographic Batch Signature: <strong className="text-white">SHA-256 Validated</strong></span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/60 border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            {isOnline
              ? '✓ System is streaming sales payloads directly to central depot. Warehouse reorder triggers are current.'
              : '⚠ Network disconnected! Local SQLite terminal is actively storing encrypted sales. Zero checkout delay.'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. HOSPITALITY VISUALIZER: Kitchen Display System (KDS) & Room Matrix
// ----------------------------------------------------------------------
function HospitalityVisualizer({ project }: { project: WorkProject }) {
  const [activeTab, setActiveTab] = useState<'kds' | 'rooms'>('kds');

  const kdsTickets = [
    { table: 'Table 08 (Poolside)', kot: '#KOT-402', timer: '04:12', course: 'Mains', items: ['1x Grilled Salmon', '2x Truffle Pasta', '1x Sparkling Water'], status: 'Cooking' },
    { table: 'Room 304 (In-Room Dining)', kot: '#KOT-403', timer: '01:45', course: 'Appetizers', items: ['1x Burrata Salad', '1x Garlic Focaccia'], status: 'Plated - Ready' },
    { table: 'Table 14 (Terrace)', kot: '#KOT-404', timer: '08:30', course: 'Desserts', items: ['2x Molten Chocolate Lava', '2x Espresso'], status: 'Cooking' },
  ];

  const rooms = [
    { room: '101 - Deluxe Ocean', status: 'Occupied', guest: 'M. Vance', rate: '₹14,500/night', housekeeping: 'Inspected' },
    { room: '102 - Premium Villa', status: 'Available', guest: 'None', rate: '₹22,000/night', housekeeping: 'Ready for Check-In' },
    { room: '201 - Executive Suite', status: 'Occupied', guest: 'D. Kapoor', rate: '₹18,000/night', housekeeping: 'DND Flag' },
    { room: '202 - Royal Penthouse', status: 'Cleaning', guest: 'Departed (Checkout 11:00)', rate: '₹35,000/night', housekeeping: 'Sanitizing' },
  ];

  return (
    <div className="rounded-3xl bg-[#0f1014] border border-white/15 p-6 sm:p-10 shadow-2xl font-mono relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>PROPERTYOS ARCHITECTURE // KITCHEN DISPLAY &amp; ROOM FOLIO MATRIX</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            Touch-Optimized KDS &amp; Multi-Channel OTA Sync
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('kds')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'kds' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            KITCHEN DISPLAY (KDS)
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === 'rooms' ? 'bg-amber-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            FRONT-DESK ROOM GRID
          </button>
        </div>
      </div>

      {activeTab === 'kds' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>LIVE KITCHEN ORDER TICKETS (SUB-150MS WEBSOCKET PUSH)</span>
            <span className="text-amber-400 font-bold">AVG COOK TIME: 11.2 MIN</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kdsTickets.map((t, idx) => {
              const isReady = t.status.includes('Ready');
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    isReady ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-black/60 border-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-2">
                      <span className="text-white">{t.table}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        isReady ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 mb-3 flex items-center justify-between">
                      <span>{t.kot} // {t.course}</span>
                      <span className="text-white font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {t.timer}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-200">
                      {t.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 text-[10px] text-slate-400 text-right">
                    Folio Auto-Routed: <span className="text-emerald-400">Yes</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
            <span>RESORT ROOM AVAILABILITY &amp; HOUSEKEEPING DISPATCH</span>
            <span className="text-emerald-400 font-bold">2-WAY OTA SYNC ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rooms.map((r, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{r.room}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    r.status === 'Occupied' ? 'bg-emerald-500/20 text-emerald-400' :
                    r.status === 'Cleaning' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-700/40 text-slate-300'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex items-center justify-between">
                  <span>Guest: <strong className="text-white">{r.guest}</strong></span>
                  <span className="text-amber-400 font-mono">{r.rate}</span>
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
                  <span>Housekeeping:</span>
                  <span className="text-slate-200 font-bold">{r.housekeeping}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. FINTECH VISUALIZER: Double-Entry Cryptographic Ledger & KYC Pipeline
// ----------------------------------------------------------------------
function FintechVisualizer({ project }: { project: WorkProject }) {
  const [kycStep, setKycStep] = useState<number>(3);
  const [isBalanced, setIsBalanced] = useState<boolean>(true);

  return (
    <div className="rounded-3xl bg-[#0f1014] border border-white/15 p-6 sm:p-10 shadow-2xl font-mono relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>STRICT DOUBLE-ENTRY CORE // CRYPTOGRAPHIC BALANCE VALIDATOR</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-sans">
            Immutable Double-Entry Ledger &amp; Sub-45s KYC Pipeline
          </h3>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>LEDGER STATUS: 100% BALANCED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Double-Entry Balanced Journal */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-black/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-white/10">
            <span>JOURNAL ENTRY #TX-89104 (LOAN DISBURSAL)</span>
            <span className="text-emerald-400 font-mono">ACID ROW LOCK ACTIVE</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">DEBIT: Loan Receivable A/c [Borrower #9912]</div>
                <div className="text-[10px] text-slate-400">Principal Asset Entry</div>
              </div>
              <div className="text-emerald-400 font-mono font-bold text-sm">+ ₹2,50,000.00</div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div>
                <div className="text-white font-bold">CREDIT: Bank Settlement A/c [IMPS / Escrow]</div>
                <div className="text-[10px] text-slate-400">Disbursal Outflow Entry</div>
              </div>
              <div className="text-purple-400 font-mono font-bold text-sm">- ₹2,50,000.00</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-center justify-between text-xs font-mono">
            <span className="text-purple-300">NET JOURNAL DELTA:</span>
            <span className="text-emerald-400 font-bold">₹0.00 (Zero Rounding Error)</span>
          </div>
        </div>

        {/* KYC Pipeline Progress */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-black/80 border border-white/10 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-purple-400 pb-2 border-b border-white/10">
            <span>KYC OCR &amp; RISK SCORING</span>
            <span>SUB-45S LATENCY</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-bold">Aadhaar / PAN OCR Parsing</div>
                <div className="text-[10px] text-slate-400">Extracted in 4.2s // Match 99.8%</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-bold">Credit Bureau Score &amp; Rule Check</div>
                <div className="text-[10px] text-slate-400">Score 784 // Limit ₹2,50,000 Allocated</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-white font-bold">e-Mandate / NACH Registration</div>
                <div className="text-[10px] text-slate-400">Auto-Debit schedule generated (24 Mos)</div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300 font-bold">
            ✓ Full Loan Approval Cycle Completed in 38.4s
          </div>
        </div>
      </div>
    </div>
  );
}
