import { Migration } from "../migration.js";
import CategoryModel from "../models/category_model.js";
import PageModel from "../models/page_model.js";

const pages = [
  {
    name: "Installation",
    content: `# Installation
  
  To get started, install the application on your preferred platform.
  Find the latest version on our [GitHub Releases](https://github.com/niiicolai/ai-editor/releases).
  
  We support:
  - **Windows**
  - **macOS**
  - **Linux**
  `,
  },
  {
    name: "Quick Start",
    content: `# Quick Start

  ## Prerequisites:
  - Ensure you have installed the app.
  - You must have credits to use the AI features.
  - You need an account on our platform to access AI features.
  
  ## AI Assistant Modes

  Use Ask Mode to interact with the AI:
  1. **Open the app**
  2. **Create a new directory on your PC called 'editor-quick-start'**
  3. **Add a test file name 'hello-world.js' with the content: \`console.log('hello World')\`**
  4. **Open the built-in AI assistant and switch to ask mode**
  5. **Ask the AI: what type of file is hello-world.js?**

  Use Agent Mode to interact give the AI access to your files:
  1. **Open the app**
  2. **Create a new directory on your PC called 'editor-quick-start'**
  3. **Add a test file name 'hello-world.js' with the content: \`console.log('hello World')\`**
  4. **Open the built-in AI assistant and switch to agent mode**
  5. **Ask the AI to read the file: "Read hello-world.js"**

  ## AI Assistant LLM Models
  - Find prices and models on our [pricing page](/models).
  - You can switch models in the chat.
  
  ## Tips
  - Use \`Ctrl + P\` to quickly open files.
  - Use \`Ctrl + S\` to save changes.
  `,
  },
  {
    name: "Credits",
    content: `# Credits
  
  This project wouldn't be possible without:
  
  - **Monaco Editor** for the core editing experience
  - **Our amazing contributors** ✨
  
  We appreciate all your support and feedback!`,
  },
  {
    name: "Settings",
    content: `# Settings
  
  Customize the editor to match your workflow.
  
  ## Themes
  You can change the theme by going to:
  **View → Themes** or clicking the name of the current theme in the footer.
  
  ## Keybindings
  You can find all keybindings by going to:
  **View → Shortcuts**.

  ## Tab Size
  You can change the tab size by clicking the tab size in the footer.

  ## Language Mode
  You can change the language mode by clicking the language mode in the footer.

  ## RAG Settings
  You can change the RAG settings by going to:
  **View → RAG Settings**.
  `,
  },
  {
    name: "Open Folder",
    content: `# Open Folder
  
  To open a folder:
  
  1. Click on **File → Open Folder**
  2. Or use the shortcut: \`Ctrl + p\``,
  },
  {
    name: "Read File",
    content: `# Read File
  
  Use the built-in file explorer to preview and navigate files.
  
  To open a single file:
  1. Click on **File → Open File**
  2. Or use the shortcut: \`Ctrl + o\` 
  `,
  },
  {
    name: "Write File",
    content: `# Write File
  
  To create a new file:
  1. Click on **File → New File**
  2. Or use the shortcut: \`Ctrl + n\`

  To create a new file in a specific folder:
  1. Right-click on the folder in the file explorer
  2. Select **Add File**
  `,
  },
  {
    name: "Syntax Highlightning",
    content: `# Syntax Highlighting
  
  Get colorful code based on language support.
  The editor supports many languages out of the box and automatically detects the language based on file extension.
  You can change the language mode by clicking the language mode in the footer.
  `,
  },
  {
    name: "Tabs",
    content: `# Tabs
  
  Open multiple files in tabs.
  Simple click on a file in the file explorer to open it in a new tab.
  You can see unsaved files with a ● in the tab title.
  This means you can safetly switch between files without losing changes.
  You can close tabs by clicking the X on the tab or using the shortcut \`Ctrl + e\`.
  
  You can also right-click on a tab to see more options like:
  - Close Tab
  - Rename (if a file is saved)
  - Move to trash (if a file is saved)
  `,
  },
  {
    name: "Save",
    content: `# Save
  
  Work is only saved manually.
  
  To save a file:
  - Click on **File → Save** or **File → Save As**
  - Use the shortcut: \`Ctrl + s\` (If the file is new, save-as will be used)
  
  > Unsaved files will show a ● in the tab title.`,
  },
  {
    name: "Sessions",
    content: `# Sessions
  
  Each session represents a separate conversation with the AI.
  
  - Sessions are saved automatically
  - Sessions are automatically named based on the first message
  - Context is preserved during a session
  
  > Think of sessions like browser tabs for your thoughts.`,
  },
  {
    name: "Write your first message",
    content: `# Write Your First Message
  
  Just start typing!
  
  Try:
  
  > How do I reverse a string in JavaScript?
  
  You'll get a response with code and explanation.
  
  \`\`\`js
  const reversed = str.split('').reverse().join('');
  \`\`\`
  
   ## AI Assistant Modes

  Use Ask Mode to interact with the AI:
  1. **Open the app**
  2. **Create a new directory on your PC called 'editor-quick-start'**
  3. **Add a test file name 'hello-world.js' with the content: \`console.log('hello World')\`**
  4. **Open the built-in AI assistant and switch to ask mode**
  5. **Ask the AI: what type of file is hello-world.js?**

  Use Agent Mode to interact give the AI access to your files:
  1. **Open the app**
  2. **Create a new directory on your PC called 'editor-quick-start'**
  3. **Add a test file name 'hello-world.js' with the content: \`console.log('hello World')\`**
  4. **Open the built-in AI assistant and switch to agent mode**
  5. **Ask the AI to read the file: "Read hello-world.js"**

  ## AI Assistant LLM Models
  - Find prices and models on our [pricing page](/models).
  - You can switch models in the chat.
  `,
  },
  {
    name: "Read File",
    content: `# AI File Reader
  
  Use Agent Mode to interact give the AI access to your files:
  1. **Open the app**
  2. **Create a new directory on your PC called 'editor-quick-start'**
  3. **Add a test file name 'hello-world.js' with the content: \`console.log('hello World')\`**
  4. **Open the built-in AI assistant and switch to agent mode**
  5. **Ask the AI to read the file: "Read hello-world.js"**
  `,
  },
  {
    name: "Ignore Files",
    content: `# AI Ignore Files
  
  Exclude files or folders from AI context.

  How to ignore files:
  - Create a file called \`.palm_ignore_ai\` in the root your project.
  - You can also right-click in the file explorer and select **Add AI Ignore File**.
  - You can add the name of files you want to ignore, one per line.
  
  Example content for \`.palm_ignore_ai\`:
  \`\`\`
  package-lock.json
  \`\`\`
  
  Ignored files won't be read, summarized, or suggested by the AI.`,
  },
];

