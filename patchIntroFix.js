import fs from 'fs';

let mapCode = fs.readFileSync('src/components/RetroGameMap.tsx', 'utf8');

const introCancelLogic = `
    const handleKeyDown = (e: KeyboardEvent) => {
      // FIX: Mobile input and any other interaction instantly cancels intro.
      if (isIntroActiveRef.current && !autoplay) {
         isIntroActiveRef.current = false;
      }
      
      const key = e.key?.toLowerCase();
      if (!key) return;
`;

mapCode = mapCode.replace(/const handleKeyDown = \(e: KeyboardEvent\) => \{\s*const key = e\.key\.toLowerCase\(\);/m, introCancelLogic);

// Also remove the old isIntroActiveRef check that was returning early if anyone added it, but I see I matched exactly the `const key = ` without early return.
mapCode = mapCode.replace(/if \(isIntroActiveRef\.current && \!autoplay\) return;/, '');

fs.writeFileSync('src/components/RetroGameMap.tsx', mapCode);
console.log("Patched RetroGameMap intro cancellation");
