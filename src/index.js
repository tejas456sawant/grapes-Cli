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


  editor.formsList = opts.forms;
  console.log("forms ", editor.formsList);

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

  editor.Commands.add("open-insert-component-modal", {
    run(editor) {
      const selected = editor.getSelected();
      if (!selected) return;

      // Clean existing
      document.querySelector(".custom-context-menu")?.remove();

      const toolbarButton = document.querySelector('[title="Add"]');
      if (!toolbarButton) return;

      const btnRect = toolbarButton.getBoundingClientRect();

      // Create modern horizontal menu
      const contextMenu = document.createElement("div");
      contextMenu.className =
        "custom-context-menu fixed z-[9999] text-md flex items-center gap-2 bg-white backdrop-blur-md shadow-2xl p-2 rounded-md transition-all duration-200";

      contextMenu.innerHTML = `
        <span class="text-md">Add Item</span>
        <button data-pos="before" class="menu-btn flex items-center gap-1 px-1 py-2 text-md rounded-md hover:bg-rose-200 bg-gray-200 transition">
          <svg class="w-4 h-4" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em"><path d="M208 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zm166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path</svg>
          <span>Before</span>
        </button>
        <button data-pos="after" class="menu-btn flex items-center gap-1 px-1 py-2 text-md rounded-md hover:bg-rose-200 bg-gray-200 transition">
          <svg class="w-4 h-4" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em">
         <path d="M872 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zm-166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>

          <span>After</span>
        </button>
        ${selected.get("addInside")
          ? `<button data-pos="inside" class="menu-btn flex items-center gap-1 px-1 py-2 text-md rounded-md hover:bg-rose-200 bg-gray-200 transition">
          <svg class="w-4 h-4" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em">
         <path d="M872 476H548V144h-72v332H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h324v332h72V548h324c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-664h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-592h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-166 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-426h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 260h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
          <span>Inside</span>
        </button>`
          : ""
        }
        <button class="close-context ml-2 text-gray-400 hover:text-black text-lg px-2">&times;</button>
      `;

      document.body.appendChild(contextMenu);

      // Position smartly
      const menuRect = contextMenu.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let top = btnRect.bottom + 10;
      let left = btnRect.left - 20;

      if (top + menuRect.height > screenHeight - 10) {
        top = btnRect.top - menuRect.height - 10;
      }

      if (left + menuRect.width > screenWidth - 10) {
        left = screenWidth - menuRect.width - 10;
      }

      contextMenu.style.top = `${top}px`;
      contextMenu.style.left = `${left}px`;

      // Handle clicks
      contextMenu.querySelectorAll(".menu-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const position = e.currentTarget.dataset.pos;
          contextMenu.remove();
          openBlockPickerModal(editor, selected, position);
        });
      });

      contextMenu.querySelector(".close-context").addEventListener("click", () => {
        contextMenu.remove();
      });

      const onClickOutside = (e) => {
        if (!contextMenu.contains(e.target) && !toolbarButton.contains(e.target)) {
          contextMenu.remove();
          document.removeEventListener("mousedown", onClickOutside);
        }
      };
      setTimeout(() => {
        document.addEventListener("mousedown", onClickOutside);
      }, 50);
    },
  });
  function openBlockPickerModal(editor, targetComponent, insertPosition) {
    const tags = ['Layout', 'Typography', 'Buttons', 'Visuals', 'Form', 'Misc', 'Templates'];

    const blocks = editor.BlockManager.getAll().filter((block) => {
      if (
        (insertPosition === 'before' || insertPosition === 'after') &&
        targetComponent?.is('section')
      ) {
        return block.get('sectionBlocks');
      }
      return true;
    });

    document.querySelector('.custom-block-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.className =
      'custom-block-modal fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center';

    const modal = document.createElement('div');
    modal.className =
      'bg-white w-[90vw] max-w-6xl rounded-xl shadow-xl flex flex-col';
    modal.style.height = '536px'
    // Header
    const header = document.createElement('div');
    header.className =
      'flex justify-between items-center px-4 py-2 border-b border-gray-200';
    const title = document.createElement('div');
    title.className = 'text-gray-700 text-sm font-semibold';
    title.textContent = 'Insert Block';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.className = 'text-2xl text-gray-500 hover:text-black';
    closeBtn.onclick = () => history.back();
    header.append(title, closeBtn);

    // Body layout: Sidebar + Grid
    const body = document.createElement('div');
    body.className = 'flex flex-1 overflow-hidden';

    const sidebar = document.createElement('div');
    sidebar.className =
      'hidden md:flex flex-col w-48 border-r border-gray-200 bg-gray-50 overflow-y-auto';

    tags.forEach((tag) => {
      const btn = document.createElement('button');
      btn.textContent = tag;
      btn.className =
        'px-4 py-3 text-left text-capitalize text-sm text-gray-700 hover:bg-gray-200 transition';
      btn.addEventListener('click', () => {
        [...sidebar.children].forEach((c) =>
          c.classList.remove('bg-gray-200', 'font-bold')
        );
        btn.classList.add('bg-gray-200', 'font-bold');
        // renderGrid(tag);
      });
      sidebar.appendChild(btn);
    });

    if (
      (insertPosition === 'before' || insertPosition === 'after') &&
      targetComponent?.is('section')
    ) {
      sidebar.innerHTML = '';
      sidebar.className =
        'hidden';
    }
    // Grid container
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'flex-1 overflow-y-auto p-4';

    const grid = document.createElement('div');
    grid.className =
      'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4';

    gridWrapper.appendChild(grid);

    function renderGrid(tagFilter) {
      grid.innerHTML = '';
      blocks.forEach((block) => {
        const category = block.get('category');
        const blockTag =
          typeof category === 'string'
            ? category.toLowerCase()
            : category?.id?.toLowerCase?.() || '';

        if (tagFilter && blockTag !== tagFilter) return;

        const card = document.createElement('div');
        card.className =
          'bg-white border rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition transform cursor-pointer overflow-hidden flex flex-col aspect-video';

        const imgSrc = block.get('media')?.match(/src="(.*?)"/)?.[1] || '';
        card.innerHTML = `
          <div class="flex-1">
            <img src="${imgSrc}" class="w-full h-full object-cover" />
          </div>
          <div class="p-2 text-center text-sm font-medium text-gray-700">${block.get(
          'label'
        )}</div>
        `;

        card.addEventListener('click', () => {
          const comp = block.get('content');
          if (insertPosition === 'before') {
            targetComponent.parent().append(comp, {
              at: targetComponent.index(),
            });
          } else if (insertPosition === 'after') {
            targetComponent.parent().append(comp, {
              at: targetComponent.index() + 1,
            });
          } else {
            targetComponent.append(comp);
          }
          history.back();
        });

        grid.appendChild(card);
      });
    }

    renderGrid(); // Initial

    // Bottom tab bar on mobile
    // const bottomBar = document.createElement('div');
    // bottomBar.className =
    //   'md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around p-2 z-50';
    // tags.forEach((tag) => {
    //   const btn = document.createElement('button');
    //   btn.textContent = tag[0].toUpperCase();
    //   btn.title = tag;
    //   btn.className = 'px-3 py-2 text-gray-600 hover:text-black';
    //   btn.onclick = () => {
    //     [...bottomBar.children].forEach((c) =>
    //       c.classList.remove('text-black')
    //     );
    //     btn.classList.add('text-black');
    //     renderGrid(tag);
    //   };
    //   bottomBar.appendChild(btn);
    // });

    // Combine and render
    body.append(sidebar, gridWrapper);
    modal.append(header, body);
    overlay.appendChild(modal);
    // overlay.appendChild(bottomBar);
    document.body.appendChild(overlay);

    // Close on back
    window.addEventListener('popstate', () => overlay.remove(), { once: true });
    history.pushState(null, '');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) history.back();
    });
  }


  // Register the command
  //     editor.Commands.add('open-insert-component-modal', {
  //       run: (editor, sender, options = {}) => {

  //         const selectedComponent = editor.getSelected();
  //         if (!selectedComponent) {
  //           editor.Modal.alert({
  //             title: 'No Selection',
  //             content: 'Please select a component first',
  //             attributes: { class: 'bg-rose-50 text-rose-900' }
  //           });
  //           return;
  //         }

  //         // Create the main modal container
  //         const modal = document.createElement('div');
  //         modal.className = 'fixed inset-0 bg-rose-900/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn';
  //         modal.id = 'insert-component-modal';

  //         // Create the modal content
  //         const modalContent = document.createElement('div');
  //         modalContent.className = 'bg-white rounded-xl shadow-2xl w-[90vw] max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-rose-100 animate-scaleIn';
  //         modalContent.style.transformOrigin = 'center center';

  //         // Create the initial options modal
  //         const initialOptions = createInitialOptions(editor, selectedComponent);
  //         modalContent.appendChild(initialOptions);

  //         // Append to document
  //         modal.appendChild(modalContent);
  //         document.body.appendChild(modal);


  //         // Close modal when clicking outside
  //         modal.addEventListener('click', (e) => {
  //           if (e.target === modal) {
  //             modal.classList.add('animate-fadeOut');
  //             modalContent.classList.add('animate-scaleOut');
  //             setTimeout(() => {
  //               document.body.removeChild(modal);
  //             }, 200);
  //           }
  //         });
  //       }
  //     });

  //     // Helper to create the initial options modal
  //     function createInitialOptions(editor, selectedComponent) {
  //       const container = document.createElement('div');
  //       container.className = 'p-8 flex flex-col h-[500px] overflow-scroll bg-gradient-to-br from-rose-50 to-rose-100/50';
  //       container.style.height = '500px';

  //       const header = document.createElement('div');
  //       header.className = 'mb-8 text-center';

  //       const title = document.createElement('h3');
  //       title.className = 'text-2xl font-bold text-rose-900 mb-2';
  //       title.textContent = 'Insert Component';

  //       const subtitle = document.createElement('p');
  //       subtitle.className = 'text-rose-700/80 max-w-md mx-auto';
  //       subtitle.textContent = `Selected: ${selectedComponent.getName() || selectedComponent.get('type')}`;

  //       header.appendChild(title);
  //       header.appendChild(subtitle);
  //       container.appendChild(header);

  //       const optionsContainer = document.createElement('div');
  //       optionsContainer.className = 'grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow';

  //       const options = [
  //         { 
  //           name: 'Before',
  //           desc: 'Add before current component',
  //           class: 'hover:border-rose-300 hover:bg-rose-50'
  //         },
  //         { 
  //           name: 'After',
  //           desc: 'Add after current component',
  //           class: 'hover:border-rose-300 hover:bg-rose-50'
  //         },
  //         { 
  //           name: 'Inside',
  //           desc: 'Add inside current component',
  //           class: 'hover:border-rose-400 hover:bg-rose-100/30 border-rose-200 bg-rose-50/50'
  //         }
  //       ];

  //       options.forEach(option => {
  //         const card = document.createElement('button');
  //         card.className = `bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all border-2 ${option.class} flex flex-col items-center justify-center group`;

  //         const icon = document.createElement('div');
  //         icon.className = 'mb-3 text-rose-600 group-hover:text-rose-800 transition-colors';

  //         switch (option.name) {
  //           case 'Before':
  //             icon.innerHTML = `
  //               <svg stroke="currentColor" class="w-10 h-10" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
  // <path d="M208 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zm166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM540 310h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
  //             `;
  //             break;
  //           case 'After':
  //             icon.innerHTML = `
  //                <svg stroke="currentColor" class="w-10 h-10" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  //                <path d="M872 144h-56c-4.4 0-8 3.6-8 8v720c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V152c0-4.4-3.6-8-8-8zm-166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-498 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-166 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm166 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM208 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm498 332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM374 808h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-332h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>

  //             `;
  //             break;
  //           case 'Inside':
  //             icon.innerHTML = `
  //               <svg stroke="currentColor" class="w-10 h-10" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M872 476H548V144h-72v332H152c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h324v332h72V548h324c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-166h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0-664h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 498h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM650 216h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-332 0h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-592h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-166 0h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 592h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm-56-426h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm56 260h-56c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path></svg>
  //             `;
  //             break;
  //         }


  //         const name = document.createElement('h4');
  //         name.className = 'text-lg font-semibold text-rose-900 mb-2';
  //         name.textContent = option.name;

  //         const desc = document.createElement('p');
  //         desc.className = 'text-sm text-rose-700/70 text-center';
  //         desc.textContent = option.desc;

  //         card.appendChild(icon);
  //         card.appendChild(name);
  //         card.appendChild(desc);

  //         // card.addEventListener('click', () => {
  //         //   card.classList.add('scale-95', 'bg-rose-100');

  //         //   // setTimeout(() => {
  //         //     // Clear only the content wrapper, not the whole modal container
  //         //     // while (container.firstChild) {
  //         //     //   container.removeChild(container.firstChild);
  //         //     // }

  //         //     // Show the component selector
  //         //     // const componentSelector = createComponentSelector(editor, selectedComponent, option.name.toLowerCase());
  //         //     // container.appendChild(componentSelector);

  //         //     // Now add the component selector safely
  //         //   //   const componentSelector = createComponentSelector(editor, selectedComponent, option.name.toLowerCase());
  //         //   //   contentWrapper.appendChild(componentSelector);
  //         //   // }, 150);
  //         // });

  //         optionsContainer.appendChild(card);
  //       });

  //       container.appendChild(optionsContainer);

  //       // Add footer with close button
  //       const footer = document.createElement('div');
  //       footer.className = 'mt-6 flex justify-end';

  //       const closeBtn = document.createElement('button');
  //       closeBtn.className = 'px-4 py-2 text-sm text-rose-700 hover:text-rose-900 font-medium rounded-lg hover:bg-rose-200/50 transition-colors flex items-center gap-1';
  //       closeBtn.innerHTML = `
  //         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  //         </svg>
  //         Cancel
  //       `;
  //       closeBtn.addEventListener('click', () => {
  //         const modal = document.getElementById('insert-component-modal');
  //         if (modal) {
  //           modal.classList.add('animate-fadeOut');
  //           modal.querySelector('div').classList.add('animate-scaleOut');
  //           setTimeout(() => {
  //             document.body.removeChild(modal);
  //           }, 200);
  //         }
  //       });

  //       footer.appendChild(closeBtn);
  //       container.appendChild(footer);

  //       return container;
  //     }

  //     // Helper to create the component selector
  //     function createComponentSelector(editor, selectedComponent, insertPosition) {
  //       const container = document.createElement('div');
  //       container.className = 'flex h-96 bg-gradient-to-b from-rose-50 to-white';
  //       container.style.overflow = 'scroll'
  //       // Create sidebar with categories
  //       const sidebar = document.createElement('div');
  //       sidebar.className = 'w-64 bg-white/80 p-4 border-r border-rose-200 overflow-y-auto backdrop-blur-sm flex flex-col';

  //       const sidebarHeader = document.createElement('div');
  //       sidebarHeader.className = 'mb-6';

  //       const backBtn = document.createElement('button');
  //       backBtn.className = 'flex items-center text-sm text-rose-700 hover:text-rose-900 mb-4 transition-colors';
  //       backBtn.innerHTML = `
  //         <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  //         </svg>
  //         Back
  //       `;
  //       backBtn.addEventListener('click', () => {
  //         const modalContent = document.querySelector('#insert-component-modal > div');
  //         while (modalContent.firstChild) {
  //           modalContent.removeChild(modalContent.firstChild);
  //         }
  //         modalContent.appendChild(createInitialOptions(editor, selectedComponent));
  //       });

  //       const sidebarTitle = document.createElement('h4');
  //       sidebarTitle.className = 'font-bold text-lg text-rose-900';
  //       sidebarTitle.textContent = 'Categories';

  //       sidebarHeader.appendChild(backBtn);
  //       sidebarHeader.appendChild(sidebarTitle);
  //       sidebar.appendChild(sidebarHeader);

  //       // Search input
  //       const searchContainer = document.createElement('div');
  //       searchContainer.className = 'mb-6 relative';

  //       const searchInput = document.createElement('input');
  //       searchInput.type = 'text';
  //       searchInput.placeholder = 'Search components...';
  //       searchInput.className = 'w-full px-3 py-2 pr-8 text-sm border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all';

  //       searchContainer.appendChild(searchInput);
  //       sidebar.appendChild(searchContainer);

  //       // Dummy categories with icons
  //       const categories = [
  //         { name: 'All', icon: '🌟', active: true },
  //         { name: 'Basic', icon: '🧩' },
  //         { name: 'Forms', icon: '📝' },
  //         { name: 'Media', icon: '🖼️' },
  //         { name: 'Layout', icon: '📐' },
  //         { name: 'Typography', icon: '🔤' }
  //       ];

  //       const categoryContainer = document.createElement('div');
  //       categoryContainer.className = 'flex-1 overflow-y-auto';

  //       categories.forEach(cat => {
  //         const catBtn = document.createElement('button');
  //         catBtn.className = `flex items-center w-full text-left py-3 px-3 mb-1 rounded-lg transition-colors text-rose-800 group ${cat.active ? 'bg-rose-100/70 font-medium' : 'hover:bg-rose-100/50'}`;
  //         catBtn.innerHTML = `
  //           <span class="text-xl mr-3 opacity-70 group-hover:opacity-100 transition-opacity">${cat.icon}</span>
  //           <span>${cat.name}</span>
  //         `;
  //         categoryContainer.appendChild(catBtn);
  //       });

  //       sidebar.appendChild(categoryContainer);
  //       container.appendChild(sidebar);

  //       // Create component grid
  //       const componentGrid = document.createElement('div');
  //       componentGrid.className = 'flex-1 p-6 overflow-y-auto flex flex-col';

  //       const gridHeader = document.createElement('div');
  //       gridHeader.className = 'mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4';

  //       const gridTitle = document.createElement('h4');
  //       gridTitle.className = 'font-bold text-xl text-rose-900';
  //       gridTitle.textContent = 'Available Components';

  //       const headerRight = document.createElement('div');
  //       headerRight.className = 'flex items-center gap-3';

  //       const positionBadge = document.createElement('span');
  //       positionBadge.className = 'bg-rose-100 text-rose-800 text-xs font-medium px-3 py-1 rounded-full capitalize';
  //       positionBadge.textContent = insertPosition;

  //       const countBadge = document.createElement('span');
  //       countBadge.className = 'bg-white border border-rose-200 text-rose-700 text-xs font-medium px-2.5 py-1 rounded-full';

  //       headerRight.appendChild(positionBadge);
  //       headerRight.appendChild(countBadge);

  //       gridHeader.appendChild(gridTitle);
  //       gridHeader.appendChild(headerRight);
  //       componentGrid.appendChild(gridHeader);

  //       // Grid container
  //       const gridContainer = document.createElement('div');
  //       gridContainer.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 content-start';

  //       // Preview container (initially hidden)
  //       const previewContainer = document.createElement('div');
  //       previewContainer.className = 'hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[1001] flex items-center justify-center p-4 animate-fadeIn';
  //       previewContainer.id = 'component-preview-modal';

  //       const previewContent = document.createElement('div');
  //       previewContent.className = 'bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto animate-scaleIn p-6';
  //       previewContent.style.transformOrigin = 'center center';

  //       const previewHeader = document.createElement('div');
  //       previewHeader.className = 'flex justify-between items-center mb-4 pb-2 border-b border-rose-100';

  //       const previewTitle = document.createElement('h3');
  //       previewTitle.className = 'text-lg font-bold text-rose-900';

  //       const closePreviewBtn = document.createElement('button');
  //       closePreviewBtn.className = 'text-rose-700 hover:text-rose-900 p-1 rounded-full hover:bg-rose-100';
  //       closePreviewBtn.innerHTML = `
  //         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  //         </svg>
  //       `;
  //       closePreviewBtn.addEventListener('click', () => {
  //         previewContainer.classList.add('animate-fadeOut');
  //         previewContent.classList.add('animate-scaleOut');
  //         setTimeout(() => {
  //           document.body.removeChild(previewContainer);
  //         }, 200);
  //       });

  //       previewHeader.appendChild(previewTitle);
  //       previewHeader.appendChild(closePreviewBtn);
  //       previewContent.appendChild(previewHeader);

  //       const previewBody = document.createElement('div');
  //       previewBody.className = 'prose prose-rose max-w-none';
  //       previewContent.appendChild(previewBody);

  //       previewContainer.appendChild(previewContent);
  //       document.body.appendChild(previewContainer);

  //       // Get all component types from the editor
  //       const componentTypes = editor.Components.getTypes();
  //       countBadge.textContent = `${componentTypes.length} components`;

  //       componentTypes.forEach(compType => {
  //         const compCard = document.createElement('button');
  //         compCard.className = 'border border-rose-200 bg-white rounded-xl p-4 hover:shadow-md transition-all cursor-pointer flex flex-col text-left hover:border-rose-300 hover:bg-rose-50/50 group h-full';

  //         const cardHeader = document.createElement('div');
  //         cardHeader.className = 'flex items-start mb-3';

  //         const icon = document.createElement('div');
  //         icon.className = 'w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 mr-3 group-hover:bg-rose-200 transition-colors flex-shrink-0';
  //         icon.innerHTML = `
  //           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  //           </svg>
  //         `;

  //         const textContainer = document.createElement('div');
  //         textContainer.className = 'flex-1';

  //         const name = document.createElement('h5');
  //         name.className = 'font-medium text-rose-900 mb-1';
  //         const typeName = typeof compType === 'string'
  //   ? compType
  //   : compType.id || compType.type || compType.name || 'Unknown';

  // name.textContent = typeName;

  //         const type = document.createElement('span');
  //         type.className = 'text-xs text-rose-600/70 block';
  //         type.textContent = 'component';

  //         textContainer.appendChild(name);
  //         textContainer.appendChild(type);
  //         cardHeader.appendChild(icon);
  //         cardHeader.appendChild(textContainer);

  //         const previewBtn = document.createElement('button');
  //         previewBtn.className = 'absolute top-2 right-2 p-1 text-rose-600/50 hover:text-rose-700 rounded-full hover:bg-rose-200 bg-gray-200 transition-colors opacity-0 group-hover:opacity-100';
  //         previewBtn.innerHTML = `
  //           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  //             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  //           </svg>
  //         `;
  //         previewBtn.addEventListener('click', (e) => {
  //           e.stopPropagation();
  //           previewTitle.textContent = compType;
  //           previewBody.innerHTML = `
  //             <h4 class="text-rose-800">Component Preview</h4>
  //             <p class="text-rose-700/80">This would show a live preview of the ${compType} component.</p>
  //             <div class="mt-4 p-4 border border-rose-200 rounded-lg bg-rose-50/50">
  //               <p class="text-sm text-rose-700">In a real implementation, this would render an actual preview of the component.</p>
  //             </div>
  //           `;
  //           previewContainer.classList.remove('hidden');
  //         });

  //         compCard.appendChild(cardHeader);
  //         compCard.appendChild(previewBtn);

  //         compCard.addEventListener('click', () => {
  //           // Add insertion animation feedback
  //           compCard.classList.add('scale-95', 'bg-rose-100');
  //           setTimeout(() => {
  //             compCard.classList.remove('scale-95', 'bg-rose-100');
  //           }, 150);

  //           // Insert the component based on the selected position
  //           const component = { type: typeName };

  //           switch (insertPosition) {
  //             case 'before':
  //               editor.getSelected().before(component);
  //               break;
  //             case 'after':
  //               editor.getSelected().after(component);
  //               break;
  //             case 'inside':
  //               const selected = editor.getSelected();
  //               if (selected) {
  //                 selected.components().add(component); // adds to the end
  //               }
  //               break;
  //           }

  //           // Close the modal with animation
  //           const modal = document.getElementById('insert-component-modal');
  //           if (modal) {
  //             modal.classList.add('animate-fadeOut');
  //             modal.querySelector('div').classList.add('animate-scaleOut');
  //             setTimeout(() => {
  //               document.body.removeChild(modal);
  //             }, 200);
  //           }
  //         });

  //         gridContainer.appendChild(compCard);
  //       });

  //       // Add search functionality
  //       searchInput.addEventListener('input', (e) => {
  //         const searchTerm = e.target.value.toLowerCase();
  //         const cards = gridContainer.querySelectorAll('button');
  //         let visibleCount = 0;

  //         cards.forEach(card => {
  //           const name = card.querySelector('h5').textContent.toLowerCase();
  //           if (name.includes(searchTerm)) {
  //             card.style.display = 'block';
  //             visibleCount++;
  //           } else {
  //             card.style.display = 'none';
  //           }
  //         });

  //         countBadge.textContent = `${visibleCount} of ${componentTypes.length} components`;
  //       });

  //       componentGrid.appendChild(gridContainer);
  //       container.appendChild(componentGrid);
  //       return container;
  //     }



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

    if (component.get("attributes")?.textalign) {
      const hasTextAlignButton = toolbar.some((btn) => btn.id === "textalign-toggle");

      if (!hasTextAlignButton) {
        toolbar.push({
          id: "textalign-toggle",
          label: `
            <svg viewBox="0 0 24 24" width="16" height="16" style="fill: currentColor;">
              <path d="M4 6h16v2H4V6zm4 5h8v2H8v-2zm-4 5h16v2H4v-2z" fill="currentColor"/>
            </svg>
          `,
          command(editor) {
            const component = editor.getSelected();
            if (!component) return;

            const attrs = component.get("attributes") || {};
            const currentAlign = attrs.textalign || "left";
            const nextAlign = {
              left: "center",
              center: "right",
              right: "left",
            }[currentAlign];

            component.addAttributes({ textalign: nextAlign });
          },
          attributes: { title: "Toggle Text Alignment" },
        });
      }
    }


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

    toolbar.push({
      id: "width-button",
      label: `
        <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" style="stroke: white; fill: none; stroke-width: 2;">
        <polyline points="16 4 20 4 20 8" />
        <line x1="14" y1="10" x2="20" y2="4" />
        
        <polyline points="8 20 4 20 4 16" />
        <line x1="10" y1="14" x2="4" y2="20" />

      </svg> `,

      attributes: { title: "Resize" },
      command: "open-width-resize-menu",
    });

    // Add new add-button by default
    toolbar.push({
      id: "add-button",
      label: `<svg viewBox="0 0 24 24" width="16" height="16" style="stroke: white; fill: none; stroke-width: 2;">
        <path d="M12 5v14m7-7H5"></path>
      </svg> `,

      attributes: { title: "Add" },
      command: "open-insert-component-modal",
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
        console.log("AOS loaded 3");
        // editor.refresh(); // Refresh canvas
        // editor.Canvas.getFrameEl().contentWindow.location.reload(); // Optional force reload
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
      model.prototype.init = function () {
        originalInit && originalInit.apply(this, arguments);
        this.on('change:layout', this.updateLayoutClasses);
        this.updateLayoutClasses();
      };

      // Add layout class update logic
      model.prototype.updateLayoutClasses = function () {
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


  editor.Commands.add('open-width-resize-menu', {
    run(editor) {
      setTimeout(() => {
        const selected = editor.getSelected();
        if (!selected) return;
  
        const el = selected.view.el;
  
        document.getElementById('width-resize-menu')?.remove();
  
        const attrDesktop = selected.getAttributes()['desktop-width'] || '';
        const attrMobile = selected.getAttributes()['mobile-width'] || '';
  
        const desktopParsed = parseWidth(attrDesktop);
        const mobileParsed = parseWidth(attrMobile);
  
        const menu = document.createElement('div');
        menu.id = 'width-resize-menu';
        menu.className = `
          fixed z-[9999] bg-white shadow-xl rounded-lg p-6 border border-gray-200 w-[280px]
          text-sm space-y-4 font-sans
        `;
  
        // Position it to the left side of the editor, vertically centered (but biased toward top)
        const editorCanvas = editor.Canvas.getElement();
        const canvasRect = editorCanvas.getBoundingClientRect();
  
        let top = canvasRect.top + canvasRect.height * 0.25;
        let left = canvasRect.left - 300;
  
        if (left < 10) left = 60;
        if (top < 10) top = 10;
  
        Object.assign(menu.style, {
          top: `${top}px`,
          left: `${left}px`,
        });
  
        const closeButton = document.createElement('button');
        closeButton.innerText = '✕';
        closeButton.className = 'absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm';
        closeButton.onclick = () => {
          el.style.width = originalDesktopWidth;
          menu.remove();
          document.removeEventListener('mousedown', onOutsideClick);
        };
        menu.appendChild(closeButton);
  
        const title = document.createElement('div');
        title.innerText = 'Adjust Width';
        title.className = 'text-base font-semibold text-gray-800';
        menu.appendChild(title);
  
        const originalDesktopWidth = el.style.width;
  
        const desktopField = buildField('Desktop', desktopParsed.value, desktopParsed.unit, el, !attrDesktop);
        const mobileField = buildField('Mobile', mobileParsed.value, mobileParsed.unit, el, !attrMobile);
  
        menu.appendChild(desktopField.wrapper);
        menu.appendChild(mobileField.wrapper);
  
        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save';
        saveBtn.className = 'w-full bg-rose-600 text-white text-sm py-1.5 rounded hover:bg-rose-700';
        saveBtn.onclick = () => {
          const dval = desktopField.input.value();
          const dunit = desktopField.unit.value;
          const mval = mobileField.input.value();
          const munit = mobileField.unit.value;
  
          selected.addStyle({ width: `${dval}${dunit}` });
          selected.addStyle({ width: `${mval}${munit}` }, { mediaText: '@media (max-width: 768px)' });
  
          selected.addAttributes({
            'desktop-width': `${dval}${dunit}`,
            'mobile-width': `${mval}${munit}`,
          });
  
          menu.remove();
          document.removeEventListener('mousedown', onOutsideClick);
        };
        menu.appendChild(saveBtn);
  
        document.body.appendChild(menu);
  
        const onOutsideClick = (e) => {
          if (!menu.contains(e.target)) {
            el.style.width = originalDesktopWidth;
            menu.remove();
            document.removeEventListener('mousedown', onOutsideClick);
          }
        };
  
        setTimeout(() => {
          document.addEventListener('mousedown', onOutsideClick);
        }, 200);
      }, 0);
    }
  });

  function buildField(label, initialValue, initialUnit, el, showPlaceholder = false) {
    const wrapper = document.createElement('div');

    const title = document.createElement('div');
    title.innerText = label;
    title.className = 'text-xs text-gray-600 mb-1';

    const row = document.createElement('div');
    row.className = 'flex items-center gap-2';

    const unitState = { value: initialUnit };

    let input = createInput(initialValue, initialUnit, (newVal) => {
      el.style.width = `${newVal}${unitState.value}`;
    }, showPlaceholder);

    const unitSelect = createUnitSelect(initialUnit, (unit) => {
      const computed = getComputedStyle(el);
      const px = parseFloat(computed.width);
      unitState.value = unit;
      const newInput = createInput(px, unit, (val) => {
        el.style.width = `${val}${unit}`;
      }, false);
      row.replaceChild(newInput.el, input.el);
      input = newInput;
      el.style.width = `${input.value()}${unit}`;
    });

    row.appendChild(input.el);
    row.appendChild(unitSelect);

    wrapper.appendChild(title);
    wrapper.appendChild(row);

    return {
      wrapper,
      input,
      unit: unitState,
    };
  }

  function createInput(value, unit, onInputChange, showPlaceholder = false) {
    const el = document.createElement('input');
    el.type = 'number';
    el.className = 'w-full border border-gray-300 rounded px-2 py-1 text-sm';
    el.min = unit === '%' ? '0' : '';
    el.max = unit === '%' ? '100' : '';
    el.step = '1';
    el.value = isNaN(value) ? '' : value;
    if (showPlaceholder) el.placeholder = '—';

    el.oninput = () => {
      if (onInputChange && el.value !== '') onInputChange(parseFloat(el.value));
    };

    return {
      el,
      value: () => parseFloat(el.value),
    };
  }

  function createUnitSelect(selectedUnit, onChange) {
    const select = document.createElement('select');
    select.className = 'border border-gray-300 rounded px-1 py-1 text-sm w-[60px]';
    ['%', 'px', 'rem'].forEach((u) => {
      const opt = document.createElement('option');
      opt.value = u;
      opt.textContent = u;
      if (u === selectedUnit) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('change', (e) => onChange(e.target.value));
    return select;
  }

  function parseWidth(str) {
    const match = String(str).match(/^([\d.]+)(px|%|rem)?$/);
    return {
      value: match ? parseFloat(match[1]) : NaN,
      unit: match ? match[2] || '%' : '%',
    };
  }





  // Hook into editor load
  editor.on("load", () => {
    setTimeout(() => initAOS(editor), 500); // Wait a bit for iframe
  });
};
