import loadComponents from "./components"; // Import your components definition
import loadBlocks from "./blocks"; // Assuming you have blocks to load
import {
  generateWebsiteStructure,
  loadWebsiteStructure,
} from "./websiteStructure";
import en from "./locale/en";
// import { addNavbarBlock } from './blocks';

export default (editor, opts = {}) => {
  const options = {
    i18n: {},
    ...opts,
  };
  // const websiteData = {
  //   themeoptions: {
  //     fonts: {
  //       primary: "Arial",
  //       secondary: "Helvetica",
  //       scale: "1.2",
  //     },
  //     colors: {
  //       primary: "#A67C52", // Warm, luxurious tone for primary elements like buttons and highlights.
  //       primaryLight: "#C2986E", // Lighter, warm shade for interactive elements (hover effects).
  //       primaryDark: "#8C643F", // Rich, deeper tone for contrast in interactive elements.
  //       textLight: "#EDE3D9", // Light, refined text for dark backgrounds, soft for elegance.
  //       textPrimary: "#2B2B2B", // Dark, classic tone for headings and main text.
  //       textSecondary: "#5D5D5D", // Softer grey for body text on light backgrounds.
  //       sectionLight: "#FAF8F5", // Elegant off-white for clean, welcoming sections.
  //       sectionAccent1: "#E4D7C7", // Subtle, warm beige for a gentle contrast on light sections.
  //       sectionAccent2: "#F1E9DC", // Very light, soft neutral for depth without overpowering.
  //       sectionDark: "#1F1A17", // Deep, almost black shade with warm undertones for luxurious dark sections.
  //     },
  //   },
  //   "components": [
  //     {
  //       "type": "hero-section",
  //       "attributes": {
  //         "bg-image": "restaurant-interior-with-tables",
  //         "center-layout": "true"
  //       },
  //       "components": [
  //         {
  //           "type": "hero-section-container",
  //           "components": [
  //             {
  //               "type": "hero-text-subtitle",
  //               "content": "Welcome to"
  //             },
  //             {
  //               "type": "hero-text-title",
  //               "content": "Green Bites"
  //             },
  //             {
  //               "type": "row-container",
  //               "components": [
  //                 {
  //                   "type": "button-primary",
  //                   "attributes": {
  //                     "link": "#menu"
  //                   },
  //                   "content": "Explore Menu"
  //                 },
  //                 {
  //                   "type": "button-secondary",
  //                   "attributes": {
  //                     "link": "#reservation"
  //                   },
  //                   "content": "Book a Table"
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       "type": "section",
  //       "attributes": {
  //         "sectiontype": "normal"
  //       },
  //       "components": [
  //         {
  //           "type": "container",
  //           "components": [
  //             {
  //               "type": "content-subtitle",
  //               "content": "Our Story"
  //             },
  //             {
  //               "type": "content-title",
  //               "content": "About Green Bites"
  //             },
  //             {
  //               "type": "two-columns",
  //               "attributes": {
  //                 "offset": "none"
  //               },
  //               "components": [
  //                 {
  //                   "type": "blank-container",
  //                   "components": [
  //                     {
  //                       "type": "text-content",
  //                       "content": "At Green Bites, we believe in serving fresh, organic, and locally sourced ingredients. Our passion for sustainability and delicious food has made us a favorite among food lovers. Join us for a culinary experience that’s good for you and the planet."
  //                     }
  //                   ]
  //                 },
  //                 {
  //                   "type": "blank-container",
  //                   "components": [
  //                     {
  //                       "type": "custom-image",
  //                       "attributes": {
  //                         "src": "chef-preparing-dish",
  //                         "alt-text": "Chef preparing a dish"
  //                       }
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       "type": "section",
  //       "attributes": {
  //         "sectiontype": "accent-1"
  //       },
  //       "components": [
  //         {
  //           "type": "container",
  //           "components": [
  //             {
  //               "type": "content-subtitle",
  //               "content": "Our Menu"
  //             },
  //             {
  //               "type": "content-title",
  //               "content": "Delicious & Fresh"
  //             },
  //             {
  //               "type": "card-list",
  //               "components": [
  //                 {
  //                   "type": "card",
  //                   "components": [
  //                     {
  //                       "type": "custom-image",
  //                       "attributes": {
  //                         "src": "vegetarian-pasta-dish",
  //                         "alt-text": "non Pasta"
  //                       }
  //                     },
  //                     {
  //                       "type": "content-heading",
  //                       "content": "Vegetarian Pasta"
  //                     },
  //                     {
  //                       "type": "text-content",
  //                       "content": "A delightful mix of fresh vegetables and homemade pasta, tossed in a rich tomato sauce."
  //                     },
  //                     {
  //                       "type": "blank-container",
  //                       "components": [
  //                         {
  //                           "type": "button-tertiary",
  //                           "attributes": {
  //                             "link": "#order-now"
  //                           },
  //                           "content": "Order Now"
  //                         }
  //                       ]
  //                     }
  //                   ]
  //                 },
  //                 {
  //                   "type": "card",
  //                   "components": [
  //                     {
  //                       "type": "custom-image",
  //                       "attributes": {
  //                         "src": "vegetarian-pasta-dish",
  //                         "alt-text": "Vegetarian Pasta"
  //                       }
  //                     },
  //                     {
  //                       "type": "content-heading",
  //                       "content": "Vegetarian Pasta"
  //                     },
  //                     {
  //                       "type": "text-content",
  //                       "content": "A delightful mix of fresh vegetables and homemade pasta, tossed in a rich tomato sauce."
  //                     },
  //                     {
  //                       "type": "blank-container",
  //                       "components": [
  //                         {
  //                           "type": "button-tertiary",
  //                           "attributes": {
  //                             "link": "#order-now"
  //                           },
  //                           "content": "Order Now"
  //                         }
  //                       ]
  //                     }
  //                   ]
  //                 },
  //                 {
  //                   "type": "card",
  //                   "components": [
  //                     {
  //                       "type": "custom-image",
  //                       "attributes": {
  //                         "src": "grilled-salmon-dish",
  //                         "alt-text": "Grilled Salmon"
  //                       }
  //                     },
  //                     {
  //                       "type": "content-heading",
  //                       "content": "Grilled Salmon"
  //                     },
  //                     {
  //                       "type": "text-content",
  //                       "content": "Freshly caught salmon grilled to perfection, served with a side of seasonal vegetables."
  //                     },
  //                     {
  //                       "type": "blank-container",
  //                       "components": [
  //                         {
  //                           "type": "button-tertiary",
  //                           "attributes": {
  //                             "link": "#order-now"
  //                           },
  //                           "content": "Order Now"
  //                         }
  //                       ]
  //                     }
  //                   ]
  //                 },
  //                 {
  //                   "type": "card",
  //                   "components": [
  //                     {
  //                       "type": "custom-image",
  //                       "attributes": {
  //                         "src": "vegan-burger-dish",
  //                         "alt-text": "Vegan Burger"
  //                       }
  //                     },
  //                     {
  //                       "type": "content-heading",
  //                       "content": "Vegan Burger"
  //                     },
  //                     {
  //                       "type": "text-content",
  //                       "content": "A plant-based patty with avocado, lettuce, and vegan mayo, served with sweet potato fries."
  //                     },
  //                     {
  //                       "type": "blank-container",
  //                       "components": [
  //                         {
  //                           "type": "button-tertiary",
  //                           "attributes": {
  //                             "link": "#order-now"
  //                           },
  //                           "content": "Order Now"
  //                         }
  //                       ]
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       "type": "section",
  //       "attributes": {
  //         "sectiontype": "normal"
  //       },
  //       "components": [
  //         {
  //           "type": "container",
  //           "components": [
  //             {
  //               "type": "content-subtitle",
  //               "content": "Reserve a Table"
  //             },
  //             {
  //               "type": "content-title",
  //               "content": "Book Your Experience"
  //             },
  //             {
  //               "type": "text-content",
  //               "content": "Join us for a memorable dining experience. Reserve your table today and let us take care of the rest."
  //             },
  //             {
  //               "type": "button-primary",
  //               "attributes": {
  //                 "link": "#reservation"
  //               },
  //               "content": "Make a Reservation"
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       "type": "section",
  //       "attributes": {
  //         "sectiontype": "dark"
  //       },
  //       "components": [
  //         {
  //           "type": "container",
  //           "components": [
  //             {
  //               "type": "content-subtitle",
  //               "content": "Follow Us"
  //             },
  //             {
  //               "type": "content-title",
  //               "content": "Stay Connected"
  //             },
  //             {
  //               "type": "social-media-icons",
  //               "attributes": {
  //                 "platforms": ["facebook", "instagram", "twitter"]
  //               }
  //             }
  //           ]
  //         }
  //       ]
  //     }],
  // };
  const websiteData = options.websiteData;
  // Register components
  loadComponents(editor);

  console.log("Available components:", editor.DomComponents.componentTypes);

  // Add blocks
  loadBlocks(editor, options);

  // Load i18n files
  editor.I18n &&
    editor.I18n.addMessages({
      en,
      ...options.i18n,
    });

  // Example JSON data mapping to existing components
  // const websiteData = {
  //   themeoptions: {
  //     fonts: {
  //       primary: "Arial",
  //       secondary: "Helvetica",
  //       scale: "1.2",
  //     },
  //     "colors": {
  //       "primary": "#A67C52",
  //       "primaryLight": "#C2986E",
  //       "primaryDark": "#8C643F",
  //       "textLight": "#EDE3D9",
  //       "textPrimary": "#2B2B2B",
  //       "textSecondary": "#5D5D5D",
  //       "sectionLight": "#FAF8F5",
  //       "sectionAccent1": "#E4D7C7",
  //       "sectionAccent2": "#F1E9DC",
  //       "sectionDark": "#1F1A17"
  //     },
  //   },
  //   components: [
      
  //     // {
  //     //   type: "navbar",
  //     //   content: `
  //     //     <div class="container mx-auto px-6">
  //     //       <div class="flex items-center justify-between">
  //     //         <div class="flex items-center">
  //     //           <img src="https://via.placeholder.com/40x40" alt="Logo" class="h-10 w-10 mr-3">
  //     //           <span class="text-2xl font-bold text-white tracking-tight">BytePlexure</span>
  //     //         </div>
  //     //         <div class="flex items-center space-x-8">
  //     //           <a href="#" class="text-white hover:bg-white/10 px-4 py-2 text-base font-medium rounded-lg transition-all duration-200">Home</a>
  //     //           <a href="#" class="text-white hover:bg-white/10 px-4 py-2 text-base font-medium rounded-lg transition-all duration-200">About</a>
  //     //           <a href="#" class="text-white hover:bg-white/10 px-4 py-2 text-base font-medium rounded-lg transition-all duration-200">Services</a>
  //     //           <a href="#" class="text-white/90 hover:text-white bg-rose-500 hover:bg-rose-600 px-5 py-2 text-base font-medium rounded-lg transition-all duration-200">Contact</a>
  //     //         </div>
  //     //       </div>
  //     //     </div>
  //     //   `,
  //     //   attributes: {
  //     //     class: 'bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-white/10 fixed top-0 left-0 right-0 z-50 py-4'
  //     //   }
  //     // },
  //     {
  //       type: "hero-section",
  //       attributes: {
  //         "bg-image":
  //           "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29mdHdhcmUlMjBkZXZlbG9wbWVudCUyMGNvbXBhbnl8ZW58MHx8MHx8fDA%3D",
  //         centerLayout: false,
  //       },
  //       components: [
  //         {
  //           type: "hero-section-container",
  //           components: [
  //             {
  //               type: "hero-text-subtitle",
  //               attributes: {
  //                 content:
  //                   "An extraordinary world imagine by Byteplexure & partners",
  //               },
  //             },
  //             {
  //               type: "hero-text-title",
  //               content: "A Stunning Heaven to Call Home.",
  //             },
  //             {
  //               type: "row-container",
  //               components: [
  //                 {
  //                   type: "button-primary",
  //                   attributes: { content: "Our Portfolio" },
  //                 },
  //                 {
  //                   type: "button-primary",
  //                   attributes: { content: "Contact Us →" },
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       type: "section",
  //       components: [
  //         {
  //           type: "container",
  //           components: [
  //             {
  //               type: "content-subtitle",
  //               content: "Features",
  //             },
  //             {
  //               type: "content-title",
  //               content: "What not no no a home?",
  //             },
  //             {
  //               type: "two-columns",
  //               attributes: {
  //                 offset: "left",
  //               },
  //               components: [
  //                 {
  //                   type: "stack",
  //                   components: [
  //                     {
  //                       type: "text-content",
  //                       content: `<p>This attractive new neighbourhood for young families and active people delivers fresh contemporary living with numerous free-time opportunities.<br>Ovocne sady’s high- quality and practical apartments with functional architecture, public spaces, and excellent options for sport and relaxation – all just steps from your new home.
  //                         <ul class="list-disc mt-2 pl-5">
  // <li>Open floor plan for spaciousness</li>
  // <li>High ceilings to enhance natural light</li>
  // <li>Stylish lighting fixtures for ambiance</li>
  // <li>Quality hardwood flooring</li>
  // <li>Custom cabinetry for storage</li>
  // <li>Modern kitchen appliances</li>
  // <li>Elegant countertops (granite, quartz, etc.)</li></ul>
  //                         </p>`,
  //                     },
  //                   ],
  //                 },

  //                 {
  //                   type: "stack",
  //                   components: [
  //                     {
  //                       type: "visuals-full-image",
  //                       content: " ",
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       type: "image-section",
  //       attributes: {
  //         sectiontype: "accent-1",
  //         direction: "left",
  //       },
  //       components: [
  //         {
  //           type: "custom-image",
  //           attributes: {
  //             sectiontype: "accent-1",
  //             src: "https://www.decormyplace.co.in/uploaded-files/page-images/image25.jpg",
  //           },
  //         },
  //         {
  //           type: "stack",
  //           components: [
  //             {
  //               type: "content-subtitle",
  //               content: "Features",
  //             },
  //             {
  //               type: "content-title",
  //               content: "What makes a home?",
  //             },
  //             {
  //               type: "text-content",
  //               content: `<p>This attractive new neighbourhood for young families and active people delivers fresh contemporary living with numerous free-time opportunities.<br>Ovocne sady’s high- quality and practical apartments with functional architecture, public spaces, and excellent options for sport and relaxation – all just steps from your new home.

  //               </p>`,
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       type: "image-section",
  //       attributes: {
  //         sectiontype: "accent-2",
  //         direction: "right",
  //       },
  //       components: [
  //         {
  //           type: "custom-image",
  //           attributes: {
  //             sectiontype: "accent-1",
  //             src: "https://chateau.qodeinteractive.com/wp-content/uploads/2023/01/main-home-img1.jpg",
  //           },
  //         },
  //         {
  //           type: "stack",
  //           components: [
  //             {
  //               type: "content-subtitle",
  //               content: "Services",
  //             },
  //             {
  //               type: "content-title",
  //               content: "Our Services are the best in the world",
  //             },
  //             {
  //               type: "text-content",
  //               content: `<p>This attractive new neighbourhood for young families and active people delivers fresh contemporary living with numerous free-time opportunities.<br>Ovocne sady’s high- quality and practical apartments with functional architecture, public spaces, and excellent options for sport and relaxation – all just steps from your new home.

  //               </p>`,
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
  //           type: "container",
  //           components: [
  //             {
  //               type: "content-subtitle",
  //               content: "Features",
  //             },
  //             {
  //               type: "content-title",
  //               content: "What makes a home?",
  //             },
  //             {
  //               type: "card-list",
  //               attributes: {
  //                 layout: "grid",
  //               },

  //               components: [
  //                 {
  //                   type: "card",
  //                   attributes: {
  //                     sectiontype: "",
  //                   },
  //                   components: [
  //                     {
  //                       type: "stack", // Add stack component
  //                       components: [
  //                         {
  //                           type: "custom-image",
  //                           attributes: {
  //                             src: "https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg",
  //                           },
  //                         },
  //                         {
  //                           type: "content-heading",
  //                           content: "mark C. Turner Prize for Innovation",
  //                         },
  //                         {
  //                           type: "text-content",
  //                           content:
  //                             "The sun collectors, shall provide the electricity of the social areas of the site and shall do its part for protecting the environment.",
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   type: "card",
  //                   attributes: {
  //                     sectiontype: "",
  //                   },
  //                   components: [
  //                     {
  //                       type: "stack", // Add stack component
  //                       components: [
  //                         {
  //                           type: "custom-image",
  //                           attributes: {
  //                             src: "https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg",
  //                           },
  //                         },
  //                         {
  //                           type: "content-heading",
  //                           content: "Henry C. Turner Prize for Innovation",
  //                         },
  //                         {
  //                           type: "text-content",
  //                           content:
  //                             "The sun collectors, shall provide the electricity of the social areas of the site and shall do its part for protecting the environment.",
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   type: "card",
  //                   attributes: {
  //                     sectiontype: "",
  //                   },
  //                   components: [
  //                     {
  //                       type: "stack", // Add stack component
  //                       components: [
  //                         {
  //                           type: "custom-image",
  //                           attributes: {
  //                             src: "https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg",
  //                           },
  //                         },
  //                         {
  //                           type: "content-heading",
  //                           content: "Henry C. Turner Prize for Innovation",
  //                         },
  //                         {
  //                           type: "text-content",
  //                           content:
  //                             "The sun collectors, shall provide the electricity of the social areas of the site and shall do its part for protecting the environment.",
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //                 {
  //                   type: "card",
  //                   attributes: {
  //                     sectiontype: "",
  //                   },
  //                   components: [
  //                     {
  //                       type: "stack", // Add stack component
  //                       components: [
  //                         {
  //                           type: "custom-image",
  //                           attributes: {
  //                             src: "https://statusneo.com/wp-content/uploads/2023/02/MicrosoftTeams-image551ad57e01403f080a9df51975ac40b6efba82553c323a742b42b1c71c1e45f1.jpg",
  //                           },
  //                         },
  //                         {
  //                           type: "content-heading",
  //                           content: "Henry C. Turner Prize for Innovation",
  //                         },
  //                         {
  //                           type: "text-content",
  //                           content:
  //                             "The sun collectors, shall provide the electricity of the social areas of the site and shall do its part for protecting the environment.",
  //                         },
  //                       ],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       type: "video-section",
  //       components: [
  //         {
  //           type: "container",
  //           attributes: {
  //             class: "container mx-auto px-6 max-w-[90%]"
  //           },
  //           components: [
  //             {
  //               type: "content-subtitle",
  //               content: "Featured Video",
  //               attributes: {
  //                 class: "text-center mb-6 text-2xl text-rose-500 font-semibold tracking-wide uppercase"
  //               }
  //             },
  //             {
  //               type: "content-title",
  //               content: "Watch Our Story",
  //               attributes: {
  //                 class: "text-center mb-12 text-5xl md:text-6xl font-bold text-white"
  //               }
  //             },
  //             {
  //               tagName: 'div',
  //               attributes: {
  //                 class: 'w-full aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white/5'
  //               },
  //               content: `
  //                 <video 
  //                   class="w-full h-full object-cover"
  //                   controls
  //                   playsinline
  //                   src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4"
  //                 >
  //                   <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" type="video/mp4">
  //                   Your browser does not support the video tag.
  //                 </video>
  //               `
  //             }
  //           ]
  //         }
  //       ],
  //       attributes: {
  //         class: 'video-section bg-gray-900 py-32 w-full overflow-hidden'
  //       }
  //     },
  //     {
  //       type: "map-section",
  //       components: [
  //         {
  //           type: "container",
  //           attributes: {
  //             class: "container mx-auto px-6 max-w-[90%]"
  //           },
  //           components: [
  //             {
  //               type: "content-subtitle",
  //               content: "Our Location",
  //               attributes: {
  //                 class: "text-center mb-6 text-2xl text-rose-500 font-semibold tracking-wide uppercase"
  //               }
  //             },
  //             {
  //               type: "content-title",
  //               content: "Visit Our Office Today",
  //               attributes: {
  //                 class: "text-center mb-12 text-5xl md:text-6xl font-bold text-white"
  //               }
  //             },
  //             {
  //               tagName: 'div',
  //               attributes: {
  //                 class: 'w-full aspect-[21/9] min-h-[900px] overflow-hidden shadow-2xl rounded-xl border-4 border-white/5'
  //               },
  //               content: `
  //                 <iframe 
  //                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937950147!2d-73.98731968524056!3d40.757977142857454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes+Square!5e0!3m2!1sen!2sus!4v1510579767190" 
  //                   width="100%" 
  //                   height="100%" 
  //                   style="border:0; filter: contrast(1.2) saturate(1.1);" 
  //                   allowfullscreen
  //                   loading="lazy"
  //                   referrerpolicy="no-referrer-when-downgrade"
  //                 ></iframe>
  //               `
  //             },
  //             {
  //               tagName: 'div',
  //               attributes: {
  //                 class: 'container mx-auto grid md:grid-cols-3 gap-12 mt-20 text-center px-6'
  //               },
  //               components: [
  //                 {
  //                   tagName: 'div',
  //                   attributes: {
  //                     class: 'bg-white/5 p-10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1'
  //                   },
  //                   content: `
  //                     <h3 class="text-3xl font-bold text-white mb-4">Address</h3>
  //                     <p class="text-gray-300 text-xl leading-relaxed">123 Business Street<br>New York, NY 10001</p>
  //                   `
  //                 },
  //                 {
  //                   tagName: 'div',
  //                   attributes: {
  //                     class: 'bg-white/5 p-10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1'
  //                   },
  //                   content: `
  //                     <h3 class="text-3xl font-bold text-white mb-4">Contact</h3>
  //                     <p class="text-gray-300 text-xl leading-relaxed">Phone: (555) 123-4567<br>Email: contact@byteplexure.com</p>
  //                   `
  //                 },
  //                 {
  //                   tagName: 'div',
  //                   attributes: {
  //                     class: 'bg-white/5 p-10 rounded-2xl hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1'
  //                   },
  //                   content: `
  //                     <h3 class="text-3xl font-bold text-white mb-4">Hours</h3>
  //                     <p class="text-gray-300 text-xl leading-relaxed">Mon-Fri: 9:00 AM - 6:00 PM<br>Sat-Sun: Closed</p>
  //                   `
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ],
  //       attributes: {
  //         class: 'map-section bg-gray-900 py-32 w-full overflow-hidden'
  //       }
  //     },
  //     {
  //       type: "footer",
  //       components: [
  //         {
  //           type: "container",
  //           attributes: {
  //             class: "container mx-auto px-6"
  //           },
  //           components: [
  //             {
  //               type: "blank-container",
  //               attributes: {
  //                 class: "grid grid-cols-1 md:grid-cols-4 gap-8 py-8"
  //               },
  //               components: [
  //                 {
  //                   type: "blank-container",
  //                   attributes: {
  //                     class: "col-span-1"
  //                   },
  //                   components: [
  //                     {
  //                       type: "footer-brand",
  //                       content: `
  //                         <h2 class="text-2xl font-bold text-white mb-4">BytePlexure</h2>
  //                         <p class="text-gray-400">Creating digital experiences that inspire.</p>
  //                       `
  //                     }

  //                   ]
  //                 },
  //                 {
  //                   type: "blank-container",
  //                   attributes: {
  //                     class: "col-span-1"
  //                   },
  //                   components: [
  //                     {
  //                       type: "footer-links",
  //                       content: `
  //                         <h3 class="text-lg font-semibold text-white mb-4">Quick Links</h3>
  //                         <ul class="space-y-3">
  //                           <li><a href="www.google.com" class="text-gray-400 hover:text-white transition-colors">About Us</a></li>
  //                           <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Services</a></li>
  //                           <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
  //                           <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
  //                         </ul>
  //                       `
  //                     }
  //                   ]
  //                 },
  //                 {
  //                   type: "blank-container",
  //                   attributes: {
  //                     class: "col-span-1"
  //                   },
  //                   components: [
  //                     {
  //                       type: "footer-contact",
  //                       content: `
  //                         <h3 class="text-lg font-semibold text-white mb-4">Contact Us</h3>
  //                         <ul class="space-y-3 text-gray-400">
  //                           <li class="flex items-center">
  //                             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  //                             123 Business Street
  //                           </li>
  //                           <li class="flex items-center">
  //                             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
  //                             contact@byteplexure.com
  //                           </li>
  //                           <li class="flex items-center">
  //                             <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
  //                             (555) 123-4567
  //                           </li>
  //                         </ul>
  //                       `
  //                     }
  //                   ]
  //                 },
  //                 {
  //                   type: "blank-container",
  //                   attributes: {
  //                     class: "col-span-1"
  //                   },
  //                   components: [
  //                     {
  //                       type: "footer-social",
  //                       content: `
  //                         <h3 class="text-lg font-semibold text-white mb-4">Follow Us</h3>
  //                         <div class="flex space-x-4">
  //                           <a href="#" class="text-gray-400 hover:text-white transition-colors">
  //                             <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  //                           </a>
  //                           <a href="#" class="text-gray-400 hover:text-white transition-colors">
  //                             <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
  //                           </a>
  //                           <a href="#" class="text-gray-400 hover:text-white transition-colors">
  //                             <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
  //                           </a>
  //                         </div>
  //                       `
  //                     }
  //                   ]
  //                 }
  //               ]
  //             }
  //           ]
  //         }
  //       ],
  //       attributes: {
  //         class: "bg-gray-900 text-white py-12 border-t border-gray-800"
  //       }
  //     }
  //   ],
  // };
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
  //                       type: "text-content",
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
  //                       type: "text-content",
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
  //                       type: "text-content",
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

  editor.Commands.add("update-theme-options", {
    run(editor, sender, { themeoptions }) {
      console.log(themeoptions);
      // Function to update CSS variables
      const updateCSSVariables = (options) => {
        const rootStyle = document.documentElement;

        // Update font variables
        rootStyle.style.setProperty("--font-primary", options.fonts.primary);
        rootStyle.style.setProperty(
          "--font-secondary",
          options.fonts.secondary
        );
        rootStyle.style.setProperty("--font-scale", options.fonts.scale);

        // Update color variables
        rootStyle.style.setProperty("--color-primary", options.colors.primary);
        rootStyle.style.setProperty(
          "--color-primary-light",
          options.colors.primaryLight
        );
        rootStyle.style.setProperty(
          "--color-primary-dark",
          options.colors.primaryDark
        );
        rootStyle.style.setProperty(
          "--color-text-light",
          options.colors.textLight
        );
        rootStyle.style.setProperty(
          "--color-section-light",
          options.colors.sectionLight
        );
        rootStyle.style.setProperty(
          "--color-section-accent1",
          options.colors.sectionAccent1
        );
        rootStyle.style.setProperty(
          "--color-section-accent2",
          options.colors.sectionAccent2
        );
        rootStyle.style.setProperty(
          "--color-section-dark",
          options.colors.sectionDark
        );
        rootStyle.style.setProperty(
          "--color-text-primary",
          options.colors.textPrimary
        );
        rootStyle.style.setProperty(
          "--color-text-secondary",
          options.colors.textSecondary
        );
      };

      // Update CSS variables
      updateCSSVariables(themeoptions);

      // Optional: Trigger a re-render or update in the editor
      editor.refresh();
    },
  });

  // Generate the website structure
  const websiteStructure = generateWebsiteStructure(editor, websiteData);

  // Load the website structure into GrapeJS
  editor.on("load", () => {
    console.log("Loading website structure:", websiteStructure);
    loadWebsiteStructure(editor, websiteStructure);
  });

  editor.on('component:update', (model) => {
    // Check if the updated component is the navbar or any of its children
    if (model.get('type') === 'navbar' || model.closest('[data-gjs-type="navbar"]')) {
      console.log("Navbar Updated")
      const navbarComponent = editor.Components.getWrapper().find('[data-gjs-type="navbar"]')[0];
      if (navbarComponent) {
        console.log("Navbar Updated")
        localStorage.setItem('globalNavbar', JSON.stringify(navbarComponent.toJSON()));
      }
    }
  });
  
  editor.on('load', () => {
    const savedNavbar = localStorage.getItem('globalNavbar');
  
    if (savedNavbar) {

      const navbar = JSON.parse(savedNavbar);
      let navbarComponent = editor.Components.getWrapper().find('[data-gjs-type="navbar"]')[0];

    if (navbarComponent) {
      // Remove existing navbar and add the saved one
      navbarComponent.remove();
    }

    // Append the saved navbar at the top
    editor.Components.getWrapper().append(navbar, { at: 0 });
    console.log("APPENDED")
    }
  });
  
};

