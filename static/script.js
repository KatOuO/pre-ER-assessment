console.log("Script loaded!");

let ccMapping = {};
fetch("/static/cc_mapping.json")
  .then(res => res.json())
  .then(data => { ccMapping = data; })
  .catch(() => alert("⚠️ Failed to load cc_mapping.json"));

  const categories = 
  [
    {
      "name": "🚨 緊急症狀 Critical Emergencies",
      "id": "critical",
      "symptoms": [
        "呼吸困難 Dyspnea",
        "呼吸急促 Shortness of breath",
        "過敏反應 Allergic reaction",
        "中風 Stroke alert",
        "暈厥 Syncope",
        "首次癲癇發作 Seizure (new onset)",
        "心搏停止 Cardiac arrest",
        "胸痛 Chest pain",
        "胸口壓迫感 Chest tightness",
        "低血糖伴隨症狀 Decreased blood sugar - symptomatic",
        "高血糖伴隨症狀 Elevated blood sugar - symptomatic",
        "65歲以上跌倒 Fall > 65",
        "免疫力低下發燒 Fever (immunocompromised)",
        "多處創傷 Full trauma",
        "有自殺傾向 suicidal" ,
        "有殺人傾向 homicidal" ,
        "被襲受害者 Assault victim",
        "失去意識 Loss of consciousness",
        "無反應狀態 Unresponsive",
        "鐮刀型紅血球危機 Sickle cell crisis",
        "意外藥物過量 Overdose - accidental",
        "自殺性藥物過量 Overdose - intentional",
        "中毒 Poisoning"
      ]
    },
    {
      "name": "🩸 外傷 Trauma/Injury",
      "id": "trauma",
      "symptoms": [
        "大型創傷 Trauma",
        "車禍 Motor vehicle crash",
        "機車意外 Motorcycle crash",
        "修改版創傷 Modified trauma",
        "反覆跌倒 Multiple falls",
        "跌倒 Fall",
        "出血/瘀青 Bleeding/bruising",
        "暴露於體液 Body fluid exposure",
        "四肢撕裂傷 Extremity laceration",
        "臉部撕裂傷 Facial laceration",
        "眼部受傷 Eye injury"
      ]
    },

    {
        name: "🫁 呼吸系統問題 Respiratory Issues",
        id: "respiratory",
        symptoms: [
          "哮喘 Asthma",
          "呼吸困難 Breathing difficulty",
          "呼吸問題 Breathing problem",
          "咳嗽 Cough",
          "咳血 Haemoptysis",
          "呼吸窘迫 Respiratory distress",
          "喘鳴 Wheezing"
        ]
      }
      ,
    {
      name: "❤️ 心血管問題 Cardiovascular Issues",
      id: "cardio",
      symptoms: [
        "高血壓 Hypertension",
        "低血壓 Hypotension",
        "心悸／心跳加快 Palpitations",
        "心搏過速 Tachycardia",
        "心跳過快 Rapid heartrate",
        "心律不整 Irregular heartbeat"
      ]
    },
    {
      name: "🧠 神經系統問題 Neurological Issues",
      id: "neuro",
      symptoms: [
        "精神不穩定/突然亂左 Altered mental status",
        "混亂 Confusion",
        "頭暈 Dizziness",
        "頭痛 Headache",
        "癲癇 Seizures",
        "暈厥前(就快暈低) Near syncope",
        "神經問題 Neurologic problem",
        "癲癇病史 Seizure with prior history",
        "偏頭痛 Migraine",
        "新發現頭痛 Headache - new onset or new symptoms",
        "反覆頭痛 Headache - recurrent or known dx migraines",
        "頭痛複診 Headache re-evaluation"
      ]
    },
    {
        name: "🟡消化系統（食道與腸胃）Gastrointestinal (GI) Issue",
        id: "gi",
        symptoms: [
            "腹部絞痛 Abdominal cramping",
            "腹部脹氣 Abdominal distention",
            "腹痛 Abdominal pain",
            "便秘 Constipation",
            "腹瀉 Diarrhoea",
            "嘔吐 Emesis/vomiting",
            "上腹痛 Epigastric pain",
            "腸胃出血 GI bleeding",
            "腸胃問題 GI problem",
            "噁心(作嘔作悶) Nausea",
            "直腸出血 (大便出血)Rectal bleeding",
            "直腸疼痛 Rectal pain",
            "脫水 Dehydration",
            "誤食 Ingestion",
            "吞入異物 Swallowed foreign body"
        ]
      },
      {
        name: "🤕 頭部與頸部問題 Head & Neck",
        id: "head_neck",
        symptoms: [
            "面部腫脹 Facial swelling",
            "面部疼痛 Facial pain",
            "面部受傷 Facial injury",
            "頸部疼痛 Neck pain",
            "下顎疼痛 Jaw pain",
            "頭部受傷 Head injury",
            "頭部撕裂傷 Head laceration",
            "牙痛 Dental pain",
            "口腔腫脹 Oral swelling"
        ]
      },
   
      {
        name: "👂👃👁 耳鼻喉與眼部問題 ENT (Ear, Nose, Throat) and Eye",
        id: "ent_eye",
        symptoms: [
          "視力模糊 Blurred vision",
          "結膜炎 Conjunctivitis",
          "眼痛 Eye pain",
          "眼部問題 Eye problem",
          "流鼻血不止 Epistaxis",
          "眼紅 Eye redness",
          "耳痛 Otalgia",
          "耳部問題 Ear problem",
          "耳朵疼痛 Ear pain",
          "鼻塞 Nasal congestion",
          "眼內異物 Foreign body in eye",
          "鼻竇問題 Sinus problem"
        ]
      },
      {
        name: "💪 肌肉與骨骼問題 - 疼痛 Musculoskeletal Issues - Pain",
        id: "musculoskeletal_pain",
        symptoms: [
          "髖部疼痛 Hip pain",
          "腳痛 Foot pain",
          "腳趾痛 Toe pain",
          "腿痛 Leg pain",
          "膝蓋痛 Knee pain",
          "腳踝痛 Ankle pain",
          "肩膀痛 Shoulder pain",
          "手腕痛 Wrist pain",
          "手痛 Hand pain",
          "手臂痛 Arm pain",
          "背痛 Back pain",
          "手指痛 Finger pain",
          "手肘痛 Elbow pain",
          "肋骨痛 Rib pain"
        ]
      },
        {
          name: "💪 肌肉與骨骼問題 - 腫脹 Swelling",
          id: "orth_swelling",
          symptoms: [
            "腳部腫脹 Foot swelling",
            "腿部腫脹 Leg swelling",
            "手臂腫脹 Arm swelling",
            "關節腫脹 Joint swelling",
            "手指腫脹 Finger swelling"
          ]
        },
        {
          name: "💪 肌肉與骨骼問題 - 外傷 Injury",
          id: "orth_injury",
          symptoms: [
            "腳部受傷 Foot injury",
            "膝蓋受傷 Knee injury",
            "腿部受傷 Leg injury",
            "腳趾受傷 Toe injury",
            "肋骨受傷 Rib injury",
            "拇指受傷 Thumb injury",
            "手腕受傷 Wrist injury",
            "手指受傷 Finger injury",
            "手部受傷 Hand injury",
            "手臂受傷 Arm injury",
            "肩膀受傷 Shoulder injury",
            "腳踝受傷 Ankle injury"
          ]
        },
        {
          name: "💪 肌肉與骨骼問題 - 其他症狀 Conditions",
          id: "orth_condition",
          symptoms: [
            "四肢無力 Extremity weakness",
            "麻木 Numbness"
          ]
        },
        {
          name: "🔴 疼痛 Pain",
          id: "pain",
          symptoms: [
            "疼痛（未指定部位）General pain",
            "全身痠痛 Generalized body aches"
          ]
        },
        {
          name: "🧬 內分泌疾病 Endocrine Issues",
          id: "endocrine",
          symptoms: [
            "血糖過高（無症狀）Elevated blood sugar (asymptomatic)",
            "高血糖 Hyperglycaemia"
          ]
        },
        {
          name: "👩 婦科疾病 Gynaecological Issues",
          id: "gynae",
          symptoms: [
            "乳房疼痛 Breast pain",
            "陰道分泌物 Vaginal discharge",
            "陰道出血 Vaginal bleeding",
            "陰道疼痛 Vaginal pain",
            "女性泌尿生殖系統問題 Female GU problem",
            "懷孕腹痛 Abdominal pain (pregnant)"
          ]
        },
        {
          name: "🚻 泌尿與生殖系統問題 Genitourinary Issues",
          id: "gu",
          symptoms: [
            "骨盆疼痛 Pelvic pain",
            "腰側痛 Flank pain",
            "鼠蹊部(大腿内側)疼痛 Groin pain",
            "睾丸疼痛 Testicle pain",
            "男性泌尿生殖系統問題 Male GU problem",
            "血尿 Haematuria",
            "尿頻 Urinary frequency",
            "尿滞留 Urinary retention",
            "排尿困難 Dysuria"
          ]
        },
        {
          name: "🟢 皮膚問題 Dermatological Issues",
          id: "dermatology",
          symptoms: [
            "膿腫 Abscess",
            "燒傷 Burn",
            "蜂窩性組織炎 Cellulitis",
            "皮疹 Rash",
            "囊腫 Cyst",
            "腫塊 Mass",
            "皮膚問題 Skin problem",
            "皮膚受刺激,過敏 Skin irritation"
          ]
        },
        {
          name: "🦠 感染性疾病與動物/昆蟲咬傷",
          id: "infection",
          symptoms: [
            "流感 Influenza",
            "發燒 Fever",
            "感冒症狀 Cold like symptoms",
            "喉嚨痛 Sore throat",
            "昆蟲咬傷 Insect bite",
            "動物咬傷 Animal bite",
            "尿道感染 Urinary tract infection (UTI)",
            "上呼吸道感染 Upper respiratory tract infection",
            "除蝨 Tick removal",
            "暴露於性病 Exposure to STD",
            "發燒（75歲以上）Fever (≥75 y/o)",
            "發燒（9週–74歲）Fever (9w–74y)"
          ]
        },
        {
          name: "🟣 心理或行為問題 Psychiatric Issues",
          id: "mental",
          symptoms: [
            "上癮問題 Addiction problem",
            "酒精中毒 Alcohol intoxication",
            "酒精問題 Alcohol problem",
            "焦慮 Anxiety",
            "抑鬱 Depression",
            "幻覺 Hallucinations",
            "精神評估 Psychiatric evaluation",
            "激動 Agitation",
            "戒毒評估 Detox evaluation",
            "藥物／酒精評估 Drug/alcohol assessment",
            "藥物問題 Drug problem",
            "戒酒症狀 Withdrawal - alcohol",
            "驚恐發作 Panic attack",
            "精神病症狀 Psychotic symptoms"
          ]
        },
        {
          name: "⚕️ 醫療服務（如換藥、傷口護理）Medical Services",
          id: "medical_service",
          symptoms: [
            "術後問題 Post-op problem",
            "性病檢查 STD check",
            "健康問題 Medical problem",
            "健康檢查 Medical screening",
            "藥物問題 Medication problem",
            "補充藥物 Medication refill",
            "蜂窩性組織炎跟進 Follow-up cellulitis",
            "長者健康問題 Senior health concerns",
            "異常化驗結果 Abnormal lab results",
            "拆線／拆釘 Suture/staple removal",
            "傷口檢查 Wound check",
            "傷口感染 Wound infection",
            "傷口再評估 Wound re-evaluation",
            "撕裂傷 Laceration"
          ]
        },
        {
          name: "❓ 特殊情況與其他",
          id: "special",
          symptoms: [
            "虛弱 Weakness",
            "寒顫 Chills",
            "疲勞 Fatigue",
            "嗜睡 Lethargy",
            "水腫 Oedema",
            "其他 Others"
          ]
        }
      ]; 

