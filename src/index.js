import loadComponents from "./components"; // Import your components definition
import loadBlocks from "./blocks"; // Assuming you have blocks to load
import en from "./locale/en";

export default (editor, opts = {}) => {
  const options = {
    i18n: {},
    ...opts,
  };
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const link = document.createElement("link");
    link.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }

  loadComponents(editor);

  console.log("Available components:", editor.DomComponents.componentTypes);

  // Add blocks
  loadBlocks(editor, options);

  // Load i18n files
  editor.I18n &&
    editor.I18n.addMessages({
      en,
      ...options.i18n,
    });

  console.log("Components and blocks loaded");

  editor.Commands.add("update-theme-options", {
    run(editor, sender, { themeoptions }) {
      console.log(themeoptions);
      // Function to update CSS variables
      const updateCSSVariables = (options) => {
        console.log("THEME1");
        const rootStyle = document.documentElement;

        // Update font variables
        rootStyle.style.setProperty("--font-primary", options.fonts.primary);
        rootStyle.style.setProperty(
          "--font-secondary",
          options.fonts.secondary,
        );
        rootStyle.style.setProperty("--font-scale", options.fonts.scale);

        // Update color variables
        // rootStyle.style.setProperty("--color-primary", options.colors.primary);
        // rootStyle.style.setProperty(
        //   "--color-primary-light",
        //   options.colors.primaryLight
        // );
        // rootStyle.style.setProperty(
        //   "--color-primary-dark",
        //   options.colors.primaryDark
        // );
        // rootStyle.style.setProperty(
        //   "--color-text-light",
        //   options.colors.textLight
        // );
        // rootStyle.style.setProperty(
        //   "--color-section-light",
        //   options.colors.sectionLight
        // );
        // rootStyle.style.setProperty(
        //   "--color-section-accent1",
        //   options.colors.sectionAccent1
        // );
        // rootStyle.style.setProperty(
        //   "--color-section-accent2",
        //   options.colors.sectionAccent2
        // );
        // rootStyle.style.setProperty(
        //   "--color-section-dark",
        //   options.colors.sectionDark
        // );
        // rootStyle.style.setProperty(
        //   "--color-text-primary",
        //   options.colors.textPrimary
        // );
        // rootStyle.style.setProperty(
        //   "--color-text-secondary",
        //   options.colors.textSecondary
        // );
      };

      // Update CSS variables
      updateCSSVariables(themeoptions);

      // Optional: Trigger a re-render or update in the editor
      editor.refresh();
    },
  });

  // Add the Edit button to the toolbar when a component with the flag is selected
  editor.on("component:add", (component) => {
    if (component.get("disableToolbar")) {
      component.set({ toolbar: [] });
      return;
    }

    let toolbar = [...(component.get("toolbar") || [])];

    // Keep only the last button (if any exist)
    toolbar = toolbar.length > 0 ? [toolbar[toolbar.length - 1]] : [];

    const parent = component.parent();
    const siblings = parent ? parent.components().models : [];
    const index = siblings.indexOf(component);
    const isFirst = index === 0;
    const isLast = index === siblings.length - 1;
    const isOnlyChild = siblings.length === 1;

    // Add movement buttons if allowed and it's not the only child
    if (component.get("movement") && !isOnlyChild) {
      if (!isFirst) {
        console.log("first child" + component.get("type"));
        toolbar.push({
          id: "move-up",
          label: `<svg viewBox="0 0 24 24" width="16" height="16" style="fill: currentColor;">
                <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
            </svg>`,
          attributes: { title: "Move Up" },
        });
      }

      if (!isLast) {
        console.log("last child" + component.get("type"));
        toolbar.push({
          id: "move-down",
          label: `<svg viewBox="0 0 24 24" width="16" height="16" style="fill: currentColor;">
                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
            </svg>`,
          attributes: { title: "Move Down" },
        });
      }
    }

    // Add edit button if enabled
    if (component.get("showEditButton")) {
      toolbar.push({
        id: "edit-button",
        label: `
          <svg viewBox="0 0 24 24" width="16" height="16" style="fill: currentColor;">
            <path fill="currentColor" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z"></path>
          </svg>
        `,
        command: "edit-component",
        attributes: { title: "Edit Component" },
      });
    }

    component.set({ toolbar }); // Apply the updated toolbar
  });

  // Define the command for the Edit button
  editor.Commands.add("edit-component", {
    run(editor, sender) {
      const selectedComponent = editor.getSelected();
      if (selectedComponent) {
        const componentView = selectedComponent.view;

        if (
          componentView &&
          typeof componentView.onEditButtonClick === "function"
        ) {
          console.log("Edit button clicked");
          componentView.onEditButtonClick(); // Call method when clicked
        } else {
          console.warn("onEditButtonClick method not found on component view");
        }
      }
    },
  });
};
