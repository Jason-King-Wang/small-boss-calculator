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
    image: "fool.webp",
    daily: "今天適合用新的眼光看事情，先允許自己試一小步。",
    caution: "不要只靠衝動做決定，先確認基本風險。",
    love: "關係需要自然一點，別急著把所有答案定死。",
    score: 1
  },
  {
    roman: "I",
    name: "魔術師",
    image: "magician.webp",
    daily: "你手上已有一些資源，重點是把想法落成具體行動。",
    caution: "別只停在說法漂亮，今天要看是否真的做得到。",
    love: "主動溝通會有幫助，但不要把話術當成真誠。",
    score: 1
  },
  {
    roman: "II",
    name: "女祭司",
    image: "high-priestess.webp",
    daily: "先安靜觀察，答案可能藏在你沒有說出口的感受裡。",
    caution: "不要因為不確定就過度猜測，補足資訊再判斷。",
    love: "有些情緒還沒浮上檯面，先給彼此一點空間。",
    score: 0
  },
  {
    roman: "III",
    name: "皇后",
    image: "empress.webp",
    daily: "適合照顧身體、整理環境，也適合把想法做得更有質感。",
    caution: "小心只顧舒服而拖延真正該處理的事。",
    love: "溫柔、穩定和照顧感會比逼問更有效。",
    score: 1
  },
  {
    roman: "IV",
    name: "皇帝",
    image: "emperor.webp",
    daily: "今天需要規則和邊界，把順序排清楚會少很多消耗。",
    caution: "不要把控制感誤認成安全感，留一點彈性。",
    love: "關係裡需要清楚承諾，但也要避免單方面下指令。",
    score: 1
  },
  {
    roman: "V",
    name: "教皇",
    image: "hierophant.webp",
    daily: "回到基本原則，找可信賴的經驗和方法。",
    caution: "別被單一標準綁死，傳統做法也需要符合當下情境。",
    love: "共同價值觀比短暫情緒更重要，可以談談彼此期待。",
    score: 0
  },
  {
    roman: "VI",
    name: "戀人",
    image: "lovers.webp",
    daily: "今天會碰到選擇，關鍵是你真正重視什麼。",
    caution: "不要只為了討好別人而選，後面會付出代價。",
    love: "適合誠實確認彼此需求，別用猜的代替溝通。",
    score: 1
  },
  {
    roman: "VII",
    name: "戰車",
    image: "chariot.webp",
    daily: "把注意力放在目標上，今天適合推進卡住的事。",
    caution: "速度太快容易忽略細節，先確認方向再衝。",
    love: "主動靠近有幫助，但不要把互動變成輸贏。",
    score: 1
  },
  {
    roman: "VIII",
    name: "力量",
    image: "strength.webp",
    daily: "用穩定和耐心處理問題，比硬碰硬更容易過關。",
    caution: "別壓抑太久，溫和不是什麼都吞下去。",
    love: "給對方安全感，也給自己說真話的空間。",
    score: 1
  },
  {
    roman: "IX",
    name: "隱者",
    image: "hermit.webp",
    daily: "今天適合慢下來，釐清自己真正需要什麼。",
    caution: "不要把退一步變成逃避，該回應的事仍要回應。",
    love: "關係可能需要冷靜，不代表完全沒有可能。",
    score: 0
  },
  {
    roman: "X",
    name: "命運之輪",
    image: "wheel-of-fortune.webp",
    daily: "變化正在發生，先接受局勢流動，再找你能掌握的點。",
    caution: "不要把所有結果都交給運氣，仍要保留行動方案。",
    love: "關係進入轉折期，先觀察新的互動模式。",
    score: 1
  },
  {
    roman: "XI",
    name: "正義",
    image: "justice.webp",
    daily: "今天適合看清事實、合約、責任和公平性。",
    caution: "別只看自己有理，也要看對方承受了什麼。",
    love: "把界線和期待說清楚，會比冷處理更好。",
    score: 0
  },
  {
    roman: "XII",
    name: "吊人",
    image: "hanged-man.webp",
    daily: "暫停不是失敗，換角度後會看到新的解法。",
    caution: "不要用等待包裝拖延，先分清楚什麼能做。",
    love: "短期可能不適合逼答案，先看彼此願不願意調整。",
    score: -1
  },
  {
    roman: "XIII",
    name: "死神",
    image: "death.webp",
    daily: "某個舊模式正在結束，清掉不合適的東西才有新空間。",
    caution: "不要因為害怕改變而抓住已經失效的做法。",
    love: "關係需要誠實面對變化，逃避只會拖長不舒服。",
    score: -1
  },
  {
    roman: "XIV",
    name: "節制",
    image: "temperance.webp",
    daily: "今天適合調整比例，慢慢混合不同資源。",
    caution: "別急著一次到位，太用力反而失衡。",
    love: "溝通需要降溫，先找雙方都能接受的節奏。",
    score: 1
  },
  {
    roman: "XV",
    name: "惡魔",
    image: "devil.webp",
    daily: "注意慣性、依賴和短期誘惑，它們可能讓你失去主導權。",
    caution: "不要把想要誤認成必須，先停一下。",
    love: "吸引力很強，但需要看清是否有不健康的拉扯。",
    score: -1
  },
  {
    roman: "XVI",
    name: "高塔",
    image: "tower.webp",
    daily: "突發狀況可能打破原本安排，先處理最重要的安全與事實。",
    caution: "不要硬撐已經不穩的結構，修正比掩飾重要。",
    love: "可能有話題需要攤開，先保持冷靜再談。",
    score: -1
  },
  {
    roman: "XVII",
    name: "星星",
    image: "star.webp",
    daily: "今天適合恢復信心，讓自己回到比較清澈的狀態。",
    caution: "希望很重要，但仍要搭配實際步驟。",
    love: "善意和信任可以慢慢修復關係，不必急著求結果。",
    score: 1
  },
  {
    roman: "XVIII",
    name: "月亮",
    image: "moon.webp",
    daily: "情緒和想像會放大不安，先確認事實再反應。",
    caution: "不要讓猜測牽著走，今天尤其需要睡眠和冷靜。",
    love: "曖昧訊號可能很多，先不要把不確定當答案。",
    score: -1
  },
  {
    roman: "XIX",
    name: "太陽",
    image: "sun.webp",
    daily: "今天適合把事情攤開來做，明確、坦率會帶來好結果。",
    caution: "別因為狀態好就忽略他人的感受。",
    love: "正向互動增加，適合簡單直接地表達關心。",
    score: 1
  },
  {
    roman: "XX",
    name: "審判",
    image: "judgement.webp",
    daily: "你可能需要做一次總結，承認過去並選擇下一步。",
    caution: "不要一直回頭責怪自己，重點是重新定位。",
    love: "舊問題可能再被提起，這次要用更成熟的方式處理。",
    score: 0
  },
  {
    roman: "XXI",
    name: "世界",
    image: "world.webp",
    daily: "某件事接近完成，適合收尾、整理成果或跨到下一階段。",
    caution: "不要在快完成時鬆散，最後整理會決定品質。",
    love: "關係有機會進入更穩定的狀態，但要一起看未來安排。",
    score: 1
  }
];

