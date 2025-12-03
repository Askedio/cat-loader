"use client";

import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export interface AnimationConfig {
  /** Blinking animation settings */
  blink?: {
    enabled?: boolean;
    interval?: number; // seconds between blinks
    duration?: number; // blink duration in seconds
  };
  /** Eye tracking settings */
  eyeTracking?: {
    enabled?: boolean;
    sensitivity?: number; // 0-1, how much eyes move
  };
  /** Idle floating animation */
  idleFloat?: {
    enabled?: boolean;
    speed?: number; // duration in seconds
    distance?: number; // pixels to float
  };
  /** Ear wiggle animation */
  earWiggle?: {
    enabled?: boolean;
    frequency?: number; // seconds between wiggles
  };
  /** Lapping animation settings */
  lapping?: {
    enabled?: boolean;
    speed?: number; // duration in seconds per lap
  };
  /** Idle lapping when complete */
  idleLapping?: {
    enabled?: boolean;
    minDelay?: number; // min seconds between laps
    maxDelay?: number; // max seconds between laps
    chance?: number; // 0-1 probability of lapping
    duration?: number; // how long each lap lasts
  };
  /** Eating animation settings */
  eating?: {
    enabled?: boolean;
    speed?: number; // duration in seconds per chew
  };
}

interface CatLoaderProps {
  /** Animation variant to show */
  variant?: "lapping" | "eating";
  /** Whether loading is complete */
  isComplete?: boolean;
  /** Size of the loader */
  size?: number;
  /** Color of the stroke */
  color?: string;
  /** Always show loading state (never complete) */
  alwaysLoading?: boolean;

  // Feature flags
  /** Enable blinking animation */
  enableBlink?: boolean;
  /** Enable mouse eye tracking */
  enableEyeTracking?: boolean;
  /** Enable idle floating animation */
  enableIdleFloat?: boolean;
  /** Enable ear wiggle */
  enableEarWiggle?: boolean;
  /** Enable click hearts */
  enableClickHearts?: boolean;
  /** Enable sunglasses feature */
  enableSunglasses?: boolean;
  /** Enable idle lapping when complete */
  enableIdleLapping?: boolean;
  /** Enable mouse down mouth open */
  enableMouseDownMouth?: boolean;
  /** Enable success animations (sparkles, heart) */
  enableSuccessAnimations?: boolean;
  /** Show bowl */
  showBowl?: boolean;

  /** Animation timing configuration */
  animationConfig?: AnimationConfig;
}

interface Heart {
  id: number;
  x: number;
  y: number;
  scale: number;
  color: string;
}

