import fs from 'fs';

let mapCode = fs.readFileSync('src/components/RetroGameMap.tsx', 'utf8');

// Inside useEffect where playerRef is initialized, let's add nixRef
let nixRefInit = `
  const nixRef = useRef({
    x: 720,
    y: 280,
    targetX: 720,
    targetY: 280,
    hoverOffset: 0,
    messageTimeout: 0,
    currentMessage: "Hello! I am NIX, your AI Companion! Press E to explore.",
    opacity: 0,
  });
`;
mapCode = mapCode.replace(/const playerRef = useRef[^;]+;/, match => match + '\\n' + nixRefInit);

// Update NIX positions in the tick loop
let nixTickLogic = `
      // --- NIX COMPANION LOGIC ---
      const nix = nixRef.current;
      nix.hoverOffset += 0.05;
      
      // Follow player with easing
      const targetDistX = player.x - nix.x - 30; // offset slightly
      const targetDistY = player.y - nix.y - 30;
      
      nix.x += targetDistX * 0.05;
      nix.y += targetDistY * 0.05;
      
      if (nix.opacity < 1) nix.opacity += 0.02;
      if (nix.messageTimeout > 0) nix.messageTimeout--;
      
      if (Math.random() < 0.001) {
         const hints = [
           "Did you know the clock shows real time?",
           "Try the Dream Portal in the top left!",
           "Every plant has wisdom.",
           "Find my creator's hidden Easter Eggs!",
           "Check out the Client City (North)!",
           "Check the Knowledge Library (West)!"
         ];
         nix.currentMessage = hints[Math.floor(Math.random() * hints.length)];
         nix.messageTimeout = 300;
      }
      
      // Near an object? change message
      if (nearbyObject && nix.messageTimeout <= 0 && Math.random() < 0.05) {
         nix.currentMessage = "Ooo! " + nearbyObject.name + "! Press E to inspect.";
         nix.messageTimeout = 150;
      }
      // --- END NIX LOGIC ---
`;

// Insert inside the interval before drawing
mapCode = mapCode.replace(/if \(player\.isMoving\) \{/, match => nixTickLogic + '\\n      ' + match);

// Draw NIX Robot
let nixDrawLogic = `
      c.save();
      c.globalAlpha = nix.opacity;
      
      // Draw Robot Body
      c.fillStyle = "#A7F3D0"; // Emerald tint
      
      const nixFloatY = nix.y + Math.sin(nix.hoverOffset) * 4;
      c.fillRect(nix.x, nixFloatY, 16, 20);
      
      // Robot Eye
      c.fillStyle = "#10B981";
      c.fillRect(nix.x + 2, nixFloatY + 4, 12, 6);
      c.fillStyle = "#047857"; // pupils
      c.fillRect(nix.x + 4, nixFloatY + 6, 2, 2);
      c.fillRect(nix.x + 10, nixFloatY + 6, 2, 2);
      
      // Antenna
      c.fillStyle = "#34D399";
      c.fillRect(nix.x + 7, nixFloatY - 8, 2, 8);
      c.fillStyle = "#059669";
      c.beginPath(); c.arc(nix.x + 8, nixFloatY - 8, 3, 0, Math.PI * 2); c.fill();

      // Greeting / Message Bubble
      if (nix.messageTimeout > 0 || nix.opacity < 0.9) {
        c.fillStyle = "rgba(0,0,0,0.85)";
        c.strokeStyle = "#34D399";
        c.lineWidth = 1;
        c.beginPath();
        c.roundRect(nix.x - 30, nixFloatY - 45, 120, 25, 4);
        c.fill();
        c.stroke();
        
        c.fillStyle = "#A7F3D0";
        c.font = "bold 8px monospace";
        c.textAlign = "center";
        c.fillText(nix.currentMessage || "Hi, I'm NIX! Let's explore.", nix.x + 30, nixFloatY - 32);
      }
      
      c.restore();
`;

// Insert drawing logic after rendering player
mapCode = mapCode.replace(/c\.restore\(\);\s*\/\/\s*Restore canvas translation/, match => nixDrawLogic + '\\n' + match);

fs.writeFileSync('src/components/RetroGameMap.tsx', mapCode);
console.log("Patched NIX companion into the map!");
