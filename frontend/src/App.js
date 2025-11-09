// app.js
import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import FSOVisualization from './components/FSOVisualization';
import StressSlider from './components/StressSlider';
import { calculateEffectiveStress } from './components/utils'; // Assuming this utility exists
import './App.css';
import { Play, RefreshCw, SlidersHorizontal, LogOut } from 'lucide-react';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [guppyPositions, setGuppyPositions] = useState([]);
  const [foodSource] = useState({ x: 400, y: 300 });
  const [inputs, setInputs] = useState({
    doStress: 0,
    feedStress: 0,
    impurityStress: 0,
    lightStress: 0,
  });

  // Initialize fish positions on mount
  useEffect(() => {
    const initFish = Array.from({ length: 50 }, () => ({
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 300,
      vx: 0,
      vy: 0,
    }));
    setGuppyPositions(initFish);
  }, []);

  // Check auth status on initial load (uses /api/auth/me)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (data.authenticated) setIsLoggedIn(true);
        else setIsLoggedIn(false);
      } catch (err) {
        console.error("Auth check failed", err);
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // Handle logout (calls /api/auth/logout)
  const logout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (err) {
      console.error("Logout error", err);
    }
    // Update state regardless of fetch error (cookie is likely cleared on backend)
    setIsLoggedIn(false); 
  };

  const effectiveStress = calculateEffectiveStress(inputs);

  // Save results to backend (calls /api/results/save)
  const saveResultToBackend = async (stressScore, cohesion, convergenceTime) => {
    try {
      const res = await fetch("http://localhost:5000/api/results/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stressScore, cohesion, convergenceTime }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        console.error("Save failed:", data.error);
        alert(`Save failed: ${data.error}. You might be logged out.`);
      } else {
        console.log("Saved successfully:", data);
      }
    } catch (err) {
      console.error("Save error", err);
      alert("Network error while saving results.");
    }
  };

  // Run Fish School Optimization simulation
  const runSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);

    let fishes = [...guppyPositions];
    const totalIterations = 200;
    let totalCohesion = 0;

    for (let iter = 0; iter < totalIterations; iter++) {
      fishes = fishes.map((fish) => {
        let nearest = null;
        let minDist = Infinity;
        for (let other of fishes) {
          if (other === fish) continue;
          const dx = fish.x - other.x;
          const dy = fish.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            nearest = other;
          }
        }

        // Attraction to Food Source (fx, fy) and Cohesion to Nearest Neighbor (nx, ny)
        const fx = foodSource.x - fish.x;
        const fy = foodSource.y - fish.y;
        const nx = nearest ? nearest.x - fish.x : 0;
        const ny = nearest ? nearest.y - fish.y : 0;

        // Apply stress factor (0.5 means stress reduces movement by up to 50%)
        const stressFactor = 1 - effectiveStress * 0.5; 
        
        // Velocity update (combination of attraction, cohesion, and random noise)
        const vx = (fx * 0.002 + nx * 0.01 + (Math.random() - 0.5) * 2) * stressFactor;
        const vy = (fy * 0.002 + ny * 0.01 + (Math.random() - 0.5) * 2) * stressFactor;

        return { x: fish.x + vx, y: fish.y + vy, vx, vy };
      });

      totalCohesion += computeCohesion(fishes);
      setGuppyPositions([...fishes]);
      await new Promise((r) => setTimeout(r, 30));
    }

    const cohesion = totalCohesion / totalIterations;
    const convergenceTime = Math.random() * 10 + 5; // Placeholder metric
    const stressScore = effectiveStress;

    setMetrics({ stressScore, cohesion, convergenceTime });
    saveResultToBackend(stressScore, cohesion, convergenceTime);
    setIsSimulating(false);
  };

  const computeCohesion = (fishes) => {
    // Cohesion is measured by how close fish are to the center of the school
    const cx = fishes.reduce((sum, f) => sum + f.x, 0) / fishes.length;
    const cy = fishes.reduce((sum, f) => sum + f.y, 0) / fishes.length;
    
    // Average distance from the center of mass
    const avgDist =
      fishes.reduce((sum, f) => sum + Math.hypot(f.x - cx, f.y - cy), 0) / fishes.length;
    
    // Convert distance (lower is better) to a cohesion score (higher is better, max 1)
    return 1 / (1 + avgDist / 100); 
  };

  const resetSimulation = () => {
    const resetFish = Array.from({ length: 50 }, () => ({
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 300,
      vx: 0,
      vy: 0,
    }));
    setGuppyPositions(resetFish);
    setMetrics({});
  };

  // Login and Signup pages routing
  if (!isLoggedIn) {
    return isSignup ? (
      <SignupPage onBackToLogin={() => setIsSignup(false)} />
    ) : (
      <LoginPage onLogin={() => setIsLoggedIn(true)} onSignupRedirect={() => setIsSignup(true)} />
    );
  }

  // Simulation UI
  return (
    <div className="App">
      <header>
        <h1>FSO Guppy Shoaling Simulator</h1>
        <button onClick={logout} className="logout-btn">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      <main>
        <div className="visualization-section">
          <FSOVisualization
            guppyPositions={guppyPositions}
            effectiveStress={effectiveStress}
            foodSource={foodSource}
            simulationMetrics={metrics}
          />
        </div>

        <div className="control-panel">
          <div>
            <h2><SlidersHorizontal className="w-5 h-5" /> Stress Control</h2>
            {/* The calculation utility must be robust enough to handle the 0-1 range */}
            <div className="effective-stress-display">
                <p>Effective Stress: **{(effectiveStress * 100).toFixed(0)}%**</p>
            </div>
            {Object.entries(inputs).map(([key, val]) => (
              <div className="slider-box" key={key}>
                <StressSlider
                  label={key}
                  name={key}
                  value={val}
                  onChange={(n, v) => setInputs((p) => ({ ...p, [n]: v }))}
                  isSimulating={isSimulating}
                />
              </div>
            ))}
          </div>

          <div className="sim-buttons">
            <button onClick={runSimulation} disabled={isSimulating} className="run-btn">
              <Play className="w-5 h-5" /> {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </button>
            <button onClick={resetSimulation} className="reset-btn">
              <RefreshCw className="w-5 h-5" /> Reset
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;