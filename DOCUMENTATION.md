# Project Documentation: AI-Powered Workplace Productivity Assistant

**Author:** Jenet Gilman | **Programme:** Morning AI Skills Acceleration 23 (ASA 23), CAPACITI

## 1. Problem statement
Professionals spend significant time on repetitive tasks such as drafting emails, summarising information, planning schedules and researching. Many also get weak AI results because they write vague prompts, and some use AI without checking its output.

## 2. Solution overview
The AI Productivity Assistant is a web app with four tools. The user fills in a short form, and the app builds an engineered prompt that follows prompt-writing best practice. The user sends it to an AI tool (ChatGPT or Gemini) with one click and gets a structured, reliable answer. The app also builds in responsible-AI habits: a checklist before using any result.

**Features built (4 of the 5 options in the brief):**

1. Smart Email Generator: tone variations (formal, informal, persuasive) and audience adaptation (client, manager, team, colleague).
2. Meeting Notes Summarizer: summary, key points, decisions, action items and highlighted deadlines.
3. AI Task Planner: daily or weekly plan, prioritised by urgency and importance, with time optimisation tips.
4. AI Research Assistant: summary or plain-language explanation, key insights and recommendations.

## 3. Tools used
| Tool | Purpose |
|---|---|
| Claude | Helped design the app, write the code and draft the prompt templates |
| ChatGPT and Gemini | The AI tools that receive the engineered prompts |
| v0 by Vercel | First experiments with AI-assisted site building |
| HTML, CSS, JavaScript | The app itself |
| GitHub and Vercel | Source code and hosting |

## 4. Prompt engineering approach
Each prompt has five parts:

- **Role:** who the AI should act as (for example, a meeting secretary).
- **Context:** audience, tone and background from the form.
- **Task:** one clear job.
- **Constraints:** length, "do not invent facts", placeholders for missing details.
- **Output format:** the exact structure required, such as an action-item table.

**Testing and refining.** A basic prompt such as "write an email asking for an extension" gives a generic result with no clear structure. The engineered version adds a role, the audience, the tone, key points and a required format (subject line, body, two alternative subject lines). Constraints such as "use a [placeholder] for missing details" stop the AI from making up facts. Compare the two outputs yourself using the prompts in `SAMPLE_OUTPUTS.md`, then adjust the wording to improve accuracy.

## 5. Responsible and ethical AI
- **Limitations:** the app states that AI can be confidently wrong.
- **Validation steps:** every result comes with a three-item checklist (check facts, no confidential data shared, edit to sound personal).
- **Bias:** a visible note explains that AI can repeat stereotypes and must be read critically.
- **Privacy:** the app runs fully in the browser and sends nothing to a server. Users are warned not to paste confidential data into AI tools.
- **Honesty built into prompts:** every prompt tells the AI not to invent facts and to say when it is unsure.

## 6. Productivity improvement and value
- **Faster:** a form fills in the structure that normally takes several attempts to write.
- **More consistent:** the same proven structure is used every time.
- **Measurable:** the built-in tracker shows prompts built and minutes saved. The user enters their own time-saved estimate per task, so the figure reflects real working time.
- **Clearer communication and task visibility:** structured outputs such as prioritised tables and action-item lists make work easier to see and share.
- **Next step:** the real impact should be confirmed through testing with users and collecting their feedback.

## 7. Challenges and how they were addressed
| Challenge | How it was addressed |
|---|---|
| Showing AI inside the app needs an API key and a server | Built a prompt engineer that works in any browser and sends prompts to the AI tool the user already trusts |
| AI can produce wrong or biased output | Added a validation checklist and responsible-AI guidance |
| Users may paste private data | Added clear warnings and kept all processing in the browser |
| Vague input produces vague prompts | Required key fields and used drop-downs for tone, audience and length |
| Incomplete information leads to wrong assumptions | Every prompt tells the AI to use placeholders and flag missing details instead of inventing facts |
| The AI may suggest an unrealistic schedule | The planner asks for working hours, fixed commitments and deadlines, and tells the AI to flag any time estimates it guessed |

## 8. Sample prompts
**Email (persuasive, to a manager):**

> ROLE: You are an experienced business communication specialist. TASK: Write a professional email. CONTEXT: Audience: Manager. Tone: Persuasive. Purpose: Ask for an extension on the Q4 report. Key points: data delay, new date Friday. CONSTRAINTS: About 150 words. Do not invent facts. Use [placeholders] for missing details. OUTPUT FORMAT: Subject line, email body, two alternative subject lines.

**Meeting notes:**

> ROLE: You are a skilled meeting secretary. TASK: Turn the notes below into a concise summary. CONSTRAINTS: Use only information in the notes. Write "Not stated" if an owner or deadline is missing. OUTPUT FORMAT: Summary, key points, decisions, action-item table (Task | Owner | Deadline), deadlines in bold, open questions.

The task planner and research prompts, and example outputs for all four tools, are in [SAMPLE_OUTPUTS.md](SAMPLE_OUTPUTS.md).

## 9. Future improvements
Connect an AI API so answers appear in the app, add a saved prompt library, add the chatbot interface, and integrate with Microsoft Teams or Slack.
