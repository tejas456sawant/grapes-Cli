export default (editor, options) => {
  editor.Commands.add("edit-navbar-links", {
    run(editor, sender, options = {}) {
      const { model } = options;
      if (!model) return;

      const linksList = model.find(".ml-10.flex")[0];
      const modal = editor.Modal;
      modal.open({
        title: "Edit Navbar Links",
        content: `
          <div id="navbar-links-container">
            ${linksList
              .components()
              .map(
                (link, index) => `
              <div class="mb-2">
                <input type="text" class="navbar-link-input border rounded px-2 py-1" data-index="${index}" value="${link.get(
                  "content"
                )}">
                <button class="remove-link bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">Remove</button>
              </div>
            `
              )
              .join("")}
          </div>
          <button id="add-navbar-link" class="bg-blue-500 text-white px-3 py-2 rounded mt-4">Add Link</button>
        `,
        attributes: { class: "edit-navbar-links-modal" },
      });

      const updateLinks = () => {
        const inputs = document.querySelectorAll(".navbar-link-input");
        linksList.components().reset();
        inputs.forEach((input) => {
          linksList.append({
            tagName: "a",
            content: input.value,
            attributes: {
              href: "#",
              class:
                "text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium",
            },
          });
        });
      };

      document
        .getElementById("add-navbar-link")
        .addEventListener("click", () => {
          const container = document.getElementById("navbar-links-container");
          const newIndex = container.children.length;
          const newLinkHtml = `
          <div class="mb-2">
            <input type="text" class="navbar-link-input border rounded px-2 py-1" data-index="${newIndex}" value="New Link">
            <button class="remove-link bg-red-500 text-white px-2 py-1 rounded" data-index="${newIndex}">Remove</button>
          </div>
        `;
          container.insertAdjacentHTML("beforeend", newLinkHtml);
        });

      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-link")) {
          e.target.parentElement.remove();
        }
      });

      modal.onceClose(updateLinks);
    },
  });
  editor.DomComponents.addType("body", {
    model: {
      defaults: {
        tagName: "body",
        draggable: false,
        droppable: false,
        attributes: { class: "w-full overflow-x-hidden" },
        content: "", // Default content
        styles: `
        body {
          color: var(--color-text-secondary);
        }
        h1, h2, h3, h4, h5, h6 {
          color: var(--color-text-primary);
        }
        `,
      },
    },
  });
  editor.DomComponents.addType("generic-text", {
    extend: "text",
    model: {
      defaults: {
        tagName: "p",
        draggable: false,
        droppable: false,
        attributes: { class: "generic-text" },
        content: "", // Default content
      },
    },
  });
  editor.Components.addType("custom-image", {
    model: {
      defaults: {
        tagName: "img", // Image element
        attributes: {
          class: "w-full h-auto object-cover", // Default styling
          src: "", // Initially empty src
          imagesrc: "", // We will use cardimage as the source URL for the image
          alt: "Card image", // Default alt text
        },
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange); // Listen to attribute changes
        this.on("change:src", this.updateImage); // Listen for cardimage changes
        this.updateImage(); // Initial update
      },

      onAttributesChange() {
        const imagesrc = this.get("attributes")["src"]; // Get the cardimage attribute
        if (imagesrc) {
          this.updateImage(); // If cardimage exists, update the image
        }
      },

      updateImage() {
        const imagesrc = this.get("attributes").imagesrc || ""; // Get the image URL from the cardimage attribute

        // If there's a cardimage, set it as the 'src' of the image element
        if (imagesrc) {
          this.set("attributes", { ...this.get("attributes"), src: imagesrc });
        }
      },
    },
  });

  editor.DomComponents.addType("image-section", {
    model: {
      defaults: {
        tagName: "section",
        draggable: false,
        droppable: false,
        attributes: {
          class: "grid grid-cols-1 md:grid-cols-2 py-24 image-section ",
          sectiontype: "normal",
          direction: "left",
        },
        traits: [
          {
            type: "select",
            label: "Section Type",
            name: "sectiontype",
            options: [
              { id: "normal", name: "normal" },
              { id: "accent-1", name: "accent-1" },
              { id: "accent-2", name: "accent-2" },
              { id: "dark", name: "dark" },
            ],
            changeProp: 1,
          },
          {
            type: "select",
            label: "Image Position",
            name: "direction",
            options: [
              { id: "left", name: "Image Left" },
              { id: "right", name: "Image Right" },
            ],
            changeProp: 1,
          },
        ],
        styles: `
        .image-section>.item-container{
          padding: 2.5rem;
          padding-top: 4rem;
          padding-bottom: 4rem;
          place-items: center;
          justify-content: center; /* Centers horizontally */
  align-items: center;
  margin: auto
        }
        .image-section>img{
          width: 100%;
          min-height: 240px;
          max-height: 540px;
  height: auto; /* Maintain aspect ratio */
  object-fit: cover;
        }
        
        


        `,
      },
      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:sectiontype", this.updateSectionType);
        this.listenTo(this, "change:direction", this.updateDirection);
        // Initial updates
        this.updateSectionType();
        this.updateDirection();
      },

      onAttributesChange() {
        this.updateSectionType();
        this.updateDirection();
      },

      updateDirection() {
        const children = this.get("components"); // Get all child components
        if (children.length >= 2) {
          const firstChild = children.at(0); // First child (Image)
          const secondChild = children.at(1); // Second child (Container)

          // Determine the direction to set order classes
          const direction = this.get("attributes")["direction"] || "left"; // Default direction is left

          // Remove existing order classes
          firstChild.removeClass("order-1 order-2");
          secondChild.removeClass("order-1 order-2");

          // Assign order classes based on direction
          if (direction === "left") {
            firstChild.addClass("order-1"); // Image gets order-1
            secondChild.addClass("order-2"); // Container gets order-2
          } else if (direction === "right") {
            firstChild.addClass("order-2"); // Image gets order-2
            secondChild.addClass("order-1"); // Container gets order-1
          }
        }
      },

      updateSectionType() {
        const sectionType = this.get("attributes")["sectiontype"] || "normal"; // Get the current attribute for section type

        let classes = [
          "grid",
          "grid-cols-1",
          "md:grid-cols-2",
          "text-left",
          "image-section",
        ];

        // Modify class list based on section type
        switch (sectionType) {
          case "accent-1":
            classes.push("bg-accent-1"); // Add specific class for accent-1
            break;
          case "accent-2":
            classes.push("bg-accent-2"); // Add specific class for accent-2
            break;
          case "dark":
            classes.push("bg-section-dark");
            classes.push("light-text"); // Change to a dark background
            break;
          case "normal":
          default:
            classes.push("bg-section-light"); // Keep normal background
            break;
        }

        this.setClass(classes); // Set the classes dynamically
      },
    },
  });

  editor.DomComponents.addType("section", {
    model: {
      defaults: {
        tagName: "section",
        draggable: false,
        droppable: false,
        attributes: {
          class: "flex flex-col py-24 bg-slate-600 light-text px-8",
          sectiontype: "normal",
        },
        traits: [
          {
            type: "select",
            label: "Section Type",
            name: "sectiontype",
            options: [
              { id: "normal", name: "normal" },
              { id: "accent-1", name: "accent-1" },
              { id: "accent-2", name: "accent-2" },
              { id: "dark", name: "dark" },
            ],
            changeProp: 1,
          },
        ],
        styles: `
        
          .light-text h1,
          .light-text h2, 
          .light-text h3, 
          .light-text h4, 
          .light-text h5, 
          .light-text h6 {
            color: white;
        }

        .bg-section-dark{
          background-color: var(--color-section-dark)
        }

        .bg-section-light {
          background-color: var(--color-section-light);
      }
      
      .bg-accent-1 {
          background-color: var(--color-section-accent1);
      }

     
      
      .bg-accent-2 {
          background-color: var(--color-section-accent2);
      }

        .light-text{
          color:var(--color-text-light);
        }
          `,
        content: "Hero Subtitle",
      },
      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:sectiontype", this.updateSectionType);
        // Initial update of section type
        this.updateSectionType();
      },

      onAttributesChange() {
        const sectionType = this.get("attributes")["sectiontype"];
        if (sectionType) {
          this.updateSectionType();
        }
      },

      updateSectionType() {
        const sectionType = this.get("attributes")["sectiontype"] || "normal"; // Get the current attribute for section type

        let classes = ["flex", "flex-col", "py-28"];

        // Modify class list based on section type
        switch (sectionType) {
          case "accent-1":
            classes.push("bg-accent-1"); // Add specific class for accent-1
            break;
          case "accent-2":
            classes.push("bg-accent-2"); // Add specific class for accent-2
            break;
          case "dark":
            classes.push("bg-section-dark");
            classes.push("light-text"); // Change to a dark background
            break;
          case "normal":
          default:
            classes.push("bg-section-light"); // Keep normal background
            break;
        }

        this.setClass(classes); // Set the classes dynamically
      },
    },
  });

  editor.DomComponents.addType("container", {
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class:
            "lg:max-w-6xl mx-auto text-center flex flex-col items-center container",
        },

        content: "Heading",
      },
    },
  });

  editor.DomComponents.addType("content-title", {
    extend: "text",
    model: {
      defaults: {
        tagName: "h2",
        draggable: true,
        droppable: false,
        attributes: {
          class:
            "text-3xl max-w-xl lg:text-5xl font-bold font-primary mb-10 capitalize",
        },

        content: "Hero Subtitle",
      },
    },
  });
  editor.DomComponents.addType("content-subtitle", {
    extend: "text",
    model: {
      defaults: {
        tagName: "h5",
        draggable: true,
        droppable: false,
        attributes: {
          class: "text-lg lg:text-xl font-secondary content-subtitle",
        },
        styles: `
          .content-subtitle{
            color: var(--color-primary-light) !important;
            text-transform: capitalize;
          }
          `,
        content: "Hero Subtitle",
      },
    },
  });
  editor.DomComponents.addType("content-heading", {
    extend: "text",
    model: {
      defaults: {
        tagName: "h5",
        draggable: true,
        droppable: false,
        attributes: {
          class: "text-xl lg:text-2xl font-bold font-primary pt-1 mb-2",
        },

        content: "Hero Subtitle",
      },
    },
  });
  editor.DomComponents.addType("hero-text-title", {
    extend: "text",
    model: {
      defaults: {
        tagName: "h1",
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "hero-text-title pb-10 md:max-w-2xl text-5xl lg:text-6xl font-primary",
        },
        styles: `
        .hero-text-title{
        font-family: Inter;
        text-transform: capitalize;
        color: rgb(255, 255, 255);
        text-decoration: none;
        white-space: normal;
        font-weight: 600;}
        `,
        content: "Hero Title",
      },
    },
  });

  editor.DomComponents.addType("hero-text-subtitle", {
    extend: "text",
    model: {
      defaults: {
        tagName: "h3",
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "hero-text-subtitle md:max-w-2xl text-md lg:text-lg leading-relaxed pb-4 font-primary",
        },
        styles: `
        .hero-text-subtitle{
        font-family: Inter;
        text-transform: capitalize;
        color: rgb(255, 255, 255);
        text-decoration: none;
        white-space: normal;
        font-weight: 500;}
        `,
        content: "Hero Subtitle",
      },
    },
  });

  editor.Components.addType("hero-section-container", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class: "lg:max-w-4xl  flex flex-col  container px-4",
        },
      },
    },
  });

  editor.Components.addType("blank-container", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: true,
        attributes: {
          class: "item-container",
        },
      },
    },
  });

  editor.Components.addType("row-container", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: true,
        attributes: {
          class:
            "flex flex-row flex-wrap justify-center items-center w-max justify-start gap-x-6 gap-y-4",
        },
      },
    },
  });

  editor.Components.addType("button-primary", {
    model: {
      defaults: {
        tagName: "button",
        droppable: false,
        attributes: {
          class:
            "button-primary transition flex flex-row justify-center items-center px-8 py-4 mx-2 my-2",
        },
        styles: `
        .button-primary{
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2px;
          background-color:var(--color-primary);
          color: white !important;
        }
        .button-primary:hover{
          background-color:var(--color-primary-dark);
        }
        `,
      },
    },
  });

  editor.Components.addType("button-secondary", {
    model: {
      defaults: {
        tagName: "button",
        droppable: false,
        attributes: {
          class:
            "button-secondary transition flex flex-row justify-center items-center px-8 py-4 mx-2 my-2",
        },
        styles: `
        .button-secondary{
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2px;
         box-shadow:inset 0px 0px 0px 1px white;
        }
        .button-secondary:hover{
          border: 0;
          box-shadow:inset 0px 0px 0px 1px var(--color-primary);
          background-color:var(--color-primary);
        }
        `,
      },
    },
  });

  editor.Components.addType("two-columns", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "grid md:grid-cols-2 gap-5 lg:gap-10 w-full text-left justify-center px-4 space-y-8 sm:space-y-0",
          offset: "left",
        },
        traits: [
          {
            type: "select",
            label: "Offset",
            name: "offset",
            options: [
              { id: "none", name: "None" },
              { id: "left", name: "Left" },
              { id: "right", name: "Right" },
            ],
            changeProp: 1,
          },
        ],
      },
      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:offset", this.updateOffset);
        // Initial update of background image
        this.updateOffset();
      },
      onAttributesChange() {
        const offset = this.get("attributes")["offset"];
        if (offset) {
          this.updateOffset();
        }
      },
      updateOffset() {
        const offset = this.get("attributes").offset || "none"; // Get the current attribute for offset

        let classes = [
          "grid",
          "gap-5",
          "lg:gap-10",
          "w-full",
          "text-left",
          "justify-center",
          "px-4",
          "space-y-8",
          "sm:space-y-0",
        ];

        // Modify class list based on offset value
        if (offset === "left") {
          classes.push("md:grid-cols-12");
          classes.push(
            "md:[&>*:first-child]:col-span-7",
            "md:[&>*:last-child]:col-span-5"
          );
        } else if (offset === "right") {
          classes.push("md:grid-cols-12");
          classes.push(
            "md:[&>*:first-child]:col-span-5",
            "md:[&>*:last-child]:col-span-7"
          );
        } else {
          classes.push("md:grid-cols-2");
        }

        this.setClass(classes); // Set the classes dynamically
      },
    },
  });

  editor.Components.addType("visuals-full-image", {
    model: {
      defaults: {
        tagName: "div",
        droppable: false,
        attributes: {
          class:
            "w-full h-[300px] aspect-w-16 aspect-h-9 bg-cover bg-center visuals-full-image",
        },
        styles: `.visuals-full-image{background-image: url('http://hompark.themezinho.net/wp-content/uploads/2020/03/gallery-thumb02.jpg');}`,
      },
    },
  });

  editor.Components.addType("paragraph", {
    extend: "text",
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class: "mb-3 para",
        },
      },
    },
  });

  editor.Components.addType("hero-section", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "h-screen flex items-center justify-center bg-cover bg-center p-4 bg-black hero-section",
          "bg-image": "https://example.com/default-image.jpg", // Initial background image URL
          centerLayout: true,
        },
        components: [
          {
            type: "hero-section-container",
            components: [
              { type: "hero-text-title", content: "Hero Title" },
              { type: "hero-text-subtitle", content: "Hero Subtitle" },
            ],
          },
        ],
        styles: `
        .hero-section *{
          z-index:2;
          color:white!important
        }
        .hero-section {
          z-index:2
          width: 100%,
          height: 100vh,
          
          color: white,
          position: relative,
          background-size: cover;
          background-position: center;
          color: white;
        }
        .hero-section::before {
          content: "";
          position: absolute;
          z-index: 1,
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(161deg, #26282b 0%, #26282b 49%, var(--color-primary) 100%);
          opacity: 0.65;
          pointer-events: none;
        }
      `,
        traits: [
          {
            type: "text",
            label: "Background Image URL",
            name: "bg-image",
            changeProp: 1,
          },
          {
            type: "checkbox", // Checkbox for boolean trait
            label: "Center Layout",
            name: "center-layout",
            valueTrue: true, // Value when checked
            valueFalse: false, // Value when unchecked
            changeProp: 1,
          },
        ],
        propagate: ["bg-image", "center-layout"],
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:bg-image", this.updateBackgroundImage);
        this.listenTo(this, "change:layout", this.updateLayout);
        // Initial update of background image
        this.updateBackgroundImage();
        this.updateLayout();
      },

      onAttributesChange() {
        const bgImage = this.get("attributes")["bg-image"];
        if (bgImage) {
          this.updateBackgroundImage();
        }
        const layout = this.get("attributes").centerLayout;
        if (layout !== undefined) {
          this.updateLayout();
        }
      },

      updateBackgroundImage() {
        const url = this.get("attributes")["bg-image"] || "";
        const style = { ...this.get("style") };

        style.background = `linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('${url}') no-repeat center center/cover`;

        this.set({ style });
      },

      updateLayout() {
        const layout = this.get("attributes").centerLayout;

        // Get the child component (hero-section-container)
        const container = this.components().find(
          (comp) => comp.get("type") === "hero-section-container"
        );

        if (!container) {
          console.warn("hero-section-container not found");
          return;
        }

        // Get current classes
        const currentClasses = container.getClasses();

        // Function to toggle a class
        const toggleClass = (className, add) => {
          if (add && !currentClasses.includes(className)) {
            currentClasses.push(className);
          } else if (!add) {
            const index = currentClasses.indexOf(className);
            if (index > -1) {
              currentClasses.splice(index, 1);
            }
          }
        };

        // Toggle classes based on layout
        toggleClass("text-center", layout);
        toggleClass("items-center", layout);

        // Set the updated classes
        container.setClass(currentClasses);

        // Trigger a change event to update the view
        container.trigger("change:classes");
      },
    },
    view: {
      ...withEditButton,
      // Custom click handler for hero section
      onEditButtonClick(e) {
        console.log("Hero section edit button clicked");
        // Add your custom edit logic here
      },
    },
  });

  const withEditButton = {
    init() {
      this.handleHover = this.handleHover.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);
    },

    onRender() {
      this.el.addEventListener("mouseover", this.handleHover);
      this.el.addEventListener("mouseleave", this.handleMouseLeave);
    },

    createEditButton() {
      const btn = document.createElement("button");
      btn.className =
        "gjs-edit-btn text-gray-900 border-gray-300 bg-white absolute bg-opacity-10 bg-blur-md bg-clip-padding backdrop-blur-md border rounded-3xl shadow-lg h-[30px] w-[30px] z-10";
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-3 md:w-4 h-3 md:h-4 mx-auto">
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
        </svg>
      `;
      return btn;
    },

    handleHover(e) {
      e.stopPropagation();
      const editor = this.em.get("Editor");

      // Remove any existing edit buttons
      const existing = editor.getContainer().querySelector(".gjs-edit-btn");
      if (existing) existing.remove();

      const btn = this.createEditButton();

      // Position the button relative to the component
      const rect = this.el.getBoundingClientRect();

      btn.style.position = "fixed";
      btn.style.top = `${rect.top + rect.height / 2 - 15}px`;
      btn.style.left = `${rect.right - 35}px`;

      // Add click handler
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Allow custom click handler if provided
        if (typeof this.onEditButtonClick === "function") {
          this.onEditButtonClick(e);
        }
      });

      // Add to editor
      editor.getContainer().appendChild(btn);
    },

    handleMouseLeave(e) {
      const relatedTarget = e.relatedTarget;
      if (!relatedTarget?.closest(".gjs-edit-btn")) {
        const editor = this.em.get("Editor");
        const btn = editor.getContainer().querySelector(".gjs-edit-btn");
        if (btn) btn.remove();
      }
    },

    remove() {
      this.el.removeEventListener("mouseover", this.handleHover);
      this.el.removeEventListener("mouseleave", this.handleMouseLeave);
      const editor = this.em.get("Editor");
      const btn = editor.getContainer().querySelector(".gjs-edit-btn");
      if (btn) btn.remove();
    },
  };
  editor.DomComponents.addType("navbar", {
    model: {
      defaults: {
        tagName: "nav",
        draggable: true,
        droppable: false,
        attributes: { class: "bg-white shadow" },
        components: [
          {
            tagName: "div",
            attributes: { class: "container mx-auto px-4 sm:px-6 lg:px-8" },
            components: [
              {
                tagName: "div",
                attributes: { class: "flex items-center justify-between h-16" },
                components: [
                  {
                    tagName: "div",
                    attributes: { class: "flex-shrink-0" },
                    components: [
                      {
                        tagName: "img",
                        attributes: {
                          class: "h-8 w-auto",
                          src: "https://via.placeholder.com/150x50?text=Logo",
                          alt: "Logo",
                        },
                      },
                    ],
                  },
                  {
                    tagName: "div",
                    attributes: { class: "hidden md:block" },
                    components: [
                      {
                        tagName: "div",
                        attributes: {
                          class: "ml-10 flex items-baseline space-x-4",
                        },
                        components: [
                          {
                            tagName: "a",
                            attributes: {
                              href: "#",
                              class:
                                "text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium",
                            },
                            components: [
                              {
                                type: "text",
                                content: "Home",
                              },
                            ],
                          },
                          {
                            tagName: "a",
                            content: "About",
                            attributes: {
                              href: "#",
                              class:
                                "text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium",
                            },
                          },
                          {
                            tagName: "a",
                            content: "Contact",
                            attributes: {
                              href: "#",
                              class:
                                "text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium",
                            },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    // Hamburger menu button for mobile
                    tagName: "div",
                    attributes: {
                      class: "md:hidden flex items-center",
                    },
                    components: [
                      {
                        tagName: "button",
                        attributes: {
                          class:
                            "inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-200 focus:outline-none focus:bg-gray-200",
                          "aria-expanded": "false",
                          "aria-label": "Toggle Menu",
                          // Adjusting to use 'this' for correct scope binding
                          onclick: "toggleMobileMenu(event);",
                        },
                        components: [
                          {
                            tagName: "span",
                            attributes: { class: "sr-only" },
                            content: "Open main menu",
                          },
                          {
                            tagName: "svg",
                            attributes: {
                              class: "block h-6 w-6",
                              xmlns: "http://www.w3.org/2000/svg",
                              fill: "none",
                              viewBox: "0 0 24 24",
                              stroke: "currentColor",
                            },
                            components: [
                              {
                                tagName: "path",
                                attributes: {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M4 6h16M4 12h16M4 18h16",
                                },
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              // Mobile menu that appears when hamburger button is clicked
              {
                tagName: "div",
                attributes: {
                  class: "hidden md:hidden transition duration-200 ease-in-out",
                  id: "mobile-menu",
                },
                components: [
                  {
                    tagName: "div",
                    attributes: {
                      class: "px-2 pt-2 pb-3 space-y-1 sm:px-3",
                    },
                    components: [
                      {
                        tagName: "a",
                        attributes: {
                          href: "#",
                          class:
                            "block text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium",
                        },
                        content: "Home",
                      },
                      {
                        tagName: "a",
                        attributes: {
                          href: "#",
                          class:
                            "block text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium",
                        },
                        content: "About",
                      },
                      {
                        tagName: "a",
                        attributes: {
                          href: "#",
                          class:
                            "block text-gray-800 hover:bg-gray-200 px-3 py-2 rounded-md text-base font-medium",
                        },
                        content: "Contact",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        traits: [
          {
            type: "select",
            name: "navbarPosition",
            label: "Navbar Position",
            options: [
              { value: "", name: "Static" },
              { value: "fixed top-0 left-0 right-0 z-50", name: "Fixed" },
              { value: "sticky top-0 z-50", name: "Sticky" },
            ],
          },
          {
            type: "select",
            name: "logoPosition",
            label: "Logo Position",
            options: [
              { value: "justify-start", name: "Left" },
              { value: "justify-center", name: "Center" },
              { value: "justify-end", name: "Right" },
            ],
          },
          {
            type: "text",
            name: "logoSrc",
            label: "Logo Image URL",
          },
        ],
      },

      init() {
        this.on("change:attributes", this.handleAttrChange);
      },

      handleAttrChange() {
        const attrs = this.getAttributes();
        this.updateNavbarPosition(attrs.navbarPosition);
        this.updateLogoPosition(attrs.logoPosition);
        this.updateLogo(attrs.logoSrc);
      },

      updateNavbarPosition(positionClass) {
        this.removeClass("fixed top-0 left-0 right-0 z-50 sticky top-0 z-50");
        this.addClass(positionClass);
      },

      updateLogoPosition(positionClass) {
        const flexContainer = this.components().at(0).components().at(0);
        flexContainer.removeClass("justify-start justify-center justify-end");
        flexContainer.addClass(positionClass);
      },

      updateLogo(src) {
        const logoImg = this.find("img")[0];
        if (logoImg) {
          logoImg.set("attributes", { ...logoImg.get("attributes"), src });
        }
      },
    },

    view: {
      events: {
        mouseenter: "onMouseEnter",
        mouseleave: "onMouseLeave",
      },

      onRender() {
        const linksList = this.model.find(".ml-10.flex")[0];
        if (linksList) {
          linksList.set("droppable", true);
          linksList.set("draggable", ".text-gray-800");
        }
        this.renderEditButton();
      },

      renderEditButton() {
        const button = document.createElement("button");
        button.innerHTML = "Edit Links";
        button.className =
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow hidden";
        button.onclick = this.onEditButtonClick.bind(this);
        this.editButton = button;
        this.el.style.position = "relative";
        this.el.appendChild(button);
      },

      onMouseEnter() {
        if (this.editButton) {
          this.editButton.classList.remove("hidden");
        }
      },

      onMouseLeave() {
        if (this.editButton) {
          this.editButton.classList.add("hidden");
        }
      },

      onEditButtonClick() {
        const editor = this.model.em;
        editor.Commands.run("edit-navbar-links", { model: this.model });
      },
    },
  });
  editor.Components.addType("card-list", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class: "flex overflow-x-auto space-x-4 p-4", // Default class for scrolling list
        },
        traits: [
          {
            type: "select",
            label: "Layout",
            name: "layout",
            options: [
              { id: "scroll", name: "Horizontal Scroll" },
              { id: "grid", name: "Grid" },
            ],
            changeProp: 1, // Indicate a change will occur
          },
        ],
      },

      init() {
        this.on("change:layout", this.updateLayout);
        this.updateLayout(); // Initial layout update
      },

      updateLayout() {
        const layout = this.get("attributes")["layout"] || "scroll"; // Default to scroll layout
        let classes;

        if (layout === "grid") {
          // Update classes for grid layout
          classes = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4";
        } else {
          // Default to horizontal scrolling
          classes = "flex overflow-x-auto space-x-4 p-4";
        }

        this.set({ attributes: { class: classes } }); // Set the updated classes
      },
    },
  });

  editor.Components.addType("card", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class: "max-w-sm text-left card", // Default class for scrolling list
          sectiontype: "normal",
        },
        traits: [],
        styles: `
          .card h5{
            margin-top: 12px;
            font-weight: 600
          }
          .card img{
            height: 260px !important;
          }
          .card .para{
            padding-bottom: 2rem;
          }

          
        `,
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
      },

      onAttributesChange() {},
    },
  });
  // Corrected JavaScript function to toggle the mobile menu
  function toggleMobileMenu(event) {
    // Fetch the button's closest nav element and then find the menu within it
    const button = event.target.closest("button");
    const menu = button.closest("nav").querySelector("#mobile-menu");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  }

  // JavaScript function to toggle the mobile menu
  function toggleMobileMenu(button) {
    const menu = button.closest("nav").querySelector("#mobile-menu");
    if (menu) {
      menu.classList.toggle("hidden");
    }
  }

  // Modify the edit-navbar-links command
};