const spreadConfigs = {
  daily: {
    labels: ["今天的牌"],
    title: "今日牌訊",
    summary: "今天先抓一個核心提醒。把牌意放回你的問題裡，看它在提醒你修正哪一個細節。"
  },
  yesno: {
    labels: ["問題核心"],
    title: "是或否傾向",
    summary: "是或否牌陣只適合看短期傾向。若答案不明確，代表問題還需要拆小或補資料。"
  },
  love: {
    labels: ["你的狀態", "對方或關係線索", "下一步建議"],
    title: "感情三張牌",
    summary: "三張牌適合整理互動方向。先看自己能調整什麼，再看關係裡正在浮現的訊號。"
  },
  three: {
    labels: ["過去的根", "現在的門", "接下來的路"],
    title: "過去現在未來",
    summary: "這個牌陣適合看一件事的流動。過去不是判決，現在才是你能改變的入口。"
  },
  career: {
    labels: ["目前局勢", "阻力與資源", "下一步行動"],
    title: "事業工作牌陣",
    summary: "工作牌陣重點不在預言升遷，而是看清目前局勢、可用資源和下一個務實動作。"
  },
  five: {
    labels: ["現況", "問題根源", "隱藏影響", "可採取行動", "可能走向"],
    title: "五張牌深入牌陣",
    summary: "五張牌適合把問題拆開。它會同時看現況、根源、盲點、行動和短期走向。"
  },
  loveFive: {
    labels: ["你的心態", "對方或互動", "關係阻礙", "可修正之處", "短期發展"],
    title: "感情五張牌",
    summary: "感情五張牌比三張更完整。它不替對方下定論，而是幫你看清互動裡的力量分布。"
  },
  seven: {
    labels: ["表面狀態", "深層動機", "外在環境", "主要阻礙", "可用資源", "建議", "短期走向"],
    title: "七張牌完整牌陣",
    summary: "七張牌適合複雜問題。它會把表面、內在、外在、阻礙、資源和建議分開看。"
  },
  celtic: {
    labels: ["核心現況", "交叉阻礙", "問題根基", "過去影響", "顯性目標", "近未來", "你的立場", "外在環境", "希望與恐懼", "可能結果"],
    title: "凱爾特十字",
    summary: "凱爾特十字適合重要議題的深度整理。請把結果當成一張問題地圖，而不是單一答案。"
  },
  yearly: {
    labels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    title: "年度十二張牌",
    summary: "年度牌陣適合看每個月份的提醒。它不是年度預言書，而是幫你安排節奏的參考。"
  }
};

