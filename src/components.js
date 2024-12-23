export default (editor, options) => {
  editor.DomComponents.addType("navbar", {
    isComponent: el => el.tagName === 'NAV',
    model: {
      defaults: {
        tagName: 'nav',
        draggable: true,
        droppable: true,
        traits: [],
        attributes: {
          class: 'bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50 py-4'
        },
        content: `
          <div class="container mx-auto px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <span class="text-2xl font-bold text-white">BytePlexure</span>
              </div>
              <div class="flex items-center space-x-8">
                <a href="#" class="text-white hover:text-gray-300 px-3 py-2 text-base font-medium">Test Nav 1</a>
                <a href="#" class="text-white hover:text-gray-300 px-3 py-2 text-base font-medium">Test Nav 2</a>
                <a href="#" class="text-white hover:text-gray-300 px-3 py-2 text-base font-medium">Test Nav 3</a>
              </div>
            </div>
          </div>
        `
      }
    }
  });

  // Add this to your GrapesJS editor initialization
  const withEditButton3 = {
    init() {
      this.componentEditHandlers = {
        // Default handler for generic components
        default: {
          createModalContent(component) {
            const container = document.createElement("div");
            container.innerHTML = `
              <div class="space-y-4">
                <div>
                  <label class="block mb-2">Component Type</label>
                  <input type="text" value="${component.get(
              "type"
            )}" class="w-full border p-2 rounded" disabled>
                </div>
                <div>
                  <label class="block mb-2">Content</label>
                  <textarea class="w-full border p-2 rounded component-content" rows="4">${component.get('content') || ''}</textarea>
                </div>
              </div>
            `;

            return {
              container,
              getData() {
                const content = container.querySelector(".component-content").value;
                return { content };
              },
            };
          },
        },

        // Text components handler
        text: {
          createModalContent(component) {
            const container = document.createElement("div");
            container.innerHTML = `
              <div class="space-y-4">
                <div>
                  <label class="block mb-2">Content</label>
                  <textarea class="w-full border p-2 rounded text-content" rows="4">${component.get('content') || ''}</textarea>
                </div>
              </div>
            `;

            return {
              container,
              getData() {
                return {
                  content: container.querySelector(".text-content").value,
                };
              },
            };
          },
        },

        // Button handler
        button: {
          createModalContent(component) {
            const container = document.createElement("div");
            container.innerHTML = `
              <div class="space-y-4">
                <div>
                  <label class="block mb-2">Button Text</label>
                  <input type="text" class="w-full border p-2 rounded button-text" value="${component.get('content') || ''}">
                </div>
              </div>
            `;

            return {
              container,
              getData() {
                return {
                  content: container.querySelector(".button-text").value,
                };
              },
            };
          },
        },

        // Specific handlers for different component types
        image: {
          createModalContent(component) {
            const container = document.createElement("div");
            const currentImage = component.getAttributes().src || "";

            container.innerHTML = `
              <div class="space-y-4">
                <div>
                  <label class="block mb-2">Image Preview</label>
                  <img src="${currentImage}" alt="Preview" class="w-full h-48 object-cover rounded-lg shadow-sm mb-4">
                  <div class="absolute inset-0 bg-black bg-opacity-50 hidden items-center justify-center" id="upload-loading">
                    <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                </div>
               
                <div class="flex items-center justify-center w-full">
                  <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-rose-300 border-dashed rounded-lg cursor-pointer bg-rose-50 hover:bg-rose-100">
                    <div class="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg class="w-8 h-8 mb-4 text-rose-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2"/>
                      </svg>
                      <p class="mb-2 text-sm text-rose-500"><span class="font-semibold">Click to upload</span></p>
                      <p class="text-xs text-rose-500">PNG, JPG or JPEG</p>
                    </div>
                    <input id="image-upload" type="file" class="hidden" accept="image/*" />
                  </label>
                </div>
 
                <div>
                  <label class="block mb-2">Alt Text</label>
                  <input type="text" class="w-full border p-2 rounded image-alt" value="${component.getAttributes().alt || ""
              }">
                </div>
              </div>
            `;

            let selectedFile = null;
            const previewImg = container.querySelector("img");
            const loadingEl = container.querySelector("#upload-loading");
            const fileInput = container.querySelector("#image-upload");

            fileInput.addEventListener("change", (e) => {
              const file = e.target.files[0];
              if (!file) return;

              const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
              if (!allowedTypes.includes(file.type)) {
                alert("Please select a valid image file (JPG, JPEG or PNG)");
                return;
              }

              selectedFile = file;
              const reader = new FileReader();
              reader.onload = (e) => {
                previewImg.src = e.target.result;
              };
              reader.readAsDataURL(file);
            });

            return {
              container,
              async getData() {
                const altText = container.querySelector(".image-alt").value;

                if (!selectedFile) {
                  return {
                    attributes: {
                      src: component.getAttributes().src,
                      alt: altText,
                    },
                  };
                }

                try {
                  loadingEl.classList.remove("hidden");
                  loadingEl.classList.add("flex");

                  const fileExt = selectedFile.name
                    .split(".")
                    .pop()
                    .toLowerCase();
                  const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;

                  const presignedResponse = await fetch(
                    "https://dev.byteai.bytesuite.io/api/get-presigned-url",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer YOUR_TOKEN",
                      },
                      body: JSON.stringify({
                        file_name: uniqueFileName,
                        file_type: selectedFile.type,
                      }),
                    }
                  );

                  const { file_url, presigned_url } =
                    await presignedResponse.json();

                  await fetch(presigned_url, {
                    method: "PUT",
                    body: selectedFile,
                    headers: {
                      "Content-Type": selectedFile.type,
                    },
                  });

                  const imageUrl = file_url.split("?")[0];

                  return {
                    attributes: {
                      src: imageUrl,
                      alt: altText,
                    },
                  };
                } catch (error) {
                  console.error("Error uploading image:", error);
                  alert("Failed to upload image. Please try again.");
                  return null;
                } finally {
                  loadingEl.classList.add("hidden");
                  loadingEl.classList.remove("flex");
                }
              },
            };
          },
        },
      };
    },

    onRender() {
      const editor = this.em.get("Editor");
      editor.on("component:select", this.handleSelect.bind(this));
      editor.on("component:deselect", this.handleDeselect.bind(this));
    },

    createModal(component) {
      const componentType = component.get("type") || "default";
      const handler =
        this.componentEditHandlers[componentType] ||
        this.componentEditHandlers.default;

      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center";

      const modalContent = handler.createModalContent(component);

      modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
          <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
            &times;
          </button>
          <h2 class="text-xl font-semibold mb-4">Edit ${componentType} Component</h2>
          <div class="modal-body"></div>
          <div class="mt-4 flex justify-end space-x-2">
            <button class="cancel-modal px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button class="save-modal px-4 py-2 bg-blue-500 text-white rounded">Save</button>
          </div>
        </div>
      `;

      const modalBody = modal.querySelector(".modal-body");
      modalBody.appendChild(modalContent.container);

      // Event Listeners
      const closeBtn = modal.querySelector(".close-modal");
      const cancelBtn = modal.querySelector(".cancel-modal");
      const saveBtn = modal.querySelector(".save-modal");

      const closeModal = () => modal.remove();
      closeBtn.addEventListener("click", closeModal);
      cancelBtn.addEventListener("click", closeModal);

      saveBtn.addEventListener("click", () => {
        const editData = modalContent.getData();
        if (editData) {
          // Apply changes to the component
          if (editData.attributes) {
            component.setAttributes(editData.attributes);
          }
          if (editData.content) {
            component.set("content", editData.content);
          }
          closeModal();
        }
      });

      return modal;
    },

    handleSelect(component) {
      const btn = this.createEditButton();
      const rect = component.view.el.getBoundingClientRect();

      btn.style.position = "fixed";
      btn.style.top = `${rect.top + rect.height / 2 - 15}px`;
      btn.style.left = `${rect.right - 35}px`;

      btn.addEventListener("click", () => {
        const modal = this.createModal(component);
        document.body.appendChild(modal);
      });

      const editor = this.em.get("Editor");
      editor.getContainer().appendChild(btn);
    },

    handleDeselect(component) {
      const editor = this.em.get("Editor");
      const btn = editor.getContainer().querySelector(".gjs-edit-btn");
      if (btn) btn.remove();
    },

    createEditButton() {
      const btn = document.createElement("button");
      btn.className =
        "gjs-edit-btn text-gray-900 border-gray-300 bg-white absolute bg-opacity-10 bg-blur-md bg-clip-padding backdrop-blur-md border rounded-3xl shadow-lg h-[30px] w-[30px] z-50";
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-3 md:w-4 h-3 md:h-4 mx-auto">
          <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
        </svg>
      `;
      return btn;
    },

    remove() {
      const editor = this.em.get("Editor");
      editor.off("component:select", this.handleSelect);
      editor.off("component:deselect", this.handleDeselect);

      const btn = editor.getContainer().querySelector(".gjs-edit-btn");
      if (btn) btn.remove();
    },
  };

  // Register the withEditButton3 trait
  editor.DomComponents.addType('default', {
    model: {
      defaults: {
        traits: [withEditButton3]
      }
    }
  });

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

  // Add component types
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
        traits: [withEditButton3],
        handlerType: 'text', // Specify handler type
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
        traits: [withEditButton3],
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
        traits: [withEditButton3],
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
        traits: [withEditButton3],
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
        traits: [withEditButton3],
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
        tagName: "a", // Changed to anchor tag for proper linking
        droppable: false,
        attributes: {
          class:
            "button-primary transition flex flex-row justify-center items-center px-8 py-4 mx-2 my-2",
          href: localStorage.getItem('button-href') || "#", // Get href from localStorage or use default
          content: localStorage.getItem('button-text') || "Button Text" // Get text from localStorage or use default
        },
        styles: `
        .button-primary{
          font-size: 12px;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2px;
          background-color:var(--color-primary);
          color: white !important;
          text-decoration: none;
          cursor: pointer;
        }
        .button-primary:hover{
          background-color:var(--color-primary-dark);
        }
        `,
        traits: [
          {
            type: "text",
            label: "Button Text",
            name: "content",
            changeProp: 1
          },
          {
            type: "text",
            label: "Link URL",
            name: "href",
            changeProp: 1
          }
        ],
        propagate: ["content", "href"],
      },

      init() {
        this.listenTo(this, "change:content", this.updateContent);
        this.listenTo(this, "change:href", this.updateHref);
        this.updateContent();
        this.updateHref();
      },

      updateContent() {
        const content = this.get("content") || "Button Text";
        localStorage.setItem('button-text', content); // Save to localStorage
        this.components(content);
      },

      updateHref() {
        const href = this.get("href") || "#";
        localStorage.setItem('button-href', href); // Save to localStorage
        this.set("attributes", { ...this.get("attributes"), href });
      }
    },
    view: {
      init() {
        this.listenTo(this.model, "active", this.onActive);
        this.listenTo(this.model, "change:content", this.updateContent);
      },

      updateContent() {
        const content = this.model.get("content");
        if (content) {
          this.el.innerHTML = content;
        }
      },

      onRender() {
        this.updateEditButton();
        this.updateContent();
      },

      createModal(component) {
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center";

        const currentText = component.get("content") || "";
        const currentHref = component.get("attributes").href || "";

        modal.innerHTML = `
          <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Edit Button</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Button Text</label>
                <input type="text" id="button-text" value="${currentText}"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Link URL</label>
                <input type="text" id="button-href" value="${currentHref}"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500">
              </div>
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button class="cancel-modal px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button class="save-modal px-4 py-2 bg-rose-500 text-white rounded">Save</button>
            </div>
          </div>
        `;

        const closeBtn = modal.querySelector(".close-modal");
        const cancelBtn = modal.querySelector(".cancel-modal");
        const saveBtn = modal.querySelector(".save-modal");
        const textInput = modal.querySelector("#button-text");
        const hrefInput = modal.querySelector("#button-href");

        const closeModal = () => modal.remove();
        closeBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);

        saveBtn.addEventListener("click", () => {
          const newText = textInput.value.trim();
          const newHref = hrefInput.value.trim();

          if (newText) {
            component.set("content", newText);
            component.setAttributes({
              ...component.getAttributes(),
              href: newHref || "#"
            });
            this.updateContent();
          }

          closeModal();
        });

        return modal;
      },

      onEditButtonClick() {
        const modal = this.createModal(this.model);
        document.body.appendChild(modal);
      },

      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
      },

      handleSelect(selectedComponent) {
        if (selectedComponent !== this.model) {
          this.removeEditButton();
          return;
        }

        const btn = this.createEditButton();
        const rect = this.el.getBoundingClientRect();

        btn.style.position = "absolute";
        btn.style.top = `${rect.top + rect.height / 2 - 15}px`;
        btn.style.right = `${rect.right - 35}px`;

        this.el.appendChild(btn);
      },

      handleDeselect() {
        this.removeEditButton();
      },

      createEditButton() {
        if (this.editButton) return this.editButton;

        const btn = document.createElement("button");
        btn.className = "gjs-edit-btn text-gray-900 border-gray-300 bg-white absolute bg-opacity-10 bg-blur-md bg-clip-padding backdrop-blur-md border rounded-3xl shadow-lg h-[30px] w-[30px] z-50";
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-2 md:w-3 h-2 md:h-3 mx-auto text-yellow-500">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
          </svg>
        `;

        btn.addEventListener("click", this.onEditButtonClick.bind(this));

        this.editButton = btn;
        return btn;
      },

      removeEditButton() {
        if (this.editButton) {
          this.editButton.remove();
          this.editButton = null;
        }
      }
    }
  });


  editor.Components.addType("button-secondary", {
    model: {
      defaults: {
        tagName: "button",
        droppable: false,
        traits: [withEditButton3],
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
        traits: [withEditButton3],
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
      init() {
        this.componentEditHandlers = {
          // Default handler for generic components
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              const currentBgImage =
                component.get("attributes")["bg-image"] || "";


              container.innerHTML = `
                <div class="space-y-4">
                  <div class="flex flex-col gap-4">
                    <div class="relative">
                      <img src="${currentBgImage}" alt="Current background"
                        class="w-full h-48 object-cover rounded-lg shadow-sm" />
                      <div class="absolute inset-0 bg-black bg-opacity-50 hidden items-center justify-center" id="upload-loading">
                        <svg class="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </div>
                   
                    <div class="flex items-center justify-center w-full">
                      <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-rose-300 border-dashed rounded-lg cursor-pointer bg-rose-50 hover:bg-rose-100">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg class="w-8 h-8 mb-4 text-rose-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2"/>
                          </svg>
                          <p class="mb-2 text-sm text-rose-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                          <p class="text-xs text-rose-500">PNG, JPG or JPEG</p>
                        </div>
                        <input id="bg-image-upload" type="file" class="hidden" accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>
              `;


              let selectedFile = null;
              const previewImg = container.querySelector("img");
              const loadingEl = container.querySelector("#upload-loading");


              // Handle file selection for preview
              const fileInput = container.querySelector("#bg-image-upload");
              fileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (!file) return;


                // Validate file type
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
                if (!allowedTypes.includes(file.type)) {
                  alert("Please select a valid image file (JPG, JPEG or PNG)");
                  return;
                }


                selectedFile = file;
                const reader = new FileReader();


                reader.onload = (e) => {
                  previewImg.src = e.target.result;
                };


                reader.readAsDataURL(file);
              });


              return {
                container,
                async getData() {
                  if (!selectedFile) {
                    return {
                      attributes: {
                        "bg-image": component.get("attributes")["bg-image"],
                      },
                    };
                  }


                  try {
                    loadingEl.classList.remove("hidden");
                    loadingEl.classList.add("flex");

                    // Generate unique filename with proper extension
                    const fileExt = selectedFile.name
                      .split(".")
                      .pop()
                      .toLowerCase();
                    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;

                    // Get presigned URL with correct content type
                    const presignedResponse = await fetch(
                      "https://dev.byteai.bytesuite.io/api/get-presigned-url",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMWMwZWMzMS0wZDIzLTRiMDQtYTdkOS04OTRiOWE0NTNjYWIiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzMzMzg2MTUzLCJpYXQiOjE3MzI3ODEzNTMsImVtYWlsIjoic2lkZGhhcnRoLnNhYmxlNDYxOEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIiwiZ29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMU3BETjlQbS1DaDdGazl2RnJrVkhVWXRHRGV3NVJqSTJUbWMweFg5WnpDZGxoNjBNMj1zOTYtYyIsImVtYWlsIjoic2lkZGhhcnRoLnNhYmxlNDYxOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU2lkZGhhcnRoIFNhYmFsZSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTaWRkaGFydGggU2FiYWxlIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jTFNwRE45UG0tQ2g3Rms5dkZya1ZIVVl0R0RldzVSakkyVG1jMHhYOVp6Q2RsaDYwTTI9czk2LWMiLCJwcm92aWRlcl9pZCI6IjEwNzcyMjEyMzY4ODM1OTAxNzA2NyIsInN1YiI6IjEwNzcyMjEyMzY4ODM1OTAxNzA2NyJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzMyNzgxMzUzfV0sInNlc3Npb25faWQiOiJiOGFhODJhNi1mOGJlLTQ1ZGEtYTMzOC1jODdkOGRiZWRjMjMiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.wT4ONOL3peUJwIHXyJpR4znAFXwcSAW6zFe5pE6YmFQ",
                        },
                        body: JSON.stringify({
                          file_name: uniqueFileName,
                          file_type: selectedFile.type,
                        }),
                      }
                    );

                    const { file_url, presigned_url } = await presignedResponse.json();

                    // Upload to S3 using PUT request with correct headers
                    const uploadResponse = await fetch(presigned_url, {
                      method: "PUT",
                      headers: {
                        "Content-Type": selectedFile.type,
                      },
                      body: selectedFile,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error(`Upload failed with status: ${uploadResponse.status}`);
                    }

                    // Get clean URL without query params
                    const imageUrl = file_url.split("?")[0];

                    // First set the new bg-image attribute
                    component.setAttributes({ "bg-image": imageUrl });

                    // Then call updateBackgroundImage to refresh the view
                    component.updateBackgroundImage();

                    // Return the new attributes
                    return {
                      attributes: {
                        "bg-image": imageUrl,
                      },
                    };
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    // Log more detailed error information
                    if (error.response) {
                      console.error("Response status:", error.response.status);
                      console.error("Response data:", await error.response.text());
                    }
                    // Show more specific error message to user
                    let errorMessage = "Failed to upload image. ";
                    if (error.message) {
                      errorMessage += error.message;
                    }
                    if (error.response && error.response.status) {
                      errorMessage += ` (Status: ${error.response.status})`;
                    }
                    alert(errorMessage);
                    return null;
                  } finally {
                    loadingEl.classList.add("hidden");
                    loadingEl.classList.remove("flex");
                  }
                },
              };
            },
          },
        };
      },


      onRender() {
        this.updateEditButton();
      },

      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;


        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center";


        const modalContent = handler.createModalContent(component);



        modal.innerHTML = `
          <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Edit ${componentType} Component</h2>
            <div class="modal-body"></div>
            <div class="mt-4 flex justify-end space-x-2">
              <button class="cancel-modal px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button class="save-modal px-4 py-2 bg-blue-500 border border-rose-500 text-white rounded bg-rose-500">Save</button>
            </div>
          </div>
        `;


        const modalBody = modal.querySelector(".modal-body");
        modalBody.appendChild(modalContent.container);


        // Event Listeners
        const closeBtn = modal.querySelector(".close-modal");
        const cancelBtn = modal.querySelector(".cancel-modal");
        const saveBtn = modal.querySelector(".save-modal");


        const closeModal = () => modal.remove();
        closeBtn.addEventListener("click", closeModal);
        cancelBtn.addEventListener("click", closeModal);



        saveBtn.addEventListener("click", () => {
          const editData = modalContent.getData();
          if (editData) {
            // Apply changes to the component
            if (editData.attributes) {
              component.setAttributes(editData.attributes);
            }
            if (editData.content) {
              component.set("content", editData.content);
            }
            closeModal();
          }
        });


        return modal;
      },


      onEditButtonClick() {
        const modal = this.createModal(this.model);


        // Add save button handler
        const saveBtn = modal.querySelector(".save-modal");
        saveBtn.addEventListener("click", () => {
          // Implement save logic here
          if (typeof this.onEditSave === "function") {
            this.onEditSave(this.el);
          }
          modal.remove();
        });



        document.body.appendChild(modal);
      },


      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
      },


      handleSelect(selectedComponent) {
        if (selectedComponent !== this.model) {
          this.removeEditButton();
          return;
        }


        const btn = this.createEditButton();
        const rect = this.el.getBoundingClientRect();


        btn.style.position = "absolute";
        btn.style.top = `${rect.top + rect.height / 2 - 15}px`;
        btn.style.right = `${rect.right - 35}px`;



        this.el.appendChild(btn);
      },


      handleDeselect() {
        this.removeEditButton();
      },


      createEditButton() {
        if (this.editButton) return this.editButton;


        const btn = document.createElement("button");
        btn.className =
          "gjs-edit-btn text-gray-900 border-gray-300 bg-white absolute bg-opacity-10 bg-blur-md bg-clip-padding backdrop-blur-md border rounded-3xl shadow-lg h-[30px] w-[30px] z-50";
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="w-3 md:w-4 h-3 md:h-4 mx-auto">
            <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
          </svg>
        `;


        btn.addEventListener("click", this.onEditButtonClick.bind(this));


        this.editButton = btn;
        return btn;
      },


      removeEditButton() {
        if (this.editButton) {
          this.editButton.remove();
          this.editButton = null;
        }
      },
    },
  });


  editor.DomComponents.addType("navbar", {
    isComponent: el => el.tagName === 'NAV',
    model: {
      defaults: {
        tagName: 'nav',
        draggable: true,
        droppable: true,
        traits: [withEditButton3],
        attributes: {
          class: 'bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50 py-4'
        },
        components: [
          {
            type: "container",
            components: [
              {
                type: "blank-container",
                components: [
                  {
                    type: "navbar-brand",
                    content: "BytePlexure",
                    attributes: {
                      class: "text-2xl font-bold text-white"
                    }
                  }
                ],
                attributes: {
                  class: "flex items-center"
                }
              },
              {
                type: "blank-container",
                components: [
                  {
                    type: "navbar-link",
                    content: "Test Nav 1",
                    attributes: {
                      href: "#",
                      class: "text-white hover:text-gray-300 px-3 py-2 text-base font-medium"
                    }
                  },
                  {
                    type: "navbar-link",
                    content: "Test Nav 2",
                    attributes: {
                      href: "#",
                      class: "text-white hover:text-gray-300 px-3 py-2 text-base font-medium"
                    }
                  },
                  {
                    type: "navbar-link",
                    content: "Test Nav 3",
                    attributes: {
                      href: "#",
                      class: "text-white hover:text-gray-300 px-3 py-2 text-base font-medium"
                    }
                  }
                ],
                attributes: {
                  class: "flex items-center space-x-8"
                }
              }
            ],
            attributes: {
              class: "container mx-auto px-6 flex items-center justify-between"
            }
          }
        ]
      }
    }
  });

  editor.DomComponents.addType("footer", {
    isComponent: el => el.tagName === 'FOOTER',
    model: {
      defaults: {
        tagName: 'footer',
        draggable: true,
        droppable: true,
        traits: [withEditButton3],
        attributes: {
          class: 'bg-gray-900 text-white py-12'
        },
        components: [
          {
            type: "container",
            components: [
              {
                type: "blank-container",
                components: [
                  {
                    type: "footer-brand",
                    content: "BytePlexure",
                    attributes: {
                      class: "text-2xl font-bold mb-6"
                    }
                  },
                  {
                    type: "paragraph",
                    content: "Creating digital experiences that inspire.",
                    attributes: {
                      class: "text-gray-400 mb-8"
                    }
                  }
                ],
                attributes: {
                  class: "grid grid-cols-1 md:grid-cols-4 gap-8"
                }
              },
              {
                type: "blank-container",
                components: [
                  {
                    type: "footer-links",
                    content: `
                      <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                      <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white">About Us</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Services</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Portfolio</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white">Contact</a></li>
                      </ul>
                    `
                  }
                ]
              },
              {
                type: "blank-container",
                components: [
                  {
                    type: "footer-contact",
                    content: `
                      <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
                      <ul class="space-y-2 text-gray-400">
                        <li>123 Business Street</li>
                        <li>City, State 12345</li>
                        <li>contact@byteplexure.com</li>
                        <li>(555) 123-4567</li>
                      </ul>
                    `
                  }
                ]
              },
              {
                type: "blank-container",
                components: [
                  {
                    type: "footer-social",
                    content: `
                      <h3 class="text-lg font-semibold mb-4">Follow Us</h3>
                      <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white">
                          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white">
                          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white">
                          <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
                        </a>
                      </div>
                    `
                  }
                ]
              }
            ],
            attributes: {
              class: "container mx-auto px-6"
            }
          }
        ]
      }
    }
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


      onAttributesChange() { },
    },
  });
  // Corrected JavaScript function to toggle the mobile menu

  // Add this with other component registrations
  editor.DomComponents.addType("map-section", {
    isComponent: el => el.tagName === 'SECTION' && el.classList.contains('map-section'),

  });

  // Add this with other component registrations
  editor.DomComponents.addType("video-section", {
    isComponent: el => el.tagName === 'SECTION' && el.classList.contains('video-section'),

  });
};