const categoryGrid = document.getElementById("categoryGrid");
const symptomGrid = document.getElementById("symptomGrid");
const selectedSymptoms = document.getElementById("selectedSymptoms");
const searchInput = document.getElementById("searchInput");

let selected = [];
let lastCategoryClicked = null;

function renderCategories() {
  categoryGrid.innerHTML = "";
  symptomGrid.innerHTML = "";

  categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category-item";
    div.className = `category-item cat-${cat.id}`;
    div.innerHTML = `${cat.icon || ""} ${cat.name}`;

    div.onclick = () => {
      const existing = document.getElementById(`symptoms-${cat.id}`);
      if (existing) {
        existing.remove(); // toggle off
      } else {
        renderSymptoms(cat.symptoms, cat.id);
      }
    };

    categoryGrid.appendChild(div);
  });
}

document.getElementById("clearSubcategories").onclick = () => {
  document.getElementById("symptomGrid").innerHTML = "";
};
document.getElementById("clearSelected").onclick = () => {
  document.getElementById("submit-selected-container").innerHTML = "";
};


function renderSymptoms(symptoms, id) {
  const container = document.createElement("div");
  container.className = "sub-category-container";
  container.id = `symptoms-${id}`; // assign unique ID

  symptoms.forEach(symptom => {
    const div = document.createElement("div");
    div.className = "symptom-item";
    div.textContent = symptom;
    div.onclick = () => toggleSymptom(symptom);
    container.appendChild(div);
  });

  document.getElementById("symptomGrid").appendChild(container);
}



