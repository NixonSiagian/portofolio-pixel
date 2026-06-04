import React, { useState, useEffect, useRef } from "react";
import { Laptop, PhoneCall, FileText, User, Layout, HelpCircle } from "lucide-react";

interface MobileVirtualControlsProps {
  onInteract: () => void;
  nearbyObject: any | null;
  onAtmosphereToggle: () => void;
}

export function MobileVirtualControls({
  onInteract,
  nearbyObject,
  onAtmosphereToggle
}: MobileVirtualControlsProps) {
  const [joystickActive, setJoystickActive] = useState(false);
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentKeysRef = useRef<string[]>([]);
  const touchIdRef = useRef<number | null>(null);

  const clearKeys = () => {
    currentKeysRef.current.forEach((k) => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key: k }));
    });
    currentKeysRef.current = [];
  };

  
  const setKeys = (newKeys: string[]) => {
    // Also dispatch a CustomEvent since KeyboardEvent on mobile WebKit is sometimes stripped
    window.dispatchEvent(new CustomEvent('vJoystick', { detail: newKeys }));

    // Release key buttons no longer needed

    // Release key buttons no longer needed
    currentKeysRef.current.forEach((k) => {
      if (!newKeys.includes(k)) {
        window.dispatchEvent(new KeyboardEvent("keyup", { key: k }));
      }
    });

    // Press down key buttons newly activated
    newKeys.forEach((k) => {
      if (!currentKeysRef.current.includes(k)) {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: k }));
      }
    });

    currentKeysRef.current = newKeys;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touchIdRef.current !== null) return;

    touchIdRef.current = touch.identifier;
    setJoystickActive(true);
    
    // Anchor current joystick base center position on client coord space
    startPosRef.current = { x: touch.clientX, y: touch.clientY };
    setKnobOffset({ x: 0, y: 0 });
  };

  
  const handleTouchMove = (e: TouchEvent) => {
    if (touchIdRef.current === null) return;
    
    // Prevent default scrolling
    if (e.cancelable) {
       e.preventDefault();
    }

    const touch = Array.from(e.touches).find((t) => t.identifier === touchIdRef.current);
    if (!touch) return;

    const dx = touch.clientX - startPosRef.current.x;
    const dy = touch.clientY - startPosRef.current.y;
    const distance = Math.hypot(dx, dy);

    const maxRadius = 45; // limit dragging visual orbit
    const angle = Math.atan2(dy, dx);
    const clampDist = Math.min(distance, maxRadius);
    
    const knobX = clampDist * Math.cos(angle);
    const knobY = clampDist * Math.sin(angle);
    setKnobOffset({ x: knobX, y: knobY });

    // Decide navigation direction arrays based on 360-deg angle thresholds
    const keysToPress: string[] = [];
    if (clampDist > 12) {
      const degrees = (angle * 180) / Math.PI; // -180 to 180 range
      
      // Broad diagonal corridors mapping
      if (degrees >= -135 && degrees <= -45) {
        keysToPress.push("ArrowUp");
      } else if (degrees >= 45 && degrees <= 135) {
        keysToPress.push("ArrowDown");
      }
      
      if (Math.abs(degrees) <= 60) {
        keysToPress.push("ArrowRight");
      } else if (Math.abs(degrees) >= 120) {
        keysToPress.push("ArrowLeft");
      }
    }

    setKeys(keysToPress);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (touchIdRef.current === null) return;

    // Check if previous touch is still track active
    const touchStillExists = Array.from(e.touches).some((t) => t.identifier === touchIdRef.current);
    if (!touchStillExists) {
      touchIdRef.current = null;
      setJoystickActive(false);
      setKnobOffset({ x: 0, y: 0 });
      clearKeys();
    }
  };

  useEffect(() => {
    const handleMove = (e: TouchEvent) => handleTouchMove(e);
    const handleEnd = (e: TouchEvent) => handleTouchEnd(e);

    if (joystickActive) {
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleEnd);
      window.addEventListener("touchcancel", handleEnd);
    }

    return () => {
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleEnd);
      window.removeEventListener("touchcancel", handleEnd);
    };
  }, [joystickActive]);

  const hasTargetNear = nearbyObject !== null;
  const isDecor = nearbyObject?.section === "decor";

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none block sm:hidden font-mono">
      {/* 2. FLOATING TOUCH JOYSTICK PAD: Left side */}
      <div className="absolute bottom-16 left-8 pointer-events-auto">
        <div 
          onTouchStart={handleTouchStart}
          className="w-28 h-28 rounded-full bg-black/65 backdrop-blur-md border border-zinc-800 flex items-center justify-center relative touch-none shadow-[0_12px_32px_rgba(0,0,0,0.7)]"
        >
          {/* Outer anchor directions glyphs */}
          <span className="absolute top-2 text-[7px] text-zinc-650 tracking-widest font-black">UP</span>
          <span className="absolute bottom-2 text-[7px] text-zinc-650 tracking-widest font-black">DOWN</span>
          <span className="absolute left-2 text-[7px] text-zinc-650 tracking-widest font-black">L</span>
          <span className="absolute right-2 text-[7px] text-zinc-650 tracking-widest font-black">R</span>

          {/* Inner Joystick Track Ring */}
          <div className="w-16 h-16 rounded-full border border-zinc-900/60 flex items-center justify-center" />

          {/* Slider Knob */}
          <div
            className={`w-12 h-12 rounded-full absolute bg-gradient-to-br transition-all border-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)] flex items-center justify-center ${
              joystickActive 
                ? "from-[#FBC02D] to-[#F57F17] border-[#FFE082]" 
                : "from-zinc-800 to-zinc-950 border-zinc-700/60"
            }`}
            style={{
              transform: `translate(${knobOffset.x}px, ${knobOffset.y}px)`,
              transition: joystickActive ? "none" : "transform 0.15s cubic-bezier(0.1, 0.8, 0.2, 1)"
            }}
          >
            <div className="w-2 h-2 rounded-full bg-black/40" />
          </div>
        </div>
      </div>

      {/* 3. CONTEXT-SENSITIVE FLOATING ACTION BUTTON: Right side */}
      <div className="absolute bottom-16 right-8 pointer-events-auto flex flex-col items-center gap-3">
        {hasTargetNear && (
          <div className="bg-black/90 text-center border border-zinc-900/90 py-1.5 px-3 rounded-xl shadow-lg max-w-[150px] animate-bounce-slow">
            <span className="text-[7.5px] text-amber-500 font-extrabold uppercase block tracking-wider">Nearby target</span>
            <span className="text-[9px] text-white font-bold block truncate leading-tight uppercase mt-0.5">{nearbyObject.name}</span>
          </div>
        )}

        <button
          onClick={onInteract}
          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all transform active:scale-90 ${
            hasTargetNear
              ? isDecor
                ? "from-amber-600 to-yellow-600 border-amber-300 shadow-amber-900/30 animate-pulse-slow"
                : "from-emerald-600 to-green-700 border-emerald-400 shadow-emerald-900/30 animate-pulse-slow"
              : "from-zinc-800 to-zinc-950 border-zinc-700 text-zinc-400"
          } bg-gradient-to-br`}
        >
          {hasTargetNear ? (
            <div className="text-center font-bold text-white flex flex-col items-center justify-center gap-0.5">
              <span className="text-base font-black">E</span>
              <span className="text-[8px] uppercase tracking-wider font-extrabold">{isDecor ? "Inspect" : "Open"}</span>
            </div>
          ) : (
            <div className="text-center text-[7.5px] font-extrabold text-zinc-500 uppercase tracking-widest">
              <span>Touch</span>
              <span className="block mt-0.5 text-[8px] text-zinc-600">None</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
