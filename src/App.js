import React, { useState, useEffect } from 'react';
import { Timer, Thermometer, Flame, Trophy, RotateCcw, Cloud, Sun, CloudRain, Snowflake, Wind, User, Users, Star, Award, Target } from 'lucide-react';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDC-B4uPpeRgMWhww9PxNOv6BhXCNloHns",
  authDomain: "bbq-master-game.firebaseapp.com",
  databaseURL: "https://bbq-master-game-default-rtdb.firebaseio.com",
  projectId: "bbq-master-game",
  storageBucket: "bbq-master-game.firebasestorage.app",
  messagingSenderId: "487910556603",
  appId: "1:487910556603:web:99c689ebf39e1c83617a9e",
  measurementId: "G-8QB9JN74JN"
};

// Firebase SDK functions (these will work with CDN imports)
let firebaseApp;
let database;

// Initialize Firebase
const initializeFirebase = () => {
  if (typeof window !== 'undefined' && window.firebase) {
    firebaseApp = window.firebase.initializeApp(firebaseConfig);
    database = window.firebase.database();
    console.log('Firebase initialized successfully!');
    return true;
  } else {
    console.warn('Firebase SDK not loaded, using localStorage fallback');
    return false;
  }
};

// Firebase wrapper with localStorage fallback
const firebaseService = {
  database: {
    ref: (path) => ({
      push: async (data) => {
        if (database) {
          try {
            const result = await database.ref(path).push(data);
            return { key: result.key };
          } catch (error) {
            console.error('Firebase push error:', error);
          }
        }
        
        // Fallback to localStorage
        const existing = JSON.parse(localStorage.getItem(`bbq-${path}`) || '[]');
        const newEntry = { ...data, id: Date.now().toString() };
        existing.push(newEntry);
        localStorage.setItem(`bbq-${path}`, JSON.stringify(existing.slice(-100)));
        return { key: newEntry.id };
      },
      on: (event, callback) => {
        if (database) {
          try {
            database.ref(path).on(event, (snapshot) => {
              callback({ val: () => snapshot.val() || [] });
            });
            return;
          } catch (error) {
            console.error('Firebase listener error:', error);
          }
        }
        
        // Fallback to localStorage with periodic updates
        const updateData = () => {
          const data = JSON.parse(localStorage.getItem(`bbq-${path}`) || '[]');
          callback({ val: () => data });
        };
        
        updateData();
        const interval = setInterval(updateData, 5000);
        return () => clearInterval(interval);
      },
      orderByChild: (child) => ({
        limitToLast: (limit) => ({
          on: (event, callback) => {
            if (database) {
              try {
                database.ref(path).orderByChild(child).limitToLast(limit).on(event, (snapshot) => {
                  callback({ val: () => snapshot.val() || [] });
                });
                return;
              } catch (error) {
                console.error('Firebase ordered query error:', error);
              }
            }
            
            // Fallback
            const data = JSON.parse(localStorage.getItem(`bbq-${path}`) || '[]')
              .sort((a, b) => b[child] - a[child])
              .slice(0, limit);
            callback({ val: () => data });
          }
        })
      })
    })
  }
};

