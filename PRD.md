# 🧪 Product Requirements Document (PRD)

**Product**: Chemistar E-Laboratory
**Version**: 1.0
**Date**: October 2025
**Owner**: Chemistar EdTech Division
**Prepared by**: Product Strategy Team

## 1. Product Overview

Chemistar E-Laboratory is an AI-powered virtual chemistry lab designed to democratize access to experimentation. It enables students, teachers, and independent learners to perform and visualize chemistry experiments in a safe, interactive, and realistic digital environment.

Users can:

*   Add apparatus to a 2D workspace.
*   Define chemicals using natural language.
*   Mix, heat, or transfer substances.
*   View AI-predicted reactions dynamically.
*   Measure, log, and graph experimental data.

Chemistar bridges the gap between theory and practice, especially in rural or resource-limited schools, where access to real laboratories is scarce.

## 2. Objectives

| Objective    | Description                                                     |
| :----------- | :-------------------------------------------------------------- |
| Accessibility| Provide a virtual lab accessible via browser or phone.          |
| Engagement   | Make chemistry interactive and exploratory.                     |
| Education    | Teach both guided and open-ended experimentation.               |
| Safety       | Simulate realistic chemical behavior with no physical risk.     |
| Data Analysis| Enable measurement logging, graphing, and calculations.         |

## 3. Target Users

*   **Primary**: Secondary & higher secondary students (ages 13–18)
*   **Secondary**: Teachers, independent learners, science clubs, and rural educators
*   **Tertiary**: EdTech institutions integrating remote lab capability

## 4. Key Features

### 🧫 Realistic 2D Lab Environment

*   Drag & drop apparatus; move left-right on tabletop (no rotation).
*   Gravity-based placement to mimic physical lab surfaces.

### ⚗️ AI-Powered Chemical Reactions

*   NLP-based chemical recognition (via GPT-5-Nano).
*   Predicts visual and physical outcomes:
    *   Color change, gas evolution, heat/fire, precipitation, explosion, etc.
*   Computes reaction moles, products, and volume changes.

### 📋 Chemical Property Input System

*   Input box with support for:
    *   State, concentration, temperature, gas pressure, physical form, etc.
*   Drop-down for apparatus selection (“Add to” section lists all items in workspace).

### 🧮 Measurement & Analysis

*   pH, temperature, conductivity measurement tools.
*   Export all readings to `.xlsx`.
*   Built-in Desmos-style graphing calculator (can import measurement logs).

### 💾 Experiment Management

*   Save experiments (workspace, apparatus, logs).
*   Load previous sessions.
*   New experiment resets workspace.
*   Zoom controls for better detail.

### 🧠 AI Tutor Mode

*   Optional guided explanation of each reaction step.
*   Educational commentary on why changes occur.

## 5. User Workflows

### 5.1. Experiment Creation Workflow

**Goal**: Start and run a new experiment.

| Step | Action                                             | System Response                                                      |
| :--- | :------------------------------------------------- | :------------------------------------------------------------------- |
| 1    | User clicks New Experiment                         | Workspace resets; empty tabletop loads.                              |
| 2    | User opens Apparatus Tab                           | Apparatus list appears with dropdowns for size/type.                 |
| 3    | User drags a beaker (e.g., 100 ml) to workspace    | Beaker placed on tabletop; labeled “Beaker A.”                       |
| 4    | User types in NLP box: “CuSO₄ aqueous 2M 20ml 25°C”| GPT-5-Nano parses input; displays recognized chemical and properties.|
| 5    | In “Add To” dropdown, selects “Beaker A”           | Chemical added; blue liquid appears in beaker.                       |
| 6    | User adds another chemical, e.g., “HCl 1M 10ml” to “Beaker B.”| Second apparatus and chemical added.                                 |
| 7    | User drags Beaker B above Beaker A to simulate pouring.| Transfer animation; AI predicts color/light change or reaction outcome.|
| 8    | User selects measurement tab → taps Beaker A       | Displays temperature, pH, etc.                                       |
| 9    | User exports data as .xlsx, graphs it in calculator tab.| Graph plotted.                                                       |
| 10   | User clicks Save Experiment                        | JSON experiment file saved to cloud or device.                       |

### 5.2. Measurement Workflow

| Step | Action                                      | System Behavior                                                                |
| :--- | :------------------------------------------ | :----------------------------------------------------------------------------- |
| 1    | User opens Measurements Tab                 | pH, temperature, conductivity options shown.                                   |
| 2    | User clicks “Temperature” → taps apparatus  | Displays “24°C” dynamically (AI adjusts if exothermic reaction occurs).        |
| 3    | User logs measurement                       | Stored in local dataset for export.                                            |

### 5.3. Chemical Transfer Workflow

| Step | Action                                          | System Behavior                                                                                                                                  |
| :--- | :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | User drags Beaker B over Beaker A               | Transfer dialogue appears.                                                                                                                       |
| 2    | User inputs transfer amount (e.g., 10 ml).      | Volume updates automatically in both apparatus.                                                                                                  |
| 3    | AI predicts and animates reaction.              | Displays color change, effervescence, and outputs text summary (“Effervescence observed; faint white fumes of HCl gas”).                         |

