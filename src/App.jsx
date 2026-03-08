import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Trophy, Share2, Ban, Moon, Sun } from 'lucide-react';

const QwixxBoard = () => {
  const [redRow, setRedRow] = useState(Array(12).fill(false));
  const [yellowRow, setYellowRow] = useState(Array(12).fill(false));
  const [greenRow, setGreenRow] = useState(Array(12).fill(false));
  const [blueRow, setBlueRow] = useState(Array(12).fill(false));
  const [redLocked, setRedLocked] = useState(false);
  const [yellowLocked, setYellowLocked] = useState(false);
  const [greenLocked, setGreenLocked] = useState(false);
  const [blueLocked, setBlueLocked] = useState(false);
  const [redBlocked, setRedBlocked] = useState(false);
  const [yellowBlocked, setYellowBlocked] = useState(false);
  const [greenBlocked, setGreenBlocked] = useState(false);
  const [blueBlocked, setBlueBlocked] = useState(false);
  const [penalties, setPenalties] = useState(0);
  const [showEndGame, setShowEndGame] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [showCopied, setShowCopied] = useState(false);
  const [explosions, setExplosions] = useState([]);
  const [darkMode, setDarkMode] = useState(true);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  const redNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const yellowNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const greenNumbers = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  const blueNumbers = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (showEndGame) {
      const score = totalScore();
      let emojiSet;
      
      if (score < 21) emojiSet = ['💀', '🪦', '☠️'];
      else if (score <= 50) emojiSet = ['😅', '🎲', '🤷'];
      else if (score <= 80) emojiSet = ['😊', '🎯', '👍'];
      else if (score <= 120) emojiSet = ['🎉', '⭐', '🔥'];
      else emojiSet = ['🏆', '👑', '💎'];
      
      const pieces = [];
      for (let i = 0; i < 100; i++) {
        pieces.push({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2 + Math.random() * 2,
          emoji: emojiSet[i % emojiSet.length]
        });
      }
      setConfetti(pieces);
    }
  }, [showEndGame]);

  const createExplosion = (x, y, emoji = '🔥') => {
    const id = Date.now();
    const particles = [];
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      particles.push({
        id: `${id}-${i}`,
        x,
        y,
        angle,
        distance: 40 + Math.random() * 20,
        emoji
      });
    }
    setExplosions(prev => [...prev, ...particles]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(p => !p.id.startsWith(`${id}`)));
    }, 600);
  };

  const toggleBox = (row, setRow, index, locked, setLocked, blocked, emoji, event) => {
    if (blocked) return;
    
    const newRow = [...row];
    
    if (newRow[index]) {
      if (index === 10 && locked) {
        newRow[index] = false;
        newRow[11] = false;
        setLocked(false);
        setRow(newRow);
        return;
      }
      
      if (locked) return;
      
      newRow[index] = false;
      setRow(newRow);
      return;
    }
    
    if (locked) return;
    
    for (let i = index + 1; i < 11; i++) {
      if (newRow[i]) {
        return;
      }
    }
    
    newRow[index] = true;
    
    if (event) {
      const rect = event.currentTarget.getBoundingClientRect();
      createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, emoji);
    }
    
    if (index === 10) {
      const checkedCount = newRow.slice(0, 10).filter(box => box).length;
      if (checkedCount >= 5) {
        newRow[11] = true;
        setLocked(true);
      } else {
        newRow[index] = false;
        setRow(newRow);
        return;
      }
    }
    
    setRow(newRow);
  };

  const calculateScore = (row) => {
    const count = row.filter(box => box).length;
    const scores = [0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78];
    return scores[count] || 0;
  };

  const totalScore = () => {
    return calculateScore(redRow) + 
           calculateScore(yellowRow) + 
           calculateScore(greenRow) + 
           calculateScore(blueRow) - 
           (penalties * 5);
  };

  const reset = () => {
    setRedRow(Array(12).fill(false));
    setYellowRow(Array(12).fill(false));
    setGreenRow(Array(12).fill(false));
    setBlueRow(Array(12).fill(false));
    setRedLocked(false);
    setYellowLocked(false);
    setGreenLocked(false);
    setBlueLocked(false);
    setRedBlocked(false);
    setYellowBlocked(false);
    setGreenBlocked(false);
    setBlueBlocked(false);
    setPenalties(0);
    setShowEndGame(false);
  };

  const getScoreMessage = (score) => {
    const messages = {
      skull: [
        { title: "Yikes...", message: "Maybe try using dice next time?", emojis: "💀 🪦 ☠️ 🪦 💀" },
        { title: "Ouch!", message: "Even the dice are disappointed.", emojis: "💀 🪦 ☠️ 🪦 💀" },
        { title: "Rough Game!", message: "We've all been there... I think?", emojis: "💀 🪦 ☠️ 🪦 💀" }
      ],
      beginner: [
        { title: "Not Bad!", message: "Mediocre, must be a beginner!", emojis: "😅 🎲 🤷 🎲 😅" },
        { title: "Room to Grow!", message: "Practice makes perfect, right?", emojis: "😅 🎲 🤷 🎲 😅" },
        { title: "Getting There!", message: "You'll get the hang of it soon!", emojis: "😅 🎲 🤷 🎲 😅" }
      ],
      decent: [
        { title: "Nice!", message: "Seems like a decent game!", emojis: "😊 🎯 👍 🎯 😊" },
        { title: "Solid!", message: "That's a respectable score!", emojis: "😊 🎯 👍 🎯 😊" },
        { title: "Good Job!", message: "You know what you're doing!", emojis: "😊 🎯 👍 🎯 😊" }
      ],
      great: [
        { title: "Woah!", message: "Great playing! Impressive!", emojis: "🎉 ⭐ 🔥 ⭐ 🎉" },
        { title: "Excellent!", message: "You crushed that game!", emojis: "🎉 ⭐ 🔥 ⭐ 🎉" },
        { title: "Amazing!", message: "Now that's how it's done!", emojis: "🎉 ⭐ 🔥 ⭐ 🎉" }
      ],
      pro: [
        { title: "Yahoo!", message: "You're such a pro! Outstanding!", emojis: "🏆 👑 💎 👑 🏆" },
        { title: "Legendary!", message: "Absolutely incredible performance!", emojis: "🏆 👑 💎 👑 🏆" },
        { title: "Phenomenal!", message: "Are you even human?!", emojis: "🏆 👑 💎 👑 🏆" }
      ]
    };

    let category;
    if (score < 21) category = messages.skull;
    else if (score <= 50) category = messages.beginner;
    else if (score <= 80) category = messages.decent;
    else if (score <= 120) category = messages.great;
    else category = messages.pro;

    // Rotate through messages based on score to add variety
    const index = Math.floor(score / 10) % category.length;
    return category[index];
  };

  const endGame = () => {
    setShowEndGame(true);
  };

  const shareScore = async () => {
    const score = totalScore();
    const redScore = calculateScore(redRow);
    const yellowScore = calculateScore(yellowRow);
    const greenScore = calculateScore(greenRow);
    const blueScore = calculateScore(blueRow);
    const penaltyScore = penalties * 5;
    
    const gameUrl = 'https://claude.ai/public/artifacts/c7a0a6f2-805b-46f7-8fed-dd3ffc650693';
    
    const message = `🎲 Qwixx Score 🎲

🔴 Red: ${redScore}
🟡 Yellow: ${yellowScore}
🟢 Green: ${greenScore}
🔵 Blue: ${blueScore}
❌ Penalties: -${penaltyScore}

🏆 Final Score: ${score}

Can you beat my score? Play here:
${gameUrl}`;

    try {
      await navigator.clipboard.writeText(message);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      alert('Score ready to share!\n\n' + message);
    }
  };

  const theme = darkMode ? {
    bg: '#4a5d4f',
    cardBg: '#1f2937',
    text: '#f3f4f6',
    subText: '#d1d5db',
    buttonBg: '#374151',
    buttonText: '#f3f4f6',
    red: { x: '#dc2626', bg: '#7f1d1d', border: '#991b1b', text: '#fca5a5' },
    yellow: { x: '#ca8a04', bg: '#713f12', border: '#854d0e', text: '#fde047' },
    green: { x: '#16a34a', bg: '#14532d', border: '#166534', text: '#86efac' },
    blue: { x: '#2563eb', bg: '#1e3a8a', border: '#1e40af', text: '#93c5fd' },
    penalty: { border: '#4b5563', bg: '#374151', x: '#9ca3af' }
  } : {
    bg: '#f9fafb',
    cardBg: '#ffffff',
    text: '#1f2937',
    subText: '#4b5563',
    buttonBg: '#e5e7eb',
    buttonText: '#1f2937',
    red: { x: '#dc2626', bg: '#fee2e2', border: '#f87171', text: '#991b1b' },
    yellow: { x: '#ca8a04', bg: '#fef3c7', border: '#facc15', text: '#854d0e' },
    green: { x: '#16a34a', bg: '#dcfce7', border: '#4ade80', text: '#166534' },
    blue: { x: '#2563eb', bg: '#dbeafe', border: '#60a5fa', text: '#1e40af' },
    penalty: { border: '#9ca3af', bg: '#f3f4f6', x: '#374151' }
  };

  const Row = ({ numbers, row, setRow, locked, setLocked, blocked, setBlocked, colorTheme, label, emoji }) => {
    const checkedBeforeLast = row.slice(0, 10).filter(box => box).length;
    const canLock = checkedBeforeLast >= 5;
    
    if (isPortrait) {
      return (
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: colorTheme.text }}>{label}</div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '600', color: theme.subText }}>
                {calculateScore(row)}
              </div>
              {!locked && (
                <button
                  onClick={() => setBlocked(!blocked)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: `2px solid ${colorTheme.border}`,
                    backgroundColor: blocked ? colorTheme.bg : 'transparent',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    WebkitAppearance: 'none',
                    opacity: blocked ? 1 : 0.5
                  }}
                >
                  <Ban size={24} color={colorTheme.text} />
                </button>
              )}
              <div 
                style={{
                  width: '40px',
                  height: '40px',
                  border: `2px solid ${colorTheme.border}`,
                  backgroundColor: colorTheme.bg,
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  position: 'relative', fontFamily: "'Inter', Arial, sans-serif"
                  opacity: row[11] ? 1 : 0.4
                }}
              >
                {row[11] && (
                  <>
                    <svg 
                      width="28" 
                      height="28" 
                      viewBox="0 0 24 24" 
                      style={{ position: 'absolute' }}
                    >
                      <path 
                        d="M18 6L6 18M6 6l12 12" 
                        stroke={colorTheme.x} 
                        strokeWidth="3" 
                        strokeLinecap="round"
                      />
                    </svg>
                    <span style={{ fontSize: '24px', opacity: 0.3 }}>🔒</span>
                  </>
                )}
                {!row[11] && <span style={{ fontSize: '24px' }}>🔒</span>}
              </div>
            </div>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(11, 1fr)', 
            gap: '2px',
            position: 'relative',
            width: '100%'
          }}>
            {(blocked || locked) && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: colorTheme.text,
                transform: 'translateY(-50%)',
                zIndex: 10,
                pointerEvents: 'none'
              }} />
            )}
            {numbers.map((num, idx) => (
              <button
                key={idx}
                onClick={(e) => toggleBox(row, setRow, idx, locked, setLocked, blocked, emoji, e)}
                disabled={(locked && idx !== 10) || blocked}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  minHeight: '0',
                  maxHeight: '60px',
                  border: `2px solid ${colorTheme.border}`,
                  backgroundColor: colorTheme.bg,
                  fontWeight: 'bold',
                  fontSize: isPortrait ? '14px' : '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  cursor: ((locked && idx !== 10) || blocked) ? 'not-allowed' : 'pointer',
                  opacity: row[idx] ? 1 : (idx === 10 && !canLock && !row[idx] ? 0.3 : 0.6),
                  borderRadius: '4px',
                  color: colorTheme.text,
                  transition: 'opacity 0.2s',
                  WebkitAppearance: 'none',
                  outline: 'none',
                  padding: '2px'
                }}
              >
                {row[idx] && (
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    style={{ position: 'absolute' }}
                  >
                    <path 
                      d="M18 6L6 18M6 6l12 12" 
                      stroke={colorTheme.x} 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                  </svg>
                )}
                <span style={{ opacity: row[idx] ? 0.3 : 1, fontSize: isPortrait ? '12px' : '14px' }}>{num}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div style={{ marginBottom: '12px', position: 'relative' }}>
        {(blocked || locked) && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: '120px',
            height: '3px',
            backgroundColor: colorTheme.text,
            transform: 'translateY(-50%)',
            zIndex: 10,
            pointerEvents: 'none'
          }} />
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {numbers.map((num, idx) => (
            <button
              key={idx}
              onClick={(e) => toggleBox(row, setRow, idx, locked, setLocked, blocked, emoji, e)}
              disabled={(locked && idx !== 10) || blocked}
              style={{
                flex: 1,
                minWidth: '40px',
                height: '48px',
                border: `2px solid ${colorTheme.border}`,
                backgroundColor: colorTheme.bg,
                fontWeight: 'bold',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: ((locked && idx !== 10) || blocked) ? 'not-allowed' : 'pointer',
                opacity: row[idx] ? 1 : (idx === 10 && !canLock && !row[idx] ? 0.3 : 0.6),
                borderRadius: idx === 10 ? '0 8px 8px 0' : (idx === 0 ? '8px 0 0 8px' : '0'),
                color: colorTheme.text,
                transition: 'opacity 0.2s',
                WebkitAppearance: 'none',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!row[idx] && !(locked && idx !== 10) && !blocked) {
                  e.currentTarget.style.opacity = '0.8';
                }
              }}
              onMouseLeave={(e) => {
                if (!row[idx]) {
                  e.currentTarget.style.opacity = idx === 10 && !canLock && !row[idx] ? '0.3' : '0.6';
                }
              }}
            >
              {row[idx] && (
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  style={{ position: 'absolute' }}
                >
                  <path 
                    d="M18 6L6 18M6 6l12 12" 
                    stroke={colorTheme.x} 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                </svg>
              )}
              <span style={{ opacity: row[idx] ? 0.3 : 1 }}>{num}</span>
            </button>
          ))}
          <div 
            style={{
              width: '40px',
              height: '40px',
              marginLeft: '8px',
              border: `2px solid ${colorTheme.border}`,
              backgroundColor: colorTheme.bg,
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              position: 'relative',
              opacity: row[11] ? 1 : 0.4
            }}
          >
            {row[11] && (
              <>
                <svg 
                  width="28" 
                  height="28" 
                  viewBox="0 0 24 24" 
                  style={{ position: 'absolute' }}
                >
                  <path 
                    d="M18 6L6 18M6 6l12 12" 
                    stroke={colorTheme.x} 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                </svg>
                <span style={{ fontSize: '24px', opacity: 0.3 }}>🔒</span>
              </>
            )}
            {!row[11] && <span style={{ fontSize: '24px' }}>🔒</span>}
          </div>
          {!locked && (
            <button
              onClick={() => setBlocked(!blocked)}
              style={{
                width: '40px',
                height: '40px',
                marginLeft: '4px',
                border: `2px solid ${colorTheme.border}`,
                backgroundColor: blocked ? colorTheme.bg : 'transparent',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                WebkitAppearance: 'none',
                opacity: blocked ? 1 : 0.5
              }}
            >
              <Ban size={24} color={colorTheme.text} />
            </button>
          )}
          <div style={{ marginLeft: '12px', fontSize: '18px', fontWeight: '600', minWidth: '3rem', color: theme.subText }}>
            {calculateScore(row)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '24px', backgroundColor: theme.bg, borderRadius: '8px', position: 'relative', minHeight: '100vh' }}>
      {explosions.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            fontSize: '20px',
            pointerEvents: 'none',
            zIndex: 1000,
            animation: `explode-${particle.id} 0.6s ease-out forwards`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      <style>{`
        ${explosions.map(particle => `
          @keyframes explode-${particle.id} {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            100% {
              transform: translate(calc(-50% + ${Math.cos(particle.angle) * particle.distance}px), calc(-50% + ${Math.sin(particle.angle) * particle.distance}px)) scale(1.5);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: isPortrait ? '24px' : '30px', fontWeight: 'bold', margin: 0, color: theme.text }}>Qwixx Score Sheet</h1>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: theme.buttonBg,
              color: theme.buttonText,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              WebkitAppearance: 'none'
            }}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={endGame}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#22c55e',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              WebkitAppearance: 'none'
            }}
          >
            <Trophy size={20} />
            End Game
          </button>
          <button
            onClick={reset}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: theme.buttonBg,
              color: theme.buttonText,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              WebkitAppearance: 'none'
            }}
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '8px', boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
        <Row 
          numbers={redNumbers} 
          row={redRow} 
          setRow={setRedRow}
          locked={redLocked}
          setLocked={setRedLocked}
          blocked={redBlocked}
          setBlocked={setRedBlocked}
          colorTheme={theme.red}
          label="Red"
          emoji="🔥"
        />
        <Row 
          numbers={yellowNumbers} 
          row={yellowRow} 
          setRow={setYellowRow}
          locked={yellowLocked}
          setLocked={setYellowLocked}
          blocked={yellowBlocked}
          setBlocked={setYellowBlocked}
          colorTheme={theme.yellow}
          label="Yellow"
          emoji="⭐️"
        />
        <Row 
          numbers={greenNumbers} 
          row={greenRow} 
          setRow={setGreenRow}
          locked={greenLocked}
          setLocked={setGreenLocked}
          blocked={greenBlocked}
          setBlocked={setGreenBlocked}
          colorTheme={theme.green}
          label="Green"
          emoji="🍀"
        />
        <Row 
          numbers={blueNumbers} 
          row={blueRow} 
          setRow={setBlueRow}
          locked={blueLocked}
          setLocked={setBlueLocked}
          blocked={blueBlocked}
          setBlocked={setBlueBlocked}
          colorTheme={theme.blue}
          label="Blue"
          emoji="💎"
        />
      </div>

      <div style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '8px', boxShadow: darkMode ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '18px', fontWeight: '600', color: theme.subText }}>Penalties:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2, 3].map(idx => (
              <button
                key={idx}
                onClick={(e) => {
                  if (penalties !== idx + 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
                  }
                  setPenalties(penalties === idx + 1 ? idx : idx + 1);
                }}
                style={{
                  width: '48px',
                  height: '48px',
                  border: `2px solid ${theme.penalty.border}`,
                  backgroundColor: theme.penalty.bg,
                  fontWeight: 'bold',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  position: 'relative',
                  opacity: idx < penalties ? 1 : 0.6,
                  WebkitAppearance: 'none'
                }}
              >
                {idx < penalties && (
                  <svg 
                    width="32" 
                    height="32" 
                    viewBox="0 0 24 24" 
                    style={{ position: 'absolute' }}
                  >
                    <path 
                      d="M18 6L6 18M6 6l12 12" 
                      stroke={theme.penalty.x} 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '18px', fontWeight: '600', color: theme.subText }}>-{penalties * 5}</span>
        </div>

        <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', padding: '16px', backgroundColor: theme.buttonBg, borderRadius: '8px', color: theme.text }}>
          Total Score: {totalScore()}
        </div>
      </div>

      <div style={{ marginTop: '16px', fontSize: '14px', color: theme.subText }}>
        <p><strong>Rules:</strong> Click boxes from left to right. Click the ⊘ button to mark a row as blocked by another player (score freezes). Toggle dark/light mode with the button above.</p>
      </div>

      {showEndGame && (
        <>
          <div 
            style={{ 
              position: 'fixed', 
              inset: 0, 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              zIndex: 50 
            }} 
            onClick={() => setShowEndGame(false)}
          >
            <div 
              style={{ 
                backgroundColor: theme.cardBg, 
                borderRadius: '16px', 
                padding: '48px', 
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', 
                textAlign: 'center', 
                position: 'relative', 
                overflow: 'hidden', 
                maxWidth: '512px',
                margin: '20px'
              }} 
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowEndGame(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: theme.subText,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  WebkitAppearance: 'none'
                }}
              >
                <X size={24} />
              </button>

              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {confetti.map(piece => (
                  <div
                    key={piece.id}
                    style={{
                      position: 'absolute',
                      fontSize: '24px',
                      left: `${piece.left}%`,
                      top: '-10px',
                      animation: `fall ${piece.duration}s linear infinite`,
                      animationDelay: `${piece.delay}s`
                    }}
                  >
                    {piece.emoji}
                  </div>
                ))}
              </div>
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: theme.text }}>{getScoreMessage(totalScore()).title}</h2>
                <div style={{ 
                  fontSize: '80px', 
                  fontWeight: 'bold', 
                  marginBottom: '24px',
                  background: 'linear-gradient(to right, #facc15, #ef4444, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  {totalScore()}
                </div>
                <p style={{ fontSize: '24px', color: theme.subText, marginBottom: '32px' }}>{getScoreMessage(totalScore()).message}</p>
                
                <div style={{ fontSize: '60px', marginBottom: '24px', animation: 'bounce 1s ease-in-out infinite' }}>
                  {getScoreMessage(totalScore()).emojis}
                </div>

                <button
                  onClick={() => {
                    setShowEndGame(false);
                    reset();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    WebkitAppearance: 'none'
                  }}
                >
                  New Game
                </button>

                <button
                  onClick={shareScore}
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    backgroundColor: theme.buttonBg,
                    color: theme.buttonText,
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    position: 'relative',
                    WebkitAppearance: 'none'
                  }}
                >
                  <Share2 size={20} />
                  Share Score
                  {showCopied && (
                    <span style={{
                      position: 'absolute',
                      top: '-40px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#22c55e',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      whiteSpace: 'nowrap'
                    }}>
                      Copied to clipboard!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <style>{`
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(360deg);
              }
            }
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.8;
              }
            }
            @keyframes bounce {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-20px);
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default QwixxBoard;