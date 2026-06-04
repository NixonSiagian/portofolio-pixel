import fs from 'fs';

let mapCode = fs.readFileSync('src/components/RetroGameMap.tsx', 'utf8');

// The new ROOM_OBJECTS we added previously had sections like "city_alcho", "impact_center", "hall_legend".
// Let's replace them to be "decor_city_alcho", "decor_impact_center", etc., so PortfolioModals handles them natively!
mapCode = mapCode.replace(/section: "city_alcho"/, 'section: "decor_city_alcho"');
mapCode = mapCode.replace(/section: "city_marketing"/, 'section: "decor_city_marketing"');
mapCode = mapCode.replace(/section: "hall_legend"/, 'section: "decor_hall_legend"');
mapCode = mapCode.replace(/section: "impact_center"/, 'section: "decor_impact_center"');
mapCode = mapCode.replace(/section: "dream_portal"/, 'section: "decor_dream_portal"');
mapCode = mapCode.replace(/section: "founder_chamber"/, 'section: "decor_founder_chamber"');

fs.writeFileSync('src/components/RetroGameMap.tsx', mapCode);
console.log("Patched section IDs to start with decor_");