const spreadLabels = Object.fromEntries(
  Object.entries(spreadConfigs).map(([key, config]) => [key, config.labels])
);

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

function tarotScore(cards) {
  return cards.reduce((total, card) => {
    const direction = card.orientation === "正位" ? 1 : -0.55;
    return total + card.score * direction;
  }, 0);
}

function tarotVerdict(spread, cards) {
  const score = tarotScore(cards);
  if (spread !== "yesno") {
    const config = spreadConfigs[spread] || spreadConfigs.daily;
    const uprightCount = cards.filter((card) => card.orientation === "正位").length;
    const reversedCount = cards.length - uprightCount;
    const tone = score > 1.2
      ? "整體牌勢偏順，適合把能做的事推進一步。"
      : score < -0.8
        ? "整體牌勢偏緊，先處理風險、誤會和拖延，不急著硬衝。"
        : "整體牌勢混合，代表答案不在單一方向，而在調整順序和條件。";
    return `${config.summary} ${tone} 正位 ${uprightCount} 張，逆位 ${reversedCount} 張。`;
  }
  if (score > 0.55) return "偏向可以，但仍要先補齊現實條件。";
  if (score < -0.25) return "偏向先暫停，等資訊清楚後再決定。";
  return "答案還不明確，先把問題拆小再觀察。";
}

function tarotTone(score) {
  if (score > 1.2) {
    return {
      label: "偏順",
      answer: "可以往前推進，但要把眼前能做的小步驟先落地。",
      overview: "整體牌勢偏順，代表事情有可用的資源與支撐，不需要一直停在想像裡。",
      reminder: "順勢不代表不用確認細節。真正的重點是把機會變成明確行動。",
      action: "選一個今天就能完成的小動作，先讓局面往前移動。"
    };
  }
  if (score < -0.8) {
    return {
      label: "偏緊",
      answer: "現在先不要硬衝，先處理阻礙、誤會或拖延。",
      overview: "整體牌勢偏緊，代表問題不是沒有答案，而是目前條件還沒有整理好。",
      reminder: "越想立刻得到結果，越容易忽略代價。先把風險攤開，反而會更清楚。",
      action: "先暫停一個衝動決定，列出最不確定的三件事再處理。"
    };
  }
  return {
    label: "混合",
    answer: "答案不在單一路線，而在調整順序與條件。",
    overview: "整體牌勢有推力也有卡點，代表可以前進，但前進方式需要修正。",
    reminder: "不要只挑自己想聽的牌看。順牌指出資源，逆牌指出需要補上的地方。",
    action: "先做最小幅度的調整，再觀察回饋，不要一次把所有事推翻。"
  };
}

