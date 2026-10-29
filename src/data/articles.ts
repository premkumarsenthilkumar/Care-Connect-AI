import type { Article } from '../types';

export const ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Understanding Blood Pressure',
    category: 'Understanding Medical Terms',
    summary: 'Learn what blood pressure numbers mean and why monitoring matters for overall health.',
    content: `Blood pressure is the force of blood pushing against the walls of your arteries as your heart pumps.

It is measured with two numbers:
• Systolic (top number): pressure when the heart beats
• Diastolic (bottom number): pressure when the heart rests between beats

A typical healthy reading for adults is often around 120/80 mmHg, but individual targets can vary. High blood pressure usually has no obvious symptoms, which is why regular checks are important.

Lifestyle factors such as a balanced diet, regular physical activity, limiting salt, maintaining a healthy weight, and managing stress can support healthy blood pressure.

This information is educational only. Speak with a qualified healthcare professional for personal advice.`,
    readingTime: 4,
    source: 'Educational content (demo)',
    sourceUrl: 'https://www.who.int/news-room/fact-sheets/detail/hypertension',
  },
  {
    id: 'art-2',
    title: 'Cold vs Flu: Key Differences',
    category: 'Common Symptoms',
    summary: 'A clear comparison of common cold and influenza symptoms.',
    content: `Both the common cold and the flu are respiratory illnesses caused by different viruses.

Common cold: gradual onset, milder symptoms (runny nose, sneezing, mild cough, sore throat). Rarely high fever or severe body aches.

Influenza: often sudden onset, higher fever, body aches, fatigue, dry cough, headache. Can lead to more serious complications in some people.

Rest, fluids, and appropriate symptom relief are common supportive measures. Seek medical care if symptoms are severe or you have difficulty breathing.

This is general information, not a diagnosis.`,
    readingTime: 3,
    source: 'Educational content (demo)',
    sourceUrl: 'https://www.cdc.gov/flu/symptoms/coldflu.htm',
  },
  {
    id: 'art-3',
    title: 'Staying Hydrated: Why It Matters',
    category: 'Nutrition and Hydration',
    summary: 'Practical guidance on recognizing dehydration and maintaining healthy fluid intake.',
    content: `Water is essential for temperature regulation, joint lubrication, nutrient transport, and more.

Signs you may need more fluids: thirst, dark yellow urine, dry mouth, fatigue, dizziness, reduced urine output.

Needs vary with activity, climate, age, and health conditions. Oral rehydration solutions can help during illness with significant fluid loss. Severe dehydration requires prompt medical attention.

Always follow personalized advice from your healthcare provider.`,
    readingTime: 3,
    source: 'Educational content (demo)',
  },
  {
    id: 'art-4',
    title: 'Preparing for a Doctor Visit',
    category: 'Preparing for Medical Appointments',
    summary: 'A practical checklist to help you get the most out of your appointment time.',
    content: `Being prepared helps you and your clinician make the most of limited appointment time.

Before the visit:
1. Write down main concerns and symptoms (onset, quality, what makes better/worse).
2. List current medications, supplements, and allergies.
3. Note recent changes in health, sleep, appetite, or energy.
4. Prepare questions you want answered.
5. Bring relevant records if available.

During: Be honest and specific. Ask for clarification. Confirm next steps.

After: Follow agreed instructions and contact the clinic if symptoms worsen.

This preparation aid does not replace professional medical advice.`,
    readingTime: 4,
    source: 'Educational content (demo)',
  },
  {
    id: 'art-5',
    title: 'Sleep Hygiene Basics',
    category: 'Sleep and Wellbeing',
    summary: 'Evidence-informed habits that support better sleep quality.',
    content: `Good sleep supports immune function, mood, concentration, and overall health.

Helpful habits: consistent sleep/wake schedule; dark, quiet, cool bedroom; limit screens before bed; avoid large meals, caffeine, and alcohol close to bedtime; daytime activity and natural light; use bed primarily for sleep.

If you consistently struggle with sleep, discuss it with a healthcare professional. This information is educational and not a treatment plan.`,
    readingTime: 3,
    source: 'Educational content (demo)',
    sourceUrl: 'https://www.cdc.gov/sleep/about_sleep/sleep_hygiene.html',
  },
  {
    id: 'art-6',
    title: 'Recognizing Fever',
    category: 'Common Symptoms',
    summary: 'What fever is, common causes, and when to seek care.',
    content: `Fever is a temporary rise in body temperature, often a sign the body is responding to infection or inflammation. A temperature of 38°C (100.4°F) or higher is commonly considered a fever in adults.

Supportive measures: rest, fluids, comfortable clothing. Medication to reduce fever may be appropriate in some cases—follow product instructions or clinician advice.

Seek medical attention for very high or prolonged fever, severe headache with stiff neck, difficulty breathing, confusion, or if you are in a higher-risk group. Never give aspirin to children or teenagers with viral illnesses.

This is general education only.`,
    readingTime: 3,
    source: 'Educational content (demo)',
  },
  {
    id: 'art-7',
    title: 'Understanding Headaches',
    category: 'Common Symptoms',
    summary: 'Types of common headaches and information worth sharing with a clinician.',
    content: `Headaches are very common and usually not caused by serious disease. Common types include tension-type headaches and migraines.

Helpful details to share: location, intensity, quality of pain; duration and frequency; triggers; associated symptoms; what you have already tried.

Seek urgent care for sudden severe "thunderclap" headache, headache with fever and stiff neck, neurological changes, or headache after head injury. Do not self-diagnose.`,
    readingTime: 4,
    source: 'Educational content (demo)',
  },
  {
    id: 'art-8',
    title: 'Preventive Care Essentials',
    category: 'Preventive Care',
    summary: 'An overview of routine checks and healthy habits that support long-term wellbeing.',
    content: `Preventive care focuses on keeping people healthy and catching issues early.

Common elements: age-appropriate screenings, vaccinations, blood pressure/cholesterol/blood sugar checks when indicated, dental and vision care, and healthy lifestyle habits.

Recommended schedules differ by age, sex, family history, and risk factors. Your primary care clinician can create a personalized plan. This overview is educational.`,
    readingTime: 3,
    source: 'Educational content (demo)',
    sourceUrl: 'https://www.who.int/health-topics/primary-health-care',
  },
  {
    id: 'art-9',
    title: 'Seasonal Allergies Overview',
    category: 'Common Symptoms',
    summary: 'Common allergy symptoms and general management approaches.',
    content: `Seasonal allergic rhinitis is triggered by pollen and other airborne allergens.

Typical symptoms: sneezing, runny or stuffy nose, itchy eyes/nose/throat, watery eyes.

General approaches: reduce outdoor exposure when pollen is high, keep windows closed, saline nasal rinses, over-the-counter antihistamines or nasal sprays when appropriate and used as directed.

See a clinician if symptoms are severe or interfere with daily life. This is not a prescription or personalized treatment plan.`,
    readingTime: 3,
    source: 'Educational content (demo)',
  },
  {
    id: 'art-10',
    title: 'Describing Symptoms Clearly',
    category: 'Preparing for Medical Appointments',
    summary: 'Tips for communicating symptoms effectively during a medical visit.',
    content: `Clear communication helps clinicians understand your concerns faster.

Use a framework covering: Onset, Location, Duration, Character, Aggravating/Alleviating factors, Radiation, Timing, Severity.

Also mention associated symptoms, impact on daily activities, what you have already tried, and your main goal for the visit. Writing notes beforehand reduces stress and improves accuracy.`,
    readingTime: 3,
    source: 'Educational content (demo)',
  },
  {
    id: 'art-11',
    title: 'Nutrition Basics for Everyday Health',
    category: 'Nutrition and Hydration',
    summary: 'Simple principles for balanced eating without complicated diets.',
    content: `A balanced pattern of eating supports energy, mood, and long-term health.

Core ideas: plenty of vegetables, fruits, and whole grains; adequate protein; healthy fats in moderation; limiting highly processed foods, added sugars, and excess salt; staying hydrated.

There is no single perfect diet for everyone. Cultural preferences and medical conditions matter. Work with a qualified clinician or dietitian for specific needs. This content is general education only.`,
    readingTime: 3,
    source: 'Educational content (demo)',
  },
  {
    id: 'art-12',
    title: 'When to Seek Urgent Care',
    category: 'General Health',
    summary: 'Guidance on recognizing situations that need prompt professional attention.',
    content: `Knowing when to seek care can be life-saving.

Examples requiring emergency services (call 112 in India or your local emergency number):
• Severe difficulty breathing
• Chest pain or pressure with sweating, nausea, or arm/jaw pain
• Signs of stroke: sudden face drooping, arm weakness, speech difficulty
• Sudden severe headache with stiff neck or confusion
• Uncontrolled bleeding
• Loss of consciousness or seizure
• Severe allergic reaction with swelling or breathing trouble
• Major trauma

For less urgent concerns, contact a clinician or urgent care promptly. This assistant cannot monitor emergencies or dispatch help.`,
    readingTime: 4,
    source: 'Educational content (demo)',
  },
];
