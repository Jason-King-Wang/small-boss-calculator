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
