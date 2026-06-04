import fs from 'fs';

let mapCode = fs.readFileSync('src/components/RetroGameMap.tsx', 'utf8');

const canvasClickPatch = `
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isIntroActiveRef.current && !autoplay) {
       isIntroActiveRef.current = false;
    }
    
    const canvas = canvasRef.current;
`;

mapCode = mapCode.replace(/const handleCanvasClick = \(e: React\.MouseEvent<HTMLCanvasElement>\) => \{\s*const canvas = canvasRef\.current;/m, canvasClickPatch);

fs.writeFileSync('src/components/RetroGameMap.tsx', mapCode);
console.log("Patched canvas click intro abort");
