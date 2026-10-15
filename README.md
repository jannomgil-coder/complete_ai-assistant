# AI-Productivity-Assistant

An AI-powered workplace productivity assistant built for the **Morning AI Skills Acceleration 23 (ASA 23)** project at CAPACITI.

**Live demo:** add your Vercel link here
**Author:** Jenet Gilman ([GitHub](https://github.com/jannomgil-coder))

## The problem
Professionals spend a lot of time on repetitive tasks: drafting emails, summarising meeting notes, planning their day and researching topics. Many people also get poor AI results because they write vague prompts.

## The solution
A simple web app where you fill in a short form and get a **carefully engineered prompt**, ready to send to ChatGPT or Gemini. The app does the prompt engineering so the user gets better, more consistent answers in less time.

## Features
| Tool | What it does |
|---|---|
| Smart Email Generator | Context-based emails with tone (formal, informal, persuasive) and audience (client, manager, team, colleague) |
| Meeting Notes Summarizer | Summary, key points, decisions, action items table and deadlines |
| AI Task Planner | Daily or weekly plan prioritised with the Eisenhower matrix, with time optimisation tips |
| AI Research Assistant | Summary or explanation, key insights, recommendations and what to verify |

Also included:
- **Productivity tracker:** counts prompts built and shows minutes saved, based on the user's own time estimate
- **Responsible AI checklist** on every result, plus a "Use AI responsibly" section
- One-click **Copy prompt**, **Open ChatGPT** and **Open Gemini**
- Responsive layout, light and dark mode, keyboard-accessible tabs

## How the prompts are engineered
Every prompt has five parts: **Role, Context, Task, Constraints, Output format**. Constraints always include "do not invent facts", so the AI flags uncertainty instead of guessing. See [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) for the full approach and [docs/SAMPLE_OUTPUTS.md](docs/SAMPLE_OUTPUTS.md) for examples.

## Responsible and ethical AI
- Reminds users to check facts, names and dates
- Warns against sharing confidential or personal data
- Explains that AI can be biased and must be reviewed by a person
- Does not send any data to a server. Everything runs in the browser

## Run locally
Open `index.html` in a browser. No installation or API key is needed. Keep all files in the same folder.

## Deploy
**Vercel:** Add New Project, import this repository, then Deploy.
**GitHub Pages:** Settings, Pages, deploy from the `main` branch, root folder.

## Project structure
```
index.html              page structure and content
style.css               design, layout, light and dark themes
script.js               prompt templates, tabs, copy, productivity tracker
favicon.svg             browser tab icon
docs/DOCUMENTATION.md   problem, solution, tools, prompts, challenges
docs/SAMPLE_OUTPUTS.md  example prompts and AI outputs
docs/Project_Documentation.pdf  the documentation as PDF (also .docx)
```

## Tech
Plain HTML, CSS and JavaScript. No dependencies, no build step.

## Future improvements
- Connect an AI API so answers appear inside the app
- Save a personal prompt library
- Add the chatbot interface and a Microsoft Teams or Slack integration