function tarotKeyCards(cards) {
  const lead = cards.reduce((best, card) => (
    Math.abs(card.score) > Math.abs(best.score) ? card : best
  ), cards[0]);
  const reversed = cards.find((card) => card.orientation === "逆位");
  const negative = cards.find((card) => card.score < 0);
  return {
    lead,
    challenge: reversed || negative || lead
  };
}

function tarotPhase(score) {
  if (score > 0.8) return "較順，適合主動安排與推進";
  if (score < -0.4) return "較需要保守，先修正條件與節奏";
  return "偏混合，適合邊走邊調整";
}

function tarotConclusion(spread, cards) {
  const config = spreadConfigs[spread] || spreadConfigs.daily;
  const score = tarotScore(cards);
  const tone = tarotTone(score);
  const uprightCount = cards.filter((card) => card.orientation === "正位").length;
  const reversedCount = cards.length - uprightCount;
  const { lead, challenge } = tarotKeyCards(cards);
  const leadName = `${lead.name}${lead.orientation}`;
  const challengeName = `${challenge.name}${challenge.orientation}`;
  const meta = `正位 ${uprightCount} 張，逆位 ${reversedCount} 張。主導牌是 ${leadName}，需要留意的是 ${challengeName}。`;

  if (cards.length === 1) {
    return {
      eyebrow: config.title,
      title: "本次提示",
      answer: tarotVerdict(spread, cards),
      overview: `這張牌的核心訊息落在 ${leadName}。先把它當成今天的提醒，不要把單張牌放大成固定命運。`,
      reminder: tarotDomainLine(spread, lead),
      action: tarotActionLine(lead),
      meta
    };
  }

  const spreadCopy = {
    yesno: {
      title: "本次結論",
      answer: tarotVerdict(spread, cards),
      overview: `這組牌的重點不是只看可以或不可以，而是看條件是否成熟。${tone.overview}`,
      reminder: `如果你期待一個乾脆答案，先看 ${challengeName} 指出的卡點。它會說明為什麼答案還需要條件。`,
      action: tone.action
    },
    love: {
      title: "本次感情結論",
      answer: `這段關係現在的主軸是 ${tone.label}，重點落在互動節奏與真實感受。`,
      overview: `三張牌合起來看，感情不是只看對方怎麼想，也要看你們的互動模式。${tone.overview}`,
      reminder: `${challengeName} 是這次最需要溫柔但誠實處理的位置，不適合只靠猜測。`,
      action: "先說清楚一件具體感受，再觀察對方是否願意用行動回應。"
    },
    loveFive: {
      title: "本次感情結論",
      answer: `這段關係要先看清楚彼此需求，再決定要靠近、等待或拉開距離。`,
      overview: `五張牌顯示這不是單點問題，而是感受、阻礙、關係需求與未來走向一起作用。${tone.overview}`,
      reminder: `${leadName} 是關係中的主導力量，${challengeName} 是容易讓彼此誤會或停住的地方。`,
      action: "把關係期待講成一個具體請求，而不是讓對方猜你的標準。"
    },
    three: {
      title: "本次三張牌結論",
      answer: `過去留下的慣性正在影響現在，下一步要順著 ${leadName} 的方向調整。`,
      overview: `三張牌要一起看。第一張是背景，第二張是現在，第三張才是下一步，不應只挑最後一張當結果。${tone.overview}`,
      reminder: `${challengeName} 顯示真正卡住的不是答案本身，而是你用什麼順序處理問題。`,
      action: "先分清楚哪些是已經發生的事，哪些是現在還能調整的事。"
    },
    career: {
      title: "本次事業結論",
      answer: `工作或計畫可以推進到下一步，但要先確認責任、資源與時間。`,
      overview: `事業牌陣的重點是把想法落到現實條件。${tone.overview}`,
      reminder: `${challengeName} 提醒你不要把壓力當成方向，也不要把拖延當成觀察。`,
      action: "把下一步拆成一個可以交付的成果，先定義完成標準再做。"
    },
    five: {
      title: "本次五張牌結論",
      answer: `這件事的核心已經浮出來，但阻礙與外部因素要一起處理。`,
      overview: `五張牌適合看問題結構。核心、阻礙、環境和建議要串起來讀，才不會只看到零散訊息。${tone.overview}`,
      reminder: `${leadName} 是可用力量，${challengeName} 是修正點。兩者合起來才是完整答案。`,
      action: "先處理最會拖慢整件事的阻礙，再用可用資源往前推。"
    },
    seven: {
      title: "本次七張牌結論",
      answer: `問題背後有更深的原因，答案要從表面事件往下看。`,
      overview: `七張牌不是為了讓答案變複雜，而是把看不見的背景、外部影響與建議攤開。${tone.overview}`,
      reminder: `${challengeName} 指向你最容易忽略的層次，這裡通常比表面結果更重要。`,
      action: "先找出真正反覆出現的模式，再決定要補資源、溝通或改路線。"
    },
    celtic: {
      title: "本次凱爾特十字結論",
      answer: `這次不是單一結果問題，而是一張完整問題地圖。核心要先被看懂，結果才有意義。`,
      overview: `凱爾特十字要看核心、阻礙、根基、環境與結果的連動。${tone.overview}`,
      reminder: `${leadName} 是整體主軸，${challengeName} 是最容易讓結果偏掉的關鍵。不要只看最後一張。`,
      action: "先修正核心阻礙，再看外部環境能不能配合。最後結果是前面九張牌累積出來的。"
    },
    yearly: {
      title: "本次年度結論",
      answer: `這一年要用節奏來看，不要把某一個月份當成全年命運。`,
      overview: `年度牌陣的重點是安排節奏。上半年${tarotPhase(tarotScore(cards.slice(0, 6)))}，下半年${tarotPhase(tarotScore(cards.slice(6)))}。`,
      reminder: `${challengeName} 對應的月份要特別保守，${leadName} 則是全年可以借力的位置。`,
      action: "把年度提醒拆成季度檢查，不要一次想解決整年的問題。"
    }
  };

  const picked = spreadCopy[spread] || {
    title: "本次結論",
    answer: tone.answer,
    overview: `${config.summary} ${tone.overview}`,
    reminder: `${leadName} 是這次的主導訊號，${challengeName} 是需要補上的條件。`,
    action: tone.action
  };

  return {
    eyebrow: config.title,
    title: picked.title,
    answer: picked.answer,
    overview: picked.overview,
    reminder: `${picked.reminder} ${meta}`,
    action: picked.action,
    meta
  };
}

