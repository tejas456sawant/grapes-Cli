// Import the component definitions
import componentTypes from "./components.js"; // Adjust the path as needed

// Function to create a generic text component
function createGenericTextComponent(content) {
  return {
    type: "generic-text", // This should correspond to a generic text component if defined later
    attributes: { content },
    content: content, // Use content directly for display or a default value
  };
}

// Function to recursively build the component structure
// Function to recursively build the component structure
// Function to recursively build the component structure
// Function to recursively build the component structure
function buildComponentStructure(editor, componentData) {
  const {
    type,
    attributes = {},
    components = [],
    content = "",
  } = componentData;

  // Log all registered component types in the GrapesJS editor
  const componentManager = editor.DomComponents; // Access the component manager
  const allRegisteredComponents = componentManager.getComponents(); // Get all registered components
  console.log("Registered Components:", allRegisteredComponents);

  // Check if the component type is registered in the editor's components
  const componentModel = componentManager.getType(type); // Try to get the component model by type

  // If the specified component type is not found, use a generic text component
  if (!componentModel) {
    console.warn(`Unknown component type: ${type}. Using a generic component.`);
    return createGenericTextComponent(content || attributes.content || "");
  }

  // If the component type is available, build the structure using it
  const defaultAttributes =
    componentModel.model.prototype.defaults.attributes || {};
  const mergedAttributes = { ...defaultAttributes, ...attributes };

  // Recursively build nested components
  const nestedComponents = components
    .map((nestedComponent) => buildComponentStructure(editor, nestedComponent))
    .filter(Boolean);

  return {
    type, // Keep the specified type
    attributes: mergedAttributes,
    content: content || attributes.content || "Default Content", // Provide a default content if empty
    components: nestedComponents, // Include nested components
  };
}

// Main function to generate the website structure
function generateWebsiteStructure(editor, websiteData) {
  const { themeoptions, components } = websiteData;

  // Apply theme options
  const themeStyles = `
    :root {
      --font-primary: ${themeoptions.fonts.primary};
      --font-secondary: ${themeoptions.fonts.secondary};
      --font-scale: ${themeoptions.fonts.scale};
      --color-primary: ${themeoptions.colors.primary};
      --color-primary-light: ${themeoptions.colors.primaryLight};
      --color-primary-dark: ${themeoptions.colors.primaryDark};
      --color-text-light: ${themeoptions.colors.textLight};
      --color-section-light: ${themeoptions.colors.sectionLight};
      --color-section-accent1: ${themeoptions.colors.sectionAccent1};
      --color-section-accent2: ${themeoptions.colors.sectionAccent2};
      --color-section-dark: ${themeoptions.colors.sectionDark};
      --color-text-primary: ${themeoptions.colors.textPrimary};
      --color-text-secondary: ${themeoptions.colors.textSecondary};
    }
    
  `;

  // Build the component structure, allowing unknown types to be handled
  const websiteStructure = components.map((component) =>
    buildComponentStructure(editor, component)
  );

  return {
    css: themeStyles,
    components: websiteStructure,
  };
}

// Function to load the website structure into GrapeJS
function loadWebsiteStructure(editor, websiteStructure) {
  // Clear existing components
  editor.setComponents([]);

  // Log the generated structure for debugging
  console.log("Generated Website Structure:", websiteStructure);

  // Create a body wrapper component
  const bodyWrapper = {
    type: "body",
    components: websiteStructure.components,
  };

  // Apply CSS styles from websiteStructure
  editor.setStyle(websiteStructure.css);

  // Load the new body wrapper with the website structure inside it
  editor.setComponents(bodyWrapper);
}

// Export functions for use in other files
export { generateWebsiteStructure, loadWebsiteStructure };