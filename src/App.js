import React, { useState, useEffect } from 'react';
import { Timer, Thermometer, Flame, Trophy, RotateCcw, Cloud, Sun, CloudRain, Snowflake, Wind, User, Users, Star, Award, Target } from 'lucide-react';

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

  // Meat definitions
  const meatData = {
    brisket: { name: 'Brisket', emoji: '🥩', difficulty: 'expert', idealTemp: 250, idealTime: 12, wrapTemp: 160, finishTemp: 203, price: 150 },
    ribs: { name: 'Ribs', emoji: '🍖', difficulty: 'beginner', idealTemp: 225, idealTime: 6, wrapTemp: 165, finishTemp: 195, price: 80 },
    'burnt-ends': { name: 'Burnt Ends', emoji: '🔥', difficulty: 'intermediate', idealTemp: 275, idealTime: 8, wrapTemp: 165, finishTemp: 195, price: 120 },
    'pork-shoulder': { name: 'Pork Shoulder', emoji: '🐷', difficulty: 'intermediate', idealTemp: 225, idealTime: 14, wrapTemp: 165, finishTemp: 205, price: 90 },
    'beef-ribs': { name: 'Beef Ribs', emoji: '🦴', difficulty: 'expert', idealTemp: 275, idealTime: 10, wrapTemp: 170, finishTemp: 210, price: 200 },
    salmon: { name: 'Salmon', emoji: '🐟', difficulty: 'advanced', idealTemp: 200, idealTime: 2, wrapTemp: 140, finishTemp: 145, price: 40 }
  };

  // Smoker types
  const smokerTypes = {
    offset: { name: 'Offset Smoker', emoji: '🏭', difficulty: 'hard', tempStability: 0.3 },
    kettle: { name: 'Weber Kettle', emoji: '⚫', difficulty: 'medium', tempStability: 0.6 },
    pellet: { name: 'Pellet Grill', emoji: '🎛️', difficulty: 'easy', tempStability: 0.9 },
    kamado: { name: 'Kamado Grill', emoji: '🥚', difficulty: 'medium', tempStability: 0.8 }
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

  // Expert BBQ tips based on real techniques
  const getExpertTip = () => {
    const meat = selectedMeat ? meatData[selectedMeat] : null;
    if (!meat || !expertTipsEnabled) return null;

    // Temperature management tips
    if (temperature > meat.idealTemp + 25) {
      const tips = [
        "🌡️ Aaron Franklin tip: 'Too hot! Open your exhaust damper and reduce airflow to bring temp down.'",
        "🌡️ Nick Kittle tip: 'Running hot - close your intake damper halfway and monitor for 15 minutes.'",
        "🌡️ Harry Soo tip: 'Temperature spike! Remove some fuel and open all vents to cool down fast.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }
    
    if (temperature < meat.idealTemp - 25) {
      const tips = [
        "🔥 Myron Mixon tip: 'Running cold - add more fuel and close dampers to trap heat.'",
        "🔥 Chris Fabian tip: 'Low temps kill the cook - add dry fuel and close your exhaust damper.'",
        "🔥 Nick Kittle tip: 'Cold smoker needs help - check your fire box and add kindling.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    // Timing-based tips
    if (cookTime >= 2 && selectedMeat === 'brisket' && spritzeCount === 0) {
      const tips = [
        "💦 Franklin BBQ tip: 'After 2 hours, start spritzing with apple juice mix every hour to build bark.'",
        "💦 Harry Soo tip: 'Time to start spritzing! Use apple cider vinegar and water for better bark.'",
        "💦 Chris Fabian tip: 'Two hour mark - begin your spritz routine with apple juice and bourbon.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (cookTime >= 4 && woodChipsAdded < 6 && internalTemp < 140) {
      const tips = [
        "🌳 Malcolm Reed tip: 'Add more wood chips now - smoke absorption stops around 140°F internal temp.'",
        "🌳 Nick Kittle tip: 'Last chance for smoke! Get those chips on before 140°F internal.'",
        "🌳 Chris Fabian tip: 'Smoke ring formation ends at 140°F - load up the wood now!'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (isStalled && !hasWrapped && cookTime >= 6) {
      const tips = [
        "📦 Texas Crutch tip: 'The stall is your friend for bark, but wrap in butcher paper if you need to power through.'",
        "📦 Harry Soo tip: 'Stall means collagen is breaking down - be patient or wrap in foil for speed.'",
        "📦 Chris Fabian tip: 'This is where champions are made - push through or wrap smart.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    // Meat-specific advice
    if (selectedMeat === 'ribs' && cookTime >= 4) {
      const tips = [
        "🦴 Baby Back tip: 'Try the bend test - ribs are done when they crack slightly when lifted with tongs.'",
        "🦴 Nick Kittle tip: 'Ribs should bend without breaking - look for that perfect flexibility.'",
        "🦴 Harry Soo tip: 'Toothpick test time! Should slide through the meat like butter.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (selectedMeat === 'brisket' && internalTemp >= 195 && !hasWrapped) {
      const tips = [
        "🥩 Pit Master tip: 'Consider a reverse sear - wrap now and finish hot for amazing bark.'",
        "🥩 Chris Fabian tip: 'Brisket looks ready for the final push - wrap tight and finish strong.'",
        "🥩 Aaron Franklin tip: 'This is the money time - wrap or go naked, both can work beautifully.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (weather === 'rainy' && !waterPanActive) {
      return "🌧️ Rain day tip: 'High humidity day - you might not need a water pan. Natural moisture in the air helps.'";
    }

    if (weather === 'windy' && damperPosition > 70) {
      return "💨 Nick Kittle tip: 'Windy day - close your dampers more to prevent temperature swings.'";
    }

    // Advanced tips
    if (collagenBreakdown > 70 && !hasWrapped) {
      const tips = [
        "🧬 Science tip: 'Collagen is breaking down nicely - you could go naked (no wrap) for maximum bark if you're feeling confident.'",
        "🧬 Chris Fabian tip: 'Collagen conversion is happening - this is where patience pays off big time.'",
        "🧬 Harry Soo tip: 'Perfect breakdown happening - trust the process and let it ride.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    if (barkDevelopment > 80) {
      const tips = [
        "🟤 Aaron Franklin tip: 'Beautiful bark formation - this is what separates the pros from amateurs.'",
        "🟤 Chris Fabian tip: 'That bark is money! You're cooking like a true pit master now.'"
      ];
      return tips[Math.floor(Math.random() * tips.length)];
    }

    return null;
  };

  // Generate hourly report card
  const generateHourlyReport = (hour) => {
    const meat = meatData[selectedMeat];
    const report = {
      hour,
      tempGrade: 'F',
      barkGrade: 'F',
      techniqueGrade: 'F',
      overallGrade: 'F',
      feedback: [],
      improvements: [],
      detailedAnalysis: []
    };

    // Temperature management grade
    const tempDiff = Math.abs(temperature - meat.idealTemp);
    if (tempDiff <= 10) {
      report.tempGrade = 'A';
      report.feedback.push("🌡️ Excellent temperature control!");
      report.detailedAnalysis.push(`Perfect temp stability at ${Math.round(temperature)}°F - you're in the money zone`);
    } else if (tempDiff <= 25) {
      report.tempGrade = 'B';
      report.feedback.push("🌡️ Good temperature, minor fluctuations");
      report.detailedAnalysis.push(`Decent control but ${Math.round(tempDiff)}°F variance - tighten up those dampers`);
    } else if (tempDiff <= 40) {
      report.tempGrade = 'C';
      report.improvements.push(`🌡️ Temperature ${temperature > meat.idealTemp ? 'too high' : 'too low'} - adjust dampers`);
      report.detailedAnalysis.push(`Temperature swinging ${Math.round(tempDiff)}°F off target - this affects cook time and quality`);
    } else {
      report.tempGrade = 'D';
      report.improvements.push(`🌡️ Major temperature issues - target ${meat.idealTemp}°F`);
      report.detailedAnalysis.push(`Serious temp problems! ${Math.round(tempDiff)}°F off target kills bark formation and timing`);
    }

    // Bark development grade with detailed analysis
    const expectedBark = Math.min(100, hour * 12); // Expect ~12% bark per hour
    if (barkDevelopment >= expectedBark * 0.9) {
      report.barkGrade = 'A';
      report.feedback.push("🟤 Fantastic bark development!");
      report.detailedAnalysis.push(`Bark at ${Math.round(barkDevelopment)}% - ahead of schedule! Maillard reactions firing perfectly`);
    } else if (barkDevelopment >= expectedBark * 0.7) {
      report.barkGrade = 'B';
      report.feedback.push("🟤 Good bark forming");
      report.detailedAnalysis.push(`Bark at ${Math.round(barkDevelopment)}% - on track but could be better with consistent heat`);
    } else if (barkDevelopment >= expectedBark * 0.5) {
      report.barkGrade = 'C';
      report.improvements.push("🟤 Bark developing slowly - check temperature consistency");
      report.detailedAnalysis.push(`Bark only at ${Math.round(barkDevelopment)}% - surface proteins need more heat for proper crust`);
    } else {
      report.barkGrade = 'D';
      report.improvements.push("🟤 Poor bark formation - may be too cool or too much moisture");
      report.detailedAnalysis.push(`Bark formation failing at ${Math.round(barkDevelopment)}% - check for steam leaks or low temp issues`);
    }

    // Enhanced technique grade with specific feedback
    let techniqueScore = 50;
    let techniqueDetails = [];
    
    if (hour >= 2 && spritzeCount === 0) {
      report.improvements.push("💦 Consider spritzing for better bark and moisture");
      techniqueDetails.push("No spritzing yet - missing opportunity for bark enhancement and surface cooling");
      techniqueScore -= 20;
    } else if (spritzeCount > 0) {
      report.feedback.push(`💦 Good spritz technique (${spritzeCount} times)`);
      techniqueDetails.push(`Spritzing ${spritzeCount} times helps bark formation and prevents surface burning`);
      techniqueScore += 10;
    }
    
    if (hour >= 1 && woodChipsAdded === 0) {
      report.improvements.push("🌳 Add wood chips early for smoke flavor");
      techniqueDetails.push("No smoke wood added - missing critical flavor development window");
      techniqueScore -= 15;
    } else if (woodChipsAdded >= 3) {
      report.feedback.push(`🌳 Excellent smoke management (${woodChipsAdded} additions)`);
      techniqueDetails.push(`Added ${woodChipsAdded} wood portions - great smoke ring potential before 140°F barrier`);
      techniqueScore += 15;
    }
    
    if (fuelLevel < 30) {
      report.improvements.push("⛽ Fuel running low - maintain consistent heat");
      techniqueDetails.push(`Fuel at ${Math.round(fuelLevel)}% - low fuel causes temperature instability and uneven cooking`);
      techniqueScore -= 10;
    } else if (fuelLevel > 70) {
      report.feedback.push("⛽ Good fuel management");
      techniqueScore += 5;
    }
    
    if (isStalled && hour >= 6 && !hasWrapped) {
      report.feedback.push("⏰ Good patience through the stall!");
      techniqueDetails.push("Riding the stall like a pro - this patience builds incredible bark");
      techniqueScore += 15;
    }
    
    if (hasWrapped && hour < 4) {
      report.improvements.push("📦 Wrapped too early - may have soft bark");
      techniqueDetails.push("Early wrap preserves moisture but sacrifices bark development - timing is critical");
      techniqueScore -= 10;
    } else if (hasWrapped && hour >= 6) {
      report.feedback.push(`📦 Smart wrapping with ${wrapType}`);
      techniqueDetails.push(`${wrapType} wrap at hour ${hour} - perfect timing for moisture retention while preserving bark`);
      techniqueScore += 10;
    }

    if (waterPanActive && weather !== 'rainy') {
      report.feedback.push("💧 Water pan helping with moisture");
      techniqueDetails.push("Water pan active - creating humid environment for better smoke ring");
      techniqueScore += 8;
    }

    if (damperPosition > 90 && weather === 'windy') {
      report.improvements.push("💨 Close dampers more in windy conditions");
      techniqueDetails.push("High damper setting in wind causes temperature spikes and fuel waste");
      techniqueScore -= 8;
    }

    // Collagen and fat analysis
    if (selectedMeat === 'brisket' || selectedMeat === 'pork-shoulder') {
      if (collagenBreakdown > 40) {
        report.feedback.push("🧬 Collagen breaking down well");
        techniqueDetails.push(`Collagen at ${Math.round(collagenBreakdown)}% breakdown - tough connective tissue converting to gelatin`);
      } else {
        report.improvements.push("🧬 Need more time for collagen breakdown");
        techniqueDetails.push(`Collagen only ${Math.round(collagenBreakdown)}% broken down - tough cuts need patience for tenderness`);
      }
    }

    report.detailedAnalysis.push(...techniqueDetails);

    if (techniqueScore >= 90) report.techniqueGrade = 'A';
    else if (techniqueScore >= 80) report.techniqueGrade = 'B';
    else if (techniqueScore >= 70) report.techniqueGrade = 'C';
    else if (techniqueScore >= 60) report.techniqueGrade = 'D';
    else report.techniqueGrade = 'F';

    // Overall grade
    const grades = [report.tempGrade, report.barkGrade, report.techniqueGrade];
    const gradeValues = grades.map(g => g === 'A' ? 4 : g === 'B' ? 3 : g === 'C' ? 2 : g === 'D' ? 1 : 0);
    const avgGrade = gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length;
    
    if (avgGrade >= 3.5) report.overallGrade = 'A';
    else if (avgGrade >= 2.5) report.overallGrade = 'B';
    else if (avgGrade >= 1.5) report.overallGrade = 'C';
    else if (avgGrade >= 0.5) report.overallGrade = 'D';
    else report.overallGrade = 'F';

    // Add overall performance summary
    if (report.overallGrade === 'A') {
      report.detailedAnalysis.unshift("🏆 Championship-level performance! You're cooking like a true pitmaster");
    } else if (report.overallGrade === 'B') {
      report.detailedAnalysis.unshift("🥈 Solid cooking but room for improvement in consistency");
    } else if (report.overallGrade === 'C') {
      report.detailedAnalysis.unshift("📈 Average performance - focus on temperature control and timing");
    } else {
      report.detailedAnalysis.unshift("📚 Struggling this hour - review your fundamentals and stay focused");
    }

    return report;
  };

  // Game timer effect
  useEffect(() => {
    if (gameState === 'cooking') {
      const interval = setInterval(() => {
        setCookTime(prev => prev + 1/60); // 1 second = 1 minute
        
        // Expert tip timer
        if (expertTipsEnabled) {
          setTipTimer(prev => {
            if (prev <= 0) {
              const tip = getExpertTip();
              if (tip) {
                setCurrentTip(tip);
                return 20; // Show tip for 20 seconds
              }
              return 30; // Check for new tips every 30 seconds
            }
            return prev - 1;
          });

          if (tipTimer === 1) {
            setCurrentTip(null);
          }
        }

        // Generate hourly report cards
        const currentHour = Math.floor(cookTime);
        if (currentHour > lastReportHour && currentHour > 0) {
          const report = generateHourlyReport(currentHour);
          setHourlyReports(prev => [...prev, report]);
          setLastReportHour(currentHour);
        }

        // Temperature fluctuations based on weather and fuel
        const weatherEffect = weatherEffects[weather];
        const baseVariance = weatherEffect.tempVariance;
        const fuelEffect = fuelLevel < 20 ? 0.5 : 1.0;
        const tempChange = (Math.random() - 0.5) * baseVariance * 10 * fuelEffect;
        
        setTemperature(prev => {
          let newTemp = prev + tempChange;
          
          // Weather-specific effects
          if (weather === 'cold') newTemp -= 2;
          if (weather === 'windy') newTemp += Math.random() * 8 - 4;
          
          return Math.max(100, Math.min(400, newTemp));
        });

        // Fuel consumption
        setFuelLevel(prev => Math.max(0, prev - (0.5 * weatherEffects[weather].fuelConsumption)));

        // Temperature-based cooking progression
        const tempDiff = Math.abs(temperature - meatData[selectedMeat].idealTemp);
        const efficiency = Math.max(0.1, 1 - (tempDiff / 100));
        
        // Internal temperature progression - more realistic
        setInternalTemp(prev => {
          let increase = 0.8 * efficiency; // Slower, more realistic
          
          // Stall simulation (between 150-170°F)
          if (prev >= 150 && prev <= 170 && !hasWrapped) {
            if (!isStalled) {
              setIsStalled(true);
              setStallStartTime(cookTime);
            }
            increase *= 0.1; // Very slow during stall
          } else if (isStalled && (hasWrapped || prev > 170)) {
            setIsStalled(false);
          }
          
          return Math.min(220, prev + increase);
        });

        // Quality metrics - made more challenging
        setBarkDevelopment(prev => {
          if (temperature >= 225 && temperature <= 275 && !hasWrapped && cookTime >= 1) {
            const barkRate = 0.4 * efficiency; // Slower bark development
            const regionBonus = regions[region].barkBonus || 0;
            return Math.min(100, prev + barkRate + (regionBonus * 0.05));
          }
          if (hasWrapped && wrapType === 'foil') return Math.max(0, prev - 0.2); // Foil reduces bark
          return prev;
        });

        setCollagenBreakdown(prev => {
          if (internalTemp >= 160 && temperature >= 200) {
            const rate = (internalTemp - 160) * 0.08; // Slower collagen breakdown
            return Math.min(100, prev + rate);
          }
          return prev;
        });

        setFatRendering(prev => {
          if (internalTemp >= 140 && temperature >= 225) {
            const rate = (temperature - 200) * 0.06; // More temperature dependent
            return Math.min(100, prev + rate);
          }
          return prev;
        });

        setSmokeRingDepth(prev => {
          if (internalTemp < 140 && woodChipsAdded > 0 && temperature >= 200) {
            const rate = 0.4 * (woodChipsAdded / 12); // Adjusted for 12 chips max
            return Math.min(100, prev + rate);
          }
          return prev;
        });

        // Moisture management - made more challenging
        setMoistureLevel(prev => {
          let moisture = prev;
          if (temperature > 275) moisture -= 0.8; // Higher temp = more moisture loss
          if (waterPanActive) moisture += 0.3;
          if (spritzeCount > 0 && cookTime >= 2) moisture += 0.2;
          if (hasWrapped && wrapType === 'foil') moisture += 0.4; // Foil retains moisture
          if (hasWrapped && wrapType === 'paper') moisture += 0.1; // Paper allows some moisture escape
          return Math.max(0, Math.min(100, moisture));
        });

        // Pit Master auto-actions
        if (pitMasterMode && Math.random() < 0.02) { // 2% chance per game minute
          const actions = ['probing', 'adjusting vents', 'checking fuel', 'taking notes'];
          const action = actions[Math.floor(Math.random() * actions.length)];
          setCurrentAction(action);
          setActionTimer(3);
          
          if (action === 'adjusting vents') {
            setDamperPosition(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 20)));
          }
        }

        if (actionTimer > 0) {
          setActionTimer(prev => prev - 1);
        } else {
          setCurrentAction('');
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState, temperature, selectedMeat, hasWrapped, wrapType, region, weather, cookTime, internalTemp, woodChipsAdded, spritzeCount, waterPanActive, fuelLevel, isStalled, pitMasterMode, damperPosition, expertTipsEnabled, tipTimer, lastReportHour, barkDevelopment]);

  // Game functions
  const startGame = () => setGameState('setup');
  
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
      
      // Different effects for foil vs butcher paper
      if (type === 'foil') {
        setMoistureLevel(prev => Math.min(100, prev + 30)); // More moisture retention
        setBarkDevelopment(prev => Math.max(0, prev - 10)); // Softer bark
      } else if (type === 'paper') {
        setMoistureLevel(prev => Math.min(100, prev + 15)); // Some moisture retention
        setBarkDevelopment(prev => Math.min(100, prev + 5)); // Better bark preservation
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
    const meat = meatData[selectedMeat];
    const timeDiff = Math.abs(cookTime - meat.idealTime);
    const tempDiff = Math.abs(internalTemp - meat.finishTemp);
    
    // Much more stringent scoring
    const timeScore = Math.max(0, 100 - (timeDiff * 15)); // Penalize timing heavily
    const tempScore = Math.max(0, 100 - (tempDiff * 8)); // Penalize temp deviation heavily
    const barkScore = Math.max(0, barkDevelopment - 20); // Need significant bark
    const moistureScore = Math.max(0, moistureLevel - 10); // Need to maintain moisture
    const smokeScore = Math.max(0, smokeRingDepth - 15); // Need good smoke penetration
    const collagenScore = selectedMeat === 'ribs' || selectedMeat === 'brisket' ? 
                         Math.max(0, collagenBreakdown - 30) : 100; // Tough cuts need collagen breakdown
    
    // Regional bonuses (smaller than before)
    const regionBonus = regions[region].tempBonus || 0;
    
    // Weather penalties/bonuses
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

  // Smoker interior animation component
  const SmokerInterior = () => {
    const smokeOpacity = Math.min(0.8, woodChipsAdded * 0.15 + 0.1);
    const barkColor = Math.min(255, 139 + (barkDevelopment * 1.16)); // From light brown to dark
    const meatDoneness = Math.min(1, internalTemp / meatData[selectedMeat].finishTemp);
    
    return (
      <div className="bg-gray-900 rounded-lg p-4 h-64 relative overflow-hidden border-4 border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900"></div>
        
        {/* Smoke wisps */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-gray-400 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + Math.sin(Date.now() / 1000 + i) * 10}%`,
                opacity: smokeOpacity * (0.3 + Math.random() * 0.4),
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Meat visualization */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
          <div 
            className="w-24 h-16 rounded-lg border-2 transition-all duration-1000"
            style={{
              backgroundColor: `rgb(${Math.max(139, barkColor)}, ${Math.max(69, barkColor * 0.5)}, ${Math.max(19, barkColor * 0.2)})`,
              borderColor: hasWrapped ? (wrapType === 'foil' ? '#C0C0C0' : '#8B4513') : '#4A4A4A',
              borderWidth: hasWrapped ? '3px' : '1px',
              filter: `brightness(${0.7 + meatDoneness * 0.3})`
            }}
          >
            <div className="text-center mt-2 text-xs">
              {meatData[selectedMeat].emoji}
            </div>
          </div>
          
          {/* Steam/moisture visualization */}
          {moistureLevel > 60 && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-200 rounded-full opacity-50 animate-bounce"
                  style={{
                    left: `${i * 4}px`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Temperature grates */}
        <div className="absolute bottom-8 w-full">
          <div className="w-full h-1 bg-gray-600 rounded"></div>
          <div className="w-full h-1 bg-gray-600 rounded mt-2"></div>
        </div>

        {/* Fire indicator */}
        <div className="absolute bottom-2 left-4">
          <div 
            className="text-orange-500 animate-pulse"
            style={{ opacity: fuelLevel / 100 }}
          >
            🔥 {fuelLevel > 50 ? '🔥🔥' : fuelLevel > 20 ? '🔥' : '💨'}
          </div>
        </div>
      </div>
    );
  };

  // Entry Screen
  if (gameState === 'entry') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-900 to-red-900 text-white p-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">🔥 BBQ Master</h1>
            <p className="text-lg opacity-90">Championship Pitmaster Simulator</p>
          </div>
          
          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 text-white text-center text-xl"
            />
            
            <input
              type="email"
              placeholder="Email (optional, for leaderboard)"
              value={playerEmail}
              onChange={(e) => setPlayerEmail(e.target.value)}
              className="w-full p-4 rounded-lg bg-gray-800 text-white text-center"
            />

            <div className="flex items-center space-x-2 justify-center">
              <input 
                type="checkbox" 
                id="expertTips" 
                checked={expertTipsEnabled} 
                onChange={(e) => setExpertTipsEnabled(e.target.checked)}
                className="w-4 h-4" 
              />
              <label htmlFor="expertTips" className="text-sm">
                💡 Enable Expert BBQ Tips (Aaron Franklin, Myron Mixon, etc.)
              </label>
            </div>
          </div>
          
          <button
            onClick={startGame}
            disabled={!playerName.trim()}
            className={`w-full py-4 px-8 rounded-lg text-xl font-bold transition-colors ${
              playerName.trim() 
                ? 'bg-orange-600 hover:bg-orange-700' 
                : 'bg-gray-600 cursor-not-allowed'
            }`}
          >
            🚀 Start BBQ Championship
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
          <h1 className="text-3xl font-bold text-center mb-8">
            🔥 Welcome {playerName}! Set Up Your Cook
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Meat Selection */}
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

            {/* Smoker Selection */}
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

          {/* Game Settings */}
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

          {/* Expert Tip Display */}
          {currentTip && (
            <div className="bg-blue-900 border border-blue-600 rounded-lg p-3 mb-4 mx-auto max-w-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm">{currentTip}</div>
                <div className="text-xs opacity-70">{tipTimer}s</div>
              </div>
            </div>
          )}

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

              {/* Smoker Interior Animation */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">🔥 Inside the Smoker</h3>
                <SmokerInterior />
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
                    🍃 Foil Wrap
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

              {/* Live Science */}
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
                      <span>Fat Rendering</span>
                      <span>{Math.round(fatRendering)}%</span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${fatRendering}%` }}
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
                    <div className="text-xs opacity-80">
                      {wrapType === 'foil' ? 'Faster cook, softer bark, more moisture' : 'Bark preserved, breathable, authentic'}
                    </div>
                  </div>
                )}
              </div>

              {/* Hourly Report Card */}
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">📊 Hourly Report Card</h3>
                
                {hourlyReports.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Award size={48} className="mx-auto mb-2 opacity-50" />
                    <p>Complete your first hour to see your report card!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {hourlyReports.slice(-3).map((report, index) => (
                      <div key={report.hour} className="bg-gray-700 rounded-lg p-4 border-l-4 border-orange-500">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">Hour {report.hour} Report</h4>
                          <div className={`text-xl font-bold px-3 py-1 rounded ${
                            report.overallGrade === 'A' ? 'bg-green-600' :
                            report.overallGrade === 'B' ? 'bg-blue-600' :
                            report.overallGrade === 'C' ? 'bg-yellow-600' :
                            report.overallGrade === 'D' ? 'bg-orange-600' : 'bg-red-600'
                          }`}>
                            {report.overallGrade}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                          <div className="text-center">
                            <div>Temp: {report.tempGrade}</div>
                          </div>
                          <div className="text-center">
                            <div>Bark: {report.barkGrade}</div>
                          </div>
                          <div className="text-center">
                            <div>Technique: {report.techniqueGrade}</div>
                          </div>
                        </div>

                        {report.feedback.length > 0 && (
                          <div className="mb-2">
                            {report.feedback.map((feedback, i) => (
                              <div key={i} className="text-xs text-green-300 mb-1">✓ {feedback}</div>
                            ))}
                          </div>
                        )}

                        {report.improvements.length > 0 && (
                          <div className="mb-2">
                            {report.improvements.map((improvement, i) => (
                              <div key={i} className="text-xs text-yellow-300 mb-1">⚠️ {improvement}</div>
                            ))}
                          </div>
                        )}

                        {/* Detailed Analysis Section */}
                        {report.detailedAnalysis && report.detailedAnalysis.length > 0 && (
                          <div className="border-t border-gray-600 pt-2 mt-2">
                            <div className="text-xs font-semibold mb-1 text-blue-300">📋 Detailed Analysis:</div>
                            {report.detailedAnalysis.map((analysis, i) => (
                              <div key={i} className="text-xs text-gray-300 mb-1 italic">• {analysis}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
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

          {/* Show hourly reports summary */}
          {hourlyReports.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">📊 Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hourlyReports.slice(-3).map((report, index) => (
                  <div key={report.hour} className="bg-gray-700 rounded p-3">
                    <div className="text-sm font-semibold mb-1">Hour {report.hour}</div>
                    <div className={`text-2xl font-bold ${
                      report.overallGrade === 'A' ? 'text-green-400' :
                      report.overallGrade === 'B' ? 'text-blue-400' :
                      report.overallGrade === 'C' ? 'text-yellow-400' :
                      report.overallGrade === 'D' ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {report.overallGrade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <button
              onClick={resetGame}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-xl transition-colors"
            >
              🔥 Cook Another Cut
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BBQMaster;