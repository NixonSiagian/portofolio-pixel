import fs from 'fs';

let mapCode = fs.readFileSync('src/components/RetroGameMap.tsx', 'utf8');

// Inside RetroGameMap component
mapCode = mapCode.replace(/const \[dayNight, setDayNight\] = useState\("day"\);/, match => match + '\n  const [debugState, setDebugState] = useState({ x: 800, y: 320, vx: 0, vy: 0, dir: "down", colliding: false });\n  const [debugActive, setDebugActive] = useState(true);');

// At the end of the movement logic inside the tick loop
// After setting player.isMoving = false
const collisionDebugInject = `
      // Debug mode injection
      setDebugState({
        x: Math.round(player.x),
        y: Math.round(player.y),
        vx: dx,
        vy: dy,
        dir: player.direction,
        colliding: isCollide(player.x + dx, player.y + dy, player.width, player.height)
      });
`;

mapCode = mapCode.replace(/player\.animFrame = 0;\s*\}/, match => match + '\n' + collisionDebugInject);

// Render the Debug Modal
const renderDebug = `
      {debugActive && (
        <div className="absolute top-4 sm:top-24 left-4 z-50 bg-black/85 backdrop-blur-md border-2 border-rose-500 rounded-lg p-3 text-rose-400 font-mono text-[10px] sm:text-xs min-w-[200px] pointer-events-none shadow-[0_0_15px_rgba(225,29,72,0.5)]">
          <h3 className="font-bold border-b border-rose-500/50 pb-1 mb-2 text-white">NIXON OS: RPG DEBUG</h3>
          <p className="flex justify-between"><span>X, Y POS:</span> <span className="text-white">{debugState.x}, {debugState.y}</span></p>
          <p className="flex justify-between"><span>VELOCITY:</span> <span className="text-white">{debugState.vx.toFixed(1)}, {debugState.vy.toFixed(1)}</span></p>
          <p className="flex justify-between"><span>DIRECTION:</span> <span className="text-white">{debugState.dir}</span></p>
          <p className="flex justify-between"><span>COLLISION:</span> <span className={debugState.colliding ? "text-red-500 font-bold animate-pulse" : "text-emerald-500"}>{debugState.colliding ? "BLOCKED" : "CLEAR"}</span></p>
          <div className="mt-2 pt-1 border-t border-rose-500/50 text-[9px] text-rose-300/70">
            <p>Spawn: x:800 y:320</p>
            <p>Camera: Dynamic Track</p>
          </div>
        </div>
      )}
`;

mapCode = mapCode.replace(/\{showMiniMap &&/, match => renderDebug + '\n      ' + match);

fs.writeFileSync('src/components/RetroGameMap.tsx', mapCode);
console.log("Patched debugger view!");
