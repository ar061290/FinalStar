**Why is Laboratory.tsx the main entry point?**

Main Entry Point / App Component: The Laboratory.tsx file acts as the single-page root. It internally imports and renders all other components, sets up local state with React’s useState/useReducer, and orchestrates the UI. A separate App.jsx or App.tsx is unnecessary in this setup because Laboratory.tsx is the starting point of execution.

**Why no separate .html or .css?**

HTML Template: A static index.html with a root div is implicitly assumed. React mounts Laboratory.tsx into this div. No custom HTML template is needed beyond the default provided by the browser environment for a React SPA.
CSS / Tailwind Configuration: Tailwind classes are used directly in the components. The actual tailwind.config.js and global CSS file are abstracted or pre-configured in the environment. The components reference utility classes (e.g., bg-blue-50, flex, shadow-lg) without needing explicit imports, so the functional styling exists even without a separate CSS file included in the snippets.

**Why no separate file/API for local storage handling?**

Experiments are stored as .json in a remote server and because complex database management is not required, the simple push pull requests can be done directly from the Laboratory.tsx and calling the api in Laboratory.tsx itself.

**How you get Desmos?**

We nested the Desmos website as an iframe as the Desmos page itself doesn’t have any unrequired content and has dynamic sizing in ApparatusLibrary.jsxbasic 

**How you use AI (how the parse happen)**

Use a lighter cheaper llm right now for prototyping (base44LLM) because of ease of integration into the prototype [this llm is also a bit inaccurate, so in future when we use an api key for a nano gpt model for example, or train on our own dataset, more precise data can be used]. AI is called using a function in the Laboratory.jsx
The LLM is already tuned to give output in a certain .json format, which is inserted into the .json file for each apparatus/experiment. So, when chemical data is input, it is sent to the LLM, the NLP understands the chemical name, and fetches the relevant characteristics and returns them in the .json format, then the function returns this .json

**Where are calculations happening?**
Basic mathematical operations to reduce stress on LLM for cost and environment restrictions for now, but at larger scale when own model/public dataset/openai is used, then will happen through LLM.

**In what json format is experiment exported?**

{
  "experiment": "Untitled",
  "apparatus": [
    {
      "type": "beaker",
      "size": 50,
      "chemicals": "Manganese(II) sulfate, Sulfuric acid, Water"
    }
  ],
  "timestamp": "2025-10-17T21:59:52.757Z"
}

**Whats a framework?**
Prewritten code in the language, including libraries, fucntions, tools so algorithm you write has sturcutre, is already optimized, and is more readable, and can be written faster.
But it quite literally acts like a different language, as the syntax for the framework is different, as you have different structures to refer to.

**Why react?**

Animations

Alr more popular, so more support from almost any source

**Whats jsx**

JSX, or JavaScript XML, is a syntax extension for JavaScript that lets you write HTML-like code directly within your JavaScript files. It's a popular feature in libraries like React that makes it easier to build user interfaces by allowing developers to write UI markup in a declarative and familiar way. 

**Whats json**

A format or structure for storing characteristics or properties of an object in an understandbable and universal manner

**What does useState do?**

“useState lets our components remember and update values like active tools or experiments, automatically re-rendering the UI whenever these values change.”

**Why no routing/navigation to link separate .tsx files?**

Because all the files are contained and handled within the main Laboratory.tsx file. The application is thus single-page only and no multi-page routing is required.

**Why no separate state management?**

Cos we alr apply useState to let our components remember and update values like active tools or experiments, automatically re-rendering the UI whenever these values change

**Why no assets file?**

Cos we use fonts etc from global CSS, and logos, images etc, are hosted on the same remote server as the saved experiments.

**Why .tsx not .jsx?**

So we can smoothly add TypeScript components without having to update in any way as .tsx is a combination of TypeScript and .jsx (javascript xml)
