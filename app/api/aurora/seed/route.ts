import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import QA from '@/models/QA';

const seedData = [
  {
    category: 'GENERAL',
    question: 'Is it normal to feel very tired?',
    keywords: ['tired', 'exhausted', 'always sleepy', 'fatigue', 'very tired', 'sleepy', 'no energy', 'sluggish'],
    response: 'Yes, it’s completely normal to feel unusually tired in early pregnancy. Your body is working hard to support your baby’s development, and hormonal changes can make you feel exhausted. Try to rest when you can and stay hydrated. If the fatigue feels extreme or persistent, consider speaking with your doctor.'
  },
  {
    category: 'GENERAL',
    question: 'Why do I feel nauseous all the time?',
    keywords: ['nausea', 'vomiting', 'morning sickness', 'feeling sick', 'throwing up', 'sick to my stomach', 'puking'],
    response: 'Nausea, often called morning sickness, is very common in early pregnancy. It is caused by hormonal changes and usually improves after the first trimester. Eating small meals, staying hydrated, and avoiding strong smells may help reduce the discomfort.'
  },
  {
    category: 'GENERAL',
    question: 'Is spotting normal?',
    keywords: ['spotting', 'light bleeding', 'small blood', 'tinted discharge', 'pink discharge', 'brown discharge'],
    response: 'Light spotting can happen in early pregnancy and is sometimes harmless. However, it’s important to monitor it. If the bleeding becomes heavy or is accompanied by pain, you should contact your doctor immediately.'
  },
  {
    category: 'MOVEMENT',
    question: 'Why hasn’t my baby kicked today?',
    keywords: ['no movement', 'baby not kicking', 'no kicks today', 'decreased movement', 'hasnt kicked', 'quieter'],
    response: 'It can be normal for babies to have quieter periods, especially earlier in pregnancy. Try lying on your side and focusing on movements. If you notice a consistent decrease in movement for a long period, please contact your doctor immediately.'
  },
  {
    category: 'MOVEMENT',
    question: 'My baby is kicking too much, is that okay?',
    keywords: ['too much movement', 'excessive kicking', 'baby very active', 'kicking a lot', 'hyperactive baby'],
    response: 'Increased movement is often a good sign that your baby is active and healthy. However, sudden extreme changes in movement patterns should be observed. If anything feels unusual or concerning, speak with your doctor.'
  },
  {
    category: 'HUNGER',
    question: 'Why am I always hungry?',
    keywords: ['always hungry', 'eating a lot', 'increased appetite', 'starving', 'craving food'],
    response: 'It’s normal to feel hungrier during pregnancy as your body needs more energy to support your baby’s growth. Try to eat balanced meals and healthy snacks throughout the day.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Why do I feel lazy or unmotivated?',
    keywords: ['lazy', 'no energy', 'low motivation', 'unmotivated', 'couch potato', 'slacker'],
    response: 'Feeling low on energy or unmotivated can happen due to hormonal changes and physical demands of pregnancy. Be kind to yourself, rest when needed, and avoid overexertion.'
  },
  {
    category: 'PAIN',
    question: 'Is lower abdominal pain normal?',
    keywords: ['stomach pain', 'abdominal pain', 'cramps', 'lower stomach hurting', 'belly cramp'],
    response: 'Mild abdominal discomfort can be normal as your body changes and stretches. However, severe or persistent pain should not be ignored. Please consult your doctor if the pain worsens.'
  },
  {
    category: 'PAIN',
    question: 'Why is my back hurting?',
    keywords: ['back pain', 'waist pain', 'lower back hurt', 'spine ache'],
    response: 'Back pain is common during pregnancy due to posture changes and added weight. Gentle stretching, proper posture, and rest can help ease the discomfort.'
  },
  {
    category: 'HEART_RATE',
    question: 'Is my baby’s heart rate normal?',
    keywords: ['heart rate', 'bpm', 'heartbeat normal', 'baby heartbeat', 'fetal heart rate'],
    response: 'A normal fetal heart rate typically ranges between 110 and 160 beats per minute. If your readings fall within this range, it is generally considered normal. If you are unsure, consult your doctor for confirmation.'
  },
  {
    category: 'LIFESTYLE',
    question: 'Can I exercise?',
    keywords: ['exercise', 'workout', 'gym', 'running', 'lifting weights', 'fitness'],
    response: 'Light to moderate exercise is often safe during pregnancy and can be beneficial. However, always consult your doctor before starting or continuing any exercise routine.'
  },
  {
    category: 'LIFESTYLE',
    question: 'Can I travel?',
    keywords: ['travel', 'go on trip', 'journey', 'flying', 'road trip'],
    response: 'Travel is generally safe during pregnancy, especially in the second trimester. However, long trips or certain conditions may require medical advice. It’s best to consult your doctor before making travel plans.'
  },
  {
    category: 'ALERT',
    question: 'I feel severe pain, what should I do?',
    keywords: ['severe pain', 'intense pain', 'unbearable pain', 'stabbing pain', 'sharp pain', 'agony'],
    response: 'Severe or sudden pain is not something to ignore. Please contact your doctor or visit a medical facility immediately for proper evaluation.'
  },
  {
    category: 'ALERT',
    question: 'I am bleeding heavily',
    keywords: ['heavy bleeding', 'too much blood', 'bleeding a lot', 'gushing blood', 'blood clots'],
    response: 'Heavy bleeding during pregnancy requires immediate medical attention. Please seek emergency care or contact your doctor as soon as possible.'
  },
  {
    category: 'GENERAL',
    question: 'What should I expect this month?',
    keywords: ['what to expect', 'pregnancy stage', 'this month', 'current week', 'development'],
    response: 'Each stage of pregnancy comes with new changes for both you and your baby. You may notice physical, emotional, and hormonal changes. Regular check-ups and monitoring will help ensure everything is progressing well.'
  }
];

export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Clear existing to avoid duplicates if rerun
    await QA.deleteMany({});
    
    // InsertMany
    const result = await QA.insertMany(seedData);

    return NextResponse.json({ success: true, count: result.length });
  } catch (error) {
    console.error('Seed QA Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
