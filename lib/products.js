export const PRODUCTS = [
  {
    "slug": "passenger",
    "name": "Passenger & MRL Elevators",
    "short": "Machine-room-less lifts for offices, hospitals, hotels and apartment towers.",
    "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "tagline": "Quiet, efficient traction lifts that fit more building into the same footprint.",
    "specs": {
      "capacity": "450 to 2000 kg (6 to 26 persons)",
      "speed": "1.0 to 2.5 m/s",
      "travel": "Up to 40 stops (typical)",
      "control": "VVVF drive with smart group dispatching"
    },
    "features": [
      "Gearless machine inside the shaft, no machine room",
      "Centre-opening automatic doors",
      "Fire mode, intercom and CCTV ready",
      "Stainless steel, wood or glass cabin finishes"
    ]
  },
  {
    "slug": "villa",
    "name": "Luxury Villa & Home Lifts",
    "short": "Compact capsule and panoramic glass lifts for 2 to 5 floors.",
    "image": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "tagline": "A quiet, elegant lift designed to look like part of your home.",
    "specs": {
      "capacity": "250 to 400 kg (3 to 5 persons)",
      "speed": "0.3 to 0.4 m/s",
      "travel": "2 to 5 floors",
      "control": "VVVF soft-start drive with automatic rescue"
    },
    "features": [
      "Panoramic glass or capsule cabin",
      "Compact shaft and shallow pit options",
      "Automatic rescue device for power cuts",
      "Custom interior to match your home"
    ]
  },
  {
    "slug": "escalator",
    "name": "Commercial Escalators & Moving Walks",
    "short": "Heavy-duty units for malls, airports, stations and public spaces.",
    "image": "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    "cabin": false,
    "tagline": "Continuous, reliable people movement for the busiest buildings.",
    "specs": {
      "capacity": "Step width 600, 800 or 1000 mm",
      "speed": "About 0.5 m/s",
      "travel": "Rise up to about 6 m per unit",
      "control": "VVVF with energy-saving idle mode"
    },
    "features": [
      "30 degree escalators and horizontal moving walks",
      "Heavy-duty truss for continuous operation",
      "Skirt lighting and safety brushes",
      "Glass or stainless steel balustrades"
    ]
  },
  {
    "slug": "cargo",
    "name": "Heavy-Duty Cargo & Freight Elevators",
    "short": "Rugged lifts for warehouses, factories and loading bays.",
    "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "tagline": "Built to move pallets, vehicles and machinery, day after day.",
    "specs": {
      "capacity": "1000 to 5000 kg",
      "speed": "0.25 to 1.0 m/s",
      "travel": "Up to about 10 floors (typical)",
      "control": "VVVF with heavy-duty door operator"
    },
    "features": [
      "Reinforced steel cabin and floor",
      "Vertical bi-parting or manual doors",
      "Large cabin sizes for pallets and trolleys",
      "Overload protection and leveling accuracy"
    ]
  },
  {
    "slug": "hospital",
    "name": "Hospital & Stretcher Lifts",
    "short": "Smooth, spacious bed lifts with priority and emergency control.",
    "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    "tagline": "Gentle starts and stops, and room for beds, staff and equipment.",
    "specs": {
      "capacity": "1600 to 2500 kg (bed and stretcher lifts)",
      "speed": "1.0 to 2.0 m/s",
      "travel": "Up to about 20 floors",
      "control": "VVVF with priority and emergency recall"
    },
    "features": [
      "Cabin sized for stretchers and beds",
      "Smooth ride with precise floor leveling",
      "Priority service and emergency recall",
      "Easy-clean antibacterial finishes"
    ]
  },
  {
    "slug": "panoramic",
    "name": "Customized Architecture & Panoramic Lifts",
    "short": "Glass and bespoke lifts designed around your architecture.",
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "tagline": "Your building, your design. We engineer the lift to suit.",
    "specs": {
      "capacity": "450 to 1000 kg (6 to 13 persons)",
      "speed": "0.5 to 1.75 m/s",
      "travel": "Up to about 20 floors",
      "control": "VVVF with smart dispatching"
    },
    "features": [
      "Full-glass or semi-panoramic shafts",
      "Custom cabin shapes, lighting and finishes",
      "Works with new or existing structures",
      "Surveyed and designed for your site"
    ]
  }
];

export const getProduct = slug => PRODUCTS.find(p => p.slug === slug);
