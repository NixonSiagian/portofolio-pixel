import fs from 'fs';

let code = fs.readFileSync('src/components/MobileVirtualControls.tsx', 'utf8');

const touchMovePatch = `
  const handleTouchMove = (e: TouchEvent) => {
    if (touchIdRef.current === null) return;
    
    // Prevent default scrolling
    if (e.cancelable) {
       e.preventDefault();
    }

    const touch = Array.from(e.touches).find((t) => t.identifier === touchIdRef.current);
`;

code = code.replace(/const handleTouchMove = \(e: TouchEvent\) => \{\s*if \(touchIdRef\.current === null\) return;/m, touchMovePatch);


const mobileKeyPatch = `
  const setKeys = (newKeys: string[]) => {
    // Also dispatch a CustomEvent since KeyboardEvent on mobile WebKit is sometimes stripped
    window.dispatchEvent(new CustomEvent('vJoystick', { detail: newKeys }));

    // Release key buttons no longer needed
`;

code = code.replace(/const setKeys = \(newKeys: string\[\]\) => \{/m, mobileKeyPatch);


fs.writeFileSync('src/components/MobileVirtualControls.tsx', code);
console.log("Patched MobileVirtualControls");
