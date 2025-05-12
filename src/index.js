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

  const config = opts.config || {};
  const bname = opts.businessname || {};
  const bdescription = opts.description || {};
  const themeOptions = opts.theme_options || {};
  console.log("config", config);

  loadComponents(editor);

  // Add blocks
  loadBlocks(editor, options);

  // Load i18n files
  editor.I18n &&
    editor.I18n.addMessages({
      en,
      ...options.i18n,
    });

  editor.Commands.add("toggle-dark-mode", {
    run(editor, sender, { add } = {}) {
      const pages = editor.Pages.getAll();

      pages.forEach((page) => {
        const frames = page.get("frames") || [];

        // Iterate through all frames to find the body component
        frames.forEach((frame) => {
          // Check if 'data-dark' property exists on the frame
          if (add == true) {
            // If 'add' is true, set the 'data-dark' property
            if (!frame.dataDark) {
              frame.dataDark = true; // Set it to true if it doesn't exist
              console.log("Added data-dark to frame:", frame);
            }
          } else {
            // If 'add' is false, remove the 'data-dark' property if it exists
            frame.dataDark = false;
          }
        });
      });
      editor.refresh();
    },
  });

  // Register a command to update phone numbers throughout the GrapesJS editor
  editor.Commands.add("update-phone-numbers", {
    run(editor, sender, options = {}) {
      console.log(options);
      // Get the values from options or use defaults
      const defaultPhone = "+91-1234567890";
      const defaultEmail = "xyz@mail.com";
      const defaultAddress = "address";
      const defaultBusinessHours = "";
      const defaultName = "";
      const phoneDigits = options.phoneDigits || defaultPhone;
      const email = options.email || defaultEmail;
      const address = options.address || defaultAddress;
      const businessHours = options.businessHours || defaultBusinessHours;
      const name = options.name || defaultName;
      const brandimg = options.brandimg || "";
      const businessdescription = options.businessdescription || "";

      // Track how many elements we've updated
      let updatedCount = 0;

      // Get all pages
      const pages = editor.Pages.getAll();

      // Process each page
      pages.forEach((page) => {
        const frames = page.get("frames") || [];

        frames.forEach((frame) => {
          const rootComponent = frame.get("component");
          if (rootComponent) {
            // Traverse the component tree and update elements
            traverseAndUpdate(rootComponent);
          }
        });
      });

      /**
       * Recursively traverses component tree and updates elements
       * @param {Object} component - GrapesJS component
       */
      function traverseAndUpdate(component) {
        const classes = component.getClasses ? component.getClasses() : [];

        // Update phone number
        if (classes.includes("phone-number")) {
          component.addAttributes({ href: `tel:${phoneDigits}` });
          component.set({ content: phoneDigits });
          updatedCount++;
        }

        // Update email
        if (classes.includes("email")) {
          component.addAttributes({ href: `mailto:${email}` });
          component.set({ content: email });
          updatedCount++;
        }

        // Update address
        if (classes.includes("address")) {
          component.set({ content: address });
          updatedCount++;
        }

        // Update branding image
        if (classes.includes("brandimg") && brandimg) {
          component.addAttributes({ src: brandimg });
          updatedCount++;
        }

        // Check if component has content property with HTML
        const content = component.get("content");
        if (content && typeof content === "string" && content.includes("<")) {
          // Update any HTML content
          const updatedContent = updateHTMLContent(content);
          if (updatedContent !== content) {
            component.set("content", updatedContent);
            updatedCount++;
          }
        }

        // Recurse through children
        const children = component.components();
        if (children && children.length) {
          children.forEach((child) => traverseAndUpdate(child));
        }
      }

      /**
       * Updates HTML content with new information
       * @param {string} htmlString - HTML content to update
       * @returns {string} - Updated HTML content
       */
      function updateHTMLContent(htmlString) {
        if (!htmlString) return htmlString;

        try {
          // Update phone numbers
          const phoneRegex =
            /<a[^>]*class="[^"]*phone-number[^"]*"[^>]*>.*?<\/a>/g;
          htmlString = htmlString.replace(
            phoneRegex,
            `<a href="tel:${phoneDigits}" class="phone-number ml-3">${phoneDigits}</a>`,
          );

          // Update emails - replace entire <a> tag
          const emailRegex = /<a[^>]*class="[^"]*email[^"]*"[^>]*>.*?<\/a>/g;
          htmlString = htmlString.replace(
            emailRegex,
            `<a href="mailto:${email}" class="email ml-3">${email}</a>`,
          );

          // Update addresses
          const addressRegex =
            /<[^>]*class="[^"]*address[^"]*"[^>]*>(.*?)<\/[^>]*>/g;
          htmlString = htmlString.replace(
            addressRegex,
            `<span class="address">${address}</span>`,
          );

          // Update branding images
          if (brandimg) {
            const brandRegex = /<img[^>]*class="[^"]*brandimg[^"]*"[^>]*>/g;
            htmlString = htmlString.replace(
              brandRegex,
              `<img src="${brandimg}" class="brandimg block h-9 w-auto sm:h-8" alt="${name}"/>`,
            );
          }

          // Update business hours, name, and other content
          if (businessHours) {
            const hoursRegex =
              /<[^>]*class="[^"]*business-hours[^"]*"[^>]*>(.*?)<\/[^>]*>/g;
            htmlString = htmlString.replace(
              hoursRegex,
              `<span class="business-hours"> Open ${businessHours}</span>`,
            );
          }

          if (name) {
            const nameRegex =
              /<[^>]*class="[^"]*business-name[^"]*"[^>]*>(.*?)<\/[^>]*>/g;
            htmlString = htmlString.replace(
              nameRegex,
              `<span class="business-name">${name}</span>`,
            );
          }

          if (businessdescription) {
            const descRegex =
              /<[^>]*class="[^"]*business-description[^"]*"[^>]*>(.*?)<\/[^>]*>/g;
            htmlString = htmlString.replace(
              descRegex,
              `<p class="business-description">${businessdescription}</p>`,
            );
          }

          return htmlString;
        } catch (err) {
          console.error("Error updating HTML content:", err);
          return htmlString; // Return original if something fails
        }
      }

      return updatedCount;
    },
  });

  editor.on("component:add", (component) => {
    if (component.get("disableToolbar")) {
      component.set({ toolbar: [] });
      return;
    }
    // editor.runCommand("update-phone-numbers", {
    //   phoneDigits: config.contact_phone,
    //   email: config.business_email,
    //   businessHours: config.business_hours,
    //   address: config.company_address,
    //   name: bname,
    //   brandimg: config.logo,
    //   businessdescription: bdescription,
    // });

    // Get the current toolbar or initialize an empty array
    let toolbar = [...(component.get("toolbar") || [])];

    const isOnlyChild = true;

    const parent = component.parent();
    // if (parent) {
    //   const siblings = parent.components().models;
    //   const index = siblings.indexOf(component);
    //   const isFirst = index === 0;
    //   const isLast = index === siblings.length - 1;
    //   const isOnlyChild = siblings.length === 1;
    // } else {
    //   // Handle the case where there's no parent (e.g., root-level component)
    //   const isFirst = true; // or false depending on the desired behavior
    //   const isLast = true; // or false
    //   const isOnlyChild = true; // or false
    // }

    // Add movement buttons if movement is NOT disabled and it's not the only child
    if (!component.get("disableMovement")) {
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
    editor.refresh();
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

  const initAOS = (editor) => {
    const frameEl = editor.Canvas.getFrameEl();

    if (!frameEl) {
      console.error("Canvas frame not found.");
      return;
    }

    const frameDoc = frameEl.contentDocument;
    const frameWin = frameEl.contentWindow;

    const loadAOS = () => {
      // Add CSS
      const link = frameDoc.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css";
      link.referrerPolicy = "no-referrer";
      frameDoc.head.appendChild(link);

      // Add Script
      const script = frameDoc.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js";
      script.referrerPolicy = "no-referrer";

      script.onload = () => {
        console.log("AOS loaded");
        frameWin.AOS.init({
          once: true,
          duration: 600,
          easing: "ease-in-out",
          offset: 100,
          disable: frameWin.innerWidth < 768,
        });

        // Refresh function inside onload to avoid ReferenceError
        const refreshAOS = () => {
          if (frameWin.AOS) {
            frameWin.AOS.refresh();
            frameWin.dispatchEvent(new Event("scroll"));
          }
        };

        // Hook events that should refresh AOS
        editor.on(
          "component:add component:update component:remove canvas:drop",
          refreshAOS,
        );
        editor.on("canvas:resize", refreshAOS);
      };

      frameDoc.body.appendChild(script);
    };

    if (frameDoc.readyState === "complete") {
      loadAOS();
    } else {
      frameEl.onload = loadAOS;
    }
  };

  editor.on("load", () => {
    editor.RichTextEditor.get("wrap").result = (rte) => {
      const sel = rte.selection();
      sel && rte.insertHTML(`<span class="highlight">${sel}</span>`);
    };
  });

  // Hook into editor load
  editor.on("load", () => {
    setTimeout(() => initAOS(editor), 500); // Wait a bit for iframe
  });
};
