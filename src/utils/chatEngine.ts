import type { Message } from '../types';

const EMERGENCY_PATTERNS = [
  /can'?t\s+breathe|difficulty\s+breathing|shortness\s+of\s+breath|severe\s+breathing/i,
  /chest\s+pain|pressure\s+in\s+(my\s+)?chest|heart\s+attack/i,
  /stroke|face\s+droop|arm\s+weakness|slurred\s+speech|sudden\s+numbness/i,
  /unconscious|passed\s+out|loss\s+of\s+consciousness|seizure|convulsion/i,
  /severe\s+(allergic\s+)?reaction|anaphylaxis|throat\s+swelling|lips\s+swelling/i,
  /suicidal|kill\s+myself|end\s+my\s+life|want\s+to\s+die/i,
  /uncontrolled\s+bleeding|bleeding\s+heavily|severe\s+bleeding/i,
  /thunderclap\s+headache|worst\s+headache|sudden\s+severe\s+headache/i,
];

const CATEGORIES: { name: string; patterns: RegExp[]; response: (q: string) => string }[] = [
  {
    name: 'cold_flu',
    patterns: [/cold\s+vs\s+flu|difference\s+between\s+(a\s+)?cold\s+and\s+(the\s+)?flu|cold\s+or\s+flu/i, /\bflu\b|\bcold\b.*symptom/i],
    response: () => `**Cold vs Flu – General Information**

The common cold and influenza (flu) are both respiratory illnesses but are caused by different viruses.

**Common cold**
• Usually develops gradually
• Milder symptoms: runny/stuffy nose, sneezing, mild cough, sore throat
• Rarely causes high fever or severe body aches

**Influenza (flu)**
• Often starts suddenly
• Higher fever, body aches, significant fatigue, dry cough, headache
• Can lead to more serious complications in some people

Supportive care often includes rest, fluids, and appropriate symptom relief. Antiviral medicines may be considered for flu in certain situations—only a clinician can advise.

**When to seek care:** Difficulty breathing, high fever lasting several days, symptoms that worsen after improving, or if you are in a higher-risk group.

*This is educational information only and not a diagnosis. Consult a qualified healthcare professional for personal advice.*`,
  },
  {
    name: 'dehydration',
    patterns: [/dehydrat/i, /not\s+enough\s+(water|fluid)/i, /need\s+more\s+(water|fluid)/i],
    response: () => `**Dehydration – General Information**

Dehydration occurs when the body loses more fluid than it takes in.

**Common signs:**
• Thirst
• Dark yellow urine or reduced urine output
• Dry mouth or lips
• Fatigue or light-headedness
• In more serious cases: confusion, rapid heartbeat, very dry skin

**General supportive steps:**
• Drink water or oral rehydration solutions as appropriate
• Rest in a cool place if overheated
• Continue fluids even if appetite is low

**Seek medical care promptly if:**
• You cannot keep fluids down
• There are signs of severe dehydration
• Symptoms occur in an infant, older adult, or someone with chronic illness

*This is general education. Severe dehydration is a medical emergency—contact local emergency services if needed.*`,
  },
  {
    name: 'blood_pressure',
    patterns: [/blood\s+pressure|hypertension|what\s+is\s+bp\b/i],
    response: () => `**Blood Pressure – Simple Explanation**

Blood pressure is the force of blood against the walls of your arteries as the heart pumps.

It is written as two numbers:
• **Systolic** (top): pressure when the heart beats
• **Diastolic** (bottom): pressure when the heart rests

A commonly cited adult reference is around 120/80 mmHg, but individual targets vary based on age and health conditions.

High blood pressure often has no obvious symptoms, which is why regular checks matter. Lifestyle factors (diet, activity, salt intake, weight, stress, sleep) can influence blood pressure.

*Only a healthcare professional can interpret your readings and recommend personal management. This is educational content only.*`,
  },
  {
    name: 'headache',
    patterns: [/headache|migraine|head\s+pain/i],
    response: () => `**Headaches – Educational Overview**

Most headaches are not caused by serious disease. Common types include tension-type headaches and migraines.

**Helpful details to share with a clinician:**
• Where the pain is and how it feels (throbbing, pressure, sharp)
• How long it lasts and how often it occurs
• What triggers or relieves it
• Any associated symptoms (nausea, light sensitivity, visual changes)
• What you have already tried

**Seek urgent medical care for:**
• Sudden, extremely severe (“thunderclap”) headache
• Headache with fever, stiff neck, confusion, or rash
• Neurological changes (weakness, vision loss, difficulty speaking)
• Headache after a significant head injury

*This assistant cannot diagnose the cause of a headache. Please consult a qualified healthcare professional.*`,
  },
  {
    name: 'fever',
    patterns: [/\bfever\b|high\s+temperature|running\s+a\s+temperature/i],
    response: () => `**Fever – General Information**

Fever is a temporary rise in body temperature, often part of the body’s response to infection or inflammation. In adults, 38°C (100.4°F) or higher is commonly considered a fever.

**Supportive measures often include:**
• Rest and fluids
• Comfortable clothing and room temperature
• Medication to reduce fever when appropriate (follow label or clinician advice)

**Seek medical attention if:**
• Fever is very high or lasts more than a few days
• Severe headache, stiff neck, rash, difficulty breathing, or confusion occurs
• You are immunocompromised, pregnant, or have other serious conditions
• A young child has fever (age-specific guidance applies)

Never give aspirin to children or teenagers with viral illnesses.

*Educational information only—not a diagnosis or treatment plan.*`,
  },
  {
    name: 'sore_throat',
    patterns: [/sore\s+throat|throat\s+pain|scratchy\s+throat/i],
    response: () => `**Sore Throat – Educational Overview**

Sore throats are common and often related to viral infections (colds) or irritation. Bacterial causes such as strep throat require professional evaluation.

**General supportive ideas:**
• Warm fluids, honey (not for infants under 1 year), throat lozenges
• Rest and adequate hydration
• Humidified air if helpful

**See a clinician if:**
• Severe pain, difficulty swallowing or breathing
• High fever, rash, or swollen glands
• Symptoms last more than several days or worsen
• You have recurrent sore throats

*This is not a diagnosis. A healthcare professional can determine the cause and appropriate care.*`,
  },
  {
    name: 'appointment_prep',
    patterns: [/prepare\s+for\s+(a\s+)?(doctor|appointment|visit)|what\s+to\s+(bring|ask)|doctor\s+visit|appointment\s+prep/i],
    response: () => `**Preparing for a Doctor Visit**

Being prepared helps you make the most of limited appointment time.

**Before the visit, consider writing down:**
1. Your main concern and goals for the visit
2. Symptom details: when it started, how it feels, what makes it better or worse
3. Current medications, supplements, and known allergies
4. Recent changes in health, sleep, appetite, or energy
5. Questions you want answered

**During the visit:** Be specific and honest. Ask for clarification if anything is unclear. Confirm next steps and follow-up plans.

You can use the **Patient Support → Prepare My Doctor Visit** feature in this app to build a personal checklist.

*This is a preparation aid only and does not create a medical record or diagnosis.*`,
  },
  {
    name: 'medication_questions',
    patterns: [/pharmacist|questions?\s+(to\s+ask|about)\s+(a\s+)?medication|new\s+medication|side\s+effects?\s+of/i],
    response: () => `**Questions to Ask About a Medication**

When starting or reviewing a medication, useful questions for a pharmacist or clinician include:

• What is this medicine for and how should I take it?
• What is the usual dose and how long should I take it?
• What side effects should I watch for?
• Are there interactions with my other medicines, supplements, or foods?
• What should I do if I miss a dose?
• Are there any activities or foods I should avoid?
• How will we know if it is working?

You can explore the **Medication Information** section of this app for general educational details on common medicines.

*Never start, stop, or change a prescribed medication based solely on general information. Always follow advice from a qualified professional.*`,
  },
  {
    name: 'booking',
    patterns: [/book\s+(a\s+)?(routine\s+)?appointment|how\s+do\s+i\s+book|schedule\s+(an\s+)?appointment/i],
    response: () => `**Booking a Demo Appointment**

In this prototype you can create fictional demo appointments to explore the workflow.

1. Go to the **Appointments** section
2. Choose “Book Demo Appointment”
3. Select a purpose, specialty, date, and available time slot
4. Add optional notes and confirm

All appointments here are **demo records only**. Creating one does not book a real medical consultation with any healthcare provider.

For real care, contact your usual clinic, hospital, or healthcare service directly.`,
  },
  {
    name: 'sleep',
    patterns: [/sleep\s+hygiene|better\s+sleep|insomnia|can'?t\s+sleep|sleep\s+problem/i],
    response: () => `**Sleep Hygiene – Educational Tips**

Healthy sleep habits can support better rest:

• Keep a consistent sleep and wake schedule
• Make the bedroom dark, quiet, and cool
• Limit screens and bright light before bed
• Avoid large meals, caffeine, and alcohol close to bedtime
• Get daytime physical activity and natural light
• Use the bed primarily for sleep

If sleep problems persist despite these habits, discuss them with a healthcare professional. Persistent insomnia or excessive daytime sleepiness may need evaluation.

*This is general education, not a treatment plan.*`,
  },
  {
    name: 'allergies',
    patterns: [/allerg(y|ies)|hay\s+fever|pollen|sneezing.*itch/i],
    response: () => `**Seasonal Allergies – Overview**

Seasonal allergic rhinitis (hay fever) is triggered by pollen and other airborne allergens.

**Typical symptoms:** sneezing, runny or stuffy nose, itchy eyes/nose/throat, watery eyes.

**General approaches often discussed:**
• Reduce outdoor exposure when pollen counts are high
• Keep windows closed and consider air filtration
• Saline nasal rinses
• Over-the-counter antihistamines or nasal sprays when appropriate (follow label guidance)

See a clinician if symptoms are severe, interfere with daily life, or if you need personalized treatment advice. Allergies can sometimes coexist with asthma.

*Educational information only—not a prescription or personalized plan.*`,
  },
  {
    name: 'digestive',
    patterns: [/stomach\s+(ache|pain|upset)|digestive|nausea|indigestion|bloating|diarrhea|constipation/i],
    response: () => `**Mild Digestive Discomfort – General Information**

Occasional mild digestive symptoms (upset stomach, bloating, mild nausea) are common and often settle with rest, fluids, and light foods.

**General supportive ideas:**
• Stay hydrated
• Eat smaller, simpler meals if appetite is reduced
• Avoid foods that typically trigger your symptoms

**Seek medical care if you have:**
• Severe or persistent pain
• Persistent vomiting or inability to keep fluids down
• Blood in vomit or stool
• High fever, significant weight loss, or yellowing of the skin/eyes
• Symptoms that last more than a few days or keep returning

*This is not a diagnosis. A healthcare professional should evaluate concerning or persistent symptoms.*`,
  },
  {
    name: 'general_health',
    patterns: [/what\s+is\s+|explain|tell\s+me\s+about|mean\s+by/i],
    response: (_q: string) => `Thank you for your question about health information.

I can provide general educational explanations on common topics such as:
• Common symptoms (headache, fever, cold/flu, sore throat, dehydration)
• Medical terms (e.g., blood pressure)
• Preparing for appointments
• Medication literacy questions
• Sleep, hydration, and general wellbeing

Could you share a bit more detail about what you would like to understand? For example: “What is dehydration?” or “How can I prepare for a doctor visit?”

*I provide general health education only. I do not diagnose conditions or replace advice from a qualified healthcare professional.*`,
  },
];

function detectEmergency(text: string): boolean {
  return EMERGENCY_PATTERNS.some((p) => p.test(text));
}

function emergencyResponse(): string {
  return `**⚠️ Please Seek Emergency Care Immediately**

The symptoms or situation you described may require urgent medical attention.

**What to do right now:**
1. Call your local emergency number immediately.
   • In India: **112**
   • Elsewhere: use your country’s emergency services number
2. If available, go to the nearest emergency department or ask someone to take you.
3. Do not wait for further chat responses.

This AI assistant **cannot** monitor emergencies, dispatch help, or provide clinical treatment.

If this is not an emergency and you meant something else, please clarify. Otherwise, contact emergency services now.

*Your safety comes first.*`;
}

export function generateDemoResponse(userMessage: string): { content: string; isEmergency: boolean } {
  const text = userMessage.trim();
  if (!text) {
    return {
      content: 'Please type a health-related question and I will do my best to provide general educational information.',
      isEmergency: false,
    };
  }

  if (detectEmergency(text)) {
    return { content: emergencyResponse(), isEmergency: true };
  }

  for (const cat of CATEGORIES) {
    if (cat.patterns.some((p) => p.test(text))) {
      return { content: cat.response(text), isEmergency: false };
    }
  }

// Fallback
  return {
    content: `Thank you for your message. I am a **demo healthcare assistant** that provides general educational information.

I can help with topics such as:
• Differences between common cold and flu
• What dehydration, fever, or blood pressure mean
• Preparing for a doctor’s appointment
• Questions to ask a pharmacist
• Sleep hygiene and general wellbeing tips
• When symptoms may need professional attention

Try asking something like:
• “What is the difference between a cold and the flu?”
• “How can I prepare for a doctor's appointment?”
• “Explain blood pressure in simple terms.”

**Important:** I do not diagnose conditions, prescribe treatment, or replace a qualified healthcare professional. If you are worried about symptoms, please contact a clinician or emergency services as appropriate.`,
    isEmergency: false,
  };
}

export async function generateAIResponse(
  userMessage: string,
  options: { demoMode: boolean; apiKey?: string }
): Promise<{ content: string; isEmergency: boolean }> {
  const text = userMessage.trim();
  if (!text) {
    return {
      content: 'Please type a health-related question and I will do my best to provide general educational information.',
      isEmergency: false,
    };
  }

  // CRITICAL MEDICAL SAFETY: Always check for acute emergency symptoms first
  if (detectEmergency(text)) {
    return { content: emergencyResponse(), isEmergency: true };
  }

  // If Demo Mode is active, run local deterministic engine
  if (options.demoMode) {
    return generateDemoResponse(text);
  }

  // Real Live AI Mode
  const key = options.apiKey?.trim();
  if (!key) {
    return {
      content: `**⚠️ Real AI Mode Enabled – API Key Required**

You have enabled **Live AI Mode**, but no Gemini API key has been provided yet.

**How to connect:**
1. Navigate to **Settings** in the left sidebar.
2. Enter your **Google Gemini API Key** under **AI Assistant Engine**.
3. Or toggle the switch in the top navigation bar back to **Demo Mode** to use the offline clinical knowledge base.

*Note: Your API key is stored only locally in your browser storage and is never saved to external servers.*`,
      isEmergency: false,
    };
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text }] }],
          systemInstruction: {
            parts: [
              {
                text: `You are CareConnect AI, an empathetic, clear, and safety-conscious healthcare information assistant.
CRITICAL SAFETY & COMPLIANCE RULES:
1. Provide educational health information, symptom literacy, and doctor-visit preparation.
2. NEVER diagnose diseases or prescribe drug dosages.
3. If the user mentions acute danger signs (chest pain, stroke symptoms, severe bleeding, anaphylaxis, severe breathing distress, suicidality), urge them to immediately call local emergency services (112 in India or their local emergency number).
4. Always conclude responses with: "*This is general educational information only and does not replace medical advice from a qualified healthcare professional.*"
5. Use bold section titles and clean bullet points for clarity.`,
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      const errMsg = err?.error?.message || `HTTP ${res.status}`;
      return {
        content: `**⚠️ Live AI Connection Error**

Could not reach Gemini API (\`${errMsg}\`).

**Fallback Response (Demo Engine):**

${generateDemoResponse(text).content}`,
        isEmergency: false,
      };
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return {
        content: generateDemoResponse(text).content,
        isEmergency: false,
      };
    }

    return { content: candidateText, isEmergency: false };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Network error';
    return {
      content: `**⚠️ Live AI Network Error**

Unable to connect to Google Gemini API: \`${errMessage}\`.

**Fallback Response (Demo Engine):**

${generateDemoResponse(text).content}`,
      isEmergency: false,
    };
  }
}

export function createMessage(role: 'user' | 'assistant', content: string, isEmergency = false): Message {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
    timestamp: new Date().toISOString(),
    isEmergency,
  };
}
