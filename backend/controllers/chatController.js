// FILE: backend/controllers/chatController.js
// Uses Groq API + dynamic doctor data from MongoDB

import doctorModel from '../models/doctorModel.js';

const GENERAL_SYSTEM = (doctorContext) => `You are DocTalk, a friendly AI health assistant for Docify, a doctor booking platform in West Bengal, India.

CRITICAL RULE — READ CAREFULLY:
You must ONLY recommend doctors from the EXACT LIST provided below.
NEVER invent, guess, or mention any doctor not in this list.
NEVER change a doctor's name, fees, or location.
If no doctor matches what the user needs, say exactly: "I don't have a matching specialist on Docify right now, but you can browse all doctors on our All Doctors page."

When recommending a doctor:
- Use their EXACT name as written in the list
- Mention their specialty, location, and fees
- Be warm, polite, and concise (3-5 sentences)

Never diagnose serious illness or prescribe medication.
For any symptom question always end with: Please consult a real doctor for an accurate diagnosis.

DOCIFY DOCTORS — USE ONLY THESE, NO OTHERS:
${doctorContext}`;

const MENTAL_SYSTEM = (doctorContext) => `You are DocTalk in Mental Wellness Mode, a compassionate mental health support companion for Docify. Be deeply empathetic, patient, and non-judgmental. First acknowledge the emotion, then ask a follow-up question, then offer a coping strategy. Always remind users a qualified professional can offer deeper support.

CRITICAL RULE: If user asks for a doctor, ONLY recommend from this exact list. NEVER invent doctors.
If user mentions self-harm or suicide respond: I hear you and I am so glad you reached out. You are not alone. In India you can call iCall at 9152987821.

DOCIFY DOCTORS — USE ONLY THESE:
${doctorContext}`;

// Clean Markdown formatting from the AI response
const cleanResponse = (text) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/__/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\*\s+/gm, '• ')
    .replace(/^-\s+/gm, '• ')
    .trim();
};

export const chatWithDocTalk = async (req, res) => {
  try {
    const { message, mode, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'No message provided' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'Groq API key not configured.' });
    }

    // ✅ Fetch ALL doctors live from MongoDB — includes image for cards
    const doctors = await doctorModel.find({}).select(
      'name speciality degree experience fees address available image'
    );
    console.log('Doctors fetched from DB:', doctors.length, doctors.map(d => d.name));

    // Build numbered list for system prompt
    const doctorContext = doctors.map((doc, i) => {
      const addr = `${doc.address?.line1 || ''} ${doc.address?.line2 || ''}`.trim();
      const status = doc.available ? 'Available' : 'Not Available';
      return `${i + 1}. ${doc.name} | ${doc.speciality} | ${doc.degree} | ${doc.experience} exp | Fees: Rs.${doc.fees} | ${addr} | ${status}`;
    }).join('\n');


    // If DB returned nothing, tell AI explicitly so it doesn't hallucinate
    if (doctors.length === 0) {
      return res.json({
        success: true,
        reply: "I'm having trouble accessing our doctor database right now. Please visit the All Doctors page to browse our specialists.",
        matchedDoctors: [],
      });
    }


    const systemPrompt = mode === 'mental'
      ? MENTAL_SYSTEM(doctorContext)
      : GENERAL_SYSTEM(doctorContext);

    // Build conversation history
    const priorMessages = history.slice(0, -1)
      .filter(msg => msg.content && msg.content.trim())
      .map(msg => ({
        role: msg.role === 'bot' ? 'assistant' : 'user',
        content: msg.content,
      }));

    const messages = [
      { role: 'system', content: systemPrompt },
      ...priorMessages,
      { role: 'user', content: message },
    ];

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', { 
      method: 'POST', 
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${apiKey}`, 
      }, 
      body: JSON.stringify({ 
        model: 'openai/gpt-oss-120b', 
        messages, 
        max_tokens: 512, 
        temperature: mode === 'mental' ? 0.7 : 0.5, 
      }), 
    }); 
 
    const data = await groqRes.json(); 
 
    if (!groqRes.ok) { 
      console.error('Groq API Error:', JSON.stringify(data, null, 2)); 
      return res.status(500).json({ success: false, message: 'AI service error. Please try again.' }); 
    } 
 
    const rawReply = data?.choices?.[0]?.message?.content; 
    if (!rawReply) { 
      return res.status(500).json({ success: false, message: 'No response from AI.' }); 
    } 

    // Clean Markdown formatting before sending the response to the frontend
    const reply = cleanResponse(rawReply);
 
    // Match doctors mentioned in reply by full name or name without "Dr." 
    const replyLower = reply.toLowerCase(); 
    const mentionedDoctors = doctors.filter(doc => { 
      const fullName = doc.name.toLowerCase(); 
      const withoutDr = fullName.replace('dr. ', '').replace('dr.', '').trim(); 
      return replyLower.includes(fullName) || replyLower.includes(withoutDr); 
    }); 
 
    res.json({ 
      success: true, 
      reply, 
      matchedDoctors: mentionedDoctors.map(d => ({ 
        _id: d._id, 
        name: d.name, 
        speciality: d.speciality, 
        fees: d.fees, 
        available: d.available, 
        image: d.image, 
        address: d.address, 
      })), 
    }); 
 
  } catch (error) { 
    console.error('DocTalk Error:', error.message); 
    res.status(500).json({ success: false, message: 'AI service unavailable. Please try again.' }); 
  } 
};