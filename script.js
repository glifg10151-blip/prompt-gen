// --- Subject Builder Data ---
const builderSteps = [
  { // 0
    title: "Main Subject Type",
    fields: [
      {
        label: "What is the main subject?",
        name: "subjectType",
        type: "select",
        options: ["Girl", "Boy", "Animal", "Non-living Object"],
        required: true
      }
    ]
  },
  { // 1
    title: "Age",
    fields: [
      {
        label: "Age",
        name: "age",
        type: "number",
        min: 0,
        max: 120,
        placeholder: "e.g. 18",
        required: true
      }
    ]
  },
  { // 2
    title: "Skin Tone & Ethnicity",
    fields: [
      {
        label: "Skin Tone",
        name: "skinTone",
        type: "select",
        options: [
          "Pale", "Fair", "Light", "Medium", "Olive", "Tan", "Brown", "Dark Brown", "Ebony", "Alabaster", "Porcelain", "Golden", "Copper", "Other"
        ],
        required: false
      },
      {
        label: "Ethnicity",
        name: "ethnicity",
        type: "select",
        options: [
          "Caucasian",
          "African",
          "East Asian",
          "South Asian",
          "Latino",
          "Middle Eastern",
          "Native American",
          "Pacific Islander",
          "Mixed",
          "Hispanic",
          "Southeast Asian",
          "Central Asian",
          "North African",
          "Caribbean",
          "Aboriginal Australian",
          "Maori",
          "Inuit",
          "Jewish",
          "Romani",
          "Slavic",
          "Mediterranean",
          "Arab",
          "Persian",
          "Turkish",
          "Korean",
          "Filipino",
          "Thai",
          "Vietnamese",
          "Brazilian",
          "Polynesian",
          "Other"
        ],
        required: false
      }
    ]
  },
  { // 3
    title: "Outfit Builder",
    fields: [
      { type: "outfitBuilder" }
    ]
  },
  { // 4
    title: "Character Details",
    fields: [
      {
        label: "Eye Color",
        name: "eyeColor",
        type: "select",
        options: [
          "Blue", "Green", "Hazel", "Brown", "Amber", "Gray", "Violet", "Red", "Black", "Heterochromia", "Other"
        ],
        required: false
      },
      {
        label: "Breast Size",
        name: "breastSize",
        type: "select",
        options: [
          "Flat", "Small", "Medium", "Large", "Very Large", "Gigantic", "Other"
        ],
        required: false,
        showIf: (data) => data.subjectType === "Girl"
      },
      {
        label: "Hair Type",
        name: "hairType",
        type: "select",
        options: [
          "Straight", "Wavy", "Curly", "Coily", "Afro", "Braided", "Dreadlocks", "Mohawk", "Bald", "Other"
        ],
        required: false
      },
      {
        label: "Hair Color",
        name: "hairColor",
        type: "select",
        options: [
          "Black", "Brown", "Blonde", "Red", "White", "Gray", "Blue", "Pink", "Green", "Purple", "Silver", "Ombre", "Multicolored", "Other"
        ],
        required: false
      }
    ]
  }
];

// Outfit options for each part
const outfitOptions = {
  shirt: [
    "T-shirt", "Blouse", "Dress Shirt", "Crop Top", "Tank Top", "Sweater", "Hoodie", "Jacket", "Coat", "Vest", "Corset", "Kimono", "Poncho", "Tunic", "Other"
  ],
  bottom: [
    "Jeans", "Shorts", "Skirt", "Leggings", "Trousers", "Cargo Pants", "Sweatpants", "Mini Skirt", "Long Skirt", "Overalls", "Capris", "Other"
  ],
  shoes: [
    "Sneakers", "Boots", "Sandals", "Heels", "Flats", "Loafers", "Slippers", "Barefoot", "Dress Shoes", "Combat Boots", "Platform Shoes", "Other"
  ],
  undergarments: [
    "Briefs", "Boxers", "Panties", "Thong", "Bikini", "Sports Bra", "Bra", "Lingerie", "None", "Other"
  ],
  hat: [
    "Baseball Cap", "Beanie", "Fedora", "Beret", "Sun Hat", "Cowboy Hat", "Helmet", "Crown", "Headband", "Hood", "No Hat", "Other"
  ],
  accessories: [
    "Glasses", "Sunglasses", "Earrings", "Necklace", "Bracelet", "Watch", "Ring", "Scarf", "Tie", "Belt", "Bag", "Backpack", "Piercing", "Choker", "Gloves", "Mask", "Umbrella", "Other"
  ]
};

