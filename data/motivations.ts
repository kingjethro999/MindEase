export interface Motivation {
  id: string;
  text: string;
  category: string;
  author?: string;
}

export const motivationsData: Motivation[] = [
  // Mood motivations
  { id: '1', text: "Every small step towards better mental health is a victory worth celebrating. Be proud of the progress you've made.", category: "mood" },
  { id: '2', text: "Your feelings are valid, and it's okay to not be okay. You are not defined by your toughest moments.", category: "mood" },
  { id: '3', text: "Healing isn't a race; it's a journey. Be patient and gentle with yourself every step of the way.", category: "mood" },
  { id: '4', text: "You have survived 100% of your worst days. That's a strength worth honoring.", category: "mood" },
  { id: '5', text: "Happiness is not a destination, it's a way of life, and it can be found in the smallest, most beautiful moments.", category: "mood" },
  { id: '6', text: "Your mental health is just as important as your physical health. Treat your mind with the same care you would your body.", category: "mood" },
  { id: '7', text: "It's okay to ask for help. You don't have to face everything alone; reaching out is a sign of immense courage.", category: "mood" },
  { id: '8', text: "Today's struggles are tomorrow's strengths. Every challenge you face builds a more resilient you.", category: "mood" },
  { id: '9', text: "You are worthy of love, care, and happiness, and you deserve to receive it from yourself first.", category: "mood" },
  { id: '10', text: "Every breath you take is a fresh start, a new opportunity to embrace the present moment.", category: "mood" },
  { id: '11', text: "Your story isn't over yet—there are beautiful chapters ahead just waiting to be written.", category: "mood" },
  { id: '12', text: "You have the power to change your perspective. Look for the light, and you will find it.", category: "mood" },

  // Sleep motivations
  { id: '13', text: "Quality sleep is not a luxury, it's a necessity. Give your body and mind the gift of rest they deserve.", category: "sleep" },
  { id: '14', text: "Your body heals and rejuvenates while you sleep. Honor this process by giving yourself a peaceful night's rest.", category: "sleep" },
  { id: '15', text: "A good night's sleep is the foundation of a great day. Let go of today's worries and prepare for a brighter tomorrow.", category: "sleep" },
  { id: '16', text: "Rest is not idleness—it's preparation for what's to come. You are recharging for your next beautiful adventure.", category: "sleep" },
  { id: '17', text: "Your dreams are worth the rest. Close your eyes and let your mind wander to a place of peace.", category: "sleep" },
  { id: '18', text: "Sleep is the golden chain that ties health and our bodies together.", category: "sleep", author: "Thomas Dekker" },
  { id: '19', text: "Tomorrow's success begins with tonight's rest. You are investing in your future self right now.", category: "sleep" },
  { id: '20', text: "Give your mind and body the gift of peaceful sleep. It is the kindest thing you can do for yourself.", category: "sleep" },
  { id: '21', text: "Sleep is the best meditation; it's a gentle reset for your mind, body, and soul.", category: "sleep" },
  { id: '22', text: "Your sleep schedule is an investment in your well-being. Prioritize it, and watch your life blossom.", category: "sleep" },
  { id: '23', text: "Rest when you need to—your body knows what it needs. Listen to its whispers, not the world's noise.", category: "sleep" },
  { id: '24', text: "Sweet dreams lead to brighter tomorrows. May your sleep be filled with peace and comfort.", category: "sleep" },

  // Support motivations
  { id: '25', text: "You are never alone in your journey. There are people who want to stand by you and lift you up.", category: "support" },
  { id: '26', text: "Asking for help is a sign of strength, not weakness. It's an act of courage that shows you value your well-being.", category: "support" },
  { id: '27', text: "Community is where healing happens. Connect with others and find a place where you feel safe and understood.", category: "support" },
  { id: '28', text: "Your vulnerability is your superpower. Sharing your story gives others the courage to share theirs.", category: "support" },
  { id: '29', text: "We rise by lifting others, and we heal by supporting each other. Your presence is a gift to those around you.", category: "support" },
  { id: '30', text: "Connection is the antidote to isolation. Reach out and let someone in; you are not a burden, you are a blessing.", category: "support" },
  { id: '31', text: "Your story can inspire others to seek help too. You are a beacon of hope.", category: "support" },
  { id: '32', text: "It takes courage to share your struggles, but it's worth it. In sharing, you find strength and a sense of belonging.", category: "support" },
  { id: '33', text: "You don't have to carry everything alone. Let someone else help hold the weight for a while.", category: "support" },
  { id: '34', text: "Support groups are proof that you're not the only one walking this path. You have a tribe.", category: "support" },
  { id: '35', text: "Reaching out is the first step towards healing. You've already taken the most important one.", category: "support" },
  { id: '36', text: "Your mental health matters, and so do you. You are a cherished part of this world.", category: "support" },

  // Mindful motivations
  { id: '37', text: "The present moment is the only time over which you have power. Ground yourself here and now, and you will find peace.", category: "mindful" },
  { id: '38', text: "Mindfulness is about being fully awake in our lives—seeing the beauty and accepting the challenges with a gentle heart.", category: "mindful" },
  { id: '39', text: "Peace comes from within. Do not seek it without. You have everything you need inside of you.", category: "mindful" },
  { id: '40', text: "Wherever you are, be there totally. The magic of life is found in this very moment.", category: "mindful" },
  { id: '41', text: "The mind is everything. What you think you become. Choose your thoughts wisely and with compassion.", category: "mindful" },
  { id: '42', text: "Mindfulness is a way of befriending ourselves and our experience. Be a kind friend to yourself.", category: "mindful" },
  { id: '43', text: "Be present in all things and thankful for all things. Gratitude is a powerful tool for finding joy.", category: "mindful" },
  { id: '44', text: "The best way to take care of the future is to take care of the present moment. Each moment is a building block.", category: "mindful" },
  { id: '45', text: "Mindfulness is not about getting anywhere else, but about being where you are with kindness and grace.", category: "mindful" },
  { id: '46', text: "Every moment is a fresh beginning, a clean slate, a chance to start anew.", category: "mindful" },
  { id: '47', text: "The art of living is to be fully alive in each moment. Savor the simple beauty that surrounds you.", category: "mindful" },
  { id: '48', text: "Presence is the greatest gift you can give yourself and others. Just be here, now.", category: "mindful" },

  // Stress motivations
  { id: '49', text: "Stress is not what happens to us, but how we respond. You have the power to choose calm over chaos.", category: "stress" },
  { id: '50', text: "You have power over your mind—not outside events. Realize this, and you will find strength beyond measure.", category: "stress", author: "Marcus Aurelius" },
  { id: '51', text: "The greatest weapon against stress is our ability to choose one thought over another. Choose a thought that brings you peace.", category: "stress", author: "William James" },
  { id: '52', text: "Stress is the trash of modern life. Take a moment to breathe and dispose of it properly. You deserve a clear mind.", category: "stress" },
  { id: '53', text: "You can't control everything, but you can control how you respond. Focus on what you can change and let go of the rest.", category: "stress" },
  { id: '54', text: "Take a deep breath. You've got this. You are capable and strong enough to handle what comes your way.", category: "stress" },
  { id: '55', text: "This too shall pass. You've survived difficult times before, and you will get through this one, too.", category: "stress" },
  { id: '56', text: "Don't let yesterday's stress ruin today's peace. Every day is a fresh opportunity for calm.", category: "stress" },
  { id: '57', text: "You are stronger than your stress. You have the resilience to overcome any obstacle.", category: "stress" },
  { id: '58', text: "One step at a time, one breath at a time. That is all you need to do to find your way back to peace.", category: "stress" },
  { id: '59', text: "Your calm mind is the ultimate weapon against your challenges. Cultivate it with care.", category: "stress" },
  { id: '60', text: "Progress, not perfection. You're doing better than you think. Be kind to yourself through the process.", category: "stress" },

  // Anxiety motivations
  { id: '61', text: "Anxiety is not your fault, but managing it is your responsibility. You have the power to calm your mind.", category: "anxiety" },
  { id: '62', text: "You are not your anxiety. You are so much more than your worries. You are a whole, beautiful person.", category: "anxiety" },
  { id: '63', text: "Breathing is the greatest pleasure in life. Use your breath as an anchor to bring yourself back to the present moment.", category: "anxiety" },
  { id: '64', text: "Anxiety is a thin stream of fear. You can choose to step out of its path and find a new way forward.", category: "anxiety" },
  { id: '65', text: "You have survived every anxious moment. You will survive this one too, because you are incredibly resilient.", category: "anxiety" },
  { id: '66', text: "Ground yourself in the present moment. This is where peace lives, and where your anxiety cannot follow.", category: "anxiety" },
  { id: '67', text: "Your anxiety is trying to protect you, but you are safe right now. Let go of the need to control what you cannot.", category: "anxiety" },
  { id: '68', text: "Feelings are temporary, but your strength is permanent. You have a deep well of inner power.", category: "anxiety" },
  { id: '69', text: "You are braver than you believe, stronger than you seem, and loved more than you know.", category: "anxiety", author: "A.A. Milne" },
  { id: '70', text: "Anxiety is the dizziness of freedom. Embrace the present and let your mind find its footing.", category: "anxiety" },
  { id: '71', text: "This moment is all you need to focus on right now. Take it one breath and one step at a time.", category: "anxiety" },
  { id: '72', text: "You are not alone in this. Many people understand what you're going through, and help is always available.", category: "anxiety" },
];

// Function to get a random motivation
export const getRandomMotivation = (): Motivation => {
  const randomIndex = Math.floor(Math.random() * motivationsData.length);
  return motivationsData[randomIndex];
};
