import loadComponents from "./components"; // Import your components definition
import loadBlocks from "./blocks"; // Assuming you have blocks to load
import {
  generateWebsiteStructure,
  loadWebsiteStructure,
} from "./websiteStructure";
import en from "./locale/en";

export default (editor, opts = {}) => {
  const options = {
    i18n: {},
    ...opts,
  };

  // Register components
  loadComponents(editor);

  // Add blocks
  loadBlocks(editor, options);

  // Load i18n files
  editor.I18n &&
    editor.I18n.addMessages({
      en,
      ...options.i18n,
    });

  // Example JSON data mapping to existing components
  const websiteData = {
    themeoptions: {
      fonts: {
        primary: "Arial",
        secondary: "Helvetica",
        scale: "1.2",
      },
      "colors": {
        "primary": "#A67C52",  // Warm, luxurious tone for primary elements like buttons and highlights.
        "primaryLight": "#C2986E",  // Lighter, warm shade for interactive elements (hover effects).
        "primaryDark": "#8C643F",  // Rich, deeper tone for contrast in interactive elements.
        "textLight": "#EDE3D9",  // Light, refined text for dark backgrounds, soft for elegance.
        "textPrimary": "#2B2B2B",  // Dark, classic tone for headings and main text.
        "textSecondary": "#5D5D5D",  // Softer grey for body text on light backgrounds.
        "sectionLight": "#FAF8F5",  // Elegant off-white for clean, welcoming sections.
        "sectionAccent1": "#E4D7C7",  // Subtle, warm beige for a gentle contrast on light sections.
        "sectionAccent2": "#F1E9DC",  // Very light, soft neutral for depth without overpowering.
        "sectionDark": "#1F1A17"  // Deep, almost black shade with warm undertones for luxurious dark sections.
      },
    },
    components: [
      {
        type: "hero-section",
        attributes: {
          "bg-image":
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29mdHdhcmUlMjBkZXZlbG9wbWVudCUyMGNvbXBhbnl8ZW58MHx8MHx8fDA%3D",
          centerLayout: false,
        },
        components: [
          {
            type: "hero-section-container",
            components: [
              {
                type: "hero-text-subtitle",
                attributes: {
                  content:
                    "An extraordinary world imagine by Byteplexure & partners",
                },
              },
              {
                type: "hero-text-title",
                content: "A Stunning Heaven to Call Home.",
              },
              {
                type: "row-container",
                components: [
                  {
                    type: "button-primary",
                    attributes: { content: "Our Portfolio" },
                  },
                  {
                    type: "button-primary",
                    attributes: { content: "Contact Us →" },
                  },
                ],
              },
            ],
          },
        ],
      },

      {
        type: "section",
        components: [
          {
            type: "container",
            components: [
              {
                type: "content-subtitle",
                content: "Features",
              },
              {
                type: "content-title",
                content: "What makes a home?",
              },
              {
                type: "two-columns",
                attributes: {
                  offset: "left",
                },
                components: [
                  {
                    type: "blank-container",
                    components: [
                      {
                        type: "paragraph",
                        content: `<p>This attractive new neighbourhood for young families and active people delivers fresh contemporary living with numerous free-time opportunities.<br>Ovocne sady’s high- quality and practical apartments with functional architecture, public spaces, and excellent options for sport and relaxation – all just steps from your new home.
                          <ul class="list-disc mt-2 pl-5">
  <li>Open floor plan for spaciousness</li>
  <li>High ceilings to enhance natural light</li>
  <li>Stylish lighting fixtures for ambiance</li>
  <li>Quality hardwood flooring</li>
  <li>Custom cabinetry for storage</li>
  <li>Modern kitchen appliances</li>
  <li>Elegant countertops (granite, quartz, etc.)</li></ul>
                          </p>`,
                      },
                    ],
                  },

                  {
                    type: "blank-container",
                    components: [
                      {
                        type: "visuals-full-image",
                        content: " ",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        type: "image-section",
        attributes: {
          sectiontype: "accent-1",
          direction: "left",
        },
        components: [
          {
            type: "custom-image",
            attributes: {
              sectiontype: "accent-1",
              src: "https://www.decormyplace.co.in/uploaded-files/page-images/image25.jpg",
            },
          },
          {
            type: "blank-container",
            components: [
              {
                type: "content-subtitle",
                content: "Features",
              },
              {
                type: "content-title",
                content: "What makes a home?",
              },
              {
                type: "paragraph",
                content: `<p>This attractive new neighbourhood for young families and active people delivers fresh contemporary living with numerous free-time opportunities.<br>Ovocne sady’s high- quality and practical apartments with functional architecture, public spaces, and excellent options for sport and relaxation – all just steps from your new home.

                </p>`,
              },
            ],
          },
        ],
      },
      {
        type: "image-section",
        attributes: {
          sectiontype: "accent-2",
          direction: "right",
        },
        components: [
          {
            type: "custom-image",
            attributes: {
              sectiontype: "accent-1",
              src: "https://chateau.qodeinteractive.com/wp-content/uploads/2023/01/main-home-img1.jpg",
            },
          },
          {
            type: "blank-container",
            components: [
              {
                type: "content-subtitle",
                content: "Services",
              },
              {
                type: "content-title",
                content: "Our Services are the best in the world",
              },
              {
                type: "paragraph",
                content: `<p>This attractive new neighbourhood for young families and active people delivers fresh contemporary living with numerous free-time opportunities.<br>Ovocne sady’s high- quality and practical apartments with functional architecture, public spaces, and excellent options for sport and relaxation – all just steps from your new home.

                </p>`,
              },
            ],
          },
        ],
      },
      {
        type: "section",
        attributes: {
          sectiontype: "dark",
        },
        components: [
          {
            type: "container",
            components: [
              {
                type: "content-subtitle",
                content: "Features",
              },
              {
                type: "content-title",
                content: "What makes a home?",
              },
              {
                type: "card-list",
                attributes: {
                  layout: "grid",
                },

                components: [
                  {
                    type: "card",
                    attributes: {
                      sectiontype: "",
                    },
                    components: [
                      {
                        type: "custom-image",
                        attributes: {
                          src: "https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg",
                        },
                      },
                      {
                        type: "content-heading",
                        content: "Henry C. Turner Prize for Innovation",
                      },
                      {
                        type: "paragraph",
                        content:
                          "The sun collectors, shall provide the electricity of the social areas of the site and shall do its part for protecting the environment.",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };  
  // const websiteData = {
  //   themeoptions: {
  //     fonts: {
  //       primary: "Arial",
  //       secondary: "Helvetica",
  //       scale: "1.2",
  //     },
  //     colors: {
  //       primary: "#FF5722",
  //       primaryLight: "#FF7D4D",
  //       primaryDark: "#C63D00",
  //       textLight: "#FFFFFF",
  //       textPrimary: "#212121",
  //       textSecondary: "#757575",
  //       sectionLight: "#F5F5F5",
  //       sectionAccent1: "#E0E0E0",
  //       sectionAccent2: "#BDBDBD",
  //       sectionDark: "#424242",
  //     },
  //   },
  //   components: [
  //     {
  //       type: "hero-section",
  //       attributes: {
  //         "bg-image": "Image Description to search from Unsplash",
  //         "center-layout": "true",
  //       },
  //       components: [
  //         {
  //           type: "hero-text-title",
  //           content: "Welcome to Our Website",
  //           _description:
  //             "Main text for the hero section. This is required and should grab attention.",
  //         },
  //         {
  //           type: "hero-text-subtitle",
  //           content: "Your journey begins here.",
  //           _description:
  //             "Subtitle text accompanying the main hero title. Required and should provide supportive information.",
  //         },
  //         {
  //           type: "row-container",
  //           components: [
  //             {
  //               type: "button-primary",
  //               attributes: {
  //                 link: "#",
  //               },
  //               content: "Get Started",
  //               _description:
  //                 "Clickable button. Primary button that is solid primary color.",
  //             },
  //             {
  //               type: "button-secondary",
  //               attributes: {
  //                 link: "#",
  //               },
  //               content: "Learn More",
  //               _description:
  //                 "Clickable button. Secondary button that is transparent and has a border.",
  //             },
  //           ],
  //           _description:
  //             "A row layout below the hero texts, typically for buttons, icons, or other small interactive elements.",
  //         },
  //       ],
  //       _description:
  //         "A hero section with a background image and content aligned inside a container.",
  //     },
  //     {
  //       type: "section",
  //       attributes: {
  //         sectiontype: "dark",
  //       },
  //       components: [
  //         {
  //           type: "container",
  //           components: [
  //             {
  //               type: "content-title",
  //               content: "Our Services",
  //               _description:
  //                 "Title text for other sections, such as about us or services.",
  //             },
  //             {
  //               type: "content-subtitle",
  //               content: "What we offer to our clients.",
  //               _description:
  //                 "A subtitle or additional description accompanying the section title.",
  //             },
  //             {
  //               type: "card-list",
  //               components: [
  //                 {
  //                   type: "card",
  //                   components: [
  //                     {
  //                       type: "custom-image",
  //                       attributes: {
  //                         src: "URL or image description",
  //                         "alt-text": "Service 1 Image",
  //                       },
  //                     },
  //                     {
  //                       type: "content-heading",
  //                       content: "Service 1",
  //                       _description:
  //                         "Heading text that will be used in content sections like cards, feature cards, services sections, etc.",
  //                     },
  //                     {
  //                       type: "paragraph",
  //                       attributes: {
  //                         color: "primary",
  //                       },
  //                       content: "Description of Service 1.",
  //                       _description:
  //                         "A text component that can be used in sections like about us, services, etc.",
  //                     },
  //                     {
  //                       type: "blank-component",
  //                       components: [],
  //                     },
  //                   ],
  //                   _description:
  //                     "A card component that has a image, title and text component.",
  //                 },
  //                 {
  //                   type: "card",
  //                   components: [
  //                     {
  //                       type: "custom-image",
  //                       attributes: {
  //                         src: "URL or image description",
  //                         "alt-text": "Service 2 Image",
  //                       },
  //                     },
  //                     {
  //                       type: "content-heading",
  //                       content: "Service 2",
  //                       _description:
  //                         "Heading text that will be used in content sections like cards, feature cards, services sections, etc.",
  //                     },
  //                     {
  //                       type: "paragraph",
  //                       attributes: {
  //                         color: "primary",
  //                       },
  //                       content: "Description of Service 2.",
  //                       _description:
  //                         "A text component that can be used in sections like about us, services, etc.",
  //                     },
  //                     {
  //                       type: "blank-component",
  //                       components: [],
  //                     },
  //                   ],
  //                   _description:
  //                     "A card component that has a image, title and text component.",
  //                 },
  //                 {
  //                   type: "card",
  //                   components: [
  //                     {
  //                       type: "custom-image",
  //                       attributes: {
  //                         src: "URL or image description",
  //                         "alt-text": "Service 3 Image",
  //                       },
  //                     },
  //                     {
  //                       type: "content-heading",
  //                       content: "Service 3",
  //                       _description:
  //                         "Heading text that will be used in content sections like cards, feature cards, services sections, etc.",
  //                     },
  //                     {
  //                       type: "paragraph",
  //                       attributes: {
  //                         color: "primary",
  //                       },
  //                       content: "Description of Service 3.",
  //                       _description:
  //                         "A text component that can be used in sections like about us, services, etc.",
  //                     },
  //                     {
  //                       type: "blank-component",
  //                       components: [],
  //                     },
  //                   ],
  //                   _description:
  //                     "A card component that has a image, title and text component.",
  //                 },
  //               ],
  //               _description:
  //                 "A list component for displaying repeated card components.",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       type: "section",
  //       attributes: {
  //         sectiontype: "dark",
  //       },
  //       components: [
  //         {
  //           type: "image-section",
  //           attributes: {
  //             sectiontype: "dark",
  //             imageposition: "right",
  //           },
  //           components: [
  //             {
  //               type: "custom-image",
  //               attributes: {
  //                 src: "URL or image description",
  //                 alt: "Image Description",
  //               },
  //             },
  //             {
  //               type: "blank-component",
  //               components: [],
  //             },
  //           ],
  //           _description:
  //             "A component to separate different sections in the website. Half of it will be occupied by an image relevant to the content.",
  //         },
  //       ],
  //     },
  //     {
  //       type: "section",
  //       attributes: {
  //         sectiontype: "dark",
  //       },
  //       components: [
  //         {
  //           type: "container",
  //           components: [
  //             {
  //               type: "content-title",
  //               content: "Get in Touch",
  //               _description:
  //                 "Title text for other sections, such as about us or services.",
  //             },
  //             {
  //               type: "content-subtitle",
  //               content: "We're here to help.",
  //               _description:
  //                 "A subtitle or additional description accompanying the section title.",
  //             },
  //             {
  //               type: "social-media-icons",
  //               attributes: {
  //                 platforms: ["facebook", "twitter", "linkedin"],
  //               },
  //               components: [],
  //               _description: "A set of social media icons.",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // };
  console.log("Components and blocks loaded");

  // Generate the website structure
  const websiteStructure = generateWebsiteStructure(editor, websiteData);

  // Load the website structure into GrapeJS
  editor.on("load", () => {
    // Call your function here, ensuring the editor is ready

    loadWebsiteStructure(editor, websiteStructure);
  });
};
