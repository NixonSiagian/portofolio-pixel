import fs from 'fs';

let mapCode = fs.readFileSync('src/components/RetroGameMap.tsx', 'utf8');

const debugStateHook = `
  const [debugState, setDebugState] = useState({ x: 800, y: 320, vx: 0, vy: 0, dir: 'down', colliding: false });
  const debugActive = true;
`;

mapCode = mapCode.replace(/const nixRef = useRef[^;]+;/, match => match + '\n' + debugStateHook);

const debugUpdateLogic = `
      // Update Debug
      setDebugState({
        x: Math.round(player.x),
        y: Math.round(player.y),
        vx: Math.round(dx * 100)/100,
        vy: Math.round(dy * 100)/100,
        dir: player.direction,
        colliding: isCollide(player.x + dx, player.y + dy, player.width, player.height)
      });
`;

mapCode = mapCode.replace(/if \(\!autoplay\) \{\s*const px = player\.x \+ player\.width \/ 2;\s*const py = player\.y \+ player\.height \/ 2;\s*let activeRoom = "workspace";/, match => debugUpdateLogic + '\n      ' + match);

const renderDebugWindow = `
      {debugActive && (
        <div className="absolute top-4 left-4 sm:top-20 sm:left-4 z-50 bg-black/80 backdrop-blur border border-red-500 text-red-400 font-mono text-xs p-3 rounded pointer-events-none">
          <p className="font-bold underline mb-1">RPG DEBUG MODE</p>
          <p>POS: {debugState.x}, {debugState.y}</p>
          <p>VEL: {debugState.vx}, {debugState.vy}</p>
          <p>DIR: {debugState.dir}</p>
          <p>COLLISION: <span className={debugState.colliding ? "text-rose-500 font-bold" : "text-emerald-500"}>{debugState.colliding ? "TRUE" : "FALSE"}</span></p>
          <p>SPAWN: 800, 320</p>
        </div>
      )}
`;

mapCode = mapCode.replace(/\{showMiniMap &&/, match => renderDebugWindow + '\n      ' + match);

fs.writeFileSync('src/components/RetroGameMap.tsx', mapCode);
console.log("Patched debug UI into RetroGameMap.tsx");
