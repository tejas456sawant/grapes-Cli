import loadComponents from "./components"; // Import your components definition
import loadBlocks from "./blocks"; // Assuming you have blocks to load
import en from "./locale/en";

export default (editor, opts = {}) => {
  const options = {
    i18n: {},
    ...opts,
  };

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

  // Register a command to update phone numbers throughout the GrapesJS editor
  editor.Commands.add("update-phone-numbers", {
    run(editor, sender, options = {}) {
      // Get the values from options or use defaults
      const defaultPhone = "+91-1234567890";
      const defaultEmail = "xyz@mail.com";
      const defaultAddress = "address";
      const defaultBusinessHours = "";
      const defaultName = "";
      const phoneDigits = options?.contact_phone || defaultPhone;
      const email = options?.business_email || defaultEmail;
      const address = options?.company_address || defaultAddress;
      const businessHours = options?.business_hours || defaultBusinessHours;
      const name = options?.business_name || defaultName;
      const brandimg = options?.brandimg || "";
      const businessdescription = options?.business_description || "";
  
      // Social media links from options
      const socialLinks = {
        facebook_url: options?.facebook_url || "",
        instagram_url: options?.instagram_url || "",
        twitter_url: options?.twitter_url || "",
        youtube_url: options?.youtube_url || "",
        linkedin_url: options?.linkedin_url || ""
      };
  
      // Check if all social links are empty
      const allSocialLinksEmpty = Object.values(socialLinks).every(link => !link.trim());
  
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
       * Generates social media icons HTML based on provided links
       * @returns {string} - HTML string for social icons
       */
      function generateSocialIconsHTML() {
        if (allSocialLinksEmpty) {
          return ""; // Return empty string if no social links
        }
  
        const iconSVGs = {
          facebook_url: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 fb-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>`,
          instagram_url: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 insta-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>`,
          twitter_url: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 x-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>`,
          youtube_url: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 yt-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>`,
          linkedin_url: `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 linkedin-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>`
        };
  
        const icons = [];
        
        // Generate icons only for platforms with links
        Object.entries(socialLinks).forEach(([platform, link]) => {
          console.log("Social Media", link, platform)
          if (link && link.trim()) {
            const idMap = {
              facebook_url: 'fb-icon',
              instagram_url: 'insta-icon',
              twitter_url: 'x-icon',
              youtube_url: 'yt-icon',
              linkedin_url: 'linkedin-icon'
            };
            console.log("Social Media", link, platform)
            icons.push(`
              <a id="${idMap[platform]}" href="${link}" class="flex h-8 w-8 items-center justify-center rounded-full border hover:text-[var(--color-primary)]" target="_blank" rel="noopener noreferrer">
                ${iconSVGs[platform]}
              </a>
            `);
          }
        });
  
        return icons.length > 0 ? `<div class="mt-6 flex space-x-4">${icons.join('')}</div>` : '';
      }
  
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
  
        // Update social links
        if (classes.includes("social-links")) {
          const socialIconsHTML = generateSocialIconsHTML();
          component.set({ content: socialIconsHTML });
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
          console.log("phone-number found");
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
  
          // Update social links containers
          const socialLinksRegex = /<div[^>]*class="[^"]*social-links[^"]*"[^>]*>(.*?)<\/div>/gs;
          const socialIconsHTML = generateSocialIconsHTML();
          
          // Replace social-links div content
          htmlString = htmlString.replace(socialLinksRegex, (match) => {
            // Extract existing classes from the matched div
            const classMatch = match.match(/class="([^"]*)"/);
            let existingClasses = classMatch ? classMatch[1] : 'social-links';
            
            // Ensure social-links class is present
            if (!existingClasses.includes('social-links')) {
              existingClasses += ' social-links';
            }
            
            return `<div class="${existingClasses}">${socialIconsHTML}</div>`;
          });
  
          // Handle icon-container visibility based on whether icons exist
          const iconContainerRegex = /<div([^>]*class="[^"]*icon-container[^"]*"[^>]*)>/g;
          htmlString = htmlString.replace(iconContainerRegex, (match, attributes) => {
            console.log("GJKL", socialLinks)
            let updatedAttributes = attributes;
            
            if (allSocialLinksEmpty) {
              // Add hidden class if not present
              if (!updatedAttributes.includes('hidden')) {
                const classMatch = updatedAttributes.match(/class="([^"]*)"/);
                if (classMatch) {
                  const existingClasses = classMatch[1];
                  const newClasses = existingClasses.includes('hidden') 
                    ? existingClasses 
                    : `${existingClasses} hidden`.trim();
                  updatedAttributes = updatedAttributes.replace(/class="[^"]*"/, `class="${newClasses}"`);
                } else {
                  updatedAttributes += ' class="hidden"';
                }
              }
            } else {
              // Remove hidden class if present
              const classMatch = updatedAttributes.match(/class="([^"]*)"/);
              if (classMatch) {
                const existingClasses = classMatch[1];
                const newClasses = existingClasses
                  .split(' ')
                  .filter(cls => cls !== 'hidden')
                  .join(' ')
                  .trim();
                if (newClasses) {
                  updatedAttributes = updatedAttributes.replace(/class="[^"]*"/, `class="${newClasses}"`);
                } else {
                  updatedAttributes = updatedAttributes.replace(/\s*class="[^"]*"/, '');
                }
              }
            }
            
            return `<div${updatedAttributes}>`;
          });
  
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
  
      // Log whether all social links are empty for debugging
      console.log("All social links empty:", allSocialLinksEmpty);
  
      return updatedCount;
    },
  });

  editor.on("component:add", (component) => {
    if (component.get("disableToolbar")) {
      component.set({ toolbar: [] });
      return;
    }
    if (component.get("type") === "body-wrapper") {
      updateBodyClasses(component);
    }

    // Get the current toolbar or initialize an empty array
    let toolbar = [...(component.get("toolbar") || [])];

    const isOnlyChild = true;

    const parent = component.parent();


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

     // Add new add-button by default
     toolbar.push({
      id: "add-button",
      label: `<svg viewBox="0 0 24 24" width="16" height="16" style="stroke: white; fill: none; stroke-width: 2;">
  <path d="M12 5v14m7-7H5"></path>
</svg>
`,
      attributes: { title: "Add" },
      command: () => { /* No action for now */ }
  });

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
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css";
      link.referrerPolicy = "no-referrer";
      frameDoc.head.appendChild(link);

      // Add Script
      const script = frameDoc.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js";
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

  // GrapesJS Command - Theme Class Management
  // Simple GrapesJS Theme Class Management

  // Function to update classes on the body-wrapper
  const updateBodyClasses = (body) => {
    const settings = themeOptions;
    console.log("OPTS: ", settings);

    // Classes to add based on settings
    const classesToAdd = [
      `theme-rounded-${settings.rounded}`,
      `highlight-${settings.highlightedTextStyle}`,
      `sections-${settings.sectionWidth}`,
      settings.darkTheme === "true" ? "theme-dark" : "",
      settings.shadows === "true" ? "shadows" : "",
    ].filter(Boolean);

    // Remove existing theme-related classes
    body.getClasses().forEach((cls) => {
      if (
        cls.startsWith("theme-") ||
        cls.startsWith("highlight-") ||
        cls === "shadows" ||
        cls.startsWith("sections-")
      ) {
        body.removeClass(cls);
      }
    });

    // Add the new classes
    classesToAdd.forEach((cls) => body.addClass(cls));

    console.log("Theme classes updated:", body.getClasses());
  };

  editor.on("load", () => {
    editor.RichTextEditor.get("wrap").result = (rte) => {
      const sel = rte.selection();
      sel && rte.insertHTML(`<span class="highlight">${sel}</span>`);
    };
  });

  editor.on('component:type:register', (type) => {
    const componentList = ['container'];
    console.log("GGs")
    if (componentList.includes(type.id)) {
      const model = type.model;

      // Modify defaults to include layout trait
      const originalDefaults = model.prototype.defaults;
      model.prototype.defaults = {
        ...originalDefaults,
        traits: [
          ...(originalDefaults.traits || []),
          {
            type: 'select',
            name: 'layout',
            label: 'Layout',
            options: [
              { value: 'left', name: 'Left' },
              { value: 'center', name: 'Center' }
            ],
            default: 'left'
          }
        ],
      };

      // Override initialize method to setup layout logic
      const originalInit = model.prototype.init;
      model.prototype.init = function() {
        originalInit && originalInit.apply(this, arguments);
        this.on('change:layout', this.updateLayoutClasses);
        this.updateLayoutClasses();
      };

      // Add layout class update logic
      model.prototype.updateLayoutClasses = function() {
        const layout = this.get('layout') || 'left';
        const classes = this.getClasses().filter(cls => !['text-left', 'text-center', 'items-center'].includes(cls));

        if (layout === 'center') {
          classes.push('text-center', 'items-center');
        } else {
          classes.push('text-left');
        }

        this.setClass(classes);
      };
    }
  });


  // Hook into editor load
  editor.on("load", () => {
    setTimeout(() => initAOS(editor), 500); // Wait a bit for iframe
  });
};
