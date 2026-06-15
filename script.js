const moneyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat("zh-TW", {
  style: "percent",
  maximumFractionDigits: 1
});

function numberValue(form, name, fallback = 0) {
  const input = form.querySelector(`[name="${name}"]`);
  if (!input) return fallback;
  const value = Number(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function calculateProfit(form) {
  const price = numberValue(form, "price");
  const productCost = numberValue(form, "productCost");
  const packaging = numberValue(form, "packaging");
  const shippingSubsidy = numberValue(form, "shippingSubsidy");
  const platformFeeRate = numberValue(form, "platformFee") / 100;
  const paymentFeeRate = numberValue(form, "paymentFee") / 100;
  const adCost = numberValue(form, "adCost");

  const fee = price * (platformFeeRate + paymentFeeRate);
  const totalCost = productCost + packaging + shippingSubsidy + fee + adCost;
  const profit = price - totalCost;
  const margin = price > 0 ? profit / price : 0;
  const breakEvenPrice = productCost + packaging + shippingSubsidy + adCost;
  const feeRate = platformFeeRate + paymentFeeRate;
  const minimumPrice = feeRate < 1 ? breakEvenPrice / (1 - feeRate) : 0;

  setText("profitResult", moneyFormatter.format(profit));
  setText("marginResult", percentFormatter.format(margin));
  setText("costResult", moneyFormatter.format(totalCost));
  setText("breakEvenResult", moneyFormatter.format(minimumPrice));
}

function calculateShipping(form) {
  const avgOrder = numberValue(form, "avgOrder");
  const marginRate = numberValue(form, "marginRate") / 100;
  const shippingCost = numberValue(form, "shippingCost");
  const targetProfit = numberValue(form, "targetProfit");

  const currentProfit = avgOrder * marginRate - shippingCost;
  const neededRevenue = marginRate > 0 ? (shippingCost + targetProfit) / marginRate : 0;
  const suggestedThreshold = Math.ceil(neededRevenue / 10) * 10;

  setText("currentShippingProfit", moneyFormatter.format(currentProfit));
  setText("shippingThreshold", moneyFormatter.format(suggestedThreshold));
  setText("shippingGap", moneyFormatter.format(Math.max(0, suggestedThreshold - avgOrder)));
}

function calculateRate(form) {
  const targetIncome = numberValue(form, "targetIncome");
  const workDays = numberValue(form, "workDays");
  const billableRatio = numberValue(form, "billableRatio") / 100;
  const hoursPerDay = numberValue(form, "hoursPerDay");
  const overhead = numberValue(form, "overhead");
  const buffer = numberValue(form, "buffer") / 100;

  const requiredRevenue = (targetIncome + overhead) * (1 + buffer);
  const billableHours = workDays * hoursPerDay * billableRatio;
  const hourlyRate = billableHours > 0 ? requiredRevenue / billableHours : 0;
  const dayRate = hourlyRate * hoursPerDay;
  const tenHourProject = hourlyRate * 10;

  setText("hourlyRate", moneyFormatter.format(hourlyRate));
  setText("dayRate", moneyFormatter.format(dayRate));
  setText("projectRate", moneyFormatter.format(tenHourProject));
}

function bindCalculator(selector, calculate) {
  const form = document.querySelector(selector);
  if (!form) return;
  const run = () => calculate(form);
  form.addEventListener("input", run);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    run();
  });
  run();
}

bindCalculator("[data-profit-calculator]", calculateProfit);
bindCalculator("[data-shipping-calculator]", calculateShipping);
bindCalculator("[data-rate-calculator]", calculateRate);