function tarotCardImageSrc(filename) {
  const basePath = window.location.pathname.includes("/fortune/") ? "../assets/tarot-cards/" : "assets/tarot-cards/";
  return `${basePath}${filename}`;
}

function tarotCardArt(card) {
  const src = tarotCardImageSrc(card.image);
  const alt = `${card.name}\u724c\u9762\u5716`;
  return `<img class="tarot-card-image" src="${src}" alt="${alt}" loading="eager" decoding="async">`;
}

function tarotDomainLine(spread, card) {
  if (spread === "love" || spread === "loveFive") {
    return card.love;
  }
  if (spread === "career") {
    if (card.score > 0) return "工作上可先抓住一個能落地的機會，不必等所有條件完美。";
    if (card.score < 0) return "工作上先檢查風險、權責和溝通成本，避免把壓力放大。";
    return "工作上需要補足資訊或請教有經驗的人，再決定下一步。";
  }
  if (spread === "yearly") {
    return "這個月份適合把牌意轉成一個提醒：哪些事要推進，哪些事要留白。";
  }
  if (spread === "celtic") {
    return "在這個位置上，請同時看牌意和現實條件，不要只抓最想聽的一句。";
  }
  return "把這張牌當成一面鏡子，對照你現在最在意的問題。";
}

function tarotPositionLine(spread, index, card) {
  const labels = spreadLabels[spread] || spreadLabels.daily;
  const label = labels[index] || `第 ${index + 1} 張`;
  const movement = card.orientation === "正位" ? "這裡的能量比較外顯，可以用行動回應。" : "這裡的能量比較卡住，需要先修正或放慢。";
  return `在「${label}」位置，${card.name}${card.orientation}表示重點落在${card.orientation === "正位" ? "可被使用的力量" : "尚未順暢的力量"}。${movement}`;
}