function toggleSymptom(symptom) {
  if (selected.includes(symptom)) {
    selected = selected.filter(s => s !== symptom);
  } else {
    selected.push(symptom);
  }
  updateSelected();
}

function updateSelected() {
  selectedSymptoms.innerHTML = "";
  selected.forEach(symptomZhEn => {
    const tag = document.createElement("span");
    tag.className = "selected-tag";
    const match = Object.values(ccMapping).find(m => symptomZhEn.includes(m.zh));
    tag.textContent = match ? `${match.zh} (${match.en})` : symptomZhEn;
    tag.ondblclick = () => toggleSymptom(symptomZhEn);
    selectedSymptoms.appendChild(tag);
  });
}

searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase().trim();
  if (!keyword) {
    symptomGrid.innerHTML = "";
    lastCategoryClicked = null;
    return;
  }

  const allSymptoms = categories.flatMap(c =>
    c.symptoms.map(s => ({ text: s, categoryId: c.id }))
  );

  const matched = allSymptoms.filter(s => s.text.toLowerCase().includes(keyword));
  symptomGrid.innerHTML = "";
  lastCategoryClicked = null;

  matched.forEach(({ text }) => {
    const div = document.createElement("div");
    div.className = "symptom-item";
    div.textContent = text;
    div.onclick = () => toggleSymptom(text);
    symptomGrid.appendChild(div);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderCategories();

  const submitSelectedBtn = document.getElementById("submitSelected");
  if (submitSelectedBtn) {
    submitSelectedBtn.addEventListener("click", () => {
      if (selected.length === 0) {
        alert("請先選擇至少一個症狀 Please Select At Least One Symptom");
        return;
      }
      submitSymptoms();
    });
  }
});
function syncAgeInputs(value) {
  document.getElementById("ageInput").value = value;
  document.getElementById("ageNumberInput").value = value;
}

