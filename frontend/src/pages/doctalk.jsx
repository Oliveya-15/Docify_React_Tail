// FILE: frontend/src/pages/DocTalk.jsx

import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 60%, #e8f0fe 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 16px 16px',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  authGate: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '70vh', gap: '16px',
    textAlign: 'center', maxWidth: '420px', margin: '0 auto',
  },
  authIcon: { fontSize: '56px', marginBottom: '4px' },
  authTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a2e', margin: 0 },
  authSubtitle: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', margin: 0 },
  authBtn: {
    padding: '12px 32px', borderRadius: '10px', border: 'none',
    background: 'linear-gradient(135deg, #5f6fff, #3d52d5)', color: '#fff',
    fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '8px',
    boxShadow: '0 4px 14px rgba(95,111,255,0.35)', transition: 'transform 0.2s',
  },
  header: {
    width: '100%', maxWidth: '780px', marginBottom: '20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoIcon: {
    width: '42px', height: '42px',
    background: 'linear-gradient(135deg, #e8ecff, #d5dbff)',
    borderRadius: '12px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '25px',
  },
  title: { fontSize: '28px', fontWeight: '700', color: '#1a1a2e', letterSpacing: '-0.5px', margin: 0 },
  subtitle: { fontSize: '14px', color: '#6b7280', textAlign: 'center', margin: 0 },
  modeToggleBar: {
    display: 'flex', gap: '8px', background: '#fff', borderRadius: '40px',
    padding: '5px', boxShadow: '0 2px 12px rgba(95,111,255,0.12)', marginTop: '4px',
  },
  modeBtn: (active, mental) => ({
    padding: '7px 18px', borderRadius: '30px', border: 'none', cursor: 'pointer',
    fontSize: '13px', fontWeight: '600', transition: 'all 0.25s ease',
    background: active
      ? mental ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #5f6fff, #3d52d5)'
      : 'transparent',
    color: active ? '#fff' : '#6b7280',
    boxShadow: active ? '0 2px 8px rgba(95,111,255,0.3)' : 'none',
  }),
  chatWindow: (mental) => ({
    width: '100%', maxWidth: '780px', flex: 1, background: '#ffffff',
    borderRadius: '20px', boxShadow: '0 8px 40px rgba(95,111,255,0.10)',
    border: `1px solid ${mental ? 'rgba(124,58,237,0.15)' : 'rgba(95,111,255,0.12)'}`,
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
    minHeight: '520px', maxHeight: '65vh',
  }),
  chatHeader: (mental) => ({
    padding: '16px 20px',
    background: mental ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #5f6fff, #3d52d5)',
    display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0,
  }),
  avatarCircle: {
    width: '38px', height: '38px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0,
  },
  chatHeaderText: { display: 'flex', flexDirection: 'column', gap: '1px' },
  chatHeaderName: { color: '#fff', fontWeight: '700', fontSize: '15px', margin: 0 },
  chatHeaderStatus: {
    color: 'rgba(255,255,255,0.8)', fontSize: '12px', margin: 0,
    display: 'flex', alignItems: 'center', gap: '5px',
  },
  onlineDot: { width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' },
  // ✅ FIX: messagesArea uses overflow scroll — page itself never scrolls from chat
  messagesArea: {
    flex: 1,
    overflowY: 'auto',   // scroll INSIDE this box only
    padding: '20px',
    display: 'flex', flexDirection: 'column', gap: '14px',
    scrollbarWidth: 'thin', scrollbarColor: '#e0e7ff transparent',
  },
  welcomeCard: (mental) => ({
    background: mental
      ? 'linear-gradient(135deg, rgba(124,58,237,0.07), rgba(91,33,182,0.05))'
      : 'linear-gradient(135deg, rgba(95,111,255,0.07), rgba(61,82,213,0.04))',
    borderRadius: '14px', padding: '20px',
    border: `1px solid ${mental ? 'rgba(124,58,237,0.12)' : 'rgba(95,111,255,0.12)'}`,
    textAlign: 'center',
  }),
  welcomeEmoji: { fontSize: '36px', marginBottom: '8px' },
  welcomeTitle: { fontWeight: '700', fontSize: '16px', color: '#1a1a2e', marginBottom: '6px' },
  welcomeText: { fontSize: '13px', color: '#6b7280', lineHeight: '1.6' },
  quickChips: { display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', marginTop: '12px' },
  chip: (mental) => ({
    padding: '6px 14px', borderRadius: '20px', background: '#fff',
    border: `1.5px solid ${mental ? 'rgba(124,58,237,0.25)' : 'rgba(95,111,255,0.25)'}`,
    color: mental ? '#7c3aed' : '#5f6fff',
    fontSize: '12px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
  }),
  msgRow: (isBot) => ({
    display: 'flex', justifyContent: isBot ? 'flex-start' : 'flex-end',
    gap: '8px', alignItems: 'flex-end',
  }),
  botAvatar: (mental) => ({
    width: '30px', height: '30px', borderRadius: '50%',
    background: mental ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #5f6fff, #3d52d5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', flexShrink: 0, marginBottom: '2px',
  }),
  bubble: (isBot, mental) => ({
    maxWidth: '72%', padding: '12px 16px',
    borderRadius: isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
    background: isBot ? '#f4f6ff'
      : mental ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #5f6fff, #3d52d5)',
    color: isBot ? '#1a1a2e' : '#fff',
    fontSize: '14px', lineHeight: '1.6',
    boxShadow: isBot ? '0 1px 4px rgba(0,0,0,0.06)' : '0 2px 8px rgba(95,111,255,0.3)',
    whiteSpace: 'pre-wrap', wordBreak: 'break-word',
  }),
  // Doctor card styles
  doctorCardsRow: {
    display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px', maxWidth: '72%',
  },
  doctorCard: {
    background: '#fff', borderRadius: '12px', padding: '12px',
    border: '1.5px solid rgba(95,111,255,0.15)',
    boxShadow: '0 2px 8px rgba(95,111,255,0.08)',
    display: 'flex', gap: '10px', alignItems: 'center',
    cursor: 'pointer', transition: 'all 0.2s', minWidth: '220px', maxWidth: '260px',
  },
  doctorCardImg: {
    width: '48px', height: '48px', borderRadius: '10px',
    objectFit: 'cover', background: '#e0e7ff', flexShrink: 0,
  },
  doctorCardInfo: { display: 'flex', flexDirection: 'column', gap: '2px' },
  doctorCardName: { fontWeight: '700', fontSize: '13px', color: '#1a1a2e' },
  doctorCardSpec: { fontSize: '11px', color: '#6b7280' },
  doctorCardFee: { fontSize: '11px', color: '#5f6fff', fontWeight: '600' },
  doctorCardAvail: (available) => ({
    fontSize: '10px', fontWeight: '600',
    color: available ? '#16a34a' : '#9ca3af',
    display: 'flex', alignItems: 'center', gap: '3px',
  }),
  typingBubble: {
    maxWidth: '80px', padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px', background: '#f4f6ff',
    display: 'flex', gap: '5px', alignItems: 'center',
  },
  typingDot: (delay) => ({
    width: '7px', height: '7px', borderRadius: '50%', background: '#5f6fff',
    animation: 'bounce 1.2s infinite', animationDelay: delay,
  }),
  inputRow: {
    padding: '14px 16px', background: '#fafbff',
    borderTop: '1px solid rgba(95,111,255,0.08)',
    display: 'flex', gap: '10px', alignItems: 'flex-end', flexShrink: 0,
  },
  textarea: {
    flex: 1, resize: 'none', border: '1.5px solid rgba(95,111,255,0.2)',
    borderRadius: '14px', padding: '11px 15px', fontSize: '14px',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: '#1a1a2e', background: '#fff', outline: 'none',
    lineHeight: '1.5', maxHeight: '120px', transition: 'border-color 0.2s',
  },
  sendBtn: (mental, disabled) => ({
    width: '42px', height: '42px', borderRadius: '12px', border: 'none',
    background: disabled ? '#e5e7eb'
      : mental ? 'linear-gradient(135deg, #7c3aed, #5b21b6)' : 'linear-gradient(135deg, #5f6fff, #3d52d5)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: disabled ? '#9ca3af' : '#fff',
    fontSize: '18px', flexShrink: 0, transition: 'all 0.2s', alignSelf: 'flex-end',
    boxShadow: disabled ? 'none' : '0 2px 8px rgba(95,111,255,0.35)',
  }),
  disclaimer: {
    width: '100%', maxWidth: '780px', textAlign: 'center',
    fontSize: '11px', color: '#9ca3af', marginTop: '10px',
    lineHeight: '1.5', padding: '0 8px',
  },
  mentalBanner: {
    width: '100%', maxWidth: '780px',
    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(91,33,182,0.05))',
    border: '1px solid rgba(124,58,237,0.15)',
    borderRadius: '12px', padding: '12px 18px', marginBottom: '14px',
    fontSize: '13px', color: '#5b21b6',
    display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '500',
  },
};

