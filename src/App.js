import React, { useState, useEffect } from 'react';
import { Timer, Thermometer, Flame, Trophy, RotateCcw } from 'lucide-react';

const BBQMaster = () => {
  // Game state management
  const [gameState, setGameState] = useState('entry');
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [avatar, setAvatar] = useState('chef_medium');
  const [selectedMeat, setSelectedMeat] = useState(null);
  const [smokerType, setSmokerType] = useState(null);
  const [woodType, setWoodType] = useState(null);
  const [weather, setWeather] = useState('sunny');
  const [rubType, setRubType] = useState('salt-pepper');
  const [difficulty, setDifficulty] = useState('beginner');
  
  // Cooking state
  const [temperature, setTemperature] = useState(225);
  const [baseTemperature, setBaseTemperature] = useState(225);
  const [cookTime, setCookTime] = useState(0);
  const [internalTemp, setInternalTemp] = useState(40);
  const [isStalled, setIsStalled] = useState(false);
  const [stallStartTime, setStallStartTime] = useState(0);
  
  // Advanced controls
  const [currentAction, setCurrentAction] = useState('monitoring');
  const [actionTimer, setActionTimer] = useState(0);
  const [lastProbeCheck, setLastProbeCheck] = useState(0);
  const [fuelLevel, setFuelLevel] = useState(100);
  const [airflowSetting, setAirflowSetting] = useState(50);
  
  // Techniques
  const [hasSpritized, setHasSpritized] = useState(false);
  const [spritzeCount, setSpritzeCount] = useState(0);
  const [hasWrapped, setHasWrapped] = useState(false);
  const [wrapType, setWrapType] = useState(null);
  const [finishMethod, setFinishMethod] = useState('smoker');
  const [woodChipsAdded, setWoodChipsAdded] = useState(0);
  const [hasSauced, setHasSauced] = useState(false);
  const [restTime, setRestTime] = useState(0);
  
  // Advanced features
  const [moistureLevel, setMoistureLevel] = useState(70);
  const [barkDevelopment, setBarkDevelopment] = useState(0);
  const [smokeRingDepth, setSmokeRingDepth] = useState(0);
  const [collagenBreakdown, setCollagenBreakdown] = useState(0);
  
  // Scoring
  const [scores, setScores] = useState({
    tastiness: 0,
    tenderness: 0,
    fatRendering: 0,
    bark: 0,
    smokeRing: 0
  });
  const [totalScore, setTotalScore] = useState(0);
  const [achievements, setAchievements] = useState([]);
  
  // Live competition state
  const [liveCompetitors, setLiveCompetitors] = useState([
    { name: "SmokeKing_Mike", score: 85, progress: 67, meat: "brisket" },
    { name: "RibQueen_Lisa", score: 78, progress: 45, meat: "ribs" },
    { name: "BBQ_Master_Sam", score: 91, progress: 82, meat: "burnt-ends" }
  ]);
  
  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([
    { name: "Franklin_Fan", email: "aaron@bbq.com", score: 2847, rank: 1 },
    { name: "SmokeRing_Sarah", email: "sarah@pits.com", score: 2654, rank: 2 },
    { name: "BrisketKing", email: "king@texas.bbq", score: 2433, rank: 3 },
    { name: "RibMaster_Rob", email: "rob@smoky.net", score: 2287, rank: 4 },
    { name: "KC_Queen", email: "queen@kc.bbq", score: 2156, rank: 5 }
  ]);

  // Game data
  const avatars = {
    chef_light: { name: 'Pit Master', emoji: '👨🏻‍🍳' },
    chef_medium: { name: 'Pit Master', emoji: '👨🏽‍🍳' },
    chef_dark: { name: 'Pit Master', emoji: '👨🏿‍🍳' },
    cook_light: { name: 'Pit Master', emoji: '👩🏻‍🍳' },
    cook_medium: { name: 'Pit Master', emoji: '👩🏽‍🍳' },
    cook_dark: { name: 'Pit Master', emoji: '👩🏿‍🍳' }
  };

  const difficultyLevels = {
    beginner: { name: 'Backyard Hero', multiplier: 1.0, description: 'Learn the basics' },
    intermediate: { name: 'Competition Ready', multiplier: 1.3, description: 'Real challenge' },
    expert: { name: 'Pitmaster Legend', multiplier: 1.7, description: 'Ultimate test' }
  };

  const weatherData = {
    sunny: { name: 'Perfect Day', emoji: '☀️', tempMod: 1.0, fuelMod: 1.0, desc: 'Ideal conditions' },
    hot: { name: 'Scorcher', emoji: '🌡️', tempMod: 1.2, fuelMod: 1.1, desc: 'Hard to keep cool' },
    windy: { name: 'Gusty', emoji: '💨', tempMod: 1.4, fuelMod: 1.3, desc: 'Temperature swings' },
    rainy: { name: 'Stormy', emoji: '🌧️', tempMod: 0.9, fuelMod: 0.8, desc: 'High humidity' },
    snowy: { name: 'Blizzard', emoji: '❄️', tempMod: 0.6, fuelMod: 2.0, desc: 'Extreme challenge' }
  };

  const smokerTypes = {
    electric: { 
      name: 'Electric', emoji: '⚡', desc: 'Easy control',
      tempStability: 0.95, smokeIntensity: 0.6, maxTemp: 300, fuelType: 'electricity'
    },
    pellet: { 
      name: 'Pellet (Traeger)', emoji: '🔥', desc: 'Set & forget',
      tempStability: 0.9, smokeIntensity: 0.8, maxTemp: 450, fuelType: 'pellets'
    },
    charcoal: { 
      name: 'Charcoal', emoji: '⚫', desc: 'Maximum flavor',
      tempStability: 0.7, smokeIntensity: 1.0, maxTemp: 600, fuelType: 'charcoal'
    }
  };

  const woodTypes = {
    hickory: { name: 'Hickory', flavor: 'Bold bacon', strength: 0.9, pairings: ['brisket', 'ribs'] },
    apple: { name: 'Apple', flavor: 'Sweet fruit', strength: 0.4, pairings: ['ribs', 'burnt-ends'] },
    cherry: { name: 'Cherry', flavor: 'Mild sweet', strength: 0.5, pairings: ['ribs', 'burnt-ends'] },
    oak: { name: 'Post Oak', flavor: 'Classic Texas', strength: 0.7, pairings: ['brisket'] },
    mesquite: { name: 'Mesquite', flavor: 'Intense earthy', strength: 1.0, pairings: ['brisket'] },
    pecan: { name: 'Pecan', flavor: 'Sweet nutty', strength: 0.6, pairings: ['ribs', 'burnt-ends'] }
  };

  const rubTypes = {
    'salt-pepper': { name: 'Salt & Pepper', desc: 'Texas Classic', barkBonus: 20, flavorBonus: 15 },
    'brown-sugar': { name: 'Brown Sugar', desc: 'Sweet & Smoky', barkBonus: 25, flavorBonus: 20 },
    'coffee': { name: 'Coffee Rub', desc: 'Brisket Special', barkBonus: 30, flavorBonus: 25 },
    'mustard': { name: 'Mustard Base', desc: 'Bark Builder', barkBonus: 35, flavorBonus: 10 }
  };

  const meatData = {
    brisket: {
      name: 'Brisket', emoji: '🥩', difficulty: 'expert',
      idealTemp: 250, idealTime: 12, wrapTemp: 160, finishTemp: 203,
      description: 'The king of BBQ! Ultimate challenge for masters.',
      techniques: ['Texas Crutch at 160°F', 'Spritz every hour', 'Rest 2+ hours']
    },
    'burnt-ends': {
      name: 'Burnt Ends', emoji: '🔥', difficulty: 'intermediate', 
      idealTemp: 275, idealTime: 8, wrapTemp: 165, finishTemp: 195,
      description: 'Kansas City candy! Two-stage cooking process.',
      techniques: ['Cube after first cook', 'Sauce & finish', 'Caramelize edges']
    },
    ribs: {
      name: 'Baby Back Ribs', emoji: '🍖', difficulty: 'beginner',
      idealTemp: 225, idealTime: 6, wrapTemp: 165, finishTemp: 195, 
      description: 'Perfect for beginners! Learn fundamentals.',
      techniques: ['3-2-1 method', 'Bend test', 'Sauce last 30min']
    }
  };

  // Main game timer
  useEffect(() => {
    let interval;
    if (gameState === 'cooking') {
      interval = setInterval(() => {
        const weatherMod = weatherData[weather].tempMod;
        const smokerMod = smokerTypes[smokerType].tempStability;
        const diffMod = difficultyLevels[difficulty].multiplier;
        
        setCookTime(prev => prev + (1/60 * weatherMod * smokerMod / diffMod));
        
        // Weather-based temperature fluctuations
        setTemperature(prev => {
          const weatherEffect = weather === 'hot' ? Math.random() * 15 - 5 : 
                              weather === 'windy' ? Math.random() * 25 - 12 :
                              weather === 'snowy' ? Math.random() * -20 :
                              weather === 'rainy' ? Math.random() * 8 - 4 :
                              Math.random() * 6 - 3;
          
          const newTemp = baseTemperature + weatherEffect;
          return Math.max(180, Math.min(400, newTemp));
        });
        
        // Internal temperature with stall simulation
        setInternalTemp(prev => {
          const targetProgress = cookTime / meatData[selectedMeat].idealTime;
          let newTemp = 40 + (targetProgress * (meatData[selectedMeat].finishTemp - 40));
          
          if (newTemp >= 150 && newTemp <= 170 && !hasWrapped && !isStalled) {
            setIsStalled(true);
            setStallStartTime(cookTime);
          }
          
          if (isStalled && !hasWrapped) {
            newTemp = 150 + Math.min(20, (cookTime - stallStartTime) * 2);
          }
          
          if (hasWrapped && isStalled) {
            setIsStalled(false);
          }
          
          return Math.min(newTemp, meatData[selectedMeat].finishTemp + 10);
        });
        
        // Fuel consumption
        setFuelLevel(prev => {
          const consumption = weatherData[weather].fuelMod * (baseTemperature / 225) * 0.1;
          return Math.max(0, prev - consumption);
        });
        
        // Bark development
        setBarkDevelopment(prev => {
          const rate = (temperature >= 225 ? 1 : 0.5) * (hasSpritized ? 0.8 : 1.2);
          return Math.min(100, prev + rate * 0.2);
        });
        
        // Smoke ring
        setSmokeRingDepth(prev => {
          if (internalTemp >= 170) return prev;
          const rate = (temperature <= 250 ? 1 : 0.3) * smokerTypes[smokerType].smokeIntensity;
          return Math.min(100, prev + rate * 0.15);
        });
        
        // Moisture
        setMoistureLevel(prev => {
          const evaporation = (temperature / 225) * weatherData[weather].tempMod * 0.3;
          const spritzing = hasSpritized ? 15 : 0;
          return Math.max(10, Math.min(100, prev - evaporation + spritzing));
        });
        
        // Collagen breakdown
        setCollagenBreakdown(prev => {
          if (internalTemp >= 190) {
            const rate = (temperature >= 225 ? 1 : 0.5) * (hasWrapped ? 1.5 : 1);
            return Math.min(100, prev + rate * 0.25);
          }
          return prev;
        });
        
        // Update live competitors
        setLiveCompetitors(prev => prev.map(comp => ({
          ...comp,
          score: Math.min(100, comp.score + Math.random() * 0.5 - 0.25),
          progress: Math.min(100, comp.progress + Math.random() * 0.8)
        })));
        
        // Animations
        setActionTimer(prev => {
          if (prev > 0) return prev - 1;
          setCurrentAction('monitoring');
          return 0;
        });
        
        // Auto probe checks
        const probeInterval = Math.floor(cookTime * 30);
        if (probeInterval > lastProbeCheck && probeInterval % 2 === 0) {
          setLastProbeCheck(probeInterval);
          setCurrentAction('probing');
          setActionTimer(3);
        }
        
        // Random actions
        if (Math.random() < 0.015 && actionTimer === 0) {
          const actions = ['adjusting_vents', 'taking_notes', 'checking_fuel'];
          setCurrentAction(actions[Math.floor(Math.random() * actions.length)]);
          setActionTimer(Math.floor(Math.random() * 3) + 2);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, weather, smokerType, difficulty, cookTime, hasWrapped, isStalled, stallStartTime, lastProbeCheck, actionTimer, selectedMeat, baseTemperature, internalTemp, hasSpritized]);

  // Scoring system - made more challenging
  const calculateAdvancedScores = () => {
    if (!selectedMeat || !smokerType || !woodType) return;
    
    const meat = meatData[selectedMeat];
    const smoker = smokerTypes[smokerType];
    const wood = woodTypes[woodType];
    const rub = rubTypes[rubType];
    const diff = difficultyLevels[difficulty];
    
    const tempDiff = Math.abs(temperature - meat.idealTemp);
    const tempPrecision = Math.max(0, 100 - (tempDiff * 4)); // Made more strict
    
    const timeDiff = Math.abs(cookTime - meat.idealTime);
    const timingScore = Math.max(0, 100 - (timeDiff * 10)); // Made more strict
    
    let techniqueBonus = 0;
    if (hasSpritized && spritzeCount >= 3) techniqueBonus += 15; // Stricter requirements
    if (hasWrapped && cookTime > 0.15) techniqueBonus += 20; // Stricter timing
    if (woodChipsAdded >= 4) techniqueBonus += 12; // Need more wood
    if (hasSauced && cookTime > 0.85) techniqueBonus += 10; // Later sauce timing
    if (restTime >= 0.05) techniqueBonus += 15; // Longer rest required
    if (airflowSetting >= 45 && airflowSetting <= 55) techniqueBonus += 8; // Narrower sweet spot
    
    const woodPairing = wood.pairings.includes(selectedMeat) ? 20 : -15; // Bigger penalty
    const weatherMastery = weather === 'sunny' ? 3 : weather === 'snowy' ? 20 : 10;
    const fuelMgmt = fuelLevel > 30 ? 10 : fuelLevel > 10 ? 3 : -25; // Stricter fuel management
    
    const tastiness = Math.min(100, Math.round(
      (tempPrecision * 0.4 + woodPairing + techniqueBonus * 0.3 + rub.flavorBonus * 0.8) * smoker.smokeIntensity * diff.multiplier
    ));
    
    const tenderness = Math.min(100, Math.round(
      (timingScore * 0.5 + collagenBreakdown * 0.3 + (hasWrapped ? 25 : -5) + (restTime >= 0.05 ? 20 : -10)) * diff.multiplier
    ));
    
    const fatRendering = Math.min(100, Math.round(
      (tempPrecision * 0.6 + (temperature >= 225 && temperature <= 275 ? 20 : -10) + timingScore * 0.25 + collagenBreakdown * 0.15) * diff.multiplier
    ));
    
    const bark = Math.min(100, Math.round(
      (barkDevelopment * 0.5 + rub.barkBonus * 0.6 + (hasSpritized ? 5 : 15) + (hasWrapped ? -20 : 15)) * diff.multiplier
    ));
    
    const smokeRing = Math.min(100, Math.round(
      (smokeRingDepth * 0.6 + (temperature <= 250 ? 25 : -15) + (moistureLevel >= 65 ? 10 : -10)) * diff.multiplier
    ));
    
    setScores({ tastiness, tenderness, fatRendering, bark, smokeRing });
    checkAchievements(tastiness, tenderness, fatRendering, bark, smokeRing);
  };

  const checkAchievements = (t, ten, fat, b, sr) => {
    const newAchievements = [];
    if (t >= 95) newAchievements.push('Flavor Master');
    if (ten >= 95) newAchievements.push('Tender Touch');
    if (fat >= 95) newAchievements.push('Fat Whisperer');
    if (b >= 95) newAchievements.push('Bark Builder');
    if (sr >= 95) newAchievements.push('Ring Master');
    if (t >= 90 && ten >= 90 && fat >= 90 && b >= 90 && sr >= 90) {
      newAchievements.push('Perfect 5-Category');
    }
    setAchievements(prev => [...new Set([...prev, ...newAchievements])]);
  };

  const getOverallScore = () => {
    return Math.round((scores.tastiness + scores.tenderness + scores.fatRendering + scores.bark + scores.smokeRing) / 5);
  };

  const updateLeaderboard = (finalScore) => {
    const newEntry = {
      name: playerName,
      email: playerEmail,
      score: totalScore + finalScore,
      rank: 0
    };
    
    const updatedBoard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
    
    setLeaderboard(updatedBoard);
  };

  // Technique functions
  const sprayMeat = () => {
    if (cookTime >= 0.05 && spritzeCount < 5) {
      setSpritzeCount(prev => prev + 1);
      if (!hasSpritized) setHasSpritized(true);
      setCurrentAction('spraying');
      setActionTimer(3);
      setMoistureLevel(prev => Math.min(100, prev + 20));
    }
  };

  const wrapMeat = (type) => {
    if (internalTemp >= meatData[selectedMeat].wrapTemp && !hasWrapped) {
      setHasWrapped(true);
      setWrapType(type);
      setCurrentAction('wrapping');
      setActionTimer(4);
      setIsStalled(false);
    }
  };

  const addWoodChips = () => {
    if (woodChipsAdded < 6 && fuelLevel > 10) {
      setWoodChipsAdded(prev => prev + 1);
      setCurrentAction('adding_wood');
      setActionTimer(3);
      setFuelLevel(prev => prev - 5);
    }
  };

  const addSauce = () => {
    if (cookTime > 0.8 && !hasSauced) {
      setHasSauced(true);
      setCurrentAction('saucing');
      setActionTimer(3);
    }
  };

  const startResting = () => {
    setCurrentAction('resting');
    setActionTimer(5);
    const restInterval = setInterval(() => {
      setRestTime(prev => {
        if (prev >= 0.05) {
          clearInterval(restInterval);
          return prev;
        }
        return prev + 1/60;
      });
    }, 1000);
  };

  const getAvatarAnimation = () => {
    const baseAvatar = avatars[avatar].emoji;
    const actionIcons = {
      spraying: '💦',
      adding_wood: '🪵', 
      wrapping: '📄',
      probing: '🌡️',
      adjusting_vents: '⚙️',
      taking_notes: '📝',
      checking_fuel: '⛽',
      saucing: '🍯',
      resting: '😴'
    };
    
    return (
      <div className="flex items-center justify-center">
        <span className="text-6xl">{baseAvatar}</span>
        {actionIcons[currentAction] && (
          <div className="ml-2 animate-bounce text-2xl">
            {actionIcons[currentAction]}
          </div>
        )}
      </div>
    );
  };

  // Smoker animation component
  const getSmokerVisualization = () => {
    const meat = meatData[selectedMeat];
    const smokeIntensity = Math.min(3, woodChipsAdded);
    const barkColor = barkDevelopment > 80 ? '#8B4513' : barkDevelopment > 50 ? '#A0522D' : barkDevelopment > 20 ? '#D2691E' : '#DEB887';
    
    return (
      <div className="bg-gray-800 rounded-lg p-4 relative overflow-hidden">
        <h3 className="font-semibold mb-3 text-center">🔥 Inside the Smoker</h3>
        
        {/* Smoker chamber */}
        <div className="relative bg-gray-900 rounded-lg h-40 border-4 border-gray-700">
          {/* Smoke effects */}
          {Array.from({length: smokeIntensity}, (_, i) => (
            <div
              key={i}
              className="absolute animate-pulse opacity-60"
              style={{
                left: `${20 + i * 25}%`,
                top: `${10 + Math.sin(cookTime + i) * 20}%`,
                fontSize: '20px'
              }}
            >
              💨
            </div>
          ))}
          
          {/* Temperature visualization */}
          <div className="absolute top-2 left-2 text-xs text-red-400">
            {temperature.toFixed(0)}°F
          </div>
          
          {/* Meat visualization */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div
              className="transition-all duration-1000 text-4xl"
              style={{
                filter: `hue-rotate(${barkDevelopment}deg) brightness(${0.7 + (barkDevelopment / 200)})`
              }}
            >
              {meat.emoji}
            </div>
            
            {/* Bark development visual */}
            <div className="mt-1">
              <div className="text-xs text-center text-gray-400">Bark: {barkDevelopment.toFixed(0)}%</div>
              <div 
                className="h-1 rounded transition-all duration-1000"
                style={{
                  backgroundColor: barkColor,
                  width: `${Math.max(20, barkDevelopment)}%`,
                  margin: '0 auto'
                }}
              ></div>
            </div>
          </div>
          
          {/* Smoke ring indicator */}
          {smokeRingDepth > 10 && (
            <div className="absolute bottom-8 right-4 text-xs">
              <div className="bg-pink-500 rounded-full w-4 h-4 opacity-60 animate-pulse"></div>
              <div className="text-pink-300 text-center mt-1">Ring!</div>
            </div>
          )}
          
          {/* Moisture indicators */}
          {moistureLevel > 80 && (
            <div className="absolute top-4 right-4 text-blue-300 animate-bounce">
              💧
            </div>
          )}
        </div>
        
        {/* Status messages */}
        <div className="mt-2 text-center text-sm">
          {isStalled && <p className="text-red-400 animate-pulse">⚠️ Temperature stalled!</p>}
          {hasWrapped && <p className="text-yellow-400">🎯 Texas Crutch engaged</p>}
          {barkDevelopment > 90 && <p className="text-amber-400">✨ Perfect bark forming!</p>}
        </div>
      </div>
    );
  };

  // Entry screen
  if (gameState === 'entry') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900 to-orange-900 p-6 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-4">🔥 BBQ MASTER 🔥</h1>
            <p className="text-2xl mb-2">ULTIMATE COMPETITION EDITION</p>
            <p className="text-lg text-orange-200">Master authentic BBQ techniques • Compete globally • Become a legend</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">🏆 Enter Competition</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Pit Master Name</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your BBQ name..."
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    value={playerEmail}
                    onChange={(e) => setPlayerEmail(e.target.value)}
                    placeholder="your.email@bbq.com"
                    className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Competition Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-3 rounded-lg bg-gray-700 text-white"
                  >
                    {Object.entries(difficultyLevels).map(([key, diff]) => (
                      <option key={key} value={key}>
                        {diff.name} - {diff.description}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    if (playerName.trim() && playerEmail.trim()) {
                      setGameState('avatar');
                    }
                  }}
                  disabled={!playerName.trim() || !playerEmail.trim()}
                  className={`w-full py-3 rounded-lg text-xl font-bold transition-colors ${
                    playerName.trim() && playerEmail.trim() 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  🔥 Enter Competition!
                </button>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">🏅 Global Leaderboard</h2>
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((player, index) => (
                  <div key={index} className="flex items-center justify-between bg-white bg-opacity-5 rounded-lg p-3">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">
                        {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                      <div>
                        <p className="font-semibold">{player.name}</p>
                        <p className="text-sm text-gray-300">{player.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-300">{player.score}</p>
                      <p className="text-xs text-gray-400">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Avatar selection
  if (gameState === 'avatar') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome {playerName}! 🔥</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-8">Choose Your Pit Master Avatar</h2>
          
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {Object.entries(avatars).map(([key, char]) => (
              <div
                key={key}
                onClick={() => {
                  setAvatar(key);
                  setGameState('setup');
                }}
                className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="text-6xl mb-3">{char.emoji}</div>
                <h3 className="text-lg font-bold text-gray-800">{char.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-100 to-red-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-red-900 mb-2">
              {avatars[avatar].emoji} Pit Master {playerName}
            </h1>
            <p className="text-lg text-red-700">Competition Level: <strong>{difficultyLevels[difficulty].name}</strong></p>
          </div>

          {/* Weather */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">🌤️ Weather Challenge</h3>
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(weatherData).map(([key, w]) => (
                <div
                  key={key}
                  onClick={() => setWeather(key)}
                  className={`p-3 rounded-lg cursor-pointer transition-all text-center ${
                    weather === key ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'
                  }`}
                >
                  <div className="text-2xl">{w.emoji}</div>
                  <p className="text-xs font-semibold">{w.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Smoker */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">🔥 Choose Equipment</h3>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(smokerTypes).map(([key, smoker]) => (
                <div
                  key={key}
                  onClick={() => setSmokerType(key)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    smokerType === key ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-100'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{smoker.emoji}</div>
                    <h4 className="font-semibold text-sm">{smoker.name}</h4>
                    <p className="text-xs">{smoker.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wood & Rub */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">🪵 Wood</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(woodTypes).map(([key, wood]) => (
                  <div
                    key={key}
                    onClick={() => setWoodType(key)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      woodType === key ? 'bg-amber-500 text-white' : 'bg-white hover:bg-amber-100'
                    }`}
                  >
                    <h4 className="font-semibold text-sm">{wood.name}</h4>
                    <p className="text-xs">{wood.flavor}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">🧂 Rub</h3>
              <div className="space-y-2">
                {Object.entries(rubTypes).map(([key, rub]) => (
                  <div
                    key={key}
                    onClick={() => setRubType(key)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      rubType === key ? 'bg-yellow-500 text-white' : 'bg-white hover:bg-yellow-100'
                    }`}
                  >
                    <h4 className="font-semibold text-sm">{rub.name}</h4>
                    <p className="text-xs">{rub.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meat Selection */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(meatData).map(([key, meat]) => (
              <div
                key={key}
                onClick={() => {
                  if (smokerType && woodType) {
                    setSelectedMeat(key);
                    setGameState('cooking');
                    setCookTime(0);
                    setInternalTemp(40);
                    setIsStalled(false);
                    setFuelLevel(100);
                    setBarkDevelopment(0);
                    setSmokeRingDepth(0);
                    setCollagenBreakdown(0);
                    setMoistureLevel(70);
                    setHasSpritized(false);
                    setSpritzeCount(0);
                    setHasWrapped(false);
                    setWoodChipsAdded(1);
                    setHasSauced(false);
                    setRestTime(0);
                    setCurrentAction('monitoring');
                    setBaseTemperature(225);
                    setTemperature(225);
                  }
                }}
                className={`bg-white rounded-xl p-4 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ${
                  smokerType && woodType ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{meat.emoji}</div>
                  <h3 className="text-lg font-bold text-gray-800">{meat.name}</h3>
                  <div className="text-xs text-white bg-red-500 rounded px-2 py-1 mb-2">
                    {meat.difficulty.toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{meat.description}</p>
                  <div className="bg-red-50 rounded-lg p-2">
                    <p className="text-xs text-red-700">🌡️ {meat.idealTemp}°F • ⏰ {meat.idealTime}h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Cooking screen
  if (gameState === 'cooking') {
    const meat = meatData[selectedMeat];
    const smoker = smokerTypes[smokerType];
    const wood = woodTypes[woodType];
    const weatherInfo = weatherData[weather];
    const progress = Math.min(100, (internalTemp - 40) / (meat.finishTemp - 40) * 100);
    const currentPlayerScore = getOverallScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4">
        <div className="max-w-7xl mx-auto text-white">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">🔥 {playerName} - Smoking {meat.name} {meat.emoji}</h1>
            <div className="flex justify-center items-center gap-3 text-sm">
              <span>{smoker.emoji} {smoker.name}</span>
              <span>🪵 {wood.name}</span>
              <span>{weatherInfo.emoji} {weatherInfo.name}</span>
            </div>
          </div>

          <div className="grid xl:grid-cols-4 gap-4">
            {/* Controls */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">🌡️ Temperature Control</h3>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Smoker: {temperature.toFixed(0)}°F</span>
                  <span className="text-yellow-300">Target: {meat.idealTemp}°F</span>
                </div>
                <div className="flex justify-between text-xs mb-2 text-gray-400">
                  <span>Setting: {baseTemperature}°F</span>
                  <span>{weatherInfo.name} effects active</span>
                </div>
                <input
                  type="range"
                  min="180"
                  max="400"
                  value={baseTemperature}
                  onChange={(e) => setBaseTemperature(Number(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-gray-600 p-2 rounded">
                  <p><strong>Time:</strong> {(cookTime * 60).toFixed(0)}min</p>
                  <p><strong>Internal:</strong> {internalTemp.toFixed(0)}°F</p>
                </div>
                <div className="bg-gray-600 p-2 rounded">
                  <p><strong>Target:</strong> {meat.finishTemp}°F</p>
                  <p><strong>Fuel:</strong> {fuelLevel.toFixed(0)}%</p>
                </div>
              </div>

              <h4 className="font-semibold mb-2">🎯 Techniques</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={sprayMeat}
                  disabled={spritzeCount >= 5 || cookTime < 0.05}
                  className={`p-2 rounded text-xs font-semibold ${
                    cookTime >= 0.05 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  💦 Spritz ({spritzeCount}/5)
                </button>
                
                <button
                  onClick={addWoodChips}
                  disabled={woodChipsAdded >= 6 || fuelLevel <= 10}
                  className={`p-2 rounded text-xs font-semibold ${
                    fuelLevel > 10 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  🪵 Wood ({woodChipsAdded}/6)
                </button>
                
                <button
                  onClick={() => wrapMeat('foil')}
                  disabled={hasWrapped || internalTemp < meat.wrapTemp}
                  className={`p-2 rounded text-xs font-semibold ${
                    hasWrapped ? 'bg-green-600' : internalTemp >= meat.wrapTemp ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {hasWrapped ? '✓ Wrapped!' : `📄 Foil (${meat.wrapTemp}°F)`}
                </button>
                
                <button
                  onClick={addSauce}
                  disabled={hasSauced || cookTime < 0.8}
                  className={`p-2 rounded text-xs font-semibold ${
                    hasSauced ? 'bg-green-600' : cookTime >= 0.8 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {hasSauced ? '✓ Sauced!' : '🍯 Sauce'}
                </button>
              </div>

              {isStalled && (
                <div className="bg-red-800 rounded-lg p-3 mt-4">
                  <h4 className="font-bold text-red-200">⚠️ THE STALL!</h4>
                  <p className="text-sm text-red-300">Temp plateaued at {internalTemp.toFixed(0)}°F</p>
                  <p className="text-xs text-red-400">Time to wrap!</p>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="bg-gray-700 rounded-lg p-4 text-center">
              <h3 className="font-semibold mb-3">👤 {playerName} at Work</h3>
              {getAvatarAnimation()}
              <p className="text-xs text-gray-300 mt-2">
                {currentAction === 'spraying' ? 'Applying spritz...' :
                 currentAction === 'adding_wood' ? 'Loading wood chips...' :
                 currentAction === 'wrapping' ? 'Texas Crutch time...' :
                 currentAction === 'probing' ? 'Checking temp...' :
                 'Monitoring cook...'}
              </p>
              
              <div className="mt-4">
                <div className="bg-gray-600 rounded h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-400 mt-1">Progress: {progress.toFixed(0)}%</p>
              </div>
            </div>

            {/* Live Competition */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">🏁 Live Competition</h3>
              <div className="space-y-2">
                <div className="bg-yellow-600 rounded p-2 text-sm">
                  <div className="flex justify-between">
                    <span>{playerName} (You)</span>
                    <span className="font-bold">{currentPlayerScore}%</span>
                  </div>
                  <div className="bg-yellow-400 rounded h-1 mt-1" style={{ width: `${progress}%` }}></div>
                </div>
                {liveCompetitors.map((comp, index) => (
                  <div key={index} className="bg-gray-600 rounded p-2 text-sm">
                    <div className="flex justify-between">
                      <span>{comp.name}</span>
                      <span className="font-bold">{comp.score.toFixed(0)}%</span>
                    </div>
                    <div className="bg-blue-400 rounded h-1 mt-1" style={{ width: `${comp.progress}%` }}></div>
                    <div className="text-xs text-gray-400 mt-1">{meatData[comp.meat].name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-3">📊 Live Science</h3>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>🍞 Bark</span>
                      <span>{barkDevelopment.toFixed(0)}%</span>
                    </div>
                    <div className="bg-gray-600 rounded h-2">
                      <div className="bg-amber-600 h-full rounded" style={{ width: `${barkDevelopment}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>💍 Smoke Ring</span>
                      <span>{smokeRingDepth.toFixed(0)}%</span>
                    </div>
                    <div className="bg-gray-600 rounded h-2">
                      <div className="bg-pink-500 h-full rounded" style={{ width: `${smokeRingDepth}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => {
                    calculateAdvancedScores();
                    setGameState('scoring');
                  }}
                  disabled={internalTemp < meat.finishTemp}
                  className={`px-6 py-3 rounded-lg font-bold transition-all ${
                    internalTemp >= meat.finishTemp ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  {internalTemp >= meat.finishTemp ? 'Submit to Judges! 🏆' : `Cook to ${meat.finishTemp}°F`}
                </button>
              </div>
            </div>
          </div>
          
          {/* Animated Smoker Visualization */}
          <div className="mt-6">
            {getSmokerVisualization()}
          </div>
        </div>
      </div>
    );
  }

  // Scoring screen
  if (gameState === 'scoring') {
    const overall = getOverallScore();
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 p-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">📊 Competition Results!</h1>
          <div className="text-6xl mb-4">
            {overall >= 95 ? '🏆' : overall >= 85 ? '🥇' : overall >= 75 ? '🥈' : '🔥'}
          </div>
          <h2 className="text-3xl font-bold text-yellow-300">Score: {overall}/100</h2>
          
          <div className="grid grid-cols-5 gap-4 my-8">
            {Object.entries(scores).map(([category, score]) => (
              <div key={category} className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold text-sm capitalize">{category}</h3>
                <p className="text-2xl font-bold text-yellow-300">{score}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              updateLeaderboard(overall);
              setGameState('complete');
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-xl font-bold"
          >
            Submit to Leaderboard! 🚀
          </button>
        </div>
      </div>
    );
  }

  // Complete screen
  if (gameState === 'complete') {
    const overall = getOverallScore();
    const playerRank = leaderboard.findIndex(p => p.name === playerName) + 1;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-2xl text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Competition Complete! 🎉
            </h1>
            
            <div className="text-8xl mb-6">
              {overall >= 95 ? '🏆' : overall >= 85 ? '🥇' : overall >= 75 ? '🥈' : '🔥'}
            </div>
            
            <h2 className="text-4xl font-bold text-green-600 mb-6">Final Score: {overall}/100</h2>
            
            <div className="bg-purple-100 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">🏅 Global Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.slice(0, 5).map((player, index) => (
                  <div key={index} className={`flex justify-between p-3 rounded ${
                    player.name === playerName ? 'bg-yellow-200' : 'bg-white'
                  }`}>
                    <span>#{index + 1} {player.name}</span>
                    <span className="font-bold">{player.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => {
                setGameState('setup');
                setTotalScore(prev => prev + overall);
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-xl font-bold"
            >
              🔥 Cook Again!
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BBQMaster;