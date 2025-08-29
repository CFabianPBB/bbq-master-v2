import React, { useState, useEffect } from 'react';

const BBQMaster = () => {
  // Core state
  const [gameState, setGameState] = useState('entry');
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [avatar, setAvatar] = useState('chef_medium');
  const [selectedMeat, setSelectedMeat] = useState(null);
  const [smokerType, setSmokerType] = useState(null);
  const [region, setRegion] = useState('texas');
  const [weather, setWeather] = useState('sunny');
  
  // Cooking state
  const [temperature, setTemperature] = useState(225);
  const [baseTemperature, setBaseTemperature] = useState(225);
  const [cookTime, setCookTime] = useState(0);
  const [internalTemp, setInternalTemp] = useState(40);
  const [isStalled, setIsStalled] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('morning');
  
  // Controls
  const [intakeVent, setIntakeVent] = useState(50);
  const [exhaustVent, setExhaustVent] = useState(50);
  const [firebox, setFirebox] = useState(50);
  const [fuelLevel, setFuelLevel] = useState(100);
  
  // Techniques
  const [hasSpritized, setHasSpritized] = useState(false);
  const [spritzeCount, setSpritzeCount] = useState(0);
  const [spritzeType, setSpritzeType] = useState('apple-juice');
  const [hasWrapped, setHasWrapped] = useState(false);
  const [wrapType, setWrapType] = useState(null);
  const [hasInjected, setHasInjected] = useState(false);
  const [injectionType, setInjectionType] = useState('beef-broth');
  const [waterPanActive, setWaterPanActive] = useState(false);
  const [hasReverseSeared, setHasReverseSeared] = useState(false);
  const [trimLevel, setTrimLevel] = useState('standard');
  const [woodChipsAdded, setWoodChipsAdded] = useState(1);
  
  // Science
  const [barkDevelopment, setBarkDevelopment] = useState(0);
  const [smokeRingDepth, setSmokeRingDepth] = useState(0);
  const [collagenBreakdown, setCollagenBreakdown] = useState(0);
  const [maillardReaction, setMaillardReaction] = useState(0);
  const [moistureLevel, setMoistureLevel] = useState(70);
  const [saltPenetration, setSaltPenetration] = useState(0);
  const [enzymeActivity, setEnzymeActivity] = useState(0);
  const [proteinDenaturation, setProteinDenaturation] = useState(0);
  
  // Business
  const [marketPrice, setMarketPrice] = useState(100);
  const [restaurant, setRestaurant] = useState({ reputation: 50, capacity: 10 });
  const [socialMedia, setSocialMedia] = useState({ followers: 100, posts: 0 });
  const [inventory, setInventory] = useState({ wood: 50, supplies: 100 });
  const [livestreamActive, setLivestreamActive] = useState(false);
  const [criticsPresent, setCriticsPresent] = useState(false);
  
  // Scoring
  const [scores, setScores] = useState({ tastiness: 0, tenderness: 0, fatRendering: 0, bark: 0, smokeRing: 0 });
  const [achievements, setAchievements] = useState([]);

  // Game data
  const avatars = {
    chef_light: { name: 'Pit Master', emoji: '👨🏻‍🍳' },
    chef_medium: { name: 'Pit Master', emoji: '👨🏽‍🍳' },
    chef_dark: { name: 'Pit Master', emoji: '👨🏿‍🍳' },
    cook_light: { name: 'Pit Master', emoji: '👩🏻‍🍳' },
    cook_medium: { name: 'Pit Master', emoji: '👩🏽‍🍳' },
    cook_dark: { name: 'Pit Master', emoji: '👩🏿‍🍳' }
  };

  const regions = {
    texas: { name: 'Texas', style: 'Salt & pepper brisket', bonus: 'bark' },
    kansas: { name: 'Kansas City', style: 'Sweet saucy ribs', bonus: 'sauce' },
    carolina: { name: 'Carolina', style: 'Vinegar pork', bonus: 'tenderness' },
    memphis: { name: 'Memphis', style: 'Dry rub ribs', bonus: 'rub' }
  };

  const meatData = {
    brisket: { name: 'Brisket', emoji: '🥩', difficulty: 'expert', idealTemp: 250, idealTime: 12, wrapTemp: 160, finishTemp: 203, price: 150 },
    ribs: { name: 'Ribs', emoji: '🍖', difficulty: 'beginner', idealTemp: 225, idealTime: 6, wrapTemp: 165, finishTemp: 195, price: 80 },
    'burnt-ends': { name: 'Burnt Ends', emoji: '🔥', difficulty: 'intermediate', idealTemp: 275, idealTime: 8, wrapTemp: 165, finishTemp: 195, price: 120 },
    'pork-shoulder': { name: 'Pork Shoulder', emoji: '🐷', difficulty: 'intermediate', idealTemp: 225, idealTime: 14, wrapTemp: 165, finishTemp: 205, price: 90 },
    'beef-ribs': { name: 'Beef Ribs', emoji: '🦴', difficulty: 'expert', idealTemp: 275, idealTime: 10, wrapTemp: 170, finishTemp: 210, price: 200 },
    salmon: { name: 'Salmon', emoji: '🐟', difficulty: 'advanced', idealTemp: 200, idealTime: 2, wrapTemp: 140, finishTemp: 145, price: 40 }
  };

  const smokerTypes = {
    offset: { name: 'Offset Stick Burner', emoji: '🏗️', tempStability: 0.6, smokeIntensity: 1.2, price: 2000 },
    electric: { name: 'Electric', emoji: '⚡', tempStability: 0.95, smokeIntensity: 0.6, price: 300 },
    pellet: { name: 'Pellet', emoji: '🔥', tempStability: 0.9, smokeIntensity: 0.8, price: 600 },
    charcoal: { name: 'Weber Kettle', emoji: '⚫', tempStability: 0.7, smokeIntensity: 1.0, price: 200 }
  };

  const spritzeTypes = {
    'apple-juice': { name: 'Apple Juice', effect: 'sweetness', bonus: 10 },
    'beer': { name: 'Beer', effect: 'moisture', bonus: 15 },
    'butter-honey': { name: 'Butter & Honey', effect: 'bark', bonus: 20 },
    'vinegar': { name: 'Vinegar', effect: 'tenderness', bonus: 12 }
  };

  const injectionTypes = {
    'beef-broth': { name: 'Beef Broth', effect: 'moisture', bonus: 15 },
    'butter-garlic': { name: 'Butter Garlic', effect: 'richness', bonus: 25 },
    'wine-herbs': { name: 'Wine & Herbs', effect: 'complexity', bonus: 30 }
  };

  // Enhanced game timer
  useEffect(() => {
    let interval;
    if (gameState === 'cooking') {
      interval = setInterval(() => {
        setCookTime(prev => prev + 1/60);
        
        // Dynamic temperature
        setTemperature(prev => {
          const weatherEffect = weather === 'hot' ? Math.random() * 20 - 5 : 
                              weather === 'windy' ? Math.random() * 30 - 15 :
                              weather === 'snowy' ? Math.random() * -25 : Math.random() * 8 - 4;
          const ventEffect = ((intakeVent - 50) * 0.3) + ((exhaustVent - 50) * 0.2);
          const fireboxEffect = (firebox - 50) * 0.4;
          return Math.max(180, Math.min(500, baseTemperature + weatherEffect + ventEffect + fireboxEffect));
        });
        
        // Internal temperature with stall
        const targetProgress = cookTime / meatData[selectedMeat].idealTime;
        let newTemp = 40 + (targetProgress * (meatData[selectedMeat].finishTemp - 40));
        if (newTemp >= 150 && newTemp <= 170 && !hasWrapped && !isStalled) setIsStalled(true);
        if (hasWrapped && isStalled) setIsStalled(false);
        setInternalTemp(isStalled && !hasWrapped ? Math.min(170, newTemp) : newTemp);
        
        // Advanced science
        setBarkDevelopment(prev => Math.min(100, prev + (temperature >= 225 ? 0.4 : 0.1)));
        setSmokeRingDepth(prev => internalTemp < 170 ? Math.min(100, prev + 0.25) : prev);
        setCollagenBreakdown(prev => internalTemp >= 190 ? Math.min(100, prev + 0.5) : prev);
        setMaillardReaction(prev => temperature >= 300 ? Math.min(100, prev + 0.8) : prev);
        setSaltPenetration(prev => Math.min(100, prev + 0.1));
        setEnzymeActivity(prev => temperature >= 140 && temperature <= 180 ? Math.min(100, prev + 0.6) : Math.max(0, prev - 0.2));
        setProteinDenaturation(prev => internalTemp >= 140 ? Math.min(100, prev + 0.4) : prev);
        setMoistureLevel(prev => Math.max(10, prev - 0.2 + (hasSpritized ? 5 : 0) + (waterPanActive ? 3 : 0)));
        
        // Business metrics
        setMarketPrice(prev => prev + (Math.random() * 4 - 2));
        setFuelLevel(prev => Math.max(0, prev - (baseTemperature / 225) * 0.12));
        
        if (livestreamActive && Math.random() < 0.02) {
          setSocialMedia(prev => ({...prev, followers: prev.followers + Math.floor(Math.random() * 5) + 1}));
        }
        
        // Time progression
        if (cookTime > 4 && timeOfDay === 'morning') setTimeOfDay('afternoon');
        else if (cookTime > 8 && timeOfDay === 'afternoon') setTimeOfDay('evening');
        else if (cookTime > 12 && timeOfDay === 'evening') setTimeOfDay('night');
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, weather, baseTemperature, intakeVent, exhaustVent, firebox, hasWrapped, isStalled, selectedMeat, temperature, internalTemp, hasSpritized, waterPanActive, cookTime, timeOfDay, livestreamActive]);

  // Enhanced techniques
  const sprayMeat = (type = spritzeType) => {
    if (spritzeCount < 8 && inventory.supplies > 5) {
      setSpritzeCount(prev => prev + 1);
      setHasSpritized(true);
      setSpritzeType(type);
      setInventory(prev => ({...prev, supplies: prev.supplies - 5}));
      
      const effect = spritzeTypes[type];
      if (effect.effect === 'bark') setBarkDevelopment(prev => prev + effect.bonus);
      else if (effect.effect === 'moisture') setMoistureLevel(prev => prev + effect.bonus * 2);
    }
  };

  const injectMeat = (type = injectionType) => {
    if (!hasInjected && cookTime < 0.2) {
      setHasInjected(true);
      setInjectionType(type);
      const effect = injectionTypes[type];
      if (effect.effect === 'moisture') setMoistureLevel(prev => prev + effect.bonus);
    }
  };

  const wrapMeat = (type) => {
    if (internalTemp >= meatData[selectedMeat].wrapTemp && !hasWrapped && inventory.supplies > 10) {
      setHasWrapped(true);
      setWrapType(type);
      setIsStalled(false);
      setInventory(prev => ({...prev, supplies: prev.supplies - 10}));
      
      if (type === 'foil') {
        setMoistureLevel(prev => prev + 40);
        setBarkDevelopment(prev => prev - 15);
      } else if (type === 'paper') {
        setMoistureLevel(prev => prev + 20);
        setBarkDevelopment(prev => prev + 10);
      } else if (type === 'naked') {
        setBarkDevelopment(prev => prev + 25);
      }
    }
  };

  const reverseSear = () => {
    if (internalTemp >= meatData[selectedMeat].finishTemp - 20 && !hasReverseSeared) {
      setHasReverseSeared(true);
      setBaseTemperature(400);
      setMaillardReaction(prev => prev + 30);
      setBarkDevelopment(prev => prev + 20);
    }
  };

  const addWoodChips = () => {
    if (woodChipsAdded < 6 && inventory.wood > 10) {
      setWoodChipsAdded(prev => prev + 1);
      setInventory(prev => ({...prev, wood: prev.wood - 10}));
    }
  };

  // Enhanced scoring
  const calculateScores = () => {
    const meat = meatData[selectedMeat];
    const regional = regions[region];
    
    const tempScore = Math.max(0, 100 - Math.abs(temperature - meat.idealTemp) * 3);
    const timingScore = Math.max(0, 100 - Math.abs(cookTime - meat.idealTime) * 8);
    
    let techniqueBonus = 0;
    if (hasSpritized && spritzeCount >= 3) techniqueBonus += 20;
    if (hasWrapped) techniqueBonus += (wrapType === 'paper' ? 30 : wrapType === 'foil' ? 20 : 40);
    if (hasInjected) techniqueBonus += injectionTypes[injectionType].bonus;
    if (waterPanActive) techniqueBonus += 15;
    if (hasReverseSeared) techniqueBonus += 25;
    if (trimLevel === 'competition') techniqueBonus += 20;
    
    const regionalFit = regional.bonus === 'bark' ? barkDevelopment * 0.3 : 15;
    const scienceBonus = (saltPenetration + enzymeActivity + proteinDenaturation) / 15;
    const criticPenalty = criticsPresent ? -10 : 0;
    
    const tastiness = Math.min(100, tempScore * 0.3 + techniqueBonus * 0.2 + regionalFit + scienceBonus + criticPenalty);
    const tenderness = Math.min(100, timingScore * 0.4 + collagenBreakdown * 0.6);
    const fatRendering = Math.min(100, Math.max(0, (internalTemp - 150) * 2.5));
    const bark = Math.min(100, barkDevelopment * 0.7);
    const smokeRing = Math.min(100, smokeRingDepth * 0.8);
    
    setScores({ tastiness, tenderness, fatRendering, bark, smokeRing });
    
    const avgScore = (tastiness + tenderness + fatRendering + bark + smokeRing) / 5;
    setRestaurant(prev => ({...prev, reputation: Math.min(100, prev.reputation + (avgScore - 75) * 0.5)}));
    
    // Check achievements
    const newAchievements = [];
    if (avgScore >= 95) newAchievements.push('Master Pitmaster');
    if (barkDevelopment >= 95) newAchievements.push('Bark Master');
    if (hasReverseSeared && avgScore >= 85) newAchievements.push('Sear Specialist');
    if (livestreamActive && avgScore >= 80) newAchievements.push('Social Media Star');
    setAchievements(prev => [...new Set([...prev, ...newAchievements])]);
  };

  const getOverallScore = () => Math.round((scores.tastiness + scores.tenderness + scores.fatRendering + scores.bark + scores.smokeRing) / 5);

  // Smoker visualization
  const getSmokerView = () => {
    const meat = meatData[selectedMeat];
    const progress = Math.min(100, (internalTemp - 40) / (meat.finishTemp - 40) * 100);
    const dayFilter = timeOfDay === 'night' ? 0.4 : timeOfDay === 'evening' ? 0.7 : 1.0;
    
    return (
      <div className="bg-gray-800 rounded-lg p-4 relative">
        <div className="flex justify-between mb-3">
          <h3 className="text-white font-semibold">🔥 Smoker View</h3>
          <div className="flex gap-2">
            {!livestreamActive ? (
              <button onClick={() => setLivestreamActive(true)} className="text-xs bg-red-600 px-2 py-1 rounded text-white">
                📡 Go Live
              </button>
            ) : (
              <div className="text-xs text-red-400">LIVE • {socialMedia.followers} viewers</div>
            )}
          </div>
        </div>
        
        <div className="relative bg-gray-900 rounded-lg h-48 border-4 border-gray-700"
             style={{ filter: `brightness(${dayFilter})` }}>
          
          {/* Smoke effects */}
          {Array.from({length: Math.min(5, woodChipsAdded)}, (_, i) => (
            <div key={i} className="absolute animate-pulse opacity-60 text-white"
                 style={{
                   left: `${15 + i * 18}%`,
                   top: `${5 + Math.sin(cookTime * 2 + i) * 12}%`,
                   fontSize: '16px'
                 }}>
              💨
            </div>
          ))}
          
          {/* Temperature display */}
          <div className="absolute top-2 left-2 text-xs space-y-1">
            <div className="text-red-400">Temp: {temperature.toFixed(0)}°F</div>
            <div className="text-blue-400">Fuel: {fuelLevel.toFixed(0)}%</div>
            <div className="text-green-400">{timeOfDay}</div>
          </div>
          
          {/* Enhanced meat visualization */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <div className="relative text-5xl transition-all duration-1000"
                 style={{ 
                   filter: `hue-rotate(${barkDevelopment * 2}deg) brightness(${0.6 + barkDevelopment/150})`,
                   transform: `scale(${1 + progress/400})`
                 }}>
              {meat.emoji}
              
              {hasWrapped && (
                <div className="absolute -top-2 -left-2 text-lg">
                  {wrapType === 'foil' ? '🔷' : wrapType === 'paper' ? '📜' : '🔥'}
                </div>
              )}
              {hasInjected && <div className="absolute -top-3 -right-2 text-sm">💉</div>}
              {hasReverseSeared && <div className="absolute -bottom-1 -right-1 text-sm">🔥</div>}
            </div>
            
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-white">
              <div>Bark: {barkDevelopment.toFixed(0)}%</div>
              <div>Ring: {smokeRingDepth.toFixed(0)}%</div>
            </div>
          </div>
          
          {moistureLevel > 85 && <div className="absolute top-6 right-4 text-blue-300">💧</div>}
          {maillardReaction > 40 && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-400">⚗️</div>}
          {waterPanActive && <div className="absolute bottom-2 left-4 text-blue-400">🫗</div>}
          {criticsPresent && <div className="absolute top-2 right-2 text-yellow-400">👨‍💼</div>}
        </div>
        
        <div className="mt-2 text-white text-sm space-y-1">
          {isStalled && <p className="text-red-400">⚠️ The stall at {internalTemp.toFixed(0)}°F!</p>}
          {hasWrapped && <p className="text-yellow-400">🎯 {wrapType} wrap active</p>}
          {barkDevelopment > 90 && <p className="text-amber-400">✨ Perfect bark developing!</p>}
          {criticsPresent && <p className="text-yellow-400">👨‍💼 Food critic present</p>}
          {livestreamActive && <p className="text-purple-400">📡 Streaming live to {socialMedia.followers} fans</p>}
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
            <h1 className="text-6xl font-bold mb-4">🔥 BBQ MASTER ULTIMATE 🔥</h1>
            <p className="text-2xl mb-2">PROFESSIONAL EDITION</p>
            <p className="text-lg text-orange-200">Build your BBQ empire • Master regional styles • Become a legend</p>
          </div>

          <div className="bg-white bg-opacity-10 rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Enter Competition</h2>
            <div className="space-y-4">
              <input type="text" value={playerName} onChange={(e) => setPlayerName(e.target.value)}
                     placeholder="Pit Master name..." className="w-full p-3 rounded-lg bg-gray-700 text-white" />
              <input type="email" value={playerEmail} onChange={(e) => setPlayerEmail(e.target.value)}
                     placeholder="email@bbq.com" className="w-full p-3 rounded-lg bg-gray-700 text-white" />
              
              <div>
                <label className="block text-sm font-semibold mb-2">BBQ Region</label>
                <select value={region} onChange={(e) => setRegion(e.target.value)} 
                        className="w-full p-3 rounded-lg bg-gray-700 text-white">
                  {Object.entries(regions).map(([key, r]) => (
                    <option key={key} value={key}>{r.name} - {r.style}</option>
                  ))}
                </select>
              </div>

              <button onClick={() => playerName && playerEmail && setGameState('avatar')}
                      className="w-full py-3 rounded-lg text-xl font-bold bg-red-600 hover:bg-red-700">
                🚀 Start Your BBQ Journey!
              </button>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-8">Choose Your Pit Master</h1>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(avatars).map(([key, char]) => (
              <div key={key} onClick={() => { setAvatar(key); setGameState('setup'); }}
                   className="bg-white rounded-xl p-6 shadow-xl hover:scale-105 transition-all cursor-pointer">
                <div className="text-6xl mb-3">{char.emoji}</div>
                <h3 className="text-lg font-bold">{char.name}</h3>
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
          <h1 className="text-3xl font-bold text-center text-red-900 mb-6">
            {avatars[avatar].emoji} {playerName} - {regions[region].name} Style Setup
          </h1>

          {/* Equipment selection */}
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 text-center">🔥 Choose Equipment</h3>
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(smokerTypes).map(([key, smoker]) => (
                <div key={key} onClick={() => setSmokerType(key)}
                     className={`p-4 rounded-lg cursor-pointer border-2 ${
                       smokerType === key ? 'bg-red-500 text-white' : 'bg-white hover:bg-red-50'
                     }`}>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{smoker.emoji}</div>
                    <h4 className="font-semibold text-sm">{smoker.name}</h4>
                    <div className="text-xs">${smoker.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prep options */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Trim Level</label>
              <select value={trimLevel} onChange={(e) => setTrimLevel(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white border-2">
                <option value="minimal">Minimal (Fast)</option>
                <option value="standard">Standard (Balanced)</option>
                <option value="competition">Competition (Perfect)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Injection</label>
              <select value={injectionType} onChange={(e) => setInjectionType(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white border-2">
                {Object.entries(injectionTypes).map(([key, inj]) => (
                  <option key={key} value={key}>{inj.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Spritz Type</label>
              <select value={spritzeType} onChange={(e) => setSpritzeType(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white border-2">
                {Object.entries(spritzeTypes).map(([key, spray]) => (
                  <option key={key} value={key}>{spray.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Meat selection */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(meatData).map(([key, meat]) => (
              <div key={key} onClick={() => {
                if (smokerType) {
                  setSelectedMeat(key);
                  setGameState('cooking');
                  // Reset states
                  setCookTime(0); setInternalTemp(40); setIsStalled(false); setFuelLevel(100);
                  setBarkDevelopment(0); setSmokeRingDepth(0); setCollagenBreakdown(0); 
                  setMaillardReaction(0); setSaltPenetration(0); setEnzymeActivity(0); setProteinDenaturation(0);
                  setMoistureLevel(70); setHasSpritized(false); setSpritzeCount(0); setHasWrapped(false);
                  setWoodChipsAdded(1); setHasInjected(false); setWaterPanActive(false); setHasReverseSeared(false);
                  setTimeOfDay('morning'); setBaseTemperature(225); setTemperature(225);
                }
              }} className={`bg-white rounded-xl p-4 shadow-lg hover:scale-105 transition-all ${
                smokerType ? 'cursor-pointer' : 'opacity-50'
              }`}>
                <div className="text-center">
                  <div className="text-4xl mb-2">{meat.emoji}</div>
                  <h3 className="font-bold text-lg">{meat.name}</h3>
                  <div className="text-xs bg-red-500 text-white rounded px-2 py-1 mb-2">{meat.difficulty}</div>
                  <div className="text-sm text-green-600">${(meat.price * (marketPrice/100)).toFixed(0)}</div>
                  <div className="text-xs">🌡️ {meat.idealTemp}°F • ⏰ {meat.idealTime}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Cooking interface
  if (gameState === 'cooking') {
    const meat = meatData[selectedMeat];
    const progress = Math.min(100, (internalTemp - 40) / (meat.finishTemp - 40) * 100);
    const fatProgress = Math.min(100, Math.max(0, (internalTemp - 150) * 2));
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 p-4">
        <div className="max-w-7xl mx-auto text-white">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold">🔥 {playerName} - {meat.name} {meat.emoji}</h1>
            <div className="flex justify-center gap-4 text-sm">
              <span>📍 {regions[region].name}</span>
              <span>🌡️ {temperature.toFixed(0)}°F</span>
              <span>⏰ {(cookTime * 60).toFixed(0)}min</span>
              <span>💰 ${(marketPrice * progress * 0.01).toFixed(0)} value</span>
            </div>
          </div>

          <div className="grid xl:grid-cols-5 gap-4">
            {/* Master controls */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">🎛️ Controls</h3>
              
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Target</span><span>{baseTemperature}°F</span>
                </div>
                <input type="range" min="180" max="500" value={baseTemperature}
                       onChange={(e) => setBaseTemperature(Number(e.target.value))}
                       className="w-full h-2 bg-gray-600 rounded-lg" />
              </div>

              <div className="space-y-2">
                {[
                  ['Intake', intakeVent, setIntakeVent],
                  ['Exhaust', exhaustVent, setExhaustVent],
                  ['Firebox', firebox, setFirebox]
                ].map(([label, value, setter]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs">
                      <span>{label}</span><span>{value}%</span>
                    </div>
                    <input type="range" min="0" max="100" value={value}
                           onChange={(e) => setter(Number(e.target.value))}
                           className="w-full h-1 bg-gray-600 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>

            {/* Techniques */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">🎯 Techniques</h3>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <button onClick={() => sprayMeat(spritzeType)} disabled={spritzeCount >= 8}
                        className="p-2 rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600">
                  💦 Spritz ({spritzeCount}/8)
                </button>
                <button onClick={() => injectMeat(injectionType)} disabled={hasInjected || cookTime > 0.2}
                        className="p-2 rounded bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600">
                  {hasInjected ? '✓ Injected' : '💉 Inject'}
                </button>
                <button onClick={() => wrapMeat('foil')} disabled={hasWrapped || internalTemp < meat.wrapTemp}
                        className="p-2 rounded bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600">
                  🔷 Foil
                </button>
                <button onClick={() => wrapMeat('paper')} disabled={hasWrapped || internalTemp < meat.wrapTemp}
                        className="p-2 rounded bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600">
                  📜 Paper
                </button>
                <button onClick={() => wrapMeat('naked')} disabled={hasWrapped}
                        className="p-2 rounded bg-red-600 hover:bg-red-700 disabled:bg-gray-600">
                  🔥 Naked
                </button>
                <button onClick={() => setWaterPanActive(!waterPanActive)}
                        className={`p-2 rounded ${waterPanActive ? 'bg-green-600' : 'bg-blue-600'}`}>
                  🫗 Water
                </button>
                <button onClick={reverseSear} disabled={hasReverseSeared || internalTemp < meat.finishTemp - 20}
                        className="p-2 rounded bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600">
                  🔥 Sear
                </button>
                <button onClick={addWoodChips} disabled={woodChipsAdded >= 6}
                        className="p-2 rounded bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600">
                  🪵 Wood ({woodChipsAdded}/6)
                </button>
              </div>
            </div>

            {/* Science panel */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">🔬 BBQ Science</h3>
              <div className="space-y-1">
                {[
                  ['🍞 Bark', barkDevelopment, 'bg-amber-600'],
                  ['💍 Smoke Ring', smokeRingDepth, 'bg-pink-500'],
                  ['🧬 Collagen', collagenBreakdown, 'bg-green-500'],
                  ['🫗 Fat Render', fatProgress, 'bg-yellow-500'],
                  ['⚗️ Maillard', maillardReaction, 'bg-orange-500'],
                  ['🧂 Salt', saltPenetration, 'bg-blue-500'],
                  ['🦠 Enzymes', enzymeActivity, 'bg-purple-500'],
                  ['🍖 Protein', proteinDenaturation, 'bg-red-500']
                ].map(([label, value, color]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs">
                      <span>{label}</span><span>{value.toFixed(0)}%</span>
                    </div>
                    <div className="bg-gray-600 rounded h-1">
                      <div className={`h-full rounded transition-all ${color}`} style={{width: `${value}%`}}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business stats */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">🏪 Business</h3>
              <div className="text-xs space-y-2">
                <div className="flex justify-between">
                  <span>Reputation:</span>
                  <span className="text-yellow-300">{restaurant.reputation.toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Followers:</span>
                  <span className="text-purple-300">{socialMedia.followers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="text-green-300">${(progress * marketPrice * 0.1).toFixed(0)}</span>
                </div>
                
                {livestreamActive && (
                  <div className="bg-purple-800 rounded p-2">
                    <div className="text-purple-200 text-xs">📡 LIVE: {socialMedia.followers} viewers</div>
                  </div>
                )}
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">📦 Inventory</h3>
              <div className="space-y-2">
                {Object.entries(inventory).map(([item, amount]) => (
                  <div key={item} className="flex justify-between text-xs">
                    <span className="capitalize">{item}:</span>
                    <span className={amount < 20 ? 'text-red-400' : 'text-green-400'}>{amount}%</span>
                  </div>
                ))}
              </div>
              
              {Object.values(inventory).some(v => v < 20) && (
                <div className="mt-2 bg-red-800 rounded p-2">
                  <p className="text-xs text-red-200">⚠️ Low supplies!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Smoker view */}
          <div className="mt-6">
            {getSmokerView()}
          </div>
          
          {/* Submit button */}
          <div className="text-center mt-6">
            <button onClick={() => { calculateScores(); setGameState('results'); }}
                    disabled={internalTemp < meat.finishTemp}
                    className={`px-8 py-3 rounded-lg font-bold text-lg ${
                      internalTemp >= meat.finishTemp ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600'
                    }`}>
              {internalTemp >= meat.finishTemp ? 'Submit to Judges! 🏆' : `Cook to ${meat.finishTemp}°F`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Results screen
  if (gameState === 'results') {
    const overall = getOverallScore();
    const revenue = Math.round(progress * marketPrice * 0.5);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 p-6 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">🏆 Master Judge Results</h1>
          <div className="text-8xl mb-6">
            {overall >= 95 ? '👑' : overall >= 90 ? '🏆' : overall >= 80 ? '🥇' : overall >= 70 ? '🥈' : '🔥'}
          </div>
          <h2 className="text-4xl font-bold text-yellow-300 mb-8">Final Score: {overall}/100</h2>
          
          <div className="grid grid-cols-5 gap-4 mb-8">
            {Object.entries(scores).map(([cat, score]) => (
              <div key={cat} className="bg-white bg-opacity-10 rounded-lg p-4">
                <h3 className="font-semibold text-sm capitalize mb-2">{cat}</h3>
                <div className="text-2xl font-bold text-yellow-300 mb-2">{score}</div>
                <div className="bg-gray-600 rounded h-2">
                  <div className={`h-full rounded transition-all ${
                    score >= 90 ? 'bg-green-500' : score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} style={{width: `${score}%`}}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">💼 Business Results</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-green-400">Revenue:</span>
                <div className="text-2xl font-bold">${revenue}</div>
              </div>
              <div>
                <span className="text-yellow-400">Reputation:</span>
                <div className="text-2xl font-bold">+{Math.round((overall - 75) * 0.5)}</div>
              </div>
              <div>
                <span className="text-purple-400">New Followers:</span>
                <div className="text-2xl font-bold">+{Math.round(overall * 0.8)}</div>
              </div>
            </div>
          </div>

          {achievements.length > 0 && (
            <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🏅 New Achievements</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                {achievements.slice(-3).map((ach, i) => (
                  <div key={i} className="bg-yellow-600 rounded-full px-4 py-2 text-sm font-semibold">
                    🏆 {ach}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button onClick={() => setGameState('setup')}
                    className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg text-xl font-bold">
              🔥 Cook Again
            </button>
            <button onClick={() => setGameState('business')}
                    className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg text-xl font-bold">
              🏪 Business Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Business dashboard
  if (gameState === 'business') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{playerName}'s BBQ Empire</h1>
              <button onClick={() => setGameState('results')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Back
              </button>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Restaurant Overview</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Reputation</span>
                      <span className="font-bold">{restaurant.reputation.toFixed(0)}%</span>
                    </div>
                    <div className="bg-gray-300 rounded h-2">
                      <div className="bg-green-500 h-full rounded" style={{width: `${restaurant.reputation}%`}}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Capacity: {restaurant.capacity}</div>
                    <div>Revenue: ${Math.round(restaurant.reputation * 5)}/day</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Social Media</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Followers:</span>
                    <span className="font-bold">{socialMedia.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posts:</span>
                    <span>{socialMedia.posts}</span>
                  </div>
                  <div className="bg-purple-100 rounded p-3 mt-4">
                    <div className="font-semibold">Engagement Rate: {(Math.random() * 15 + 5).toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Market Data</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Market Price:</span>
                    <span className="font-bold">${marketPrice.toFixed(2)}/lb</span>
                  </div>
                  
                  <div className="bg-blue-100 rounded p-3">
                    <div className="font-semibold mb-2">Regional Specialty: {regions[region].style}</div>
                    <div className="text-xs">Focus on {regions[region].bonus} for bonus points</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BBQMaster;