const tarotDeck = [
  {
    roman: "0",
    name: "愚者",
    daily: "今天適合用新的眼光看事情，先允許自己試一小步。",
    caution: "不要只靠衝動做決定，先確認基本風險。",
    love: "關係需要自然一點，別急著把所有答案定死。",
    score: 1
  },
  {
    roman: "I",
    name: "魔術師",
    daily: "你手上已有一些資源，重點是把想法落成具體行動。",
    caution: "別只停在說法漂亮，今天要看是否真的做得到。",
    love: "主動溝通會有幫助，但不要把話術當成真誠。",
    score: 1
  },
  {
    roman: "II",
    name: "女祭司",
    daily: "先安靜觀察，答案可能藏在你沒有說出口的感受裡。",
    caution: "不要因為不確定就過度猜測，補足資訊再判斷。",
    love: "有些情緒還沒浮上檯面，先給彼此一點空間。",
    score: 0
  },
  {
    roman: "III",
    name: "皇后",
    daily: "適合照顧身體、整理環境，也適合把想法做得更有質感。",
    caution: "小心只顧舒服而拖延真正該處理的事。",
    love: "溫柔、穩定和照顧感會比逼問更有效。",
    score: 1
  },
  {
    roman: "IV",
    name: "皇帝",
    daily: "今天需要規則和邊界，把順序排清楚會少很多消耗。",
    caution: "不要把控制感誤認成安全感，留一點彈性。",
    love: "關係裡需要清楚承諾，但也要避免單方面下指令。",
    score: 1
  },
  {
    roman: "V",
    name: "教皇",
    daily: "回到基本原則，找可信賴的經驗和方法。",
    caution: "別被單一標準綁死，傳統做法也需要符合當下情境。",
    love: "共同價值觀比短暫情緒更重要，可以談談彼此期待。",
    score: 0
  },
  {
    roman: "VI",
    name: "戀人",
    daily: "今天會碰到選擇，關鍵是你真正重視什麼。",
    caution: "不要只為了討好別人而選，後面會付出代價。",
    love: "適合誠實確認彼此需求，別用猜的代替溝通。",
    score: 1
  },
  {
    roman: "VII",
    name: "戰車",
    daily: "把注意力放在目標上，今天適合推進卡住的事。",
    caution: "速度太快容易忽略細節，先確認方向再衝。",
    love: "主動靠近有幫助，但不要把互動變成輸贏。",
    score: 1
  },
  {
    roman: "VIII",
    name: "力量",
    daily: "用穩定和耐心處理問題，比硬碰硬更容易過關。",
    caution: "別壓抑太久，溫和不是什麼都吞下去。",
    love: "給對方安全感，也給自己說真話的空間。",
    score: 1
  },
  {
    roman: "IX",
    name: "隱者",
    daily: "今天適合慢下來，釐清自己真正需要什麼。",
    caution: "不要把退一步變成逃避，該回應的事仍要回應。",
    love: "關係可能需要冷靜，不代表完全沒有可能。",
    score: 0
  },
  {
    roman: "X",
    name: "命運之輪",
    daily: "變化正在發生，先接受局勢流動，再找你能掌握的點。",
    caution: "不要把所有結果都交給運氣，仍要保留行動方案。",
    love: "關係進入轉折期，先觀察新的互動模式。",
    score: 1
  },
  {
    roman: "XI",
    name: "正義",
    daily: "今天適合看清事實、合約、責任和公平性。",
    caution: "別只看自己有理，也要看對方承受了什麼。",
    love: "把界線和期待說清楚，會比冷處理更好。",
    score: 0
  },
  {
    roman: "XII",
    name: "吊人",
    daily: "暫停不是失敗，換角度後會看到新的解法。",
    caution: "不要用等待包裝拖延，先分清楚什麼能做。",
    love: "短期可能不適合逼答案，先看彼此願不願意調整。",
    score: -1
  },
  {
    roman: "XIII",
    name: "死神",
    daily: "某個舊模式正在結束，清掉不合適的東西才有新空間。",
    caution: "不要因為害怕改變而抓住已經失效的做法。",
    love: "關係需要誠實面對變化，逃避只會拖長不舒服。",
    score: -1
  },
  {
    roman: "XIV",
    name: "節制",
    daily: "今天適合調整比例，慢慢混合不同資源。",
    caution: "別急著一次到位，太用力反而失衡。",
    love: "溝通需要降溫，先找雙方都能接受的節奏。",
    score: 1
  },
  {
    roman: "XV",
    name: "惡魔",
    daily: "注意慣性、依賴和短期誘惑，它們可能讓你失去主導權。",
    caution: "不要把想要誤認成必須，先停一下。",
    love: "吸引力很強，但需要看清是否有不健康的拉扯。",
    score: -1
  },
  {
    roman: "XVI",
    name: "高塔",
    daily: "突發狀況可能打破原本安排，先處理最重要的安全與事實。",
    caution: "不要硬撐已經不穩的結構，修正比掩飾重要。",
    love: "可能有話題需要攤開，先保持冷靜再談。",
    score: -1
  },
  {
    roman: "XVII",
    name: "星星",
    daily: "今天適合恢復信心，讓自己回到比較清澈的狀態。",
    caution: "希望很重要，但仍要搭配實際步驟。",
    love: "善意和信任可以慢慢修復關係，不必急著求結果。",
    score: 1
  },
  {
    roman: "XVIII",
    name: "月亮",
    daily: "情緒和想像會放大不安，先確認事實再反應。",
    caution: "不要讓猜測牽著走，今天尤其需要睡眠和冷靜。",
    love: "曖昧訊號可能很多，先不要把不確定當答案。",
    score: -1
  },
  {
    roman: "XIX",
    name: "太陽",
    daily: "今天適合把事情攤開來做，明確、坦率會帶來好結果。",
    caution: "別因為狀態好就忽略他人的感受。",
    love: "正向互動增加，適合簡單直接地表達關心。",
    score: 1
  },
  {
    roman: "XX",
    name: "審判",
    daily: "你可能需要做一次總結，承認過去並選擇下一步。",
    caution: "不要一直回頭責怪自己，重點是重新定位。",
    love: "舊問題可能再被提起，這次要用更成熟的方式處理。",
    score: 0
  },
  {
    roman: "XXI",
    name: "世界",
    daily: "某件事接近完成，適合收尾、整理成果或跨到下一階段。",
    caution: "不要在快完成時鬆散，最後整理會決定品質。",
    love: "關係有機會進入更穩定的狀態，但要一起看未來安排。",
    score: 1
  }
];

