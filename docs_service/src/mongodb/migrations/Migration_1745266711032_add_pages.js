import { Migration } from "../migration.js";
import CategoryModel from "../models/category_model.js";
import PageModel from "../models/page_model.js";

const pages = [
    {
      category: "Get Started",
      name: "Installation",
      order: 0,
      content: `# Installation
  
  To get started, install the application on your preferred platform.
  
  ## 🪟 Windows
  1. Download the installer from the official website.
  2. Run the \`.exe\` file and follow the prompts.
  
  ## 🍎 macOS
  \`\`\`bash
  brew install myapp
  \`\`\`
  
  ## 🐧 Linux
  \`\`\`bash
  sudo snap install myapp
  \`\`\`
  
  After installation, open the app using the system launcher or terminal.`
    },
    {
      category: "Get Started",
      name: "Quick Start",
      order: 1,
      content: `# Quick Start
  
  Here's how to get up and running in under 2 minutes:
  
  1. **Open the app**
  2. **Create a new project**
  3. **Start editing files**
  4. **Use the built-in AI assistant for help**
  
  \`\`\`bash
  myapp .
  \`\`\`
  
  > 💡 Tip: Use \`Ctrl+P\` to quickly open files.`
    },
    {
      category: "Get Started",
      name: "Credits",
      order: 2,
      content: `# Credits
  
  This project wouldn't be possible without:
  
  - **OpenAI** for the language models
  - **Monaco Editor** for the core editing experience
  - **Our amazing contributors** ✨
  
  We appreciate all your support and feedback!`
    },
    {
      category: "Get Started",
      name: "Settings",
      order: 3,
      content: `# Settings
  
  Customize the editor to match your workflow.
  
  ## Available Settings
  - Theme: Light or Dark
  - Font Size: 12px–20px
  - Auto Save: On/Off
  
  You can access settings by pressing \`Ctrl + ,\` or via the gear icon.`
    },
    {
      category: "Directories and Files",
      name: "Open Folder",
      order: 0,
      content: `# Open Folder
  
  To open a folder:
  
  1. Click on **File → Open Folder**
  2. Or use the shortcut: \`Ctrl + K Ctrl + O\`
  
  You can drag and drop folders into the editor window too.`
    },
    {
      category: "Directories and Files",
      name: "Read File",
      order: 1,
      content: `# Read File
  
  To read a file's content:
  
  \`\`\`js
  const fs = require('fs');
  const content = fs.readFileSync('path/to/file.txt', 'utf-8');
  console.log(content);
  \`\`\`
  
  Use the built-in file explorer to preview and navigate files.`
    },
    {
      category: "Directories and Files",
      name: "Write File",
      order: 2,
      content: `# Write File
  
  You can write to a file using:
  
  \`\`\`js
  fs.writeFileSync('output.txt', 'Hello World!');
  \`\`\`
  
  Changes are auto-saved if auto-save is enabled.`
    },
    {
      category: "Editor",
      name: "Syntax Highlightning",
      order: 0,
      content: `# Syntax Highlighting
  
  Get colorful code based on language support.
  
  Supported languages include:
  
  - JavaScript
  - Python
  - Rust
  - C++
  - Markdown
  
  Enable highlighting via the bottom status bar or settings.`
    },
    {
      category: "Editor",
      name: "Tabs",
      order: 1,
      content: `# Tabs
  
  Manage multiple files easily.
  
  - Use \`Ctrl + Tab\` to switch between open tabs
  - Right-click on a tab for options (split, close others, etc.)
  - Drag to reorder
  
  > Tabs make multitasking smoother!`
    },
    {
      category: "Editor",
      name: "Save",
      order: 2,
      content: `# Save
  
  Save your work manually or automatically.
  
  ## Manual Save
  - \`Ctrl + S\`
  
  ## Auto Save
  Enable in **Settings → Auto Save**
  
  > ⚠️ Unsaved files will show a ● in the tab title.`
    },
    {
      category: "AI Chat",
      name: "Sessions",
      order: 0,
      content: `# Sessions
  
  Each session represents a separate conversation with the AI.
  
  - Sessions are saved automatically
  - You can rename, delete, and pin sessions
  - Context is preserved during a session
  
  > Think of sessions like browser tabs for your thoughts.`
    },
    {
      category: "AI Chat",
      name: "Write your first message",
      order: 1,
      content: `# Write Your First Message
  
  Just start typing!
  
  Try:
  
  > How do I reverse a string in JavaScript?
  
  You'll get a response with code and explanation.
  
  \`\`\`js
  const reversed = str.split('').reverse().join('');
  \`\`\`
  
  Use the toolbar to regenerate or improve answers.`
    },
    {
      category: "AI Function Calls",
      name: "Search",
      order: 0,
      content: `# Search with AI
  
  Ask the AI to find relevant files, code, or ideas.
  
  Examples:
  
  - \`Search for all functions that modify the user object\`
  - \`Show me all TODO comments in the codebase\`
  
  AI uses context from the entire project.`
    },
    {
      category: "AI Function Calls",
      name: "Read File",
      order: 1,
      content: `# AI File Reader
  
  Let the AI summarize or analyze your code files.
  
  > "Summarize what this file does"
  
  Or ask:
  
  > "Find any unused variables"
  
  The AI reads files using context-aware understanding.`
    },
    {
      category: "AI Function Calls",
      name: "Write File",
      order: 2,
      content: `# Let AI Write Code
  
  You can ask the AI to generate or refactor code:
  
  > "Write a function that sorts an array of objects by age"
  
  After reviewing, click **Apply** to write the result into your file.
  
  > ✏️ You remain in control. Nothing is overwritten automatically.`
    },
    {
      category: "AI Ignore Files",
      name: "Ignore Files",
      order: 0,
      content: `# AI Ignore Files
  
  Exclude files or folders from AI context.
  
  Create a file called \`.aiignore\` in your project:
  
  \`\`\`
  node_modules/
  .env
  *.log
  \`\`\`
  
  Ignored files won't be read, summarized, or suggested by the AI.`
    },
  ];
  

export default class Migration_1745266711032_add_pages extends Migration {
    async up() {
        for (const page of pages) {
            const cat = await CategoryModel.findOne({ name: page.category });
            if (!cat) continue;
            const params = { ...page, category: cat._id };
            await PageModel.create(params);
        }
    }

    async down() {
        for (const page of pages) {
            const cat = await CategoryModel.findOne({ name: page.category });
            if (!cat) continue;
            await PageModel.deleteOne({ name: page.name, category: cat._id });
        }
    }
}
