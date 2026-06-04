import fs from 'fs';

let mapCode = fs.readFileSync('src/components/RetroGameMap.tsx', 'utf8');

const eventListenerPatch = `
    const handleJoystick = (e: CustomEvent) => {
       const keys = e.detail;
       if (!keys) return;
       
       if (isIntroActiveRef.current && !autoplay) {
         isIntroActiveRef.current = false;
       }

       const possible = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
       possible.forEach(k => {
           keysRef.current[k] = false;
       });
       
       keys.forEach((k: string) => {
           keysRef.current[k.toLowerCase()] = true;
       });
       targetMoveRef.current = null;
    };

    window.addEventListener("vJoystick", handleJoystick as EventListener);
`;

const removeEventListenerPatch = `
      window.removeEventListener("vJoystick", handleJoystick as EventListener);
`;

mapCode = mapCode.replace(/window\.addEventListener\("keydown", handleKeyDown\);/, match => eventListenerPatch + '\n    ' + match);
mapCode = mapCode.replace(/window\.removeEventListener\("keydown", handleKeyDown\);/, match => removeEventListenerPatch + '\n      ' + match);

fs.writeFileSync('src/components/RetroGameMap.tsx', mapCode);
console.log("Patched RetroGameMap joystick listener");
