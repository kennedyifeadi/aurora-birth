import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Load .env relative to script execution
const envPath = path.resolve(process.cwd(), '.env');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const index = line.indexOf('=');
    if (index > 0) {
      const key = line.substring(0, index).trim();
      const value = line.substring(index + 1).trim();
      acc[key] = value;
    }
    return acc;
  }, {});

const uri = envConfig.MONGODB_URI || 'mongodb://localhost:27017/aurora_birth';

const seedData = [
  // 🟣 EARLY PREGNANCY (1–10)
  {
    category: 'GENERAL',
    question: 'Is it normal to feel very tired?',
    keywords: ['tired', 'exhausted', 'sleepy', 'fatigue', 'no energy', 'sluggish', 'always sleepy'],
    response: 'Yes, fatigue is very common in early pregnancy due to hormonal changes and your body supporting growth. Try to rest often and stay hydrated.'
  },
  {
    category: 'GENERAL',
    question: 'Why do I feel nauseous?',
    keywords: ['nausea', 'vomiting', 'morning sickness', 'feeling sick', 'nauseous', 'gasy'],
    response: 'Nausea is common in early pregnancy and usually improves after the first trimester. Eating small meals and avoiding smells may help.'
  },
  {
    category: 'GENERAL',
    question: 'Is vomiting dangerous?',
    keywords: ['vomiting often', 'throwing up', 'puking often', 'hyperemesis', 'cannot keep food down'],
    response: 'Occasional vomiting is normal, but frequent or severe vomiting should be discussed with your doctor to avoid dehydration.'
  },
  {
    category: 'GENERAL',
    question: 'Is spotting normal?',
    keywords: ['spotting', 'light bleeding', 'small blood', 'pink discharge'],
    response: 'Light spotting can occur, but monitor it. If it increases or comes with pain, contact your doctor immediately.'
  },
  {
    category: 'GENERAL',
    question: 'Why do I feel dizzy?',
    keywords: ['dizziness', 'lightheaded', 'faint', 'room spinning'],
    response: 'Hormonal changes and low blood sugar can cause dizziness. Sit down, rest, and hydrate when it happens.'
  },
  {
    category: 'GENERAL',
    question: 'Why do I have headaches?',
    keywords: ['headache', 'head pain', 'migraine', 'throbbing head'],
    response: 'Headaches are common due to hormonal changes. Stay hydrated and rest in a quiet space.'
  },
  {
    category: 'GENERAL',
    question: 'Is breast pain normal?',
    keywords: ['breast pain', 'sore breasts', 'nipple soreness', 'heavy breasts'],
    response: 'Yes, breast tenderness is very common as your body prepares for breastfeeding later.'
  },
  {
    category: 'GENERAL',
    question: 'Why am I emotional?',
    keywords: ['mood swings', 'emotional', 'crying easily', 'irritable'],
    response: 'Hormonal changes can affect your mood often. This is completely normal; take things easy on yourself.'
  },
  {
    category: 'GENERAL',
    question: 'Can I sleep on my back?',
    keywords: ['sleep position', 'lying position', 'sleeping on back'],
    response: 'Early in pregnancy it’s fine, but as your belly grows into are later months, it is better to sleep on your side.'
  },
  {
    category: 'GENERAL',
    question: 'Is it normal to feel bloated?',
    keywords: ['bloating', 'swollen stomach', 'gas', 'puffy belly'],
    response: 'Yes, hormonal changes during early pregnancy can cause bloating often.'
  },

  // 🔵 MOVEMENT & BABY ACTIVITY (11–20)
  {
    category: 'MOVEMENT',
    question: 'Why hasn’t my baby kicked today?',
    keywords: ['no movement', 'no kicks', 'not kicked today', 'decreased activity'],
    response: 'Babies can have quiet periods. Try lying on your left side. If reduced movement continues, contact your doctor for advice.'
  },
  {
    category: 'MOVEMENT',
    question: 'My baby is kicking too much, is it okay?',
    keywords: ['too active', 'excessive kicking', 'kicking non stop', 'hyperactive'],
    response: 'Active movement is usually a good sign, but sudden extreme changes should be monitored closely.'
  },
  {
    category: 'MOVEMENT',
    question: 'When should I start feeling kicks?',
    keywords: ['first movement', 'quickening', 'feeling kicks', 'fluttering'],
    response: 'Most mothers feel initial movements between 16–25 weeks.'
  },
  {
    category: 'MOVEMENT',
    question: 'What does baby movement feel like?',
    keywords: ['movement feeling', 'gas bubble', 'flutter', 'kick sensation'],
    response: 'It may feel like fluttering, bubbles, or gentle gentle kicks earliest.'
  },
  {
    category: 'MOVEMENT',
    question: 'Is it normal to feel movement at night?',
    keywords: ['night movement', 'kicks in bed', 'active at night'],
    response: 'Yes, babies are often more active when you are resting or lying down.'
  },
  {
    category: 'MOVEMENT',
    question: 'What if movement suddenly stops?',
    keywords: ['no movement suddenly', 'stopped kicking', 'stalled movement'],
    response: 'Try resting and observing on your side. If movement doesn’t resume, contact your doctor urgently.'
  },
  {
    category: 'MOVEMENT',
    question: 'How many kicks are normal?',
    keywords: ['kick count', 'how many kicks', 'tracking kicks'],
    response: 'Patterns matter more than exact numbers. Notice consistency in daily activity nodes.'
  },
  {
    category: 'MOVEMENT',
    question: 'Why is movement irregular?',
    keywords: ['inconsistent kicks', 'irregular movement', 'random kicks'],
    response: 'Babies don’t move in fixed schedules early on, though they develop a cycle later.'
  },
  {
    category: 'MOVEMENT',
    question: 'Can stress affect baby movement?',
    keywords: ['stress movement', 'anxiety kicks', 'worried kicking'],
    response: 'Stress can affect your perception of movement. Try to relax and monitor on your side.'
  },
  {
    category: 'MOVEMENT',
    question: 'Is slow movement bad?',
    keywords: ['slow movement', 'weak kicks', 'faint flutters'],
    response: 'Not always, but any consistent reduction compared to your usual levels should be checked.'
  },

  // 🟡 HUNGER & BODY CHANGES (21–30)
  {
    category: 'HUNGER',
    question: 'Why am I always hungry?',
    keywords: ['hungry', 'eating a lot', 'starving', 'appetite increased'],
    response: 'Your body needs more energy during pregnancy. Eat balanced meals and snacks to support growth.'
  },
  {
    category: 'HUNGER',
    question: 'Why do I have cravings?',
    keywords: ['cravings', 'craving sweets', 'craving salty'],
    response: 'Hormonal changes and nutritional needs can influence cravings. Balance them well.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Is weight gain normal?',
    keywords: ['weight gain', 'gaining weight', 'heavy'],
    response: 'Yes, gradual weight gain is completely normal and supports healthy development.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Why am I gaining weight quickly?',
    keywords: ['fast weight gain', 'rapid weight', 'gaining too fast'],
    response: 'Rapid fluctuations should be discussed with your doctor to rule out water retention items.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Why do I feel lazy?',
    keywords: ['lazy', 'low energy', 'no motivation', 'inactive'],
    response: 'Fatigue and slowing down are normal demands on your stamina. Rest when needed.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Why am I sweating more?',
    keywords: ['sweating', 'hot flashes', 'perspiration', 'sweat', 'sweaty'],
    response: 'Increased metabolism and blood volume can cause more sweating.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Why do I feel hot?',
    keywords: ['body heat', 'feeling hot', 'temperature high', 'hot', 'burning up', 'feverish'],
    response: 'Hormonal changes increase basal body temperature during cycles.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Is swelling normal?',
    keywords: ['swelling', 'feet swelling', 'edema', 'swollen ankles'],
    response: 'Mild swelling is common, but sudden severe swelling should be checked by a doctor.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Why do my feet hurt?',
    keywords: ['foot pain', 'feet ache', 'shoes tight'],
    response: 'Extra weight and centers of gravity shift can strain your arch and feet cushions.'
  },
  {
    category: 'BODY_CHANGES',
    question: 'Why do I feel thirsty?',
    keywords: ['thirsty', 'dry mouth', 'constantly drinking'],
    response: 'Your body needs significantly more fluids to build tissue and supported volumes.'
  },

  // 🔴 PAIN & DISCOMFORT (31–40)
  {
    category: 'PAIN',
    question: 'Is abdominal pain normal?',
    keywords: ['stomach pain', 'belly ache', 'abdominal discomfort'],
    response: 'Mild discomfort from stretching is normal, but severe or persistent pain needs attention.'
  },
  {
    category: 'PAIN',
    question: 'Why is my back hurting?',
    keywords: ['back pain', 'spine hurting', 'back ache'],
    response: 'Posture changes and added weight load strain back muscles significantly.'
  },
  {
    category: 'PAIN',
    question: 'Why do I have cramps?',
    keywords: ['cramps', 'cramping', 'uterine cramps'],
    response: 'Mild cramps can happen as your body adjusts. Consult if they become regular or intense.'
  },
  {
    category: 'PAIN',
    question: 'Is pelvic pain normal?',
    keywords: ['pelvic pain', 'pubic bone ache', 'hip pain'],
    response: 'Some pelvic discomfort is common as joints loosen with relaxin triggers.'
  },
  {
    category: 'PAIN',
    question: 'Why do my legs hurt?',
    keywords: ['leg pain', 'calf ache', 'varicose veins'],
    response: 'Increased weight and circulation changes can cause loads or leg heaviness.'
  },
  {
    category: 'PAIN',
    question: 'Why do I have chest discomfort?',
    keywords: ['chest pain', 'chest pressure', 'heartburn'],
    response: 'Mild surface discomfort or indigestion can occur, but heavy pressing severe pain needs check.'
  },
  {
    category: 'PAIN',
    question: 'Is headache serious?',
    keywords: ['severe headache', 'headache that wont go away', 'migraine'],
    response: 'Persistent, intense headaches accompanied by vision changes should be evaluated.'
  },
  {
    category: 'PAIN',
    question: 'Why do I feel pressure?',
    keywords: ['pressure abdomen', 'heavy pelvic', 'weight pushing down'],
    response: 'A growing uterus creating surface pressure or bladder sensations is typical.'
  },
  {
    category: 'PAIN',
    question: 'Why do I have sharp pain?',
    keywords: ['sharp pain', 'stabbing pain', 'shoot edge pain'],
    response: 'Occasional sharp pain from round ligament shifts may occur, but frequent pain needs review.'
  },
  {
    category: 'PAIN',
    question: 'Is pain during movement normal?',
    keywords: ['pain walking', 'pain turning over', 'difficulty moving'],
    response: 'Some discomfort is normal as weight shifts, but persistent pain should be checked.'
  },

  // 🟢 HEART RATE & MONITORING (41–50)
  {
    category: 'HEART_RATE',
    question: 'Is my baby’s heart rate normal?',
    keywords: ['bpm normal', 'heartbeat normal', 'fetal hr'],
    response: 'Normal fetal heart rate is safely between 110–160 beats per minute.'
  },
  {
    category: 'HEART_RATE',
    question: 'Why is heart rate high?',
    keywords: ['high bpm', 'heart beating fast', 'tachycardia'],
    response: 'Temporary increases can happen with starts or movement, but consistent high readings should be reviewed.'
  },
  {
    category: 'HEART_RATE',
    question: 'Why is heart rate low?',
    keywords: ['low bpm', 'slow heartbeat', 'bradycardia'],
    response: 'Low readings should be monitored closely and always discussed with your doctor for peace of mind.'
  },
  {
    category: 'HEART_RATE',
    question: 'Can heart rate change often?',
    keywords: ['fluctuating bpm', 'changing heartbeat'],
    response: 'Yes, variations can occur naturally just like yours, with activity levels.'
  },
  {
    category: 'HEART_RATE',
    question: 'Is irregular heart rate bad?',
    keywords: ['irregular heartbeat', 'skipping beat'],
    response: 'Some minor variation is normal, but persistent irregularities deserve professional evaluation.'
  },
  {
    category: 'HEART_RATE',
    question: 'How often should I check?',
    keywords: ['check frequency', 'how often monitor'],
    response: 'Follow your doctor’s explicit scheduling guidance for monitors.'
  },
  {
    category: 'HEART_RATE',
    question: 'What affects heart rate?',
    keywords: ['affect bpm', 'what changes HR'],
    response: 'Movement, sleeping cycles, and overall growth phases affect readings.'
  },
  {
    category: 'HEART_RATE',
    question: 'Is constant monitoring safe?',
    keywords: ['monitor always', 'frequency effects'],
    response: 'Intermittent checking is safe; avoid continuous monitoring that creates excess anxiety.'
  },
  {
    category: 'HEART_RATE',
    question: 'Why is there no reading?',
    keywords: ['no data', 'cannot find heartbeat', 'heartbeat lost'],
    response: 'Check device positioning alignment or try again later when baby shifts.'
  },
  {
    category: 'HEART_RATE',
    question: 'Can movement affect readings?',
    keywords: ['movement bpm', 'kicking rate'],
    response: 'Yes, movement naturally increases heart rate temporarily.'
  },

  // 🟠 LIFESTYLE & SAFETY (51–70)
  { category: 'LIFESTYLE', question: 'Can I exercise?', keywords: ['exercise', 'gym', 'fitness'], response: 'Light to moderate exercise is usually safe and beneficial. Avoid heavy impacts.' },
  { category: 'LIFESTYLE', question: 'Can I run?', keywords: ['run', 'jog', 'running'], response: 'Running is often safe if established before pregnancy, with your doctor’s approval.' },
  { category: 'LIFESTYLE', question: 'Can I lift heavy things?', keywords: ['lift', 'heavy lifting'], response: 'Avoid lifting heavy items as pregnancy triggers joint relaxation nodes.' },
  { category: 'LIFESTYLE', question: 'Can I travel?', keywords: ['travel', 'trip', 'journey'], response: 'Usually safe with precautions. Take regular breaks to stretch legs.' },
  { category: 'LIFESTYLE', question: 'Can I fly?', keywords: ['fly', 'flight', 'airplane'], response: 'Often safe before late pregnancy, but consult your airline and doctor.' },
  { category: 'LIFESTYLE', question: 'Can I sleep on my stomach?', keywords: ['stomach sleep'], response: 'Avoid as your pregnancy progresses to avoid pressing the uterus cardinally.' },
  { category: 'LIFESTYLE', question: 'Can I take medication?', keywords: ['medication', 'painkillers', 'pills'], response: 'Consult with your doctor before taking any form of medication.' },
  { category: 'LIFESTYLE', question: 'Can I drink coffee?', keywords: ['coffee', 'caffeine'], response: 'Limit caffeine intake according to generic safety guidelines (approx 200mg).' },
  { category: 'LIFESTYLE', question: 'Can I eat spicy food?', keywords: ['spicy food', 'chilli'], response: 'Generally safe, provided it doesn’t cause heavy heartburn effects.' },
  { category: 'LIFESTYLE', question: 'Can I fast?', keywords: ['fasting', 'diet restriction'], response: 'Consult your doctor to ensure balanced caloric intake distributes properly.' },
  { category: 'LIFESTYLE', question: 'Can I work long hours?', keywords: ['overexertion', 'work load'], response: 'Avoid fatigue. Balance heavy outputs with rest cycles.' },
  { category: 'LIFESTYLE', question: 'Can I stand for long?', keywords: ['standing long', 'foot strain'], response: 'Limit prolonged standing to reduce swelling loads.' },
  { category: 'LIFESTYLE', question: 'Can I drive?', keywords: ['drive', 'car'], response: 'Yes, if comfortable and wearing a seatbelt placed correctly beneath the bump.' },
  { category: 'LIFESTYLE', question: 'Can I have sex?', keywords: ['sex', 'intimacy'], response: 'Usually safe unless explicitly advised otherwise by your specialist.' },
  { category: 'LIFESTYLE', question: 'Can I dye my hair?', keywords: ['dye hair', 'hair spray'], response: 'Consult your doctor. Many stylists schedule items safely with proper ventilation.' },
  { category: 'LIFESTYLE', question: 'Can I swim?', keywords: ['swim', 'pool'], response: 'Highly recommended! Water supports weight making it a very safe exercise.' },
  { category: 'LIFESTYLE', question: 'Can I climb stairs?', keywords: ['stairs', 'climb'], response: 'Generally safe, maintain careful balance nodes.' },
  { category: 'LIFESTYLE', question: 'Can I eat street food?', keywords: ['street food', 'outside food'], response: 'Ensure cooked thoroughly at high temperatures to maintain hygiene.' },
  { category: 'LIFESTYLE', question: 'Can I skip meals?', keywords: ['skip meal', 'dieting'], response: 'Not recommended. Regular intervals distribute energy flows natively.' },
  { category: 'LIFESTYLE', question: 'Can I diet?', keywords: ['diet restriction'], response: 'Focus on quality nutrition, not caloric restrictions for weight loss nodes.' },

  // ⚠️ HIGH RISK / ALERT (71–80)
  { category: 'ALERT', question: 'I am bleeding heavily', keywords: ['heavy bleeding', 'gushing blood'], response: 'Heavy bleeding is an emergency. **Seek immediate medical attention or visit an ER immediately.**' },
  { category: 'ALERT', question: 'I feel severe pain', keywords: ['severe pain', 'intense pain'], response: 'Severe or stabbing pain needs urgent attention. **Contact a doctor immediately.**' },
  { category: 'ALERT', question: 'I haven’t felt movement for long', keywords: ['no movement for long'], response: 'Severe continuous lack is concerning. **Seek medical advice urgently for assessment.**' },
  { category: 'ALERT', question: 'I feel faint often', keywords: ['faint layout', 'passing out'], response: 'Frequent fainting needs review. Sit down and **contact your doctor soon.**' },
  { category: 'ALERT', question: 'I have a high fever', keywords: ['high fever', 'chills'], response: 'High temperatures during pregnancy can be dangerous. **Seek medical care promptly.**' },
  { category: 'ALERT', question: 'I am vomiting constantly', keywords: ['constant vomiting', 'can keep nothing down'], response: 'If you cannot stay hydrated, you need treatment. **Contact your doctor immediately.**' },
  { category: 'ALERT', question: 'I have blurred vision', keywords: ['blurred vision', 'stars in eyes'], response: 'Vision changes can flag blood pressure triggers. **Seek medical advice urgently.**' },
  { category: 'ALERT', question: 'I feel chest pain', keywords: ['heart attack', 'pressing chest'], response: 'Chest pressure requires emergency escalation. **Get immediate help or visit ER.**' },
  { category: 'ALERT', question: 'I cannot breathe well', keywords: ['shortness of breath', 'can breathe'], response: 'Severe breathing difficulty needs assessment. **Seek emergency care layout.**' },
  { category: 'ALERT', question: 'I feel something is wrong', keywords: ['something wrong', 'gut feeling'], response: 'Trust your instincts. **Contact your doctor for reassurance promptly.**' },

  // 🧩 GENERAL GUIDANCE (81–100)
  { category: 'GENERAL', question: 'What should I expect this month?', keywords: ['this month', 'current state'], response: 'Expect incremental adjustments, belly growth, and routine tests according to period guidelines.' },
  { category: 'GENERAL', question: 'How is my baby developing?', keywords: ['baby growth', 'anatomical check'], response: 'Your baby develops vital tissue cycles daily. Use scan diagnostics logs with your doctor for visual nodes.' },
  { category: 'GENERAL', question: 'What foods should I eat?', keywords: ['foods to eat', 'nutrition table'], response: 'Prioritize leafy greens, safe clean proteins, and fibers sustaining steady energy boosts.' },
  { category: 'GENERAL', question: 'What should I avoid?', keywords: ['foods to avoid', 'bad foods'], response: 'Avoid raw meats, unpasteurized dairy items items posing bacteria cycles hazards.' },
  { category: 'GENERAL', question: 'How can I stay healthy?', keywords: ['safest health', 'diet tips'], response: 'Stay active light mode, eat balanced plates, and schedule regular diagnostics accurately.' },
  { category: 'GENERAL', question: 'How much water should I drink?', keywords: ['water flow', 'hydration level'], response: 'Aim for approx 2.5–3 liters distributing volume syncs effectively.' },
  { category: 'GENERAL', question: 'What vitamins should I take?', keywords: ['prenatal vitamins', 'folic acid'], response: 'Folic acid, Vitamin D, and Iron accurately prescribed by your context.' },
  { category: 'GENERAL', question: 'How often should I see a doctor?', keywords: ['checkup interval', 'appointments'], response: 'Consult with layout calendars distribution loads synced forwards.' },
  { category: 'GENERAL', question: 'Is stress harmful?', keywords: ['stress load', 'anxious effect'], response: 'Extreme persistent stress isn’t ideal. Practice calming node exercises distribution.' },
  { category: 'GENERAL', question: 'How can I relax?', keywords: ['relaxation tips', 'meditation'], response: 'Try breathing routines pacing rhythmic buffers adequately.' },
  { category: 'GENERAL', question: 'Can I listen to music for my baby?', keywords: ['music layout', 'singing to baby'], response: 'Highly recommended! Syncs auditory pacing securely.' },
  { category: 'GENERAL', question: 'Can my baby hear me?', keywords: ['baby hearing', 'voices matching'], response: 'Yes! Distribution layers fully develop audibility accurately forwards.' },
  { category: 'GENERAL', question: 'When will my baby be born?', keywords: ['due date', 'birth frame'], response: 'Calculated roughly 280 days distribution flows natively forwards securely.' },
  { category: 'GENERAL', question: 'How do I prepare for delivery?', keywords: ['prepare birth', 'labor packs'], response: 'Prepare diagnostics node layouts distribution flows pack early templates.' },
  { category: 'GENERAL', question: 'What is normal during pregnancy?', keywords: ['normal cycle', 'standard symptoms'], response: 'Expect body changes pacing structural distributes accurately securely.' },
  { category: 'GENERAL', question: 'How do I track progress?', keywords: ['tracking app', 'log metrics'], response: 'Updates weights distributions, kick nodes regularly forwards.' },
  { category: 'GENERAL', question: 'Why do I feel different every day?', keywords: ['changes daily', 'different feelings'], response: 'Varying hormonal nodes distribute pacing rhythms natively dynamically.' },
  { category: 'GENERAL', question: 'Is everything okay with my baby?', keywords: ['baby safe', 'is okay'], response: 'Regular checkups confirm safe metrics accurately pacing correctly.' },
  { category: 'GENERAL', question: 'What signs should I watch for?', keywords: ['alert signs', 'warning symptoms'], response: 'Watch for severe pains distribution fluid bleeding triggers.' },
  { category: 'GENERAL', question: 'When should I go to the hospital?', keywords: ['admission time', 'hospital load'], response: 'Regular pacing contractions leaks bleeding triggers demand assessment.' },

  // 🟢 NEW ADDITIONS FROM USER (101+)
  { category: 'LIFESTYLE', question: 'Can I drink coffee?', keywords: ['coffee', 'caffeine', 'espresso', 'energy drinks'], response: 'Yes, but in moderation. Limit caffeine to less than 200mg per day (about one 12-ounce cup).' },
  { category: 'GENERAL', question: 'What foods should I avoid?', keywords: ['foods to avoid', 'sushi', 'deli meat', 'unpasteurized', 'soft cheese'], response: 'Avoid raw seafood (like sushi), unpasteurized dairy, cold deli meats, and high-mercury fish.' },
  { category: 'GENERAL', question: 'Do I really need to eat for two?', keywords: ['eat for two', 'double calories', 'weight gain', 'extra calories'], response: '"Eating for two" is a myth. You generally don\'t need extra calories in the first trimester, and only 300-450 extra in later trimesters.' },
  { category: 'GENERAL', question: 'Do I have to take prenatal vitamins?', keywords: ['prenatal vitamins', 'folic acid', 'vitamin supplements'], response: 'Yes, they ensure essential nutrients like folic acid, which is crucial in the first trimester to prevent defects.' },
  { category: 'GENERAL', question: 'How do I stop morning sickness?', keywords: ['morning sickness', 'nausea cure', 'ginger', 'throwing up medicine'], response: 'Eat small frequent meals, stay hydrated with ginger. Consult a doctor before taking new medication.' },
  { category: 'PAIN', question: 'Is it normal to have cramps?', keywords: ['cramps', 'round ligament pain', 'lower stomach hurt'], response: 'Mild cramping is common. Severe cramping, or with bleeding, needs immediate doctor evaluation.' },
  { category: 'GENERAL', question: 'Why am I so tired?', keywords: ['tired', 'fatigue', 'extreme fatigue', 'no energy'], response: 'Extreme fatigue is common early due to progesterone levels placenta building. Energy returns in 2nd trimester.' },
  { category: 'MOVEMENT', question: 'When will I feel the baby move?', keywords: ['quickening', 'first movement', 'feel kicks'], response: 'Usually feel first movements between 16-25 weeks, feeling like flutters or bubbles.' },
  { category: 'LIFESTYLE', question: 'Is it safe to exercise?', keywords: ['exercise safe', ' prenatal yoga', 'swimming'], response: 'Yes, moderate exercise like walking or swimming is encouraged. Avoid contact sports and exercises on your back later.' },
  { category: 'LIFESTYLE', question: 'Can I sleep on my back?', keywords: ['sleeping back', 'sleep side'], response: 'Sleeping on your side (especially left) is recommended later to maintain best blood flow to the baby.' },
  { category: 'LIFESTYLE', question: 'Can I sleep on my stomach?', keywords: ['sleeping stomach', 'tummy sleep'], response: 'Sleeping on your stomach becomes uncomfortable and is generally avoided in later months.' },
  { category: 'LIFESTYLE', question: 'Can I travel or fly?', keywords: ['travel', 'flying safe', 'airplane deadline'], response: 'Generally safe up to 36 weeks if healthy. Stay hydrated and move legs on long journeys.' },
  { category: 'LIFESTYLE', question: 'Is it safe to have sex?', keywords: ['sex safe', 'intercourse hurt'], response: 'In low-risk pregnancies, sex is perfectly safe as the amniotic sac protects the baby.' },
  { category: 'LIFESTYLE', question: 'Can I dye my hair?', keywords: ['dye hair', 'highlights safe', 'salon appointments'], response: 'Semi-permanent and permanent dyes are generally safe during pregnancy since absorption is minimal.' },
  { category: 'GENERAL', question: 'How do I know if I\'m in real labor?', keywords: ['real labor', 'Braxton Hicks', 'real contractions'], response: 'Real contractions grow stronger, closer together, and don\'t stop with movement. Watch the "5-1-1" rule.' },
  { category: 'ALERT', question: 'What happens if my water breaks?', keywords: ['water breaking', 'leaking fluid', 'amniotic fluid'], response: 'Can be a gush or trickle. If suspected, note color/odor and contact healthcare provider or hospital immediately.' },
  { category: 'GENERAL', question: 'What is a mucus plug?', keywords: ['mucus plug', 'bloody show', 'lost plug'], response: 'Blocks the cervix from bacteria. Losing it means softening. Labor could be hours, days, or weeks away.' },

  // 🟠 NEW ADDITIONS: Bizarre / Embarrassing / Myths (118+)
  { category: 'BODY_CHANGES', question: 'Why is my belly suddenly hairy?', keywords: ['hairy belly', 'stomach hair', 'dark hair', 'belly hair', 'weird hair growth', 'beard on stomach'], response: 'This is normal! Increased hormones can cause darker hair to grow in new places like your belly or chest. It usually sheds and returns to normal a few months postpartum.' },
  { category: 'BODY_CHANGES', question: 'Why do I smell so bad?', keywords: ['body odor', 'smell bad', 'sweat', 'stinky', 'hyperosmia'], response: 'Pregnancy hormones activate sweat glands, changing body odor. Your heightened sense of smell (hyperosmia) might also make you notice it more than others do.' },
  { category: 'BODY_CHANGES', question: 'Is it normal to drool in my sleep?', keywords: ['drooling', 'excess saliva', 'mouth watering', 'ptyalism', 'spitting'], response: 'Yes! This is called "ptyalism." Hormonal shifts increase saliva production, and slower swallowing due to nausea can lead to drooling, especially at night.' },
  { category: 'BODY_CHANGES', question: 'Why am I so gassy and constipated?', keywords: ['gas', 'constipation', 'farting', 'bloated pooping', 'cant poop', 'stomach noises'], response: 'Progesterone relaxes smooth muscles to slow digestion and absorb baby nutrients, causing gas and bloating. Stay hydrated and eat fiber.' },
  { category: 'ALERT', question: 'Did I just pee myself or did my water break?', keywords: ['pee myself', 'water broke', 'leaking urine', 'leak amniotic fluid', 'sneeze pee'], response: 'Usually, leakage when sneezing is urine (stress incontinence). Amniotic fluid is clear, continuous, and odorless. If continuous leakage persists, contact your doctor immediately.' },
  { category: 'PAIN', question: 'Why is my vulva swollen and aching?', keywords: ['swollen vulva', 'vaginal pressure', 'lightning crotch', 'shooting pain vagina', 'varicose veins down there'], response: 'Increased blood volume and pressure cause swelling. Sharp, shooting pains ("lightning crotch") can happen as the baby presses against pelvic nerves.' },
  { category: 'GENERAL', question: 'Why am I having crazy nightmares?', keywords: ['crazy nightmares', 'vivid dreams', 'weird dreams', 'scary dreams', 'giving birth to animals'], response: 'Vivid, bizarre dreams are extremely common, caused by plunging hormones, fragmented sleep from night bathroom trips, and subconscious adjustments to parenting.' },
  { category: 'GENERAL', question: 'Does heartburn mean my baby has hair?', keywords: ['heartburn baby hair', 'acid reflux myth', 'hairy baby myth', 'old wives tale'], response: 'Surprisingly, a small medical study suggested this might be true! The same hormones that relax your esophagus (causing heartburn) stimulate fetal hair growth.' },
  { category: 'GENERAL', question: 'Can reaching above my head tangle the umbilical cord?', keywords: ['reaching above head', 'tangle cord', 'stretching arms up', 'curtains hanging danger'], response: 'This is a complete myth. Your physical arm or body movements have zero impact on the cord, which only shifts based on the baby\'s acrobatics.' }
];

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('qas');
    
    await collection.deleteMany({});
    const result = await collection.insertMany(seedData);
    console.log(`Seeded ${result.insertedCount} items successfully.`);
  } catch (error) {
    console.error('Seed Error:', error);
  } finally {
    await client.close();
  }
}
run();
