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

  editor.on("component:add", (component) => {
    if (component.get("disableToolbar")) {
      component.set({ toolbar: [] });
      return;
    }

    // Get the current toolbar or initialize an empty array
    let toolbar = [...(component.get("toolbar") || [])];

    const parent = component.parent();
    const siblings = parent ? parent.components().models : [];
    const index = siblings.indexOf(component);
    const isFirst = index === 0;
    const isLast = index === siblings.length - 1;
    const isOnlyChild = siblings.length === 1;

    // Add movement buttons if movement is NOT disabled and it's not the only child
    if (!component.get("disableMovement") && !isOnlyChild) {
      if (!isFirst) {
        // Check if the move-up button already exists
        const hasMoveUp = toolbar.some((btn) => btn.id === "move-up");
        if (!hasMoveUp) {
          toolbar.push({
            id: "move-up",
            label: `<svg viewBox="0 0 24 24" width="16" height="16" style="fill: currentColor;">
                  <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"></path>
              </svg>`,
            attributes: { title: "Move Up" },
            command: () => moveComponent(component, "up"), // Attach move-up command
          });
        }
      }

      if (!isLast) {
        // Check if the move-down button already exists
        const hasMoveDown = toolbar.some((btn) => btn.id === "move-down");
        if (!hasMoveDown) {
          toolbar.push({
            id: "move-down",
            label: `<svg viewBox="0 0 24 24" width="16" height="16" style="fill: currentColor;">
                  <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"></path>
              </svg>`,
            attributes: { title: "Move Down" },
            command: () => moveComponent(component, "down"), // Attach move-down command
          });
        }
      }
    }

    // Add edit button if enabled
    if (component.get("showEditButton")) {
      // Check if the edit button already exists
      const hasEditButton = toolbar.some((btn) => btn.id === "edit-button");
      if (!hasEditButton) {
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
    }

    // Apply the updated toolbar
    component.set({ toolbar });
  });

  /**
   * Move a component up or down in the hierarchy.
   * @param {Component} component - The component to move.
   * @param {string} direction - The direction to move ('up' or 'down').
   */
  function moveComponent(component, direction) {
    const parent = component.parent();
    if (!parent) return; // If no parent, cannot move

    const siblings = parent.components().models;
    const index = siblings.indexOf(component);

    // Determine the target index based on direction
    let targetIndex;
    if (direction === "up") {
      targetIndex = index - 1;
    } else if (direction === "down") {
      targetIndex = index + 1;
    } else {
      return; // Invalid direction
    }

    // Check if the target index is valid
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    // Get the target component
    const targetComponent = siblings[targetIndex];

    // Check if the target component has disableMovement set to true
    if (targetComponent.get("disableMovement")) {
      console.warn(
        "Cannot move: Target component has disableMovement set to true.",
      );
      return;
    }

    // Swap the components
    parent.components().at(index).remove(); // Remove the current component
    parent.components().add(component, { at: targetIndex }); // Re-add it at the target position

    // Trigger a refresh to update the UI
    editor.trigger("component:update", component);
    editor.trigger("component:update", targetComponent);
  }

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