export function CatLoader({
  variant = "lapping",
  isComplete = false,
  size = 200,
  color = "currentColor",
  alwaysLoading = false,
  enableBlink = true,
  enableEyeTracking = true,
  enableIdleFloat = true,
  enableEarWiggle = true,
  enableClickHearts = true,
  enableSunglasses = true,
  enableIdleLapping = true,
  enableMouseDownMouth = true,
  enableSuccessAnimations = true,
  showBowl = true,
  animationConfig = {},
}: CatLoaderProps) {
  const [isEating, setIsEating] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isMeowing, setIsMeowing] = useState(false);
  const [showSunglasses, setShowSunglasses] = useState(false);
  const [idleLapping, setIdleLapping] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);

  // Override isComplete if alwaysLoading is true
  const effectiveIsComplete = alwaysLoading ? false : isComplete;

  // Animation config with defaults - must be defined before useEffects
  const anim = {
    blink: {
      enabled: animationConfig.blink?.enabled ?? enableBlink,
      interval: animationConfig.blink?.interval ?? 3,
      duration: animationConfig.blink?.duration ?? 0.2,
    },
    eyeTracking: {
      enabled: animationConfig.eyeTracking?.enabled ?? enableEyeTracking,
      sensitivity: animationConfig.eyeTracking?.sensitivity ?? 1,
    },
    idleFloat: {
      enabled: animationConfig.idleFloat?.enabled ?? enableIdleFloat,
      speed: animationConfig.idleFloat?.speed ?? 2,
      distance: animationConfig.idleFloat?.distance ?? 1,
    },
    earWiggle: {
      enabled: animationConfig.earWiggle?.enabled ?? enableEarWiggle,
      frequency: animationConfig.earWiggle?.frequency ?? 4,
    },
    lapping: {
      enabled: animationConfig.lapping?.enabled ?? true,
      speed: animationConfig.lapping?.speed ?? 0.3,
    },
    idleLapping: {
      enabled: animationConfig.idleLapping?.enabled ?? enableIdleLapping,
      minDelay: animationConfig.idleLapping?.minDelay ?? 3,
      maxDelay: animationConfig.idleLapping?.maxDelay ?? 8,
      chance: animationConfig.idleLapping?.chance ?? 0.3,
      duration: animationConfig.idleLapping?.duration ?? 1.5,
    },
    eating: {
      enabled: animationConfig.eating?.enabled ?? true,
      speed: animationConfig.eating?.speed ?? 0.3,
    },
  };

  // Mouse position for eye tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Transform mouse position to eye movement (limited range)
  const eyeX = useTransform(mouseX, [-300, 300], [-2.5, 2.5]);
  const eyeY = useTransform(mouseY, [-300, 300], [-2.5, 2.5]);

  useEffect(() => {
    if (!anim.eyeTracking.enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Track mouse regardless of ref presence for cleaner effect
      const centerX = containerRef.current
        ? containerRef.current.getBoundingClientRect().left +
          containerRef.current.getBoundingClientRect().width / 2
        : window.innerWidth / 2;

      const centerY = containerRef.current
        ? containerRef.current.getBoundingClientRect().top +
          containerRef.current.getBoundingClientRect().height / 2
        : window.innerHeight / 2;

      // Calculate distance from center
      const diffX = e.clientX - centerX;
      const diffY = e.clientY - centerY;

      mouseX.set(diffX * anim.eyeTracking.sensitivity);
      mouseY.set(diffY * anim.eyeTracking.sensitivity);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, anim.eyeTracking.enabled, anim.eyeTracking.sensitivity]);

  // Eating animation loop
  useEffect(() => {
    if (variant === "eating" && !effectiveIsComplete && anim.eating.enabled) {
      const interval = setInterval(() => {
        setIsEating(prev => !prev);
      }, anim.eating.speed * 1000);
      return () => clearInterval(interval);
    }
  }, [variant, effectiveIsComplete, anim.eating.enabled, anim.eating.speed]);

  // Random idle lapping
  useEffect(() => {
    if (effectiveIsComplete && anim.idleLapping.enabled) {
      const triggerRandomLap = () => {
        const randomDelay =
          (anim.idleLapping.minDelay +
            Math.random() * (anim.idleLapping.maxDelay - anim.idleLapping.minDelay)) *
          1000;
        setTimeout(() => {
          if (Math.random() < anim.idleLapping.chance) {
            setIdleLapping(true);
            setTimeout(() => setIdleLapping(false), anim.idleLapping.duration * 1000);
          }
          triggerRandomLap();
        }, randomDelay);
      };

      triggerRandomLap();
      return () => {}; // Cleanup handled by timeouts finishing naturally or state update
    } else {
      setIdleLapping(false);
    }
  }, [effectiveIsComplete, anim.idleLapping]);

  const handleClick = () => {
    // Trigger Meow
    setIsMeowing(true);
    setTimeout(() => setIsMeowing(false), 200);

    // Check for secret sunglasses toggle (5 clicks rapidly)
    if (enableSunglasses) {
      clickCountRef.current += 1;
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);

      if (clickCountRef.current >= 5) {
        setShowSunglasses(prev => !prev);
        clickCountRef.current = 0;
      }
    }

    // Generate a random heart
    if (enableClickHearts) {
      const id = Date.now() + Math.random();
      const startX = 50 + (Math.random() * 40 - 20); // Center +/- 20
      const startY = 40; // Near the head
      const scale = 0.2 + Math.random() * 0.3; // Random size

      const colors = ["#FF9999", "#FFB6C1", "#FF69B4", "#FF1493", "#DB7093"];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      const newHeart: Heart = {
        id,
        x: startX,
        y: startY,
        scale,
        color: randomColor,
      };

      setHearts(prev => [...prev, newHeart]);

      // Cleanup heart after animation
      setTimeout(() => {
        setHearts(prev => prev.filter(h => h.id !== id));
      }, 1500);
    }
  };

  // SVG path definitions
  const strokeWidth = 2; // Thinned out base stroke

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        cursor: "pointer",
        userSelect: "none",
        width: size,
        height: size,
      }}
      onClick={handleClick}
      onMouseDown={() => setIsMouseDown(true)}
      onMouseUp={() => setIsMouseDown(false)}
      onMouseLeave={() => setIsMouseDown(false)}
    >
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={effectiveIsComplete ? "complete" : "loading"}
        style={{ overflow: "visible" }}
      >
        {/* Head Group - Floats slightly when idle/complete */}
        <motion.g
          animate={
            anim.idleFloat.enabled
              ? {
                  y: [0, -anim.idleFloat.distance, 0],
                }
              : {}
          }
          transition={{
            y: { repeat: Infinity, duration: anim.idleFloat.speed, ease: "easeInOut" },
          }}
        >
          {/* Head Outline - Accent Thickness */}
          <motion.path
            d="M 25 35 L 15 15 L 35 25 C 40 23 60 23 65 25 L 85 15 L 75 35 C 85 45 85 65 75 75 C 65 85 35 85 25 75 C 15 65 15 45 25 35 Z"
            strokeWidth={3}
            fill="transparent"
          />

          {/* Ear Wiggle - Left Ear */}
          {anim.earWiggle.enabled && (
            <motion.path
              d="M 25 35 L 15 15 L 35 25"
              stroke="transparent"
              animate={{ rotate: [0, -5, 0, 0, 0] }}
              transition={{
                repeat: Infinity,
                duration: anim.earWiggle.frequency,
                times: [0, 0.05, 0.1, 0.8, 1],
                repeatDelay: Math.random() * 2,
              }}
              style={{ originX: "25px", originY: "35px" }}
            />
          )}

          {/* Eyes - Tracking and blinking */}
          {!showSunglasses && (
            <motion.g>
              {/* Left Eye */}
              <motion.g
                style={{
                  x: anim.eyeTracking.enabled ? eyeX : 0,
                  y: anim.eyeTracking.enabled ? eyeY : 0,
                }}
              >
                <motion.circle
                  cx="35"
                  cy="45"
                  r="3"
                  fill={color}
                  stroke="none"
                  animate={anim.blink.enabled ? { scaleY: [1, 0.1, 1] } : {}}
                  transition={
                    anim.blink.enabled
                      ? {
                          repeat: Infinity,
                          duration: anim.blink.duration,
                          times: [0, 0.5, 1],
                          repeatDelay: anim.blink.interval,
                        }
                      : {}
                  }
                />
              </motion.g>

              {/* Right Eye */}
              <motion.g
                style={{
                  x: anim.eyeTracking.enabled ? eyeX : 0,
                  y: anim.eyeTracking.enabled ? eyeY : 0,
                }}
              >
                <motion.circle
                  cx="65"
                  cy="45"
                  r="3"
                  fill={color}
                  stroke="none"
                  animate={anim.blink.enabled ? { scaleY: [1, 0.1, 1] } : {}}
                  transition={
                    anim.blink.enabled
                      ? {
                          repeat: Infinity,
                          duration: anim.blink.duration,
                          times: [0, 0.5, 1],
                          repeatDelay: anim.blink.interval,
                        }
                      : {}
                  }
                />
              </motion.g>
            </motion.g>
          )}

          {/* Sunglasses (Secret Feature) */}
          {enableSunglasses && (
            <AnimatePresence>
              {showSunglasses && (
                <motion.g
                  initial={{ y: -50, opacity: 0, rotate: -10 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -50, opacity: 0, rotate: 10 }}
                  transition={{ type: "spring", damping: 12 }}
                  onClick={e => {
                    e.stopPropagation();
                    setShowSunglasses(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Lenses */}
                  <path
                    d="M 20 42 Q 35 42 48 42 Q 50 38 52 42 Q 65 42 80 42 Q 80 52 70 52 Q 60 52 55 48 L 52 46 L 49 48 Q 44 52 34 52 Q 24 52 20 42"
                    fill="black"
                    stroke="none"
                  />
                  {/* Frame / Bridge */}
                  <path d="M 20 42 L 80 42" stroke="black" strokeWidth="2" fill="none" />
                  {/* Shine on lenses */}
                  <path d="M 25 44 L 40 44" stroke="white" strokeWidth="1" opacity="0.3" />
                  <path d="M 60 44 L 75 44" stroke="white" strokeWidth="1" opacity="0.3" />
                </motion.g>
              )}
            </AnimatePresence>
          )}

          {/* Nose */}
          <path d="M 45 55 L 55 55 L 50 60 Z" fill={color} stroke="none" />

          {/* Mouth */}
          <motion.g
            animate={
              variant === "eating" && !effectiveIsComplete
                ? {
                    y: isEating ? 2 : 0,
                  }
                : {}
            }
            transition={{ duration: 0.1 }}
          >
            {isMeowing || (isMouseDown && enableMouseDownMouth) ? (
              // Open Mouth (Meow or Mouse Down)
              <ellipse cx="50" cy="62" rx="3" ry="4" fill={color} stroke="none" />
            ) : (
              // Normal Smile
              <g>
                <path d="M 50 60 Q 45 65 40 60" strokeWidth={2.5} />
                <path d="M 50 60 Q 55 65 60 60" strokeWidth={2.5} />
              </g>
            )}
          </motion.g>

          {/* Whiskers - Thin */}
          <g opacity="0.6" strokeWidth={1.5}>
            <path d="M 20 55 L 10 50" />
            <path d="M 20 60 L 10 60" />
            <path d="M 20 65 L 10 70" />

            <path d="M 80 55 L 90 50" />
            <path d="M 80 60 L 90 60" />
            <path d="M 80 65 L 90 70" />
          </g>
        </motion.g>

        {/* Variant Specific Animations - Only when loading OR idle lapping */}
        {(!effectiveIsComplete || idleLapping) && (
          <>
            {/* Lapping Tongue */}
            {(variant === "lapping" || idleLapping) && anim.lapping.enabled && (
              <motion.path
                d="M 45 62 Q 50 80 55 62"
                fill="#FF9999"
                stroke="#FF9999"
                strokeWidth="0"
                initial={{ y: 0, scaleY: 0.5 }}
                animate={{
                  y: [0, 5, 0],
                  scaleY: [0.5, 1.2, 0.5],
                }}
                transition={{
                  repeat: Infinity,
                  duration: anim.lapping.speed,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Eating/Chewing Animation - Crumbs (only during loading) */}
            {variant === "eating" && !effectiveIsComplete && anim.eating.enabled && (
              <motion.g>
                {/* Crumbs appearing */}
                <motion.circle
                  cx="45"
                  cy="65"
                  r="1.5"
                  fill={color}
                  stroke="none"
                  animate={{ opacity: [0, 1, 0], y: [0, 5] }}
                  transition={{ repeat: Infinity, duration: anim.eating.speed, delay: 0 }}
                />
                <motion.circle
                  cx="55"
                  cy="65"
                  r="1.5"
                  fill={color}
                  stroke="none"
                  animate={{ opacity: [0, 1, 0], y: [0, 5] }}
                  transition={{
                    repeat: Infinity,
                    duration: anim.eating.speed,
                    delay: anim.eating.speed * 0.5,
                  }}
                />
              </motion.g>
            )}
          </>
        )}

        {/* Milk/Food Bowl */}
        {showBowl && (
          <motion.path
            d="M 30 85 Q 50 95 70 85"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
          />
        )}

        {/* Success Sparkles & Heart */}
        {effectiveIsComplete && enableSuccessAnimations && (
          <>
            <motion.g
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              strokeWidth={1.5}
            >
              <path d="M 15 20 L 20 25 M 20 20 L 15 25 M 17.5 18 L 17.5 27" stroke={color} />
              <path d="M 80 20 L 85 25 M 85 20 L 80 25 M 82.5 18 L 82.5 27" stroke={color} />
            </motion.g>

            {/* Heart Popup - Absolutely positioned to not affect layout */}
            <motion.path
              d="M 50 25 C 50 25, 35 10, 20 25 C 5 40, 25 55, 50 70 C 75 55, 95 40, 80 25 C 65 10, 50 25, 50 25"
              fill="#FF9999"
              stroke="none"
              initial={{ scale: 0, y: 10, opacity: 0 }}
              animate={{ scale: 0.2, y: -30, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              style={{
                transformOrigin: "50px 50px",
                pointerEvents: "none",
              }}
            />
          </>
        )}

        {/* Click Hearts */}
        {enableClickHearts && (
          <AnimatePresence>
            {hearts.map(heart => (
              <motion.path
                key={heart.id}
                d="M 0 0 C 0 0, -10 -15, -20 0 C -30 15, -10 30, 0 40 C 10 30, 30 15, 20 0 C 10 -15, 0 0, 0 0"
                fill={heart.color}
                stroke="none"
                initial={{
                  scale: 0,
                  x: heart.x,
                  y: heart.y,
                  opacity: 0,
                }}
                animate={{
                  scale: heart.scale,
                  x: heart.x + (Math.random() * 20 - 10),
                  y: heart.y - 60,
                  opacity: [0, 1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                style={{ pointerEvents: "none" }}
              />
            ))}
          </AnimatePresence>
        )}
      </motion.svg>
    </div>
  );
}
