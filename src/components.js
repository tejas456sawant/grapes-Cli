import IconPicker from "./IconPicker.js";
import React, { useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom/client"; // For React 18+


// const BACKEND_URL = "http://127.0.0.1:5000";

const getRegisteredBlocks = () => [
  { id: "text", name: "Custom Block", icon: "📝" },
  { id: "image", name: "Image Section", icon: "🖼️" },
  { id: "gallery", name: "Image Gallery", icon: "🎭" },
  { id: "video", name: "Video Section", icon: "🎥" },
  { id: "form", name: "Contact Form", icon: "📋" },
];


function setupEmptyPlaceholder(ctx) {
  const el = ctx.el;
  const comps = ctx.model.components();

  const render = () => {
    const isEmpty = comps.length === 0;

    if (isEmpty) {
      el.classList.add('relative', 'min-h-[32px]', 'min-w-[32px]');

      if (!ctx.placeholderEl) {
        const placeholder = document.createElement('div');
        placeholder.className = `
          absolute inset-0 flex items-center justify-center
          text-sm text-blue-400 border border-dashed border-blue-300
          bg-[repeating-linear-gradient(45deg,rgba(59,130,246,0.1)_0_10px,rgba(59,130,246,0.05)_10px_20px)]
          pointer-events-none
        `;
        placeholder.innerHTML = `
      <div class="flex flex-col items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>`
        el.appendChild(placeholder);
        ctx.placeholderEl = placeholder;
      }
    } else {
      el.classList.remove('min-h-[32px]', 'min-w-[32px]');
      if (ctx.placeholderEl) {
        ctx.placeholderEl.remove();
        ctx.placeholderEl = null;
      }
    }
  };

  render();
  ctx.listenTo(comps, 'add remove reset', render);
}


// Simulate API call with 3 second delay
async function fetchComponentConfig(type, description) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        type,
        content: `Test block of type ${type} with description: ${description}`,
      });
    }, 3000); // 3 second delay
  });
}

// Add component after target component
function addComponentAfter(targetComponent, newComponent) {
  const parent = targetComponent.parent();
  const index = parent.components().indexOf(targetComponent);
  parent.components().add(newComponent, { at: index + 1 });
}



// Show modal and handle component addition
function showAddComponentModal(targetComponent) {
  let currentStep = 1;
  let selectedType = null;
  let isLoading = false;
  const registeredBlocks = getRegisteredBlocks();

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center";

  function updateModalContent() {
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-2xl w-full mx-4 relative">
        ${isLoading
        ? `
          <div class="absolute inset-0 bg-white bg-opacity-75 z-10 flex items-center justify-center rounded-lg">
            <div class="flex flex-col items-center space-y-3">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-500"></div>
              <span class="text-lg font-medium">Adding block...</span>
            </div>
          </div>
        `
        : ""
      }
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold">
              ${currentStep === 1 ? "Choose Block Type" : "Block Details"}
            </h2>
            <button class="close-modal text-gray-400 hover:text-gray-600" ${isLoading ? "disabled" : ""
      }>
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="modal-body mb-6">
            ${currentStep === 1
        ? `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${registeredBlocks
          .map(
            (block) => `
                  <button 
                    class="component-type-btn flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    data-type="${block.id}"
                    ${isLoading ? "disabled" : ""}
                  >
                    <span class="text-2xl">${block.icon}</span>
                    <span class="text-left font-medium">${block.name}</span>
                  </button>
                `,
          )
          .join("")}
              </div>
            `
        : `
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Selected Block: ${registeredBlocks.find((t) => t.id === selectedType)?.name
        }
                  </label>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1" for="componentDescription">
                    Description
                  </label>
                  <textarea
                    id="componentDescription"
                    class="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Enter a description for this block..."
                    ${isLoading ? "disabled" : ""}
                  ></textarea>
                </div>
              </div>
            `
      }
          </div>

          <div class="flex justify-between">
            <button class="back-btn px-4 py-2 text-gray-600 hover:text-gray-800 font-medium ${currentStep === 1 ? "invisible" : ""
      }" ${isLoading ? "disabled" : ""}>
              Back
            </button>
            <div class="space-x-3">
              <button class="cancel-btn px-4 py-2 text-gray-600 hover:text-gray-800 font-medium" ${isLoading ? "disabled" : ""
      }>
                Cancel
              </button>
              <button 
                class="next-btn px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                ${currentStep === 1 || isLoading ? "disabled" : ""}
              >
                ${currentStep === 1 ? "Next" : "Add Block"}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    attachModalListeners();
  }

  function attachModalListeners() {
    const closeModal = () => {
      if (!isLoading) {
        modal.remove();
      }
    };

    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal.querySelector(".cancel-btn").addEventListener("click", closeModal);

    if (currentStep === 1) {
      modal.querySelectorAll(".component-type-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (!isLoading) {
            modal
              .querySelectorAll(".component-type-btn")
              .forEach((b) =>
                b.classList.remove("ring-2", "ring-blue-500", "bg-blue-50"),
              );

            btn.classList.add("ring-2", "ring-blue-500", "bg-blue-50");
            selectedType = btn.dataset.type;
            modal.querySelector(".next-btn").disabled = false;
          }
        });
      });
    }

    modal.querySelector(".next-btn").addEventListener("click", async () => {
      if (isLoading) return;

      if (currentStep === 1) {
        currentStep = 2;
        updateModalContent();
      } else {
        const description = modal.querySelector("#componentDescription").value;

        // Show loading state
        isLoading = true;
        updateModalContent();

        try {
          const blockConfig = await fetchComponentConfig(
            selectedType,
            description,
          );
          addComponentAfter(targetComponent, blockConfig);
          closeModal();
        } catch (error) {
          console.error("Failed to add block:", error);
          const errorDiv = document.createElement("div");
          errorDiv.className = "text-red-500 text-sm mt-2";
          errorDiv.textContent = "Failed to add block. Please try again.";
          modal.querySelector(".modal-body").appendChild(errorDiv);
        } finally {
          isLoading = false;
          updateModalContent();
        }
      }
    });

    modal.querySelector(".back-btn").addEventListener("click", () => {
      if (!isLoading && currentStep === 2) {
        currentStep = 1;
        updateModalContent();
      }
    });
  }

  updateModalContent();
  document.body.appendChild(modal);
}

