import IconPicker from "./IconPicker.js";
import React, { useState, useCallback, useMemo } from "react";
import ReactDOM from "react-dom/client"; // For React 18+

const getRegisteredBlocks = () => [
  { id: "text", name: "Custom Block", icon: "📝" },
  { id: "image", name: "Image Section", icon: "🖼️" },
  { id: "gallery", name: "Image Gallery", icon: "🎭" },
  { id: "video", name: "Video Section", icon: "🎥" },
  { id: "form", name: "Contact Form", icon: "📋" },
];

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
  editor.DomComponents.addType("navbar", {
    isComponent: (el) => el.tagName === "NAV",
    model: {
      defaults: {
        tagName: "nav",
        draggable: true,
        droppable: true,
        traits: [],
        attributes: {
          class: "bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50 py-4",
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
        `,
      },
    },
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
              "type",
            )}" class="w-full border p-2 rounded" disabled>
                </div>
                <div>
                  <label class="block mb-2">Content</label>
                  <textarea class="w-full border p-2 rounded component-content" rows="4">${component.get("content") || ""
              }</textarea>
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

        // Specific handlers for different component types
        image: {
          createModalContent(component) {
            const container = document.createElement("div");
            container.innerHTML = `
              <div class="space-y-4">
                <div>
                  <label class="block mb-2">Image Source</label>
                  <input type="text" class="w-full border p-2 rounded image-src" value="${component.getAttributes().src || ""
              }">
                </div>
                <div>
                  <label class="block mb-2">Alt Text</label>
                  <input type="text" class="w-full border p-2 rounded image-alt" value="${component.getAttributes().alt || ""
              }">
                </div>
              </div>
            `;

            return {
              container,
              getData() {
                return {
                  attributes: {
                    src: container.querySelector(".image-src").value,
                    alt: container.querySelector(".image-alt").value,
                  },
                };
                const content =
                  container.querySelector(".component-content").value;
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
                  <textarea class="w-full border p-2 rounded text-content" rows="4">${component.getContent() || ""
              }</textarea>
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
                  <input type="text" class="w-full border p-2 rounded button-text" value="${component.get("content") || ""
              }">
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
                    },
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
        "fixed inset-0 bg-black bg-opacity-50 z-[50] flex items-center justify-center";

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
            <button class="save-modal px-4 py-2 bg-rose-500 text-white rounded">Save</button>
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
      if (component.getEl() === this.el) {
        const btn = this.createEditButton();
        const rect = this.el.getBoundingClientRect();

        btn.style.position = "fixed";
        btn.style.top = `${rect.top + rect.height / 2 - 15}px`;
        btn.style.left = `${rect.right - 35}px`;

        btn.addEventListener("click", () => {
          const modal = this.createModal(component);
          document.body.appendChild(modal);
        });

        const editor = this.em.get("Editor");
        editor.getContainer().appendChild(btn);
      }
    },

    handleDeselect(component) {
      if (component.getEl() === this.el) {
        const editor = this.em.get("Editor");
        const btn = editor.getContainer().querySelector(".gjs-edit-btn");
        if (btn) btn.remove();
      }
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
        styles: `
        body {
          color: var(--color-text-secondary);
        }
        h1, h2, h3, h4, h5, h6 {
          color: var(--color-text-primary);
         
        }
          .font-primary{
           font-family: var(--font-primary) !important;
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
        movement: true,
        draggable: false,
        droppable: false,
        attributes: {
          class: "grid grid-cols-1 md:grid-cols-2 py-24 image-section relative",
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
          min-height: 360px;
          max-height: 768px;
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
          "relative",
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
        const buttonRow2 = this.createBottomButton();
        const buttonRowCenter = this.createMiddleButton();

        console.log("3. Bottom button created:", buttonRow2);
        console.log("4. this.el:", this.el);

        this.el.appendChild(buttonRow2);
        this.el.appendChild(buttonRowCenter);
        this.updateEditButton();

        // Add color swatches to the top right
        const colorSwatches = this.createColorSwatches();
        this.el.appendChild(colorSwatches);
      },
      createBottomButton() {
        console.log("A. createBottomButton called");

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[99]";

        console.log("B. About to create add button");
        const addBtn = this.createAddButton();
        console.log("C. Add button created:", addBtn);

        row.appendChild(addBtn);
        this.buttonRow2 = row;

        console.log("D. Returning row:", row);
        return row;
      },
      createAddButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden z-[99]  hover:text-rose-400 flex z-100 items-center group flex-row relative rounded-md py-1 px-3 text-md leading-6 text-white bg-black ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      

      <div class="ml-3 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out block">
      Add Section
      </div>
          `;

        btn.addEventListener("click", () => {
          showAddComponentModal(this.model);
        });

        this.addButton = btn;
        console.log("Y. Button created:", btn);
        return btn;
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

        this.aiButton = btn;
        return btn;
      },
      createColorSwatches() {
        const swatchesContainer = document.createElement("div");
        swatchesContainer.className = "absolute top-2 right-2 flex space-x-2 z-[99]";

        const colors = [
          { type: "normal", color: "bg-section-light" },
          { type: "accent-1", color: "bg-accent-1" },
          { type: "accent-2", color: "bg-accent-2" },
          { type: "dark", color: "bg-section-dark" },
        ];

        colors.forEach((color) => {
          const swatch = document.createElement("div");
          swatch.className = `w-6 h-6 rounded-full border-2 border-white shadow-md hover:shadow-lg  transition-all transform hover:scale-110 cursor-pointer ${color.color}`;
          swatch.addEventListener("click", () => {
            this.model.set("attributes", { ...this.model.get("attributes"), sectiontype: color.type });
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
        tagName: "section",
        draggable: false,
        movement: true,
        droppable: false,
        attributes: {
          class: "flex flex-col py-24 bg-slate-600 light-text px-8 relative",
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

        let classes = ["flex", "flex-col", "py-28", "relative"];

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
    view: {
      onRender() {
        console.log("2. About to create bottom button");
        const buttonRow2 = this.createBottomButton();

        console.log("3. Bottom button created:", buttonRow2);
        console.log("4. this.el:", this.el);

        this.el.appendChild(buttonRow2);

        // Add color swatches to the top right
        const colorSwatches = this.createColorSwatches();
        this.el.appendChild(colorSwatches);
      },
      createBottomButton() {
        console.log("A. createBottomButton called");

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[99]";

        console.log("B. About to create add button");
        const addBtn = this.createAddButton();
        console.log("C. Add button created:", addBtn);

        row.appendChild(addBtn);
        this.buttonRow2 = row;

        console.log("D. Returning row:", row);
        return row;
      },
      createAddButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden z-[99]  hover:text-rose-400 flex z-100 items-center group flex-row relative rounded-md py-1 px-3 text-md leading-6 text-white bg-black ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-1">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <div class="ml-3 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out block">
            Add Section
          </div>
        `;

        btn.addEventListener("click", () => {
          showAddComponentModal(this.model);
        });

        this.addButton = btn;
        console.log("Y. Button created:", btn);
        return btn;
      },
      createColorSwatches() {
        const swatchesContainer = document.createElement("div");
        swatchesContainer.className = "absolute top-2 right-2 flex space-x-2 z-[99]";

        const colors = [
          { type: "normal", color: "bg-section-light" },
          { type: "accent-1", color: "bg-accent-1" },
          { type: "accent-2", color: "bg-accent-2" },
          { type: "dark", color: "bg-section-dark" },
        ];

        colors.forEach((color) => {
          const swatch = document.createElement("div");
          swatch.className = `w-6 h-6 rounded-full border-2 border-white shadow-md hover:shadow-lg  transition-all transform hover:scale-110 cursor-pointer ${color.color}`;
          swatch.addEventListener("click", () => {
            this.model.set("attributes", { ...this.model.get("attributes"), sectiontype: color.type });
          });
          swatchesContainer.appendChild(swatch);
        });

        return swatchesContainer;
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
        handlerType: "text", // Specify handler type
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
        movement: true,
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
            "hero-text-subtitle md:max-w-2xl text-md lg:text-lg leading-relaxed pb-4",
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

  editor.Components.addType("stack", {
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
        const buttonRow2 = this.createBottomButton();
        const buttonRowCenter = this.createMiddleButton();

        console.log("3. Bottom button created:", buttonRow2);
        console.log("4. this.el:", this.el);

        this.el.appendChild(buttonRow2);
        this.el.appendChild(buttonRowCenter);
        this.updateEditButton();
      },
      createBottomButton() {
        console.log("A. createBottomButton called");

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[99]";

        console.log("B. About to create add button");
        const addBtn = this.createAddButton();
        console.log("C. Add button created:", addBtn);

        row.appendChild(addBtn);
        this.buttonRow2 = row;

        console.log("D. Returning row:", row);
        return row;
      },
      createAddButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden z-[99]  hover:text-rose-400 flex z-100 items-center group flex-row relative rounded-md py-1 px-3 text-md leading-6 text-white bg-black ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      

      <div class="ml-3 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out block">
      Add Section
      </div>
          `;

        btn.addEventListener("click", () => {
          showAddComponentModal(this.model);
        });

        this.addButton = btn;
        console.log("Y. Button created:", btn);
        return btn;
      },

      createMiddleButton() {
        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 mx-auto my-3 text-center z-[99]";

        const addBtn = this.createSwapButton();

        row.appendChild(addBtn);
        this.buttonRowCenter = row;

        return row;
      },

      createSwapButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden mx-auto text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
      
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      


      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
        Add Item
      </div>
          `;

        btn.addEventListener("click", () => { });

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

        this.aiButton = btn;
        return btn;
      },

      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
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
        showEditButton: true,
        tagName: "a", // Changed to anchor tag for proper linking
        droppable: false,
        attributes: {
          class:
            "button-primary relative transition flex flex-row justify-center items-center px-8 py-4 mx-2 my-2",
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
                      ${openInNewTab ? 'checked' : ''}
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
                  const buttonText = container.querySelector("#button-text").value;
                  const linkUrl = container.querySelector("#link-url").value;
                  const openInNewTab = container.querySelector("#open-new-tab").checked;

                  return {
                    content: buttonText,
                    attributes: {
                      href: linkUrl,
                      target: openInNewTab ? "_blank" : "",
                      rel: openInNewTab ? "noopener noreferrer" : ""
                    }
                  };
                }
              };
            }
          },

          // Default handler for generic components (keeping your existing handler)
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block mb-2">Component Type</label>
                    <input type="text" value="${component.get("type")}" class="w-full border p-2 rounded" disabled>
                  </div>
                  <div>
                    <label class="block mb-2">Attributes</label>
                    <textarea class="w-full border p-2 rounded component-attributes" rows="4">${JSON.stringify(
                component.getAttributes(),
                null,
                2
              )}</textarea>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  try {
                    const attrs = JSON.parse(
                      container.querySelector(".component-attributes").value
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
                <button class="save-modal px-4 py-2 !bg-rose-500 text-white rounded">Save</button>
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
         box-shadow:inset 0px 0px 0px 1px var(--color-text-primary);
        }
        .button-secondary:hover{
          border: 0;
          box-shadow:inset 0px 0px 0px 1px var(--color-primary);
          background-color:var(--color-primary);
          color: white;
        }
        .hero-section .button-secondary{
          box-shadow:inset 0px 0px 0px 1px white !important;
        }
           .bg-section-dark .button-secondary{
          box-shadow:inset 0px 0px 0px 1px white !important;
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
                      ${openInNewTab ? 'checked' : ''}
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
                  const buttonText = container.querySelector("#button-text").value;
                  const linkUrl = container.querySelector("#link-url").value;
                  const openInNewTab = container.querySelector("#open-new-tab").checked;

                  return {
                    content: buttonText,
                    attributes: {
                      href: linkUrl,
                      target: openInNewTab ? "_blank" : "",
                      rel: openInNewTab ? "noopener noreferrer" : ""
                    }
                  };
                }
              };
            }
          },

          // Default handler for generic components (keeping your existing handler)
          default: {
            createModalContent(component) {
              const container = document.createElement("div");
              container.innerHTML = `
                <div class="space-y-4">
                  <div>
                    <label class="block mb-2">Component Type</label>
                    <input type="text" value="${component.get("type")}" class="w-full border p-2 rounded" disabled>
                  </div>
                  <div>
                    <label class="block mb-2">Attributes</label>
                    <textarea class="w-full border p-2 rounded component-attributes" rows="4">${JSON.stringify(
                component.getAttributes(),
                null,
                2
              )}</textarea>
                  </div>
                </div>
              `;

              return {
                container,
                getData() {
                  try {
                    const attrs = JSON.parse(
                      container.querySelector(".component-attributes").value
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
                <button class="save-modal px-4 py-2 !bg-rose-500 text-white rounded">Save</button>
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
        showEditButton: true,
        tagName: "span",
        attributes: {
          class: "relative transition isolate icon-box",
        },
        styles: `
        
          .icon-box svg{
            height: 1rem;
            width: 1rem;
          margin: 4px;
          }

          .card:hover>.icon-box>svg{
          color:var(--color-primary) !important;
          }

          .icon-box{
          display: inline-block;
          aspect-ratio: '1/1';
          width: auto;
          height: auto;
          }

          .card .icon-box>svg{
          width: 3.5rem !important;
          height: 3.5rem !important;
        }
           .card-horizontal>.icon-box>svg{
          width: 2.5rem !important;
          height: 2.5rem !important;
        }
        `,
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
        droppable: false,
        attributes: {
          class:
            "w-full h-[300px] aspect-w-16 aspect-h-9 bg-cover bg-center visuals-full-image",
        },
        styles: `.visuals-full-image{background-image: url('http://hompark.themezinho.net/wp-content/uploads/2020/03/gallery-thumb02.jpg');}`,
      },
    },
  });

  editor.Components.addType("text-content", {
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
        disableMovement: true,
        tagName: "div",
        disableToolbar: true,
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
        .hero-section *:not(.gjs-component-buttons):not(.gjs-component-buttons *){
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
          (comp) => comp.get("type") === "hero-section-container",
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
        console.log("2. About to create bottom button");
        const buttonRow2 = this.createBottomButton();

        console.log("3. Bottom button created:", buttonRow2);
        console.log("4. this.el:", this.el);

        this.el.appendChild(buttonRow2);
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

      createBottomButton() {
        console.log("A. createBottomButton called");

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute -bottom-6 m-2 flex space-x-2 z-500";

        console.log("B. About to create add button");
        const addBtn = this.createAddButton();
        console.log("C. Add button created:", addBtn);

        row.appendChild(addBtn);
        this.buttonRow2 = row;

        console.log("D. Returning row:", row);
        return row;
      },
      createAddButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden   hover:text-rose-400 flex z-100 items-center group flex-row relative rounded-md py-1 px-3 text-md leading-6 text-gray-600 bg-black ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      

      <div class="ml-3 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out block">
      Add Section
      </div>
          `;

        btn.addEventListener("click", () => {
          showAddComponentModal(this.model);
        });

        this.addButton = btn;
        console.log("Y. Button created:", btn);
        return btn;
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

        btn.addEventListener("click", this.onEditButtonClick.bind(this));

        this.aiButton = btn;
        return btn;
      },
    },
  });

  editor.DomComponents.addType("navbar1", {
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
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
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
    isComponent: (el) => el.tagName === "NAV",
    model: {
      defaults: {
        tagName: "nav",
        draggable: true,
        droppable: true,
        traits: [withEditButton3],
        attributes: {
          class: "bg-gray-900 shadow-lg fixed top-0 left-0 right-0 z-50 py-4",
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
                      class: "text-2xl font-bold text-white",
                    },
                  },
                ],
                attributes: {
                  class: "flex items-center",
                },
              },
              {
                type: "blank-container",
                components: [
                  {
                    type: "navbar-link",
                    content: "Test Nav 1",
                    attributes: {
                      href: "#",
                      class:
                        "text-white hover:text-gray-300 px-3 py-2 text-base font-medium",
                    },
                  },
                  {
                    type: "navbar-link",
                    content: "Test Nav 2",
                    attributes: {
                      href: "#",
                      class:
                        "text-white hover:text-gray-300 px-3 py-2 text-base font-medium",
                    },
                  },
                  {
                    type: "navbar-link",
                    content: "Test Nav 3",
                    attributes: {
                      href: "#",
                      class:
                        "text-white hover:text-gray-300 px-3 py-2 text-base font-medium",
                    },
                  },
                ],
                attributes: {
                  class: "flex items-center space-x-8",
                },
              },
            ],
            attributes: {
              class: "container mx-auto px-6 flex items-center justify-between",
            },
          },
        ],
      },
    },
  });

  editor.DomComponents.addType("footer", {
    isComponent: (el) => el.tagName === "FOOTER",
    model: {
      defaults: {
        tagName: "footer",
        draggable: true,
        droppable: true,
        traits: [withEditButton3],
        attributes: {
          class: "bg-gray-900 text-white py-12",
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
                      class: "text-2xl font-bold mb-6",
                    },
                  },
                  {
                    type: "paragraph",
                    content: "Creating digital experiences that inspire.",
                    attributes: {
                      class: "text-gray-400 mb-8",
                    },
                  },
                ],
                attributes: {
                  class: "grid grid-cols-1 md:grid-cols-4 gap-8",
                },
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
                    `,
                  },
                ],
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
                    `,
                  },
                ],
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
                    `,
                  },
                ],
              },
            ],
            attributes: {
              class: "container mx-auto px-6",
            },
          },
        ],
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
          class: "flex flex-wrap space-x-4 p-4", // Default class for scrolling list
        },
        traits: [
          {
            type: "select",
            label: "Layout",
            name: "layout",
            options: [
              { id: "auto", name: "Auto" },
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
        const layout = this.get("attributes")["layout"] || "grid"; // Default to scroll layout
        let classes;

        if (layout === "grid") {
          // Update classes for grid layout
          classes =
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-around gap-6 p-4";
        } else {
          // Default to horizontal scrolling
          classes = "flex flex-wrap justify-center space-x-4 p-4";
        }

        this.set({ attributes: { class: classes } }); // Set the updated classes
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
        const buttonRow2 = this.createBottomButton();
        const buttonRowCenter = this.createMiddleButton();

        console.log("3. Bottom button created:", buttonRow2);
        console.log("4. this.el:", this.el);

        this.el.appendChild(buttonRow2);
        this.el.appendChild(buttonRowCenter);
        this.updateEditButton();
      },
      createBottomButton() {
        console.log("A. createBottomButton called");

        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-[99]";

        console.log("B. About to create add button");
        const addBtn = this.createAddButton();
        console.log("C. Add button created:", addBtn);

        row.appendChild(addBtn);
        this.buttonRow2 = row;

        console.log("D. Returning row:", row);
        return row;
      },
      createAddButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden z-[99]  hover:text-rose-400 flex z-100 items-center group flex-row relative rounded-md py-1 px-3 text-md leading-6 text-white bg-black ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      

      <div class="ml-3 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out block">
      Add Section
      </div>
          `;

        btn.addEventListener("click", () => {
          showAddComponentModal(this.model);
        });

        this.addButton = btn;
        console.log("Y. Button created:", btn);
        return btn;
      },

      createMiddleButton() {
        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 h-auto flex items-center justify-center w-full p-6 mx-auto border-2 border-blue-500 border-dashed bg-blue-500 bg-opacity-5 hover:bg-opacity-20 text-center z-[99]";

        const addBtn = this.createSwapButton();

        row.appendChild(addBtn);
        this.buttonRowCenter = row;

        return row;
      },

      createMiddleButton2() {
        const row = document.createElement("div");
        row.className =
          "gjs-component-buttons2 mx-auto my-3 text-center z-[99]";

        const addBtn = this.createSwapButton();

        row.appendChild(addBtn);
        this.buttonRowCenter = row;

        return row;
      },

      createSwapButton() {
        console.log("X. createAddButton called");

        const btn = document.createElement("button");

        btn.className =
          "relative overflow-hidden mx-auto my-auto text-rose-400 flex z-100 items-center group flex-row relative rounded-full py-1 px-3 text-md leading-6 text-gray-600 bg-white ring-1 ring-gray-900/10 hover:ring-gray-900/20";

        btn.innerHTML = `
        
      
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
      


      <div class="lg:absolute lg:group-hover:relative lg:left-10  lg:group-hover:left-1 whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out hidden lg:block opacity-0 lg:group-hover:opacity-100">
        Add Card
      </div>
          `;

        btn.addEventListener("click", () => {
          // Get the current component
          const currentComponent = this.model;

          // Get the children of the current component
          const children = currentComponent.components();

          // Check if there are any children
          if (children.length > 0) {
            // Get the first child component
            const firstChild = children.at(0);

            // Clone the first child component
            const clonedChild = firstChild.clone();

            // Append the cloned child to the end of the current component's children
            currentComponent.append(clonedChild);

            console.log(
              "First child component duplicated and appended to the end.",
            );
          } else {
            console.log("No children to duplicate.");
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

        this.aiButton = btn;
        return btn;
      },

      updateEditButton() {
        const editor = this.em.get("Editor");
        editor.on("component:select", this.handleSelect.bind(this));
        editor.on("component:deselect", this.handleDeselect.bind(this));
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
          class: "max-w-xs w-full text-left card", // Default class for scrolling list
          sectiontype: "normal",
        },
        traits: [],
        styles: `
          .card .card-body{
            padding-bottom: 2rem;
             padding-top: 0.5rem;
          }
          .card h5{
          font-weight: 600
          }
          .card img{
            height: 260px !important;
          }
 
 
         
        `,
      },

      init() {
        this.listenTo(this, "change:attributes", this.onAttributesChange);
      },

      onAttributesChange() { },
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
          .card-horizontal .card-body{
            padding-bottom: 2rem ;
             padding-top: 0rem !important;
          }
          .card img{
            height: 260px !important;
          }
        `,
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
  });

  editor.DomComponents.addType("navbar", {
    model: {
      defaults: {
        tagName: "nav",
        attributes: {
          class: "navbar fixed w-full top-0 transition-all duration-300 mx-10",
        },
        droppable: true,
        traits: [],
        script: function () {
          const nav = this;
          window.addEventListener("scroll", function () {
            if (window.scrollY > 50) {
              nav.classList.add("navbar-bg", "shadow-md");
              nav.classList.remove("bg-transparent");
            } else {
              nav.classList.remove("navbar-bg", "shadow-md");
              nav.classList.add("bg-transparent");
            }
          });
        },
        styles: `
        .navbar img{
          height: 1.75rem !important;
          width: auto;
        }
        .navbar-bg{
          background-color: var(--color-section-light) !important;
        }
        .navbar{
          z-index : 700
        } 
        
        `,
      },
    },
  });

  editor.DomComponents.addType("navbar-container", {
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class:
            "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16",
        },
      },
    },
  });

  editor.DomComponents.addType("logo", {
    model: {
      defaults: {
        tagName: "div",
        attributes: { class: "flex items-center" },
        content: `<span class="text-2xl font-bold text-blue-600">Brand</span>`,
        droppable: false,
      },
    },
  });

  editor.DomComponents.addType("nav-list", {
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class: "hidden md:flex md:items-center md:space-x-4 ",
        },
        droppable: true,
      },
    },
  });

  editor.DomComponents.addType("nav-link", {
    model: {
      defaults: {
        tagName: "a",
        attributes: {
          class:
            "nav-link text-sm px-4 py-2 text-white transition-colors duration-200 mix-blend-difference filter contrast-200 hover:mix-blend-normal hover:filter-none hover:contrast-50",
          href: "#",
        },
        content: "Link",
        droppable: false,
        traits: [
          {
            type: "text",
            name: "href",
            label: "Link URL",
          },
          {
            type: "text",
            name: "innerHTML",
            label: "Text",
          },
        ],
        styles: `
        .nav-link:hover{
          color: var(--color-primary-light) !important
        }
        `,
      },
    },
  });

  // Mobile menu button component
  editor.DomComponents.addType("mobile-menu-button", {
    model: {
      defaults: {
        tagName: "button",
        attributes: {
          class:
            "md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none",
        },
        content: `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        `,
        script: function () {
          const btn = this;
          const navbar = btn.closest("nav");
          const mobileMenu = navbar.querySelector(".mobile-menu");

          btn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
          });
        },
      },
    },
  });

  editor.DomComponents.addType("footer", {
    model: {
      defaults: {
        tagName: "footer",
        attributes: {
          class: "bg-gray-100 border-t border-gray-300 py-6 px-8",
        },
        droppable: true,
      },
    },
  });

  editor.DomComponents.addType("footer-container", {
    model: {
      defaults: {
        tagName: "footer",
        attributes: {
          class: "flex flex-col lg:flex-row lg:justify-between items-center",
        },
        droppable: true,
      },
    },
  });

  // Mobile menu container
  editor.DomComponents.addType("mobile-menu", {
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          class:
            "mobile-menu hidden md:hidden transition-all duration-300 ease-in-out",
        },
        droppable: true,
      },
    },
  });
};