const GENERAL_CHIPS = [
  '🩺 Find a General Physician',
  '💊 Home remedy for cold',
  '👶 Pediatrician near me',
  '🧠 Consult a Neurologist',
];
const MENTAL_CHIPS = [
  '😔 I feel anxious lately',
  "😴 I can't sleep well",
  '💬 I need someone to talk to',
  '🧘 Stress management tips',
];

const DocTalk = () => {
  const { token, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState('general');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ FIX: ref points to the messages DIV, not a dummy bottom element
  const messagesAreaRef = useRef(null);
  const textareaRef = useRef(null);

  const isMental = mode === 'mental';

  // ✅ FIX: scroll INSIDE the messages box only — page stays still
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    setMessages([]);
    setInput('');
  }, [mode]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);

    try {
      const res = await axios.post(
        backendUrl + '/api/chat',
        { message: userText, mode, history: newMessages.slice(-8) },
        { headers: { token } }
      );

      const botMsg = {
        role: 'bot',
        content: res.data.reply,
        // ✅ attach matched doctor cards to the message
        doctors: res.data.matchedDoctors || [],
      };
      setMessages([...newMessages, botMsg]);
    } catch (err) {
      setMessages([...newMessages, {
        role: 'bot',
        content: "I'm sorry, I couldn't connect right now. Please try again in a moment. 🙏",
        doctors: [],
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!token) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Righteous&family=DM+Sans:wght@400;500;600;700&display=swap');
          .authBtn:hover { transform: translateY(-2px); }
        `}</style>
        <div style={styles.page}>
          <div style={styles.authGate}>
            <div style={styles.authIcon}>🔒</div>
            <p style={styles.authTitle}>Login to Access DocTalk</p>
            <p style={styles.authSubtitle}>
              DocTalk is your personal AI health companion. Please log in to your
              Docify account to start chatting with our health assistant.
            </p>
            <button className="authBtn" style={styles.authBtn} onClick={() => navigate('/login')}>
              Login / Create Account
            </button>
          </div>
        </div>
      </>
    );
  }

  const chips = isMental ? MENTAL_CHIPS : GENERAL_CHIPS;
  const showWelcome = messages.length === 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .doctalk-chip:hover { transform: translateY(-1px); box-shadow: 0 3px 10px rgba(95,111,255,0.15); }
        .doctalk-send:hover:not(:disabled) { transform: scale(1.05); }
        .doctalk-textarea:focus { border-color: rgba(95,111,255,0.5) !important; box-shadow: 0 0 0 3px rgba(95,111,255,0.08); }
        .doctor-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(95,111,255,0.18) !important; }
      `}</style>

      <div style={styles.page}>
        <div style={styles.header}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>🩺</div>
            <h1 style={styles.title}>DocTalk</h1>
          </div>
          <p style={styles.subtitle}>Your intelligent health companion — Powered by AI</p>
          <div style={styles.modeToggleBar}>
            <button style={styles.modeBtn(mode === 'general', false)} onClick={() => setMode('general')}>
              {/* ✅ CHANGED ICON: stethoscope cross = medical general health */}
              <span style={{ filter: 'sepia(1) saturate(3) hue-rotate(110deg)', display: 'inline-block' }}>⚕️</span> General Health
            </button>
            <button style={styles.modeBtn(mode === 'mental', true)} onClick={() => setMode('mental')}>
              🧠 Mental Wellness
            </button>
          </div>
        </div>

        {isMental && (
          <div style={styles.mentalBanner}>
            <span style={{ fontSize: '20px' }}>💜</span>
            <span>You're in <strong>Mental Wellness Mode</strong>. This is a safe, judgment-free space. Take your time — I'm here to listen.</span>
          </div>
        )}

        <div style={styles.chatWindow(isMental)}>
          <div style={styles.chatHeader(isMental)}>
            <div style={styles.avatarCircle}>{isMental ? '🧠' : '👨‍⚕️'}</div>
            <div style={styles.chatHeaderText}>
              <p style={styles.chatHeaderName}>{isMental ? 'DocTalk Wellness Assistant' : 'DocTalk Health Assistant'}</p>
              <p style={styles.chatHeaderStatus}><span style={styles.onlineDot} />Always here for you</p>
            </div>
          </div>

          {/* ✅ FIX: attach ref to this div, not a child element */}
          <div ref={messagesAreaRef} style={styles.messagesArea}>
            {showWelcome && (
              <div style={styles.welcomeCard(isMental)}>
                <div style={styles.welcomeEmoji}>{isMental ? '💜' : '👋'}</div>
                <p style={styles.welcomeTitle}>{isMental ? 'A safe space, just for you' : 'Hello! How can I help today?'}</p>
                <p style={styles.welcomeText}>
                  {isMental
                    ? "I'm here to listen without judgment. Whether you're feeling overwhelmed, anxious, or just need to talk — share what's on your mind."
                    : "I can help you find the right doctor, suggest home remedies for mild symptoms, or answer general health questions."}
                </p>
                <div style={styles.quickChips}>
                  {chips.map((chip) => (
                    <button key={chip} className="doctalk-chip" style={styles.chip(isMental)} onClick={() => sendMessage(chip)}>
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                <div style={styles.msgRow(msg.role === 'bot')}>
                  {msg.role === 'bot' && (
                    <div style={styles.botAvatar(isMental)}>{isMental ? '💜' : '🩺'}</div>
                  )}
                  <div style={styles.bubble(msg.role === 'bot', isMental)}>{msg.content}</div>
                </div>

                {/* ✅ DYNAMIC DOCTOR CARDS — shown below bot message if doctors matched */}
                {msg.role === 'bot' && msg.doctors && msg.doctors.length > 0 && (
                  <div style={{ paddingLeft: '38px', marginTop: '8px' }}>
                    <div style={styles.doctorCardsRow}>
                      {msg.doctors.map(doc => (
                        <div
                          key={doc._id}
                          className="doctor-card"
                          style={styles.doctorCard}
                          onClick={() => navigate(`/appointment/${doc._id}`)}
                        >
                          <img
                            src={doc.image}
                            alt={doc.name}
                            style={styles.doctorCardImg}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                          <div style={styles.doctorCardInfo}>
                            <span style={styles.doctorCardName}>{doc.name}</span>
                            <span style={styles.doctorCardSpec}>{doc.speciality}</span>
                            <span style={styles.doctorCardFee}>Rs. {doc.fees} / visit</span>
                            <span style={styles.doctorCardAvail(doc.available)}>
                              <span style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: doc.available ? '#16a34a' : '#9ca3af',
                                display: 'inline-block'
                              }} />
                              {doc.available ? 'Available' : 'Not Available'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={styles.msgRow(true)}>
                <div style={styles.botAvatar(isMental)}>{isMental ? '💜' : '🩺'}</div>
                <div style={styles.typingBubble}>
                  <div style={styles.typingDot('0s')} />
                  <div style={styles.typingDot('0.2s')} />
                  <div style={styles.typingDot('0.4s')} />
                </div>
              </div>
            )}
          </div>

          <div style={styles.inputRow}>
            <textarea
              ref={textareaRef}
              className="doctalk-textarea"
              style={styles.textarea}
              rows={1}
              placeholder={isMental ? "Share what's on your mind…" : "Ask about doctors, symptoms, or health tips…"}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              className="doctalk-send"
              style={styles.sendBtn(isMental, !input.trim() || loading)}
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              title="Send"
            >
              ➤
            </button>
          </div>
        </div>

        <p style={styles.disclaimer}>
          ⚠️ DocTalk provides general information only and is <strong>not a substitute for professional medical advice</strong>.
          In case of emergency, please call <strong>112</strong> or visit your nearest hospital.
          {isMental && ' For immediate mental health support, contact iCall: 9152987821.'}
        </p>
      </div>
    </>
  );
};

export default DocTalk;