function tarotActionLine(card) {
  if (card.orientation === "逆位") {
    return "先不要急著求結論。把最不確定的條件寫下來，確認後再行動。";
  }
  if (card.score > 0) {
    return "選一個小而明確的動作，讓局勢從想像回到現實。";
  }
  if (card.score < 0) {
    return "先停下來整理代價、界線和安全感，不要用衝動補焦慮。";
  }
  return "先觀察，再詢問，再決定。這張牌提醒你不要省略中間步驟。";
}

function renderTarotReading(container, cards, spread, question) {
  const resultNode = container.querySelector("[data-tarot-result]");
  if (!resultNode) return;
  const config = spreadConfigs[spread] || spreadConfigs.daily;
  const labels = config.labels;
  const conclusion = tarotConclusion(spread, cards);
  const cardsHtml = cards.map((card, index) => {
    const meaning = card.orientation === "正位" ? card.daily : card.caution;
    return `
      <article class="tarot-card-result">
        <figure class="tarot-card-face">
          ${tarotCardArt(card)}
        </figure>
        <div class="tarot-card-copy">
          <p class="tarot-position">${labels[index] || `第 ${index + 1} 張`}</p>
          <h3>${card.name}<span>${card.orientation}</span></h3>
          <p class="tarot-main-meaning">${meaning}</p>
          <dl class="tarot-reading-points">
            <div>
              <dt>位置解讀</dt>
              <dd>${tarotPositionLine(spread, index, card)}</dd>
            </div>
            <div>
              <dt>補充提醒</dt>
              <dd>${tarotDomainLine(spread, card)}</dd>
            </div>
            <div>
              <dt>行動建議</dt>
              <dd>${tarotActionLine(card)}</dd>
            </div>
          </dl>
        </div>
      </article>
    `;
  }).join("");
  const questionHtml = question ? `<p class="tarot-question-line">這次問題：${escapeHtml(question)}</p>` : "";
  resultNode.innerHTML = `
    ${questionHtml}
    <section class="tarot-reading-summary tarot-reading-overview" aria-live="polite">
      <span>${conclusion.eyebrow}</span>
      <h2>${conclusion.title}</h2>
      <p class="tarot-conclusion-answer">${conclusion.answer}</p>
      <div class="tarot-conclusion-grid">
        <article>
          <strong>整體牌勢</strong>
          <p>${conclusion.overview}</p>
        </article>
        <article>
          <strong>關鍵提醒</strong>
          <p>${conclusion.reminder}</p>
        </article>
        <article>
          <strong>行動建議</strong>
          <p>${conclusion.action}</p>
        </article>
      </div>
    </section>
    <div class="tarot-card-list-heading">
      <span>逐張牌解讀</span>
      <p>下面依牌陣位置拆開看。每張牌是線索，不是孤立答案。</p>
    </div>
    <div class="tarot-result-grid${cards.length > 5 ? " spread-large" : ""}">${cardsHtml}</div>
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
