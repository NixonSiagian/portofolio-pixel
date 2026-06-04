import fs from 'fs';
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(/section: "about" \| "projects" \| "skills" \| "experience" \| "resume" \| "contact";/, 'section: string;');

fs.writeFileSync('src/types.ts', code);
