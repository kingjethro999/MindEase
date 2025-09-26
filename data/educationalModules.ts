import { Brain, Heart, Shield, Zap, HelpCircle } from 'lucide-react-native';

export interface EducationalModule {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  overview: {
    heroTitle: string;
    heroSubtitle: string;
    stats: Array<{ number: string; label: string }>;
    whatIs: {
      title: string;
      content: string;
    };
    keyFacts: Array<{ text: string }>;
  };
  symptoms: {
    physical: Array<{ title: string; description: string; icon: any; color: string }>;
    emotional: Array<{ title: string; description: string; icon: any; color: string }>;
    behavioral: Array<{ title: string; description: string; icon: any; color: string }>;
  };
  coping: {
    immediate: Array<{ title: string; description: string; icon: any; color: string }>;
    longTerm: Array<{ title: string; description: string; icon: any; color: string }>;
    lifestyle: Array<{ title: string; description: string; icon: any; color: string }>;
  };
  support: {
    professional: Array<{ title: string; description: string; icon: any; color: string }>;
    crisis: Array<{ title: string; number: string; description: string; icon: any; color: string }>;
    resources: Array<{ title: string; description: string; icon: any; color: string }>;
    warningSigns: Array<{ text: string }>;
  };
}

export const educationalModules: EducationalModule[] = [
  {
    id: 'anxiety',
    title: 'Understanding Anxiety',
    icon: Brain,
    color: '#2196F3',
    description: 'Learn about anxiety, its symptoms, and effective coping strategies',
    overview: {
      heroTitle: 'Understanding Anxiety',
      heroSubtitle: 'Your guide to recognizing and managing anxiety',
      stats: [
        { number: '40M', label: 'Adults affected' },
        { number: '18%', label: 'Of population' },
        { number: '75%', label: 'Can be managed' }
      ],
      whatIs: {
        title: 'What is Anxiety?',
        content: 'Anxiety is your body\'s natural response to stress and perceived threats. It\'s an evolutionary survival mechanism that prepares you to face challenges. However, when anxiety becomes excessive, persistent, or disproportionate to the situation, it can interfere with daily life and well-being. Anxiety disorders are among the most common mental health conditions, affecting millions of people worldwide. The good news is that anxiety is highly treatable, and with the right support and strategies, most people can learn to manage their symptoms effectively and lead fulfilling lives.'
      },
      keyFacts: [
        { text: 'Anxiety disorders affect over 40 million adults in the U.S. alone' },
        { text: 'Women are twice as likely as men to experience anxiety disorders' },
        { text: 'Anxiety often co-occurs with depression and other mental health conditions' },
        { text: 'Physical symptoms can include rapid heartbeat, sweating, and muscle tension' },
        { text: 'Cognitive symptoms include excessive worry, racing thoughts, and difficulty concentrating' },
        { text: 'Behavioral symptoms may include avoidance, restlessness, and sleep disturbances' },
        { text: 'Anxiety can be triggered by genetics, brain chemistry, life events, and personality factors' },
        { text: 'Effective treatments include therapy, medication, lifestyle changes, and self-help strategies' }
      ]
    },
    symptoms: {
      physical: [
        { title: 'Rapid heartbeat', description: 'Heart racing or pounding', icon: Heart, color: '#F44336' },
        { title: 'Sweating', description: 'Excessive perspiration', icon: Shield, color: '#FF9800' },
        { title: 'Trembling', description: 'Shaking or trembling hands', icon: Brain, color: '#2196F3' },
        { title: 'Shortness of breath', description: 'Difficulty breathing normally', icon: Heart, color: '#4CAF50' }
      ],
      emotional: [
        { title: 'Excessive worry', description: 'Constant, uncontrollable thoughts', icon: Brain, color: '#2196F3' },
        { title: 'Restlessness', description: 'Feeling on edge or tense', icon: Shield, color: '#FF9800' },
        { title: 'Irritability', description: 'Easily frustrated or angry', icon: Heart, color: '#F44336' },
        { title: 'Difficulty concentrating', description: 'Mind going blank or racing', icon: Brain, color: '#4CAF50' }
      ],
      behavioral: [
        { title: 'Avoidance', description: 'Avoiding anxiety-provoking situations', icon: Shield, color: '#2196F3' },
        { title: 'Sleep problems', description: 'Trouble falling or staying asleep', icon: Heart, color: '#FF9800' },
        { title: 'Procrastination', description: 'Delaying tasks due to worry', icon: Brain, color: '#4CAF50' }
      ]
    },
    coping: {
      immediate: [
        { title: '4-7-8 Breathing', description: 'Inhale 4s, hold 7s, exhale 8s', icon: Heart, color: '#2196F3' },
        { title: '5-4-3-2-1 Grounding', description: 'Name 5 things you see, 4 you hear, etc.', icon: Brain, color: '#4CAF50' },
        { title: 'Progressive Muscle Relaxation', description: 'Tense and release muscle groups', icon: Shield, color: '#FF9800' }
      ],
      longTerm: [
        { title: 'Cognitive Behavioral Therapy (CBT)', description: 'Identify and challenge negative thought patterns', icon: Brain, color: '#2196F3' },
        { title: 'Exposure Therapy', description: 'Gradually face feared situations', icon: Shield, color: '#4CAF50' },
        { title: 'Mindfulness Meditation', description: 'Daily practice for stress reduction', icon: Heart, color: '#FF9800' }
      ],
      lifestyle: [
        { title: 'Regular Sleep Schedule', description: '7-9 hours of quality sleep nightly', icon: Heart, color: '#2196F3' },
        { title: 'Regular Exercise', description: '30 minutes of moderate activity daily', icon: Shield, color: '#4CAF50' },
        { title: 'Balanced Diet', description: 'Limit caffeine and processed foods', icon: Brain, color: '#FF9800' },
        { title: 'Social Support', description: 'Maintain connections with loved ones', icon: Heart, color: '#2196F3' }
      ]
    },
    support: {
      professional: [
        { title: 'Therapist/Counselor', description: 'Licensed mental health professionals', icon: Shield, color: '#2196F3' },
        { title: 'Psychiatrist', description: 'Medical doctor for medication evaluation', icon: Brain, color: '#4CAF50' },
        { title: 'Support Groups', description: 'Peer support and shared experiences', icon: Heart, color: '#FF9800' }
      ],
      crisis: [
        { title: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support and suicide prevention', icon: Heart, color: '#F44336' },
        { title: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free, 24/7 crisis support via text', icon: Shield, color: '#2196F3' }
      ],
      resources: [
        { title: 'Books & Workbooks', description: 'Evidence-based anxiety management guides', icon: Brain, color: '#2196F3' },
        { title: 'Mobile Apps', description: 'Meditation, breathing, and tracking tools', icon: Shield, color: '#4CAF50' },
        { title: 'Online Communities', description: 'Safe spaces for sharing experiences', icon: Heart, color: '#FF9800' }
      ],
      warningSigns: [
        { text: 'Thoughts of self-harm or suicide' },
        { text: 'Panic attacks that last more than 20 minutes' },
        { text: 'Inability to function in daily life' },
        { text: 'Substance use to cope with anxiety' }
      ]
    }
  },
  {
    id: 'depression',
    title: 'Coping with Depression',
    icon: Heart,
    color: '#4CAF50',
    description: 'Understanding depression and building resilience',
    overview: {
      heroTitle: 'Coping with Depression',
      heroSubtitle: 'Your guide to understanding and managing depression',
      stats: [
        { number: '280M', label: 'People affected' },
        { number: '5%', label: 'Of adults globally' },
        { number: '80%', label: 'Respond to treatment' }
      ],
      whatIs: {
        title: 'What is Depression?',
        content: 'Depression is a serious mental health condition that goes far beyond temporary sadness or grief. It\'s a complex disorder that affects your thoughts, emotions, physical health, and behavior. Depression can make even simple daily tasks feel overwhelming and can significantly impact your relationships, work, and overall quality of life. It\'s important to understand that depression is not a sign of weakness or a character flaw - it\'s a medical condition that affects millions of people worldwide. The encouraging news is that depression is highly treatable, and with proper support, most people can recover and lead fulfilling lives.'
      },
      keyFacts: [
        { text: 'Depression affects over 280 million people worldwide, making it a leading cause of disability' },
        { text: 'It can occur at any age, from childhood through older adulthood' },
        { text: 'Depression is more common in women than men, though men are less likely to seek help' },
        { text: 'Physical symptoms can include fatigue, sleep problems, appetite changes, and aches' },
        { text: 'Emotional symptoms include persistent sadness, hopelessness, and loss of interest' },
        { text: 'Cognitive symptoms may include difficulty concentrating, making decisions, and memory problems' },
        { text: 'Depression can be triggered by genetics, brain chemistry, life events, and medical conditions' },
        { text: 'Effective treatments include therapy, medication, lifestyle changes, and social support' }
      ]
    },
    symptoms: {
      physical: [
        { title: 'Fatigue', description: 'Persistent tiredness and low energy', icon: Heart, color: '#F44336' },
        { title: 'Sleep changes', description: 'Insomnia or oversleeping', icon: Shield, color: '#FF9800' },
        { title: 'Appetite changes', description: 'Weight loss or gain', icon: Brain, color: '#2196F3' },
        { title: 'Aches and pains', description: 'Unexplained physical symptoms', icon: Heart, color: '#4CAF50' }
      ],
      emotional: [
        { title: 'Persistent sadness', description: 'Feeling down most of the day', icon: Heart, color: '#F44336' },
        { title: 'Hopelessness', description: 'Feeling like things will never improve', icon: Brain, color: '#2196F3' },
        { title: 'Loss of interest', description: 'No pleasure in activities you used to enjoy', icon: Shield, color: '#FF9800' },
        { title: 'Guilt or worthlessness', description: 'Excessive self-blame or feelings of inadequacy', icon: Heart, color: '#4CAF50' }
      ],
      behavioral: [
        { title: 'Social withdrawal', description: 'Avoiding friends and family', icon: Shield, color: '#2196F3' },
        { title: 'Difficulty concentrating', description: 'Trouble making decisions or focusing', icon: Brain, color: '#4CAF50' },
        { title: 'Neglecting responsibilities', description: 'Difficulty with work, school, or daily tasks', icon: Heart, color: '#FF9800' }
      ]
    },
    coping: {
      immediate: [
        { title: 'Reach out to someone', description: 'Talk to a trusted friend or family member', icon: Heart, color: '#2196F3' },
        { title: 'Get some sunlight', description: 'Spend time outdoors or near a window', icon: Shield, color: '#4CAF50' },
        { title: 'Practice gratitude', description: 'Write down three things you\'re grateful for', icon: Brain, color: '#FF9800' }
      ],
      longTerm: [
        { title: 'Therapy', description: 'Cognitive Behavioral Therapy or other evidence-based treatments', icon: Brain, color: '#2196F3' },
        { title: 'Medication', description: 'Antidepressants prescribed by a healthcare provider', icon: Shield, color: '#4CAF50' },
        { title: 'Regular exercise', description: 'Physical activity can boost mood and energy', icon: Heart, color: '#FF9800' }
      ],
      lifestyle: [
        { title: 'Maintain routine', description: 'Keep regular sleep, meal, and activity schedules', icon: Heart, color: '#2196F3' },
        { title: 'Eat nutritious foods', description: 'Focus on whole foods and limit processed foods', icon: Shield, color: '#4CAF50' },
        { title: 'Limit alcohol', description: 'Avoid alcohol and other depressants', icon: Brain, color: '#FF9800' },
        { title: 'Stay connected', description: 'Maintain relationships and social activities', icon: Heart, color: '#2196F3' }
      ]
    },
    support: {
      professional: [
        { title: 'Psychologist', description: 'Mental health professional for therapy', icon: Brain, color: '#2196F3' },
        { title: 'Psychiatrist', description: 'Medical doctor for medication management', icon: Shield, color: '#4CAF50' },
        { title: 'Support Groups', description: 'Peer support for depression recovery', icon: Heart, color: '#FF9800' }
      ],
      crisis: [
        { title: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support and suicide prevention', icon: Heart, color: '#F44336' },
        { title: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free, 24/7 crisis support via text', icon: Shield, color: '#2196F3' }
      ],
      resources: [
        { title: 'Depression Workbooks', description: 'Self-help guides and exercises', icon: Brain, color: '#2196F3' },
        { title: 'Mood Tracking Apps', description: 'Monitor symptoms and progress', icon: Shield, color: '#4CAF50' },
        { title: 'Online Therapy', description: 'Professional help from home', icon: Heart, color: '#FF9800' }
      ],
      warningSigns: [
        { text: 'Thoughts of death or suicide' },
        { text: 'Severe depression lasting more than 2 weeks' },
        { text: 'Inability to care for basic needs' },
        { text: 'Psychotic symptoms (hallucinations or delusions)' }
      ]
    }
  },
  {
    id: 'cbt',
    title: 'Thought Management (CBT)',
    icon: Shield,
    color: '#4CAF50',
    description: 'Learn Cognitive Behavioral Therapy techniques',
    overview: {
      heroTitle: 'Thought Management (CBT)',
      heroSubtitle: 'Master your thoughts to improve your mental health',
      stats: [
        { number: '70%', label: 'Success rate' },
        { number: '12-20', label: 'Sessions typically needed' },
        { number: '50+', label: 'Years of research' }
      ],
      whatIs: {
        title: 'What is CBT?',
        content: 'Cognitive Behavioral Therapy (CBT) is a highly effective, evidence-based psychological treatment that focuses on the connection between your thoughts, feelings, and behaviors. CBT is based on the understanding that our thoughts influence our emotions and actions, and by changing unhelpful thinking patterns, we can improve our emotional well-being and behavior. This practical, goal-oriented approach teaches you specific skills to identify, challenge, and replace negative or distorted thoughts with more balanced, realistic ones. CBT is widely used to treat anxiety, depression, and many other mental health conditions, and its techniques can be learned and applied throughout your life.'
      },
      keyFacts: [
        { text: 'CBT has over 50 years of research supporting its effectiveness' },
        { text: 'It\'s effective for anxiety, depression, PTSD, OCD, and many other conditions' },
        { text: 'CBT focuses on present problems rather than past experiences' },
        { text: 'It teaches practical skills you can use throughout your life' },
        { text: 'CBT helps identify and change unhelpful thinking patterns' },
        { text: 'It\'s a collaborative approach between therapist and client' },
        { text: 'CBT techniques can be learned and practiced independently' },
        { text: 'Many people see improvement within 12-20 sessions' }
      ]
    },
    symptoms: {
      physical: [
        { title: 'Tension', description: 'Physical stress from negative thoughts', icon: Heart, color: '#F44336' },
        { title: 'Sleep issues', description: 'Racing thoughts affecting rest', icon: Shield, color: '#FF9800' },
        { title: 'Headaches', description: 'Stress-related physical symptoms', icon: Brain, color: '#2196F3' }
      ],
      emotional: [
        { title: 'Negative thinking', description: 'Automatic negative thoughts', icon: Brain, color: '#F44336' },
        { title: 'Catastrophizing', description: 'Always expecting the worst', icon: Shield, color: '#FF9800' },
        { title: 'All-or-nothing thinking', description: 'Seeing things in extremes', icon: Heart, color: '#2196F3' },
        { title: 'Overgeneralization', description: 'Making broad negative conclusions', icon: Brain, color: '#4CAF50' }
      ],
      behavioral: [
        { title: 'Avoidance', description: 'Avoiding situations due to negative thoughts', icon: Shield, color: '#2196F3' },
        { title: 'Procrastination', description: 'Delaying tasks due to perfectionism', icon: Brain, color: '#4CAF50' },
        { title: 'Social withdrawal', description: 'Isolating due to negative self-beliefs', icon: Heart, color: '#FF9800' }
      ]
    },
    coping: {
      immediate: [
        { title: 'Thought Stopping', description: 'Say "Stop!" when negative thoughts arise', icon: Brain, color: '#2196F3' },
        { title: 'Evidence Gathering', description: 'Look for facts that support or challenge thoughts', icon: Shield, color: '#4CAF50' },
        { title: 'Reframing', description: 'Restate thoughts in a more balanced way', icon: Heart, color: '#FF9800' }
      ],
      longTerm: [
        { title: 'Thought Records', description: 'Write down and analyze your thoughts', icon: Brain, color: '#2196F3' },
        { title: 'Behavioral Experiments', description: 'Test your beliefs through action', icon: Shield, color: '#4CAF50' },
        { title: 'Mindfulness', description: 'Observe thoughts without judgment', icon: Heart, color: '#FF9800' }
      ],
      lifestyle: [
        { title: 'Daily thought checking', description: 'Regular practice of CBT techniques', icon: Brain, color: '#2196F3' },
        { title: 'Journaling', description: 'Write about thoughts and feelings', icon: Shield, color: '#4CAF50' },
        { title: 'Gratitude practice', description: 'Focus on positive aspects of life', icon: Heart, color: '#FF9800' },
        { title: 'Social connections', description: 'Maintain supportive relationships', icon: Brain, color: '#2196F3' }
      ]
    },
    support: {
      professional: [
        { title: 'CBT Therapist', description: 'Licensed professional trained in CBT', icon: Brain, color: '#2196F3' },
        { title: 'Group CBT', description: 'Learn CBT skills with others', icon: Shield, color: '#4CAF50' },
        { title: 'Online CBT Programs', description: 'Self-guided CBT courses', icon: Heart, color: '#FF9800' }
      ],
      crisis: [
        { title: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support and suicide prevention', icon: Heart, color: '#F44336' },
        { title: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free, 24/7 crisis support via text', icon: Shield, color: '#2196F3' }
      ],
      resources: [
        { title: 'CBT Workbooks', description: 'Self-help guides and exercises', icon: Brain, color: '#2196F3' },
        { title: 'Thought Record Apps', description: 'Digital tools for tracking thoughts', icon: Shield, color: '#4CAF50' },
        { title: 'CBT Worksheets', description: 'Printable exercises and guides', icon: Heart, color: '#FF9800' }
      ],
      warningSigns: [
        { text: 'Persistent negative thoughts affecting daily life' },
        { text: 'Thoughts of self-harm or suicide' },
        { text: 'Inability to challenge negative beliefs' },
        { text: 'Significant impairment in work or relationships' }
      ]
    }
  },
  {
    id: 'resilience',
    title: 'Building Resilience',
    icon: Zap,
    color: '#FF9800',
    description: 'Develop mental strength and bounce back from challenges',
    overview: {
      heroTitle: 'Building Resilience',
      heroSubtitle: 'Develop the mental strength to overcome life\'s challenges',
      stats: [
        { number: '100%', label: 'Can be learned' },
        { number: '7', label: 'Key factors' },
        { number: 'Lifetime', label: 'Skill to develop' }
      ],
      whatIs: {
        title: 'What is Resilience?',
        content: 'Resilience is the psychological strength and flexibility that allows you to adapt, recover, and even grow from adversity, trauma, or significant stress. It\'s not about being invulnerable or never experiencing difficulties - resilient people still feel pain, grief, and stress. Instead, resilience is about having the tools, mindset, and support systems to navigate through challenges and emerge stronger. Think of resilience as emotional and mental "muscle" that can be developed and strengthened over time. It involves maintaining a positive outlook, managing emotions effectively, solving problems creatively, and maintaining meaningful connections with others.'
      },
      keyFacts: [
        { text: 'Resilience is a skill that can be learned and strengthened at any age' },
        { text: 'It\'s not about being tough or suppressing emotions - it\'s about healthy coping' },
        { text: 'Resilient people still experience stress, setbacks, and difficult emotions' },
        { text: 'Building resilience improves overall mental health and life satisfaction' },
        { text: 'Key factors include social support, problem-solving skills, and self-care' },
        { text: 'Resilience helps you adapt to change and recover from trauma' },
        { text: 'It involves maintaining hope and finding meaning in difficult experiences' },
        { text: 'Regular practice of resilience-building activities creates lasting benefits' }
      ]
    },
    symptoms: {
      physical: [
        { title: 'Stress response', description: 'How your body reacts to challenges', icon: Heart, color: '#F44336' },
        { title: 'Energy levels', description: 'Ability to maintain energy during stress', icon: Shield, color: '#FF9800' },
        { title: 'Sleep quality', description: 'How stress affects your rest', icon: Brain, color: '#2196F3' }
      ],
      emotional: [
        { title: 'Emotional regulation', description: 'Managing feelings during difficult times', icon: Heart, color: '#F44336' },
        { title: 'Optimism', description: 'Maintaining hope during challenges', icon: Shield, color: '#FF9800' },
        { title: 'Self-compassion', description: 'Being kind to yourself during setbacks', icon: Brain, color: '#2196F3' },
        { title: 'Adaptability', description: 'Flexibility in thinking and behavior', icon: Heart, color: '#4CAF50' }
      ],
      behavioral: [
        { title: 'Problem-solving', description: 'Ability to find solutions to challenges', icon: Brain, color: '#2196F3' },
        { title: 'Social support', description: 'Seeking help from others when needed', icon: Shield, color: '#4CAF50' },
        { title: 'Goal-setting', description: 'Creating and working toward meaningful goals', icon: Heart, color: '#FF9800' }
      ]
    },
    coping: {
      immediate: [
        { title: 'Deep breathing', description: 'Calm your nervous system quickly', icon: Heart, color: '#2196F3' },
        { title: 'Positive self-talk', description: 'Encourage yourself with kind words', icon: Brain, color: '#4CAF50' },
        { title: 'Reach out', description: 'Connect with a supportive person', icon: Shield, color: '#FF9800' }
      ],
      longTerm: [
        { title: 'Build connections', description: 'Develop strong relationships with others', icon: Heart, color: '#2196F3' },
        { title: 'Practice mindfulness', description: 'Develop present-moment awareness', icon: Brain, color: '#4CAF50' },
        { title: 'Set realistic goals', description: 'Create achievable objectives', icon: Shield, color: '#FF9800' }
      ],
      lifestyle: [
        { title: 'Regular exercise', description: 'Physical activity builds mental strength', icon: Heart, color: '#2196F3' },
        { title: 'Healthy sleep', description: 'Adequate rest supports resilience', icon: Shield, color: '#4CAF50' },
        { title: 'Balanced nutrition', description: 'Proper fuel for body and mind', icon: Brain, color: '#FF9800' },
        { title: 'Meaningful activities', description: 'Engage in purposeful pursuits', icon: Heart, color: '#2196F3' }
      ]
    },
    support: {
      professional: [
        { title: 'Resilience Coach', description: 'Professional guidance for building strength', icon: Brain, color: '#2196F3' },
        { title: 'Therapist', description: 'Mental health professional for support', icon: Shield, color: '#4CAF50' },
        { title: 'Support Groups', description: 'Connect with others building resilience', icon: Heart, color: '#FF9800' }
      ],
      crisis: [
        { title: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support and suicide prevention', icon: Heart, color: '#F44336' },
        { title: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free, 24/7 crisis support via text', icon: Shield, color: '#2196F3' }
      ],
      resources: [
        { title: 'Resilience Books', description: 'Guides for building mental strength', icon: Brain, color: '#2196F3' },
        { title: 'Mindfulness Apps', description: 'Tools for developing awareness', icon: Shield, color: '#4CAF50' },
        { title: 'Goal-Setting Tools', description: 'Resources for creating meaningful objectives', icon: Heart, color: '#FF9800' }
      ],
      warningSigns: [
        { text: 'Persistent inability to cope with daily stress' },
        { text: 'Thoughts of self-harm or suicide' },
        { text: 'Complete social isolation' },
        { text: 'Inability to function in daily life' }
      ]
    }
  },
  {
    id: 'help',
    title: 'When to Seek Help',
    icon: HelpCircle,
    color: '#F44336',
    description: 'Recognize when professional support is needed',
    overview: {
      heroTitle: 'When to Seek Help',
      heroSubtitle: 'Recognize the signs that professional support is needed',
      stats: [
        { number: '1 in 5', label: 'Adults need help' },
        { number: '60%', label: 'Don\'t seek treatment' },
        { number: 'Early', label: 'Intervention works best' }
      ],
      whatIs: {
        title: 'Why Seek Professional Help?',
        content: 'Seeking professional mental health support is a courageous and wise decision that can significantly improve your quality of life. Mental health professionals are trained to provide evidence-based treatments, offer objective perspective, and teach specialized coping strategies that self-help alone cannot provide. They can help you understand your symptoms, develop personalized treatment plans, and guide you through the recovery process. Professional help is particularly important when symptoms are severe, persistent, or interfering with your daily functioning. Remember, seeking help is a sign of strength and self-awareness, not weakness. Early intervention often leads to better outcomes and can prevent symptoms from worsening.'
      },
      keyFacts: [
        { text: '1 in 5 adults experiences mental illness each year, but 60% don\'t seek treatment' },
        { text: 'Mental health professionals are specially trained to help with various conditions' },
        { text: 'Seeking help is a sign of strength and self-awareness, not weakness' },
        { text: 'Many effective treatments are available, including therapy and medication' },
        { text: 'Confidentiality is protected by law - your privacy is guaranteed' },
        { text: 'Early intervention leads to better outcomes and faster recovery' },
        { text: 'Professional help can prevent symptoms from worsening over time' },
        { text: 'Treatment is often covered by insurance and available in various formats' }
      ]
    },
    symptoms: {
      physical: [
        { title: 'Severe sleep problems', description: 'Inability to sleep or excessive sleeping', icon: Heart, color: '#F44336' },
        { title: 'Unexplained physical pain', description: 'Chronic pain without medical cause', icon: Shield, color: '#FF9800' },
        { title: 'Appetite changes', description: 'Significant weight loss or gain', icon: Brain, color: '#2196F3' }
      ],
      emotional: [
        { title: 'Persistent sadness', description: 'Feeling down most of the time for weeks', icon: Heart, color: '#F44336' },
        { title: 'Overwhelming anxiety', description: 'Constant worry that interferes with life', icon: Shield, color: '#FF9800' },
        { title: 'Mood swings', description: 'Extreme emotional highs and lows', icon: Brain, color: '#2196F3' },
        { title: 'Hopelessness', description: 'Feeling like things will never get better', icon: Heart, color: '#4CAF50' }
      ],
      behavioral: [
        { title: 'Social isolation', description: 'Avoiding friends, family, and activities', icon: Shield, color: '#2196F3' },
        { title: 'Work/school problems', description: 'Significant decline in performance', icon: Brain, color: '#4CAF50' },
        { title: 'Substance use', description: 'Using drugs or alcohol to cope', icon: Heart, color: '#FF9800' },
        { title: 'Self-harm', description: 'Hurting yourself intentionally', icon: Shield, color: '#F44336' }
      ]
    },
    coping: {
      immediate: [
        { title: 'Crisis hotlines', description: 'Call 988 for immediate support', icon: Heart, color: '#F44336' },
        { title: 'Emergency services', description: 'Call 911 if in immediate danger', icon: Shield, color: '#FF9800' },
        { title: 'Trusted person', description: 'Reach out to someone you trust', icon: Brain, color: '#2196F3' }
      ],
      longTerm: [
        { title: 'Find a therapist', description: 'Look for licensed mental health professionals', icon: Brain, color: '#2196F3' },
        { title: 'Primary care doctor', description: 'Start with your regular healthcare provider', icon: Shield, color: '#4CAF50' },
        { title: 'Support groups', description: 'Connect with others facing similar challenges', icon: Heart, color: '#FF9800' }
      ],
      lifestyle: [
        { title: 'Research options', description: 'Learn about different types of help available', icon: Brain, color: '#2196F3' },
        { title: 'Ask for recommendations', description: 'Get referrals from trusted sources', icon: Shield, color: '#4CAF50' },
        { title: 'Check insurance', description: 'Understand your coverage and costs', icon: Heart, color: '#FF9800' },
        { title: 'Prepare questions', description: 'Write down what you want to ask', icon: Brain, color: '#2196F3' }
      ]
    },
    support: {
      professional: [
        { title: 'Psychologist', description: 'Licensed therapist for talk therapy', icon: Brain, color: '#2196F3' },
        { title: 'Psychiatrist', description: 'Medical doctor for medication evaluation', icon: Shield, color: '#4CAF50' },
        { title: 'Counselor', description: 'Licensed professional counselor', icon: Heart, color: '#FF9800' },
        { title: 'Social Worker', description: 'Licensed clinical social worker', icon: Brain, color: '#2196F3' }
      ],
      crisis: [
        { title: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support and suicide prevention', icon: Heart, color: '#F44336' },
        { title: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free, 24/7 crisis support via text', icon: Shield, color: '#2196F3' },
        { title: 'Emergency Services', number: '911', description: 'Call for immediate life-threatening emergencies', icon: Brain, color: '#F44336' }
      ],
      resources: [
        { title: 'Psychology Today', description: 'Find therapists in your area', icon: Brain, color: '#2196F3' },
        { title: 'NAMI', description: 'National Alliance on Mental Illness resources', icon: Shield, color: '#4CAF50' },
        { title: 'SAMHSA', description: 'Substance Abuse and Mental Health Services', icon: Heart, color: '#FF9800' }
      ],
      warningSigns: [
        { text: 'Thoughts of suicide or self-harm' },
        { text: 'Inability to care for basic needs' },
        { text: 'Psychotic symptoms (hallucinations, delusions)' },
        { text: 'Substance abuse interfering with daily life' }
      ]
    }
  }
];

export const getModuleById = (id: string): EducationalModule | undefined => {
  return educationalModules.find(module => module.id === id);
};

