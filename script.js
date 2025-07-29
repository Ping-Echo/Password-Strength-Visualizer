const passwordInput = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.querySelector("#strength-text span");
const tipsList = document.getElementById("tips");
const crackTime = document.getElementById("crack-time");
const copyBtn = document.getElementById("copy-btn");

const strengthLevels = [
  { color: "red", label: "Very Weak" },
  { color: "orange", label: "Weak" },
  { color: "#f9c74f", label: "Fair" },
  { color: "#90be6d", label: "Strong" },
  { color: "#43aa8b", label: "Very Strong" },
];

passwordInput.addEventListener("input", () => {
  const pwd = passwordInput.value;
  const score = calculateScore(pwd);

  strengthBar.style.width = `${score * 20}%`;
  strengthBar.style.backgroundColor = strengthLevels[score]?.color || "red";

  strengthText.textContent = strengthLevels[score]?.label || "Very Weak";

  showTips(pwd);

  crackTime.textContent = estimateCrackTime(pwd);
});

copyBtn.addEventListener("click", () => {
  const pwd = passwordInput.value;
  if (pwd.length > 0) {
    navigator.clipboard.writeText(pwd);
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy Password"), 1500);
  }
});

function calculateScore(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  return score;
}

function showTips(password) {
  tipsList.innerHTML = "";

  const tips = [];
  if (password.length < 8) tips.push("Use at least 8 characters");
  if (!/[A-Z]/.test(password)) tips.push("Include an uppercase letter");
  if (!/[0-9]/.test(password)) tips.push("Add at least one number");
  if (!/[^A-Za-z0-9]/.test(password)) tips.push("Use at least one special character");
  if (password.length < 12) tips.push("Longer passwords are stronger");

  tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    tipsList.appendChild(li);
  });
}

function estimateCrackTime(password) {
  const length = password.length;
  const charsetSize = (/[a-z]/.test(password) ? 26 : 0) +
                      (/[A-Z]/.test(password) ? 26 : 0) +
                      (/[0-9]/.test(password) ? 10 : 0) +
                      (/[^A-Za-z0-9]/.test(password) ? 32 : 0);

  const totalCombos = Math.pow(charsetSize || 1, length);
  const guessesPerSecond = 1e9;
  const seconds = totalCombos / guessesPerSecond;

  return formatTime(seconds);
}

function formatTime(seconds) {
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months`;
  return `${Math.floor(seconds / 31536000)} years`;
}
