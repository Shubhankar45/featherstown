import sun from "../assets/Sun-conure.jfif";
import grey from "../assets/african.png";
import macaw from "../assets/macaw.png";
import green from "../assets/green.jpg";
import pineapple from "../assets/pineapple.jpeg";
import cocketail from "../assets/cocketail.jpg";
import pine from "../assets/pineapple.png";

export const parrots = [
  {
    id: 1,
    name: "Sun Conure",
    category: "Conure",
    image: sun,
    price: "₹15,000 - ₹25,000",
    status: "available",

    description: "Bright and playful parrot.",
    lifespan: "20-30 years",
    origin: "South America",
    size: "Medium",
    diet: "Fruits, seeds, pellets",
    behavior: "Very social, loud, energetic",
    talkingAbility: "Low",
    difficulty: "Medium",
    noiseLevel: "High",

    training: {
      basic: [
        "Step Up",
        "Recall",
        "Human friendly bonding",
        "Indoor free flying"
      ],
      advanced: [
        "Outdoor free flying",
        "Harness training",
        "Spin trick",
        "Wave trick"
      ]
    },

    care: [
      "Provide large cage",
      "Daily interaction required",
      "Balanced diet essential",
      "Keep toys for stimulation",
      "Avoid isolation"
    ]
  },

  {
    id: 2,
    name: "Green Cheek Conure",
    category: "Conure",
    image: green,
    price: "₹4,000 - ₹8,000",
    status: "available",

    description: "Friendly and playful bird.",
    lifespan: "25 years",
    origin: "South America",
    size: "Small",
    diet: "Seeds, fruits",
    behavior: "Gentle and social",
    talkingAbility: "Low",
    difficulty: "Easy",
    noiseLevel: "Medium",

    training: {
      basic: [
        "Step Up",
        "Recall",
        "Human friendly bonding",
        "Indoor free flying"
      ],
      advanced: [
        "Outdoor free flying",
        "Harness training",
        "Spin trick",
        "Wave trick"
      ]
    },

    care: [
      "Small cage ok",
      "Daily attention",
      "Balanced diet",
      "Provide toys",
      "Clean cage regularly"
    ]
  },

  {
    id: 3,
    name: "Cinnamon Conure",
    category: "Conure",
    image: pineapple,
    price: "₹5,000 - ₹12,000",
    status: "available",

    description: "Affectionate and intelligent parrot.",
    lifespan: "20-25 years",
    origin: "Brazil",
    size: "Small",
    diet: "Pellets, fruits, vegetables",
    behavior: "Playful and social",
    talkingAbility: "Low",
    difficulty: "Easy",
    noiseLevel: "Medium",

    training: {
      basic: [
        "Step Up",
        "Recall",
        "Human friendly bonding",
        "Indoor free flying"
      ],
      advanced: [
        "Outdoor free flying",
        "Harness training",
        "Spin trick",
        "Wave trick"
      ]
    },

    care: [
      "Spacious cage",
      "Daily playtime",
      "Balanced diet",
      "Mental stimulation",
      "Clean environment"
    ]
  },

  {
    id: 4,
    name: "Cockatiel",
    category: "Cockatiel",
    image: cocketail,
    price: "₹2,000 - ₹6,000",
    status: "available",

    description: "Gentle and affectionate bird.",
    lifespan: "15-20 years",
    origin: "Australia",
    size: "Small",
    diet: "Seeds, pellets, fruits",
    behavior: "Calm and friendly",
    talkingAbility: "Medium",
    difficulty: "Easy",
    noiseLevel: "Low",

    training: {
      basic: [
        "Step Up",
        "Recall",
        "Human friendly bonding",
        "Indoor free flying"
      ],
      advanced: [
        "Outdoor free flying",
        "Harness training",
        "Spin trick",
        "Wave trick"
      ]
    },

    care: [
      "Medium cage",
      "Daily interaction",
      "Healthy diet",
      "Proper sleep",
      "Clean cage"
    ]
  },

  {
    id: 5,
    name: "African Grey",
    category: "African Grey",
    image: grey,
    price: "₹40,000 - ₹70,000",
    status: "available",

    description: "Highly intelligent talking parrot.",
    lifespan: "40-60 years",
    origin: "Africa",
    size: "Medium",
    diet: "Pellets, fruits, nuts",
    behavior: "Smart and calm",
    talkingAbility: "High",
    difficulty: "Hard",
    noiseLevel: "Medium",

    training: {
      basic: [
        "Step Up",
        "Recall",
        "Human friendly bonding",
        "Indoor free flying"
      ],
      advanced: [
        "Outdoor free flying",
        "Harness training",
        "Spin trick",
        "Wave trick"
      ]
    },

    care: [
      "Large cage",
      "Mental stimulation",
      "Balanced diet",
      "Social interaction",
      "Routine care"
    ]
  },
  {
  id: 6,
  name: "Pineapple Conure",
  category: "Conure",
  image: pine,
  price: "₹4,000 - ₹10,000",
  status: "available",

  description: "A colorful, affectionate, and intelligent parrot known for its playful personality and strong bonding with owners.",
  lifespan: "15 - 25 years",
  origin: "South America",
  size: "Small (10 inches approx)",
  diet: "Pellets, fresh fruits, vegetables, limited seeds",
  behavior: "Highly social, active, and attention-seeking",
  talkingAbility: "Low (can mimic a few words)",
  difficulty: "Moderate",
  noiseLevel: "Medium to High",

  training: {
    basic: [
      "Step-up command",
      "Recall training (come when called)",
      "Bonding and handling",
      "Cage-to-playstand transition"
    ],
    advanced: [
      "Harness training (for outdoor safety)",
      "Target training",
      "Spin and wave tricks",
      "Free-flight training"
    ]
  },

  care: [
    "Medium cage required (not small)",
    "Minimum 2–3 hours daily interaction",
    "Balanced diet with pellets (70%) + fresh foods",
    "Provide chewing toys and mental stimulation",
    "Regular cage cleaning and hygiene",
    "Avoid drafts and extreme temperatures",
    "Routine vet checkups recommended"
  ]
}
];