async function submitSymptoms() {
  const extraInput = document.getElementById("userSymptomInput")?.value.trim();
  const ageInput = parseInt(document.getElementById("ageNumberInput")?.value.trim());

  const finalSymptoms = [...selected];
  if (extraInput) finalSymptoms.push(extraInput);

  const englishSymptoms = finalSymptoms.map(symptomZh => {
    for (const [ccKey, value] of Object.entries(ccMapping)) {
      if (symptomZh.includes(value.zh)) return ccKey;
    }
    return null;
  }).filter(Boolean);

  console.log("Submitting:", englishSymptoms, "Age:", ageInput);

  try {
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: englishSymptoms, age: ageInput })
    });

    const data = await response.json();  // 👈 if this fails, catch() runs
    console.log("✅ Received:", data);

    if (data && "prediction" in data) {
      showModal(`預測結果：${data.meaning} 信心值: ${data.confidence}`);
    } else {
      throw new Error("Missing prediction in response");
    }

  } catch (error) {
    console.error("❌ Prediction error:", error);
    alert("❌ 無法提交症狀，請稍後再試。");
  }
}


function showModal(resultText) {
  const modal = document.getElementById("resultModal");
  const text = document.getElementById("resultText");
  const closeBtn = document.getElementById("closeModal");

  text.textContent = resultText;
  modal.style.display = "block";

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
}

