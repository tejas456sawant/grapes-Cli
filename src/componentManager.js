// Component type definitions
const componentTypes = [
  { id: "text", name: "Text Block", icon: "📝" },
  { id: "image", name: "Image Section", icon: "🖼️" },
  { id: "gallery", name: "Image Gallery", icon: "🎭" },
  { id: "video", name: "Video Section", icon: "🎥" },
  { id: "form", name: "Contact Form", icon: "📋" },
];

// Create new component based on type
function createComponent(type, description) {
  switch (type) {
    case "text":
      return {
        type: "text",
        content: `<div class="p-4"><p>${description}</p></div>`,
      };
    case "image":
      return {
        type: "image",
        attributes: {
          src: "/api/placeholder/800/400",
          alt: description,
        },
      };
    case "gallery":
      return {
        type: "gallery",
        content:
          '<div class="grid grid-cols-3 gap-4 p-4">' +
          Array(3)
            .fill()
            .map(
              () =>
                '<img src="/api/placeholder/400/300" alt="Gallery image" class="w-full h-auto rounded">',
            )
            .join("") +
          "</div>",
      };
    case "video":
      return {
        type: "video",
        content: `<div class="aspect-w-16 aspect-h-9">
            <div class="bg-gray-200 flex items-center justify-center">
              <span class="text-gray-500">${
                description || "Video Placeholder"
              }</span>
            </div>
          </div>`,
      };
    case "form":
      return {
        type: "form",
        content: `<form class="p-4 space-y-4">
            <div>
              <label class="block mb-2">Name</label>
              <input type="text" class="w-full border p-2 rounded">
            </div>
            <div>
              <label class="block mb-2">Email</label>
              <input type="email" class="w-full border p-2 rounded">
            </div>
            <div>
              <label class="block mb-2">Message</label>
              <textarea class="w-full border p-2 rounded" rows="4"></textarea>
            </div>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
          </form>`,
      };
  }
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

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center";

  function updateModalContent() {
    modal.innerHTML = `
        <div class="bg-white rounded-lg max-w-2xl w-full mx-4">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">
                ${
                  currentStep === 1
                    ? "Choose Component Type"
                    : "Component Details"
                }
              </h2>
              <button class="close-modal text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div class="modal-body mb-6">
              ${
                currentStep === 1
                  ? `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${componentTypes
                    .map(
                      (type) => `
                    <button 
                      class="component-type-btn flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      data-type="${type.id}"
                    >
                      <span class="text-2xl">${type.icon}</span>
                      <span class="text-left font-medium">${type.name}</span>
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
                      Selected Component: ${
                        componentTypes.find((t) => t.id === selectedType)?.name
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
                      placeholder="Enter a description for this component..."
                    ></textarea>
                  </div>
                </div>
              `
              }
            </div>
  
            <div class="flex justify-between">
              <button class="back-btn px-4 py-2 text-gray-600 hover:text-gray-800 font-medium ${
                currentStep === 1 ? "invisible" : ""
              }">
                Back
              </button>
              <div class="space-x-3">
                <button class="cancel-btn px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                  Cancel
                </button>
                <button class="next-btn px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed" ${
                  currentStep === 1 ? "disabled" : ""
                }>
                  ${currentStep === 1 ? "Next" : "Add Component"}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

    attachModalListeners();
  }

  function attachModalListeners() {
    const closeModal = () => modal.remove();

    modal.querySelector(".close-modal").addEventListener("click", closeModal);
    modal.querySelector(".cancel-btn").addEventListener("click", closeModal);

    if (currentStep === 1) {
      modal.querySelectorAll(".component-type-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          modal
            .querySelectorAll(".component-type-btn")
            .forEach((b) =>
              b.classList.remove("ring-2", "ring-blue-500", "bg-blue-50"),
            );

          btn.classList.add("ring-2", "ring-blue-500", "bg-blue-50");
          selectedType = btn.dataset.type;
          modal.querySelector(".next-btn").disabled = false;
        });
      });
    }

    modal.querySelector(".next-btn").addEventListener("click", () => {
      if (currentStep === 1) {
        currentStep = 2;
        updateModalContent();
      } else {
        const description = modal.querySelector("#componentDescription").value;
        const newComponent = createComponent(selectedType, description);
        addComponentAfter(targetComponent, newComponent);
        closeModal();
      }
    });

    modal.querySelector(".back-btn").addEventListener("click", () => {
      if (currentStep === 2) {
        currentStep = 1;
        updateModalContent();
      }
    });
  }

  updateModalContent();
  document.body.appendChild(modal);
}

// Export utility functions
export {
  showAddComponentModal,
  componentTypes,
  createComponent,
  addComponentAfter,
};
