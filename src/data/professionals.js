const records = [
  ['Arthur Pendleton', 'Master Plumber & Pipe Specialist', 'Plumber', '4.9', 124, 85, ['Emergency Repair', 'Leaky Pipes', 'Commercial'], 12],
  ['Marcus Vance', 'Expert Cabinetry & Framing Carpenter', 'Carpenter', '4.8', 96, 75, ['Furniture Assembly', 'Custom Decks', 'Drywall'], 53],
  ['Sarah Jenkins', 'Licensed Residential Electrician', 'Electrician', '5.0', 83, 90, ['Wiring', 'Smart Home', 'Lighting Installation'], 47],
  ['Elena Rodriguez', 'Interior & Exterior Painting Specialist', 'Painter', '4.9', 108, 72, ['Interior Painting', 'Feature Walls', 'Exterior Finishes'], 36],
  ['Daniel Okafor', '24/7 Residential & Auto Locksmith', 'Locksmith', '4.9', 147, 70, ['Lockout Service', 'Key Cutting', 'Rekeying'], 11],
  ['Maya Collins', 'Certified Security Lock Specialist', 'Locksmith', '4.8', 78, 82, ['Smart Locks', 'Security Upgrades', 'Safe Opening'], 32],
  ['Owen Hart', 'Emergency Locksmith & Key Expert', 'Locksmith', '4.7', 112, 65, ['Emergency Callout', 'Car Keys', 'Lock Repair'], 68],
  ['Priya Naidoo', 'Licensed HVAC Installation Technician', 'HVAC Technician', '5.0', 91, 95, ['AC Installation', 'Heat Pumps', 'Ventilation'], 49],
  ['Ethan Brooks', 'Heating & Cooling Service Expert', 'HVAC Technician', '4.8', 134, 88, ['AC Repair', 'Furnace Service', 'Maintenance'], 14],
  ['Lerato Mokoena', 'Commercial HVAC Systems Technician', 'HVAC Technician', '4.9', 66, 110, ['Ductwork', 'Diagnostics', 'Commercial'], 45],
  ['Jacob Miles', 'Roof Repair & Waterproofing Pro', 'Roofer', '4.9', 156, 86, ['Leak Repair', 'Waterproofing', 'Tile Roofing'], 60],
  ['Thabo Dlamini', 'Residential Roofing Contractor', 'Roofer', '4.8', 103, 92, ['Roof Replacement', 'Gutters', 'Inspections'], 52],
  ['Nina Patel', 'Metal & Flat Roof Specialist', 'Roofer', '4.7', 74, 89, ['Flat Roofs', 'Metal Roofing', 'Storm Damage'], 44],
  ['Carlos Mendes', 'Reliable Home Repair Handyman', 'General Handyman', '4.9', 119, 60, ['Minor Repairs', 'Mounting', 'Home Maintenance'], 59],
  ['Aisha Williams', 'Multi-Skilled Home Services Pro', 'General Handyman', '4.8', 87, 68, ['Painting', 'Fixtures', 'Furniture Repair'], 37],
  ['Ben Carter', 'General Repairs & Installation', 'General Handyman', '4.7', 98, 58, ['Shelving', 'Door Repair', 'Caulking'], 8],
]

export const professionals = records.map(([name, job, category, rating, reviews, price, tags, image]) => ({
  name, job, category, rating, reviews, price, tags,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  photo: `https://i.pravatar.cc/160?img=${image}`,
}))
