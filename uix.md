Chemistar E-Laboratory is an AI-driven virtual chemistry lab that allows users to:

*   Drag & drop apparatus onto a 2D workbench.
*   Input chemical properties via a GPT-5-Nano NLP box.
*   Add chemicals to apparatus.
*   Transfer liquids or solids between apparatus.
*   Predict reaction outcomes visually (color change, gas, fire, etc.) via OpenAI API.
*   Measure properties like temperature/pH and export logs.
*   Plot graphs using imported measurement data.
*   Save, open, and resume experiments.

Left Sidebar (collapsible):

*   Chemical Input Box (NLP-powered) → user enters chemical (state, concentration, temperature, etc.)
*   Add To Dropdown → lists apparatus in workspace.

## ⚗️ Core Features to Implement

*   Apparatus system (React state + Konva rendering)
*   NLP input linked to OpenAI API
*   Reaction visualization (simple animations + text output)
*   Volume and transfer tracking
*   Measurement tools with export (xlsx)
*   Graph tab (react-chartjs-2)
*   AI Tutor toggle → shows step explanations using /api/predictReaction
*   Save/Open experiment (simple browser storage)
*   Authentication (Firebase)

## 💾 File/Folder Structure

```
/app
/api
parseChemical.ts
predictReaction.ts
/components
Header.tsx
Sidebar.tsx
ApparatusPanel.tsx
MeasurementPanel.tsx
CalculatorPanel.tsx
WorkspaceCanvas.tsx
ReactionOutput.tsx
/lib
openai.ts
firebase.ts
/types
apparatus.ts
chemical.ts
/store
useWorkspace.ts
```

## ⚙️ Tech Stack

*   Next.js 15
*   React 19
*   TypeScript
*   Tailwind CSS + ShadCN/UI
*   Zustand for global state
*   React Konva for 2D workspace
*   OpenAI API for NLP + reactions
*   Browser storage for save/load
*   Chart.js for graphing
*   xlsx for exports

## 🧩 Key Details Cursor Must Handle

*   Store API key in .env.local as OPENAI_API_KEY
*   Ensure all /api/ routes use process.env.OPENAI_API_KEY
*   Use browser storage for saving JSON-based experiment states
*   Build all components responsive and mobile-friendly
*   Reaction visuals can be simple color animations or changing emojis (🔥💨💧)
*   Measurements tab should simulate values dynamically using random or reaction outputs
*   Graphing tab should accept .xlsx or imported CSV

## ✅ Deliverables

*   Fully functional local web app
*   /api/ routes functional with mock OpenAI responses if no key provided
*   Deployed-ready project structure (can run with npm run dev)
*   Future Documentation in README.md explaining:
    *   How to run locally
    *   How to connect Firebase
    *   How to add API keys
