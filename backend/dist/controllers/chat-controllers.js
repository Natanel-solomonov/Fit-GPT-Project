import User from "../models/User.js";
import { configureOpenAI } from "../config/openai-config.js";
import { searchYouTube } from "../config/youtubeAPI.js";
const fitnessKeywords = [
    "fitness", "exercise", "exercising", "workout", "working out", "training", "train", "health", "healthy", "wellness",
    "nutrition", "nutritional", "diet", "dieting", "strength", "strengthen", "cardio", "cardiovascular", "muscle", "muscular",
    "weight loss", "losing weight", "fat loss", "losing fat", "gain", "gaining", "endurance", "enduring", "stretch", "stretching",
    "recovery", "recover", "routine", "routinely", "gym", "gymnasium", "bodybuilding", "bodybuild", "crossfit", "yoga", "yogi",
    "pilates", "HIIT", "aerobics", "metabolism", "metabolic", "calories", "caloric", "macros", "macronutrient", "micros", "micronutrient",
    "protein", "proteins", "carbohydrates", "carbs", "fats", "lipids", "fiber", "fibrous", "hydration", "hydrate", "vitamins",
    "vitamin", "minerals", "mineral", "supplements", "supplement", "pre-workout", "post-workout", "BCAAs", "creatine", "whey protein",
    "casein protein", "meal planning", "meal prep", "cheat day", "cheat meal", "clean eating", "intermittent fasting", "keto", "paleo",
    "vegan", "vegetarian", "plant-based", "whole30", "low-carb", "high-protein", "gluten-free", "dairy-free", "sugar-free", "processed foods",
    "superfoods", "antioxidants", "detox", "detoxing", "hydration", "hydrate", "hydrating", "electrolytes", "sports drinks", "energy drinks",
    "smoothies", "protein shakes", "bodyweight exercises", "resistance training", "weight lifting", "weight lift", "lifting weights",
    "powerlifting", "olympic lifting", "olympic lift", "deadlift", "deadlifts", "squat", "squats", "bench press", "bench pressing",
    "pull-ups", "pull-up", "push-ups", "push-up", "plank", "planking", "core workout", "ab workout", "leg workout", "arm workout",
    "back workout", "shoulder workout", "full-body workout", "mobility", "mobile", "flexibility", "flexible", "balance", "balancing",
    "coordination", "coordinated", "agility", "agile", "speed", "speedy", "stamina", "HIIT", "LISS", "tabata", "bootcamp", "spin class",
    "indoor cycling", "outdoor cycling", "running", "run", "jogging", "jog", "sprinting", "sprint", "marathon", "triathlon", "swimming",
    "swim", "rowing", "row", "jump rope", "jump roping", "boxing", "box", "kickboxing", "kickbox", "martial arts", "martial artist",
    "tai chi", "jiu-jitsu", "karate", "taekwondo", "self-defense", "defending yourself", "dance fitness", "zumba", "barre", "belly dancing",
    "ballet", "tap dance", "jazz dance", "hip hop dance", "street dance", "contemporary dance", "modern dance", "aerial yoga", "hot yoga",
    "restorative yoga", "Rowing Machine", "vinyasa yoga", "ashtanga yoga", "hatha yoga", "kundalini yoga", "power yoga", "prenatal yoga", "postnatal yoga",
    "yoga therapy", "meditation", "meditating", "mindfulness", "mindful", "breathing exercises", "breathing exercise", "guided meditation",
    "mental health", "mental wellness", "stress relief", "relieving stress", "anxiety relief", "relieving anxiety", "depression management",
    "managing depression", "sleep health", "sleep hygiene", "sleep cycle", "circadian rhythm", "insomnia", "sleep apnea", "restful sleep",
    "quality sleep", "recovery", "recovering", "foam rolling", "foam roll", "massage", "massaging", "sports massage", "deep tissue massage",
    "trigger point therapy", "chiropractic care", "physical therapy", "occupational therapy", "rehabilitation", "rehabbing", "injury prevention",
    "preventing injury", "injury recovery", "recovering from injury", "ACL tear", "meniscus tear", "sprain", "strain", "fracture", "dislocation",
    "tendonitis", "bursitis", "shin splints", "plantar fasciitis", "runner's knee", "IT band syndrome", "rotator cuff injury", "tennis elbow",
    "golfer's elbow", "carpal tunnel", "lower back pain", "sciatica", "neck pain", "shoulder pain", "hip pain", "knee pain", "ankle pain",
    "foot pain", "orthotics", "braces", "compression gear", "kinesiology tape", "sports psychology", "motivation", "motivated", "goal setting",
    "setting goals", "habit formation", "forming habits", "discipline", "disciplined", "consistency", "consistent", "perseverance", "persevere",
    "mindset", "positive thinking", "visualization", "visualizing", "performance enhancement", "enhancing performance", "sports performance",
    "athletic performance", "personal best", "peak performance", "competitive sports", "team sports", "front Squat", "individual sports", "football", "soccer",
    "basketball", "baseball", "softball", "hockey", "ice hockey", "field hockey", "volleyball", "tennis", "table tennis", "badminton", "squash",
    "racquetball", "golf", "cricket", "rugby", "lacrosse", "water polo", "surfing", "skateboarding", "snowboarding", "skiing", "rock climbing",
    "climbing rocks", "bouldering", "mountaineering", "hiking", "hike", "trail running", "trail run", "obstacle course racing", "obstacle race",
    "spartan race", "tough mudder", "endurance racing", "ultramarathon", "cross-country running", "cross-country run", "track and field",
    "decathlon", "heptathlon", "pentathlon", "triathlon", "biathlon", "duathlon", "aquathlon", "ironman", "ironwoman", "paralympics", "adaptive sports",
    "wheelchair sports", "sledge hockey", "sitting volleyball", "goalball", "boccia", "archery", "shooting", "powerlifting", "wheelchair racing",
    "handcycling", "para-triathlon", "para-rowing", "para-swimming", "para-cycling", "para-equestrian", "para-canoe", "para-snowboarding",
    "para-skiing", "fitness equipment", "dumbbells", "barbells", "kettlebells", "medicine balls", "stability balls", "resistance bands", "trx",
    "battle ropes", "pull-up bar", "dip station", "power rack", "squat rack", "bench", "plyo box", "treadmill", "elliptical", "stationary bike",
    "rower", "ski erg", "climbing machine", "stair climber", "jump rope", "heart rate monitor", "fitness tracker", "smartwatch", "fitness apps",
    "workout apps", "diet apps", "calorie counter", "macro tracker", "meal planner", "fitness community", "online coaching", "personal trainer",
    "group fitness", "fitness classes", "workout buddy", "accountability partner", "fitness challenges", "fitness goals", "body composition",
    "body fat percentage", "BMI", "lean body mass", "muscle mass", "hydration levels", "inbody scan", "dexa scan", "skin calipers",
    "body tape measure", "progress photos", "fitness journal", "workout log", "training plan", "fitness goals", "short-term goals", "long-term goals",
    "SMART goals", "fitness assessment", "fitness test", "VO2 max", "lactate threshold", "anaerobic threshold", "metabolic rate", "resting metabolic rate",
    "active metabolic rate", "caloric needs", "macronutrient needs", "micronutrient needs", "supplementation", "multivitamin", "omega-3",
    "fish oil", "flaxseed oil", "vitamin D", "calcium", "magnesium", "zinc", "iron", "B vitamins", "vitamin C", "vitamin E", "probiotics",
    "prebiotics", "digestive enzymes", "collagen", "glucosamine", "chondroitin", "MSM", "hyaluronic acid", "turmeric", "curcumin", "ginger",
    "garlic", "green tea", "matcha", "apple cider vinegar", "honey", "manuka honey", "raw honey", "maple syrup", "agave nectar", "stevia",
    "monk fruit", "artificial sweeteners", "sugar substitutes", "low glycemic index", "glycemic load", "carb cycling", "carb loading", "refeed day",
    "fasting", "fasted cardio", "time-restricted eating", "alternate day fasting", "5:2 diet", "OMAD", "one meal a day", "hydration", "water intake",
    "electrolytes", "sports drinks", "coconut water", "herbal tea", "detox tea", "sleep hygiene", "sleep quality", "sleep duration", "sleep environment",
    "blue light exposure", "sleep supplements", "melatonin", "valerian root", "chamomile", "lavender", "passionflower", "magnesium", "fitness goals",
    "health goals", "lifestyle changes", "healthy habits", "wellness routines", "self-care", "mental wellness", "emotional wellness", "spiritual wellness",
    "financial wellness", "social wellness", "environmental wellness", "occupational wellness", "intellectual wellness", "physical wellness", "holistic health",
    "integrative health", "functional medicine", "alternative medicine", "complementary medicine", "naturopathy", "homeopathy", "acupuncture", "acupressure",
    "chiropractic care", "massage therapy", "reiki", "energy healing", "crystal healing", "aromatherapy", "herbal medicine", "ayurveda", "traditional Chinese medicine",
    "holistic nutrition", "detox diets", "clean eating", "plant-based diet", "Mediterranean diet", "DASH diet", "anti-inflammatory diet", "low FODMAP diet",
    "gluten-free diet", "paleo diet", "keto diet", "vegan diet", "vegetarian diet", "flexitarian diet", "raw food diet", "whole30 diet", "zone diet",
    "atkins diet", "south beach diet", "blood type diet", "macrobiotic diet", "alkaline diet", "carnivore diet", "intermittent fasting", "fasting mimicking diet",
    "5:2 diet", "16:8 diet", "20:4 diet", "OMAD diet", "meal timing", "meal frequency", "portion control", "calorie counting", "macro tracking",
    "food journaling", "food diary", "food log", "intuitive eating", "mindful eating", "emotional eating", "binge eating", "disordered eating",
    "eating disorders", "anorexia", "bulimia", "orthorexia", "body dysmorphia", "body image", "self-esteem", "self-confidence", "self-worth", "self-care",
    "self-compassion", "self-love", "body positivity", "fitness motivation", "fitness inspiration", "fitspo", "transformation", "before and after",
    "progress photos", "fitfam", "fitness community", "online fitness", "virtual fitness", "home workouts", "bodyweight workouts", "resistance band workouts",
    "dumbbell workouts", "kettlebell workouts", "HIIT workouts", "low impact workouts", "senior fitness", "youth fitness", "prenatal fitness",
    "postnatal fitness", "adaptive fitness", "inclusive fitness", "LGBTQ+ fitness", "women's fitness", "men's fitness", "celebrity workouts",
    "athlete workouts", "sports-specific training", "sport conditioning", "sport performance", "athlete nutrition", "sports supplements", "ergogenic aids",
    "performance enhancers", "steroids", "SARMs", "prohormones", "testosterone boosters", "pre-workout supplements", "intra-workout supplements",
    "post-workout supplements", "recovery supplements", "protein powders", "weight gainers", "mass gainers", "fat burners", "thermogenics",
    "appetite suppressants", "detox supplements", "cleansing supplements", "diuretics", "water pills", "caffeine", "stimulants", "nootropics",
    "brain boosters", "focus supplements", "memory supplements", "mood enhancers", "adaptogens", "ashwagandha", "rhodiola", "ginseng",
    "holy basil", "licorice root", "maca", "schisandra", "reishi mushroom", "cordyceps", "chaga", "lion's mane", "turmeric", "curcumin",
    "black pepper extract", "bioavailability", "absorption", "metabolism", "anabolism", "catabolism", "muscle hypertrophy", "muscle atrophy",
    "sarcopenia", "myofibrillar hypertrophy", "sarcoplasmic hypertrophy", "muscle endurance", "muscle strength", "muscle power", "explosive power",
    "speed strength", "strength endurance", "muscle fibers", "type I fibers", "type II fibers", "fast-twitch fibers", "slow-twitch fibers",
    "muscle recruitment", "motor units", "neuromuscular junction", "motor neuron", "muscle contraction", "isometric contraction", "isotonic contraction",
    "eccentric contraction", "concentric contraction", "stretch-shortening cycle", "plyometrics", "explosive movements", "powerlifting", "weightlifting",
    "strongman", "highland games", "gymnastics", "calisthenics", "bodyweight training", "street workout", "functional training", "movement training",
    "movement patterns", "biomechanics", "kinesiology", "exercise physiology", "sport science", "strength and conditioning", "performance coaching",
    "sports coaching", "exercise science", "human performance", "exercise testing", "fitness testing", "sport analytics", "performance analysis",
    "motion capture", "video analysis", "force plates", "EMG", "heart rate variability", "HRV", "resting heart rate", "max heart rate", "target heart rate",
    "heart rate zones", "fat burning zone", "cardio zone", "anaerobic zone", "threshold zone", "zone training", "endurance training", "base training",
    "tempo training", "interval training", "fartlek training", "polarized training", "cross-training", "active recovery", "rest days", "deload weeks",
    "tapering", "peaking", "periodization", "linear periodization", "block periodization", "undulating periodization", "conjugate training", "westside method",
    "juggernaut method", "5/3/1", "starting strength", "stronglifts", "crossfit programming", "wod", "workout of the day", "metcon", "metabolic conditioning",
    "EMOM", "every minute on the minute", "AMRAP", "as many reps as possible", "for time", "tabata", "tabata intervals", "high-intensity interval training",
    "low-intensity steady state", "steady state cardio", "aerobic base", "aerobic conditioning", "aerobic capacity", "lactate threshold", "ventilatory threshold",
    "critical power", "functional threshold power", "FTP", "power output", "wattage", "watts per kilogram", "power to weight ratio", "vital capacity", "lung capacity",
    "oxygen uptake", "oxygen consumption", "VO2 max", "VO2 peak", "aerobic fitness", "aerobic endurance", "aerobic power", "anaerobic fitness", "anaerobic endurance",
    "anaerobic power", "speed endurance", "speed training", "sprint training", "acceleration", "deceleration", "change of direction", "multi-directional movement",
    "lateral movement", "agility training", "quickness training", "reaction time", "reaction training", "cognitive training", "decision making", "game sense",
    "tactical training", "strategy training", "skill acquisition", "skill development", "skill maintenance", "technical training", "fundamentals", "basics",
    "advanced techniques", "complex movements", "compound exercises", "isolation exercises", "multi-joint exercises", "single-joint exercises", "movement patterns",
    "squat pattern", "hinge pattern", "push pattern", "pull pattern", "carry pattern", "rotation pattern", "anti-rotation pattern", "core training", "ab training",
    "oblique training", "transverse abdominis", "rectus abdominis", "internal obliques", "external obliques", "lumbar stability", "spinal stability", "pelvic stability",
    "scapular stability", "joint stability", "joint mobility", "dynamic stretching", "static stretching", "PNF stretching", "proprioceptive neuromuscular facilitation",
    "active stretching", "passive stretching", "ballistic stretching", "muscle lengthening", "muscle shortening", "muscle tension", "muscle relaxation", "muscle activation",
    "muscle inhibition", "muscle balance", "muscle imbalances", "movement dysfunctions", "movement assessments", "movement screens", "FMS", "functional movement screen",
    "Y balance test", "single-leg balance", "single-leg squat", "overhead squat", "deep squat", "inline lunge", "hurdle step", "rotational stability", "trunk stability",
    "core stability", "core strength", "core endurance", "ab strength", "ab endurance", "plank variations", "side plank", "front plank", "reverse plank", "hollow body hold",
    "arch hold", "superman hold", "bird dog", "dead bug", "mountain climbers", "bicycle crunches", "russian twists", "medicine ball slams", "medicine ball throws",
    "ball tosses", "ball catches", "partner drills", "group drills", "team drills", "individual drills", "drill progression", "drill regression", "exercise modification",
    "exercise variation", "exercise progression", "exercise regression", "adaptive exercises", "inclusive exercises", "special populations", "youth fitness", "senior fitness",
    "pre-natal fitness", "post-natal fitness", "rehabilitative exercises", "corrective exercises", "injury prevention", "injury management", "injury rehabilitation",
    "post-surgery recovery", "post-injury recovery", "sports injuries", "overuse injuries", "acute injuries", "chronic injuries", "muscle strains", "muscle sprains",
    "ligament sprains", "tendon strains", "tendonitis", "bursitis", "joint pain", "arthritis", "osteoarthritis", "rheumatoid arthritis", "fibromyalgia", "chronic fatigue syndrome",
    "CFS", "myalgic encephalomyelitis", "autoimmune conditions", "immune system health", "immune support", "immune boosters", "immune modulation", "anti-inflammatory",
    "antioxidant support", "cellular health", "mitochondrial health", "detoxification", "liver health", "kidney health", "digestive health", "gut health", "microbiome", "probiotics",
    "prebiotics", "fiber", "digestive enzymes", "gut-brain axis", "mental health", "emotional health", "stress management", "anxiety management", "depression management",
    "mental resilience", "emotional resilience", "stress resilience", "adaptogens", "cognitive function", "brain health", "neuroplasticity", "neurogenesis", "brain training",
    "memory training", "focus training", "concentration training", "attention training", "executive function", "cognitive flexibility", "working memory", "short-term memory",
    "long-term memory", "recall", "recognition", "learning", "problem-solving", "critical thinking", "analytical thinking", "creative thinking", "lateral thinking", "innovative thinking",
    "strategic thinking", "decision making", "judgment", "reasoning", "logic", "rational thinking", "emotional intelligence", "social intelligence", "interpersonal skills",
    "communication skills", "relationship skills", "conflict resolution", "negotiation", "mediation", "leadership", "teamwork", "collaboration", "cooperation", "motivation",
    "inspiration", "persuasion", "influence", "mentoring", "coaching", "teaching", "learning", "development", "growth mindset", "positive mindset", "optimism", "gratitude",
    "mindfulness", "meditation", "relaxation techniques", "breathing techniques", "visualization techniques", "self-talk", "affirmations", "goal setting", "goal achievement",
    "habit formation", "habit stacking", "routine building", "time management", "productivity", "efficiency", "effectiveness", "focus", "concentration", "attention",
    "task management", "priority setting", "organization", "planning", "scheduling", "discipline", "consistency", "persistence", "perseverance", "resilience", "grit",
    "determination", "willpower", "self-control", "self-regulation", "self-discipline", "self-motivation", "self-improvement", "personal growth", "professional growth",
    "career development", "skill development", "skill acquisition", "knowledge acquisition", "continuous learning", "lifelong learning", "curiosity", "inquisitiveness",
    "exploration", "discovery", "innovation", "creativity", "imagination", "problem solving", "solution finding", "critical thinking", "analytical thinking", "logical thinking",
    "strategic thinking", "systems thinking", "design thinking", "innovation", "entrepreneurship", "leadership", "management", "project management", "team management",
    "conflict management", "risk management", "stress management", "time management", "resource management", "financial management", "wealth management", "investment",
    "savings", "budgeting", "financial planning", "retirement planning", "estate planning", "insurance", "health insurance", "life insurance", "disability insurance",
    "long-term care insurance", "property insurance", "casualty insurance", "liability insurance", "auto insurance", "home insurance", "travel insurance", "pet insurance",
    "identity theft protection", "cybersecurity", "data protection", "privacy protection", "online security", "network security", "information security", "risk assessment",
    "risk mitigation", "risk management", "business continuity", "disaster recovery", "emergency preparedness", "crisis management", "incident management", "resilience planning",
    "resilience building", "resilience training", "resilience strategies", "resilience frameworks", "resilience models", "resilience assessments", "resilience metrics",
    "resilience indicators", "resilience measures", "resilience goals", "resilience objectives", "resilience actions", "resilience plans", "resilience programs", "resilience projects",
    "resilience policies", "resilience procedures", "resilience practices", "resilience techniques", "resilience tools", "resilience resources", "resilience support",
    "resilience networks", "resilience partnerships", "resilience collaborations", "resilience alliances", "resilience coalitions", "resilience communities", "resilience organizations",
    "resilience institutions", "resilience agencies", "resilience initiatives", "resilience efforts", "resilience campaigns", "resilience movements", "resilience education",
    "resilience training", "resilience workshops", "resilience seminars", "resilience conferences", "resilience webinars", "resilience courses", "resilience certifications",
    "resilience degrees", "resilience research", "resilience studies", "resilience publications", "resilience journals", "resilience reports", "resilience books", "resilience articles",
    "resilience blogs", "resilience podcasts", "resilience videos", "resilience documentaries", "resilience case studies", "resilience success stories", "resilience best practices",
    "resilience lessons learned", "resilience recommendations", "resilience guidelines", "resilience frameworks", "resilience standards", "resilience benchmarks",
    "resilience indicators", "resilience metrics", "resilience measurements", "resilience assessment tools", "resilience evaluation", "resilience monitoring", "resilience reporting",
    "resilience improvement", "resilience enhancement", "resilience optimization", "resilience innovation", "resilience creativity", "resilience collaboration", "resilience teamwork",
    "resilience leadership", "resilience management", "resilience planning", "resilience execution", "resilience follow-up", "resilience review", "resilience feedback",
    "resilience adaptation", "resilience transformation", "resilience evolution", "resilience revolution", "resilience renaissance", "resilience rebirth", "resilience renewal",
    "resilience reinvention", "resilience reimagining", "resilience rethinking", "resilience redesign", "resilience reengineering", "resilience restructuring", "resilience realignment",
    "resilience repositioning", "resilience recalibration", "resilience readjustment", "resilience reassessment", "resilience reevaluation", "resilience recalculation",
    "resilience reconsideration", "resilience redirection", "resilience reinvestment", "resilience redevelopment", "resilience redeployment", "resilience redistribution",
    "resilience reallocation", "resilience recompensation", "resilience reconceptualization", "resilience reeconomization", "resilience reconsolidation", "resilience reconcentration",
    "resilience reconnection", "resilience reconsolidation", "resilience reconfirmation", "resilience reconciliation", "resilience reconstruction", "resilience recommitment",
    "resilience recommission", "resilience recommitment", "resilience reconsideration", "resilience recomputation", "resilience reconsideration", "resilience recompletion",
    "resilience recompilation", "resilience recompilation", "resilience recomposition", "resilience recomposition", "resilience recompression", "resilience recompression",
    "resilience recomputation", "resilience recomputation", "resilience recompletion", "resilience recompletion", "resilience recompilation", "resilience recompilation",
    "resilience recomposition", "resilience recomposition", "resilience recompression", "resilience recompression", "Push-up", "Pull-up", "Chin-up", "Squat", "Lunge",
    "Burpee", "Plank", "Mountain climber", "Dips", "Leg raise",
    "Sit-up", "Crunch", "Jumping jack", "Pistol squat", "Handstand",
    "Handstand push-up", "Bridge", "Superman", "High knees", "Tuck jump",
    "L sit", "Muscle up", "Inverted row", "Russian twist", "Side plank",
    "Hollow body hold", "Flutter kick", "Spiderman push-up", "Diamond push-up", "Archer push-up",
    "Clap push-up", "Box jump", "Bear crawl", "Single-leg deadlift", "V-up",
    "Dragon flag", "Front lever", "Back lever", "Human flag", "Planche",
    "Windshield wipers", "Skin the cat", "Tuck planche", "Straddle planche", "Wide grip pull-up",
    "One arm push-up", "One arm pull-up", "Pike push-up", "Knee tuck", "Scissor kick",
    "Bodyweight row", "Calories", "Caloric intake", "Caloric deficit", "Calorie Surpluss", "Calorie Deficit", "Caloric surplus", "Macronutrients",
    "Protein", "Carbohydrates", "Fats", "Fiber", "Sugars",
    "Micronutrients", "Vitamins", "Minerals", "Vitamin A", "Vitamin B",
    "Vitamin C", "Vitamin D", "Vitamin E", "Vitamin K", "Calcium",
    "Iron", "Magnesium", "Potassium", "Zinc", "Sodium",
    "Phosphorus", "Cholesterol", "Omega-3 fatty acids", "Omega-6 fatty acids", "Amino acids",
    "Electrolytes", "Antioxidants", "Phytonutrients", "Probiotics", "Prebiotics",
    "Dietary supplements", "BMR (Basal Metabolic Rate)", "RDA (Recommended Dietary Allowance)", "DV (Daily Value)", "Essential nutrients",
    "Non-essential nutrients", "Trace elements", "Macrominerals", "Hydration", "Nutrient density",
    "Metabolism", "Thermic effect of food", "Insulin sensitivity", "Glycemic index", "Dietary fiber", "shedding pounds", "slimming down", "dropping weight",
    "building", "increasing", "putting on muscle", "bulking up",
    "stamina", "staying power", "lasting ability", "durability",
    "elongating", "extending", "loosening up", "flexing",
    "healing", "mending", "restoring", "recuperating",
    "schedule", "meal plan", "habit", "daily routine",
    "fitness center", "exercise facility", "workout space", "health club",
    "muscle building", "muscle growth", "physique sculpting", "muscle gaining",
    "functional fitness", "workout program", "exercise regime", "fitness plan",
    "body-weight exercises", "calisthenics", "bodyweight movements", "self-weight training",
    "strength training", "resistance workouts", "weight training", "power training",
    "weight lifting", "lifting weights", "strength lifting", "powerlifting",
    "cardio exercises", "cardiovascular workouts", "aerobic exercises", "heart-pumping activities",
    "nutritional plan", "dietary regime", "eating plan", "meal strategy",
    "nutritional intake", "dietary consumption", "food intake", "diet consumption",
    "vitamin supplements", "mineral intake", "nutritional supplements", "dietary additions",
    "pre-exercise", "before workout", "pre-gym", "pre-training",
    "post-exercise", "after workout", "post-gym", "post-training",
    "protein powder", "protein supplement", "whey powder", "casein powder",
    "muscle synthesis", "muscle repair", "muscle recovery", "muscle building",
    "strength building", "strength development", "muscle strengthening", "power building",
    "metabolic rate", "energy expenditure", "caloric burning", "metabolism rate",
    "energy levels", "caloric intake", "calorie consumption", "caloric absorption",
    "macro tracking", "macro counting", "nutrient tracking", "diet tracking",
    "meal preparation", "food prep", "diet prep", "meal planning",
    "meal planning", "meal scheduling", "food planning", "diet planning",
    "cheat day", "cheat meal", "splurge day", "indulgence day",
    "clean eating", "healthy eating", "nutritious eating", "whole food diet",
    "fasting", "time-restricted eating", "periodic fasting", "intermittent eating",
    "low-carb diet", "reduced carb diet", "carbohydrate-restricted diet", "low-carbohydrate eating",
    "plant-based diet", "vegetarian diet", "vegan diet", "plant-focused eating",
    "gluten-free diet", "wheat-free diet", "no gluten diet", "gluten-restricted diet",
    "processed foods", "refined foods", "junk food", "packaged foods",
    "superfoods", "nutrient-dense foods", "power foods", "health foods",
    "antioxidants", "free radical fighters", "oxidative stress reducers", "cell protectors",
    "sports drinks", "hydration drinks", "electrolyte drinks", "energy beverages",
    "bodyweight movements", "calisthenics", "self-resistance exercises", "body resistance workouts",
    "resistance bands", "exercise bands", "stretch bands", "fitness bands",
    "pull-up bar", "chin-up bar", "hanging bar", "exercise bar",
    "kettlebell workouts", "kettlebell exercises", "kettlebell training", "kettlebell lifts",
    "yoga poses", "yoga postures", "yoga positions", "yoga exercises",
    "core training", "abdominal workouts", "midsection exercises", "core workouts",
    "flexibility exercises", "mobility workouts", "stretching routines", "elasticity exercises",
    "balance training", "stability exercises", "equilibrium workouts", "steadiness training",
    "coordination drills", "motor skill exercises", "movement training", "skill coordination",
    "agility drills", "quickness training", "movement speed exercises", "dexterity drills",
    "speed workouts", "quickness drills", "velocity training", "rapid movement exercises",
    "HIIT workouts", "intense interval training", "high-intensity drills", "short-burst exercises",
    "cardio exercises", "aerobic activities", "endurance workouts", "heart health exercises",
    "indoor cycling", "spin class", "stationary biking", "indoor biking",
    "running", "jogging", "sprinting", "distance running",
    "boxing", "punching workouts", "combat fitness", "boxing training",
    "martial arts", "combat sports", "self-defense training", "martial training",
    "dance fitness", "dance workouts", "dance exercise", "dance-based fitness",
    "meditation", "mindfulness practice", "deep breathing", "meditative exercises",
    "mental wellness", "emotional health", "psychological health", "mind health",
    "stress relief", "stress management", "anxiety reduction", "stress alleviation",
    "sleep health", "rest health", "sleep quality", "sleep wellness",
    "foam rolling", "self-myofascial release", "foam roll exercises", "muscle rolling",
    "massage therapy", "therapeutic massage", "muscle massage", "deep tissue therapy",
    "chiropractic care", "spinal adjustment", "chiropractic treatment", "spinal care",
    "physical therapy", "physiotherapy", "rehabilitative therapy", "movement therapy",
    "injury prevention", "injury avoidance", "preventing injuries", "injury risk reduction",
    "recovery supplements", "healing supplements", "repair supplements", "recuperation supplements",
    "athletic performance", "sports performance", "fitness performance", "exercise performance",
    "fitness tracker", "activity tracker", "fitness monitor", "exercise tracker",
    "smartwatch", "wearable tech", "fitness watch", "activity watch",
    "workout apps", "fitness apps", "exercise apps", "training apps",
    "calorie counter", "caloric tracker", "food log", "nutrition tracker",
    "body fat percentage", "body composition", "fat measurement", "fat ratio",
    "lean body mass", "muscle mass", "lean tissue", "fat-free mass",
    "hydration levels", "fluid levels", "water balance", "hydration status",
    "DEXA scan", "body scan", "bone density scan", "dual-energy X-ray absorptiometry",
    "skin calipers", "body fat calipers", "fat pinchers", "fat calipers",
    "progress photos", "transformation pictures", "fitness photos", "before and after photos",
    "fitness journal", "workout diary", "exercise log", "training journal",
    "fitness goals", "exercise objectives", "training goals", "health goals",
    "fitness test", "exercise test", "fitness assessment", "physical test",
    "VO2 max", "aerobic capacity", "oxygen uptake", "maximum oxygen consumption",
    "caloric needs", "energy needs", "calorie requirements", "dietary needs",
    "macronutrient needs", "macro requirements", "nutrition needs", "dietary macronutrients",
    "supplementation", "nutritional supplements", "dietary supplementation", "nutrient supplements",
    "multivitamin", "vitamin supplement", "vitamin complex", "multi-vitamin",
    "omega-3", "fish oil", "EPA and DHA", "omega-3 fatty acids",
    "vitamin D", "sunshine vitamin", "D3 supplement", "vitamin D3",
    "calcium supplement", "bone health", "calcium intake", "mineral supplement",
    "magnesium supplement", "magnesium intake", "magnesium complex", "magnesium mineral",
    "zinc supplement", "immune health", "zinc mineral", "zinc intake",
    "iron supplement", "iron intake", "iron mineral", "iron pills",
    "B vitamins", "B complex", "B vitamin group", "B vitamins supplement",
    "vitamin C", "ascorbic acid", "C supplement", "vitamin C intake",
    "vitamin E", "tocopherol", "E supplement", "vitamin E intake",
    "probiotics", "beneficial bacteria", "gut health", "probiotic supplements",
    "prebiotics", "fiber supplements", "prebiotic foods", "gut health supplements",
    "digestive enzymes", "enzyme supplements", "digestive aids", "enzymatic support",
    "collagen", "collagen peptides", "collagen protein", "joint health supplements",
    "turmeric", "curcumin", "anti-inflammatory supplement", "turmeric extract",
    "green tea", "matcha", "tea antioxidants", "green tea extract",
    "apple cider vinegar", "ACV", "fermented apple juice", "ACV supplement",
    "raw honey", "unprocessed honey", "natural honey", "organic honey",
    "caloric surplus", "calorie excess", "energy surplus", "overconsumption of calories",
    "thermogenic", "fat burner", "metabolism booster", "calorie burner",
    "caffeine", "stimulant", "energy booster", "caffeinated drinks",
    "brain boosters", "nootropic supplements", "cognitive enhancers", "mind enhancers",
    "focus supplements", "concentration aids", "attention boosters", "focus aids",
    "mood enhancers", "mood boosters", "emotional support", "mood supplements",
    "adaptogens", "stress relievers", "natural stress relief", "adaptogenic herbs",
    "ashwagandha", "Indian ginseng", "Withania somnifera", "ashwagandha root",
    "rhodiola", "golden root", "Rhodiola rosea", "rhodiola extract",
    "ginseng", "Panax ginseng", "Asian ginseng", "ginseng root",
    "holy basil", "tulsi", "Ocimum sanctum", "holy basil extract",
    "licorice root", "glycyrrhiza", "licorice extract", "licorice supplement",
    "maca", "Peruvian ginseng", "Lepidium meyenii", "maca root",
    "reishi mushroom", "Ganoderma lucidum", "reishi extract", "reishi supplement",
    "cordyceps", "Cordyceps sinensis", "cordyceps extract", "cordyceps supplement",
    "chaga", "Inonotus obliquus", "chaga mushroom", "chaga extract",
    "lion's mane", "Hericium erinaceus", "lion's mane mushroom", "lion's mane extract",
    "black pepper extract", "piperine", "bioperine", "black pepper supplement",
    "bioavailability", "nutrient absorption", "absorption rate", "bioactive availability",
    "metabolism", "energy metabolism", "metabolic rate", "metabolic process",
    "anabolism", "building up", "constructive metabolism", "growth metabolism",
    "catabolism", "breaking down", "destructive metabolism", "degradation metabolism",
    "muscle hypertrophy", "muscle growth", "muscle enlargement", "muscle building",
    "muscle atrophy", "muscle wasting", "muscle loss", "muscle deterioration",
    "sarcopenia", "age-related muscle loss", "muscle degeneration", "muscle decline",
    "myofibrillar hypertrophy", "muscle fiber growth", "myofiber hypertrophy", "fiber hypertrophy",
    "sarcoplasmic hypertrophy", "muscle fluid increase", "sarcoplasmic growth", "muscle cell hypertrophy",
    "muscle fibers", "muscle cells", "myocytes", "muscle tissue",
    "type I fibers", "slow-twitch fibers", "endurance fibers", "aerobic fibers",
    "type II fibers", "fast-twitch fibers", "power fibers", "anaerobic fibers",
    "fast-twitch fibers", "type II fibers", "anaerobic fibers", "power fibers",
    "slow-twitch fibers", "type I fibers", "endurance fibers", "aerobic fibers",
    "muscle recruitment", "fiber activation", "muscle activation", "motor unit recruitment",
    "motor units", "motor neuron units", "neural units", "nerve-muscle units",
    "neuromuscular junction", "motor endplate", "nerve-muscle junction", "synaptic connection",
    "muscle contraction", "muscle tightening", "muscle shortening", "muscle activation",
    "isometric contraction", "static contraction", "muscle holding", "non-moving contraction",
    "isotonic contraction", "dynamic contraction", "muscle moving", "moving contraction",
    "eccentric contraction", "lengthening contraction", "muscle stretching", "negative contraction",
    "concentric contraction", "shortening contraction", "muscle shortening", "positive contraction",
    "stretch-shortening cycle", "SSC", "plyometric cycle", "stretch-reflex cycle",
    "plyometrics", "jump training", "explosive exercises", "power exercises",
    "explosive movements", "power moves", "quick movements", "dynamic exercises",
    "powerlifting", "strength lifting", "competitive lifting", "power sport",
    "weightlifting", "Olympic lifting", "competitive weightlifting", "barbell lifting",
    "strongman", "strength competitions", "strongman events", "power competitions",
    "calisthenics", "bodyweight exercises", "gymnastics", "body resistance training",
    "biomechanics", "movement science", "mechanics of movement", "physical mechanics",
    "kinesiology", "movement study", "science of movement", "body movement study",
    "exercise physiology", "exercise science", "physiology of exercise", "exercise biology",
    "strength and conditioning", "S&C", "strength training", "fitness conditioning",
    "performance coaching", "athletic coaching", "fitness coaching", "sports coaching",
    "exercise science", "exercise physiology", "physical fitness science", "exercise research",
    "human performance", "physical performance", "athletic performance", "performance science",
    "exercise testing", "fitness testing", "performance testing", "exercise assessment",
    "fitness testing", "exercise testing", "physical testing", "fitness assessment",
    "sport analytics", "performance analytics", "athletic analytics", "sports performance analysis",
    "performance analysis", "sport analysis", "athletic performance analysis", "sports assessment",
    "motion capture", "movement recording", "movement tracking", "motion tracking",
    "video analysis", "movement analysis", "video assessment", "video evaluation",
    "force plates", "force sensors", "pressure plates", "force measurement devices",
    "EMG", "electromyography", "muscle electrical activity", "muscle activation measurement",
    "heart rate variability", "HRV", "heart rhythm variability", "heart rate differences",
    "resting heart rate", "RHR", "baseline heart rate", "normal heart rate",
    "max heart rate", "MHR", "maximum heart rate", "peak heart rate",
    "target heart rate", "THR", "exercise heart rate", "training heart rate",
    "heart rate zones", "training zones", "exercise heart rate zones", "cardio zones",
    "fat burning zone", "fat loss zone", "weight loss zone", "fat reduction zone",
    "cardio zone", "cardiovascular zone", "heart health zone", "cardio training zone",
    "anaerobic zone", "high-intensity zone", "high-intensity training zone", "anaerobic training zone",
    "threshold zone", "lactate threshold zone", "intensity threshold zone", "exercise threshold zone",
    "zone training", "heart rate zone training", "training zones", "exercise zones",
    "endurance training", "stamina training", "long-distance training", "aerobic training",
    "base training", "foundational training", "basic training", "aerobic base training",
    "tempo training", "pace training", "speed endurance training", "threshold training",
    "interval training", "HIIT", "intense interval training", "interval workouts",
    "fartlek training", "speed play", "fartlek workouts", "speed endurance training",
    "polarized training", "intensity variation training", "polarized workouts", "intensity balance training",
    "cross-training", "multi-sport training", "variety training", "diverse exercise training",
    "active recovery", "active rest", "light exercise recovery", "gentle activity recovery",
    "rest days", "recovery days", "off days", "non-training days",
    "deload weeks", "recovery weeks", "light training weeks", "rest weeks",
    "tapering", "training reduction", "exercise tapering", "intensity tapering",
    "peaking", "performance peaking", "training peak", "exercise peaking",
    "periodization", "training periodization", "cycle training", "phased training",
    "linear periodization", "progressive training", "linear progression", "linear training plan",
    "block periodization", "training blocks", "block training", "phased blocks",
    "undulating periodization", "non-linear periodization", "wave periodization", "undulating training",
    "conjugate training", "conjugate method", "conjugate system", "conjugate periodization",
    "Westside method", "Westside training", "Westside system", "Westside barbell method",
    "Juggernaut method", "Juggernaut training", "Juggernaut system", "Juggernaut strength training",
    "5/3/1", "Wendler 5/3/1", "5/3/1 method", "5/3/1 training program",
    "Starting Strength", "Starting Strength program", "SS program", "Starting Strength method",
    "StrongLifts", "StrongLifts 5x5", "StrongLifts program", "StrongLifts method",
    "CrossFit programming", "WOD programming", "CrossFit workouts", "CrossFit routines",
    "WOD", "Workout of the Day", "daily workout", "CrossFit WOD",
    "MetCon", "metabolic conditioning", "CrossFit MetCon", "metabolic training",
    "EMOM", "every minute on the minute", "EMOM workouts", "minute interval training",
    "AMRAP", "as many reps as possible", "AMRAP workouts", "max reps training",
    "for time", "timed workouts", "time-based workouts", "time challenge workouts",
    "Tabata", "Tabata intervals", "high-intensity intervals", "Tabata training",
    "steady state cardio", "LISS", "low-intensity steady state", "steady cardio",
    "aerobic base", "aerobic foundation", "cardio base", "endurance base",
    "aerobic conditioning", "cardio conditioning", "endurance conditioning", "aerobic training",
    "aerobic capacity", "aerobic power", "cardio capacity", "endurance capacity",
    "lactate threshold", "anaerobic threshold", "LT", "lactate point",
    "ventilatory threshold", "VT", "breathing threshold", "ventilation threshold",
    "critical power", "CP", "power threshold", "power limit",
    "functional threshold power", "FTP", "threshold power", "functional power",
    "wattage", "power output", "watts", "energy output",
    "watts per kilogram", "W/kg", "power-to-weight ratio", "watts per kg",
    "power to weight ratio", "PWR", "power-weight ratio", "weight-to-power ratio",
    "vital capacity", "lung capacity", "respiratory capacity", "breathing capacity",
    "oxygen uptake", "O2 uptake", "oxygen consumption", "O2 consumption",
    "VO2 max", "maximum oxygen uptake", "VO2 peak", "aerobic capacity",
    "aerobic fitness", "cardio fitness", "endurance fitness", "aerobic conditioning",
    "anaerobic fitness", "high-intensity fitness", "short-duration fitness", "anaerobic conditioning",
    "speed endurance", "speed stamina", "running endurance", "speed conditioning",
    "speed training", "quickness training", "velocity training", "fast movement training",
    "sprint training", "sprinting workouts", "speed workouts", "sprint conditioning",
    "acceleration", "quick starts", "speed increases", "burst speed",
    "deceleration", "slowing down", "speed reduction", "deceleration training",
    "change of direction", "directional changes", "movement direction changes", "agility direction",
    "multi-directional movement", "multi-directional training", "varied direction training", "multi-directional agility",
    "lateral movement", "side-to-side movement", "sideways movement", "lateral motion",
    "agility training", "quickness training", "speed agility training", "agility workouts",
    "reaction time", "response time", "quick reaction", "reaction speed",
    "reaction training", "response training", "reaction time training", "quickness training",
    "cognitive training", "brain training", "mental training", "mind training",
    "decision making", "decision training", "choice training", "decision skills",
    "game sense", "sports sense", "athletic awareness", "game awareness",
    "tactical training", "strategy training", "tactical skills", "strategic training",
    "skill acquisition", "skill learning", "skill development", "skill gaining",
    "skill development", "skill building", "skill enhancement", "skill improvement",
    "skill maintenance", "skill upkeep", "skill retention", "skill preservation",
    "technical training", "technique training", "technical skill training", "technique improvement",
    "fundamentals", "basics", "core skills", "basic techniques",
    "advanced techniques", "complex techniques", "advanced skills", "complex skills",
    "complex movements", "advanced movements", "complicated movements", "complex exercises",
    "compound exercises", "multi-joint exercises", "compound movements", "multi-joint movements",
    "isolation exercises", "single-joint exercises", "isolation movements", "single-joint movements",
    "multi-joint exercises", "compound exercises", "multi-joint movements", "compound movements",
    "single-joint exercises", "isolation exercises", "single-joint movements", "isolation movements",
    "movement patterns", "exercise patterns", "motion patterns", "movement sequences",
    "squat pattern", "squat movement", "squat motion", "squat exercise",
    "hinge pattern", "hinge movement", "hinge motion", "hinge exercise",
    "push pattern", "push movement", "push motion", "push exercise",
    "pull pattern", "pull movement", "pull motion", "pull exercise",
    "carry pattern", "carry movement", "carry motion", "carry exercise",
    "rotation pattern", "rotation movement", "rotation motion", "rotation exercise",
    "anti-rotation pattern", "anti-rotation movement", "anti-rotation motion", "anti-rotation exercise",
    "core training", "abdominal training", "midsection training", "core exercises",
    "ab training", "abdominal exercises", "ab workouts", "abdominal workouts",
    "oblique training", "side ab training", "oblique exercises", "side ab exercises",
    "transverse abdominis", "transverse ab exercises", "deep core exercises", "transverse abdominal exercises",
    "rectus abdominis", "rectus ab exercises", "front ab exercises", "rectus abdominal exercises",
    "internal obliques", "inner oblique exercises", "internal side ab exercises", "internal side abdominal exercises",
    "external obliques", "outer oblique exercises", "external side ab exercises", "external side abdominal exercises",
    "lumbar stability", "lower back stability", "spinal stability", "lumbar support",
    "spinal stability", "spine stability", "back stability", "vertebral stability",
    "pelvic stability", "hip stability", "pelvis stability", "hip support",
    "scapular stability", "shoulder blade stability", "scapula stability", "shoulder support",
    "joint stability", "joint support", "joint steadiness", "joint firmness",
    "joint mobility", "joint flexibility", "joint movement", "joint range of motion",
    "dynamic stretching", "active stretching", "movement stretching", "dynamic flexibility",
    "static stretching", "held stretching", "static flexibility", "stationary stretching",
    "PNF stretching", "proprioceptive neuromuscular facilitation", "resistance stretching", "PNF flexibility",
    "active stretching", "movement stretching", "dynamic stretching", "active flexibility",
    "passive stretching", "relaxed stretching", "static stretching", "passive flexibility",
    "ballistic stretching", "bouncing stretching", "ballistic flexibility", "bouncing flexibility",
    "muscle lengthening", "muscle extension", "lengthening exercises", "muscle elongation",
    "muscle shortening", "muscle contraction", "shortening exercises", "muscle reduction",
    "muscle tension", "muscle tightness", "tension exercises", "muscle stress",
    "muscle relaxation", "muscle loosening", "relaxation exercises", "muscle ease",
    "muscle activation", "muscle engagement", "activation exercises", "muscle involvement",
    "muscle inhibition", "muscle suppression", "inhibition exercises", "muscle restraint",
    "muscle balance", "muscle equilibrium", "balance exercises", "muscle symmetry",
    "muscle imbalances", "muscle asymmetry", "imbalanced muscles", "uneven muscles",
    "movement dysfunctions", "movement disorders", "dysfunctional movements", "impaired movements",
    "movement assessments", "movement evaluations", "movement tests", "movement analysis",
    "movement screens", "movement checks", "movement assessments", "movement examinations",
    "FMS", "Functional Movement Screen", "movement screen", "functional screening",
    "Y balance test", "Y balance assessment", "balance test", "balance assessment",
    "single-leg balance", "one-leg balance", "single leg stability", "one-leg stability",
    "single-leg squat", "one-leg squat", "single leg exercise", "one-leg exercise",
    "overhead squat", "OHS", "overhead squat exercise", "overhead squat movement",
    "deep squat", "full squat", "low squat", "deep squatting",
    "inline lunge", "in-line lunge", "in-line lunge exercise", "in-line lunge movement",
    "hurdle step", "hurdle step exercise", "hurdle step movement", "hurdle step test",
    "rotational stability", "rotation stability", "turn stability", "rotational steadiness",
    "trunk stability", "core stability", "torso stability", "trunk steadiness",
    "core stability", "core steadiness", "midsection stability", "core balance",
    "core strength", "core power", "midsection strength", "core muscle strength",
    "core endurance", "core stamina", "midsection endurance", "core muscle endurance",
    "ab strength", "abdominal strength", "abdominal power", "ab muscle strength",
    "ab endurance", "abdominal endurance", "abdominal stamina", "ab muscle endurance",
    "plank variations", "plank types", "plank exercises", "plank workouts",
    "side plank"
];
const preprocess = (text) => text.toLowerCase().replace(/[-\s]/g, '');
const findKeywordMatch = (message, keywords) => {
    const preprocessedMessage = preprocess(message);
    for (const keyword of keywords) {
        if (preprocessedMessage.includes(preprocess(keyword))) {
            return keyword;
        }
    }
    return null;
};
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered OR Token malfunctioned" });
        }
        const chats = user.chats.map(({ role, content, videoId }) => ({
            role,
            content,
            videoId
        }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        const preprocessedMessage = message.toLowerCase();
        const containsFitnessKeyword = fitnessKeywords.some(keyword => preprocessedMessage.includes(keyword.toLowerCase()));
        if (!containsFitnessKeyword) {
            const warningMessage = {
                role: "assistant",
                content: "Hmmm, I am not trained to answer your question as it does not seem to be related to fitness or health.  If this is a mistake, I apologize. Try asking something else. Often times an input may include a speling or grammer mistakae, check your input and try again "
            };
            user.chats.push(warningMessage);
            await user.save();
            return res.status(200).json({ chats: user.chats });
        }
        const openai = configureOpenAI();
        const chatResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: chats,
        });
        user.chats.push(chatResponse.choices[0].message);
        const matchedKeyword = findKeywordMatch(preprocessedMessage, fitnessKeywords);
        if (matchedKeyword) {
            const videos = await searchYouTube(matchedKeyword);
            const videoMessages = videos.slice(0, 3).map((video, index) => {
                let content;
                switch (index) {
                    case 0:
                        content = `I found a video regarding your ${matchedKeyword} query.\nYou can click the download button to save the video.`;
                        break;
                    case 1:
                        content = `Here's a second video in case the first one didn't meet your needs.\nYou can click the download button to save the video.`;
                        break;
                    case 2:
                        content = `And here's another option for you to consider.\nYou can click the download button to save the video.`;
                        break;
                    default:
                        content = `I found another video for you.\nYou can click the download button to save the video.`;
                        break;
                }
                return {
                    role: "assistant",
                    content,
                    videoId: video.id.videoId
                };
            });
            user.chats.push(...videoMessages);
            console.log('videoMessages:', videoMessages);
        }
        else {
            const noVideoMessage = {
                role: "assistant",
                content: "I couldn't find any videos related to your query."
            };
            user.chats.push(noVideoMessage);
        }
        await user.save();
        console.log('Updated user chats:', user.chats);
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};
export const sendChatstoUser = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions Did not Match");
        }
        return res.status(201).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        console.error('Error retrieving chats:', error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered or Token Malfunction");
        }
        if (user._id.toString() !== res.locals.jwtData.id) {
            return res.status(401).send("Permissions Did not Match");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(201).json({ message: "OK" });
    }
    catch (error) {
        console.error('Error deleting chats:', error);
        return res.status(500).json({ message: "ERROR", cause: error.message });
    }
};
//# sourceMappingURL=chat-controllers.js.map