const BBQMaster = () => {
  // Core state
  const [gameState, setGameState] = useState('entry');
  const [playerName, setPlayerName] = useState('');
  const [playerEmail, setPlayerEmail] = useState('');
  const [selectedMeat, setSelectedMeat] = useState(null);
  const [smokerType, setSmokerType] = useState(null);
  const [region, setRegion] = useState('texas');
  const [weather, setWeather] = useState('sunny');
  const [expertTipsEnabled, setExpertTipsEnabled] = useState(false);
  const [currentTip, setCurrentTip] = useState(null);
  const [tipTimer, setTipTimer] = useState(0);

  // Cooking state
  const [temperature, setTemperature] = useState(225);
  const [cookTime, setCookTime] = useState(0);
  const [internalTemp, setInternalTemp] = useState(40);
  const [fuelLevel, setFuelLevel] = useState(100);
  const [woodChipsAdded, setWoodChipsAdded] = useState(0);
  const [spritzeCount, setSpritzeCount] = useState(0);
  const [hasWrapped, setHasWrapped] = useState(false);
  const [wrapType, setWrapType] = useState(null);
  const [currentAction, setCurrentAction] = useState('');
  const [actionTimer, setActionTimer] = useState(0);
  const [isStalled, setIsStalled] = useState(false);
  const [stallStartTime, setStallStartTime] = useState(0);
  
  // Quality metrics
  const [barkDevelopment, setBarkDevelopment] = useState(0);
  const [moistureLevel, setMoistureLevel] = useState(100);
  const [smokeRingDepth, setSmokeRingDepth] = useState(0);
  const [collagenBreakdown, setCollagenBreakdown] = useState(0);
  const [fatRendering, setFatRendering] = useState(0);
  const [flavorComplex, setFlavorComplex] = useState(50);

  // Game settings
  const [waterPanActive, setWaterPanActive] = useState(false);
  const [pitMasterMode, setPitMasterMode] = useState(false);
  const [damperPosition, setDamperPosition] = useState(50);
  const [hourlyReports, setHourlyReports] = useState([]);
  const [lastReportHour, setLastReportHour] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Meat definitions
  const meatData = {
    brisket: { name: 'Brisket', emoji: '🥩', difficulty: 'expert', idealTemp: 250, idealTime: 12, wrapTemp: 160, finishTemp: 203, price: 150 },
    ribs: { name: 'Ribs', emoji: '🖤', difficulty: 'beginner', idealTemp: 225, idealTime: 6, wrapTemp: 165, finishTemp: 195, price: 80 },
    'burnt-ends': { name: 'Burnt Ends', emoji: '🔥', difficulty: 'intermediate', idealTemp: 275, idealTime: 8, wrapTemp: 165, finishTemp: 195, price: 120 },
    'pork-shoulder': { name: 'Pork Shoulder', emoji: '🐷', difficulty: 'intermediate', idealTemp: 225, idealTime: 14, wrapTemp: 165, finishTemp: 205, price: 90 },
    'beef-ribs': { name: 'Beef Ribs', emoji: '🦴', difficulty: 'expert', idealTemp: 275, idealTime: 10, wrapTemp: 170, finishTemp: 210, price: 200 },
    salmon: { name: 'Salmon', emoji: '🟠', difficulty: 'advanced', idealTemp: 200, idealTime: 2, wrapTemp: 140, finishTemp: 145, price: 40 }
  };

  // Smoker types
  const smokerTypes = {
    offset: { name: 'Offset Smoker', emoji: '🏭', difficulty: 'hard', tempStability: 0.3 },
    kettle: { name: 'Weber Kettle', emoji: '⚫', difficulty: 'medium', tempStability: 0.6 },
    pellet: { name: 'Pellet Grill', emoji: '🎛️', difficulty: 'easy', tempStability: 0.9 },
    kamado: { name: 'Kamado Grill', emoji: '🥚', difficulty: 'medium', tempStability: 0.8 },
    electric: { name: 'Electric Smoker', emoji: '⚡', difficulty: 'beginner', tempStability: 0.95 }
  };

  // Regional styles
  const regions = {
    texas: { name: 'Texas', style: 'Salt & Pepper', tempBonus: 5 },
    kansas: { name: 'Kansas City', style: 'Sweet & Saucy', moistureBonus: 10 },
    carolina: { name: 'Carolina', style: 'Vinegar Based', acidBonus: 8 },
    memphis: { name: 'Memphis', style: 'Dry Rub', barkBonus: 12 }
  };

  // Weather effects
  const weatherEffects = {
    sunny: { name: 'Sunny', emoji: '☀️', tempVariance: 0.1, fuelConsumption: 1.0 },
    windy: { name: 'Windy', emoji: '💨', tempVariance: 0.3, fuelConsumption: 1.5 },
    rainy: { name: 'Rainy', emoji: '🌧️', tempVariance: 0.2, fuelConsumption: 1.2 },
    cold: { name: 'Cold', emoji: '❄️', tempVariance: 0.15, fuelConsumption: 1.8 }
  };

  // Initialize Firebase and leaderboard
  useEffect(() => {
    // Wait for Firebase to load, then initialize
    const initFirebaseWhenReady = () => {
      if (typeof window !== 'undefined' && window.firebase) {
        const firebaseReady = initializeFirebase();
        console.log('Firebase ready:', firebaseReady);
      } else {
        console.log('Waiting for Firebase SDK to load...');
        setTimeout(initFirebaseWhenReady, 1000);
      }
    };
    
    initFirebaseWhenReady();
    
    // Initialize leaderboard listener
    const unsubscribe = firebaseService.database.ref('leaderboard')
      .orderByChild('score')
      .limitToLast(20)
      .on('value', (snapshot) => {
        const data = snapshot.val() || [];
        console.log('Leaderboard data received:', data);
        const sortedData = Array.isArray(data) ? 
          data.sort((a, b) => b.score - a.score) : 
          Object.values(data).sort((a, b) => b.score - a.score);
        setLeaderboard(sortedData);
      });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Log player login for email notifications
  const logPlayerLogin = async (playerName, playerEmail) => {
    try {
      console.log('Attempting to log player login:', playerName);
      await firebaseService.database.ref('player-logins').push({
        name: playerName,
        email: playerEmail || 'anonymous',
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        location: 'Unknown'
      });
      console.log('✅ Player login logged successfully for:', playerName);
    } catch (error) {
      console.error('❌ Failed to log player login:', error);
    }
  };

  // Save score to leaderboard
  const saveScoreToLeaderboard = async (finalScore) => {
    try {
      console.log('Attempting to save score:', finalScore, 'for player:', playerName);
      const scoreData = {
        name: playerName,
        email: playerEmail || 'anonymous', 
        score: finalScore,
        meat: selectedMeat,
        smoker: smokerType,
        region: region,
        weather: weather,
        cookTime: Math.round(cookTime * 100) / 100,
        barkScore: Math.round(barkDevelopment),
        moistureScore: Math.round(moistureLevel),
        smokeScore: Math.round(smokeRingDepth),
        timestamp: Date.now(),
        date: new Date().toLocaleDateString()
      };
      
      const result = await firebaseService.database.ref('leaderboard').push(scoreData);
      console.log('✅ Score saved successfully with key:', result.key);
      console.log('Score data:', scoreData);
    } catch (error) {
      console.error('❌ Failed to save score:', error);
    }
  };

  // Main game loop
  useEffect(() => {
    if (gameState === 'cooking') {
      const interval = setInterval(() => {
        setCookTime(prev => prev + 1/60); // 1 second = 1 minute
        
        // Temperature fluctuations based on weather and fuel
        const weatherEffect = weatherEffects[weather];
        const baseVariance = weatherEffect.tempVariance;
        const smokerStability = smokerTypes[smokerType].tempStability;
        const fuelEffect = fuelLevel < 20 ? 0.5 : 1.0;
        
        // Electric smokers are much more stable
        const tempChangeMultiplier = smokerType === 'electric' ? 0.3 : 1.0;
        const tempChange = (Math.random() - 0.5) * baseVariance * 10 * fuelEffect * tempChangeMultiplier * (1 - smokerStability);
        
        setTemperature(prev => {
          let newTemp = prev + tempChange;
          
          // Weather-specific effects (reduced for electric)
          if (weather === 'cold') newTemp -= smokerType === 'electric' ? 1 : 2;
          if (weather === 'windy' && smokerType !== 'electric') newTemp += Math.random() * 8 - 4;
          
          return Math.max(100, Math.min(400, newTemp));
        });

        // Fuel consumption
        const fuelConsumption = smokerType === 'electric' ? 0.2 : 0.5;
        setFuelLevel(prev => Math.max(0, prev - (fuelConsumption * weatherEffects[weather].fuelConsumption)));

        // Temperature-based cooking progression
        const tempDiff = Math.abs(temperature - meatData[selectedMeat].idealTemp);
        const efficiency = Math.max(0.1, 1 - (tempDiff / 100));
        
        // Internal temperature progression
        setInternalTemp(prev => {
          let increase = 0.8 * efficiency;
          
          // Stall simulation (between 150-170°F)
          if (prev >= 150 && prev <= 170 && !hasWrapped) {
            if (!isStalled) {
              setIsStalled(true);
              setStallStartTime(cookTime);
            }
            increase *= 0.1;
          } else if (isStalled && (hasWrapped || prev > 170)) {
            setIsStalled(false);
          }
          
          return Math.min(220, prev + increase);
        });

        // Quality metrics
        setBarkDevelopment(prev => {
          if (temperature >= 225 && temperature <= 275 && !hasWrapped && cookTime >= 1) {
            const barkRate = 0.4 * efficiency;
            const regionBonus = regions[region].barkBonus || 0;
            return Math.min(100, prev + barkRate + (regionBonus * 0.05));
          }
          if (hasWrapped && wrapType === 'foil') return Math.max(0, prev - 0.2);
          return prev;
        });

        setCollagenBreakdown(prev => {
          if (internalTemp >= 160 && temperature >= 200) {
            const rate = (internalTemp - 160) * 0.08;
            return Math.min(100, prev + rate);
          }
          return prev;
        });

        setSmokeRingDepth(prev => {
          if (internalTemp < 140 && woodChipsAdded > 0 && temperature >= 200) {
            const rate = 0.4 * (woodChipsAdded / 12);
            return Math.min(100, prev + rate);
          }
          return prev;
        });

        setMoistureLevel(prev => {
          let moisture = prev;
          if (temperature > 275) moisture -= 0.8;
          if (waterPanActive) moisture += 0.3;
          if (spritzeCount > 0 && cookTime >= 2) moisture += 0.2;
          if (hasWrapped && wrapType === 'foil') moisture += 0.4;
          if (hasWrapped && wrapType === 'paper') moisture += 0.1;
          return Math.max(0, Math.min(100, moisture));
        });

      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, temperature, selectedMeat, hasWrapped, wrapType, region, weather, cookTime, internalTemp, woodChipsAdded, spritzeCount, waterPanActive, fuelLevel, isStalled, smokerType, damperPosition]);

  // Game functions
  const startGame = () => {
    setGameState('setup');
    logPlayerLogin(playerName, playerEmail);
  };
  
  const beginCooking = () => {
    if (selectedMeat && smokerType) {
      setGameState('cooking');
      setTemperature(meatData[selectedMeat].idealTemp);
      setInternalTemp(40);
      setCookTime(0);
    }
  };

  const sprayMeat = () => {
    if (spritzeCount < 5 && cookTime >= 0.05) {
      setSpritzeCount(prev => prev + 1);
      setBarkDevelopment(prev => Math.min(100, prev + 8));
      setMoistureLevel(prev => Math.min(100, prev + 15));
      setCurrentAction('spritzing');
      setActionTimer(3);
    }
  };

  const addWoodChips = () => {
    if (woodChipsAdded < 12 && fuelLevel > 10) {
      setWoodChipsAdded(prev => prev + 1);
      setFuelLevel(prev => prev - 5);
      setSmokeRingDepth(prev => Math.min(100, prev + 6));
      setFlavorComplex(prev => Math.min(100, prev + 4));
      setCurrentAction('adding wood chips');
      setActionTimer(4);
    }
  };

  const wrapMeat = (type) => {
    if (internalTemp >= meatData[selectedMeat].wrapTemp && !hasWrapped) {
      setHasWrapped(true);
      setWrapType(type);
      setCurrentAction('wrapping');
      setActionTimer(4);
      setIsStalled(false);
      
      if (type === 'foil') {
        setMoistureLevel(prev => Math.min(100, prev + 30));
        setBarkDevelopment(prev => Math.max(0, prev - 10));
      } else if (type === 'paper') {
        setMoistureLevel(prev => Math.min(100, prev + 15));
        setBarkDevelopment(prev => Math.min(100, prev + 5));
      }
    }
  };

  const addFuel = () => {
    if (fuelLevel < 80) {
      setFuelLevel(100);
      setCurrentAction('adding fuel');
      setActionTimer(5);
    }
  };

  const toggleWaterPan = () => {
    setWaterPanActive(prev => !prev);
    setCurrentAction(waterPanActive ? 'removing water pan' : 'adding water pan');
    setActionTimer(3);
  };

  const calculateScore = () => {
    if (!selectedMeat) return 0;
    
    const meat = meatData[selectedMeat];
    const timeDiff = Math.abs(cookTime - meat.idealTime);
    const tempDiff = Math.abs(internalTemp - meat.finishTemp);
    
    const timeScore = Math.max(0, 100 - (timeDiff * 15));
    const tempScore = Math.max(0, 100 - (tempDiff * 8));
    const barkScore = Math.max(0, barkDevelopment - 20);
    const moistureScore = Math.max(0, moistureLevel - 10);
    const smokeScore = Math.max(0, smokeRingDepth - 15);
    const collagenScore = selectedMeat === 'ribs' || selectedMeat === 'brisket' ? 
                         Math.max(0, collagenBreakdown - 30) : 100;
    
    const regionBonus = regions[region].tempBonus || 0;
    const weatherPenalty = weather === 'windy' ? 10 : weather === 'rainy' ? 5 : 0;
    
    const totalScore = Math.max(0, Math.min(100, 
      (timeScore + tempScore + barkScore + moistureScore + smokeScore + collagenScore) / 6 
      + regionBonus - weatherPenalty
    ));
    
    return Math.round(totalScore);
  };

  const resetGame = () => {
    setGameState('setup');
    setSelectedMeat(null);
    setSmokerType(null);
    setTemperature(225);
    setCookTime(0);
    setInternalTemp(40);
    setFuelLevel(100);
    setWoodChipsAdded(0);
    setSpritzeCount(0);
    setHasWrapped(false);
    setWrapType(null);
    setBarkDevelopment(0);
    setMoistureLevel(100);
    setSmokeRingDepth(0);
    setCollagenBreakdown(0);
    setFatRendering(0);
    setFlavorComplex(50);
    setWaterPanActive(false);
    setPitMasterMode(false);
    setDamperPosition(50);
    setIsStalled(false);
    setCurrentAction('');
    setActionTimer(0);
    setCurrentTip(null);
    setTipTimer(0);
    setHourlyReports([]);
    setLastReportHour(0);
  };

  // Entry Screen
  if (gameState === 'entry') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-black text-white p-8 relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className="mb-8 relative">
            <div className="text-8xl mb-4 relative">
              <div className="inline-block animate-pulse">
                <span className="text-orange-500 animate-bounce" style={{ animationDuration: '0.8s' }}>🔥</span>
                <span className="text-red-500 animate-bounce mx-2" style={{ animationDuration: '1.1s', animationDelay: '0.2s' }}>🔥</span>
                <span className="text-yellow-500 animate-bounce" style={{ animationDuration: '0.9s', animationDelay: '0.4s' }}>🔥</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent animate-pulse">
              BBQ MASTER
            </h1>
            
            <div className="mb-6 relative">
              <div className="text-6xl mb-2">🏭</div>
              <div className="text-lg opacity-90 bg-black bg-opacity-50 rounded-lg p-4 backdrop-blur-sm">
                🌟 Championship Pitmaster Simulator 🌟
                <br />
                <span className="text-sm opacity-80">Master the art of low & slow cooking</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8 bg-black bg-opacity-40 p-8 rounded-xl backdrop-blur-sm border border-orange-500 border-opacity-30">
            <input
              type="text"
              placeholder="Enter your pitmaster name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-900 bg-opacity-80 text-white text-center text-xl border border-orange-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-400 transition-all"
            />
            
            <input
              type="email"
              placeholder="Email (optional, for global leaderboard)"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-900 bg-opacity-80 text-white text-center border border-orange-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-400 transition-all"
            />

            <div className="flex items-center space-x-3 justify-center bg-orange-900 bg-opacity-50 p-3 rounded-lg">
              <input 
                type="checkbox" 
                id="expertTips" 
                checked={expertTipsEnabled} 
                onChange={(e) => setExpertTipsEnabled(e.target.checked)}
                className="w-5 h-5 text-orange-500" 
              />
              <label htmlFor="expertTips" className="text-sm font-semibold">
                💡 Get coaching from BBQ legends
              </label>
            </div>
          </div>
          
          <button
            onClick={startGame}
            disabled={!playerName.trim()}
            className={`w-full py-6 px-8 rounded-xl text-2xl font-bold transition-all transform hover:scale-105 relative overflow-hidden ${
              playerName.trim() 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 shadow-2xl shadow-orange-500/50' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            <span className="relative z-10">🚀 FIRE UP THE SMOKER! 🚀</span>
          </button>

          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-full mt-4 py-3 px-8 rounded-xl text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all transform hover:scale-105"
          >
            🏆 View Global Leaderboard 🏆
          </button>
        </div>
      </div>
    );
  }

  // Setup Screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 to-red-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">🔥 Welcome {playerName}! Set Up Your Cook</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">🥩 Choose Your Cut</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(meatData).map(([key, meat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMeat(key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedMeat === key 
                        ? 'border-orange-400 bg-orange-800' 
                        : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-3xl mb-2">{meat.emoji}</div>
                    <div className="font-semibold">{meat.name}</div>
                    <div className="text-sm opacity-80">{meat.difficulty}</div>
                    <div className="text-xs opacity-60">${meat.price}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">🏭 Choose Your Smoker</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(smokerTypes).map(([key, smoker]) => (
                  <button
                    key={key}
                    onClick={() => setSmokerType(key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      smokerType === key 
                        ? 'border-orange-400 bg-orange-800' 
                        : 'border-gray-600 bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-3xl mb-2">{smoker.emoji}</div>
                    <div className="font-semibold">{smoker.name}</div>
                    <div className="text-sm opacity-80">{smoker.difficulty}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div>
              <label className="block text-sm font-semibold mb-2">🌡️ Weather Challenge</label>
              <select value={weather} onChange={(e) => setWeather(e.target.value)} 
                      className="w-full p-3 rounded-lg bg-gray-700 text-white">
                {Object.entries(weatherEffects).map(([key, w]) => (
                  <option key={key} value={key}>{w.emoji} {w.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">🗺️ BBQ Region</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} 
                      className="w-full p-3 rounded-lg bg-gray-700 text-white">
                {Object.entries(regions).map(([key, r]) => (
                  <option key={key} value={key}>{r.name} - {r.style}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={pitMasterMode} onChange={(e) => setPitMasterMode(e.target.checked)} />
                <span className="text-sm">🧑‍🍳 Pit Master Assistant</span>
              </label>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={beginCooking}
              disabled={!selectedMeat || !smokerType}
              className={`py-4 px-12 rounded-lg text-xl font-bold transition-colors ${
                selectedMeat && smokerType 
                  ? 'bg-orange-600 hover:bg-orange-700' 
                  : 'bg-gray-600 cursor-not-allowed'
              }`}
            >
              🔥 Fire Up The Smoker!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cooking Screen
  if (gameState === 'cooking') {
    const meat = meatData[selectedMeat];
    const isFinished = internalTemp >= meat.finishTemp;
    const cookingProgress = Math.min(100, (cookTime / meat.idealTime) * 100);
    const tempProgress = Math.min(100, (internalTemp / meat.finishTemp) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
              {meat.emoji} Smoking {meat.name} - {playerName}
            </h1>
            <div className="text-sm opacity-80 mt-1">
              {smokerTypes[smokerType].emoji} {smokerTypes[smokerType].name} | 
              {weatherEffects[weather].emoji} {weatherEffects[weather].name} | 
              {regions[region].name} Style
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Controls */}
            <div className="xl:col-span-2 space-y-6">
              {/* Temperature Control */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Thermometer className="mr-2" size={24} />
                  Temperature Control
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2">Smoker Temperature</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="150"
                        max="350"
                        value={temperature}
                        onChange={(e) => setTemperature(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-2xl font-bold w-20 text-center">
                        {Math.round(temperature)}°F
                      </span>
                    </div>
                    <div className="text-xs mt-1 opacity-70">
                      Target: {meat.idealTemp}°F
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Internal Temperature</label>
                    <div className="text-2xl font-bold text-center p-3 bg-gray-700 rounded">
                      {Math.round(internalTemp)}°F
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${tempProgress}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1 opacity-70 text-center">
                      Target: {meat.finishTemp}°F
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="font-semibold mb-4">🎯 Techniques & Controls</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button
                    onClick={sprayMeat}
                    disabled={spritzeCount >= 5 || cookTime < 0.05}
                    className={`p-3 rounded text-sm font-semibold ${
                      cookTime >= 0.05 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    💦 Spritz ({spritzeCount}/5)
                  </button>
                  
                  <button
                    onClick={addWoodChips}
                    disabled={woodChipsAdded >= 12 || fuelLevel <= 10}
                    className={`p-3 rounded text-sm font-semibold ${
                      fuelLevel > 10 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    🌳 Wood ({woodChipsAdded}/12)
                  </button>
                  
                  <button
                    onClick={() => wrapMeat('paper')}
                    disabled={internalTemp < meat.wrapTemp || hasWrapped}
                    className={`p-3 rounded text-sm font-semibold ${
                      internalTemp >= meat.wrapTemp && !hasWrapped 
                        ? 'bg-yellow-600 hover:bg-yellow-700' 
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    📦 Butcher Paper
                  </button>
                  
                  <button
                    onClick={() => wrapMeat('foil')}
                    disabled={internalTemp < meat.wrapTemp || hasWrapped}
                    className={`p-3 rounded text-sm font-semibold ${
                      internalTemp >= meat.wrapTemp && !hasWrapped 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    🃏 Foil Wrap
                  </button>

                  <button
                    onClick={addFuel}
                    disabled={fuelLevel >= 80}
                    className={`p-3 rounded text-sm font-semibold ${
                      fuelLevel < 80 ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  >
                    ⛽ Add Fuel
                  </button>

                  <button
                    onClick={toggleWaterPan}
                    className="p-3 rounded text-sm font-semibold bg-cyan-600 hover:bg-cyan-700"
                  >
                    💧 Water Pan {waterPanActive ? 'ON' : 'OFF'}
                  </button>

                  <div className="col-span-2">
                    <label className="block text-xs mb-1">Damper Position</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={damperPosition}
                      onChange={(e) => setDamperPosition(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-center">{damperPosition}% Open</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <div className="space-y-6">
              {/* Timer and Progress */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Timer className="mr-2" size={24} />
                  Cook Status
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cook Time</span>
                      <span>{Math.floor(cookTime)}h {Math.floor((cookTime % 1) * 60)}m</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${cookingProgress}%` }}
                      />
                    </div>
                    <div className="text-xs opacity-70 mt-1">Target: {meat.idealTime}h</div>
                  </div>

                  <div>
                    <div className="text-sm mb-2">Fuel Level</div>
                    <div className="w-full bg-gray-600 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          fuelLevel > 30 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${fuelLevel}%` }}
                      />
                    </div>
                  </div>

                  {isStalled && (
                    <div className="bg-yellow-900 border border-yellow-600 rounded p-3 text-sm">
                      ⚠️ The Stall! Temp holding steady...
                      <div className="text-xs opacity-80">
                        Duration: {Math.floor((cookTime - stallStartTime) * 60)} min
                      </div>
                    </div>
                  )}

                  {currentAction && (
                    <div className="bg-blue-900 border border-blue-600 rounded p-3 text-sm">
                      🧑‍🍳 {pitMasterMode ? 'Pit Master' : 'You'}: {currentAction}
                      {actionTimer > 0 && ` (${actionTimer}s)`}
                    </div>
                  )}
                </div>
              </div>

              {/* Quality Metrics */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">🧬 Live Science</h3>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bark Development</span>
                      <span>{Math.round(barkDevelopment)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${barkDevelopment}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Collagen Breakdown</span>
                      <span>{Math.round(collagenBreakdown)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-pink-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${collagenBreakdown}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Smoke Ring</span>
                      <span>{Math.round(smokeRingDepth)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${smokeRingDepth}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Moisture Level</span>
                      <span>{Math.round(moistureLevel)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${moistureLevel}%` }}
                      />
                    </div>
                  </div>
                </div>

                {hasWrapped && (
                  <div className="mt-4 p-3 bg-yellow-900 border border-yellow-600 rounded text-sm">
                    📦 Wrapped in {wrapType === 'foil' ? 'Aluminum Foil' : 'Butcher Paper'}
                  </div>
                )}
              </div>

              {/* Finish Button */}
              {isFinished && (
                <button
                  onClick={() => setGameState('results')}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg text-xl animate-pulse"
                >
                  🎯 Finish & Score!
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const score = calculateScore();
    const grade = score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D';
    
    // Save score immediately when results screen loads
    useEffect(() => {
      if (selectedMeat && playerName) {
        console.log('Results screen loaded, saving score:', score);
        saveScoreToLeaderboard(score);
      }
    }, [selectedMeat, playerName, score, cookTime, barkDevelopment, moistureLevel, smokeRingDepth, collagenBreakdown, internalTemp]);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-8">🏆 Cook Complete!</h1>
          
          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4">Final Score: {score}/100</h2>
            <div className="text-6xl mb-4">
              {grade === 'A+' ? '🏆' : grade === 'A' ? '🥇' : grade === 'B' ? '🥈' : grade === 'C' ? '🥉' : '📚'}
            </div>
            <div className="text-2xl font-semibold">Grade: {grade}</div>
            <div className="text-sm opacity-70 mt-2">Score saved to global leaderboard!</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-lg font-semibold">Bark Quality</div>
              <div className="text-2xl">{Math.round(barkDevelopment)}%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-lg font-semibold">Moisture</div>
              <div className="text-2xl">{Math.round(moistureLevel)}%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-lg font-semibold">Smoke Ring</div>
              <div className="text-2xl">{Math.round(smokeRingDepth)}%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-lg font-semibold">Tenderness</div>
              <div className="text-2xl">{Math.round(collagenBreakdown)}%</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-lg font-semibold">Cook Time</div>
              <div className="text-2xl">{Math.floor(cookTime)}h {Math.floor((cookTime % 1) * 60)}m</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-lg font-semibold">Techniques</div>
              <div className="text-2xl">{spritzeCount + (hasWrapped ? 1 : 0) + woodChipsAdded}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={resetGame}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              🔥 Cook Another Cut
            </button>
            <button
              onClick={() => setShowLeaderboard(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              🏆 View Leaderboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Leaderboard Screen
  if (showLeaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">🏆 Global BBQ Leaderboard</h1>
            <button 
              onClick={() => setShowLeaderboard(false)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              ✕ Close
            </button>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            {leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-xl opacity-80">No scores yet - be the first BBQ Master!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-300 border-b border-gray-600 pb-2">
                  <div>Rank</div>
                  <div>Pitmaster</div>
                  <div>Score</div>
                  <div>Meat</div>
                  <div>Region</div>
                  <div>Date</div>
                </div>
                
                {leaderboard.map((entry, index) => (
                  <div 
                    key={entry.id || index} 
                    className={`grid grid-cols-6 gap-4 py-3 px-4 rounded-lg transition-colors ${
                      index < 3 ? 'bg-yellow-900 bg-opacity-30 border border-yellow-600' : 'bg-gray-700'
                    } hover:bg-gray-600`}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </span>
                    </div>
                    <div className="font-semibold">
                      {entry.name}
                      {entry.name === playerName && (
                        <span className="ml-2 text-xs bg-blue-600 px-2 py-1 rounded">YOU</span>
                      )}
                    </div>
                    <div className="text-xl font-bold text-orange-400">{entry.score}</div>
                    <div className="flex items-center">
                      <span className="mr-1">{meatData[entry.meat]?.emoji}</span>
                      <span className="text-sm">{meatData[entry.meat]?.name}</span>
                    </div>
                    <div className="text-sm">{regions[entry.region]?.name}</div>
                    <div className="text-sm text-gray-400">{entry.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BBQMaster;