const spreadLabels = {
  daily: ["今天的牌"],
  yesno: ["問題核心"],
  love: ["你的狀態", "對方或關係線索", "下一步建議"]
};

function tarotOrientation() {
  return Math.random() > 0.38 ? "正位" : "逆位";
}

function drawTarotCards(count) {
  const pool = [...tarotDeck];
  const result = [];
  while (result.length < count && pool.length) {
    const index = Math.floor(Math.random() * pool.length);
    const [card] = pool.splice(index, 1);
    result.push({ ...card, orientation: tarotOrientation() });
  }
  return result;
}

function tarotVerdict(spread, cards) {
  if (spread !== "yesno") {
    return "把這次抽牌當成提醒，不要把它當成唯一答案。";
  }
  const score = cards.reduce((total, card) => {
    const direction = card.orientation === "正位" ? 1 : -0.55;
    return total + card.score * direction;
  }, 0);
  if (score > 0.55) return "偏向可以，但仍要先補齊現實條件。";
  if (score < -0.25) return "偏向先暫停，等資訊清楚後再決定。";
  return "答案還不明確，先把問題拆小再觀察。";
}

function tarotMotif(name) {
  const motifs = {
    "愚者": `
      <path d="M72 218 C96 178 116 150 146 116" />
      <path d="M64 222 L96 222" />
      <circle cx="150" cy="108" r="18" />
      <path d="M149 126 L136 174 L171 202" />
      <path d="M152 145 L187 128" />
      <path d="M124 151 L96 132" />
    `,
    "魔術師": `
      <path d="M110 84 C140 58 170 58 200 84 C170 110 140 110 110 84 Z" />
      <path d="M156 114 L156 220" />
      <path d="M118 154 L194 154" />
      <path d="M126 210 L186 210" />
      <circle cx="156" cy="154" r="26" />
    `,
    "女祭司": `
      <path d="M98 218 L98 106" />
      <path d="M214 218 L214 106" />
      <path d="M118 98 L194 98" />
      <path d="M156 124 C133 139 133 176 156 191 C143 188 128 175 128 156 C128 137 143 124 156 124 Z" />
      <path d="M128 222 L184 222" />
    `,
    "皇后": `
      <path d="M156 88 L178 130 L224 136 L190 168 L198 214 L156 192 L114 214 L122 168 L88 136 L134 130 Z" />
      <path d="M124 230 C132 198 180 198 188 230" />
      <path d="M156 192 L156 236" />
      <path d="M132 236 C116 216 108 196 112 174" />
      <path d="M180 236 C196 216 204 196 200 174" />
    `,
    "皇帝": `
      <path d="M110 220 L110 122 L202 122 L202 220 Z" />
      <path d="M124 122 L156 86 L188 122" />
      <path d="M134 152 L178 152" />
      <path d="M134 180 L178 180" />
      <path d="M128 222 L128 244" />
      <path d="M184 222 L184 244" />
    `,
    "教皇": `
      <path d="M124 222 L124 132 C124 108 188 108 188 132 L188 222" />
      <path d="M112 222 L200 222" />
      <path d="M156 86 L156 174" />
      <path d="M132 112 L180 112" />
      <path d="M104 244 L142 206" />
      <path d="M208 244 L170 206" />
    `,
    "戀人": `
      <path d="M112 130 C112 102 152 102 156 132 C160 102 200 102 200 130 C200 164 156 198 156 198 C156 198 112 164 112 130 Z" />
      <circle cx="116" cy="226" r="24" />
      <circle cx="196" cy="226" r="24" />
      <path d="M140 226 L172 226" />
    `,
    "戰車": `
      <path d="M92 198 L220 198 L198 124 L114 124 Z" />
      <path d="M118 124 L156 86 L194 124" />
      <circle cx="122" cy="224" r="20" />
      <circle cx="190" cy="224" r="20" />
      <path d="M128 154 L184 154" />
    `,
    "力量": `
      <path d="M118 104 C148 78 176 78 204 104 C176 130 148 130 118 104 Z" />
      <path d="M98 206 C112 150 202 150 216 206 C196 238 118 238 98 206 Z" />
      <path d="M126 198 C144 216 168 216 186 198" />
      <path d="M126 188 L186 188" />
    `,
    "隱者": `
      <path d="M146 224 L166 224 L166 128 L146 128 Z" />
      <path d="M156 128 L156 86" />
      <path d="M126 104 L186 104" />
      <path d="M102 244 L146 178" />
      <path d="M188 244 L166 178" />
      <circle cx="156" cy="92" r="18" />
    `,
    "命運之輪": `
      <circle cx="156" cy="166" r="68" />
      <circle cx="156" cy="166" r="28" />
      <path d="M156 98 L156 234" />
      <path d="M88 166 L224 166" />
      <path d="M108 118 L204 214" />
      <path d="M204 118 L108 214" />
    `,
    "正義": `
      <path d="M156 84 L156 238" />
      <path d="M104 122 L208 122" />
      <path d="M114 122 L88 178 L140 178 Z" />
      <path d="M198 122 L172 178 L224 178 Z" />
      <path d="M126 238 L186 238" />
    `,
    "吊人": `
      <path d="M104 86 L208 86" />
      <path d="M156 86 L156 132" />
      <circle cx="156" cy="150" r="18" />
      <path d="M156 168 L156 222" />
      <path d="M156 190 L118 164" />
      <path d="M156 190 L194 164" />
      <path d="M156 222 L126 244" />
      <path d="M156 222 L186 244" />
    `,
    "死神": `
      <path d="M98 226 C132 186 178 186 214 226" />
      <path d="M110 226 L202 226" />
      <path d="M156 226 L156 154" />
      <path d="M128 158 C142 118 170 118 184 158" />
      <path d="M122 102 C154 118 180 88 204 104" />
      <path d="M122 102 C152 88 178 118 204 104" />
    `,
    "節制": `
      <path d="M118 126 L156 148 L136 190 L98 168 Z" />
      <path d="M194 126 L156 148 L176 190 L214 168 Z" />
      <path d="M138 150 C158 164 172 164 194 150" />
      <path d="M112 226 C136 206 176 206 200 226" />
      <path d="M124 244 L188 244" />
    `,
    "惡魔": `
      <path d="M112 130 L138 92 L156 128 L174 92 L200 130" />
      <circle cx="156" cy="158" r="30" />
      <path d="M126 214 C126 184 186 184 186 214" />
      <path d="M104 224 C126 248 138 202 156 224 C174 202 186 248 208 224" />
    `,
    "高塔": `
      <path d="M122 238 L136 110 L196 122 L184 238 Z" />
      <path d="M144 110 L184 82 L204 122" />
      <path d="M204 76 L176 128 L210 118 L178 184" />
      <path d="M142 154 L176 160" />
      <path d="M138 196 L172 202" />
    `,
    "星星": `
      <path d="M156 78 L170 132 L224 132 L180 164 L196 218 L156 186 L116 218 L132 164 L88 132 L142 132 Z" />
      <path d="M104 238 C130 218 182 218 208 238" />
      <path d="M118 252 L194 252" />
    `,
    "月亮": `
      <path d="M174 82 C132 108 132 174 174 202 C136 198 106 172 106 142 C106 112 136 86 174 82 Z" />
      <path d="M94 230 C122 208 190 208 218 230" />
      <path d="M110 248 C136 232 176 232 202 248" />
      <path d="M92 152 L122 132" />
      <path d="M220 152 L190 132" />
    `,
    "太陽": `
      <circle cx="156" cy="150" r="44" />
      <path d="M156 76 L156 44" />
      <path d="M156 256 L156 224" />
      <path d="M82 150 L50 150" />
      <path d="M262 150 L230 150" />
      <path d="M104 98 L82 76" />
      <path d="M208 202 L230 224" />
      <path d="M208 98 L230 76" />
      <path d="M104 202 L82 224" />
    `,
    "審判": `
      <path d="M114 122 L196 86 L196 146 Z" />
      <path d="M196 116 L224 116" />
      <path d="M118 196 C138 176 174 176 194 196" />
      <path d="M116 228 L196 228" />
      <path d="M156 174 L156 228" />
      <path d="M132 206 L180 206" />
    `,
    "世界": `
      <circle cx="156" cy="166" r="70" />
      <path d="M112 116 C136 94 176 94 200 116" />
      <path d="M112 216 C136 238 176 238 200 216" />
      <path d="M156 96 L156 236" />
      <path d="M86 166 L226 166" />
      <path d="M126 166 C126 128 186 128 186 166 C186 204 126 204 126 166 Z" />
    `
  };
  return motifs[name] || motifs["世界"];
}