export default (editor, options) => {
  const BACKEND_URL = editor.backendUrl;

  editor.Commands.add("regenerate-section", {
    run: function (editor, sender, options = {}) {
      const selectedComponent = editor.getSelected();

      if (!selectedComponent) {
        alert("Please select a component first");
        return;
      }

      // Get the original component ID
      const componentId = selectedComponent.getAttributes().id;
      if (!componentId) {
        alert("Please select a component", selectedComponent.getAttributes().id);
        return;
      }

      // Get website ID from URL
      const websiteId = new URLSearchParams(window.location.search).get("website_id");
      if (!websiteId) {
        alert("Website ID not found");
        return;
      }

      // Create modal UI
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

      modal.innerHTML = `
       <div class="bg-white p-6 rounded-2xl max-w-lg w-full shadow-xl relative">
          <button class="close-modal absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl">
            &times;
          </button>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              Regenerate Section
              <span class="text-xs bg-rose-100 text-rose-600 font-medium px-2 py-0.5 rounded-full">Beta</span>
            </h2>
          </div>
          <div class="modal-body">
            <div class="mb-5">
              <label for="regenerate-prompt" class="block text-sm font-medium text-gray-700 mb-1">
                Describe the changes you’d like to see
              </label>
              <textarea 
                id="regenerate-prompt" 
                class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition" 
                rows="4"
                placeholder="Add a button"
              ></textarea>
            </div>
          </div>
          <div class="mt-4 flex justify-end gap-3">
            <button class="cancel-modal px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition">
              Cancel
            </button>
            <button class="regenerate-modal px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg shadow-sm transition">
              Apply Changes
            </button>
          </div>
       </div>
      `;

      // Attach modal events
      const closeModal = () => modal.remove();
      modal.querySelector(".close-modal").addEventListener("click", closeModal);
      modal.querySelector(".cancel-modal").addEventListener("click", closeModal);

      modal.querySelector(".regenerate-modal").addEventListener("click", async () => {
        const prompt = modal.querySelector("#regenerate-prompt").value.trim();

        if (!prompt) {
          alert("Please enter your improvement instructions");
          return;
        }

        // Show loading spinner
        modal.querySelector(".modal-body").innerHTML = `
          <div class="flex flex-col items-center justify-center p-8">
            <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4">Generating new section...</p>
          </div>
        `;

        try {
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("Bearer="))
            ?.split("=")[1];

          if (!token) {
            throw new Error("Authorization token not found");
          }

          const response = await fetch(
            `${BACKEND_URL}/api/website/${websiteId}/regenerate-section`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                prompt,
                section: selectedComponent.toJSON(),
                componentId, // explicitly send the original ID
              }),
            }
          );

          const data = await response.json();

          if (data.status && data.section) {
            replaceComponentById(componentId, data.section, editor);
            closeModal();
            alert("Section regenerated successfully!");
          } else {
            throw new Error(data.message || "Invalid response from server");
          }
        } catch (error) {
          console.error("Error regenerating section:", error);
          alert(`Failed to regenerate: ${error}`);
          closeModal();
        }
      });

      document.body.appendChild(modal);
    },
  });

  /**
   * Replace a GrapesJS component by its original ID.
   * Even if the returned data has a new ID, it will replace the right component.
   */
  function replaceComponentById(originalId, newComponentData, editor) {
    const root = editor.getWrapper();

    const findById = (components) => {
      for (const comp of components) {
        const htmlId = comp.getAttributes()?.id;
        if (htmlId === originalId) return comp;

        const children = comp.components();
        if (children.length) {
          const found = findById(children);
          if (found) return found;
        }
      }
      return null;
    };

    const target = findById(root.components());
    if (!target) {
      console.warn(`Component with HTML ID "${originalId}" not found`);
      return;
    }

    const parent = target.parent();
    const index = parent ? parent.components().indexOf(target) : 0;

    // Remove old component
    target.remove();


    // Insert new component at the same index
    const newComp = parent
      ? parent.append(newComponentData, { at: index })[0]
      : root.append(newComponentData)[0];

    // Select new component
    editor.select(newComp);
  }



  editor.Commands.add("open-icon-picker", {
    run(editor) {
      const modal = editor.Modal;
      modal.open({
        title: "Select Icon",
        content: '<div id="icon-picker-root"></div>',
      });

      const handleSelectIcon = ({ html, className }) => {
        const selectedComponent = editor.getSelected();
        if (selectedComponent) {
          selectedComponent.set({ content: "", className });
        }
        modal.close();
      };

      // Mount React component using createRoot
      const container = document.getElementById("icon-picker-root");
      const root = createRoot(container);
      root.render(<IconPicker onSelectIcon={handleSelectIcon} />);

      // Cleanup on modal close
      const handleModalClose = () => {
        root.unmount();
        modal.getModel().off("change:open", handleModalClose);
      };
      modal.getModel().on("change:open", handleModalClose);
    },
  });

  editor.BlockManager.add("icon-block", {
    label: "Icon",
    category: "Basic",
    content: {
      type: "icon",
      content: '<i class="fas fa-star"></i>',
    },
    render: ({ model, className }) => {
      return `<div class="${className}">
      <i class="fas fa-star"></i>
    </div>`;
    },
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
                "content",
              )}">
                <button class="remove-link bg-red-500 text-white px-2 py-1 rounded" data-index="${index}">Remove</button>
              </div>
            `,
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
      },
    },
  });

  editor.DomComponents.addType('form-wrapper', {
    model: {
      defaults: {
        tagName: 'div',
        showEditButton: true,
        draggable: false,
        droppable: false,
        stylable: true,
        attributes: {
          formsrc: '',
          'mobile-width': '280px',
          class: 'relative flex flex-col border border-solid border-gray-500/50 my-2 form-wrapper',
        },
        styles: `
        .form-wrapper iframe{
          height: 100%;
          width: 100%
        }
        
        `
      },

      init() {
        this.listenTo(this, 'change:attributes:formsrc', this.updateIframe);
        this.updateIframe();
      },

      updateIframe() {
        const attrs = this.getAttributes();

        // Default mobile-width if not set
        if (!attrs['mobile-width']) {
          this.addAttributes({ 'mobile-width': '98%' });
          this.addAttributes({ 'desktop-width': '380px' });
        }

        // Set mobile-height only if formsrc is set and mobile-height is not
        if (attrs.formsrc && !attrs['mobile-height']) {
          this.addAttributes({ 'mobile-height': '420px' });
        }

        if (attrs.formsrc) {
          this.set('content', attrs.formsrc);
        } else {
          this.set('content', ''); // Clear content
        }
      }
    },

    view: {
      init() {
        this.listenTo(this.model, 'change:attributes:formsrc', this.render);
        this.render();
      },

      onRender() {
        const src = this.model.getAttributes().formsrc;

        // Only show placeholder when formsrc is empty
        if (!src) {
          this.el.innerHTML = `
            <div class="flex items-start gap-3 border border-gray-400/30 bg-gray-100/30 rounded-md p-4 text-sm">
          <div class="flex-shrink-0 h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2.25m0 3.75h.008v-.008H12V15ZM12 4.5c-4.142 0-7.5 3.358-7.5 7.5s3.358 7.5 7.5 7.5 7.5-3.358 7.5-7.5-3.358-7.5-7.5-7.5Z" />
            </svg>
          </div>
          <div>
            <h5 class="font-medium">No Form Selected</h5>
            <p class="mt-1">
              Click <button class="text-rose-600 hover:underline font-medium edit-form-link">here</button> to add a form here.
            </p>
          </div>
        </div>`;

          const link = this.el.querySelector('.edit-form-link');
          if (link) {
            link.addEventListener('click', () => this.onEditButtonClick());
          }
        }
      },



      onEditButtonClick() {
        const component = this.model;

        // Dummy list if editor.formsList is not provided
        const forms =
          (editor.formsList && editor.formsList.length > 0)
            ? editor.formsList
            : [

            ];

        // Modal wrapper
        const modal = document.createElement('div');
        modal.className =
          'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';

        // Modal content
        const container = document.createElement('div');
        container.className =
          'bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative';

        // Basic HTML structure
        const selected = { index: null };
        const formCardsHTML = forms
          .map(
            (form, i) => `
            <div class="form-card border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer" data-index="${i}">
              <div class="font-medium text-gray-800">${form.name}</div>
            </div>
          `
          )
          .join('');
        const websiteId = new URLSearchParams(window.location.search).get("website_id") || 4;

        container.innerHTML = `
          <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-black text-xl">&times;</button>
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Select a Form</h2>
      
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 modal-body">
            ${formCardsHTML}
          </div>
      
          <div class="mt-6 flex justify-between items-center">
            <a 
              href="/dashboard/${websiteId}/edit?tab=forms" 
              target="_blank" 
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New Form
            </a>
    <div class="flex gap-2">
              <button class="cancel-modal px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200">Cancel</button>
              <button class="save-modal px-4 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-700">Save</button>
            </div>
          </div>
        `;

        // Selection logic
        container.querySelectorAll('.form-card').forEach((el) => {
          el.addEventListener('click', () => {
            container.querySelectorAll('.form-card').forEach((card) =>
              card.classList.remove('border-blue-500', 'bg-blue-50')
            );
            el.classList.add('border-blue-500', 'bg-blue-50');
            selected.index = parseInt(el.dataset.index, 10);
          });
        });

        // Save form
        container.querySelector('.save-modal').addEventListener('click', () => {
          if (selected.index != null) {
            const selectedForm = forms[selected.index];
            component.addAttributes({ formsrc: selectedForm.iframe });
            modal.remove();
          }
        });

        // Cancel and Close buttons
        container.querySelector('.cancel-modal').addEventListener('click', () =>
          modal.remove()
        );
        container.querySelector('.close-modal').addEventListener('click', () =>
          modal.remove()
        );

        modal.appendChild(container);
        document.body.appendChild(modal);
      }

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

  editor.Components.addType("profile-image", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        // Tailwind classes for circle wrapper
        attributes: {
          class: "w-20 h-20 rounded-full overflow-hidden flex justify-center items-center",
        },
        style: `
        `,
        components: [
          {
            type: "custom-image",
            attributes: {
              src: "",
              imagesrc: "",
              alt: "",
              // no class or style overrides here — we set classes dynamically
            },
          },
        ],
      },

      init() {
        this.on("change:components", this.updateImageClasses);
        this.updateImageClasses();
      },

      updateImageClasses() {
        const image = this.get("components").at(0);
        if (image) {
          image.set("attributes", {
            ...image.get("attributes"),
            class: "w-full h-full object-cover object-center block",
          });
        }
      },
    },
    view: {
      init() {
        this.componentEditHandlers = {
          // Default handler for generic components
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              const childImage = component.components().find((comp) => comp.get("type") === "custom-image");
              const currentBgImage =
                childImage.get("attributes")["src"] || "";

              container.innerHTML = `
                <div class="space-y-4">
                  <div class="flex flex-col gap-4">
                    <div class="relative">
                      <img src="${currentBgImage}" alt="Current Image"
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
                  let result = {
                    attributes: {
                      "src": "",
                    },
                  };

                  if (!selectedFile) {
                    result.attributes["src"] =
                      component.get("attributes")["src"];
                    return result;
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

                    const token = document.cookie
                      .split("; ")
                      .find((row) => row.startsWith("Bearer="))
                      ?.split("=")[1];

                    if (!token) {
                      throw new Error("Authorization token not found");
                    }

                    // Get presigned URL with correct content type
                    const presignedResponse = await fetch(
                      `${BACKEND_URL}/api/presigned-url`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          file_name: uniqueFileName,
                          file_type: selectedFile.type,
                        }),
                      },
                    );

                    const { file_url, presigned_url } =
                      await presignedResponse.json();

                    // Upload to S3 using PUT request with correct headers
                    const uploadResponse = await fetch(presigned_url, {
                      method: "PUT",
                      headers: {
                        "Content-Type": selectedFile.type,
                      },
                      body: selectedFile,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error(
                        `Upload failed with status: ${uploadResponse.status}`,
                      );
                    }

                    // Get clean URL without query params
                    const imageUrl = file_url.split("?")[0];

                    result.attributes["src"] = imageUrl;

                    if (childImage) {
                      childImage.addAttributes({ src: imageUrl });
                    }

                    return result;
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    // Log more detailed error information
                    if (error.response) {
                      console.error("Response status:", error.response.status);
                      console.error(
                        "Response data:",
                        await error.response.text(),
                      );
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
        this.listenTo(this.model, 'change:classes', () => {
          // nothing needed here—Grapes will re-render the class list
        });
      },

      onRender() {
        const buttonRowCenter = this.createButtonRow();
        this.el.appendChild(buttonRowCenter);

      },

      createButtonRow() {
        console.log("eminem")
        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute ml-10  transform -translate-x-1/2 flex space-x-2 z-[99]";

        // Edit Button
        const editBtn = this.createEditButton();
        row.appendChild(editBtn);

        this.buttonRow = row;
        return row;

      },

      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;

        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        const modalContent = handler.createModalContent(component);

        modal.innerHTML = `
          <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Edit Component</h2>
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

        saveBtn.addEventListener("click", async () => {
          const editData = await modalContent.getData();
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

      onUpdateButtonClick() {
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
      onEditButtonClick() {
        this.model.EditComponent();
      },
      createEditButton() {
        console.log("eminem2")

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 my-1"">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
  
      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
      Edit Image
      </div>
          `;

        btn.addEventListener("click", this.onUpdateButtonClick.bind(this));

        this.editButton = btn;
        return btn;
      },
    }
  });

  const defaultRatios = [
    { value: 'aspect-square', name: 'Square (1:1)' },
    { value: 'aspect-[4/3]', name: 'Standard (4:3)' },
    { value: 'aspect-video', name: 'Wide (16:9)' },      // Tailwind’s aspect-video = 16/9
    { value: 'aspect-[9/16]', name: 'Portrait (9:16)' },
    { value: 'custom', name: 'Custom…' }
  ];

  // 2. Register the img-wrapper component
  editor.DomComponents.addType('img-wrapper', {
    isComponent: el =>
      el.tagName === 'DIV' && el.classList.contains('img-wrapper'),

    model: {
      defaults: {
        tagName: 'div',
        classes: [
          'img-wrapper', 'w-auto', 'flex', 'items-center',
          'justify-center', 'overflow-hidden', 'relative',
        ],
        droppable: false,
        draggable: false,
        showEditButton: true,
        traits: [
          {
            type: 'select',
            name: 'aspect-ratio',
            label: 'Aspect Ratio',
            options: defaultRatios,
            changeProp: 1,
          }
        ]
      },

      init() {
        this.updateClasses();
        this.listenTo(this, "change:attributes", this.updateClasses);
      },


      updateClasses() {
        const ratio = parseFloat(this.getAttributes()['aspect-ratio']);
        if(ratio)
        this.addStyle({ 'aspect-ratio': ratio });
      },

      // opens the floating menu
      EditComponent() {
        // Clean up any old menu
        document.querySelectorAll('.aspect-ratio-menu').forEach(el => el.remove());

        const view = this.getView();
        const el = view.el;
        const currentRatio = parseFloat(this.getAttributes()['aspect-ratio'] || '1.77');
        const originalRatio = currentRatio;

        const minVal = 0.5;
        const maxVal = 3;
        const initialSliderValue = maxVal + minVal - currentRatio;

        const menu = document.createElement('div');
        menu.className = 'aspect-ratio-menu absolute z-[99999] p-4 bg-white left-[5rem] bottom-32 shadow-md rounded border text-sm w-64';
        menu.style.position = "absolute";
        menu.style.left = "3.5rem";
        menu.style.bottom = "4rem";
        document.body.appendChild(menu);

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center mb-3';

        const heading = document.createElement('h3');
        heading.textContent = 'Adjust Image Size';
        heading.className = 'font-semibold';

        const close = document.createElement('button');
        close.innerHTML = '&times;';
        close.className = 'text-gray-600 text-xl hover:text-black';
        close.onclick = () => {
          el.style.aspectRatio = originalRatio;
          menu.remove();
        };

        header.append(heading, close);
        menu.appendChild(header);

        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'mb-2';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = minVal;
        slider.max = maxVal;
        slider.step = '0.01';
        slider.value = initialSliderValue;
        slider.className = 'w-full';

        const ratioDisplay = document.createElement('div');
        ratioDisplay.className = 'text-center text-sm mt-1 text-gray-700';
        ratioDisplay.textContent = `Aspect Ratio: ${currentRatio.toFixed(2)}`;

        sliderContainer.append(slider, ratioDisplay);
        menu.append(sliderContainer);

        const btn = document.createElement('button');
        btn.textContent = 'Apply';
        btn.className = 'w-full px-3 py-1 bg-rose-600 text-white rounded mt-2';
        menu.append(btn);

        slider.addEventListener('input', () => {
          const sliderValue = parseFloat(slider.value);
          const aspectValue = (maxVal + minVal - sliderValue).toFixed(2);
          el.style.aspectRatio = aspectValue;
          ratioDisplay.textContent = `Aspect Ratio: ${aspectValue}`;
        });

        btn.onclick = () => {
          const sliderValue = parseFloat(slider.value);
          const finalRatio = (maxVal + minVal - sliderValue).toFixed(2);
          this.setAttributes({ 'aspect-ratio': finalRatio });
          menu.remove();
        };
      }

    },

    view: {
      init() {
        this.componentEditHandlers = {
          // Default handler for generic components
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              const childImage = component.components().find((comp) => comp.get("type") === "custom-image");
              const currentBgImage =
                childImage.get("attributes")["src"] || "";

              container.innerHTML = `
              <div class="space-y-4">
                <div class="flex flex-col gap-4">
                  <div class="relative">
                    <img src="${currentBgImage}" alt="Current Image"
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
                  let result = {
                    attributes: {
                      "src": "",
                    },
                  };

                  if (!selectedFile) {
                    result.attributes["src"] =
                      component.get("attributes")["src"];
                    return result;
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

                    const token = document.cookie
                      .split("; ")
                      .find((row) => row.startsWith("Bearer="))
                      ?.split("=")[1];

                    if (!token) {
                      throw new Error("Authorization token not found");
                    }

                    // Get presigned URL with correct content type
                    const presignedResponse = await fetch(
                      `${BACKEND_URL}/api/presigned-url`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          file_name: uniqueFileName,
                          file_type: selectedFile.type,
                        }),
                      },
                    );

                    const { file_url, presigned_url } =
                      await presignedResponse.json();

                    // Upload to S3 using PUT request with correct headers
                    const uploadResponse = await fetch(presigned_url, {
                      method: "PUT",
                      headers: {
                        "Content-Type": selectedFile.type,
                      },
                      body: selectedFile,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error(
                        `Upload failed with status: ${uploadResponse.status}`,
                      );
                    }

                    // Get clean URL without query params
                    const imageUrl = file_url.split("?")[0];

                    result.attributes["src"] = imageUrl;

                    if (childImage) {
                      childImage.addAttributes({ src: imageUrl });
                    }

                    return result;
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    // Log more detailed error information
                    if (error.response) {
                      console.error("Response status:", error.response.status);
                      console.error(
                        "Response data:",
                        await error.response.text(),
                      );
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
        this.listenTo(this.model, 'change:classes', () => {
          // nothing needed here—Grapes will re-render the class list
        });
      },

      onRender() {
        const buttonRowCenter = this.createButtonRow();
        this.el.appendChild(buttonRowCenter);

      },

      createButtonRow() {
        console.log("eminem")
        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute top-[35%]  left-1/2 transform -translate-x-1/2 flex space-x-2 z-[99]";

        // Edit Button
        const editBtn = this.createEditButton();
        row.appendChild(editBtn);

        this.buttonRow = row;
        return row;

      },

      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;

        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        const modalContent = handler.createModalContent(component);

        modal.innerHTML = `
        <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
          <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
            &times;
          </button>
          <h2 class="text-xl font-semibold mb-4">Edit Component</h2>
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

        saveBtn.addEventListener("click", async () => {
          const editData = await modalContent.getData();
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

      onUpdateButtonClick() {
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
      onEditButtonClick() {
        this.model.EditComponent();
      },
      createEditButton() {
        console.log("eminem2")

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
      
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 my-1"">
      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>

    <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
    Edit Image
    </div>
        `;

        btn.addEventListener("click", this.onUpdateButtonClick.bind(this));

        this.editButton = btn;
        return btn;
      },
    }
  });



  editor.Components.addType("custom-image", {
    model: {
      defaults: {
        selectable: false,
        disableMovement: true,
        disableToolbar: true,
        draggable: false,
        droppable: false,
        tagName: "img", // Image element
        attributes: {
          class: "w-full h-full custom-image !filter-none", // Default styling
          src: "", // Initially empty src
          imagesrc: "", // We will use cardimage as the source URL for the image
          alt: "", // Default alt text
        },
        styles: `
          .custom-image{
            object-fit: cover !important;
          }
        `
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

  editor.DomComponents.addType("masonry-grid", {
    model: {
      defaults: {
        addInside: true,
        draggable: false,
        tagName: "div",
        attributes: { class: "masonry" },
        styles: `
        .masonry {
          column-count: 3;
          column-gap: 1rem;
        }
        @media (max-width: 1024px) {
          .masonry {
            column-count: 2;
          }
        }
        @media (max-width: 768px) {
          .masonry {
            column-count: 1;
          }
        }
        .masonry>* {
          display: block;
          width: 100%;
          margin-bottom: 1rem;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `,
      }
    }
  }),




    editor.DomComponents.addType("grid-layout", {
      model: {
        defaults: {
          addInside: true,
          draggable: false,
          tagName: "div",
          showEditButton: true,
          classes: ["grid", "gap-2", "items-start", "justify-start"],
          attributes: {
            mobileColumns: "grid-cols-1",
            desktopColumns: "grid-cols-2",
            gap: "gap-4",
            alignItems: "items-start",
            alignContent: "content-start",
            justifyItems: "justify-start",
            stretch: "true",
          },
        },

        init() {
          this.updateClasses();
          this.listenTo(this, "change:attributes", this.updateClasses);
        },
        updateClasses() {
          const attrs = this.getAttributes();
          const cls = this.getClasses().filter(
            (c) =>
              !c.startsWith("grid-cols-") &&
              !c.startsWith("gap-") &&
              !c.startsWith("items-") &&
              !c.startsWith("content-") &&
              !c.startsWith("justify-") &&
              !c.startsWith("md:grid-cols-"),
          );

          if (attrs.mobileColumns) cls.push(attrs.mobileColumns);
          if (attrs.desktopColumns) cls.push(`md:${attrs.desktopColumns}`);
          if (attrs.gap) cls.push(attrs.gap);
          if (attrs.alignItems) cls.push(attrs.alignItems);
          if (attrs.alignContent) cls.push(attrs.alignContent);
          if (attrs.justifyItems) cls.push(attrs.justifyItems);
          if (attrs.justifyContent) cls.push(attrs.justifyContent);

          this.setClass(cls);

          this.components().forEach((comp) => {
            const childCls = comp
              .getClasses()
              .filter((c) => c !== "w-full" && c !== "h-full");
            if (attrs.stretch === "true") {
              comp.setClass([...childCls, "w-full", "h-full"]);
            } else {
              comp.setClass(childCls);
            }
          });
        },

        EditComponent(editorMode = "desktop") {
          const view = this.view;
          const el = view.el;
          const oldAttrs = { ...this.getAttributes() };
          const menu = document.createElement("div");

          // Remove old menu
          const existing = document.querySelector(".grid-editor-menu");
          if (existing) existing.remove();

          menu.className =
            "absolute z-[99999] p-4 bg-white left-[5rem] bottom-32 my-auto shadow-2xl rounded border text-sm w-72 grid-editor-menu";
          menu.style.position = "absolute";
          menu.style.left = "3.5rem";
          menu.style.bottom = "4rem";
          document.body.appendChild(menu);

          menu.innerHTML = `
        <div class="flex justify-between items-center mb-2 font-semibold">
          <button id="cancelGridSettings" class="text-red-500 font-bold text-sm">✕</button>
        </div>
      
        <label class="text-xs font-medium">Columns (Desktop):</label>
        <input type="number" min="1" max="12" id="columnsDesktop" class="w-full mb-2 border rounded px-2 py-1" />
      
        <label class="text-xs font-medium">Columns (Mobile):</label>
        <input type="number" min="1" max="12" id="columnsMobile" class="w-full mb-2 border rounded px-2 py-1" />
      
        <label class="text-xs font-medium">Gap:</label>
        <select id="gap" class="w-full mb-2 border rounded px-2 py-1">
          <option value="gap-0">None</option>
          <option value="gap-2">Small</option>
          <option value="gap-4">Medium</option>
          <option value="gap-8">Large</option>
        </select>
      
        <label class="text-xs font-medium">Align Items:</label>
        <select id="alignItems" class="w-full mb-2 border rounded px-2 py-1">
          <option value="items-start">Top</option>
          <option value="items-center">Center</option>
          <option value="items-end">Bottom</option>
        </select>
      
        <label class="text-xs font-medium">Align Content:</label>
        <select id="alignContent" class="w-full mb-2 border rounded px-2 py-1">
          <option value="">Default</option>
          <option value="content-start">Top</option>
          <option value="content-center">Center</option>
          <option value="content-end">Bottom</option>
          <option value="content-between">Space Between</option>
          <option value="content-around">Space Around</option>
        </select>
      
        <label class="text-xs font-medium">Justify Items:</label>
        <select id="justifyItems" class="w-full mb-2 border rounded px-2 py-1">
          <option value="justify-start">Left</option>
          <option value="justify-center">Center</option>
          <option value="justify-end">Right</option>
          <option value="justify-between">Space Between</option>
          <option value="justify-around">Space Around</option>
        </select>
      
        <label class="text-xs font-medium">Stretch Items:</label>
        <input type="checkbox" id="stretch" class="mb-4" />
      
        <button class="mt-2 w-full bg-black text-white px-3 py-1 rounded" id="applyGridSettings">Apply</button>
      `;

          // Get attributes
          const attrs = this.getAttributes();
          const safeInt = (val, fallback) => {
            const parsed = parseInt(val?.split("-").pop());
            return isNaN(parsed) ? fallback : parsed;
          };

          // Set current values using proper attribute keys
          menu.querySelector("#columnsDesktop").value = safeInt(
            attrs.desktopColumns,
            2,
          );
          menu.querySelector("#columnsMobile").value = safeInt(
            attrs.mobileColumns,
            1,
          );
          menu.querySelector("#gap").value = attrs.gap || "gap-4";
          menu.querySelector("#alignItems").value =
            attrs.alignItems || "items-start";
          menu.querySelector("#alignContent").value = attrs.alignContent || "";
          menu.querySelector("#justifyItems").value =
            attrs.justifyItems || "justify-start";
          menu.querySelector("#stretch").checked = attrs.stretch === "true";

          // Function to apply updates live
          const updateAttrs = () => {
            const newAttrs = {
              desktopColumns: `grid-cols-${menu.querySelector("#columnsDesktop").value || 3
                }`,
              mobileColumns: `grid-cols-${menu.querySelector("#columnsMobile").value || 1
                }`,
              gap: menu.querySelector("#gap").value,
              alignItems: menu.querySelector("#alignItems").value,
              alignContent: menu.querySelector("#alignContent").value,
              justifyItems: menu.querySelector("#justifyItems").value,
              stretch: menu.querySelector("#stretch").checked ? "true" : "false",
            };
            this.addAttributes(newAttrs);
          };

          // Live update on change
          [
            "#columnsDesktop",
            "#columnsMobile",
            "#gap",
            "#alignItems",
            "#alignContent",
            "#justifyItems",
            "#stretch",
          ].forEach((id) => {
            const el = menu.querySelector(id);
            if (el.type === "checkbox") {
              el.addEventListener("change", updateAttrs);
            } else {
              el.addEventListener("input", updateAttrs);
            }
          });

          // Apply button
          menu.querySelector("#applyGridSettings").onclick = () => {
            if (menu.parentNode) menu.remove();
            document.removeEventListener("mousedown", onOutsideClick);
          };

          // Cancel button - revert to original attributes
          menu.querySelector("#cancelGridSettings").onclick = () => {
            this.addAttributes(oldAttrs);
            if (menu.parentNode) menu.remove();
            document.removeEventListener("mousedown", onOutsideClick);
          };

          // Close on outside click
          const onOutsideClick = (e) => {
            if (!menu.contains(e.target)) {
              this.addAttributes(oldAttrs);
              if (menu.parentNode) menu.remove();
              document.removeEventListener("mousedown", onOutsideClick);
            }
          };
          setTimeout(
            () => document.addEventListener("mousedown", onOutsideClick),
            0,
          );
        },
      },

      view: {
        init() {
          setupEmptyPlaceholder(this);
        },
        onEditButtonClick() {
          this.model.EditComponent("desktop");
        },
      },
    });

  editor.DomComponents.addType("flex", {
    model: {
      defaults: {
        addInside: true,
        draggable: false,
        droppable: false,
        tagName: "div",
        showEditButton: true,
        classes: [
          "flex",
          "flex-col",
          "flex-wrap",
          "gap-2",
          "items-start",
          "justify-start",
          "item-container",
        ],
        attributes: {
          flexDirection: "flex-col",
          flexDirectionDesktop: "md:flex-col",
          wrap: "flex-wrap",
          gap: "gap-4",
          alignItems: "items-start",
          alignContent: "content-start",
          justifyContent: "justify-start",
        },
      },

      init() {
        this.updateClasses();
        this.listenTo(this, "change:attributes", this.updateClasses);
      },

      updateClasses() {
        const attrs = this.getAttributes();
        const cls = this.getClasses().filter(
          (c) =>
            !c.startsWith("flex-") &&
            !c.startsWith("gap-") &&
            !c.startsWith("items-") &&
            !c.startsWith("content-") &&
            !c.startsWith("justify-") &&
            !c.startsWith("md:flex-"),
        );

        if (attrs.flexDirection) cls.push(attrs.flexDirection);
        if (attrs.flexDirectionDesktop) cls.push(attrs.flexDirectionDesktop);
        if (attrs.wrap) cls.push(attrs.wrap);
        if (attrs.gap) cls.push(attrs.gap);
        if (attrs.alignItems) cls.push(attrs.alignItems);
        if (attrs.alignContent) cls.push(attrs.alignContent);
        if (attrs.justifyContent) cls.push(attrs.justifyContent);

        this.setClass(cls);
      },

      EditComponent(editorMode = "desktop") {
        const view = this.view;
        const el = view.el;
        const oldAttrs = { ...this.getAttributes() };
        const menu = document.createElement("div");

        const existing = document.querySelector(".flex-editor-menu");
        if (existing) existing.remove();

        menu.className =
          "absolute z-[99999] p-4 bg-white left-[5rem] bottom-32 my-auto shadow-2xl rounded border text-sm w-72 flex-editor-menu";
        menu.style.position = "absolute";
        menu.style.left = "3.5rem";
        menu.style.bottom = "4rem";
        document.body.appendChild(menu);

        menu.innerHTML = `
          <div class="flex justify-between items-center mb-2 font-semibold">
            <button id="cancelFlexSettings" class="text-red-500 font-bold text-sm">✕</button>
          </div>
  
          <label class="text-xs font-medium">Flex Direction (Mobile):</label>
          <select id="flexDirection" class="w-full mb-2 border rounded px-2 py-1">
            <option value="flex-row">Row</option>
            <option value="flex-col">Column</option>
          </select>
  
          <label class="text-xs font-medium">Flex Direction (Desktop):</label>
          <select id="flexDirectionDesktop" class="w-full mb-2 border rounded px-2 py-1">
            <option value="md:flex-row">Row</option>
            <option value="md:flex-col">Column</option>
          </select>
  
          <label class="text-xs font-medium">Wrap:</label>
          <select id="wrap" class="w-full mb-2 border rounded px-2 py-1">
            <option value="flex-wrap">Wrap</option>
            <option value="flex-nowrap">No Wrap</option>
            <option value="flex-wrap-reverse">Wrap Reverse</option>
          </select>
  
          <label class="text-xs font-medium">Gap:</label>
          <select id="gap" class="w-full mb-2 border rounded px-2 py-1">
            <option value="gap-0">None</option>
            <option value="gap-2">Small</option>
            <option value="gap-4">Medium</option>
            <option value="gap-8">Large</option>
          </select>
  
          <label class="text-xs font-medium">Align Items:</label>
          <select id="alignItems" class="w-full mb-2 border rounded px-2 py-1">
            <option value="items-start">Start</option>
            <option value="items-center">Center</option>
            <option value="items-end">End</option>
            <option value="items-stretch">Stretch</option>
          </select>
  
          <label class="text-xs font-medium">Align Content:</label>
          <select id="alignContent" class="w-full mb-2 border rounded px-2 py-1">
            <option value="">Default</option>
            <option value="content-start">Start</option>
            <option value="content-center">Center</option>
            <option value="content-end">End</option>
            <option value="content-between">Space Between</option>
            <option value="content-around">Space Around</option>
          </select>
  
          <label class="text-xs font-medium">Justify Content:</label>
          <select id="justifyContent" class="w-full mb-2 border rounded px-2 py-1">
            <option value="justify-start">Start</option>
            <option value="justify-center">Center</option>
            <option value="justify-end">End</option>
            <option value="justify-between">Space Between</option>
            <option value="justify-around">Space Around</option>
          </select>
  
          <button class="mt-2 w-full bg-black text-white px-3 py-1 rounded" id="applyFlexSettings">Apply</button>
        `;

        const attrs = this.getAttributes();

        menu.querySelector("#flexDirection").value =
          attrs.flexDirection || "flex-col";
        menu.querySelector("#flexDirectionDesktop").value =
          attrs.flexDirectionDesktop || "md:flex-row";
        menu.querySelector("#wrap").value = attrs.wrap || "flex-wrap";
        menu.querySelector("#gap").value = attrs.gap || "gap-4";
        menu.querySelector("#alignItems").value =
          attrs.alignItems || "items-start";
        menu.querySelector("#alignContent").value = attrs.alignContent || "";
        menu.querySelector("#justifyContent").value =
          attrs.justifyContent || "justify-start";

        const updateAttrs = () => {
          const newAttrs = {
            flexDirection: menu.querySelector("#flexDirection").value,
            flexDirectionDesktop: menu.querySelector("#flexDirectionDesktop")
              .value,
            wrap: menu.querySelector("#wrap").value,
            gap: menu.querySelector("#gap").value,
            alignItems: menu.querySelector("#alignItems").value,
            alignContent: menu.querySelector("#alignContent").value,
            justifyContent: menu.querySelector("#justifyContent").value,
          };
          this.addAttributes(newAttrs);
        };

        [
          "#flexDirection",
          "#flexDirectionDesktop",
          "#wrap",
          "#gap",
          "#alignItems",
          "#alignContent",
          "#justifyContent",
        ].forEach((id) => {
          const el = menu.querySelector(id);
          el.addEventListener("input", updateAttrs);
        });

        menu.querySelector("#applyFlexSettings").onclick = () => {
          if (menu.parentNode) menu.remove();
          document.removeEventListener("mousedown", onOutsideClick);
        };

        menu.querySelector("#cancelFlexSettings").onclick = () => {
          this.addAttributes(oldAttrs);
          if (menu.parentNode) menu.remove();
          document.removeEventListener("mousedown", onOutsideClick);
        };

        const onOutsideClick = (e) => {
          if (!menu.contains(e.target)) {
            this.addAttributes(oldAttrs);
            if (menu.parentNode) menu.remove();
            document.removeEventListener("mousedown", onOutsideClick);
          }
        };
        setTimeout(
          () => document.addEventListener("mousedown", onOutsideClick),
          0,
        );
      },
    },

    view: {
      init() {
        setupEmptyPlaceholder(this);
      },

      onEditButtonClick() {
        this.model.EditComponent("desktop");
      },
    },
  });


  editor.DomComponents.addType("image-section", {
    model: {
      defaults: {
        tagName: "section",
        movement: true,
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "grid grid-cols-1 md:grid-cols-2 image-section relative md:min-h-[400px] section",
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
              { id: "primary", name: "primary" },
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
          {
            type: "select",
            label: "Padding Top",
            name: "paddingTop",
            options: [
              { id: "pt-0", name: "0" },
              { id: "pt-12", name: "12" },
              { id: "pt-24", name: "24" },
              { id: "pt-32", name: "32" },
              { id: "pt-48", name: "48" },
            ],
            changeProp: 1,
          },
          {
            type: "select",
            label: "Padding Bottom",
            name: "paddingBottom",
            options: [
              { id: "pb-0", name: "0" },
              { id: "pb-12", name: "12" },
              { id: "pb-24", name: "24" },
              { id: "pb-32", name: "32" },
              { id: "pb-48", name: "48" },
            ],
            changeProp: 1,
          },
        ],
        styles: `
.image-section > .item-container {
  padding: 2.5rem;
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.image-section > img {
  height: 100%;
} 

  @media (max-width: 768px) {
    .image-section > .bg-box {
        height: 200px;
        width: 100%
      }
        .image-section > .item-container {
  padding: 1.25rem;
  padding-top: 4rem;
  padding-bottom: 4rem;
}
  }
  /* Media Query for MD+ (768px and above) */
  @media (min-width: 768px) {
    .image-section {
      max-height: 84vh;
    }
    .sections-contained.theme-rounded-md .image-section{
      border-radius: 2rem !important;
      overflow: hidden !important;
      max-width: 64rem;
      margin: auto;
      margin-top: 4rem;
      margin-bottom: 4rem;
    }
    .sections-contained.theme-rounded-full .image-section{
      border-radius: 3rem;
      overflow: hidden !important;
      max-width: 64rem;
      margin: auto;
      margin-top: 4rem;
      margin-bottom: 4rem;
    }
    .sections-contained.shadows .image-section{
      box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
    }
        
    .item-section>.item-container{
      overflow-y: auto;
      flex: 1; 
    }
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
        const sectionType = this.get("attributes")["sectiontype"] || "normal";
        const classList = this.getClasses() || [];
      
        // Section-type-specific classes we want to clean up before adding new ones
        const sectionTypeClasses = [
          "bg-accent-1",
          "bg-section-primary",
          "bg-section-dark",
          "bg-section-light",
          "light-text",
        ];
      
        // Remove old section-type classes only
        let filteredClasses = classList.filter(cls => !sectionTypeClasses.includes(cls));
      
        // Add section-type specific classes
        switch (sectionType) {
          case "accent-1":
            filteredClasses.push("bg-accent-1");
            break;
          case "primary":
            filteredClasses.push("bg-section-primary");
            break;
          case "dark":
            filteredClasses.push("bg-section-dark", "light-text");
            break;
          case "normal":
          default:
            filteredClasses.push("bg-section-light");
            break;
        }
      
        this.setClass(filteredClasses);
      },
    },
    view: {
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
                "type",
              )}" class="w-full border p-2 rounded" disabled>
                              </div>
                              <div>
                                  <label class="block mb-2">Attributes</label>
                                  <textarea class="w-full border p-2 rounded component-attributes" rows="4">${JSON.stringify(
                component.getAttributes(),
                null,
                2,
              )}</textarea>
                              </div>
                          </div>
                      `;

              return {
                container,
                getData() {
                  try {
                    const attrs = JSON.parse(
                      container.querySelector(".component-attributes").value,
                    );
                    return { attributes: attrs };
                  } catch (e) {
                    alert("Invalid JSON for attributes");
                    return null;
                  }
                },
              };
            },
          },
        };
      },

      onRender() {
        console.log("2. About to create bottom button");
        const buttonRowCenter = this.createMiddleButton();
        this.el.appendChild(buttonRowCenter);
        this.updateEditButton();

        // Add color swatches to the top right
        const colorSwatches = this.createColorSwatches();
        this.el.appendChild(colorSwatches);
      },

      createMiddleButton() {
        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute top-1/2  left-1/2 transform -translate-x-1/2 flex space-x-2 z-[99]";

        const addBtn = this.createSwapButton();

        row.appendChild(addBtn);
        this.buttonRowCenter = row;

        return row;
      },

      createSwapButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
      
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
</svg>


      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
        Swap
      </div>
          `;

        btn.addEventListener("click", () => {
          const model = this.model; // Access the model

          if (model) {
            // Get the current direction from attributes
            const currentDirection =
              model.get("attributes").direction || "left"; // Default to 'left' if not set

            // Toggle the direction
            const newDirection = currentDirection === "left" ? "right" : "left";

            // Update the model's direction attribute
            model.set("attributes", {
              ...model.get("attributes"), // Retain existing attributes
              direction: newDirection,
            });

            // Reflect the updated attribute in the DOM
            model.addAttributes({
              direction: newDirection,
            });

            // Optional: Re-render if necessary
            model.trigger("change:attributes");
            model.view?.render();
          }
        });

        this.swapButton = btn;
        console.log("Y. Button created:", btn);
        return btn;
      },

      createButtonRow() {
        if (this.buttonRow) return this.buttonRow;

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons absolute bottom-6 left-2 md:left-14 m-2 flex space-x-2 z-50";

        // Edit Button
        const aiBtn = this.createAiButton();
        row.appendChild(aiBtn);

        // Delete Button
        // const deleteBtn = document.createElement("button");
        // deleteBtn.className =
        //   "text-gray-900 border-gray-300 bg-white bg-opacity-10 bg-blur-md bg-clip-padding backdrop-blur-md border rounded-3xl shadow-lg h-[30px] w-[30px]";
        // deleteBtn.innerHTML = `
        //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 md:w-4 h-3 md:h-4 mx-auto">
        //           <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.26 51.26 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.227a49.18 49.18 0 00-6 0v-.227c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clip-rule="evenodd" />
        //       </svg>
        //   `;
        // deleteBtn.addEventListener("click", () => {
        //   if (confirm("Are you sure you want to delete this component?")) {
        //     this.model.remove();
        //   }
        // });
        // row.appendChild(deleteBtn);

        // Duplicate Button
        // const duplicateBtn = document.createElement("button");
        // duplicateBtn.className =
        //   "text-gray-900 border-gray-300 bg-white bg-opacity-10 bg-blur-md bg-clip-padding backdrop-blur-md border rounded-3xl shadow-lg h-[30px] w-[30px]";
        // duplicateBtn.innerHTML = `
        //       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 md:w-4 h-3 md:h-4 mx-auto">
        //           <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 013.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0121 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 017.5 16.125V3.375z" />
        //           <path d="M15 5.25a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963A5.23 5.23 0 0017.25 7.5h-1.875A.375.375 0 0115 7.125V5.25zM4.875 6H6.75a.75.75 0 00.75-.75V3.375c0-1.036-.84-1.875-1.875-1.875h-1.5A1.875 1.875 0 000 3.375v9.75C0 14.16.84 15 1.875 15H3v-3.75a3.75 3.75 0 013.75-3.75h4.125A3.75 3.75 0 0114.625 9h3.375v-.375A1.875 1.875 0 0016.125 6h-1.5a.75.75 0 01-.75-.75V3.375C13.875 2.025 12.85 1 11.5 1h-1.875a.75.75 0 01-.75-.75V1c0-1.036-.84-1.875-1.875-1.875H4.875C3.839 0 3 .84 3 1.875V4.5a.75.75 0 00.75.75z" />
        //       </svg>
        //   `;
        // duplicateBtn.addEventListener("click", () => {
        //   const newComponent = this.model.clone();
        //   this.model.parent.add(newComponent);
        // });
        // row.appendChild(duplicateBtn);

        this.buttonRow = row;
        return row;
      },

      handleSelect(selectedComponent) {
        if (selectedComponent !== this.model) {
          this.removeButtonRow();
          return;
        }

        const buttonRow = this.createButtonRow();
        this.el.appendChild(buttonRow);
      },

      handleDeselect() {
        this.removeButtonRow();
      },

      removeButtonRow() {
        if (this.buttonRow) {
          this.buttonRow.remove();
          this.buttonRow = null;
        }
      },

      createAiButton() {
        if (this.aiButton) return this.aiButton;

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      

      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
        Regenerate Section
      </div>
          `;

        btn.addEventListener("click", () => {
          editor.runCommand("regenerate-section", {
            // You can pass options here if needed
            // websiteId: 123
          });
        });

        this.aiButton = btn;
        return btn;
      },
      createColorSwatches() {
        const swatchesContainer = document.createElement("div");
        swatchesContainer.className =
          "absolute top-2 right-2 flex space-x-2 z-[99]";

        // Access the frame this component is inside
        const frame = editor.Pages.getSelected();
        const mainFrame = frame[0];

        // Safely check if frame and its attributes exist
        const isDarkMode = mainFrame?.dataDark === true;
        console.log("mainFrame", frame);
        const colors = [
          { type: "normal", color: "bg-section-light" },
          { type: "primary", color: "bg-section-primary" },
          { type: "accent-1", color: "bg-accent-1" },
          { type: "dark", color: "bg-section-dark" },
        ];

        colors.forEach((color) => {
          // Skip "dark" swatch if dark mode is not enabled
          if (color.type !== "dark" && isDarkMode) return;

          const swatch = document.createElement("div");
          swatch.className = `w-6 h-6 rounded-full border-2 border-white shadow-md hover:shadow-lg transition-all transform hover:scale-110 cursor-pointer ${color.color}`;
          swatch.addEventListener("click", () => {
            this.model.set("attributes", {
              ...this.model.get("attributes"),
              sectiontype: color.type,
            });
          });
          swatchesContainer.appendChild(swatch);
        });

        return swatchesContainer;
      },

      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
      },
    },
  });

  editor.DomComponents.addType("section", {
    model: {
      defaults: {
        addInside: true,
        tagName: "section",
        draggable: false,
        movement: true,
        droppable: false,
        attributes: {
          class:
            "flex flex-col py-24 px-3 md:px-8 relative section",
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
              { id: "primary", name: "primary" },
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

.bg-section-dark {
  background-color: var(--color-section-dark);
}
.bg-section-primary {
  background-color: var(--color-primary);
  color: var(--color-text-primary-section-text);
}

.bg-section-primary .button-primary {
  background-color: var(--color-text-primary-section-button) !important;
  color: var(--color-primary); !important;
}

.bg-section-primary .button-primary:hover {
  background-color: var(--color-text-primary-section-button) !important;
  color: var(--color-primary); !important;
}

.bg-section-primary h1,
.bg-section-primary h2,
.bg-section-primary h3,
.bg-section-primary h4,{
   color: var(--color-text-primary-section-text) !important;
   filter: invert(1) !important;
}
.bg-section-primary .content-subtitle {
   color: var(--color-text-primary-section-text) !important;
}
.bg-section-primary .content-heading {
   color: var(--color-text-primary-section-text) !important;
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

.light-text {
  color: var(--color-text-light);
}
  `,
        content: "Hero Subtitle",
      },
      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:sectiontype", this.updateSectionType);
        // Initial update of section type
        this.updateSectionType();
        this.listenTo(this, "change:paddingBottom", this.updatePadding);
        this.updatePadding();
      },

      onAttributesChange() {
        const attrs = this.get("attributes") || {};
        if (attrs["sectiontype"]) this.updateSectionType();
        if (attrs["paddingTop"] || attrs["paddingBottom"]) this.updatePadding();
      },

      updatePadding() {
        const paddingTop = this.get("attributes")["paddingTop"];
        const paddingBottom = this.get("attributes")["paddingBottom"];
      
        // If both values are empty or undefined, do nothing
        if (!paddingBottom) return;
      
        const classList = this.getClasses() || [];
      
        const paddingClasses = [
          "py-0", "py-4", "py-8", "py-12", "py-16", "py-24", "py-32", "py-48",
          "pt-0", "pt-4", "pt-8", "pt-12", "pt-16", "pt-24", "pt-32", "pt-48",
          "pb-0", "pb-4", "pb-8", "pb-12", "pb-16", "pb-24", "pb-32", "pb-48",
        ];
      
        let filtered = classList.filter(cls => !paddingClasses.includes(cls));
      
        if (paddingTop) filtered.push(paddingTop);
        if (paddingBottom) filtered.push(paddingBottom);
      
        this.setClass(filtered);
      },

      updateSectionType() {
        const sectionType = this.get("attributes")["sectiontype"] || "normal";
        const classList = this.getClasses() || [];
      
        // Section-type-specific classes we want to clean up before adding new ones
        const sectionTypeClasses = [
          "bg-accent-1",
          "bg-section-primary",
          "bg-section-dark",
          "bg-section-light",
          "light-text",
        ];
      
        // Remove old section-type classes only
        let filteredClasses = classList.filter(cls => !sectionTypeClasses.includes(cls));
      
        // Add section-type specific classes
        switch (sectionType) {
          case "accent-1":
            filteredClasses.push("bg-accent-1");
            break;
          case "primary":
            filteredClasses.push("bg-section-primary");
            break;
          case "dark":
            filteredClasses.push("bg-section-dark", "light-text");
            break;
          case "normal":
          default:
            filteredClasses.push("bg-section-light");
            break;
        }
      
        this.setClass(filteredClasses);
      },
      getName() {
        return "#" + this.getId(); // Show the component's ID
      },
    },
    view: {
      init() {
        setupEmptyPlaceholder(this);
      },
      onRender() {

        this.updateEditButton();

        // Add color swatches to the top right
        const colorSwatches = this.createColorSwatches();
        this.el.appendChild(colorSwatches);
      },

      createButtonRow() {
        if (this.buttonRow) return this.buttonRow;

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons absolute bottom-6 left-2 md:left-14 m-2 flex space-x-2 z-50";

        // Edit Button
        const aiBtn = this.createAiButton();
        row.appendChild(aiBtn);

        this.buttonRow = row;
        return row;
      },

      handleSelect(selectedComponent) {
        if (selectedComponent !== this.model) {
          this.removeButtonRow();
          return;
        }

        const buttonRow = this.createButtonRow();
        this.el.appendChild(buttonRow);
      },

      handleDeselect() {
        this.removeButtonRow();
      },

      removeButtonRow() {
        if (this.buttonRow) {
          this.buttonRow.remove();
          this.buttonRow = null;
        }
      },

      createAiButton() {
        if (this.aiButton) return this.aiButton;

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      

      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
        Regenerate Section
      </div>
          `;

        btn.addEventListener("click", () => {
          editor.runCommand("regenerate-section", {
            // You can pass options here if needed
            // websiteId: 123
          });
        });

        this.aiButton = btn;
        return btn;
      },
      createColorSwatches() {
        const swatchesContainer = document.createElement("div");
        swatchesContainer.className =
          "absolute top-2 right-2 flex space-x-2 z-[99]";

        const colors = [
          { type: "normal", color: "bg-section-light" },
          { type: "primary", color: "bg-section-primary" },
          { type: "accent-1", color: "bg-accent-1" },
          { type: "dark", color: "bg-section-dark" },
        ];

        colors.forEach((color) => {
          const swatch = document.createElement("div");
          swatch.className = `w-6 h-6 rounded-full border-2 border-white shadow-md hover:shadow-lg  transition-all transform hover:scale-110 cursor-pointer ${color.color}`;
          swatch.addEventListener("click", () => {
            this.model.set("attributes", {
              ...this.model.get("attributes"),
              sectiontype: color.type,
            });
          });
          swatchesContainer.appendChild(swatch);
        });

        return swatchesContainer;
      },
      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
      },
    },
  });

  editor.DomComponents.addType("hero-section", {
    model: {
      defaults: {
        tagName: "section",
        addInside: true,
        disableToolbar: true,
        disableMovement: true,
        // disableToolbar: true,
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "flex items-center justify-center bg-cover overflow-hidden bg-center hero-section",
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
              { id: "primary", name: "primary" },
              { id: "dark", name: "dark" },
            ],
            changeProp: 1,
          },
          {
            type: "text",
            label: "Hero Section Height (e.g., 500px, 80vh, screen)",
            name: "hero-section-height",
            placeholder: "500px / 80vh / screen",
            changeProp: 1,
          },
          {
            type: "select",
            label: "Padding Bottom",
            name: "paddingBottom",
            options: [
              { id: "pb-0", name: "0" },
              { id: "pb-12", name: "12" },
              { id: "pb-24", name: "24" },
              { id: "pb-32", name: "32" },
              { id: "pb-48", name: "48" },
            ],
            changeProp: 1,
          },
        ],
      },
      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:sectiontype", this.updateSectionType);
        // Initial update of section type
        this.updateSectionType();
        this.listenTo(this, "change:paddingBottom", this.updatePadding);
        this.listenTo(this, "change:paddingTop", this.updatePadding);
        this.updatePadding();
      },
      updatePadding() {
        const paddingTop = this.get("attributes")["paddingTop"];
        const paddingBottom = this.get("attributes")["paddingBottom"];
      
        // If both values are empty or undefined, do nothing
        if (!paddingTop && !paddingBottom) return;
      
        const classList = this.getClasses() || [];
      
        const paddingClasses = [
          "py-0", "py-4", "py-8", "py-12", "py-16", "py-24", "py-32", "py-48",
          "pt-0", "pt-4", "pt-8", "pt-12", "pt-16", "pt-24", "pt-32", "pt-48",
          "pb-0", "pb-4", "pb-8", "pb-12", "pb-16", "pb-24", "pb-32", "pb-48",
        ];
      
        let filtered = classList.filter(cls => !paddingClasses.includes(cls));
      
        if (paddingTop) filtered.push(paddingTop);
        if (paddingBottom) filtered.push(paddingBottom);
      
        this.setClass(filtered);
      },

      onAttributesChange() {
        const sectionType = this.get("attributes")["sectiontype"];
        if (sectionType) {
          this.updateSectionType();
        }
        this.updateHeightClass();
      },
      updateHeightClass() {
        const heightValue = this.get("attributes")["hero-section-height"];
        const classList = this.getClasses() || [];
      
        // Remove all existing h-[...] or h-screen classes
        const filtered = classList.filter((cls) => !/^h-\[.*\]$/.test(cls) && cls !== "h-screen");
      
        // Add new class if value is provided
        if (heightValue && heightValue.trim() !== "") {
          const heightClass = heightValue === "screen" ? "h-screen" : `h-[${heightValue}]`;
          filtered.push(heightClass);
        }
      
        this.setClass(filtered);
      },
      updateSectionType() {
        const sectionType = this.get("attributes")["sectiontype"] || "normal";
        const classList = this.getClasses() || [];
      
        // Section-type-specific classes we want to clean up before adding new ones
        const sectionTypeClasses = [
          "bg-accent-1",
          "bg-section-primary",
          "bg-section-dark",
          "bg-section-light",
          "light-text",
        ];
      
        // Remove old section-type classes only
        let filteredClasses = classList.filter(cls => !sectionTypeClasses.includes(cls));
      
        // Add section-type specific classes
        switch (sectionType) {
          case "accent-1":
            filteredClasses.push("bg-accent-1");
            break;
          case "primary":
            filteredClasses.push("bg-section-primary");
            break;
          case "dark":
            filteredClasses.push("bg-section-dark", "light-text");
            break;
          case "normal":
          default:
            filteredClasses.push("bg-section-light");
            break;
        }
      
        this.setClass(filteredClasses);
      },


    },
    view: {
      onRender() {

        this.updateEditButton();

        // Add color swatches to the top right
        const colorSwatches = this.createColorSwatches();
        this.el.appendChild(colorSwatches);
      },


      createButtonRow() {
        if (this.buttonRow) return this.buttonRow;

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons absolute bottom-6 left-2 md:left-14 m-2 flex space-x-2 z-50";

        // Edit Button
        const aiBtn = this.createAiButton();
        row.appendChild(aiBtn);

        this.buttonRow = row;
        return row;
      },

      handleSelect(selectedComponent) {
        if (selectedComponent !== this.model) {
          this.removeButtonRow();
          return;
        }

        const buttonRow = this.createButtonRow();
        this.el.appendChild(buttonRow);
      },

      handleDeselect() {
        this.removeButtonRow();
      },

      removeButtonRow() {
        if (this.buttonRow) {
          this.buttonRow.remove();
          this.buttonRow = null;
        }
      },

      createAiButton() {
        if (this.aiButton) return this.aiButton;

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      

      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
        Regenerate Section
      </div>
          `;

        btn.addEventListener("click", () => {
          editor.runCommand("regenerate-section", {
            // You can pass options here if needed
            // websiteId: 123
          });
        });

        this.aiButton = btn;
        return btn;
      },
      createColorSwatches() {
        const swatchesContainer = document.createElement("div");
        swatchesContainer.className =
          "absolute bottom-2 right-2 flex space-x-2 z-[99]";

        const colors = [
          { type: "normal", color: "bg-section-light" },
          { type: "primary", color: "bg-section-primary" },
          { type: "accent-1", color: "bg-accent-1" },
          { type: "dark", color: "bg-section-dark" },
        ];

        colors.forEach((color) => {
          const swatch = document.createElement("div");
          swatch.className = `w-6 h-6 rounded-full border-2 border-white shadow-md hover:shadow-lg  transition-all transform hover:scale-110 cursor-pointer ${color.color}`;
          swatch.addEventListener("click", () => {
            this.model.set("attributes", {
              ...this.model.get("attributes"),
              sectiontype: color.type,
            });
          });
          swatchesContainer.appendChild(swatch);
        });

        return swatchesContainer;
      },
      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
      },
    },
  });

  editor.DomComponents.addType("container", {
    model: {
      defaults: {
        textalign: true,
        addInside: true,
        draggable: false,
        droppable: false,
        tagName: "div",
        attributes: {
          class: "lg:max-w-6xl mx-auto flex flex-col gap-4 px-3 container",
          textalign: "left",
        },
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {

        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();
      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        let cls = this.getClasses().filter(
          (c) =>
            !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },
    },
    view: {
      init() {
        setupEmptyPlaceholder(this);
      },
    },
  });

  editor.DomComponents.addType('marquee', {
    model: {
      defaults: {
        tagName: 'marquee',
        addinside: true,
        draggable: false,
        droppable: false,
        attributes: {
          behavior: 'scroll',
          direction: 'left', // default direction
          scrollamount: '5',
          class: 'w-full overflow-hidden whitespace-nowrap text-xl text-gray-800',
          style: `
            mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
          `
        },
        content: `
          🚀 Launch &nbsp;&nbsp; 💡 Innovation &nbsp;&nbsp; 🌍 Global &nbsp;&nbsp; 📈 Growth &nbsp;&nbsp; 🎯 Target &nbsp;&nbsp; 🤝 Partners &nbsp;&nbsp;
          🚀`,
        traits: [
          {
            type: 'select',
            name: 'direction',
            label: 'Scroll Direction',
            options: [
              { value: 'left', name: 'Left' },
              { value: 'right', name: 'Right' },
              { value: 'up', name: 'Up' },
              { value: 'down', name: 'Down' },
            ],
            changeProp: 1,
            default: 'left', // initial default
          }
        ],
        script: function () {
          // Sync direction attribute with trait
          const dir = this.getAttribute('direction') || 'left';
          this.setAttribute('direction', dir);
        }
      },

      init() {
        // Ensure trait's value reflects in the attribute even on initial render
        const dir = this.get('attributes').direction || 'left';
        this.addAttributes({ direction: dir });

        // React to changes from trait UI
        this.on('change:attributes:direction', () => {
          const dir = this.getAttributes().direction;
          this.addAttributes({ direction: dir });
        });
      }
    }
  });


  editor.DomComponents.addType("content-title", {
    extend: "text",
    model: {
      textalign: true,
      defaults: {
        draggable: false,
        droppable: false,
        tagName: "h2",
        handlerType: "text",
        attributes: {
          class:
            "text-3xl max-w-xl lg:text-5xl mb-2 font-bold capitalize font-heading",
          textalign: "left",
        },
        content: "Hero Subtitle",
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {
        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();
      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },
    },
  });


  editor.DomComponents.addType("content-subtitle", {
    extend: "text",
    model: {
      textalign: true,
      defaults: {
        tagName: "h5",
        draggable: false,
        droppable: false,
        attributes: {
          class: "text-lg lg:text-xl mb-1 font-primary content-subtitle",
          textalign: "left",
        },
        styles: `
          .content-subtitle {
            color: var(--color-primary-light) !important;
            text-transform: capitalize;
          }
        `,
        content: "Hero Subtitle",
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {
        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();
      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },
    },
  });

  editor.DomComponents.addType("badge", {
    extend: "text",
    model: {
      defaults: {
        tagName: "div",

        draggable: false,
        droppable: false,
        attributes: {
          class:
            "capsule font-primary relative transition flex flex-row justify-center items-center my-1",
        },
        styles: `
        .capsule {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          width: max-content;
          border-style: solid;
          border-width: 1px 1px 1px 1px;
          border-color: #CDD0CD;
          padding: 7px 15px 7px 15px;
        }`,
        content: "Category",
      },
    },
  });


  editor.DomComponents.addType("content-heading", {
    extend: "text",
    model: {
      textalign: true,
      defaults: {
        tagName: "h5",
        draggable: false,
        droppable: false,
        attributes: {
          class: "text-xl font-semibold font-primary pt-1 mb-2",
          textalign: "left",
        },
        content: "Hero Subtitle",
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {
        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();
      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },
    },
  });

  editor.DomComponents.addType("body-wrapper", {
    model: {
      defaults: {
        tagName: "body",
        disableToolbar: false,
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "overflow-x-hidden scroll-smooth antialiased min-h-screen w-full",
        },
        styles: `
        .button-rounded-undefined .button-secondary{
          border-radius: 99999px !important;
        }
        .button-rounded-undefined .button-primary{
          border-radius: 99999px !important;
        }
        .badge-rounded-undefined .capsule{
          border-radius: 99999px !important;
        }
        .highlight-gradient-color-text h1 .highlight,
        .highlight-gradient-color-text h2 .highlight,
        .highlight-gradient-color-text h3 .highlight,
        .highlight-gradient-color-text h4 .highlight,
        .highlight-gradient-color-text h5 .highlight {
          background-image: var(--color-primary-gradient);
         background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  display: inline-block;
          
        }
        
        .object-cover(
					filter: sepia(0) hue-rotate(0deg) opacity(1) grayscale(0) !important;
				)
        img(
					filter: sepia(0) hue-rotate(0deg) opacity(1) grayscale(0) !important;
         
				)
          img.object-cover {
            filter: none !important;
          }
        .object-cover(
					filter: sepia(0) hue-rotate(0deg) opacity(1) grayscale(0) !important;
				)
          
        p .highlight{
          color: var(--color-primary);
        }

        .highlight-primary-color-text h1 .highlight,
        .highlight-primary-color-text h2 .highlight,
        .highlight-primary-color-text h3 .highlight,
        .highlight-primary-color-text h4 .highlight,
        .highlight-primary-color-text h5 .highlight {
          color: var(--color-primary);
        }

        .highlight-primary-bg h1 .highlight,
        .highlight-primary-bg h2 .highlight,
        .highlight-primary-bg h3 .highlight,
        .highlight-primary-bg h4 .highlight,
        .highlight-primary-bg h5 .highlight {
          background-image: linear-gradient(120deg, var(--color-primary) 0%, var(--color-primary-light)100%);
          background-repeat: no-repeat;
          background-size: 100% 30%;
          background-position: 0 90%;
        }

        /* Gradient Highlight Text with Creative Underline */
        .highlight-creative-underline h1 .highlight,
        .highlight-creative-underline h2 .highlight,
        .highlight-creative-underline h3 .highlight,
        .highlight-creative-underline h4 .highlight,
        .highlight-creative-underline h5 .highlight {
          display: inline-block;
          position: relative;
          font-weight: bold;
          text-decoration: none;
        }

        .highlight-creative-underline h1 .highlight::after,
        .highlight-creative-underline h2 .highlight::after,
        .highlight-creative-underline h3 .highlight::after,
        .highlight-creative-underline h4 .highlight::after,
        .highlight-creative-underline h5 .highlight::after {
          content: "";
          z-index: -1;
          position: absolute;
          left: 0;
          bottom: -6px; /* Adjust for desired distance */
          width: 106%;
          height: 200%;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 150' preserveAspectRatio='none'%3E%3Cpath d='M15.2,133.3L15.2,133.3c121.9-7.6,244-9.9,366.1-6.8c34.6,0.9,69.1,2.3,103.7,4' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center;
          background-color: var(--color-primary); /* Color controlled by CSS variable */
          background-size: contain;
          pointer-events: none;
          display: inline-block;
          transform: rotate(-3deg); /* Slight rotation */
        }

        body {
          color: var(--color-text-secondary);
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          color: var(--color-text-primary);
        }

        .font-primary {
          font-family: var(--font-primary) !important;
        }

        .font-heading {
          font-family: var(--font-heading) !important;
        }

        .theme-dark {
          background-color: var(--color-section-dark) !important;
          color: var(--color-text-light) !important;
        }
        .theme-dark .card-background{
          background-color: var(--color-section-dark-accent);
        }
        .theme-dark .bg-section-primary .card-background{
          background-color: var(--color-primary-dark);
        }
        .theme-dark .bg-accent-1 .card-background{
          background-color: var(--color-section-dark) !important;
        }
        .shadows .card-background{
          box-shadow:rgb(0 0 0 / 7%) 0px 4px 8px 0px;
        }
        .theme-dark h1,
        .theme-dark h2,
        .theme-dark h3,
        .theme-dark h4,
        .theme-dark h5,
        .theme-dark h6 {
          color: white;
        }

        .theme-dark .bg-section-light {
          background-color: var(--color-section-dark) !important;
        }

        .theme-dark .bg-accent-1,
        .theme-dark .bg-accent-2 {
          background-color: var(--color-section-dark-accent) !important;
        }

        .theme-rounded-md .button-primary {
          border-radius: 8px;
        }

        .shadows .button-primary{
         transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1), 
              0 4px 6px rgba(0, 0, 0, 0.05);

        }
        .shadows    .button-primary:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15), 
              0 8px 12px rgba(0, 0, 0, 0.05);
}


        .theme-rounded-md .button-secondary {
          border-radius: 8px;
        }

        .theme-rounded-full .button-primary {
          border-radius: 9999px;
        }

        .theme-rounded-full .button-secondary {
          border-radius: 9999px;
        }         
        `,
        content: "Hero Subtitle",
      },
    },
  });

  editor.DomComponents.addType("small-text", {
    extend: "text",
    model: {
      textalign: true,
      defaults: {
        tagName: "p",
        draggable: false,
        droppable: false,
        attributes: {
          class: "text-xs font-primary opacity-75 pt-1 mb-1",
          textalign: "left",
        },
        content: "Hero Subtitle",
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {
        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();
      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },
    },
  });

  editor.DomComponents.addType("hero-text-title", {
    extend: "text",
    model: {
      textalign: true,
      defaults: {
        tagName: "h1",
        movement: true,
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "hero-text-title md:max-w-2xl text-4xl lg:text-7xl pb-4 font-heading",
          textalign: "left",
        },
        styles: `
          .hero-text-title {
            text-transform: capitalize;
            text-decoration: none;
            white-space: normal;
            font-weight: 600;
          }
        `,
        content: "Heading",
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {
        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();
      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },
    },
  });

  editor.DomComponents.addType("hero-text-subtitle", {
    extend: "text",
    model: {
      textalign: true,
      defaults: {
        tagName: "h3",
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "hero-text-subtitle font-primary md:max-w-2xl text-md lg:text-lg leading-relaxed pb-4",
          textalign: "left",
        },
        styles: `
          .hero-text-subtitle {
            text-transform: capitalize;
            text-decoration: none;
            white-space: normal;
            font-weight: 500;
          }
        `,
        content: "Hero Subtitle",
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {
        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();
      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },
    },
  });

  editor.Components.addType("hero-section-container", {
    model: {
      defaults: {
        tagName: "div",
        addInside: true,
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "lg:max-w-6xl container flex flex-col flex-grow px-4 mt-40 m-4 grow pb-8",
        },
      },
    },
    view: {
      init() {
        setupEmptyPlaceholder(this);
      },
    },
  });

  editor.Components.addType("spacer", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        content: " ",
      },
    },
  });


  editor.Components.addType("row-container", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class:
            "flex flex-row flex-wrap justify-center items-center justify-start gap-x-6",
        },
      },
    },
  });
  editor.Components.addType("button-primary", {
    model: {
      defaults: {
        showEditButton: true,
        tagName: "a", // Changed to anchor tag for proper linking

        draggable: false,
        droppable: false,
        attributes: {
          class:
            "button-primary font-primary relative transition flex flex-row justify-center items-center px-8 py-4 my-2",
        },
        styles: `
.button-primary {
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  cursor: pointer;
  width: max-content;
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}
        `,
        traits: [
          {
            type: "text",
            label: "Button Text",
            name: "content",
            changeProp: 1,
          },
          {
            type: "text",
            label: "Link URL",
            name: "href",
            changeProp: 1,
          },
        ],
        propagate: ["content", "href"],
      },
    },
    view: {
      init() {
        this.componentEditHandlers = {
          // Handler specifically for button-primary components
          "button-primary": {
            createModalContent(component) {
              const container = document.createElement("div");

              // Get current values
              const content = component.get("content") || "";
              const href = component.getAttributes().href || "";
              const target = component.getAttributes().target || "";
              const openInNewTab = target === "_blank";

              // Create form elements
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="button-text">Button Text</label>
                    <input 
                      id="button-text" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500" 
                      value="${content}"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="link-url">URL</label>
                    <input 
                      id="link-url" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500" 
                      value="${href}" 
                      placeholder="https://example.com"
                    >
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      id="open-new-tab" 
                      type="checkbox" 
                      class="h-4 w-4 text-rose-500 border-gray-300 rounded" 
                      ${openInNewTab ? "checked" : ""}
                    >
                    <label for="open-new-tab" class="ml-2 block text-sm text-gray-700">
                      Open in new tab
                    </label>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  const buttonText =
                    container.querySelector("#button-text").value;
                  const linkUrl = container.querySelector("#link-url").value;
                  const openInNewTab =
                    container.querySelector("#open-new-tab").checked;

                  return {
                    content: buttonText,
                    attributes: {
                      href: linkUrl,
                      target: openInNewTab ? "_blank" : "",
                      rel: openInNewTab ? "noopener noreferrer" : "",
                    },
                  };
                },
              };
            },
          },

          // Default handler for generic components (keeping your existing handler)
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block mb-2">Component Type</label>
                    <input type="text" value="${component.get(
                "type",
              )}" class="w-full border p-2 rounded" disabled>
                  </div>
                  <div>
                    <label class="block mb-2">Attributes</label>
                    <textarea class="w-full border p-2 rounded component-attributes" rows="4">${JSON.stringify(
                component.getAttributes(),
                null,
                2,
              )}</textarea>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  try {
                    const attrs = JSON.parse(
                      container.querySelector(".component-attributes").value,
                    );
                    return { attributes: attrs };
                  } catch (e) {
                    alert("Invalid JSON for attributes");
                    return null;
                  }
                },
              };
            },
          },
        };
        this.listenTo(this.model, "active", this.onActive);
        this.listenTo(this.model, "change:content", this.updateContent);
      },

      updateContent() {
        const content = this.model.get("content");
        if (content) {
          this.el.innerHTML = content;
        }
      },

      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;

        // Add console logging for debugging
        console.log("Creating modal for component:", component);
        console.log("Component type:", componentType);
        console.log("Handler:", handler);

        if (!handler || typeof handler.createModalContent !== "function") {
          console.error("Invalid handler or missing createModalContent method");
          return null;
        }

        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        try {
          const modalContent = handler.createModalContent(component);

          if (!modalContent || !modalContent.container) {
            console.error("Failed to create modal content");
            return null;
          }

          modal.innerHTML = `
            <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
              <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                &times;
              </button>
              <h2 class="text-xl font-semibold mb-4">Edit Component</h2>
              <div class="modal-body"></div>
              <div class="mt-4 flex justify-end space-x-2">
                <button class="cancel-modal px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button class="save-modal px-4 py-2 bg-rose-500 text-white rounded">Save</button>
              </div>
            </div>
          `;

          const modalBody = modal.querySelector(".modal-body");

          // Add additional error checking
          if (!modalBody) {
            console.error("Could not find modal body");
            return null;
          }

          modalBody.appendChild(modalContent.container);

          // Event Listeners
          const closeBtn = modal.querySelector(".close-modal");
          const cancelBtn = modal.querySelector(".cancel-modal");
          const saveBtn = modal.querySelector(".save-modal");

          if (!closeBtn || !cancelBtn || !saveBtn) {
            console.error("Missing modal buttons");
            return null;
          }

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
        } catch (error) {
          console.error("Error creating modal:", error);
          return null;
        }
      },

      onEditButtonClick() {
        console.log("Edit button clicked, model:", this.model);

        const modal = this.createModal(this.model);

        // Add additional error checking
        if (!modal) {
          console.error("Failed to create modal");
          return;
        }

        // Verify modal is a valid Node before appending
        if (modal instanceof Node) {
          document.body.appendChild(modal);
        } else {
          console.error("Invalid modal created", modal);
        }
      },
    },
  });

  editor.Components.addType("button-secondary", {
    model: {
      defaults: {
        showEditButton: true,
        tagName: "a",

        draggable: false,
        droppable: false,
        attributes: {
          class:
            "button-secondary font-primary transition flex flex-row justify-center items-center px-8 py-4 my-2",
        },
        styles: `
.button-secondary {
  font-size: 12px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: inset 0px 0px 0px 1px currentcolor;
  width: max-content;
}

.button-secondary:hover {
  border: 0;
  box-shadow: inset 0px 0px 0px 1px var(--color-primary) !important;
  background-color: var(--color-primary);
  color: white;
}

.bg .button-secondary {
  box-shadow: inset 0px 0px 0px 1px white;
}

.bg-section-dark .button-secondary {
  box-shadow: inset 0px 0px 0px 1px white;
}
         `,
      },
    },
    view: {
      init() {
        this.componentEditHandlers = {
          // Handler specifically for button-primary components
          "button-secondary": {
            createModalContent(component) {
              const container = document.createElement("div");

              // Get current values
              const content = component.get("content") || "";
              const href = component.getAttributes().href || "";
              const target = component.getAttributes().target || "";
              const openInNewTab = target === "_blank";

              // Create form elements
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="button-text">Button Text</label>
                    <input 
                      id="button-text" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500" 
                      value="${content}"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="link-url">URL</label>
                    <input 
                      id="link-url" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500" 
                      value="${href}" 
                      placeholder="https://example.com"
                    >
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      id="open-new-tab" 
                      type="checkbox" 
                      class="h-4 w-4 text-rose-500 border-gray-300 rounded" 
                      ${openInNewTab ? "checked" : ""}
                    >
                    <label for="open-new-tab" class="ml-2 block text-sm text-gray-700">
                      Open in new tab
                    </label>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  const buttonText =
                    container.querySelector("#button-text").value;
                  const linkUrl = container.querySelector("#link-url").value;
                  const openInNewTab =
                    container.querySelector("#open-new-tab").checked;

                  return {
                    content: buttonText,
                    attributes: {
                      href: linkUrl,
                      target: openInNewTab ? "_blank" : "",
                      rel: openInNewTab ? "noopener noreferrer" : "",
                    },
                  };
                },
              };
            },
          },

          // Default handler for generic components (keeping your existing handler)
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block mb-2">Component Type</label>
                    <input type="text" value="${component.get(
                "type",
              )}" class="w-full border p-2 rounded" disabled>
                  </div>
                  <div>
                    <label class="block mb-2">Attributes</label>
                    <textarea class="w-full border p-2 rounded component-attributes" rows="4">${JSON.stringify(
                component.getAttributes(),
                null,
                2,
              )}</textarea>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  try {
                    const attrs = JSON.parse(
                      container.querySelector(".component-attributes").value,
                    );
                    return { attributes: attrs };
                  } catch (e) {
                    alert("Invalid JSON for attributes");
                    return null;
                  }
                },
              };
            },
          },
        };
        this.listenTo(this.model, "active", this.onActive);
        this.listenTo(this.model, "change:content", this.updateContent);
      },

      updateContent() {
        const content = this.model.get("content");
        if (content) {
          this.el.innerHTML = content;
        }
      },

      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;

        // Add console logging for debugging
        console.log("Creating modal for component:", component);
        console.log("Component type:", componentType);
        console.log("Handler:", handler);

        if (!handler || typeof handler.createModalContent !== "function") {
          console.error("Invalid handler or missing createModalContent method");
          return null;
        }

        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        try {
          const modalContent = handler.createModalContent(component);

          if (!modalContent || !modalContent.container) {
            console.error("Failed to create modal content");
            return null;
          }

          modal.innerHTML = `
            <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
              <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                &times;
              </button>
              <h2 class="text-xl font-semibold mb-4">Edit Component</h2>
              <div class="modal-body"></div>
              <div class="mt-4 flex justify-end space-x-2">
                <button class="cancel-modal px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button class="save-modal px-4 py-2 bg-rose-500 text-white rounded">Save</button>
              </div>
            </div>
          `;

          const modalBody = modal.querySelector(".modal-body");

          // Add additional error checking
          if (!modalBody) {
            console.error("Could not find modal body");
            return null;
          }

          modalBody.appendChild(modalContent.container);

          // Event Listeners
          const closeBtn = modal.querySelector(".close-modal");
          const cancelBtn = modal.querySelector(".cancel-modal");
          const saveBtn = modal.querySelector(".save-modal");

          if (!closeBtn || !cancelBtn || !saveBtn) {
            console.error("Missing modal buttons");
            return null;
          }

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
        } catch (error) {
          console.error("Error creating modal:", error);
          return null;
        }
      },

      onEditButtonClick() {
        console.log("Edit button clicked, model:", this.model);

        const modal = this.createModal(this.model);

        // Add additional error checking
        if (!modal) {
          console.error("Failed to create modal");
          return;
        }

        // Verify modal is a valid Node before appending
        if (modal instanceof Node) {
          document.body.appendChild(modal);
        } else {
          console.error("Invalid modal created", modal);
        }
      },
    },
  });

  editor.Components.addType("button-tertiary", {
    model: {
      defaults: {
        showEditButton: true,
        tagName: "button",

        draggable: false,
        droppable: false,
        attributes: {
          class:
            "button-tertiary font-primary transition px-2 pl-0 my-2",
        },
        styles: `
          .button-tertiary {
            position: relative;
            display: inline-flex;
            align-items: center;
            font-size: 16px;
            cursor: pointer;
            font-weight: 500;
            width: max-content;
          }
          .button-tertiary::after {
            content: '';
            display: inline-block;
            width: 18px;
            height: 12px; /* Slightly taller for better vertical impact */
            margin-left: 8px;
            background-color: var(--color-primary);
            mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='1' y1='7' x2='13' y2='7' stroke='black' stroke-width='2.5' stroke-linecap='round'/%3E%3Cpolyline points='9,3 13,7 9,11' stroke='black' stroke-width='2.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center;
            -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='1' y1='7' x2='13' y2='7' stroke='black' stroke-width='2.5' stroke-linecap='round'/%3E%3Cpolyline points='9,3 13,7 9,11' stroke='black' stroke-width='2.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat center;
            background-size: contain;
            transition: transform 0.3s ease;
          }
          .bg-section-primary .button-tertiary::after {
            background-color: var(--color-text-primary-section-button);
          }
          .button-tertiary:hover {
            font-weight: 600;
          }

          .button-tertiary:hover::after {
            transform: translateX(15px);
          }

         `,
      },
    },
    view: {
      init() {
        this.componentEditHandlers = {
          // Handler specifically for button-primary components
          "button-tertiary": {
            createModalContent(component) {
              const container = document.createElement("div");

              // Get current values
              const content = component.get("content") || "";
              const href = component.getAttributes().href || "";
              const target = component.getAttributes().target || "";
              const openInNewTab = target === "_blank";

              // Create form elements
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="button-text">Button Text</label>
                    <input 
                      id="button-text" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500" 
                      value="${content}"
                    >
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1" for="link-url">URL</label>
                    <input 
                      id="link-url" 
                      type="text" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500" 
                      value="${href}" 
                      placeholder="https://example.com"
                    >
                  </div>
                  
                  <div class="flex items-center">
                    <input 
                      id="open-new-tab" 
                      type="checkbox" 
                      class="h-4 w-4 text-rose-500 border-gray-300 rounded" 
                      ${openInNewTab ? "checked" : ""}
                    >
                    <label for="open-new-tab" class="ml-2 block text-sm text-gray-700">
                      Open in new tab
                    </label>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  const buttonText =
                    container.querySelector("#button-text").value;
                  const linkUrl = container.querySelector("#link-url").value;
                  const openInNewTab =
                    container.querySelector("#open-new-tab").checked;

                  return {
                    content: buttonText,
                    attributes: {
                      href: linkUrl,
                      target: openInNewTab ? "_blank" : "",
                      rel: openInNewTab ? "noopener noreferrer" : "",
                    },
                  };
                },
              };
            },
          },

          // Default handler for generic components (keeping your existing handler)
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block mb-2">Component Type</label>
                    <input type="text" value="${component.get(
                "type",
              )}" class="w-full border p-2 rounded" disabled>
                  </div>
                  <div>
                    <label class="block mb-2">Attributes</label>
                    <textarea class="w-full border p-2 rounded component-attributes" rows="4">${JSON.stringify(
                component.getAttributes(),
                null,
                2,
              )}</textarea>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  try {
                    const attrs = JSON.parse(
                      container.querySelector(".component-attributes").value,
                    );
                    return { attributes: attrs };
                  } catch (e) {
                    alert("Invalid JSON for attributes");
                    return null;
                  }
                },
              };
            },
          },
        };
        this.listenTo(this.model, "active", this.onActive);
        this.listenTo(this.model, "change:content", this.updateContent);
      },

      updateContent() {
        const content = this.model.get("content");
        if (content) {
          this.el.innerHTML = content;
        }
      },

      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;

        // Add console logging for debugging
        console.log("Creating modal for component:", component);
        console.log("Component type:", componentType);
        console.log("Handler:", handler);

        if (!handler || typeof handler.createModalContent !== "function") {
          console.error("Invalid handler or missing createModalContent method");
          return null;
        }

        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        try {
          const modalContent = handler.createModalContent(component);

          if (!modalContent || !modalContent.container) {
            console.error("Failed to create modal content");
            return null;
          }

          modal.innerHTML = `
            <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
              <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
                &times;
              </button>
              <h2 class="text-xl font-semibold mb-4">Edit Component</h2>
              <div class="modal-body"></div>
              <div class="mt-4 flex justify-end space-x-2">
                <button class="cancel-modal px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button class="save-modal px-4 py-2 bg-rose-500 text-white rounded">Save</button>
              </div>
            </div>
          `;

          const modalBody = modal.querySelector(".modal-body");

          // Add additional error checking
          if (!modalBody) {
            console.error("Could not find modal body");
            return null;
          }

          modalBody.appendChild(modalContent.container);

          // Event Listeners
          const closeBtn = modal.querySelector(".close-modal");
          const cancelBtn = modal.querySelector(".cancel-modal");
          const saveBtn = modal.querySelector(".save-modal");

          if (!closeBtn || !cancelBtn || !saveBtn) {
            console.error("Missing modal buttons");
            return null;
          }

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
        } catch (error) {
          console.error("Error creating modal:", error);
          return null;
        }
      },

      onEditButtonClick() {
        console.log("Edit button clicked, model:", this.model);

        const modal = this.createModal(this.model);

        // Add additional error checking
        if (!modal) {
          console.error("Failed to create modal");
          return;
        }

        // Verify modal is a valid Node before appending
        if (modal instanceof Node) {
          document.body.appendChild(modal);
        } else {
          console.error("Invalid modal created", modal);
        }
      },
    },
  });

  editor.DomComponents.addType("icon", {
    model: {
      defaults: {
        draggable: false,
        droppable: false,
        showEditButton: true,
        tagName: "span",
        attributes: {
          class: "relative transition isolate icon-box",
        },
        traits: [
          {
            type: "text",
            name: "icon-style",
            label: "Icon Style",
            changeProp: 1,
          },
        ],
        styles: `

.icon-box {
  display: inline-block;
  aspect-ratio: 1;
  border-radius: 9999px !important;
}

.icon-box > svg,
.icon-box > i::before {
  width: 100% !important;
  height: 100% !important;
}

.icon-style-white-bg
{
  background: white !important,
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  font-size: 100%; 
  padding: 0.7em;
  color: var(--color-primary) !important;
}

        `,

      },
      init() {
        this.listenTo(this, "change:attributes", this.updateIconStyleClass);
        this.updateIconStyleClass();
      },
  
      updateIconStyleClass() {
        const attrs = this.getAttributes() || {};
        const iconStyle = attrs["icon-style"];
      
        // Remove previous icon-style-* classes
        let cls = this.getClasses().filter(
          (c) => !c.startsWith("icon-style-")
        );
      
        // Add the new icon-style if valid
        if (iconStyle && iconStyle.startsWith("icon-style-")) {
          cls.push(iconStyle);
        }
      
        this.setClass(cls);
      },
    },
    view: {
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
                "type",
              )}" class="w-full border p-2 rounded" disabled>
                              </div>
                              <div>
                                  <label class="block mb-2">Attributes</label>
                                  <textarea class="w-full border p-2 rounded component-attributes" rows="4">${JSON.stringify(
                component.getAttributes(),
                null,
                2,
              )}</textarea>
                              </div>
                          </div>
                      `;

              return {
                container,
                getData() {
                  try {
                    const attrs = JSON.parse(
                      container.querySelector(".component-attributes").value,
                    );
                    return { attributes: attrs };
                  } catch (e) {
                    alert("Invalid JSON for attributes");
                    return null;
                  }
                },
              };
            },
          },
        };
        this.listenTo(this.model, "active", this.onActive);
        this.listenTo(this.model, "change:content", this.updateContent);
      },

      onRender() {
        this.updateEditButton();
      },

      createModal(component) {
        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        // Create modal content
        modal.innerHTML = `
          <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Select an Icon</h2>
            <div class="modal-body"></div>
            <div class="mt-4 flex justify-end space-x-2">
              <button class="cancel-modal px-4 py-2 bg-gray-200 rounded">Cancel</button>
            </div>
          </div>
        `;

        const modalBody = modal.querySelector(".modal-body");

        const handleIconSelect = (icon) => {
          console.log("Selected Icon:", icon);

          if (component) {
            // Update the component's content with the new icon SVG
            // This is the key change - update the model, not just the DOM
            component.set("content", icon.svg);

            // This will trigger a re-render of the component
            // with the updated content
            component.trigger("change:content");

            // Optional: Store the icon information in component's attributes
            // for future reference if needed
            const currentAttrs = component.getAttributes();
            component.setAttributes({
              ...currentAttrs,
              "data-icon-name": icon.name || "",
              "data-icon-type": icon.type || "",
            });
          }

          modal.remove(); // Close the modal after selection
        };

        // Render the IconPicker inside the modal body
        const iconPicker = React.createElement(IconPicker, {
          onSelectIcon: handleIconSelect,
        });
        ReactDOM.createRoot(modalBody).render(iconPicker);

        // Event Listeners for closing the modal
        const closeBtn = modal.querySelector(".close-modal");
        const cancelBtn = modal.querySelector(".cancel-modal");

        if (closeBtn && cancelBtn) {
          const closeModal = () => modal.remove();
          closeBtn.addEventListener("click", closeModal);
          cancelBtn.addEventListener("click", closeModal);
        } else {
          console.error("Missing modal close buttons");
        }

        // Append the modal to the body
        document.body.appendChild(modal);

        return modal;
      },

      onEditButtonClick() {
        console.log("Edit button clicked, model:", this.model);

        const modal = this.createModal(this.model);
      },

      handleSelect(selectedComponent) {
        if (selectedComponent !== this.model) {
          return;
        }
      },

      handleDeselect() { },

      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
      },
    },
  });

  editor.Components.addType("two-columns", {
    model: {
      defaults: {
        tagName: "div",
        addInside: true,
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
            "md:[&>*:last-child]:col-span-5",
          );
        } else if (offset === "right") {
          classes.push("md:grid-cols-12");
          classes.push(
            "md:[&>*:first-child]:col-span-5",
            "md:[&>*:last-child]:col-span-7",
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

        draggable: false,
        droppable: false,
        attributes: {
          class:
            "w-full h-[300px] aspect-w-16 aspect-h-9 bg-cover bg-center visuals-full-image",
        },
        styles: `
.visuals-full-image {
  background-image: url("http://hompark.themezinho.net/wp-content/uploads/2020/03/gallery-thumb02.jpg");
}
        `,
      },
    },
  });

  editor.Components.addType("text-content", {
    textalign: true,
    extend: "text",
    model: {
      defaults: {
        draggable: false,
        droppable: false,
        tagName: "div",
        attributes: {
          class: "mb-3 para",
          textalign: "left",
        },
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {

        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();

      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        // Remove previous alignment-related classes
        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        console.log("Bob " + align)
        // Add new alignment classes
        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },

    },
  });

  editor.Components.addType("statistic-text", {
    textalign: true,
    extend: "text",
    model: {
      defaults: {
        draggable: false,
        droppable: false,
        tagName: "h5",
        attributes: {
          class: "mb-1 text-[40px]",
          textalign: "left",
        },
        traits: [
          {
            type: "select",
            name: "textalign",
            label: "Text Align",
            options: [
              { value: "left", name: "Left" },
              { value: "center", name: "Center" },
              { value: "right", name: "Right" },
            ],
          },
        ],
      },

      init() {

        this.listenTo(this, "change:attributes", this.updateTextAlign);
        this.updateTextAlign();

      },

      updateTextAlign() {
        const attrs = this.getAttributes();
        const align = attrs.textalign || "left";

        // Remove previous alignment-related classes
        let cls = this.getClasses().filter(
          (c) => !["text-left", "text-center", "text-right", "items-center", "items-end"].includes(c)
        );

        console.log("Bob " + align)
        // Add new alignment classes
        if (align === "left") {
          cls.push("text-left");
        } else if (align === "center") {
          cls.push("text-center", "items-center");
        } else if (align === "right") {
          cls.push("text-right", "items-end");
        }

        this.setClass(cls);
      },

    },
  });


  editor.Components.addType("title-text-container", {
    model: {
      defaults: {
        draggable: false,
        droppable: false,
        tagName: "div",
        attributes: {
          class: "mb-10 text-left",
          center: "false",
        },
      },

      init() {
        this.updateClasses();
        this.listenTo(this, "change:attributes:center", this.updateClasses);
      },

      updateClasses() {
        const attrs = this.getAttributes();
        const cls = this.getClasses().filter((c) => !c.startsWith("text-"));

        if (attrs.center === "true") {
          cls.push("text-center");
        } else {
          cls.push("text-left");
        }

        this.setClass(cls);
      },

      toggleCenter() {
        const center =
          this.getAttributes().center === "true" ? "false" : "true";
        this.addAttributes({ center });
      },
    },

    view: {
      onRender() {
        const btn = document.createElement("div");
        btn.className =
          "gjs-title-center-btn absolute top-0 right-0 z-[9999] bg-white text-xs px-2 py-1 border rounded shadow";
        btn.innerText = "↔ Align";
        btn.style.cursor = "pointer";
        btn.style.display = "none";

        this.el.style.position = "relative";
        this.el.appendChild(btn);

        btn.onclick = () => {
          this.model.toggleCenter();
        };

        this.el.addEventListener("mouseenter", () => {
          btn.style.display = "block";
        });

        this.el.addEventListener("mouseleave", () => {
          btn.style.display = "none";
        });
      },
    },
  });

  editor.Components.addType("bg-box", {
    model: {
      defaults: {
        showEditButton: true,
        addInside: true,
        draggable: false,
        droppable: false,
        tagName: "div",
        attributes: {
          class:
            "w-full h-full bg-center bg-cover relative bg-box bg",
          "bg-image": "https://example.com/default-image.jpg", // Initial background image URL
          "bg-overlay": "primary-gradient",
        },
        content: " ",
        traits: [
          {
            type: "text",
            label: "Background Image URL",
            name: "bg-image",
            changeProp: 1,
          },
          {
            type: "select", // Changed from checkbox to select
            label: "Background Overlay",
            name: "bg-overlay",
            options: [
              { id: "primary-gradient", name: "Primary Gradient Overlay" },
              { id: "bottom-gradient", name: "Black Gradient from Bottom" },
              { id: "top-gradient", name: "Black Gradient from Top" },
              { id: "left-gradient", name: "Black Gradient from Left" },
              { id: "right-gradient", name: "Black Gradient from Right" },
              { id: "full-dark", name: "Full Dark Overlay" },
            ],
            changeProp: 1,
          },
        ],
        propagate: ["bg-image", "bg-overlay"],
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:bg-image", this.updateBackgroundImage);
        this.listenTo(this, "change:bg-overlay", this.updateBackgroundOverlay);
        this.updateBackgroundImage();
        this.updateBackgroundOverlay();
      },

      onAttributesChange() {
        const bgImage = this.get("attributes")["bg-image"];
        if (bgImage) {
          this.updateBackgroundImage();
        }

        const bgOverlay = this.get("attributes")["bg-overlay"];
        if (bgOverlay !== undefined) {
          this.updateBackgroundOverlay();
        }
      },

      updateBackgroundImage() {
        const url = this.get("attributes")["bg-image"] || "";
        const style = { ...this.get("style") };

        style.background = `url('${url}') no-repeat center center/cover`;

        this.set({ style });
      },

      // This method updates DOM classes when the view is available
      updateBackgroundOverlay() {
        const overlay =
          this.get("attributes")["bg-overlay"] || "primary-gradient";
        if (overlay != "primary-gradient") {
          const url = this.get("attributes")["bg-image"] || "";
          const style = { ...this.get("style") };

          style.background = `url('${url}') no-repeat center center/cover`;

          this.set({ style });
        }
        // List of known overlay classes
        const overlayClasses = [
          "primary-gradient-overlay",
          "bottom-gradient-overlay",
          "top-gradient-overlay",
          "left-gradient-overlay",
          "right-gradient-overlay",
          "full-dark-overlay",
          "no-overlay",
        ];

        // Remove all previous overlay classes
        overlayClasses.forEach((cls) => {
          this.removeClass(cls);
        });

        // Add the new overlay class
        this.addClass(`${overlay}-overlay`);
      },
    },
    view: {
      init() {
        setupEmptyPlaceholder(this);
        this.componentEditHandlers = {
          // Default handler for generic components
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              const currentBgImage =
                component.get("attributes")["bg-image"] || "";
              const currentBgOverlay =
                component.get("attributes")["bg-overlay"] || "primary-gradient";

              // Create overlay swatch options
              const overlayOptions = [
                {
                  id: "primary-gradient",
                  name: "Primary Gradient",
                  color:
                    "linear-gradient(161deg, #26282b 0%, #26282b 49%, #ff4b91 100%)",
                },
                {
                  id: "bottom-gradient",
                  name: "Black from Bottom",
                  color:
                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "top-gradient",
                  name: "Black from Top",
                  color:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "left-gradient",
                  name: "Black from Left",
                  color:
                    "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "right-gradient",
                  name: "Black from Right",
                  color:
                    "linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "full-dark",
                  name: "Full Dark Overlay",
                  color:
                    "linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.5) 100%)",
                },
              ];

              // Create the HTML for overlay swatches
              let overlaySwatchesHTML = "";
              overlayOptions.forEach((option) => {
                const isSelected = currentBgOverlay === option.id;
                overlaySwatchesHTML += `
                  <div class="overlay-swatch-item ${isSelected ? "selected" : ""
                  }" data-overlay="${option.id}">
                    <div class="swatch" style="background: ${option.color
                  }"></div>
                    <div class="swatch-name">${option.name}</div>
                  </div>
                `;
              });

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
                    
                    <div class="mt-4">
                      <h3 class="text-lg font-medium mb-2">Background Overlay</h3>
                      <div class="overlay-swatches grid grid-cols-3 gap-3">
                        ${overlaySwatchesHTML}
                      </div>
                      <style>
                        .overlay-swatches .overlay-swatch-item {
                          cursor: pointer;
                          border: 2px solid transparent;
                          border-radius: 8px;
                          padding: 5px;
                          transition: all 0.2s ease;
                        }
                        
                        .overlay-swatches .overlay-swatch-item.selected {
                          border-color: #ff4b91;
                        }
                        
                        .overlay-swatches .swatch {
                          height: 40px;
                          border-radius: 4px;
                          margin-bottom: 4px;
                        }
                        
                        .overlay-swatches .swatch-name {
                          font-size: 12px;
                          text-align: center;
                          white-space: nowrap;
                          overflow: hidden;
                          text-overflow: ellipsis;
                        }
                      </style>
                    </div>
                  </div>
                </div>
              `;

              let selectedFile = null;
              let selectedOverlay = currentBgOverlay;
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

              // Handle overlay swatch selection
              const swatchItems = container.querySelectorAll(
                ".overlay-swatch-item",
              );
              swatchItems.forEach((item) => {
                item.addEventListener("click", () => {
                  // Remove selected class from all swatches
                  swatchItems.forEach((swatch) =>
                    swatch.classList.remove("selected"),
                  );
                  // Add selected class to clicked swatch
                  item.classList.add("selected");
                  // Store selected overlay
                  selectedOverlay = item.dataset.overlay;
                });
              });

              return {
                container,
                async getData() {
                  let result = {
                    attributes: {
                      "bg-overlay": selectedOverlay,
                    },
                  };

                  if (!selectedFile) {
                    result.attributes["bg-image"] =
                      component.get("attributes")["bg-image"];
                    return result;
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

                    const token = document.cookie
                      .split("; ")
                      .find((row) => row.startsWith("Bearer="))
                      ?.split("=")[1];

                    if (!token) {
                      throw new Error("Authorization token not found");
                    }

                    // Get presigned URL with correct content type
                    const presignedResponse = await fetch(
                      `${BACKEND_URL}/api/presigned-url`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          file_name: uniqueFileName,
                          file_type: selectedFile.type,
                        }),
                      },
                    );

                    const { file_url, presigned_url } =
                      await presignedResponse.json();

                    // Upload to S3 using PUT request with correct headers
                    const uploadResponse = await fetch(presigned_url, {
                      method: "PUT",
                      headers: {
                        "Content-Type": selectedFile.type,
                      },
                      body: selectedFile,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error(
                        `Upload failed with status: ${uploadResponse.status}`,
                      );
                    }

                    // Get clean URL without query params
                    const imageUrl = file_url.split("?")[0];

                    result.attributes["bg-image"] = imageUrl;
                    return result;
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    // Log more detailed error information
                    if (error.response) {
                      console.error("Response status:", error.response.status);
                      console.error(
                        "Response data:",
                        await error.response.text(),
                      );
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
      createButtonRow() {
        if (this.buttonRow) return this.buttonRow;

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons absolute bottom-6 left-2 md:left-14 m-2 flex space-x-2 z-50";

        // Edit Button
        const editBtn = this.createEditButton();
        row.appendChild(editBtn);

        this.buttonRow = row;
        return row;
      },
      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;

        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        const modalContent = handler.createModalContent(component);

        modal.innerHTML = `
          <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Edit Component</h2>
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

        saveBtn.addEventListener("click", async () => {
          const editData = await modalContent.getData();
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
      createEditButton() {
        if (this.editButton) return this.editButton;

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 my-1"">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
      
          <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
          Edit Image
          </div>
              `;

        btn.addEventListener("click", this.onEditButtonClick.bind(this));

        this.editButton = btn;
        return btn;
      },
      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
      },

      handleSelect(selectedComponent) {
        if (selectedComponent !== this.model) {
          this.removeButtonRow();
          return;
        }

        const buttonRow = this.createButtonRow();
        this.el.appendChild(buttonRow);
      },

      handleDeselect() {
        this.removeButtonRow();
      },

      removeButtonRow() {
        if (this.buttonRow) {
          this.buttonRow.remove();
          this.buttonRow = null;
        }
      },
    },
  });

  editor.Components.addType("hero-section-bg", {
    model: {
      defaults: {
        disableMovement: true,
        tagName: "div",
        draggable: false,
        droppable: false,
        disableToolbar: true,
        attributes: {
          class:
            "flex items-center justify-center bg-cover bg-center  overflow-hidden bg-black hero-section bg",
          "bg-image": "https://example.com/default-image.jpg", // Initial background image URL
          "bg-overlay": "primary-gradient", // Default overlay
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
        styles: `.bg
  *:not(.gjs-component-buttons):not(.gjs-component-buttons *):not(.highlight):not(.card *) {
  z-index: 2;
  color: white;
}

.hero-section {
  position: relative;
  z-index: 2;
  width: 100%;           /* Ensures minimum full screen height */
  display: flex;                  /* Enables vertical alignment */
  flex-direction: column;
  justify-content: center;        /* Center content vertically */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-section-container>.flex {
  flex-grow: 1;
}

.primary-gradient-overlay::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    161deg,
    #26282b 0%,
    #26282b 49%,
    var(--color-primary) 100%
  );
  opacity: 0.65;
  pointer-events: none;
}

.full-dark-overlay::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0.65;
  pointer-events: none;
}

.top-gradient-overlay::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to top, #0000006e 0%, rgb(0, 0, 0) 100%);
  opacity: 0.65;
  pointer-events: none;
}

.bottom-gradient-overlay::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom, #0000006e 0%, rgb(0, 0, 0) 100%);
  opacity: 0.65;
  pointer-events: none;
}

.left-gradient-overlay::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  opacity: 0.65;
  pointer-events: none;
}

.right-gradient-overlay::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.05) 100%
  );
  opacity: 0.65;
  pointer-events: none;
}

.right-gradient-overlay::before {
  content: "";
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: rgba(0, 0, 0, 0);
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
            type: "select", // Changed from checkbox to select
            label: "Background Overlay",
            name: "bg-overlay",
            options: [
              { id: "primary-gradient", name: "Primary Gradient Overlay" },
              { id: "bottom-gradient", name: "Black Gradient from Bottom" },
              { id: "top-gradient", name: "Black Gradient from Top" },
              { id: "left-gradient", name: "Black Gradient from Left" },
              { id: "right-gradient", name: "Black Gradient from Right" },
              { id: "full-dark", name: "Full Dark Overlay" },
            ],
            changeProp: 1,
          },
          {
            type: "text",
            label: "Hero Section Height (e.g., 500px, 80vh, screen)",
            name: "hero-section-height",
            placeholder: "500px / 80vh / screen",
            changeProp: 1,
          },
        ],
        propagate: ["bg-image", "bg-overlay"],
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
        this.listenTo(this, "change:bg-image", this.updateBackgroundImage);
        this.listenTo(this, "change:bg-overlay", this.updateBackgroundOverlay);
        this.listenTo(this, "change:hero-section-height", this.updateHeightClass);
        this.updateBackgroundImage();
        this.updateBackgroundOverlay();
        this.updateHeightClass();
      },

      onAttributesChange() {
        const bgImage = this.get("attributes")["bg-image"];
        if (bgImage) {
          this.updateBackgroundImage();
        }

        const bgOverlay = this.get("attributes")["bg-overlay"];
        if (bgOverlay !== undefined) {
          this.updateBackgroundOverlay();
        }
      },

      updateBackgroundImage() {
        const url = this.get("attributes")["bg-image"] || "";
        const style = { ...this.get("style") };

        style.background = `linear-gradient(to bottom right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('${url}') no-repeat center center/cover`;

        this.set({ style });
      },
      updateHeightClass() {
        const heightValue = this.get("attributes")["hero-section-height"];
        const classList = this.getClasses() || [];
      
        // Remove all existing h-[...] or h-screen classes
        const filtered = classList.filter((cls) => !/^h-\[.*\]$/.test(cls) && cls !== "h-screen");
      
        // Add new class if value is provided
        if (heightValue && heightValue.trim() !== "") {
          const heightClass = heightValue === "screen" ? "h-screen" : `h-[${heightValue}]`;
          filtered.push(heightClass);
        }
      
        this.setClass(filtered);
      },
      // This method updates DOM classes when the view is available
      updateBackgroundOverlay() {
        const overlay =
          this.get("attributes")["bg-overlay"] || "primary-gradient";
        if (overlay != "primary-gradient") {
          const url = this.get("attributes")["bg-image"] || "";
          const style = { ...this.get("style") };

          style.background = `url('${url}') no-repeat center center/cover`;

          this.set({ style });
        }
        // List of known overlay classes
        const overlayClasses = [
          "primary-gradient-overlay",
          "bottom-gradient-overlay",
          "top-gradient-overlay",
          "left-gradient-overlay",
          "right-gradient-overlay",
          "full-dark-overlay",
          "no-overlay",
        ];

        // Remove all previous overlay classes
        overlayClasses.forEach((cls) => {
          this.removeClass(cls);
        });

        // Add the new overlay class
        this.addClass(`${overlay}-overlay`);
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
              const currentBgOverlay =
                component.get("attributes")["bg-overlay"] || "primary-gradient";

              // Create overlay swatch options
              const overlayOptions = [
                {
                  id: "primary-gradient",
                  name: "Primary Gradient",
                  color:
                    "linear-gradient(161deg, #26282b 0%, #26282b 49%, #ff4b91 100%)",
                },
                {
                  id: "bottom-gradient",
                  name: "Black from Bottom",
                  color:
                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "top-gradient",
                  name: "Black from Top",
                  color:
                    "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "left-gradient",
                  name: "Black from Left",
                  color:
                    "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "right-gradient",
                  name: "Black from Right",
                  color:
                    "linear-gradient(to left, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                },
                {
                  id: "full-dark",
                  name: "Full Dark Overlay",
                  color:
                    "linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.5) 100%)",
                },
              ];

              // Create the HTML for overlay swatches
              let overlaySwatchesHTML = "";
              overlayOptions.forEach((option) => {
                const isSelected = currentBgOverlay === option.id;
                overlaySwatchesHTML += `
                  <div class="overlay-swatch-item ${isSelected ? "selected" : ""
                  }" data-overlay="${option.id}">
                    <div class="swatch" style="background: ${option.color
                  }"></div>
                    <div class="swatch-name">${option.name}</div>
                  </div>
                `;
              });

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
                    
                    <div class="mt-4">
                      <h3 class="text-lg font-medium mb-2">Background Overlay</h3>
                      <div class="overlay-swatches grid grid-cols-3 gap-3">
                        ${overlaySwatchesHTML}
                      </div>
                      <style>
                        .overlay-swatches .overlay-swatch-item {
                          cursor: pointer;
                          border: 2px solid transparent;
                          border-radius: 8px;
                          padding: 5px;
                          transition: all 0.2s ease;
                        }
                        
                        .overlay-swatches .overlay-swatch-item.selected {
                          border-color: #ff4b91;
                        }
                        
                        .overlay-swatches .swatch {
                          height: 40px;
                          border-radius: 4px;
                          margin-bottom: 4px;
                        }
                        
                        .overlay-swatches .swatch-name {
                          font-size: 12px;
                          text-align: center;
                          white-space: nowrap;
                          overflow: hidden;
                          text-overflow: ellipsis;
                        }
                      </style>
                    </div>
                  </div>
                </div>
              `;

              let selectedFile = null;
              let selectedOverlay = currentBgOverlay;
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

              // Handle overlay swatch selection
              const swatchItems = container.querySelectorAll(
                ".overlay-swatch-item",
              );
              swatchItems.forEach((item) => {
                item.addEventListener("click", () => {
                  // Remove selected class from all swatches
                  swatchItems.forEach((swatch) =>
                    swatch.classList.remove("selected"),
                  );
                  // Add selected class to clicked swatch
                  item.classList.add("selected");
                  // Store selected overlay
                  selectedOverlay = item.dataset.overlay;
                });
              });

              return {
                container,
                async getData() {
                  let result = {
                    attributes: {
                      "bg-overlay": selectedOverlay,
                    },
                  };

                  if (!selectedFile) {
                    result.attributes["bg-image"] =
                      component.get("attributes")["bg-image"];
                    return result;
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

                    const token = document.cookie
                      .split("; ")
                      .find((row) => row.startsWith("Bearer="))
                      ?.split("=")[1];

                    if (!token) {
                      throw new Error("Authorization token not found");
                    }

                    // Get presigned URL with correct content type
                    const presignedResponse = await fetch(
                      `${BACKEND_URL}/api/presigned-url`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          file_name: uniqueFileName,
                          file_type: selectedFile.type,
                        }),
                      },
                    );

                    const { file_url, presigned_url } =
                      await presignedResponse.json();

                    // Upload to S3 using PUT request with correct headers
                    const uploadResponse = await fetch(presigned_url, {
                      method: "PUT",
                      headers: {
                        "Content-Type": selectedFile.type,
                      },
                      body: selectedFile,
                    });

                    if (!uploadResponse.ok) {
                      throw new Error(
                        `Upload failed with status: ${uploadResponse.status}`,
                      );
                    }

                    // Get clean URL without query params
                    const imageUrl = file_url.split("?")[0];

                    result.attributes["bg-image"] = imageUrl;
                    return result;
                  } catch (error) {
                    console.error("Error uploading image:", error);
                    // Log more detailed error information
                    if (error.response) {
                      console.error("Response status:", error.response.status);
                      console.error(
                        "Response data:",
                        await error.response.text(),
                      );
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

      createButtonRow() {
        if (this.buttonRow) return this.buttonRow;

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons absolute bottom-6 left-2 md:left-14 m-2 flex space-x-2 z-50";

        // Edit Button
        const editBtn = this.createEditButton();
        row.appendChild(editBtn);

        // Edit Button
        const aiBtn = this.createAiButton();
        row.appendChild(aiBtn);

        this.buttonRow = row;
        return row;
      },

      createModal(component) {
        const componentType = component.get("type") || "default";
        const handler =
          this.componentEditHandlers[componentType] ||
          this.componentEditHandlers.default;

        const modal = document.createElement("div");
        modal.className =
          "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

        const modalContent = handler.createModalContent(component);

        modal.innerHTML = `
          <div class="bg-white p-6 rounded-lg max-w-md w-full relative">
            <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-gray-900">
              &times;
            </button>
            <h2 class="text-xl font-semibold mb-4">Edit Component</h2>
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

        saveBtn.addEventListener("click", async () => {
          const editData = await modalContent.getData();
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
          this.removeButtonRow();
          return;
        }

        const buttonRow = this.createButtonRow();
        this.el.appendChild(buttonRow);
      },

      handleDeselect() {
        this.removeButtonRow();
      },

      removeButtonRow() {
        if (this.buttonRow) {
          this.buttonRow.remove();
          this.buttonRow = null;
        }
      },

      createEditButton() {
        if (this.editButton) return this.editButton;

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 my-1"">
        <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
      </svg>
  
      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
      Edit Image
      </div>
          `;

        btn.addEventListener("click", this.onEditButtonClick.bind(this));

        this.editButton = btn;
        return btn;
      },

      createAiButton() {
        if (this.aiButton) return this.aiButton;

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
      
  
      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
        Regenerate Section
      </div>
          `;

        btn.addEventListener("click", () => {
          editor.runCommand("regenerate-section", {
            // You can pass options here if needed
            // websiteId: 123
          });
        });

        this.aiButton = btn;
        return btn;
      },
    },
  });

  editor.DomComponents.addType("footer", {
    model: {
      defaults: {
        tagName: "footer",
        disableMovement: true,
        disableToolbar: true,
        draggable: false,
        droppable: false,
        attributes: { class: "bg-section-dark light-text" },
        content: `
            <div class="mx-auto px-4 pt-16 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
              <div class="row-gap-6 mb-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div class="sm:col-span-2">
                  <div class="flex flex-shrink-0 items-center">
                    <a class="inline-flex" href="/"><img class="brandimg block h-9 w-auto sm:h-8" src="" /></a>
                    <h5 class="ml-1 text-xl font-bold tracking-wide"><span class="business-name"> Company</span> </h5>
                  </div>

                  <div class="lg:max-w-sm">
                    <p data-gjs-type="text-content" class=" mt-4 text-sm">
                      <p class="business-description"></p>
                    
                    </p>
                     <p data-gjs-type="text-content" class=" mt-2 text-sm">
                      <p class="business-hours"></p>
                    
                    </p>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="space-y-4 text-sm">
                  <h5 class="text-base font-bold tracking-wide">Contacts</h5>

                  <div class="space-y-4">
                    <div class="flex items-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full border">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                      </div>
                      <span class=" ml-3"><a href="" class="phone-number">+1 (555) 123-4567</a></span>
                    </div>
                    <div class="flex items-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full border">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <span class=" ml-3"><a href="/" class="email">email@example.com</a></span>
                    </div>
                    <div class="flex items-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full border">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                      </div>
                      <span class=" ml-3"><span class="address"> 123 Main Street, Anytown, USA</span></span>
                    </div>
                  </div>
                </div>

                <!-- Social -->
                <div class="icon-container">
                  <h5 class="text-base font-bold tracking-wide">Social</h5>
                  <div class="social-links flex space-x-4">
                    <a href="#" class="flex h-8 w-8 items-center justify-center rounded-full border hover:text-[var(--color-primary)]">
                      <!-- Facebook Icon SVG (wrapped in border) -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <!-- (Insert Facebook icon path here) -->
                      </svg>
                    </a>
                    <a href="#" class="flex h-8 w-8 items-center justify-center rounded-full border hover:text-[var(--color-primary)]">
                      <!-- Twitter Icon SVG (wrapped in border) -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <!-- (Insert Twitter icon path here) -->
                      </svg>
                    </a>
                    <a href="#" class="flex h-8 w-8 items-center justify-center rounded-full border hover:text-[var(--color-primary)]">
                      <!-- LinkedIn Icon SVG (wrapped in border) -->
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <!-- (Insert LinkedIn icon path here) -->
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div class="flex flex-col-reverse px-4 lg:px-8 justify-between border-t pt-5 pb-10 lg:flex-row">
                <p class="text-sm">© <span id="year"></span>  <span class="business-name">Lorem</span> All rights reserved.</p>
                <ul class="mb-3 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-5 lg:mb-0">
                  <li>
                    <a href="/contact" class="text-sm transition-colors duration-300 hover:text-[var(--color-primary)]">Contact Us</a>
                  </li>
                  
                </ul>
              </div>
            </div>

           

          `,
      },
    },
  });

  editor.Components.addType("card", {
    model: {
      defaults: {
        addInside: true,
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class: " w-full gap-2 card break-inside-avoid",
          sectiontype: "normal",
          background: "false",
          bordered: "false"
        },
        traits: [
          {
            type: "checkbox",
            label: "Bordered",
            name: "bordered",
            changeProp: 1,
          },
          {
            type: "checkbox",
            label: "Background",
            name: "background",
            changeProp: 1,
          },
        ],
        styles: `
          .card-body>.flex{
            height: 100%;
          }
            .bg-box .card-body{
              padding: 20px;
            }
          .card>.flex{
            height: 100%;
          }
          .card-bordered .card-body{
            padding: 20px;
          }

          .card-bordered {
            border-width: 1px;
            border-style: solid;
            border-color: var(--color-text-primary)
          }
            

          .card-background {
            background-color: var(--color-section-light);
          }
          .bg-section-light .card-background {
            background-color: var(--color-section-accent1);
          }

          .bg-section-dark .card-background {
            background-color: var(--color-section-dark-accent);
          }
          .bg-section-primary .card-background {
            background-color: var(--color-primary-dark);
          }
          .theme-rounded-md .card{
            overflow: hidden;
            border-radius: 14px;
          }
          .theme-rounded-full .card{
            overflow: hidden;
            border-radius: 20px;
          }
          .card-bordered:hover{
            border-color:var(--color-primary) !important;
          }
          
          .bg-section-dark .card-bordered{
            border-width: 0px !important;
            border-style: solid !important;
          }

          .bg-section-primary .card-bordered{
            border-width: 0px !important;
            border-style: solid !important;
          }

          .theme-dark .card-bordered{
            border-width: 0px !important;
            border-style: solid !important;
            border-color:rgba(42, 42, 42, 0) !important;
          }

          .card-background .card-body{
            padding: 20px;
          }

          .card h5 {
            font-weight: 600;
          }`,
      },

      init() {
        this.listenTo(this, "change:attributes", this.updateClassFromAttributes);
        this.updateClassFromAttributes();
      },

      updateClassFromAttributes() {
        const classes = this.getClasses();
        const bordered = this.get("attributes")["bordered"];
        const background = this.get("attributes")["background"];

        // Remove any previous class
        const updatedClasses = classes
          .filter(cls => cls !== "card-bordered" && cls !== "card-background");

        // Add based on trait values
        if (bordered === "true") updatedClasses.push("card-bordered");
        if (background === "true") updatedClasses.push("card-background");

        this.setClass(updatedClasses);
        console.log("rode " + bordered + background);
      },
    },
    view: {
      init() {
        setupEmptyPlaceholder(this);
      },
    },
  });


  editor.Components.addType("card-horizontal", {
    model: {
      defaults: {
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class: "card-horizontal gap-4 flex flex-row w-full text-left card", // Default class for scrolling list
          sectiontype: "normal",
        },
        traits: [],
        styles: `
.card-horizontal .card-body {
  padding-bottom: 2rem;
  padding-top: 0rem !important;
}

.card img {
  height: 260px !important;
}`,
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
      },

      onAttributesChange() { },
    },
  });

  editor.Components.addType("card-body", {
    model: {
      defaults: {
        disableMovement: true,
        tagName: "div",
        draggable: false,
        droppable: false,
        attributes: {
          class: "card-body flex flex-col w-full text-left",
        },
        traits: [],
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
      },

      onAttributesChange() { },
    },
    view: {
      init() {
        setupEmptyPlaceholder(this);
      },
    },
  });

  editor.Components.addType('google-map', {
    model: {
      defaults: {
        showEditButton: true,
        tagName: 'div',
        draggable: false,
        droppable: false,
        traits: [
          {
            type: 'text',
            name: 'location',
            label: 'Location',
            placeholder: 'e.g., New York, NY',
          },
        ],
        attributes: {
          location: 'New York, NY', // default
        },
        components: [
          { 
            selectable: false,
            disableMovement: true,
            disableToolbar: true,
            draggable: false,
            droppable: false,
            tagName: 'iframe',
            type: 'iframe',
            attributes: {
              width: '100%',
              height: '100%',
              frameborder: '0',
              style: 'border:0;height:100%;',
              allowfullscreen: true,
              loading: 'lazy',
            },
          },
        ],
        script: function () {
          // Nothing needed in script since we are updating iframe src via model
        },
      },
  
      init() {
        const location = this.get('attributes').location || 'New York, NY';
        this.updateMapSrc(location);
  
        this.on('change:attributes:location', () => {
          const newLocation = this.get('attributes').location;
          this.updateMapSrc(newLocation);
        });
      },
  
      updateMapSrc(location) {
        const iframe = this.get('components').at(0);
        if (iframe) {
          const query = encodeURIComponent(location);
          const src = `https://www.google.com/maps?q=${query}&output=embed`;
          iframe.addAttributes({ src });
        }
      },
    },
  
    view: {
      onEditButtonClick() {
        const component = this.model;
  
        const modal = document.createElement('div');
        modal.className =
          'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
  
        const container = document.createElement('div');
        container.className =
          'bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 relative';
  
        const currentLocation =
          component.getAttributes().location || 'New York, NY';
  
        container.innerHTML = `
          <button class="close-modal absolute top-4 right-4 text-gray-600 hover:text-black text-xl">&times;</button>
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">Set Google Map Location</h2>
  
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="map-location-input">Enter Location</label>
              <input 
                id="map-location-input"
                type="text"
                placeholder="e.g., Eiffel Tower, Paris"
                class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preview</label>
              <div class="aspect-video w-full border rounded overflow-hidden">
                <iframe id="map-preview-iframe" width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen loading="lazy"></iframe>
              </div>
            </div>
          </div>
  
          <div class="mt-6 flex justify-end gap-2">
            <button class="cancel-modal px-4 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200">Cancel</button>
            <button class="save-modal px-4 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-700">Save</button>
          </div>
        `;
  
        modal.appendChild(container);
        document.body.appendChild(modal);
  
        this.prefillLocation(currentLocation);
        this.attachPreviewListener();
        this.attachSaveListener(component);
        this.attachCloseListeners();
      },
  
      prefillLocation(location) {
        const input = document.querySelector('#map-location-input');
        const iframe = document.querySelector('#map-preview-iframe');
        if (input && iframe) {
          input.value = location;
          iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(
            location
          )}&output=embed`;
        }
      },
  
      attachPreviewListener() {
        const input = document.querySelector('#map-location-input');
        const iframe = document.querySelector('#map-preview-iframe');
        if (input && iframe) {
          input.addEventListener('input', () => {
            const val = input.value.trim();
            if (val.length > 2) {
              iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(
                val
              )}&output=embed`;
            }
          });
        }
      },
  
      attachSaveListener(component) {
        const saveBtn = document.querySelector('.save-modal');
        const input = document.querySelector('#map-location-input');
        if (saveBtn && input) {
          saveBtn.addEventListener('click', () => {
            const newLocation = input.value.trim();
            if (newLocation) {
              component.addAttributes({ location: newLocation });
            }
            this.closeModal();
          });
        }
      },
  
      attachCloseListeners() {
        const closeBtn = document.querySelector('.close-modal');
        const cancelBtn = document.querySelector('.cancel-modal');
        if (closeBtn) {
          closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (cancelBtn) {
          cancelBtn.addEventListener('click', () => this.closeModal());
        }
      },
  
      closeModal() {
        const modal = document.querySelector('.fixed.inset-0.bg-black');
        if (modal) modal.remove();
      },
    

    },
  });
  editor.Components.addType("scroll-marquee", {
    isComponent: el => el.classList?.contains("scroll-marquee"),
    model: {
      defaults: {
        name: "Scroll Marquee",
        tagName: "div",
        droppable: false,
        attributes: {
          class:
            "scroll-marquee overflow-hidden w-full [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]",
        },
        components: [
          {
            tagName: "div",
            attributes: {
              class: "scroll-inner flex flex-nowrap gap-8 animate-marquee",
            },
            droppable: true,
            components: [
              {
                type: "image",
                attributes: {
                  src: "https://cruip-tutorials.vercel.app/logo-carousel/apple.svg",
                  class: "h-8 w-auto",
                },
              },
              {
                type: "text",
                content: "Sample Partner",
                attributes: { class: "text-base font-medium" },
              },
            ],
          },
        ],
        styles: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `,
      },
    },
  
    view: {
      onRender({ el }) {
        const inner = el.querySelector(".scroll-inner");
        if (!inner || inner.classList.contains("duplicated")) return;
  
        const clone = inner.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.classList.add("cloned");
        inner.classList.add("duplicated");
        el.appendChild(clone);
      },
    },
  });
  
  
  
};
