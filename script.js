// ---------- Helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const val = (id) => document.getElementById(id).value.trim();

// ---------- Prompt templates ----------
// Every prompt follows the same anatomy: Role, Context, Task, Constraints, Output format.
const TONE = {
  Formal: "Use polite, precise language and a courteous closing.",
  Informal: "Keep it friendly and conversational, but still respectful.",
  Persuasive: "Lead with the benefit to the reader, give a clear reason to act, and end with one specific call to action.",
};
const AUDIENCE = {
  Client: "Focus on value, reliability and clear next steps for the client.",
  Manager: "Be concise and outcome-focused, and lead with the key point or request.",
  Team: "Be clear about who does what and by when.",
  Colleague: "Be collaborative and direct.",
};

const builders = {
  email() {
    const purpose = val("e-purpose");
    if (!purpose) return { error: "Please describe what the email is about." };
    const tone = val("e-tone"), audience = val("e-audience");
    return { prompt: [
      "ROLE",
      "You are an experienced business communication specialist.",
      "",
      "TASK",
      "Write a professional email.",
      "",
      "CONTEXT",
      "- Audience: " + audience,
      "- Tone: " + tone,
      "- Purpose: " + purpose,
      "- Key points to include: " + (val("e-points") || "None given, keep to the purpose"),
      "- Recipient name: " + (val("e-recipient") || "[Recipient name]"),
      "- Sender name: " + (val("e-name") || "[Your name]"),
      "- Style guide: " + TONE[tone] + " " + AUDIENCE[audience],
      "",
      "CONSTRAINTS",
      "- Length: " + val("e-length"),
      "- Do not invent facts, dates, prices or promises. Use a [placeholder] for any missing detail.",
      "- Use clear, plain language and avoid cliches.",
      "",
      "OUTPUT FORMAT",
      "1. Subject line",
      "2. Email body",
      "3. Two alternative subject lines",
    ].join("\n") };
  },

  meeting() {
    const notes = val("m-notes");
    if (!notes) return { error: "Please paste your meeting notes." };
    const detail = val("m-detail");
    const summaryLen = detail === "Brief" ? "2 to 3 sentences" : detail === "Detailed" ? "two short paragraphs" : "one short paragraph";
    return { prompt: [
      "ROLE",
      "You are a skilled meeting secretary.",
      "",
      "TASK",
      "Turn the meeting notes below into a clear, concise summary.",
      "",
      "CONTEXT",
      "- Meeting title: " + (val("m-title") || "Untitled meeting"),
      "- Level of detail: " + detail,
      "",
      "NOTES",
      '"""',
      notes,
      '"""',
      "",
      "CONSTRAINTS",
      "- Use only information found in the notes. Do not add or assume anything.",
      '- If an owner or a deadline is not stated, write "Not stated".',
      "- Keep the wording neutral and professional.",
      "",
      "OUTPUT FORMAT",
      "1. Summary (" + summaryLen + ")",
      "2. Key points (bullets)",
      "3. Decisions made (bullets)",
      "4. Action items (table with columns: Task | Owner | Deadline)",
      "5. Deadlines to watch (put the dates in bold)",
      "6. Open questions",
    ].join("\n") };
  },

  planner() {
    const tasks = val("p-tasks").split("\n").map((t) => t.trim()).filter(Boolean);
    if (!tasks.length) return { error: "Please list at least one task." };
    const type = val("p-type");
    return { prompt: [
      "ROLE",
      "You are a productivity coach who uses the Eisenhower matrix (urgent versus important).",
      "",
      "TASK",
      "Create a " + type.toLowerCase() + " plan from my task list.",
      "",
      "MY TASKS",
      tasks.map((t, i) => (i + 1) + ". " + t).join("\n"),
      "",
      "CONTEXT",
      "- Working hours available per day: " + (val("p-hours") || "8"),
      "- Fixed commitments or deadlines: " + (val("p-notes") || "None"),
      "",
      "CONSTRAINTS",
      "- Prioritise by urgency and importance, and explain each placement in one short phrase.",
      "- Do not schedule more work than the available hours allow, and leave short breaks.",
      "- If a task has no time estimate, make a reasonable estimate and flag it as an assumption.",
      "",
      "OUTPUT FORMAT",
      "1. Priority table (Task | Urgent? | Important? | Priority 1 to 4 | Estimated time)",
      "2. " + type + " schedule with time blocks",
      "3. Three time optimisation tips specific to these tasks",
      "4. Assumptions I should check",
    ].join("\n") };
  },

  research() {
    const input = val("r-input");
    if (!input) return { error: "Please paste some text or type a topic." };
    const summarise = val("r-mode") === "Summarise text";
    return { prompt: [
      "ROLE",
      "You are a careful research analyst who explains complex ideas simply.",
      "",
      "TASK",
      (summarise ? "Summarise the text below" : "Explain the topic below") + " for a reader who needs a quick understanding.",
      "",
      summarise ? "TEXT" : "TOPIC",
      '"""',
      input,
      '"""',
      "",
      "CONTEXT",
      "- Reader level: " + val("r-level"),
      "- Length: " + val("r-length"),
      "",
      "CONSTRAINTS",
      "- Do not invent statistics, quotes or sources. If you are unsure, say so.",
      "- Separate facts from opinions.",
      "- Use plain language and define any technical term the first time it appears.",
      "",
      "OUTPUT FORMAT",
      "1. Summary",
      "2. Five key insights (bullets)",
      "3. Recommendations or next steps",
      "4. A simple explanation in two sentences",
      "5. What I should verify independently, plus three search terms to use",
    ].join("\n") };
  },
};