// --- State ---
let builderData = {};
let currentStep = 0;
let outfitState = {
  shirt: [],
  bottom: [],
  shoes: [],
  undergarments: [],
  hat: [],
  accessories: []
};

// --- Modal Logic ---
const modalBg = document.getElementById('modalBg');
const modal = document.getElementById('modal');
const openBuilderBtn = document.getElementById('openBuilderBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const subjectBuilderForm = document.getElementById('subjectBuilderForm');
const stepper = document.getElementById('stepper');
const prevStepBtn = document.getElementById('prevStepBtn');
const nextStepBtn = document.getElementById('nextStepBtn');

openBuilderBtn.onclick = () => {
  builderData = {};
  currentStep = 0;
  outfitState = { shirt: [], bottom: [], shoes: [], undergarments: [], hat: [], accessories: [] };
  showStep();
  modalBg.classList.add('active');
};
closeModalBtn.onclick = () => modalBg.classList.remove('active');
modalBg.onclick = (e) => { if (e.target === modalBg) modalBg.classList.remove('active'); };

prevStepBtn.onclick = () => {
  if (currentStep > 0) {
    currentStep--;
    showStep();
  }
};
nextStepBtn.onclick = () => {
  if (saveStep()) {
    if (currentStep < builderSteps.length - 1) {
      currentStep++;
      showStep();
    } else {
      // Done, close modal
      modalBg.classList.remove('active');
    }
  }
};

function showStep() {
  // Stepper
  stepper.innerHTML = '';
  for (let i = 0; i < builderSteps.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'step-dot' + (i === currentStep ? ' active' : '');
    stepper.appendChild(dot);
  }
  // Animate step transition
  subjectBuilderForm.style.opacity = 0;
  subjectBuilderForm.style.transform = "translateY(30px) scale(0.98)";
  setTimeout(() => {
    subjectBuilderForm.innerHTML = '';
    const step = builderSteps[currentStep];
    const h2 = document.createElement('h2');
    h2.textContent = step.title;
    subjectBuilderForm.appendChild(h2);

    step.fields.forEach(field => {
      if (field.type === "outfitBuilder") {
        subjectBuilderForm.appendChild(renderOutfitBuilder());
      } else if (!field.showIf || field.showIf(builderData)) {
        const group = document.createElement('div');
        group.className = 'form-group';
        const label = document.createElement('label');
        label.textContent = field.label;
        label.htmlFor = field.name;
        group.appendChild(label);

        if (field.type === "select") {
          const select = document.createElement('select');
          select.name = field.name;
          select.id = field.name;
          select.required = !!field.required;
          select.innerHTML = `<option value="">-- Select --</option>` +
            field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
          if (builderData[field.name]) select.value = builderData[field.name];
          group.appendChild(select);
        } else if (field.type === "number") {
          const input = document.createElement('input');
          input.type = "number";
          input.name = field.name;
          input.id = field.name;
          if (field.min !== undefined) input.min = field.min;
          if (field.max !== undefined) input.max = field.max;
          if (field.placeholder) input.placeholder = field.placeholder;
          input.required = !!field.required;
          if (builderData[field.name]) input.value = builderData[field.name];
          group.appendChild(input);
        } else if (field.type === "text") {
          const input = document.createElement('input');
          input.type = "text";
          input.name = field.name;
          input.id = field.name;
          if (field.placeholder) input.placeholder = field.placeholder;
          input.required = !!field.required;
          if (builderData[field.name]) input.value = builderData[field.name];
          group.appendChild(input);
        }
        subjectBuilderForm.appendChild(group);
      }
    });

    prevStepBtn.style.display = currentStep === 0 ? "none" : "inline-block";
    nextStepBtn.textContent = currentStep === builderSteps.length - 1 ? "Finish" : "Next";
    // Animate in
    setTimeout(() => {
      subjectBuilderForm.style.opacity = 1;
      subjectBuilderForm.style.transform = "translateY(0) scale(1)";
    }, 30);
  }, 180);
}

function saveStep() {
  const step = builderSteps[currentStep];
  let valid = true;
  step.fields.forEach(field => {
    if (field.type === "outfitBuilder") {
      // Save outfitState to builderData
      builderData.outfit = JSON.parse(JSON.stringify(outfitState));
    } else if (!field.showIf || field.showIf(builderData)) {
      const el = subjectBuilderForm.querySelector(`[name="${field.name}"]`);
      if (el) {
        if (field.required && !el.value) valid = false;
        builderData[field.name] = el.value;
      }
    }
  });
  if (!valid) {
    alert("Please fill in all required fields.");
    return false;
  }
  return true;
}

// --- Outfit Builder ---
function renderOutfitBuilder() {
  const section = document.createElement('div');
  section.className = 'outfit-section';
  section.innerHTML = `<h3 style="margin-top:0;color:#ffb347;">Outfit Builder</h3>`;
  for (const part of Object.keys(outfitOptions)) {
    const partDiv = document.createElement('div');
    partDiv.className = 'form-group';
    const label = document.createElement('label');
    label.textContent = part.charAt(0).toUpperCase() + part.slice(1);
    partDiv.appendChild(label);

    // Option list
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'option-list';
    outfitOptions[part].forEach(opt => {
      const optLabel = document.createElement('label');
      const optInput = document.createElement('input');
      optInput.type = "checkbox";
      optInput.value = opt;
      optInput.checked = outfitState[part].includes(opt);
      optInput.onchange = () => {
        if (optInput.checked) {
          outfitState[part].push(opt);
        } else {
          outfitState[part] = outfitState[part].filter(x => x !== opt);
        }
        // If "Other" checked, show custom input
        if (opt === "Other" && optInput.checked) {
          showCustomInput(part, optionsDiv);
        } else if (opt === "Other" && !optInput.checked) {
          removeCustomInput(part, optionsDiv);
        }
      };
      optLabel.appendChild(optInput);
      optLabel.appendChild(document.createTextNode(opt));
      optionsDiv.appendChild(optLabel);
    });
    // Add custom input if "Other" is checked
    if (outfitState[part].includes("Other")) {
      showCustomInput(part, optionsDiv);
    }
    partDiv.appendChild(optionsDiv);
    section.appendChild(partDiv);
  }
  return section;
}

function showCustomInput(part, optionsDiv) {
  if (optionsDiv.querySelector(`.custom-${part}`)) return;
  const customDiv = document.createElement('div');
  customDiv.className = `custom-${part}`;
  customDiv.style.marginTop = "4px";
  const input = document.createElement('input');
  input.type = "text";
  input.placeholder = `Custom ${part} (comma separated)`;
  input.value = (outfitState[part].filter(x => x.startsWith("custom:")).map(x => x.replace("custom:", "")) || []).join(", ");
  input.oninput = () => {
    // Remove old custom values
    outfitState[part] = outfitState[part].filter(x => !x.startsWith("custom:") && x !== "Other");
    // Add new custom values
    input.value.split(",").map(s => s.trim()).filter(Boolean).forEach(val => {
      outfitState[part].push("custom:" + val);
    });
    // Always keep "Other" checked if custom input is present
    if (!outfitState[part].includes("Other")) outfitState[part].push("Other");
  };
  customDiv.appendChild(input);
  optionsDiv.appendChild(customDiv);
}
function removeCustomInput(part, optionsDiv) {
  const customDiv = optionsDiv.querySelector(`.custom-${part}`);
  if (customDiv) customDiv.remove();
  // Remove custom values
  outfitState[part] = outfitState[part].filter(x => !x.startsWith("custom:"));
}

// --- Prompt Generation ---
const promptOutput = document.getElementById('promptOutput');
const generatePromptBtn = document.getElementById('generatePromptBtn');
const promptOptionsForm = document.getElementById('promptOptionsForm');
const jsonToggle = document.getElementById('jsonToggle');
const downloadJsonBtn = document.getElementById('downloadJsonBtn');

let lastPromptText = "";
let lastPromptJson = {};

// --- Background select: show/hide custom input ---
const backgroundSelect = document.getElementById('background');
const backgroundCustom = document.getElementById('backgroundCustom');
if (backgroundSelect && backgroundCustom) {
  backgroundSelect.onchange = function() {
    if (backgroundSelect.value === "Other") {
      backgroundCustom.style.display = "";
    } else {
      backgroundCustom.style.display = "none";
    }
  };
}

function getPromptJson() {
  // Gather all data into a JSON object in logical order for image generation
  let json = {};

  // 1. Main subject
  json.subject = {
    type: builderData.subjectType || "",
    age: builderData.age || "",
    ethnicity: builderData.ethnicity || "",
    skinTone: builderData.skinTone || ""
  };

  // 2. Character details
  json.character = {
    hair: {
      type: builderData.hairType || "",
      color: builderData.hairColor || ""
    },
    eyes: builderData.eyeColor || "",
    breastSize: (builderData.subjectType === "Girl" ? (builderData.breastSize || "") : "")
  };

  // 3. Action
  json.action = (promptOptionsForm.action && promptOptionsForm.action.value) || "";

  // 4. Outfit (ordered)
  const outfitOrder = ["undergarments", "shirt", "bottom", "shoes", "hat", "accessories"];
  json.outfit = {};
  if (builderData.outfit) {
    for (const part of outfitOrder) {
      if (builderData.outfit[part]) {
        let items = builderData.outfit[part].map(x => x.startsWith("custom:") ? x.replace("custom:", "") : x)
          .filter(x => x && x !== "Other" && x !== "No Hat" && x !== "None");
        if (items.length) {
          json.outfit[part] = items;
        }
      }
    }
  }

  // 5. Style
  json.style = promptOptionsForm.style.value || "";

  // 6. Background
  json.background = (promptOptionsForm.background.value === "Other" ? promptOptionsForm.backgroundCustom.value : promptOptionsForm.background.value) || "";

  // 7. Camera, lighting, mood
  json.camera = {
    angle: promptOptionsForm.cameraAngle.value || "",
    lighting: promptOptionsForm.lighting.value || "",
    mood: promptOptionsForm.mood.value || ""
  };

  // 8. Artist/influence
  json.artist = promptOptionsForm.artist.value || "";

  // 9. Artistic options
  json.art = {
    medium: promptOptionsForm.artMedium.value || "",
    colorPalette: promptOptionsForm.colorPalette.value || "",
    brushStyle: promptOptionsForm.brushStyle.value || "",
    texture: promptOptionsForm.texture.value || ""
  };

  // 10. Extra
  json.extra = promptOptionsForm.extra.value || "";

  return json;
}

function getPromptText() {
  let prompt = [];

  // 1. Main subject (type, gender, age, ethnicity, skin tone)
  let subjectParts = [];
  if (builderData.subjectType) subjectParts.push(builderData.subjectType);
  if (builderData.age) subjectParts.unshift(builderData.age + " year old");
  if (builderData.ethnicity) subjectParts.push(builderData.ethnicity);
  if (builderData.skinTone) subjectParts.push(builderData.skinTone + " skin");
  let subject = subjectParts.filter(Boolean).join(" ");
  if (subject) prompt.push(subject);

  // 2. Hair (type, color)
  let hair = [];
  if (builderData.hairType) hair.push(builderData.hairType);
  if (builderData.hairColor) hair.push(builderData.hairColor);
  if (hair.length) prompt.push(hair.join(" ") + " hair");

  // 3. Eyes
  if (builderData.eyeColor) prompt.push(builderData.eyeColor + " eyes");

  // 4. Breast size (if girl)
  if (builderData.breastSize && builderData.subjectType === "Girl") prompt.push(builderData.breastSize + " breasts");

  // 5. Outfit (in logical order: undergarments, shirt, bottom, shoes, hat, accessories)
  if (builderData.outfit) {
    const outfitOrder = ["undergarments", "shirt", "bottom", "shoes", "hat", "accessories"];
    for (const part of outfitOrder) {
      if (builderData.outfit[part]) {
        let items = builderData.outfit[part].map(x => x.startsWith("custom:") ? x.replace("custom:", "") : x)
          .filter(x => x && x !== "Other" && x !== "No Hat" && x !== "None");
        if (items.length) {
          let label = part === "bottom" ? "bottom wear" : part;
          prompt.push(items.join(", ") + " " + label);
        }
      }
    }
  }

  // 6. Style
  const style = promptOptionsForm.style.value;
  if (style && style !== "Other") prompt.push(style + " style");

  // 7. Background
  let background = "";
  if (promptOptionsForm.background.value === "Other") {
    background = promptOptionsForm.backgroundCustom.value;
  } else {
    background = promptOptionsForm.background.value;
  }
  if (background) prompt.push("background: " + background);

  // 8. Camera, lighting, mood
  const cameraAngle = promptOptionsForm.cameraAngle.value;
  if (cameraAngle && cameraAngle !== "Other") prompt.push("camera angle: " + cameraAngle);
  const lighting = promptOptionsForm.lighting.value;
  if (lighting && lighting !== "Other") prompt.push("lighting: " + lighting);
  const mood = promptOptionsForm.mood.value;
  if (mood && mood !== "Other") prompt.push("mood: " + mood);

  // 9. Artist/influence
  const artist = promptOptionsForm.artist.value;
  if (artist) prompt.push("inspired by " + artist);

  // 10. Artistic options
  const artMedium = promptOptionsForm.artMedium.value;
  if (artMedium && artMedium !== "Other") prompt.push("medium: " + artMedium);
  const colorPalette = promptOptionsForm.colorPalette.value;
  if (colorPalette && colorPalette !== "Other") prompt.push("color palette: " + colorPalette);
  const brushStyle = promptOptionsForm.brushStyle.value;
  if (brushStyle && brushStyle !== "Other") prompt.push("brush style: " + brushStyle);
  const texture = promptOptionsForm.texture.value;
  if (texture && texture !== "Other") prompt.push("texture: " + texture);

  // 11. Extra
  const extra = promptOptionsForm.extra.value;
  if (extra) prompt.push(extra);

  return prompt.filter(Boolean).join(", ");
}

function updatePromptOutput() {
  lastPromptText = getPromptText();
  lastPromptJson = getPromptJson();
  if (jsonToggle && jsonToggle.checked) {
    promptOutput.textContent = JSON.stringify(lastPromptJson, null, 2);
  } else {
    promptOutput.textContent = lastPromptText;
  }
}

generatePromptBtn.onclick = () => {
  updatePromptOutput();
};

if (jsonToggle) {
  jsonToggle.addEventListener('change', updatePromptOutput);
}

if (downloadJsonBtn) {
  downloadJsonBtn.addEventListener('click', () => {
    lastPromptJson = getPromptJson();
    const blob = new Blob([JSON.stringify(lastPromptJson, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "prompt.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  });
}

// --- Random Button for Subject Builder ---
const randomBuilderBtn = document.getElementById('randomBuilderBtn');
if (randomBuilderBtn) {
  randomBuilderBtn.onclick = () => {
    // If modal is not open, open it
    if (!modalBg.classList.contains('active')) {
      builderData = {};
      outfitState = { shirt: [], bottom: [], shoes: [], undergarments: [], hat: [], accessories: [] };
      modalBg.classList.add('active');
    }
    // For each section, pick one random option
    const subjectTypes = ["Girl", "Boy", "Animal", "Non-living Object"];
    builderData.subjectType = subjectTypes[Math.floor(Math.random() * subjectTypes.length)];
    builderData.age = Math.floor(Math.random() * 80) + 5;
    const skinTones = [
      "Pale", "Fair", "Light", "Medium", "Olive", "Tan", "Brown", "Dark Brown", "Ebony", "Alabaster", "Porcelain", "Golden", "Copper", "Other"
    ];
    const ethnicities = [
      "Caucasian", "African", "East Asian", "South Asian", "Latino", "Middle Eastern", "Native American", "Pacific Islander", "Mixed", "Other"
    ];
    builderData.skinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    builderData.ethnicity = ethnicities[Math.floor(Math.random() * ethnicities.length)];
    for (const part of Object.keys(outfitOptions)) {
      const opts = outfitOptions[part];
      let opt = opts[Math.floor(Math.random() * opts.length)];
      let chosen = [opt];
      if (opt === "Other") {
        chosen.push("custom:Random " + part);
      }
      outfitState[part] = chosen;
    }
    builderData.outfit = JSON.parse(JSON.stringify(outfitState));
    const eyeColors = [
      "Blue", "Green", "Hazel", "Brown", "Amber", "Gray", "Violet", "Red", "Black", "Heterochromia", "Other"
    ];
    builderData.eyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)];
    if (builderData.subjectType === "Girl") {
      const breastSizes = [
        "Flat", "Small", "Medium", "Large", "Very Large", "Gigantic", "Other"
      ];
      builderData.breastSize = breastSizes[Math.floor(Math.random() * breastSizes.length)];
    } else {
      builderData.breastSize = "";
    }
    const hairTypes = [
      "Straight", "Wavy", "Curly", "Coily", "Afro", "Braided", "Dreadlocks", "Mohawk", "Bald", "Other"
    ];
    builderData.hairType = hairTypes[Math.floor(Math.random() * hairTypes.length)];
    const hairColors = [
      "Black", "Brown", "Blonde", "Red", "White", "Gray", "Blue", "Pink", "Green", "Purple", "Silver", "Ombre", "Multicolored", "Other"
    ];
    builderData.hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
    // Jump to last step
    currentStep = builderSteps.length - 1;
    showStep();
  };
}

/* --- Button Ripple Animation --- */
function addRippleEffect(e) {
  const button = e.currentTarget;
  let ripple = button.querySelector('.ripple');
  if (ripple) {
    ripple.remove();
  }
  ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.pointerEvents = 'none';
  ripple.style.background = 'rgba(255,255,255,0.25)';
  ripple.style.transform = 'scale(0)';
  ripple.style.zIndex = 2;
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.2;
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
  ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
  button.appendChild(ripple);
  setTimeout(() => {
    ripple.style.transition = 'transform 0.5s cubic-bezier(.23,1.02,.32,1), opacity 0.5s';
    ripple.style.transform = 'scale(1.2)';
    ripple.style.opacity = '0';
  }, 10);
  setTimeout(() => {
    if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
  }, 600);
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', addRippleEffect);
  });
});

/* --- Shine Animation for Container and Modal --- */
function addShineEffect(targetSelector) {
  const targets = document.querySelectorAll(targetSelector);
  targets.forEach(target => {
    let shine = document.createElement('div');
    shine.className = 'shine-anim';
    shine.style.position = 'absolute';
    shine.style.top = 0;
    shine.style.left = 0;
    shine.style.width = '100%';
    shine.style.height = '100%';
    shine.style.pointerEvents = 'none';
    shine.style.background = 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 40%, rgba(255,255,255,0.08) 100%)';
    shine.style.opacity = '0.7';
    shine.style.borderRadius = getComputedStyle(target).borderRadius;
    shine.style.transform = 'translateX(-120%) skewX(-18deg)';
    shine.style.transition = 'none';
    target.style.position = 'relative';
    target.appendChild(shine);

    function animateShine() {
      shine.style.transition = 'none';
      shine.style.transform = 'translateX(-120%) skewX(-18deg)';
      setTimeout(() => {
        shine.style.transition = 'transform 1.6s cubic-bezier(.23,1.02,.32,1)';
        shine.style.transform = 'translateX(120%) skewX(-18deg)';
      }, 80);
    }
    // Less frequent for .container, more frequent for .modal
    if (target.classList.contains('container')) {
      function scheduleShine() {
        animateShine();
        setTimeout(scheduleShine, 12000 + Math.random() * 6000); // 12-18s
      }
      scheduleShine();
    } else {
      setInterval(animateShine, 3500 + Math.random()*1000);
      animateShine();
    }
  });
}
document.addEventListener('DOMContentLoaded', () => {
  addShineEffect('.container');
  addShineEffect('.modal');
});

// --- Save builder data on modal close ---
window.addEventListener('beforeunload', () => {
  localStorage.setItem('builderData', JSON.stringify(builderData));
  localStorage.setItem('outfitState', JSON.stringify(outfitState));
});
window.addEventListener('DOMContentLoaded', () => {
  try {
    builderData = JSON.parse(localStorage.getItem('builderData')) || {};
    outfitState = JSON.parse(localStorage.getItem('outfitState')) || outfitState;
  } catch {}
});
