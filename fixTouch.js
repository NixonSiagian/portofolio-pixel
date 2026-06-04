import fs from 'fs';
let code = fs.readFileSync('src/components/MobileVirtualControls.tsx', 'utf8');

code = code.replace(/const touch = Array\.from\(e\.touches\)\.find\(\(t\) => t\.identifier === touchIdRef\.current\);\s*const touch = Array\.from\(e\.touches\)\.find\(\(t\) => t\.identifier === touchIdRef\.current\);/g, "const touch = Array.from(e.touches).find((t) => t.identifier === touchIdRef.current);");

fs.writeFileSync('src/components/MobileVirtualControls.tsx', code);
