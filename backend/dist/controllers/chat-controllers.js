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
    "athletic performance", "personal best", "peak performance", "competitive sports", "team sports", "individual sports", "football", "soccer",
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
    "CFS", "myalgic encephalomyelitis", "ME", "autoimmune conditions", "immune system health", "immune support", "immune boosters", "immune modulation", "anti-inflammatory",
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
    "L-sit", "Muscle-up", "Inverted row", "Russian twist", "Side plank",
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
    "Metabolism", "Thermic effect of food", "Insulin sensitivity", "Glycemic index", "Dietary fiber"
];
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
        const preprocess = (text) => text.toLowerCase().replace(/[-\s]/g, '');
        const preprocessedMessage = preprocess(message);
        const containsFitnessKeyword = fitnessKeywords.some(keyword => preprocessedMessage.includes(preprocess(keyword)));
        if (!containsFitnessKeyword) {
            const warningMessage = {
                role: "assistant",
                content: "Hmmm, I am not trained to answer your question as it does not seem to be related to fitness or health. If this is a mistake, I apologize. Try asking something else."
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
        const matchedKeyword = fitnessKeywords.find(keyword => preprocessedMessage.includes(preprocess(keyword)));
        if (matchedKeyword) {
            const videos = await searchYouTube(matchedKeyword);
            if (videos.length > 0) {
                const videoId = videos[0].id.videoId;
                const youtubeMessage = {
                    role: "assistant",
                    content: `I found a video that explains how to do a ${matchedKeyword}. Check it out below:`,
                    videoId // Include the videoId in the message
                };
                user.chats.push(youtubeMessage);
                // Log youtubeMessage to verify it contains videoId
                console.log('youtubeMessage:', youtubeMessage);
            }
            else {
                const noVideoMessage = {
                    role: "assistant",
                    content: "I couldn't find any videos related to your query."
                };
                user.chats.push(noVideoMessage);
            }
        }
        await user.save();
        // Log the updated user chats to verify
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