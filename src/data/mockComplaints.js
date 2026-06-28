export const complaintsData = [
  {
    id: 'WQ-9921',
    title: 'Severe Waterlogging at Sector 4 Junction',
    priority: 'CRITICAL',
    type: 'INFRASTRUCTURE',
    status: 'ACTIVE INVESTIGATION',
    reportedAt: '2024-10-27T08:42:00Z',
    location: {
      desc: 'Sector 4, Main Junction',
      lat: '34.0522° N',
      lon: '-118.2437° W',
      grid: 'Sector 4 - Grid Ref 1022'
    },
    description: 'Major pipe burst causing heavy flooding. Traffic is severely disrupted and water is entering nearby shops. Requires immediate civic intervention before rush hour. Water level is at least 2 feet deep near the main signal.',
    aiDiagnostics: {
      type: 'H2O ANOMALY',
      probability: 'High Probability (95%)',
      risk: 'Immediate Flooding Hazard'
    },
    timeline: [
      { action: 'VIEWED', time: '10:42 AM', desc: 'CMD accessed by Rep. Administration.' },
      { action: 'ASSIGNED', time: '09:15 AM', desc: 'Routed to District 4 Water Dept.' },
      { action: 'FILED', time: '08:42 AM', desc: 'Initial Citizen Report received via Node-B.' }
    ]
  },
  {
    id: 'EL-8834',
    title: 'Streetlights non-functional on Main Arterial Road',
    priority: 'HIGH',
    type: 'ELECTRICAL',
    status: 'PENDING ASSESSMENT',
    reportedAt: '2024-10-27T06:30:00Z',
    location: {
      desc: 'Ward 08, Central',
      lat: '34.0411° N',
      lon: '-118.2512° W',
      grid: 'Sector 8 - Grid Ref 3301'
    },
    description: 'Complete blackout for a 2km stretch. High risk of accidents. Multiple residents have flagged this over the last 48 hours.',
    aiDiagnostics: {
      type: 'GRID FAILURE',
      probability: 'Confirmed (99%)',
      risk: 'High Accident Risk'
    },
    timeline: [
      { action: 'ESCALATED', time: '08:00 AM', desc: 'Auto-escalated due to multiple reports.' },
      { action: 'FILED', time: '06:30 AM', desc: 'Initial Citizen Report received.' }
    ]
  },
  {
    id: 'IN-4412',
    title: 'Potholes near City Hospital Entrance',
    priority: 'MODERATE',
    type: 'ROADWAYS',
    status: 'IN PROGRESS',
    reportedAt: '2024-10-26T14:15:00Z',
    location: {
      desc: 'Ward 03, North',
      lat: '34.0621° N',
      lon: '-118.2311° W',
      grid: 'Sector 3 - Grid Ref 4410'
    },
    description: 'Deep potholes right outside the hospital emergency entrance causing delays for ambulances.',
    aiDiagnostics: {
      type: 'SURFACE DEGRADATION',
      probability: 'Moderate (75%)',
      risk: 'Emergency Transit Delay'
    },
    timeline: [
      { action: 'ASSIGNED', time: '09:00 AM', desc: 'Routed to Road Repair Unit.' },
      { action: 'FILED', time: 'Yesterday, 2:15 PM', desc: 'Citizen Report received.' }
    ]
  },
  {
    id: 'CPL-8492A',
    title: 'Massive Sinkhole on Main St.',
    priority: 'CRITICAL',
    type: 'INFRASTRUCTURE',
    status: 'ACTIVE INVESTIGATION',
    reportedAt: '2024-10-27T08:45:00Z',
    location: {
      desc: 'Sector 4G',
      lat: '34.0522° N',
      lon: '-118.2437° W',
      grid: 'Sector 4G - Grid Ref 8829'
    },
    description: 'Citizen reported a massive road collapse forming a deep sinkhole near the intersection of Main and 4th. Water main appears compromised, significant flooding occurring in adjacent commercial properties. Immediate structural assessment required.',
    aiDiagnostics: {
      type: 'H2O ANOMALY',
      probability: 'High Probability (88%)',
      risk: 'Immediate Collapse Hazard'
    },
    timeline: [
      { action: 'VIEWED', time: '10:42 AM', desc: 'CMD accessed by Rep. Administration.' },
      { action: 'ASSIGNED', time: '09:15 AM', desc: 'Routed to District 9 Infrastructure Desk.' },
      { action: 'FILED', time: '08:45 AM', desc: 'Initial Citizen Report received via Node-B.' }
    ]
  }
];