const newPages = [
  {
    category: "AI Function Calls",
    name: "List Directories",
    order: 2,
    content: `# List Directories

    Use the AI to list directories in your project.
    The AI can combine the list directories with other tasks, such as reading files or summarizing code.

    > "List all directories in my project"
    > The AI will respond with a list of directories in your project.

    Or you can ask the AI to find a specific type of file:
    > "Find the project's CSS files"
    > The AI will respond with a list of CSS files in your project.
    `,
  },
];

const pageForDeletion = ["Search", "Write File"];

export default class Migration_1749331724667_update_pages extends Migration {
  async up() {
    for (const page of pages) {
      const existingPage = await PageModel.findOne({
        name: page.name,
      });
      if (!existingPage) {
        console.warn(
          `Page "${page.name}" does not exist, creating it with content.`
        );
        return;
      }
      existingPage.content = page.content;
      await existingPage.save();
    }
    for (const pageName of pageForDeletion) {
      await PageModel.deleteOne({ name: pageName });
    }
    for (const page of newPages) {
      const cat = await CategoryModel.findOne({ name: page.category });
      if (!cat) continue;
      const params = { ...page, category: cat._id };
      await PageModel.create(params);
    }
  }

  async down() {
    for (const page of newPages) {
      const cat = await CategoryModel.findOne({ name: page.category });
      if (!cat) continue;
      await PageModel.deleteOne({ name: page.name, category: cat._id });
    }
  }
}