function tarotCardArt(card) {
  return `
    <svg class="tarot-card-illustration" role="img" aria-label="${card.name}牌面圖" viewBox="0 0 312 430" xmlns="http://www.w3.org/2000/svg">
      <rect class="tarot-art-border" x="18" y="18" width="276" height="394" rx="22" />
      <rect class="tarot-art-inner" x="34" y="34" width="244" height="362" rx="16" />
      <circle class="tarot-art-orbit" cx="156" cy="176" r="104" />
      <circle class="tarot-art-orbit small" cx="156" cy="176" r="76" />
      <text class="tarot-art-roman" x="156" y="70" text-anchor="middle">${card.roman}</text>
      <g class="tarot-art-motif" fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${tarotMotif(card.name)}
      </g>
      <text class="tarot-art-name" x="156" y="360" text-anchor="middle">${card.name}</text>
    </svg>
  `;
}

function renderTarotReading(container, cards, spread, question) {
  const resultNode = container.querySelector("[data-tarot-result]");
  if (!resultNode) return;
  const labels = spreadLabels[spread] || spreadLabels.daily;
  const cardsHtml = cards.map((card, index) => {
    const meaning = card.orientation === "正位" ? card.daily : card.caution;
    const loveLine = spread === "love" ? `<p>${card.love}</p>` : "";
    return `
      <article class="tarot-card-result">
        <figure class="tarot-card-face">
          ${tarotCardArt(card)}
        </figure>
        <div>
          <p class="tarot-position">${labels[index] || `第 ${index + 1} 張`}</p>
          <h3>${card.name}<span>${card.orientation}</span></h3>
          <p>${meaning}</p>
          ${loveLine}
        </div>
      </article>
    `;
  }).join("");
  const questionHtml = question ? `<p class="tarot-question-line">這次問題：${escapeHtml(question)}</p>` : "";
  resultNode.innerHTML = `
    ${questionHtml}
    <div class="tarot-result-grid">${cardsHtml}</div>
    <div class="notice tarot-notice"><strong>抽牌結論：</strong>${tarotVerdict(spread, cards)}</div>
  `;
}

function bindTarotReadings() {
  document.querySelectorAll("[data-tarot-reading]").forEach((container) => {
    const button = container.querySelector("[data-draw-tarot]");
    if (!button) return;
    button.addEventListener("click", () => {
      const spread = container.dataset.spread || "daily";
      const count = Number(container.dataset.cardCount || 1);
      const questionInput = container.querySelector("[name='tarotQuestion']");
      const question = questionInput ? questionInput.value.trim() : "";
      renderTarotReading(container, drawTarotCards(count), spread, question);
    });
  });
}

bindTarotReadings();