### 5.4. AI Tutor Mode Workflow

| Step | Action                                          | System Behavior                                                                                                                                  |
| :--- | :---------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | User toggles “AI Tutor” in header               | Side panel opens with explanations.                                                                                                              |
| 2    | User performs a reaction                        | AI generates step-by-step explanation (“Copper(II) sulfate reacts with zinc to form copper metal and zinc sulfate; color changes from blue to colorless”).|

## 6. Functional Requirements

| Category         | Requirement                                           | Priority    |
| :--------------- | :---------------------------------------------------- | :---------- |
| Core Simulation  | Apparatus placement and labeling (2D only)            | Must-have   |
|                  | Chemical property input via NLP                       | Must-have   |
|                  | AI reaction prediction & visualization                | Must-have   |
|                  | Chemical transfer & volume tracking                   | Must-have   |
|                  | Measurement tools (pH, temp, etc.)                    | Must-have   |
| UI/UX            | Split-screen adjustable layout                        | Must-have   |
|                  | Save, Load, Zoom controls                             | Must-have   |
|                  | Desmos-style graphing calculator                      | Should-have |
| AI Logic         | GPT-5-Nano for NLP parsing                            | Must-have   |
|                  | Reaction prediction engine using chemistry dataset    | Must-have   |
|                  | Tutor mode with GPT-5 reasoning                       | Should-have |
| Data Export      | logs as .xlsx                                         | Must-have   |
|                  | Cloud sync via user account                           | Should-have |
| Security         | User authentication & sandboxing                      | Must-have   |

## 7. Design Specifications

### 7.1. Layout

*   **Header (Top Bar)**:
    *   Buttons: New, Open, Save, Zoom In, Zoom Out, AI Tutor ON/OFF
    *   Center title: “Chemistar E-Laboratory”
    *   Right: User profile / logout
*   **Left Sidebar**:
    *   Tabs: Apparatus | Measurements | Calculator
    *   Top: NLP Input Box
    *   Placeholder: “Enter chemical details (e.g., NaOH, 2M, aqueous, 30°C)”
    *   “Add To” dropdown → lists apparatus in workspace
    *   Each apparatus entry displays name, size, and contents
*   **Right Panel (Workspace)**:
    *   2D top-down bench view
    *   Drag-and-drop for apparatus
    *   Simple shadow-based depth for realism
    *   Labels editable (e.g., “Beaker A”)
*   **Measurement & Graph Panels**:
    *   Floating data log window
    *   Graph interface (line, scatter, bar)
    *   Export/Import buttons

## 8. Tech Stack

| Layer         | Technology                     | Purpose                                        |
| :------------ | :----------------------------- | :--------------------------------------------- |
| Frontend      | React.js + TypeScript          | Core UI framework                              |
|               | Tailwind CSS                   | Styling and responsiveness                     |
|               | HTML5 Canvas                   | Apparatus and workspace rendering              |
|               | Framer Motion                  | Smooth drag-drop animations                    |
| Backend       | Node.js (Express) or FastAPI (Python)| API and simulation logic                       |
|               | MongoDB / Firebase             | Experiment data storage                        |
|               | WebSocket (Socket.IO)          | Real-time workspace sync (for multi-user mode) |
| AI Layer      | GPT-5-Nano                     | NLP parsing of chemical inputs                 |
|               | Chemistry Engine (custom Python)| Reaction prediction, stoichiometry, visualization mapping|
|               | LangChain wrapper              | Interconnect GPT-5-Nano with chemistry dataset |
| Data Handling | Pandas / XLSX writer           | Export measurements                            |
|               | Desmos API / Chart.js          | Graph plotting                                 |
| Hosting       | Vercel / AWS Amplify           | Frontend deployment                            |
|               | AWS Lambda / Google Cloud Functions| AI + backend hosting                           |
| Security      | Firebase Auth / OAuth2         | User login, sandbox isolation                  |

## 9. Non-Functional Requirements

| Category        | Specification                                   |
| :-------------- | :---------------------------------------------- |
| Performance     | Must load under 5s; reaction predictions < 2s latency|
| Scalability     | Support up to 10k concurrent sessions           |
| Accessibility   | WCAG 2.1 AA compliance                          |
| Device Support  | Chrome, Edge, Safari, Android, iOS              |
| Localization    | English (v1), multilingual later                |

## 10. Success Metrics

| Metric                      | Target               |
| :-------------------------- | :------------------- |
| Avg. experiment completion time| < 10 min             |
| User satisfaction (feedback form)| > 85% positive       |
| Active weekly users         | 10k in 3 months      |
| Avg. session length         | > 15 minutes         |
| School adoption rate        | 50 schools in pilot phase|

## 11. Future Enhancements

*   3D workspace (with rotational apparatus)
*   Voice command support for chemical addition
*   AR/VR integration for immersive education
*   AI chemistry assistant for lab report generation
*   Collaborative multi-user experiment mode.

