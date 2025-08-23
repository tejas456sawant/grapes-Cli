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
  editor.backendUrl = opts.backendUrl;

  editor.formsList = opts.forms;

  loadComponents(editor);

  // Responsive width + height mixin using Tailwind utility classes
  setTimeout(() => {
    const types = editor.DomComponents.getTypes();

    types.forEach((typeObj) => {
      const typeId = typeof typeObj === 'string' ? typeObj : typeObj.id;
      const comp = editor.DomComponents.getType(typeId);
      if (!comp || typeof comp.model !== 'function') return;

      const model = comp.model;
      const def = model.prototype.defaults;

      if (def?.disableResponsiveResize) return;

      const originalInit = model.prototype.init;
      const originalGetAttrToHTML = model.prototype.getAttrToHTML || (() => ({}));

      model.prototype.init = function (...args) {
        originalInit && originalInit.apply(this, args);
        const attrs = this.getAttributes();

        if (attrs['desktop-width']) applyTailwindDesktopWidth.call(this, attrs['desktop-width']);
        if (attrs['mobile-width']) applyTailwindMobileWidth.call(this, attrs['mobile-width']);
        if (attrs['desktop-height']) applyTailwindDesktopHeight.call(this, attrs['desktop-height']);
        if (attrs['mobile-height']) applyTailwindMobileHeight.call(this, attrs['mobile-height']);

        this.listenTo(this, 'change:attributes:desktop-width', () => {
          applyTailwindDesktopWidth.call(this, this.getAttributes()['desktop-width']);
        });

        this.listenTo(this, 'change:attributes:mobile-width', () => {
          applyTailwindMobileWidth.call(this, this.getAttributes()['mobile-width']);
        });

        this.listenTo(this, 'change:attributes:desktop-height', () => {
          applyTailwindDesktopHeight.call(this, this.getAttributes()['desktop-height']);
        });

        this.listenTo(this, 'change:attributes:mobile-height', () => {
          applyTailwindMobileHeight.call(this, this.getAttributes()['mobile-height']);
        });

        this.once('change:status', () => {
          const attrs = this.getAttributes();
          if (attrs['desktop-width']) applyTailwindDesktopWidth.call(this, attrs['desktop-width']);
          if (attrs['mobile-width']) applyTailwindMobileWidth.call(this, attrs['mobile-width']);
          if (attrs['desktop-height']) applyTailwindDesktopHeight.call(this, attrs['desktop-height']);
          if (attrs['mobile-height']) applyTailwindMobileHeight.call(this, attrs['mobile-height']);
        });
      };

      model.prototype.getAttrToHTML = function () {
        const out = originalGetAttrToHTML.call(this);
        const attrs = this.getAttributes();
        if (attrs['desktop-width']?.trim()) out['data-desktop-width'] = attrs['desktop-width'];
        if (attrs['mobile-width']?.trim()) out['data-mobile-width'] = attrs['mobile-width'];
        if (attrs['desktop-height']?.trim()) out['data-desktop-height'] = attrs['desktop-height'];
        if (attrs['mobile-height']?.trim()) out['data-mobile-height'] = attrs['mobile-height'];
        return out;
      };

      Object.assign(def.attributes ||= {}, {
        'desktop-width': '',
        'mobile-width': '',
        'desktop-height': '',
        'mobile-height': '',
      });

      def.traits ||= [];
      def.traits.push(
        { type: 'text', name: 'mobile-width', label: 'Mobile Width', placeholder: 'e.g. 100%' },
        { type: 'text', name: 'desktop-width', label: 'Desktop Width (md+)', placeholder: 'e.g. 80%' },
        { type: 'text', name: 'mobile-height', label: 'Mobile Height', placeholder: 'e.g. 300px' },
        { type: 'text', name: 'desktop-height', label: 'Desktop Height (md+)', placeholder: 'e.g. 500px' },
      );
    });
  }, 0);

  function applyTailwindDesktopWidth(width) {
    const classList = this.getClasses() || [];
    const newClass = getTailwindWidthClass(width, true);
    const updated = classList.filter(c => !/^md:w-\[.+\]$/.test(c));
    if (newClass) updated.push(newClass);
    this.setClass(updated);
  }

  function applyTailwindMobileWidth(width) {
    const classList = this.getClasses() || [];
    const newClass = getTailwindWidthClass(width, false);
    const updated = classList.filter(c => !/^w-\[.+\]$/.test(c) || /^md:w-/.test(c));
    if (newClass) updated.push(newClass);
    this.setClass(updated);
  }

  function applyTailwindDesktopHeight(height) {
    const classList = this.getClasses() || [];
    const newClass = getTailwindHeightClass(height, true);
    const updated = classList.filter(c => !/^md:h-\[.+\]$/.test(c));
    if (newClass) updated.push(newClass);
    this.setClass(updated);
  }

  function applyTailwindMobileHeight(height) {
    const classList = this.getClasses() || [];
    const newClass = getTailwindHeightClass(height, false);
    const updated = classList.filter(c => !/^h-\[.+\]$/.test(c) || /^md:h-/.test(c));
    if (newClass) updated.push(newClass);
    this.setClass(updated);
  }

  function getTailwindWidthClass(width, isDesktop) {
    if (!width || typeof width !== 'string') return null;
    const trimmed = width.trim();
    const match = trimmed.match(/^([\d.]+)(px|%|rem)?$/);
    if (!match) return null;
    const [_, num, unit = '%'] = match;
    return `${isDesktop ? 'md:' : ''}w-[${num}${unit}]`;
  }

  function getTailwindHeightClass(height, isDesktop) {
    if (!height || typeof height !== 'string') return null;
    const trimmed = height.trim();
    const match = trimmed.match(/^([\d.]+)(px|%|rem)?$/);
    if (!match) return null;
    const [_, num, unit = 'px'] = match;
    return `${isDesktop ? 'md:' : ''}h-[${num}${unit}]`;
  }

  function revertInlinePreview(fields, el) {
    fields.forEach((field) => {
      if (field?.type) el.style[field.type] = '';
    });
  }

  function parseWidth(str) {
    const match = String(str).match(/^([\d.]+)(px|%|rem)?$/);
    return {
      value: match ? parseFloat(match[1]) : NaN,
      unit: match ? match[2] || '%' : '%',
    };
  }

  function buildField(label, initialValue, initialUnit, el, showPlaceholder = false, type = 'width') {
    const wrapper = document.createElement('div');
    const title = document.createElement('div');
    title.innerText = label;
    title.className = 'text-xs text-gray-600 mb-1';
    const row = document.createElement('div');
    row.className = 'flex items-center gap-2';
    const unitState = { value: initialUnit };

    let input = createInput(initialValue, initialUnit, (newVal) => {
      el.style[type] = `${newVal}${unitState.value}`;
    }, showPlaceholder);

    const unitSelect = createUnitSelect(initialUnit, (unit) => {
      const computed = getComputedStyle(el);
      const px = parseFloat(computed[type]); // width or height

      unitState.value = unit;

      const newInput = createInput(px, unit, (val) => {
        el.style[type] = `${val}${unit}`;  // ✅ dynamic width/height
      }, false);

      row.replaceChild(newInput.el, input.el);
      input.el = newInput.el;
      input.value = newInput.value;

      el.style[type] = `${input.value()}${unit}`; // ✅ correct preview
    });

    row.appendChild(input.el);
    row.appendChild(unitSelect);
    wrapper.appendChild(title);
    wrapper.appendChild(row);

    return { wrapper, input, unit: unitState, type };
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
    return { el, value: () => parseFloat(el.value) };
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

  editor.on('component:selected', (component) => {
    if (component && component.get('type') === 'card') {
      let classes = component.getClasses();
  
      // Remove "card-background"
      classes = classes.filter(cls => cls !== 'card-background');
  
      // Add enforced classes
      if (!classes.includes('bg-section-dark')) {
        classes.push('bg-section-dark');
      }
      if (!classes.includes('light-text')) {
        classes.push('light-text');
      }
  
      component.setClass(classes);
  
      // Set background attribute to false
      component.addAttributes({ background: 'false' });
    }
  });
  
  
  editor.Commands.add('open-width-resize-menu', {
    run(editor) {
      setTimeout(() => {
        const selected = editor.getSelected();
        if (!selected) return;

        const el = selected.view.el;
        document.getElementById('width-resize-menu')?.remove();

        const attr = selected.getAttributes();
        const desktopParsed = parseWidth(attr['desktop-width'] || '');
        const mobileParsed = parseWidth(attr['mobile-width'] || '');
        const desktopHeightParsed = parseWidth(attr['desktop-height'] || '');
        const mobileHeightParsed = parseWidth(attr['mobile-height'] || '');

        const menu = document.createElement('div');
        menu.id = 'width-resize-menu';
        menu.className = 'fixed z-[9999] bg-white shadow-xl rounded-lg p-6 border border-gray-200 w-[280px] text-sm space-y-4 font-sans';

        const canvasRect = editor.Canvas.getElement().getBoundingClientRect();
        menu.style.top = `${canvasRect.top + canvasRect.height * 0.25}px`;
        menu.style.left = `${Math.max(canvasRect.left - 300, 60)}px`;

        const title = document.createElement('div');
        title.innerText = 'Adjust Width and Height';
        title.className = 'text-base font-semibold text-gray-800';
        menu.appendChild(title);

        const desktopField = buildField('Desktop Width', desktopParsed.value, desktopParsed.unit, el, !attr['desktop-width'], 'width');
        const mobileField = buildField('Mobile Width', mobileParsed.value, mobileParsed.unit, el, !attr['mobile-width'], 'width');
        const desktopHeightField = buildField('Desktop Height', desktopHeightParsed.value, desktopHeightParsed.unit, el, !attr['desktop-height'], 'height');
        const mobileHeightField = buildField('Mobile Height', mobileHeightParsed.value, mobileHeightParsed.unit, el, !attr['mobile-height'], 'height');

        const fields = [desktopField, mobileField, desktopHeightField, mobileHeightField];
        fields.forEach(f => menu.appendChild(f.wrapper));

        const closeButton = document.createElement('button');
        closeButton.innerText = '✕';
        closeButton.className = 'absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm';
        closeButton.onclick = () => {
          revertInlinePreview(fields, el);
          menu.remove();
          document.removeEventListener('mousedown', onOutsideClick);
        };
        menu.appendChild(closeButton);

        const saveBtn = document.createElement('button');
        saveBtn.innerText = 'Save';
        saveBtn.className = 'w-full bg-rose-600 text-white text-sm py-1.5 rounded hover:bg-rose-700';
        saveBtn.onclick = () => {
          const newAttrs = { ...selected.getAttributes() };

          const dWVal = desktopField.input.el.value.trim();
          const mWVal = mobileField.input.el.value.trim();
          const dHVal = desktopHeightField.input.el.value.trim();
          const mHVal = mobileHeightField.input.el.value.trim();

          if (dWVal !== '' && !isNaN(desktopField.input.value()))
            newAttrs['desktop-width'] = `${desktopField.input.value()}${desktopField.unit.value}`;

          if (mWVal !== '' && !isNaN(mobileField.input.value()))
            newAttrs['mobile-width'] = `${mobileField.input.value()}${mobileField.unit.value}`;

          if (dHVal !== '' && !isNaN(desktopHeightField.input.value()))
            newAttrs['desktop-height'] = `${desktopHeightField.input.value()}${desktopHeightField.unit.value}`;

          if (mHVal !== '' && !isNaN(mobileHeightField.input.value()))
            newAttrs['mobile-height'] = `${mobileHeightField.input.value()}${mobileHeightField.unit.value}`;

          selected.setAttributes(newAttrs);
          revertInlinePreview(fields, el);

          if (newAttrs['desktop-width']) applyTailwindDesktopWidth.call(selected, newAttrs['desktop-width']);
          if (newAttrs['mobile-width']) applyTailwindMobileWidth.call(selected, newAttrs['mobile-width']);
          if (newAttrs['desktop-height']) applyTailwindDesktopHeight.call(selected, newAttrs['desktop-height']);
          if (newAttrs['mobile-height']) applyTailwindMobileHeight.call(selected, newAttrs['mobile-height']);

          menu.remove();
          document.removeEventListener('mousedown', onOutsideClick);
        };


        menu.appendChild(saveBtn);

        document.body.appendChild(menu);
        const onOutsideClick = (e) => {
          if (!menu.contains(e.target)) {
            revertInlinePreview(fields, el);
            menu.remove();
            document.removeEventListener('mousedown', onOutsideClick);
          }
        };
        setTimeout(() => document.addEventListener('mousedown', onOutsideClick), 200);
      }, 0);
    }
  });



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
            `<a href="tel:${phoneDigits}" class="phone-number">${phoneDigits}</a>`,
          );

          // Update emails - replace entire <a> tag
          const emailRegex = /<a[^>]*class="[^"]*email[^"]*"[^>]*>.*?<\/a>/g;
          htmlString = htmlString.replace(
            emailRegex,
            `<a href="mailto:${email}" class="email">${email}</a>`,
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
    const tags = ['Layout', 'Content', 'Buttons', 'Icons', 'Form', 'Visuals'];

    // Get relevant blocks (sectionblocks if required)
    const blocks = editor.BlockManager.getAll().filter((block) => {
      const attrs = block.attributes || {};
      const isDefaultTheme = attrs.defaulttheme === true;
      const isSectionBlock = attrs.sectionblocks === true;

      if (!isDefaultTheme) return false;

      const insertingAroundSection =
        (insertPosition === 'before' || insertPosition === 'after') &&
        targetComponent?.is('section');

      if (insertingAroundSection) {
        // Only show sectionblocks
        return isSectionBlock === true;
      }

      // Do not show sectionblocks when NOT inserting around a section
      return isSectionBlock !== true;
    });




    // Cleanup existing modal
    document.querySelector('.custom-block-modal')?.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className =
      'custom-block-modal fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center';

    // Modal container
    const modal = document.createElement('div');
    modal.className =
      'bg-white w-[90vw] max-w-6xl rounded-xl shadow-xl flex flex-col';
    modal.style.height = '536px';

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

    // Modal Body (Sidebar + Grid)
    const body = document.createElement('div');
    body.className = 'flex flex-1 overflow-hidden';

    // Sidebar
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
        renderGrid(tag);
      });
      sidebar.appendChild(btn);
    });

    // Hide sidebar if inserting around a section
    if (
      (insertPosition === 'before' || insertPosition === 'after') &&
      targetComponent?.is('section')
    ) {
      sidebar.innerHTML = '';
      sidebar.className = 'hidden';
    }

    // Grid wrapper
    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'flex-1 overflow-y-auto p-4';

    // Grid itself
    const grid = document.createElement('div');
    grid.className =
      'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4';

    gridWrapper.appendChild(grid);

    // Render blocks based on category filter
    function renderGrid(tagFilter) {
      grid.innerHTML = '';
      blocks.forEach((block) => {
        const category = block.get('category');
        const blockTag =
          typeof category === 'string'
            ? category.toLowerCase()
            : category?.id?.toLowerCase?.() || '';

        if (tagFilter && blockTag !== tagFilter.toLowerCase()) return;

        const card = document.createElement('div');
        card.className =
          'bg-white border rounded-lg shadow-sm hover:shadow-md hover:scale-[1.02] transition transform cursor-pointer overflow-hidden flex flex-col md:w-[200px]';

        const media = block.get('media') || '';
        const label = block.get('label') || '';

        let mediaContent = '';

        // Check if it has an <img src="...">
        if (media.includes('<svg')) {
          // Allow inline SVG to render directly
          mediaContent = `<div class="w-full h-full">${media}</div>`;
        } else if (media.trim().startsWith('http')) {
          // It's a raw image URL, use background-image for better positioning control
          mediaContent = `
             <div 
    data-media-box
    style="
      width: 100%;
      aspect-ratio: 4 / 3;
      background-image: url('${media}');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: left top;
    "
  >
    <style>
      @media (min-width: 768px) {
        div[data-media-box] {
          width: 200px !important;
        }
      }
    </style>
  </div>
            `;
        } else {
          // Fallback
          mediaContent = `<div class="w-full h-full flex items-center justify-center text-xs text-gray-400">No Preview</div>`;
        }

        card.innerHTML = `
            <div class="flex-1 bg-gray-100">
              ${mediaContent}
            </div>
            <div class="p-2 text-center text-sm font-medium text-gray-700">${label}</div>
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

    // Initial grid render
    renderGrid();

    // Compose and render modal
    body.append(sidebar, gridWrapper);
    modal.append(header, body);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Handle history for closing
    window.addEventListener('popstate', () => overlay.remove(), { once: true });
    history.pushState(null, '');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) history.back();
    });
  }


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
  const initAlpine = (editor) => {
    const frameEl = editor.Canvas.getFrameEl();

    if (!frameEl) {
      console.error("Canvas frame not found.");
      return;
    }

    const frameDoc = frameEl.contentDocument;
    const frameWin = frameEl.contentWindow;

    const loadAlpine = () => {
      const existing = frameDoc.querySelector('script[src*="alpinejs"]');
      if (existing) {
        console.log("Alpine.js already loaded.");
        return;
      }

      const script = frameDoc.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js";
      script.defer = true;
      script.onload = () => {
        console.log("Alpine.js loaded into canvas.");
      };

      frameDoc.head.appendChild(script);
    };

    if (frameDoc.readyState === "complete") {
      loadAlpine();
    } else {
      frameEl.onload = loadAlpine;
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
      `card-rounded-${settings["card-rounded"]}`,
      `image-rounded-${settings["image-rounded"]}`,
      `icon-rounded-${settings["icon-rounded"]}`,
      `badge-rounded-${settings["badge-rounded"]}`,
      `button-rounded-${settings["button-rounded"]}`,
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

    //   const iframe = editor.Canvas.getFrameEl();
    // if (!iframe?.contentDocument) return;

    // const script = iframe.contentDocument.createElement('script');
    // script.type = 'text/javascript';
    // script.innerHTML = `
    //   (function() {
    //     const ATTR_DESKTOP = 'desktop-width';
    //     const ATTR_MOBILE = 'mobile-width';

    //     function updateClasses(el) {
    //       const mobile = el.getAttribute(ATTR_MOBILE);
    //       const desktop = el.getAttribute(ATTR_DESKTOP);

    //       // Remove previous Tailwind width classes (excluding max-w)
    //       el.className = el.className
    //         .split(' ')
    //         .filter(c => !/^w-\\[.*\\]$/.test(c) && !/^md:w-\\[.*\\]$/.test(c))
    //         .join(' ');

    //       if (mobile) el.classList.add(\`w-[\${mobile}]\`);
    //       if (desktop) el.classList.add(\`md:w-[\${desktop}]\`);
    //     }

    //     // Initial pass
    //     document.querySelectorAll('[' + ATTR_MOBILE + '],[' + ATTR_DESKTOP + ']').forEach(updateClasses);

    //     // Observe for any attribute changes
    //     const observer = new MutationObserver((mutations) => {
    //       mutations.forEach(m => {
    //         if (
    //           m.type === 'attributes' &&
    //           (m.attributeName === ATTR_MOBILE || m.attributeName === ATTR_DESKTOP)
    //         ) {
    //           updateClasses(m.target);
    //         }
    //       });
    //     });

    //     document.querySelectorAll('[' + ATTR_MOBILE + '],[' + ATTR_DESKTOP + ']').forEach(el => {
    //       observer.observe(el, { attributes: true });
    //     });

    //     // Listen for new nodes
    //     const treeObserver = new MutationObserver(mutations => {
    //       mutations.forEach(m => {
    //         m.addedNodes.forEach(node => {
    //           if (!(node instanceof HTMLElement)) return;
    //           if (node.hasAttribute(ATTR_MOBILE) || node.hasAttribute(ATTR_DESKTOP)) {
    //             updateClasses(node);
    //             observer.observe(node, { attributes: true });
    //           }
    //         });
    //       });
    //     });

    //     treeObserver.observe(document.body, { childList: true, subtree: true });
    //   })();
    // `;
    // iframe.contentDocument.body.appendChild(script);


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





  // Hook into editor load
  editor.on("load", () => {
    setTimeout(() => initAOS(editor), 500); // Wait a bit for iframe

  });

  editor.on('load', initContextMenu);

function initContextMenu() {
  let copiedComponent = null;
  let isCut = false;
  let highlightOverlay = null;

  // Create highlight overlay element
  const createHighlightOverlay = () => {
    if (highlightOverlay) return highlightOverlay;
    
    highlightOverlay = document.createElement('div');
    highlightOverlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      border: 2px solid #3b82f6;
      background-color: rgba(59, 130, 246, 0.1);
      z-index: 9998;
      display: none;
      box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
      transition: all 0.15s ease;
    `;
    
    // Append to main document body (not canvas body) for proper positioning
    document.body.appendChild(highlightOverlay);
    
    return highlightOverlay;
  };

  // Function to highlight a component
  const highlightComponent = (comp) => {
    const overlay = createHighlightOverlay();
    const compEl = comp.getEl();
    
    if (!compEl || !overlay) return;
    
    try {
      // Get the canvas iframe and its document
      const canvasFrame = editor.Canvas.getFrameEl();
      const canvasDoc = editor.Canvas.getDocument();
      const canvasWin = editor.Canvas.getWindow();
      const canvasBody = editor.Canvas.getBody();
      
      // Get component's position in canvas document
      const compRect = compEl.getBoundingClientRect();
      
      // Get canvas frame position relative to main window
      const frameRect = canvasFrame.getBoundingClientRect();
      
      // Calculate absolute position accounting for canvas frame position
      const absoluteLeft = frameRect.left + compRect.left;
      const absoluteTop = frameRect.top + compRect.top;
      
      // Position overlay in main document coordinates (not canvas coordinates)
      overlay.style.display = 'block';
      overlay.style.left = absoluteLeft + 'px';
      overlay.style.top = absoluteTop + 'px';
      overlay.style.width = compRect.width + 'px';
      overlay.style.height = compRect.height + 'px';
      overlay.style.position = 'fixed'; // Use fixed positioning to ignore scrolling
      
    } catch (e) {
      console.log('Highlight positioning error:', e);
      // Fallback: just show a border on the element itself
      compEl.style.outline = '2px solid #3b82f6';
      compEl.style.outlineOffset = '-2px';
    }
  };

  // Function to remove highlight
  const removeHighlight = () => {
    if (highlightOverlay) {
      highlightOverlay.style.display = 'none';
    }
    
    // Remove any fallback outlines
    const canvasBody = editor.Canvas.getBody();
    if (canvasBody) {
      const elements = canvasBody.querySelectorAll('*[style*="outline"]');
      elements.forEach(el => {
        if (el.style.outline.includes('#3b82f6')) {
          el.style.outline = '';
          el.style.outlineOffset = '';
        }
      });
    }
  };

  // Create context menu element
  const menu = document.createElement('div');
  menu.id = 'context-menu';
  Object.assign(menu.style, {
    position: 'fixed',
    zIndex: '9999',
    display: 'none',
    width: '320px',
    maxHeight: '360px',
    overflow: 'scroll',
  });
  menu.className =
    'bg-white border border-gray-200 p-3 rounded overflow-scroll rounded-md shadow-xl py-2 text-sm font-medium text-gray-800';

  document.body.appendChild(menu);

  const hideMenu = () => {
    menu.style.display = 'none';
    removeHighlight(); // Clean up any highlights when menu is hidden
  };

  const renderMenu = (components) => {
    menu.innerHTML = '';

    components.forEach((comp, i) => {
      const item = document.createElement('div');
      item.className =
        'px-4 py-2 flex items-center justify-between hover:bg-gray-100 hover:translate-x-1 cursor-pointer transition-all group';

      // Left side - component name
      const leftSide = document.createElement('div');
      leftSide.className = 'flex items-center';

      const label = document.createElement('span');
      label.className = 'truncate flex-1';
      label.textContent = comp.getName() || comp.get('tagName');

      leftSide.appendChild(label);

      // Right side container - holds both tag and actions
      const rightSide = document.createElement('div');
      rightSide.className = 'flex items-center relative min-w-0';

      // Tag name badge
      const tag = document.createElement('span');
      tag.className =
        'text-sm text-gray-400 bg-black/5 px-3 py-1 rounded font-mono group-hover:opacity-0 group-hover:invisible transition-all duration-200 absolute right-0';
      tag.textContent = comp.get('tagName');

      // Action buttons container
      const actions = document.createElement('div');
      actions.className =
        'flex gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 absolute right-0 px-2 bg-gray-100';

      const createIconButton = (svgPath, tooltip, onClick) => {
        const btn = document.createElement('button');
        btn.className =
          'w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center text-gray-500 hover:text-rose-600 hover:border-rose-400 bg-white transition';
        btn.innerHTML = `
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            ${svgPath}
          </svg>
        `;
        btn.title = tooltip;
        btn.onclick = (e) => {
          e.stopPropagation();
          onClick();
          hideMenu();
        };
        return btn;
      };

      // SVG paths
      const cutIcon = `<path d="M10 6.5C10 4.57 8.43 3 6.5 3S3 4.57 3 6.5 4.57 10 6.5 10a3.45 3.45 0 0 0 1.613-.413l2.357 2.528-2.318 2.318A3.46 3.46 0 0 0 6.5 14C4.57 14 3 15.57 3 17.5S4.57 21 6.5 21s3.5-1.57 3.5-3.5c0-.601-.166-1.158-.434-1.652l2.269-2.268L17 19.121a3 3 0 0 0 2.121.879H22L9.35 8.518c.406-.572.65-1.265.65-2.018zM6.5 8C5.673 8 5 7.327 5 6.5S5.673 5 6.5 5 8 5.673 8 6.5 7.327 8 6.5 8zm0 11c-.827 0-1.5-.673-1.5-1.5S5.673 16 6.5 16s1.5.673 1.5 1.5S7.327 19 6.5 19z"></path><path d="m17 4.879-3.707 4.414 1.414 1.414L22 4h-2.879A3 3 0 0 0 17 4.879z"></path>`;

      const copyIcon = `<path fill="none" d="M0 0h24v24H0z"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path>`;
      
      const deleteIcon = `<path fill="none" d="M0 0h24v24H0V0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z"></path>`;
      
      const pasteIcon = `<path d="M20 11V5c0-1.103-.897-2-2-2h-3a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1H4c-1.103 0-2 .897-2 2v13c0 1.103.897 2 2 2h7c0 1.103.897 2 2 2h7c1.103 0 2-.897 2-2v-7c0-1.103-.897-2-2-2zm-9 2v5H4V5h3v2h8V5h3v6h-5c-1.103 0-2 .897-2 2zm2 7v-7h7l.001 7H13z"></path>`;
      
      // Buttons
      const cutBtn = createIconButton(cutIcon, 'Cut', () => {
        copiedComponent = comp;
        isCut = true;
        comp.remove();
      });

      const copyBtn = createIconButton(copyIcon, 'Copy', () => {
        copiedComponent = comp.clone();
        isCut = false;
      });

      const deleteBtn = createIconButton(deleteIcon, 'Delete', () => {
        comp.remove();
      });

      actions.appendChild(cutBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(deleteBtn);

      if (copiedComponent) {
        const pasteBtn = createIconButton(pasteIcon, 'Paste', () => {
          const newComp = isCut ? copiedComponent : copiedComponent.clone();
          comp.append(newComp);
          editor.select(newComp);
          if (isCut) {
            copiedComponent = null;
            isCut = false;
          }
        });
        actions.appendChild(pasteBtn);
      }

      // Assemble right side
      rightSide.appendChild(tag);
      rightSide.appendChild(actions);

      // Add hover highlighting functionality
      item.addEventListener('mouseenter', () => {
        highlightComponent(comp);
      });

      item.addEventListener('mouseleave', () => {
        removeHighlight();
      });

      item.onclick = (e) => {
        e.stopPropagation();
        editor.select(comp);
        hideMenu();
      };

      item.appendChild(leftSide);
      item.appendChild(rightSide);
      menu.appendChild(item);
    });
  };

  // Get component by DOM element
  const getComponentFromEl = (el) => {
    const all = editor.getWrapper().find('*');
    return all.find((cmp) => cmp.getEl() === el) || null;
  };

  // Handle right-click on canvas
  const handleContextMenu = (e) => {
    e.preventDefault();
    hideMenu();

    const canvasDoc = editor.Canvas.getDocument();
    const canvasWin = editor.Canvas.getWindow();
    const targetEl = canvasDoc.elementFromPoint(e.clientX, e.clientY);
    if (!targetEl) return;

    const comp = getComponentFromEl(targetEl);
    if (!comp) return;

    // Build clean linear hierarchy from outermost section tag
    const tree = [];
    let current = comp;
    while (current) {
      tree.unshift(current);
      if (current.get('tagName').toLowerCase() === 'section') break;
      current = current.parent();
    }

    renderMenu(tree);

    // Position menu near cursor with window boundary protection
    const canvasRect = editor.Canvas.getFrameEl().getBoundingClientRect();
    const clickX = e.clientX + canvasRect.left;
    const clickY = e.clientY + canvasRect.top;

    const maxLeft = window.innerWidth - 330;
    const maxTop = window.innerHeight - 370;
    menu.style.left = `${Math.min(clickX, maxLeft)}px`;
    menu.style.top = `${Math.min(clickY, maxTop)}px`;
    menu.style.display = 'block';
  };

  // Attach event listeners to the current canvas
  const attachCanvasListeners = () => {
    const canvasBody = editor.Canvas.getBody();
    if (canvasBody) {
      canvasBody.addEventListener('contextmenu', handleContextMenu);
    }
  };

  // Initial attachment
  attachCanvasListeners();

  // Re-attach when canvas changes (like page switch)
  editor.on('canvas:frame:load', attachCanvasListeners);

  // Close menu when clicking outside
  document.addEventListener('mousedown', (e) => {
    if (!menu.contains(e.target)) {
      hideMenu();
    }
  });

  // Cleanup when editor is destroyed
  editor.on('destroy', () => {
    const canvasBody = editor.Canvas.getBody();
    if (canvasBody) {
      canvasBody.removeEventListener('contextmenu', handleContextMenu);
    }
    // Remove highlight overlay from main document
    if (highlightOverlay && document.body.contains(highlightOverlay)) {
      document.body.removeChild(highlightOverlay);
    }
    if (document.body.contains(menu)) {
      document.body.removeChild(menu);
    }
  });
}


};
