import { useSelector } from "react-redux";
import { RootState } from "../../store";
import themesJson from "../../assets/themes.json";

export default function ThemeComponent() {
  const theme = useSelector((state: RootState) => state.theme);
  const styling = themesJson.find((t) => t.name === theme.name)?.styling;
  if (!styling) {
    console.error(`Theme ${theme.name} not found in themes.json`);
    return null;
  }

  return (
    <>
      <style>
        {`
        :root {
            --background-color: ${styling["background-color"]};
            --secondary-color: ${styling["secondary-color"]};
            --input-color: ${styling["input-color"]};
            --text-color: ${styling["text-color"]};
            --border-color: ${styling["border-color"]};
            --highlight-color: ${styling["highlight-color"]};
            --highlight-bgg-color: ${styling["highlight-bgg-color"]};
            --highlight-color-hover: ${styling["highlight-color-hover"]};

            --button-color: ${styling["button-color"]};
            --button-color-hover: ${styling["button-color-hover"]};

            --tab-color: ${styling["tab-color"]};
            --tab-bgg: ${styling["tab-bgg"]};
            --tab-border: ${styling["tab-border"]};
            --tab-active-color: ${styling["tab-active-color"]};
            --tab-active-bgg: ${styling["tab-active-bgg"]};
            --tab-active-border: ${styling["tab-active-border"]};
            --tab-color-hover: ${styling["tab-color-hover"]};
            --tab-bgg-hover: ${styling["tab-bgg-hover"]};

            --chat-msg-user-bgg: ${styling["chat-msg-user-bgg"]};
            --chat-msg-user-color: ${styling["chat-msg-user-color"]};
            --chat-msg-user-small-color: ${styling["chat-msg-user-small-color"]};
            --chat-msg-user-border: ${styling["chat-msg-user-border"]};
            --chat-msg-user-bubble-bgg: ${styling["chat-msg-user-bubble-bgg"]};
            --chat-msg-user-bubble-color: ${styling["chat-msg-user-bubble-color"]};
            --chat-msg-user-bubble-border: ${styling["chat-msg-user-bubble-border"]};

            --chat-msg-assistant-bgg: ${styling["chat-msg-assistant-bgg"]};
            --chat-msg-assistant-color: ${styling["chat-msg-assistant-color"]};
            --chat-msg-assistant-small-color: ${styling["chat-msg-user-small-color"]};
            --chat-msg-assistant-border: ${styling["chat-msg-assistant-border"]};
            --chat-msg-assistant-bubble-bgg: ${styling["chat-msg-assistant-bubble-bgg"]};
            --chat-msg-assistant-bubble-color: ${styling["chat-msg-assistant-bubble-color"]};
            --chat-msg-assistant-bubble-border: ${styling["chat-msg-assistant-bubble-border"]};
        }

        /** Chat Messages Start */
        .chat-msg-user {
            background-color: var(--chat-msg-user-bgg);
            color: var(--chat-msg-user-color);
            border-color: var(--chat-msg-user-border);
        }
        .chat-msg-user .chat-msg-user-small {
            color: var(--chat-msg-user-small-color);
        }
        .chat-msg-user .chat-msg-user-bubble {
            background-color: var(--chat-msg-user-bubble-bgg);
            color: var(--chat-msg-user-bubble-color);
            border-color: var(--chat-msg-user-bubble-border);
        }
            
        .chat-msg-assistant {
            background-color: var(--chat-msg-assistant-bgg);
            color: var(--chat-msg-assistant-color);
            border-color: var(--chat-msg-assistant-border);
        }
        .chat-msg-assistant .chat-msg-assistant-small {
            color: var(--chat-msg-assistant-small-color);
        }
        .chat-msg-assistant .chat-msg-assistant-bubble {
            background-color: var(--chat-msg-assistant-bubble-bgg);
            color: var(--chat-msg-assistant-bubble-color);
            border-color: var(--chat-msg-assistant-bubble-border);
        }

        /* Chat Messages End */

        .hide-y-scrollbar {
            overflow-y: hidden;
        }

        .draggable-region {
            -webkit-app-region: drag;
        }

        .main-bgg {
            background-color: var(--background-color);
        }

        .secondary-bgg {
            background-color: var(--secondary-color);
        }

        .main-color {
            color: var(--text-color);
        }

        .tab {
            border-color: var(--tab-border);
            background-color: var(--tab-bgg);
            color:  var(--tab-color);
        }

        .tab-active {
            border-color: var(--tab-active-border);
            background-color: var(--tab-active-bgg);
            color:  var(--tab-active-color);
        }

        .tab .view-tab-button:hover,
        .tab .close-tab-button:hover {
            background-color: var(--tab-bgg-hover);
            color:  var(--tab-color-hover);
        }

        .button-main {
            background-color: var(--button-color);
            color: var(--text-color);
            cursor: pointer;
        }

        .button-main:hover {
            color: var(--button-color-hover);
        }

        .highlight-color {
            color: var(--highlight-color) !important;
        }

        .highlight-bgg {
            background-color: var(--highlight-bgg-color);
            color: var(--text-color);
        }

        .input-main {
            background-color: var(--input-color);
            color: var(--text-color);
        }

        .border-color {
            border-color: var(--border-color);
        }

    `}
      </style>
    </>
  );
}
