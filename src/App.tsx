import { useState, useEffect } from "react";
import { CatLoader, AnimationConfig } from "./components/CatLoader";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loaderKey, setLoaderKey] = useState(0);
  const [showAlwaysLoading, setShowAlwaysLoading] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Feature flags
  const [enableBlink, setEnableBlink] = useState(true);
  const [enableEyeTracking, setEnableEyeTracking] = useState(true);
  const [enableIdleFloat, setEnableIdleFloat] = useState(true);
  const [enableEarWiggle, setEnableEarWiggle] = useState(true);
  const [enableClickHearts, setEnableClickHearts] = useState(true);
  const [enableSunglasses, setEnableSunglasses] = useState(true);
  const [enableIdleLapping, setEnableIdleLapping] = useState(true);
  const [enableMouseDownMouth, setEnableMouseDownMouth] = useState(true);
  const [enableSuccessAnimations, setEnableSuccessAnimations] = useState(true);
  const [showBowl, setShowBowl] = useState(true);

  // Animation config
  const [blinkInterval, setBlinkInterval] = useState(3);
  const [blinkDuration, setBlinkDuration] = useState(0.2);
  const [eyeTrackingSensitivity, setEyeTrackingSensitivity] = useState(1);
  const [idleFloatSpeed, setIdleFloatSpeed] = useState(2);
  const [idleFloatDistance, setIdleFloatDistance] = useState(1);
  const [earWiggleFrequency, setEarWiggleFrequency] = useState(4);
  const [lappingSpeed, setLappingSpeed] = useState(0.3);
  const [idleLappingMinDelay, setIdleLappingMinDelay] = useState(3);
  const [idleLappingMaxDelay, setIdleLappingMaxDelay] = useState(8);
  const [idleLappingChance, setIdleLappingChance] = useState(0.3);
  const [idleLappingDuration, setIdleLappingDuration] = useState(1.5);
  const [eatingSpeed, setEatingSpeed] = useState(0.3);

  // Simulate progress
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const resetDemo = () => {
    setProgress(0);
    setIsLoading(true);
    setLoaderKey(prev => prev + 1);
  };

  // Generate code example
  const generateCodeExample = () => {
    const props: string[] = [];

    props.push(`variant="lapping"`);
    props.push(`size={52}`);
    if (showAlwaysLoading) {
      props.push(`alwaysLoading={true}`);
    }

    if (!enableBlink) props.push(`enableBlink={false}`);
    if (!enableEyeTracking) props.push(`enableEyeTracking={false}`);
    if (!enableIdleFloat) props.push(`enableIdleFloat={false}`);
    if (!enableEarWiggle) props.push(`enableEarWiggle={false}`);
    if (!enableClickHearts) props.push(`enableClickHearts={false}`);
    if (!enableSunglasses) props.push(`enableSunglasses={false}`);
    if (!enableIdleLapping) props.push(`enableIdleLapping={false}`);
    if (!enableMouseDownMouth) props.push(`enableMouseDownMouth={false}`);
    if (!enableSuccessAnimations) props.push(`enableSuccessAnimations={false}`);
    if (!showBowl) props.push(`showBowl={false}`);

    const animConfigParts: string[] = [];
    const hasNonDefaultAnimConfig =
      blinkInterval !== 3 ||
      blinkDuration !== 0.2 ||
      eyeTrackingSensitivity !== 1 ||
      idleFloatSpeed !== 2 ||
      idleFloatDistance !== 1 ||
      earWiggleFrequency !== 4 ||
      lappingSpeed !== 0.3 ||
      idleLappingMinDelay !== 3 ||
      idleLappingMaxDelay !== 8 ||
      idleLappingChance !== 0.3 ||
      idleLappingDuration !== 1.5 ||
      eatingSpeed !== 0.3;

    if (hasNonDefaultAnimConfig) {
      if (blinkInterval !== 3 || blinkDuration !== 0.2) {
        animConfigParts.push(`    blink: {`);
        if (blinkInterval !== 3) animConfigParts.push(`      interval: ${blinkInterval},`);
        if (blinkDuration !== 0.2) animConfigParts.push(`      duration: ${blinkDuration},`);
        animConfigParts.push(`    },`);
      }

      if (eyeTrackingSensitivity !== 1) {
        animConfigParts.push(`    eyeTracking: {`);
        animConfigParts.push(`      sensitivity: ${eyeTrackingSensitivity},`);
        animConfigParts.push(`    },`);
      }

      if (idleFloatSpeed !== 2 || idleFloatDistance !== 1) {
        animConfigParts.push(`    idleFloat: {`);
        if (idleFloatSpeed !== 2) animConfigParts.push(`      speed: ${idleFloatSpeed},`);
        if (idleFloatDistance !== 1) animConfigParts.push(`      distance: ${idleFloatDistance},`);
        animConfigParts.push(`    },`);
      }

      if (earWiggleFrequency !== 4) {
        animConfigParts.push(`    earWiggle: {`);
        animConfigParts.push(`      frequency: ${earWiggleFrequency},`);
        animConfigParts.push(`    },`);
      }

      if (lappingSpeed !== 0.3) {
        animConfigParts.push(`    lapping: {`);
        animConfigParts.push(`      speed: ${lappingSpeed},`);
        animConfigParts.push(`    },`);
      }

      if (
        idleLappingMinDelay !== 3 ||
        idleLappingMaxDelay !== 8 ||
        idleLappingChance !== 0.3 ||
        idleLappingDuration !== 1.5
      ) {
        animConfigParts.push(`    idleLapping: {`);
        if (idleLappingMinDelay !== 3)
          animConfigParts.push(`      minDelay: ${idleLappingMinDelay},`);
        if (idleLappingMaxDelay !== 8)
          animConfigParts.push(`      maxDelay: ${idleLappingMaxDelay},`);
        if (idleLappingChance !== 0.3) animConfigParts.push(`      chance: ${idleLappingChance},`);
        if (idleLappingDuration !== 1.5)
          animConfigParts.push(`      duration: ${idleLappingDuration},`);
        animConfigParts.push(`    },`);
      }

      if (eatingSpeed !== 0.3) {
        animConfigParts.push(`    eating: {`);
        animConfigParts.push(`      speed: ${eatingSpeed},`);
        animConfigParts.push(`    },`);
      }
    }

    let code = `import { CatLoader${
      hasNonDefaultAnimConfig ? ", AnimationConfig" : ""
    } } from "./components/CatLoader";

<CatLoader
  ${props.join("\n  ")}${
      hasNonDefaultAnimConfig ? `\n  animationConfig={{\n${animConfigParts.join("\n")}\n  }}` : ""
    }
/>`;

    return code;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateCodeExample());
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Build animation config from state
  const animationConfig: AnimationConfig = {
    blink: {
      enabled: enableBlink,
      interval: blinkInterval,
      duration: blinkDuration,
    },
    eyeTracking: {
      enabled: enableEyeTracking,
      sensitivity: eyeTrackingSensitivity,
    },
    idleFloat: {
      enabled: enableIdleFloat,
      speed: idleFloatSpeed,
      distance: idleFloatDistance,
    },
    earWiggle: {
      enabled: enableEarWiggle,
      frequency: earWiggleFrequency,
    },
    lapping: {
      enabled: true,
      speed: lappingSpeed,
    },
    idleLapping: {
      enabled: enableIdleLapping,
      minDelay: idleLappingMinDelay,
      maxDelay: idleLappingMaxDelay,
      chance: idleLappingChance,
      duration: idleLappingDuration,
    },
    eating: {
      enabled: true,
      speed: eatingSpeed,
    },
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Cat Loader Demo</h1>
        <p>Animated SVG cat loader with customizable features</p>
        <div className="github-link">
          <a
            href="https://github.com/Askedio/cat-loader"
            target="_blank"
            rel="noopener noreferrer"
            className="github-button"
          >
            📦 Download / Clone on GitHub
          </a>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Creative Cat Loader - Size Variations</h2>
        </div>
        <div className="card-content">
          <div className="grid">
            <div className="loader-item">
              <div className="size-label">32px</div>
              <div className="loader-wrapper" style={{ width: 32, height: 32 }}>
                <CatLoader
                  key={`loader-32-${loaderKey}`}
                  variant="lapping"
                  isComplete={!isLoading && !showAlwaysLoading}
                  alwaysLoading={showAlwaysLoading}
                  size={32}
                  enableBlink={enableBlink}
                  enableEyeTracking={enableEyeTracking}
                  enableIdleFloat={enableIdleFloat}
                  enableEarWiggle={enableEarWiggle}
                  enableClickHearts={enableClickHearts}
                  enableSunglasses={enableSunglasses}
                  enableIdleLapping={enableIdleLapping}
                  enableMouseDownMouth={enableMouseDownMouth}
                  enableSuccessAnimations={enableSuccessAnimations}
                  showBowl={showBowl}
                  animationConfig={animationConfig}
                />
              </div>
            </div>

            <div className="loader-item">
              <div className="size-label">52px</div>
              <div className="loader-wrapper" style={{ width: 52, height: 52 }}>
                <CatLoader
                  key={`loader-52-${loaderKey}`}
                  variant="lapping"
                  isComplete={!isLoading && !showAlwaysLoading}
                  alwaysLoading={showAlwaysLoading}
                  size={52}
                  enableBlink={enableBlink}
                  enableEyeTracking={enableEyeTracking}
                  enableIdleFloat={enableIdleFloat}
                  enableEarWiggle={enableEarWiggle}
                  enableClickHearts={enableClickHearts}
                  enableSunglasses={enableSunglasses}
                  enableIdleLapping={enableIdleLapping}
                  enableMouseDownMouth={enableMouseDownMouth}
                  enableSuccessAnimations={enableSuccessAnimations}
                  showBowl={showBowl}
                  animationConfig={animationConfig}
                />
              </div>
            </div>

            <div className="loader-item">
              <div className="size-label">100px</div>
              <div className="loader-wrapper" style={{ width: 100, height: 100 }}>
                <CatLoader
                  key={`loader-100-${loaderKey}`}
                  variant="lapping"
                  isComplete={!isLoading && !showAlwaysLoading}
                  alwaysLoading={showAlwaysLoading}
                  size={100}
                  enableBlink={enableBlink}
                  enableEyeTracking={enableEyeTracking}
                  enableIdleFloat={enableIdleFloat}
                  enableEarWiggle={enableEarWiggle}
                  enableClickHearts={enableClickHearts}
                  enableSunglasses={enableSunglasses}
                  enableIdleLapping={enableIdleLapping}
                  enableMouseDownMouth={enableMouseDownMouth}
                  enableSuccessAnimations={enableSuccessAnimations}
                  showBowl={showBowl}
                  animationConfig={animationConfig}
                />
              </div>
            </div>
          </div>

          <div className="progress-text">
            {isLoading && <div className="loading-text">{progress}% Drinking Milk...</div>}
            {!isLoading && <div className="done-text">Done! Purrfect!</div>}
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="button-group">
          <button className="btn btn-secondary" onClick={resetDemo}>
            Restart Demo
          </button>
          <button
            className={`btn ${showAlwaysLoading ? "btn-primary" : "btn-outline"}`}
            onClick={() => setShowAlwaysLoading(prev => !prev)}
          >
            {showAlwaysLoading ? "Stop Always Loading" : "Always Loading Mode"}
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Animation Controls</h2>
          </div>
          <div className="card-content">
            <div className="controls-grid">
              <div className="controls-column">
                <h3>Feature Flags</h3>

                <div className="control-row">
                  <label htmlFor="blink">Blink</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="blink"
                      checked={enableBlink}
                      onChange={e => setEnableBlink(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="eyeTracking">Eye Tracking</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="eyeTracking"
                      checked={enableEyeTracking}
                      onChange={e => setEnableEyeTracking(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="idleFloat">Idle Float</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="idleFloat"
                      checked={enableIdleFloat}
                      onChange={e => setEnableIdleFloat(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="earWiggle">Ear Wiggle</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="earWiggle"
                      checked={enableEarWiggle}
                      onChange={e => setEnableEarWiggle(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="clickHearts">Click Hearts</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="clickHearts"
                      checked={enableClickHearts}
                      onChange={e => setEnableClickHearts(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="sunglasses">Sunglasses</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="sunglasses"
                      checked={enableSunglasses}
                      onChange={e => setEnableSunglasses(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="idleLapping">Idle Lapping</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="idleLapping"
                      checked={enableIdleLapping}
                      onChange={e => setEnableIdleLapping(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="mouseDownMouth">Mouse Down Mouth</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="mouseDownMouth"
                      checked={enableMouseDownMouth}
                      onChange={e => setEnableMouseDownMouth(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="successAnimations">Success Animations</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="successAnimations"
                      checked={enableSuccessAnimations}
                      onChange={e => setEnableSuccessAnimations(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="control-row">
                  <label htmlFor="showBowl">Show Bowl</label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      id="showBowl"
                      checked={showBowl}
                      onChange={e => setShowBowl(e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="controls-column">
                <h3>Animation Timing</h3>

                <div className="input-group">
                  <label htmlFor="blinkInterval">Blink Interval (s)</label>
                  <input
                    id="blinkInterval"
                    type="number"
                    step="0.1"
                    value={blinkInterval}
                    onChange={e => setBlinkInterval(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="blinkDuration">Blink Duration (s)</label>
                  <input
                    id="blinkDuration"
                    type="number"
                    step="0.1"
                    value={blinkDuration}
                    onChange={e => setBlinkDuration(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="eyeSensitivity">Eye Sensitivity (0-1)</label>
                  <input
                    id="eyeSensitivity"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={eyeTrackingSensitivity}
                    onChange={e => setEyeTrackingSensitivity(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="floatSpeed">Idle Float Speed (s)</label>
                  <input
                    id="floatSpeed"
                    type="number"
                    step="0.1"
                    value={idleFloatSpeed}
                    onChange={e => setIdleFloatSpeed(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="floatDistance">Idle Float Distance (px)</label>
                  <input
                    id="floatDistance"
                    type="number"
                    step="0.1"
                    value={idleFloatDistance}
                    onChange={e => setIdleFloatDistance(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="earFrequency">Ear Wiggle Frequency (s)</label>
                  <input
                    id="earFrequency"
                    type="number"
                    step="0.1"
                    value={earWiggleFrequency}
                    onChange={e => setEarWiggleFrequency(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="lapSpeed">Lapping Speed (s)</label>
                  <input
                    id="lapSpeed"
                    type="number"
                    step="0.1"
                    value={lappingSpeed}
                    onChange={e => setLappingSpeed(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="idleLapMin">Idle Lap Min Delay (s)</label>
                  <input
                    id="idleLapMin"
                    type="number"
                    step="0.1"
                    value={idleLappingMinDelay}
                    onChange={e => setIdleLappingMinDelay(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="idleLapMax">Idle Lap Max Delay (s)</label>
                  <input
                    id="idleLapMax"
                    type="number"
                    step="0.1"
                    value={idleLappingMaxDelay}
                    onChange={e => setIdleLappingMaxDelay(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="idleLapChance">Idle Lap Chance (0-1)</label>
                  <input
                    id="idleLapChance"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={idleLappingChance}
                    onChange={e => setIdleLappingChance(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="idleLapDuration">Idle Lap Duration (s)</label>
                  <input
                    id="idleLapDuration"
                    type="number"
                    step="0.1"
                    value={idleLappingDuration}
                    onChange={e => setIdleLappingDuration(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="eatSpeed">Eating Speed (s)</label>
                  <input
                    id="eatSpeed"
                    type="number"
                    step="0.1"
                    value={eatingSpeed}
                    onChange={e => setEatingSpeed(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Code Example</h2>
          </div>
          <div className="card-content">
            <div className="code-container">
              <button className="btn-copy" onClick={handleCopyCode}>
                {codeCopied ? "✓ Copied!" : "Copy"}
              </button>
              <pre className="code-block">
                <code>{generateCodeExample()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        Created by Will with <span className="heart">♥</span> and{" "}
        <a href="mailto:will@willbowman.dev" className="footer-link">
          will@willbowman.dev
        </a>
      </footer>
    </div>
  );
}

export default App;