// ---------- Toast ----------
const toast = $("#toast");
let toastTimer;
function say(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ---------- Copy ----------
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (err) { ok = false; }
    area.remove();
    return ok;
  }
}

// ---------- Productivity counter ----------
const countEl = $("#count"), savedEl = $("#saved"), perTask = $("#per-task");
let built = 0;
function updateStats() {
  const minutes = Math.max(1, Number(perTask.value) || 0);
  countEl.textContent = built;
  savedEl.textContent = built * minutes;
}
perTask.addEventListener("input", updateStats);

// ---------- Output card ----------
const CHECKS = [
  "I will check names, dates and facts",
  "I have not shared confidential or personal data",
  "I will edit the result so it sounds like me",
];
function showOutput(panel, prompt) {
  const out = $(".out", panel);
  out.innerHTML =
    "<h3>Your engineered prompt</h3>" +
    '<textarea readonly aria-label="Generated prompt"></textarea>' +
    '<div class="btns">' +
    '<button type="button" class="btn primary" data-act="copy">Copy prompt</button>' +
    '<button type="button" class="btn" data-act="chatgpt">Open ChatGPT</button>' +
    '<button type="button" class="btn" data-act="gemini">Open Gemini</button>' +
    "</div>" +
    '<div class="checks"><p>Before you use the AI result</p>' +
    CHECKS.map((c) => '<label><input type="checkbox"> <span>' + c + "</span></label>").join("") +
    '<p class="ok" aria-live="polite"></p></div>';
  $("textarea", out).value = prompt;

  const boxes = out.querySelectorAll(".checks input");
  const ok = $(".ok", out);
  boxes.forEach((b) => b.addEventListener("change", () => {
    ok.textContent = [...boxes].every((x) => x.checked) ? "Good. You are using AI responsibly." : "";
  }));

  out.querySelector('[data-act="copy"]').addEventListener("click", async () => {
    say((await copyText(prompt)) ? "Prompt copied" : "Copy failed. Select the text and copy it.");
  });
  out.querySelector('[data-act="chatgpt"]').addEventListener("click", async () => {
    await copyText(prompt);
    const url = prompt.length < 3000 ? "https://chatgpt.com/?q=" + encodeURIComponent(prompt) : "https://chatgpt.com/";
    window.open(url, "_blank", "noopener");
    say("Prompt copied. Paste it into ChatGPT if it is not filled in.");
  });
  out.querySelector('[data-act="gemini"]').addEventListener("click", async () => {
    await copyText(prompt);
    window.open("https://gemini.google.com/app", "_blank", "noopener");
    say("Prompt copied. Paste it into Gemini.");
  });
}

// ---------- Wire up the four tools ----------
document.querySelectorAll(".panel").forEach((panel) => {
  const tool = panel.dataset.tool;
  const form = $("form", panel);
  $(".out", panel).innerHTML = '<h3>Your engineered prompt</h3><p class="empty">Fill in the form and choose Build prompt. Your prompt appears here.</p>';

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const old = $(".error", form);
    if (old) old.remove();
    const result = builders[tool]();
    if (result.error) {
      const p = document.createElement("p");
      p.className = "error";
      p.setAttribute("role", "alert");
      p.textContent = result.error;
      $(".btns", form).before(p);
      return;
    }
    showOutput(panel, result.prompt);
    built += 1;
    updateStats();
  });
});

// ---------- Tabs (with arrow-key support) ----------
const tabs = [...document.querySelectorAll(".tab")];
function selectTab(tab) {
  tabs.forEach((t) => {
    const on = t === tab;
    t.setAttribute("aria-selected", String(on));
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// ---------- Theme ----------
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.setAttribute("data-theme", saved);
} catch (e) { /* use the system setting */ }
$("#theme-toggle").addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
});

updateStats();
