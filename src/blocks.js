import components from "./components";

export default (editor, opts = {}) => {
  const bm = editor.BlockManager;

  bm.add("hero-section-block", {
    label: "Hero Section",
    category: "Theme",
    content: {
      type: "hero-section",
    },
    media: '<img src="https://via.placeholder.com/150x50" />', // Optional thumbnail for the block
  });
  bm.add("navbar", {
    label: " Navbar",
    content: { type: "navbar" },
    category: "Theme",
  });
  bm.add("map-section", {
    label: "Map Section",
    content: { type: "map-section" },
    category: "Theme",
  });
  bm.add("video-section", {
    label: "Video Section",
    content: { type: "video-section" },
    category: "Theme",
  });


  ///COntent blocks
  bm.add("text-content", {
    label: "Text Content",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/text-content.png",
    defaulttheme: true,
    content: {
      type: "text-content",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        <ul class="list-disc list-inside">
          <li>Lorem ipsum dolor item 1</li>
          <li>Dolor sit item 2</li>
          <li>Consectetur item 3</li>
        </ul>`
    }
  });

  bm.add("hero-text-title", {
    label: "Heading 1",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/hero-text-title.png",
    defaulttheme: true,
    content: { type: "hero-text-title", content: "Title" }
  });

  bm.add("content-title", {
    label: "Heading 2",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/content-title.png",
    defaulttheme: true,
    content: { type: "content-title", content: "Title" }
  });

  bm.add("content-heading", {
    label: "Heading 3",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/content-heading.png",
    defaulttheme: true,
    content: { type: "content-heading" }
  });

  bm.add("hero-text-subtitle", {
    label: "Subtitle 1",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/hero-text-title.png",
    defaulttheme: true,
    content: { type: "hero-text-subtitle", content: "Lorem Ipsum" }
  });

  bm.add("content-subtitle", {
    label: "Subtitle 2",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/content-title.png",
    defaulttheme: true,
    content: { type: "content-subtitle", content: "Lorem Ipsum" }
  });

  bm.add("small-text", {
    label: "Small Text",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/small-text.png",
    defaulttheme: true,
    content: { type: "small-text", content: "Lorem Ipsum" }
  });

  bm.add("badge", {
    label: "Badge",
    category: "Content",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/badge.png",
    defaulttheme: true,
    content: { type: "badge", content: "Category" }
  });


  ///Layout blocks
  bm.add("grid-layout", {
    label: "Grid Layout",
    category: "Layout",
    defaulttheme: true,
    content: {
      type: "grid-layout",
      attributes: {
        desktopColumns: "grid-cols-3",
        mobileColumns: "grid-cols-1",
        "mobile-width": "100%",
        gap: "gap-2",
      },
      components: Array(4).fill({
        type: "bg-box",
        attributes: {
          "bg-image": "https://blog.adobe.com/en/publish/2020/06/16/media_13d73c6efc8a32d56ab9a678fc0a597009a372ca7.png?width=750&format=png&optimize=medium",
          "mobile-height": "230px"
        },
        components: [
        ],
      }),
    },
    media: `<svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="18" height="18" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="26" y="4" width="18" height="18" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="4" y="26" width="18" height="18" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="26" y="26" width="18" height="18" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
    </svg>`
  });

  bm.add("flex-row", {
    label: "Row",
    category: "Layout",
    defaulttheme: true,
    content: {
      type: "flex",
      attributes: {
        flexDirection: "flex-row",
        flexDirectionDesktop: "md:flex-row",
        wrap: "flex-wrap",
        gap: "gap-2",
        alignItems: "items-start",
        alignContent: "content-start",
        justifyContent: "justify-between"
      },
      components: [
        {
          type: "text-content",
          content: "First Item"
        },
        {
          type: "text-content",
          content: "Second Item"
        }
      ]
    },
    media: `<svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="18" height="40" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="26" y="4" width="18" height="40" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="8" y="8" width="10" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="8" y="12" width="6" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="30" y="8" width="10" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="30" y="12" width="8" height="2" rx="1" fill="#cbd5e1"/>
    </svg>`
  });

  bm.add("flex-column", {
    label: "Column",
    category: "Layout",
    defaulttheme: true,
    content: {
      type: "flex",
      attributes: {
        flexDirection: "flex-col",
        flexDirectionDesktop: "md:flex-col",
        wrap: "flex-wrap",
        gap: "gap-2",
        alignItems: "items-start",
        alignContent: "content-start",
        justifyContent: "justify-start"
      },
      components: [
        {
          type: "text-content",
          content: "First Item"
        },
        {
          type: "text-content",
          content: "Second Item"
        }
      ]
    },
    media: `<svg viewBox="0 0 48 48" fill="none">
      <rect x="4" y="4" width="40" height="18" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="4" y="26" width="40" height="18" rx="2" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="8" y="8" width="8" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="8" y="12" width="6" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="8" y="30" width="8" height="2" rx="1" fill="#cbd5e1"/>
      <rect x="8" y="34" width="10" height="2" rx="1" fill="#cbd5e1"/>
    </svg>`
  });

  bm.add("spacer", {
    label: "Vertical Spacer",
    category: "Layout",
    defaulttheme: true,
    content: {
      type: "spacer",
      attributes: {
        class: "h-4" // You can change this to "h-8", "h-12" etc. depending on spacing needs
      }
    },
    media: `<svg viewBox="0 0 48 48" fill="none">
      <rect x="20" y="8" width="8" height="12" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="20" y="28" width="8" height="12" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="0.5"/>
      <line x1="24" y1="22" x2="24" y2="26" stroke="#94a3b8" stroke-width="1" stroke-dasharray="2,2"/>
      <circle cx="24" cy="20" r="1" fill="#94a3b8"/>
      <circle cx="24" cy="28" r="1" fill="#94a3b8"/>
    </svg>`
  });

  bm.add("container", {
    label: "Container",
    category: "Layout",
    defaulttheme: true,
    content: {
      type: "container", attributes: { textalign: "center" }, components: [{
        type: "text-content",
        attributes: { textalign: "center" },
        content:
          "Container Item"
      }]
    },
    media: `<svg viewBox="0 0 48 48" fill="none">
      <rect x="6" y="6" width="36" height="36" rx="3" fill="#f8fafc" stroke="#cbd5e1" stroke-width="0.5"/>
      <rect x="10" y="10" width="28" height="3" rx="1.5" fill="#e2e8f0"/>
      <rect x="10" y="16" width="20" height="3" rx="1.5" fill="#e2e8f0"/>
      <rect x="10" y="22" width="24" height="3" rx="1.5" fill="#e2e8f0"/>
      <rect x="10" y="28" width="16" height="3" rx="1.5" fill="#e2e8f0"/>
      <rect x="10" y="34" width="22" height="3" rx="1.5" fill="#e2e8f0"/>
    </svg>`
  });
  bm.add("card", {
    label: "Card",
    category: "Layout",
    defaulttheme: true,
    content: { type: "card" }
  });
  bm.add("card-grid-3", {
    label: "3 Card Grid (Image Top)",
    category: "Layout",
    defaulttheme: true,
    content: {
      type: "grid-layout",
      attributes: {
        desktopColumns: "grid-cols-3",
        mobileColumns: "grid-cols-1",
        gap: "gap-2",
      },
      components: Array(4).fill({
        type: "bg-box",
        attributes: {
          "bg-image": "https://static.vecteezy.com/system/resources/previews/007/461/951/large_2x/abstract-background-graphic-blue-grey-background-free-photo.jpg",
          "mobile-height": "230px"
        },
        components: [
        ],
      }),
    },
  });


  ///section blocks
  bm.add("section", {
    label: "Blank Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`
      },
      components: [{
        type: "container", attributes: { textalign: "center" }, components: [{
          type: "text-content",
          attributes: { textalign: "center" },
          content:
            "Section Content"
        }]
      }]
    },
    media: ``
  });
  bm.add("bg-section", {
    label: "Background Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
        class: "p-0 py-0",
      },
      components: [{
        type: "bg-box",
        attributes: {
          "bg-image": "https://blog.adobe.com/en/publish/2020/06/16/media_13d73c6efc8a32d56ab9a678fc0a597009a372ca7.png?width=750&format=png&optimize=medium",
          "mobile-height": "330px"
        },
        content: `
    <div class="mx-auto w-full max-w-5xl px-4 py-24 md:px-6">
      <div class="text-center">
        <!-- Logo Carousel animation  -->
        <div
          x-data="{}"
          x-init="$nextTick(() => {
                        let ul = $refs.logos;
                        ul.insertAdjacentHTML('afterend', ul.outerHTML);
                        ul.nextSibling.setAttribute('aria-hidden', 'true');
                    })"
          class="inline-flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
        >
          <ul x-ref="logos" class="animate-infinite-scroll flex items-center justify-center md:justify-start [&_img]:max-w-none [&_li]:mx-8">
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/facebook.svg" alt="Facebook" />
            </li>
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/disney.svg" alt="Disney" />
            </li>
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/airbnb.svg" alt="Airbnb" />
            </li>
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/apple.svg" alt="Apple" />
            </li>
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/spark.svg" alt="Spark" />
            </li>
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/samsung.svg" alt="Samsung" />
            </li>
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/quora.svg" alt="Quora" />
            </li>
            <li>
              <img src="https://cruip-tutorials.vercel.app/logo-carousel/sass.svg" alt="Sass" />
            </li>
          </ul>
        </div>
        <!-- End: Logo Carousel animation  -->
      </div>
    </div>`
      }]
    },
    media: ``
  });
  bm.add("logo-strip-section", {
    label: "Strip Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
        paddingTop: "pt-4",
        paddingBottom: "pb-4"
      },
      components: [{
        type: "flex",
        attributes: {
          flexDirection: "flex-row",
          flexDirectionDesktop: "md:flex-row",
          wrap: "flex-wrap",
          gap: "gap-2",
          alignItems: "items-start",
          alignContent: "content-start",
          justifyContent: "justify-around"
        },
        components: [
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "	https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy-Copy-768x387.jpg",
              }
            }
          },
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy-Copy-2.jpg",
              }
            }
          },
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy-Copy-3.jpg",
              }
            }
          },
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "	https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy.jpg",
              }
            }
          },
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy-Copy-1.jpg",
              }
            }
          },
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy-1.jpg",
              }
            }
          },
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy-Copy-4.jpg",
              }
            }
          },
          {
            type: "img-wrapper",
            attributes: {
              "mobile-height": "56px"
            },
            components: {
              type: "custom-image",
              attributes: {
                "src": "	https://posten.in/wp-content/uploads/2022/07/L-T-Logo-Copy-Copy-3-1.jpg",
              }
            }
          },
        ]
      }],
      media: ``
    }
  });




  bm.add("gmap-section", {
    label: "Map Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `map-${Math.random().toString(36).substr(2, 8)}`,
        class: "p-0 py-0",
      },
      components: [{
        type: "google-map",
        attributes: {
          "location": "Pune",
          "mobile-height": "330px"
        },
      }]
    },
    media: ``
  });


  ///Form blocks
  bm.add("form", {
    label: "Form",
    category: "Form",
    defaulttheme: true,
    content: {
      type: "form-wrapper",
    },
    media: ``
  });


  ///Footer blocks
  bm.add("footer", {
    label: "Footer",
    category: "Layout",
    defaulttheme: true,
    content: {
      type: "footer",
      attributes: {
        id: `map-${Math.random().toString(36).substr(2, 8)}`,
        class: "bg-section-dark light-text",
      },
      content: `
            <div class="mx-auto px-4 pt-16 sm:max-w-xl md:max-w-full md:px-24 lg:max-w-screen-xl lg:px-8">
              <div class="row-gap-6 mb-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div class="">
                  <div class="flex flex-col items-start justify-start flex-shrink-0 items-start">
                   
                  </div>

                  <div class="lg:max-w-sm">
                    <p data-gjs-type="text-content" class=" mt-4 text-sm">
                      <h5 class="text-xl font-bold tracking-wide"><span class="business-name"></span> </h5>
                      <p class="business-description">Avora Solutions, based in North Carolina, specializes in virtual staffing, connecting businesses with top-tier global professionals.</p>
                    
                    </p>
                     <p data-gjs-type="text-content" class=" mt-2 text-sm">
                      <p class="business-hours"></p>
                    
                    </p>
                  </div>
                </div>

                <div class="space-y-4 text-sm flex md:items-center justify-start flex-col">
                  <h5 class="text-base font-bold tracking-wide">Company</h5>
                  <div class="space-y-4">
                    <div class="flex items-center">
                      
                      <span class="relative font-medium hover:font-bold transition-all duration-300
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:w-0 after:h-[2px] after:bg-current
          after:transition-all after:duration-300 hover:after:w-full"><a href="/">Home</a></span>
                    </div>
                    <div class="flex items-center">
                      
                      <span class="relative font-medium hover:font-bold transition-all duration-300
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:w-0 after:h-[2px] after:bg-current
          after:transition-all after:duration-300 hover:after:w-full"><a href="/about-us">About</a></span>
                    </div>
                    <div class="flex items-center">
                     
                      <span class="relative font-medium hover:font-bold transition-all duration-300
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:w-0 after:h-[2px] after:bg-current
          after:transition-all after:duration-300 hover:after:w-full"><a href="/solutions">Solutions</a></span>
                    </div>
                    <div class="flex items-center">
                     
                      <span class="relative font-medium hover:font-bold transition-all duration-300
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:w-0 after:h-[2px] after:bg-current
          after:transition-all after:duration-300 hover:after:w-full"><a href="/contact">Contact</a></span>
                    </div>
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
                      <span class=" ml-3 relative font-medium hover:font-bold transition-all duration-300
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:w-0 after:h-[2px] after:bg-current
          after:transition-all after:duration-300 hover:after:w-full"><a href="tel:+19192577724" class="phone-number">+1 (919) 257-7724</a></span>
                    </div>
                    <div class="flex items-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full border">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <span class=" ml-3 relative font-medium hover:font-bold transition-all duration-300
          after:content-[''] after:absolute after:left-0 after:bottom-0
          after:w-0 after:h-[2px] after:bg-current
          after:transition-all after:duration-300 hover:after:w-full"><a href="info.avorasolutions@gmail.com" class="email">info.avorasolutions@gmail.com</a></span>
                    </div>
                    <div class="flex items-center">
                      <div class="flex h-8 w-8 items-center justify-center rounded-full border">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                      </div>
                      <span class=" ml-3"><span class="address">Avora Solutions LLC Raleigh–Durham, North Carolina, USA</span></span>
                    </div>
                  </div>
                </div>

               
              </div>

              <div class="flex flex-col-reverse px-4 lg:px-8 justify-between border-t pt-5 pb-10 lg:flex-row">
                <p class="text-sm">© <span id="year"></span>  <span class="business-name">Avora Solutions</span> All rights reserved.</p>
                
              </div>
            </div>

          `,
    },
    media: ``
  });

  ///Icon Blocks
  bm.add("default-icon", {
    label: "Icon",
    category: "Icons",
    defaulttheme: true,
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/default-icon.png",
    content: {
      type: "icon",
      content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>',
      attributes: {
        "mobile-width": "18px",
      }
    }
  });



  ///Button blocks
  bm.add("button-primary", {
    label: "Button",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/button-primary.png",
    category: "Buttons",
    defaulttheme: true,
    content: { type: "button-primary", content: "Button Text" }
  });

  bm.add("button-primary-icon", {
    label: "Button with Icon",
    category: "Buttons",
    defaulttheme: true,
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/button-primary-icon.png",
    content: {
      type: "button-primary", components: [{
        type: "flex",
        attributes: {
          flexDirection: "flex-row",
          flexDirectionDesktop: "md:flex-row",
          wrap: "flex-wrap",
          gap: "gap-4",
          alignItems: "items-center",
          alignContent: "content-center",
          justifyContent: "justify-between"
        },
        components: [
          {

            type: "icon",
            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>',
            attributes: {
              "mobile-width": "18px",
            }
          },
          {
            type: "text-content",
            content: "Contact Us",
            attributes: {
              class: "m-0"
            }
          }
        ]
      },]
    }
  });

  bm.add("button-secondary", {
    label: "Button Outlined",
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/button-secondary.png",
    category: "Buttons",
    defaulttheme: true,
    content: { type: "button-secondary", content: "Button Text" }
  });

  bm.add("button-tertiary", {
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/button-tertiary.png",
    label: "Button Arrow",
    category: "Buttons",
    defaulttheme: true,
    content: { type: "button-tertiary", content: "Button Text" }
  });


  ///Visual Blocks
  bm.add("default-image", {
    label: "Image",
    category: "Visuals",
    defaulttheme: true,
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/default-image.png",
    content: {
      type: "img-wrapper",
      components: {
        type: "custom-image",
        attributes: {
          "src": "https://images.unsplash.com/photo-1751445384422-4a70245dbf65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MjczNDh8MHwxfHNlYXJjaHwxfHxjdXJhdGVkJTIwcGxhbnQlMjBzZWxlY3Rpb258ZW58MHx8fHwxNzUzMDcxNzIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        }
      }
    }
  });
  bm.add("profile-image", {
    label: "Circular Image",
    category: "Visuals",
    defaulttheme: true,
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/profile-image.png",
    content: {
      type: "profile-image",
      components: {
        type: "custom-image",
        attributes: {
          "src": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
        }
      }
    }
  });
  bm.add("gallery-grid", {
    label: "Gallery Grid",
    category: "Visuals",
    defaulttheme: true,
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/gallery-grid.png",
    content: {
      type: "masonry-grid",
      components: [
        {
          type: "img-wrapper",
          attributes: { "aspect-ratio": "1.33" },
          components: {
            type: "custom-image",
            attributes: {
              src: "https://picsum.photos/id/1015/400/600",
              alt: "Gallery Image"
            }
          }
        },
        {
          type: "img-wrapper",
          attributes: { "aspect-ratio": "0.75" },
          components: {
            type: "custom-image",
            attributes: {
              src: "https://picsum.photos/id/1016/400/300",
              alt: "Gallery Image"
            }
          }
        },
        {
          type: "img-wrapper",
          attributes: { "aspect-ratio": "1.5" },
          components: {
            type: "custom-image",
            attributes: {
              src: "https://picsum.photos/id/1018/400/500",
              alt: "Gallery Image"
            }
          }
        },
        {
          type: "img-wrapper",
          attributes: { "aspect-ratio": "1.25" },
          components: {
            type: "custom-image",
            attributes: {
              src: "https://picsum.photos/id/1020/400/400",
              alt: "Gallery Image"
            }
          }
        },
        {
          type: "img-wrapper",
          attributes: { "aspect-ratio": "0.66" },
          components: {
            type: "custom-image",
            attributes: {
              src: "https://picsum.photos/id/1024/400/350",
              alt: "Gallery Image"
            }
          }
        },
        {
          type: "img-wrapper",
          attributes: { "aspect-ratio": "1.8" },
          components: {
            type: "custom-image",
            attributes: {
              src: "https://picsum.photos/id/1025/400/700",
              alt: "Gallery Image"
            }
          }
        }
      ]
    }
  });

  bm.add("bg-box", {
    label: "Background",
    category: "Buttons",
    content: { type: "bg-box", content: "Button Text" }
  });


  bm.add("image-section-1", {
    label: "Image Section",
    category: "Sections",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "image-section",
      attributes: {
        sectiontype: "accent-1",
        imageposition: "right",
        id: `products`
      },
      components: [
        {
          type: "bg-box",
          attributes: {
            "bg-image": "https://posten.in/wp-content/uploads/2022/12/0-Post-tensioning-of-I-Girders-Copy.jpeg",
            "bg-overlay": "primary-gradient",
            id: `bg-box-${Math.random().toString(36).substr(2, 8)}`
          }
        },
        {
          type: "flex",
          components: [
            {
              type: "container",
              components: [
                {
                  type: "content-subtitle",
                  content: "Anything You Need"
                },
                {
                  type: "content-title",
                  content: "We Provide All components, consumables, equipments & Services",
                },
                {
                  type: "text-content",
                  content: "Backed by a robust supply chain, agile manufacturing processes, compliant warehousing, and a skilled workforce, Posten ensures timely delivery of products and projects within your specifications and constraints.",
                },
                {
                  type: "flex",
                  attributes: {
                    flexDirection: "flex-col",
                    flexDirectionDesktop: "md:flex-row",
                    wrap: "flex-wrap",
                    gap: "gap-4",
                    alignItems: "items-start",
                    alignContent: "content-start",
                    justifyContent: "justify-between"
                  },
                  components: [
                    {
                      type: "flex",
                      attributes: {
                        flexDirection: "flex-row",
                        flexDirectionDesktop: "md:flex-row",
                        wrap: "flex-wrap",
                        gap: "gap-2",
                        alignItems: "items-center",
                        alignContent: "content-center",
                        justifyContent: "justify-start"
                      },
                      components: [
                        {
                          type: "icon",
                          content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM18 13h-2v3h-3v2h3v3h2v-3h3v-2h-3z"></path></svg>',
                          attributes: {
                            "mobile-width": "60px",
                            "icon-style": "icon-style-white-bg",
                          }
                        },
                        {
                          type: "text-content",
                          content: "Customizable Supplies"
                        }
                      ]
                    },
                    {
                      type: "flex",
                      attributes: {
                        flexDirection: "flex-col",
                        flexDirectionDesktop: "md:flex-row",
                        wrap: "flex-wrap",
                        gap: "gap-2",
                        alignItems: "items-center",
                        alignContent: "content-center",
                        justifyContent: "justify-start"
                      },
                      components: [
                        {
                          type: "icon",
                          content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM13 20.01L4 11V4h7v-.01l9 9-7 7.02z"></path><circle cx="6.5" cy="6.5" r="1.5"></circle></svg>',
                          attributes: {
                            "mobile-width": "60px",
                            "icon-style": "icon-style-white-bg",
                          }
                        },
                        {
                          type: "text-content",
                          content: "Flexible Service Offers"
                        }
                      ]
                    }
                  ]
                },
                { type: "button-secondary", content: "See Our Products" }
              ]
            }
          ]
        }
      ]
    }
  });
  bm.add("image-section-2", {
    label: "Image Section 2",
    category: "Sections",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "image-section",
      attributes: {
        sectiontype: "normal",
        imageposition: "right",
        id: `services`
      },
      components: [
        {
          type: "bg-box",
          attributes: {
            "bg-image": "https://www.nbmcw.com/images/news/Bridgework.jpg",
            "bg-overlay": "primary-gradient",
            id: `bg-box-${Math.random().toString(36).substr(2, 8)}`
          }
        },
        {
          type: "flex",
          components: [
            {
              type: "container",
              components: [
                {
                  type: "content-subtitle",
                  content: "Why Choose Us"
                },
                {
                  type: "content-title",
                  content: "Building Strong Foundations, Globally",
                },
                {
                  type: "text-content",
                  content: 'Since <b class="highlight strong">1999</b> Posten has been a trusted name in the pre-stressing industry. We’ve proudly partnered with leading public and private sector clients, delivering solutions across a diverse range of projects—including bridges, flyovers, commercial buildings, and silos—spanning multiple geographies.',
                },
                {
                  type: "spacer",
                  attributes: {
                    "mobile-height": "48px",
                  }
                },
                {
                  type: "flex",
                  attributes: {
                    flexDirection: "flex-col",
                    flexDirectionDesktop: "md:flex-row",
                    wrap: "flex-wrap",
                    gap: "gap-4",
                    alignItems: "items-start",
                    alignContent: "content-start",
                    justifyContent: "justify-between"
                  },
                  components: [
                    {
                      type: "flex",
                      attributes: {
                        flexDirection: "flex-col",
                        flexDirectionDesktop: "md:flex-col",
                        wrap: "flex-wrap",
                        gap: "gap-0",
                        alignItems: "items-start",
                        alignContent: "content-start",
                        justifyContent: "justify-start"
                      },
                      components: [
                        {
                          type: "statistic-text",
                          content: "300+"
                        },
                        {
                          type: "text-content",
                          content: "Projects Completed"
                        }
                      ]
                    },
                    {
                      type: "flex",
                      attributes: {
                        flexDirection: "flex-col",
                        flexDirectionDesktop: "md:flex-col",
                        wrap: "flex-wrap",
                        gap: "gap-0",
                        alignItems: "items-start",
                        alignContent: "content-start",
                        justifyContent: "justify-start"
                      },
                      components: [
                        {
                          type: "statistic-text",
                          content: "20+"
                        },
                        {
                          type: "text-content",
                          content: "Years of Experience"
                        }
                      ]
                    }
                  ]
                },
                { type: "button-secondary", content: "See Our Services" }
              ]
            }
          ]
        }
      ]
    }
  });
  ///Posten Sections 
  bm.add("about-1", {
    label: "About Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
      },
      components: [{
        type: "container",
        components: [
          {
            type: "flex",
            attributes: {
              flexDirection: "flex-col",
              flexDirectionDesktop: "md:flex-row",
              wrap: "no-wrap",
              gap: "gap-8",
              alignItems: "items-start",
              alignContent: "content-start",
              justifyContent: "justify-between"
            },
            components: [
              {
                type: "flex",
                attributes: {
                  flexDirection: "flex-col",
                  flexDirectionDesktop: "md:flex-col",
                  wrap: "no-wrap",
                  gap: "gap-8",
                  alignItems: "items-start",
                  alignContent: "content-start",
                  justifyContent: "justify-start",
                  "desktop-width": "33%",
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",

                    },
                    components: [
                      {
                        type: "badge",
                        content: "Who We Are"
                      },
                      {
                        type: "content-title",
                        content: "Manufacturers, Suppliers, Engineers & Contractors"
                      }
                    ]
                  },
                ]
              },
              {
                type: "flex",
                attributes: {
                  flexDirection: "flex-col",
                  flexDirectionDesktop: "md:flex-col",
                  wrap: "flex-wrap",
                  gap: "gap-6",
                  alignItems: "items-stretch",
                  justifyContent: "justify-start",
                  "desktop-width": "60%",
                },
                components: [

                  {
                    type: "text-content",
                    content: "<p><strong>We, M/s POSTEN INFRATECH (I) PVT. LTD.,</strong> are a leading manufacturer and applicator of pre-tensioning and post-tensioning components, equipment, and machinery.</p><p>With a dedicated in-house team, we design, manufacture, and integrate complete PT systems tailored to project requirements. We offer in-house testing facilities and partner with NABL-certified labs for advanced testing.</p><br/><p>Having successfully supplied and executed over 300 projects across India and overseas, we are registered and experienced with clients such as DMRC, PWD, and various government departments nationwide.</p>"
                  },
                ]
              }
            ]

          },
          // {
          //   type: 'marquee',
          //   components: [
          //     {
          //       type: 'flex',
          //       attributes: {
          //         flexDirection: 'flex-row',
          //         flexDirectionDesktop: 'flex-row',
          //         wrap: 'no-wrap',
          //         gap: 'gap-8',
          //         alignItems: 'items-center',
          //         justifyContent: 'justify-start',
          //         class: 'whitespace-nowrap',
          //       },
          //       components: [
          //         { type: 'text-content', content: 'Hydraulic Jacks' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'Powerpacks' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'Barrels' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'Wedges/Anchor Grips' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'Anchor Cone' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'Anchor Heads' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'GI Sheathing Ducts' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'Grouting Equipment' },
          //         { type: 'text-content', content: '🔸' },
          //         { type: 'text-content', content: 'PT Slabs/Girders' }
          //       ]
          //     }
          //   ],
          //   attributes: {
          //     behavior: 'scroll',
          //     direction: 'left',
          //     scrollamount: '5',
          //   }
          // }
          {
            type: "spacer",
            attributes: {
              "mobile-height": "48px",
            }
          },
          {
            type: "grid-layout",
            attributes: {
              desktopColumns: "grid-cols-3",
              mobileColumns: "grid-cols-1",
              "mobile-width": "100%",
              gap: "gap-4",
            },
            components: [

              {
                type: "card",
                attributes: {
                  background: "true",
                  bordered: "true"
                },
                components: [
                  {
                    type: "card-body",
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-col",
                          flexDirectionDesktop: "md:flex-col",
                          wrap: "no-wrap",
                          gap: "gap-4",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "icon",
                            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"></path></svg>',
                            attributes: {
                              "mobile-width": "60px",
                              "icon-style": "icon-style-white-bg",
                            }
                          },
                          {
                            type: "content-heading",
                            content: "PT Ducts/Sheathing Pipes"
                          },
                          {
                            type: "text-content",
                            content: "We manufacture the ducts for post tensioning and stressing."
                          }
                        ]
                      }
                    ],
                  }
                ],
              },
              // Duplicate 4 more times
              {
                type: "card",
                attributes: {
                  background: "true",
                  bordered: "true"
                },
                components: [
                  {
                    type: "card-body",
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-col",
                          flexDirectionDesktop: "md:flex-col",
                          wrap: "no-wrap",
                          gap: "gap-4",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "icon",
                            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M372 160H12c-6.6 0-12 5.4-12 12v56c0 6.6 5.4 12 12 12h140v228c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12V240h140c6.6 0 12-5.4 12-12v-56c0-6.6-5.4-12-12-12zm0-128H12C5.4 32 0 37.4 0 44v56c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12z"></path></svg>',
                            attributes: {
                              "mobile-width": "60px",
                              "icon-style": "icon-style-white-bg",
                            }
                          },
                          {
                            type: "content-heading",
                            content: "Wedges & Bearing Plates"
                          },
                          {
                            type: "text-content",
                            content: "We design and manufacture the wedges and bearing platess. ​"
                          }
                        ]
                      }
                    ],
                  }
                ],
              },
              {
                type: "card",
                attributes: {
                  background: "true",
                  bordered: "true"
                },
                components: [
                  {
                    type: "card-body",
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-col",
                          flexDirectionDesktop: "md:flex-col",
                          wrap: "no-wrap",
                          gap: "gap-4",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "icon",
                            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 15l1.55 1.55c-.96 1.69-3.33 3.04-5.55 3.37V11h3V9h-3V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H8v2h3v8.92c-2.22-.33-4.59-1.68-5.55-3.37L7 15l-4-3v3c0 3.88 4.92 7 9 7s9-3.12 9-7v-3l-4 3zM12 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"></path></svg>',
                            attributes: {
                              "mobile-width": "60px",
                              "icon-style": "icon-style-white-bg",
                            }
                          },
                          {
                            type: "content-heading",
                            content: "Anchorages"
                          },
                          {
                            type: "text-content",
                            content: "We manufacture & supply various anchorages. ​"
                          }
                        ]
                      }
                    ],
                  }
                ],
              },
              {
                type: "card",
                attributes: {
                  background: "true",
                  bordered: "true"
                },
                components: [
                  {
                    type: "card-body",
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-col",
                          flexDirectionDesktop: "md:flex-col",
                          wrap: "no-wrap",
                          gap: "gap-4",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "icon",
                            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M144 192c26.5 0 48-21.5 48-48s-21.5-48-48-48-48 21.5-48 48 21.5 48 48 48zm112-48c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm-32-48c26.5 0 48-21.5 48-48S250.5 0 224 0s-48 21.5-48 48 21.5 48 48 48zm-16.2 139.1c.1-12.4-13.1-20.1-23.8-13.7-34.3 20.3-71.4 32.7-108.7 36.2-9.7.9-15.6 11.3-11.6 20.2 6.2 13.9 11.1 28.6 14.7 43.8 3.6 15.2-5.3 30.6-20.2 35.1-14.9 4.5-30.1 7.6-45.3 9.1-9.7 1-15.7 11.3-11.7 20.2 15 32.8 22.9 69.5 23 107.7.1 14.4 15.2 23.1 27.6 16 33.2-19 68.9-30.5 104.8-33.9 9.7-.9 15.6-11.3 11.6-20.2-6.2-13.9-11.1-28.6-14.7-43.8-3.6-15.2 5.3-30.6 20.2-35.1 14.9-4.5 30.1-7.6 45.3-9.1 9.7-1 15.7-11.3 11.7-20.2-15.5-34.2-23.3-72.5-22.9-112.3zM435 365.6c-15.2-1.6-30.3-4.7-45.3-9.1-14.9-4.5-23.8-19.9-20.2-35.1 3.6-15.2 8.5-29.8 14.7-43.8 4-8.9-1.9-19.3-11.6-20.2-37.3-3.5-74.4-15.9-108.7-36.2-10.7-6.3-23.9 1.4-23.8 13.7 0 1.6-.2 3.2-.2 4.9.2 33.3 7 65.7 19.9 94 5.7 12.4 5.2 26.6-.6 38.9 4.9 1.2 9.9 2.2 14.8 3.7 14.9 4.5 23.8 19.9 20.2 35.1-3.6 15.2-8.5 29.8-14.7 43.8-4 8.9 1.9 19.3 11.6 20.2 35.9 3.4 71.6 14.9 104.8 33.9 12.5 7.1 27.6-1.6 27.6-16 .2-38.2 8-75 23-107.7 4.3-8.7-1.8-19.1-11.5-20.1z"></path></svg>',
                            attributes: {
                              "mobile-width": "60px",
                              "icon-style": "icon-style-white-bg",
                            }
                          },
                          {
                            type: "content-heading",
                            content: "Tensioning"
                          },
                          {
                            type: "text-content",
                            content: "We provide services of pre-tensioning and post tensioning."
                          }
                        ]
                      }
                    ],
                  }
                ],
              },
              {
                type: "card",
                attributes: {
                  background: "true",
                  bordered: "true"
                },
                components: [
                  {
                    type: "card-body",
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-col",
                          flexDirectionDesktop: "md:flex-col",
                          wrap: "no-wrap",
                          gap: "gap-4",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "icon",
                            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M257 8C120 8 9 119 9 256s111 248 248 248 248-111 248-248S394 8 257 8zm-49.5 374.8L81.8 257.1l125.7-125.7 35.2 35.4-24.2 24.2-11.1-11.1-77.2 77.2 77.2 77.2 26.6-26.6-53.1-52.9 24.4-24.4 77.2 77.2-75 75.2zm99-2.2l-35.2-35.2 24.1-24.4 11.1 11.1 77.2-77.2-77.2-77.2-26.5 26.5 53.1 52.9-24.4 24.4-77.2-77.2 75-75L432.2 255 306.5 380.6z"></path></svg>',
                            attributes: {
                              "mobile-width": "60px",
                              "icon-style": "icon-style-white-bg",
                            }
                          },
                          {
                            type: "content-heading",
                            content: "Grouting"
                          },
                          {
                            type: "text-content",
                            content: "We manufacture and supply grouting formulations. We also offer service of grouting after tensioning."
                          }
                        ]
                      }
                    ],
                  }
                ],
              },
              {
                type: "card",
                attributes: {
                },
                components: [
                  {
                    type: "card-body",
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-col",
                          flexDirectionDesktop: "md:flex-col",
                          wrap: "no-wrap",
                          gap: "gap-4",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-center",
                        },
                        components: [
                          // {
                          //   type: "icon",
                          //   content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"></path></svg>',
                          //   attributes: {
                          //     "mobile-width": "30px",
                          //   }
                          // },
                          {
                            type: "content-heading",
                            content: "Accelerating Infrastructure Growth through our services."
                          },
                          { type: "button-primary", content: "Learn More" }
                        ]
                      }
                    ],
                  }
                ],
              },
            ]
          }

        ],
      }]
    },
    media: ``
  });
  bm.add("about-2", {
    label: "About2 Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
      },
      components: [{
        type: "container",
        components: [
          {
            type: "flex",
            attributes: {
              flexDirection: "flex-col",
              flexDirectionDesktop: "md:flex-row",
              wrap: "no-wrap",
              gap: "gap-8",
              alignItems: "items-start",
              alignContent: "content-start",
              justifyContent: "justify-between"
            },
            components: [
              {
                type: "flex",
                attributes: {
                  flexDirection: "flex-col",
                  flexDirectionDesktop: "md:flex-col",
                  wrap: "no-wrap",
                  gap: "gap-8",
                  alignItems: "items-start",
                  alignContent: "content-start",
                  justifyContent: "justify-start",
                  "desktop-width": "48%",
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",

                    },
                    components: [
                      {
                        type: "badge",
                        content: "Our Expertise"
                      },
                      {
                        type: "content-title",
                        content: "Specialists in Pre-Stressed Concrete Systems"
                      },
                      {
                        type: "text-content",
                        content: "<p>We are a dedicated specialty company offering cutting-edge solutions in pre-stressed concrete technology.<br> With over two decades of proven reliability, we manufacture a range of proprietary products known for their performance and durability. <br>Our services include pre-tensioning, post-tensioning, turnkey project execution, and expert consultation in all aspects of pre-stressing. </p>"
                      },
                      {
                        type: "spacer",
                        attributes: {
                          "desktop-height": "48px",
                        },
                      },
                      {
                        type: "button-primary",
                        content: "Get Your Pace"
                      },
                    ]
                  },
                ]
              },
              {
                type: "flex",
                attributes: {
                  flexDirection: "flex-col",
                  flexDirectionDesktop: "md:flex-col",
                  wrap: "flex-wrap",
                  gap: "gap-6",
                  alignItems: "items-stretch",
                  justifyContent: "justify-start",
                  "desktop-width": "48%",
                },
                components: [
                  {
                    type: "img-wrapper",
                    attributes: {
                      "mobile-width": "100%",
                      "aspect-ratio": "0.95"
                    },
                    components: {
                      type: "custom-image",
                      attributes: {
                        "src": "https://posten.in/wp-content/uploads/2022/07/Prestress.jpg",
                      }
                    }
                  },
                ]
              }
            ]

          },

        ],
      }]
    },
    media: ``
  });
  bm.add("values", {
    label: "Values Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
      },
      components: [{
        type: "container",
        components: [
          {
            type: "flex",
            attributes: {
              flexDirection: "flex-col",
              flexDirectionDesktop: "md:flex-row",
              wrap: "no-wrap",
              gap: "gap-8",
              alignItems: "items-start",
              alignContent: "content-start",
              justifyContent: "justify-between"
            },
            components: [
              {
                type: "flex",
                attributes: {
                  flexDirection: "flex-col",
                  flexDirectionDesktop: "md:flex-col",
                  wrap: "no-wrap",
                  gap: "gap-4",
                  alignItems: "items-start",
                  alignContent: "content-start",
                  justifyContent: "justify-start",

                },
                components: [
                  {
                    type: "content-title",
                    content: "Our Values"
                  },
                  {
                    type: "text-content",
                    content: "<p>With over 25 years of experience, our journey has been guided by values we proudly uphold. These timeless principles define who we are and how we work. </p>"
                  },
                ]
              },
            ]

          },

          {
            type: "grid-layout",
            attributes: {
              desktopColumns: "grid-cols-3",
              mobileColumns: "grid-cols-1",
              "mobile-width": "100%",
              gap: "gap-4",
            },
            components: [
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-center",
                      alignContent: "content-center",
                      justifyContent: "justify-center",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://www.shutterstock.com/image-photo/hands-low-angle-pile-team-600nw-2489916669.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-2",
                              alignItems: "items-center",
                              alignContent: "content-center",
                              justifyContent: "justify-center",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Commitment"
                              },
                              {
                                type: "text-content",
                                content: "Makes Reliable"
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-center",
                      alignContent: "content-center",
                      justifyContent: "justify-center",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://t4.ftcdn.net/jpg/04/45/14/97/360_F_445149719_ec0W8X21YI9GEsosxLAc3YD74v7Lf25S.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-2",
                              alignItems: "items-center",
                              alignContent: "content-center",
                              justifyContent: "justify-center",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Honesty"
                              },
                              {
                                type: "text-content",
                                content: "Preserves Relation"
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-center",
                      alignContent: "content-center",
                      justifyContent: "justify-center",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://cdn.pixabay.com/photo/2018/02/16/02/03/pocket-watch-3156771_640.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-2",
                              alignItems: "items-center",
                              alignContent: "content-center",
                              justifyContent: "justify-center",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Value for time"
                              },
                              {
                                type: "text-content",
                                content: "Boosts Growth"
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              }

            ]
          }

        ],
      }]
    },
    media: ``
  });
  bm.add("products", {
    label: "products Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
      },
      components: [{
        type: "container",
        components: [

          {
            type: "grid-layout",
            attributes: {
              desktopColumns: "grid-cols-3",
              mobileColumns: "grid-cols-1",
              "mobile-width": "100%",
              gap: "gap-4",
            },
            components: [
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1.618",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://posten.in/wp-content/uploads/2022/07/round.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-0",
                              alignItems: "items-start",
                              alignContent: "content-start",
                              justifyContent: "justify-start",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Bearing Plates"
                              },
                              {
                                type: "text-content",
                                content: "Plates of different specifications made of high strength alloy to comply with anchorages."
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1.618",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://posten.in/wp-content/uploads/2022/07/Grout.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-0",
                              alignItems: "items-start",
                              alignContent: "content-start",
                              justifyContent: "justify-start",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Grouting Admixtures"
                              },
                              {
                                type: "text-content",
                                content: "Our admixtures offer better corrosion resistance, workability & expansion."
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1.618",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://posten.in/wp-content/uploads/2022/07/Ancg.png",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-0",
                              alignItems: "items-start",
                              alignContent: "content-start",
                              justifyContent: "justify-start",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Anchorage"
                              },
                              {
                                type: "text-content",
                                content: "Anchorages for different number of tendons through single duct, in range of 4T13 to 27T15."
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1.618",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://posten.in/wp-content/uploads/2022/07/Ductw-1.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-0",
                              alignItems: "items-start",
                              alignContent: "content-start",
                              justifyContent: "justify-start",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Round Ducts"
                              },
                              {
                                type: "text-content",
                                content: "Metallic ducts or sheathing pipes of various sizes made of corrugated walls, those are suitable for bridges."
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1.618",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://posten.in/wp-content/uploads/2022/07/Wedges.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-0",
                              alignItems: "items-start",
                              alignContent: "content-start",
                              justifyContent: "justify-start",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Wedges"
                              },
                              {
                                type: "text-content",
                                content: "Wedges of 120o circular span with strengthened teeth to cover and hold all strands of a tendon."
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },
                components: [
                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-4",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-start",
                    },
                    components: [
                      {
                        type: "img-wrapper",
                        attributes: {
                          "mobile-width": "100%",
                          "aspect-ratio": "1.618",
                        },
                        components: {
                          type: "custom-image",
                          attributes: {
                            "src": "https://posten.in/wp-content/uploads/2022/07/fae-1.jpg",
                          }
                        }
                      },
                      {
                        type: "card-body",
                        components: [

                          {
                            type: "flex",
                            attributes: {
                              flexDirection: "flex-col",
                              flexDirectionDesktop: "md:flex-col",
                              wrap: "no-wrap",
                              gap: "gap-0",
                              alignItems: "items-start",
                              alignContent: "content-start",
                              justifyContent: "justify-start",
                            },
                            components: [
                              {
                                type: "content-heading",
                                content: "Flat Ducts"
                              },
                              {
                                type: "text-content",
                                content: "Flat metallic corrugated ducts are suitable for slabs"
                              }
                            ]
                          }
                        ],
                      }
                    ],
                  },
                ]
              },

            ]
          }

        ],
      }]
    },
    media: ``
  });
  bm.add("services", {
    label: "services Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
      },
      components: [{
        type: "container",
        components: [

          {
            type: "grid-layout",
            attributes: {
              desktopColumns: "grid-cols-3",
              mobileColumns: "grid-cols-1",
              "mobile-width": "100%",
              gap: "gap-4",
            },
            components: [
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },

                components: [
                  {
                    type: "bg-box",
                    attributes: {
                      "bg-image": "https://posten.in/wp-content/uploads/2022/07/bsas-1.jpg",
                    },
                    components: [{
                      type: "card-body",
                      attributes: {
                        "mobile-height": "100%",
                      },
                      classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                      components: [

                        {
                          type: "flex",
                          attributes: {
                            flexDirection: "flex-col",
                            flexDirectionDesktop: "md:flex-col",
                            wrap: "no-wrap",
                            gap: "gap-2",
                            alignItems: "items-start",
                            alignContent: "content-start",
                            justifyContent: "justify-between",
                            attributes: {
                              "mobile-height": "100%",
                            },
                          },
                          components: [
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-2",
                                alignItems: "items-start",
                                alignContent: "content-start",
                                justifyContent: "justify-start",
                              },
                              components: [
                                {
                                  type: "badge",
                                  content: "Bridges"
                                },
                                {
                                  type: "badge",
                                  content: "Buildings"
                                },
                                {
                                  type: "badge",
                                  content: "Flyovers"
                                },
                                {
                                  type: "badge",
                                  content: "Silos"
                                },
                              ]
                            },

                            {
                              type: "spacer",
                              attributes: {
                                "mobile-height": "58px",
                              }
                            },

                            {
                              type: "content-heading",
                              content: "Turnkey Projects"
                            },
                            {
                              type: "text-content",
                              content: `Complete Solution to a Project Need`
                            },
                            {
                              type: "spacer",
                              attributes: {
                                "mobile-height": "8px",
                              }
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Design of the Structural Members",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Commissioning of the design",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Validation and Audit",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Support for Maintenance",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ],
                    }]
                  },

                ],
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },

                components: [
                  {
                    type: "bg-box",
                    attributes: {
                      "bg-image": "https://posten.in/wp-content/uploads/2022/07/PreTens.jpg",
                    },
                    components: [{
                      type: "card-body",
                      attributes: {
                        "mobile-height": "100%",
                      },
                      classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                      components: [

                        {
                          type: "flex",
                          attributes: {
                            flexDirection: "flex-col",
                            flexDirectionDesktop: "md:flex-col",
                            wrap: "no-wrap",
                            gap: "gap-2",
                            alignItems: "items-start",
                            alignContent: "content-start",
                            justifyContent: "justify-between",
                            attributes: {
                              "mobile-height": "100%",
                            },
                          },
                          components: [
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-2",
                                alignItems: "items-start",
                                alignContent: "content-start",
                                justifyContent: "justify-start",
                              },
                              components: [
                                {
                                  type: "badge",
                                  content: "Bridges"
                                },
                                {
                                  type: "badge",
                                  content: "Buildings"
                                },
                              ]
                            },

                            {
                              type: "spacer",
                              attributes: {
                                "mobile-height": "58px",
                              }
                            },

                            {
                              type: "content-heading",
                              content: "Pre Tensioning"
                            },
                            {
                              type: "text-content",
                              content: `On Site Deployment of Pre-Tensioning`
                            },
                            {
                              type: "spacer",
                              attributes: {
                                "mobile-height": "8px",
                              }
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Consideration of Overall Project",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Design & Specification of Tension Lines",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Deployment of Ducts & Tendons",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Pre-Tensioning",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ],
                    }]
                  },

                ],
              },
              {
                type: "card",
                attributes: {
                  background: "false",
                  bordered: "false"
                },

                components: [
                  {
                    type: "bg-box",
                    attributes: {
                      "bg-image": "https://posten.in/wp-content/uploads/2022/07/Posy.jpg",
                    },
                    components: [{
                      type: "card-body",
                      attributes: {
                        "mobile-height": "100%",
                      },
                      classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                      components: [

                        {
                          type: "flex",
                          attributes: {
                            flexDirection: "flex-col",
                            flexDirectionDesktop: "md:flex-col",
                            wrap: "no-wrap",
                            gap: "gap-2",
                            alignItems: "items-start",
                            alignContent: "content-start",
                            justifyContent: "justify-between",
                            attributes: {
                              "mobile-height": "100%",
                            },
                          },
                          components: [
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-2",
                                alignItems: "items-start",
                                alignContent: "content-start",
                                justifyContent: "justify-start",
                              },
                              components: [
                                {
                                  type: "badge",
                                  content: "Bridges"
                                },
                                {
                                  type: "badge",
                                  content: "Buildings"
                                },
                                {
                                  type: "badge",
                                  content: "Flyovers"
                                },
                              ]
                            },

                            {
                              type: "spacer",
                              attributes: {
                                "mobile-height": "58px",
                              }
                            },

                            {
                              type: "content-heading",
                              content: "Post Tensioning"
                            },
                            {
                              type: "text-content",
                              content: `On Site Deployment of Post-Tensioning`
                            },
                            {
                              type: "spacer",
                              attributes: {
                                "mobile-height": "8px",
                              }
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Design & Specification of Ducts",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Deployment of Ducts & Tendons",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Post-Tensioning",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            },
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-row",
                                flexDirectionDesktop: "md:flex-row",
                                wrap: "flex-wrap",
                                gap: "gap-4",
                                alignItems: "items-center",
                                alignContent: "content-center",
                                justifyContent: "justify-start"
                              },
                              components: [
                                {

                                  type: "icon",
                                  content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m2.394 13.742 4.743 3.62 7.616-8.704-1.506-1.316-6.384 7.296-3.257-2.486zm19.359-5.084-1.506-1.316-6.369 7.279-.753-.602-1.25 1.562 2.247 1.798z"></path></svg>',
                                  attributes: {
                                    "mobile-width": "18px",
                                  }
                                },
                                {
                                  type: "text-content",
                                  content: "Grouting",
                                  attributes: {
                                    class: "m-0"
                                  }
                                }
                              ]
                            }
                          ]
                        }
                      ],
                    }]
                  },

                ],
              },

            ]
          }

        ],
      }]
    },
    media: ``
  });
  // bm.add("contact-form-section", {
  //   label: "Contact Section",
  //   defaulttheme: true,
  //   sectionblocks: true,
  //   content: {
  //     type: "section",
  //     attributes: {
  //       id: `contact`,
  //     },
  //     components: [{
  //       type: "container",
  //       components: [
  //         {
  //           type: "flex",
  //           attributes: {
  //             flexDirection: "flex-col",
  //             flexDirectionDesktop: "md:flex-col",
  //             wrap: "no-wrap",
  //             gap: "gap-4",
  //             alignItems: "items-start",
  //             alignContent: "content-start",
  //             justifyContent: "justify-start",

  //           },
  //           components: [
  //             {
  //               type: "badge",
  //               content: "Get in Touch"
  //             },
  //             {
  //               type: "content-heading",
  //               content: "For Manufacturers, Contractors, Engineers & Suppliers in Pre-Stressing"
  //             }
  //           ]

  //         },
  //         {
  //           type: "spacer",
  //           attributes: {
  //             "mobile-height": "48px",
  //           }
  //         },
  //         {
  //           type: "flex",
  //           attributes: {
  //             flexDirection: "flex-col",
  //             flexDirectionDesktop: "md:flex-row",
  //             wrap: "no-wrap",
  //             gap: "gap-8",
  //             alignItems: "items-start",
  //             alignContent: "content-start",
  //             justifyContent: "justify-between"
  //           },
  //           components: [
  //             {
  //               type: "flex",
  //               attributes: {
  //                 flexDirection: "flex-col",
  //                 flexDirectionDesktop: "md:flex-col",
  //                 wrap: "no-wrap",
  //                 gap: "gap-8",
  //                 alignItems: "items-start",
  //                 alignContent: "content-start",
  //                 justifyContent: "justify-start",
  //                 "desktop-width": "46%",
  //               },
  //               components: [

  //                 {
  //                   type: "grid-layout",
  //                   attributes: {
  //                     desktopColumns: "grid-cols-1",
  //                     mobileColumns: "grid-cols-1",
  //                     "mobile-width": "100%",
  //                     gap: "gap-4",
  //                   },
  //                   components: [

  //                     {
  //                       type: "card",
  //                       attributes: {
  //                         background: "true",
  //                         bordered: "false"
  //                       },
  //                       components: [
  //                         {
  //                           type: "card-body",
  //                           components: [
  //                             {
  //                               type: "flex",
  //                               attributes: {
  //                                 flexDirection: "flex-col",
  //                                 flexDirectionDesktop: "md:flex-col",
  //                                 wrap: "no-wrap",
  //                                 gap: "gap-4",
  //                                 alignItems: "items-start",
  //                                 alignContent: "content-start",
  //                                 justifyContent: "justify-start",
  //                               },
  //                               components: [
  //                                 {
  //                                   type: "icon",
  //                                   content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M288 39.056v16.659c0 10.804 7.281 20.159 17.686 23.066C383.204 100.434 440 171.518 440 256c0 101.689-82.295 184-184 184-101.689 0-184-82.295-184-184 0-84.47 56.786-155.564 134.312-177.219C216.719 75.874 224 66.517 224 55.712V39.064c0-15.709-14.834-27.153-30.046-23.234C86.603 43.482 7.394 141.206 8.003 257.332c.72 137.052 111.477 246.956 248.531 246.667C393.255 503.711 504 392.788 504 256c0-115.633-79.14-212.779-186.211-240.236C302.678 11.889 288 23.456 288 39.056z"></path></svg>',
  //                                   attributes: {
  //                                     "mobile-width": "60px",
  //                                     "icon-style": "icon-style-white-bg",
  //                                   }
  //                                 },
  //                                 {
  //                                   type: "content-heading",
  //                                   content: "Our Location"
  //                                 },
  //                                 {
  //                                   type: "text-content",
  //                                   content: "F02& F03, Silver Dale, F Road, Mahatma Nagar, Nashik 422 007 Maharashtra, India"
  //                                 }
  //                               ]
  //                             }
  //                           ],
  //                         }
  //                       ],
  //                     },
  //                     // Duplicate 4 more times
  //                     {
  //                       type: "card",
  //                       attributes: {
  //                         background: "true",
  //                         bordered: "false"
  //                       },
  //                       components: [
  //                         {
  //                           type: "card-body",
  //                           components: [
  //                             {
  //                               type: "flex",
  //                               attributes: {
  //                                 flexDirection: "flex-col",
  //                                 flexDirectionDesktop: "md:flex-col",
  //                                 wrap: "no-wrap",
  //                                 gap: "gap-4",
  //                                 alignItems: "items-start",
  //                                 alignContent: "content-start",
  //                                 justifyContent: "justify-start",
  //                               },
  //                               components: [
  //                                 {
  //                                   type: "icon",
  //                                   content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M372 160H12c-6.6 0-12 5.4-12 12v56c0 6.6 5.4 12 12 12h140v228c0 6.6 5.4 12 12 12h56c6.6 0 12-5.4 12-12V240h140c6.6 0 12-5.4 12-12v-56c0-6.6-5.4-12-12-12zm0-128H12C5.4 32 0 37.4 0 44v56c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12V44c0-6.6-5.4-12-12-12z"></path></svg>',
  //                                   attributes: {
  //                                     "mobile-width": "60px",
  //                                     "icon-style": "icon-style-white-bg",
  //                                   }
  //                                 },
  //                                 {
  //                                   type: "content-heading",
  //                                   content: "Call Us On"
  //                                 },
  //                                 {
  //                                   type: "text-content",
  //                                   content: "+ 91 0253 2357169 &nbsp;&nbsp; | &nbsp;&nbsp; + 91 98228 75353 ​"
  //                                 },
  //                               ]
  //                             }
  //                           ],
  //                         }
  //                       ],
  //                     },
  //                     {
  //                       type: "card",
  //                       attributes: {
  //                         background: "true",
  //                         bordered: "false"
  //                       },
  //                       components: [
  //                         {
  //                           type: "card-body",
  //                           components: [
  //                             {
  //                               type: "flex",
  //                               attributes: {
  //                                 flexDirection: "flex-col",
  //                                 flexDirectionDesktop: "md:flex-col",
  //                                 wrap: "no-wrap",
  //                                 gap: "gap-4",
  //                                 alignItems: "items-start",
  //                                 alignContent: "content-start",
  //                                 justifyContent: "justify-start",
  //                               },
  //                               components: [
  //                                 {
  //                                   type: "icon",
  //                                   content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M17 15l1.55 1.55c-.96 1.69-3.33 3.04-5.55 3.37V11h3V9h-3V7.82C14.16 7.4 15 6.3 15 5c0-1.65-1.35-3-3-3S9 3.35 9 5c0 1.3.84 2.4 2 2.82V9H8v2h3v8.92c-2.22-.33-4.59-1.68-5.55-3.37L7 15l-4-3v3c0 3.88 4.92 7 9 7s9-3.12 9-7v-3l-4 3zM12 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"></path></svg>',
  //                                   attributes: {
  //                                     "mobile-width": "60px",
  //                                     "icon-style": "icon-style-white-bg",
  //                                   }
  //                                 },
  //                                 {
  //                                   type: "content-heading",
  //                                   content: "Email us"
  //                                 },
  //                                 {
  //                                   type: "text-content",
  //                                   content: "info@posten.in &nbsp;&nbsp; | &nbsp;&nbsp; posten.india@gmail.com​"
  //                                 }
  //                               ]
  //                             }
  //                           ],
  //                         }
  //                       ],
  //                     },

  //                   ]
  //                 }
  //               ]
  //             },
  //             {
  //               type: "flex",
  //               attributes: {
  //                 flexDirection: "flex-col",
  //                 flexDirectionDesktop: "md:flex-col",
  //                 wrap: "flex-wrap",
  //                 gap: "gap-6",
  //                 alignItems: "items-stretch",
  //                 justifyContent: "justify-start",
  //               },
  //               components: [
  //                 {

  //                   type: "form-wrapper",
  //                   attributes: { "desktop-width": "100%" },
  //                 },
  //               ]
  //             }
  //           ]

  //         },




  //       ],
  //     }]
  //   },
  //   media: ``
  // });

  editor.BlockManager.add("contact-form-iframe", {
    label: "Contact Form (iframe)",
    defaulttheme: true,
    category: "Form",
    content: {
      type: "div",
      content: `<iframe style='width:100%;height:100%;border:none;' srcdoc='
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>
    <style>
      .iti { width: 100%; margin-top: 0.5rem; position: relative; border-bottom: 2px solid #e5e7eb; transition: border-color 0.2s ease-in-out; }
      .iti:focus-within { border-bottom-color: #000; }
      .iti__input { width: 100%; border: none; padding-top: 0.5rem; padding-bottom: 0.5rem; position: relative; z-index: 1; background: transparent; }
      .iti__input:focus { outline: none; box-shadow: none; }
      .iti--allow-dropdown .iti__input { padding-left: 56px; }
      .iti__flag-container { position: absolute; top: 0; bottom: 0; left: 0; z-index: 2; }
      .iti__selected-flag { background-color: transparent; display: flex; align-items: center; height: 100%; }
      .iti__country-list { z-index: 20; }
    </style>
  </head>
  <body class="bg-gray-50 flex items-center justify-center min-h-[min-content]">
    <div class="bg-white p-12 rounded-lg shadow-md w-full max-w-4xl">
      <form action="https://api.forms.bytesuite.io/r/i0skZsTXyWC" method="post">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-6">
          <div>
            <label for="name" class="text-xs font-semibold text-gray-500 uppercase">Your name</label>
            <input type="text" id="name" placeholder="Full name" name="name"
              class="mt-2 block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black py-2 placeholder-gray-400"
              required>
          </div>
          <div>
            <label for="email" class="text-xs font-semibold text-gray-500 uppercase">Email address</label>
            <input type="email" id="email" placeholder="Email Address" name="email"
              class="mt-2 block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black py-2 placeholder-gray-400"
              required>
          </div>
          <div>
            <label for="phone" class="text-xs font-semibold text-gray-500 uppercase">Phone No</label>
            <input type="tel" id="phone" placeholder="Phone No" name="phone"
              class="mt-2 block w-full border-0 border-b-1 border-gray-200 focus:ring-0 focus:border-black py-2 placeholder-gray-400"
              required>
          </div>
          <div>
            <label for="subject" class="text-xs font-semibold text-gray-500 uppercase">Subject</label>
            <input type="text" id="subject" placeholder="Subject" name="subject"
              class="mt-2 block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black py-2 placeholder-gray-400"
              required>
          </div>
          <div class="md:col-span-2">
            <label for="message" class="text-xs font-semibold text-gray-500 uppercase">Your message</label>
            <textarea id="message" rows="5" placeholder="Tell us about your enquiry" name="message"
              class="mt-2 block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black py-2 placeholder-gray-400 resize-none"
              required></textarea>
          </div>
        </div>
        <div class="mt-6 flex items-center">
          <input id="terms" name="terms" type="checkbox" value="true"
            class="h-4 w-4 text-black border-gray-300 rounded focus:ring-black">
          <label for="terms" class="ml-3 block text-sm text-gray-600">I am bound by the terms of the Service I accept Privacy Policy</label>
        </div>
        <div class="mt-8">
          <button type="submit"
            class="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black font-semibold">
            Send message
          </button>
        </div>
      </form>
    </div>
    <script>
      const phoneInputField = document.querySelector("#phone");
      const phoneInput = window.intlTelInput(phoneInputField, {
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
      });
    </script>
  </body>
  </html>'>
  </iframe>
  `,
    }
  });

  bm.add("contact-form-section-2", {
    label: "Contact Section 2",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "section",
      attributes: {
        id: `contact`,
      },
      components: [{
        type: "container",
        components: [
          {
            type: "flex",
            attributes: {
              flexDirection: "flex-col",
              flexDirectionDesktop: "md:flex-col",
              wrap: "no-wrap",
              gap: "gap-4",
              alignItems: "items-start",
              alignContent: "content-start",
              justifyContent: "justify-start",

            },
            components: [
              {
                type: "badge",
                content: "Get in Touch"
              },
              {
                type: "content-heading",
                content: "For Manufacturers, Contractors, Engineers & Suppliers in Pre-Stressing"
              }
            ]

          },
          {
            type: "spacer",
            attributes: {
              "mobile-height": "48px",
            }
          },
          {
            type: "flex",
            attributes: {
              flexDirection: "flex-col",
              flexDirectionDesktop: "md:flex-row",
              wrap: "no-wrap",
              gap: "gap-8",
              alignItems: "items-start",
              alignContent: "content-start",
              justifyContent: "justify-between"
            },
            components: [
              {
                type: "flex",
                attributes: {
                  flexDirection: "flex-col",
                  flexDirectionDesktop: "md:flex-col",
                  wrap: "no-wrap",
                  gap: "gap-8",
                  alignItems: "items-start",
                  alignContent: "content-start",
                  justifyContent: "justify-start",
                  "desktop-width": "46%",
                },
                components: [

                  {
                    type: "grid-layout",
                    attributes: {
                      desktopColumns: "grid-cols-1",
                      mobileColumns: "grid-cols-1",
                      "mobile-width": "100%",
                      gap: "gap-4",
                    },
                    components: [

                      {
                        type: "card",
                        attributes: {
                          background: "false",
                          bordered: "false"
                        },
                        components: [
                          {
                            type: "content-title",
                            content: "Get in touch"
                          },
                          {
                            type: "text-content",
                            content: "We are here to answer any question you may have. Feel free to reach via contact form."
                          }
                        ]
                      },

                    ]
                  }
                ]
              },
              {
                type: "flex",
                attributes: {
                  flexDirection: "flex-col",
                  flexDirectionDesktop: "md:flex-col",
                  wrap: "flex-wrap",
                  gap: "gap-6",
                  alignItems: "items-stretch",
                  justifyContent: "justify-start",
                },
                components: [
                  {

                    type: "form-wrapper",
                    attributes: { "desktop-width": "100%" },
                  },
                ]
              }
            ]

          },




        ],
      }]
    },
    media: ``
  });
  bm.add("contact-hero-section", {
    label: "Contact Hero Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "hero-section-bg",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
        "bg-image": "https://buildgo.nextwpcook.com/wp-content/uploads/2024/09/breadcrumb.jpg",
        "hero-section-height": "410px"
      },
      components: [
        {
          type: "hero-section-container", components: [
            {
              type: "flex",
              attributes: {
                flexDirection: "flex-col",
                flexDirectionDesktop: "md:flex-col",
                wrap: "flex-wrap",
                gap: "gap-2",
                alignItems: "items-center",
                alignContent: "content-center",
                justifyContent: "justify-center",
                "mobile-height": "100%"
              },
              components: [
                {
                  type: "content-title",
                  content: "Contact Us"
                },
                {
                  type: "content-subtitle",
                  content: "We are happy to connect anytime"
                }
              ]
            }
          ]
        }
      ],
    },
    media: ``
  });
  bm.add("main-hero-section", {
    label: "Main Hero Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "hero-section-bg",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
        "bg-image": "https://posten.in/wp-content/uploads/2023/01/download.jpg",
      },
      components: [
        {
          type: "hero-section-container", components: [
            {
              type: "flex",
              attributes: {
                flexDirection: "flex-col",
                flexDirectionDesktop: "md:flex-col",
                wrap: "flex-wrap",
                gap: "gap-2",
                alignItems: "items-end",
                alignContent: "content-start",
                justifyContent: "justify-between",
                "mobile-height": "100%"
              },
              components: [
                {
                  type: "spacer",
                  attributes: {
                    "mobile-height": "236px",
                  }
                },
                {
                  type: "flex",
                  attributes: {
                    flexDirection: "flex-col",
                    flexDirectionDesktop: "md:flex-row",
                    wrap: "flex-wrap",
                    gap: "gap-8",
                    alignItems: "items-end",
                    alignContent: "content-end",
                    justifyContent: "justify-between",
                    "mobile-width": "100%"
                  },
                  components: [
                    {
                      type: "flex",
                      attributes: {
                        flexDirection: "flex-col",
                        flexDirectionDesktop: "md:flex-col",
                        wrap: "flex-wrap",
                        gap: "gap-4",
                        alignItems: "items-start",
                        alignContent: "content-start",
                        justifyContent: "justify-start",
                      },
                      components: [
                        {
                          type: "hero-text-title",
                          content: "Your Reliable Partner in Pre-stressing"
                        },
                        {
                          type: "hero-text-subtitle",
                          content: "Variety of needs under one roof."
                        }
                      ]
                    },
                    {
                      type: "button-secondary",
                      components: [{
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-4",
                          alignItems: "items-center",
                          alignContent: "content-center",
                          justifyContent: "justify-between"
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Learn More",
                            attributes: {
                              class: "m-0"
                            }
                          },
                          {

                            type: "icon",
                            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"></path></svg>',
                            attributes: {
                              "mobile-width": "18px",
                            }
                          },

                        ]
                      },]
                    }

                  ]
                },

              ]
            }
          ]
        }
      ],
    },
    media: ``
  });
  bm.add("about-hero-section", {
    label: "About Hero Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "hero-section-bg",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
        "bg-image": "https://posten.in/wp-content/uploads/2022/07/Night-1-2.png",
      },
      components: [
        {
          type: "hero-section-container", components: [
            {
              type: "flex",
              attributes: {
                flexDirection: "flex-col",
                flexDirectionDesktop: "md:flex-col",
                wrap: "flex-wrap",
                gap: "gap-2",
                alignItems: "items-start",
                alignContent: "content-start",
                justifyContent: "justify-center",
                "mobile-height": "100%"
              },
              components: [
                {
                  type: "content-title",
                  content: "About Us"
                },
                {
                  type: "content-subtitle",
                  content: "Products and Services for all pre-stressing operations"
                }
              ]
            }
          ]
        }
      ],
    },
    media: ``
  });
  bm.add("services-hero-section", {
    label: "About Hero Section",
    defaulttheme: true,
    sectionblocks: true,
    content: {
      type: "hero-section",
      attributes: {
        id: `section-${Math.random().toString(36).substr(2, 8)}`,
        "section-type": "section-dark"
      },
      components: [
        {
          type: "hero-section-container", components: [
            {
              type: "flex",
              attributes: {
                flexDirection: "flex-col",
                flexDirectionDesktop: "md:flex-col",
                wrap: "flex-wrap",
                gap: "gap-2",
                alignItems: "items-end",
                alignContent: "content-start",
                justifyContent: "justify-between",
                "mobile-height": "100%"
              },
              components: [
                {
                  type: "spacer",
                  attributes: {
                    "mobile-height": "48px",
                  }
                },
                {
                  type: "flex",
                  attributes: {
                    flexDirection: "flex-col",
                    flexDirectionDesktop: "md:flex-row",
                    wrap: "flex-wrap",
                    gap: "gap-8",
                    alignItems: "items-end",
                    alignContent: "content-end",
                    justifyContent: "justify-between",
                    "mobile-width": "100%"
                  },
                  components: [
                    {
                      type: "flex",
                      attributes: {
                        flexDirection: "flex-col",
                        flexDirectionDesktop: "md:flex-col",
                        wrap: "flex-wrap",
                        gap: "gap-4",
                        alignItems: "items-start",
                        alignContent: "content-start",
                        justifyContent: "justify-start",
                      },
                      components: [
                        {
                          type: "content-title",
                          content: "Our Services"
                        },
                        {
                          type: "content-subtitle",
                          attributes: {
                            "desktop-width": "600px"
                          },
                          content: "With decades of sustained experience, we have been successfully delivering infrastructure solutions to both government and private clients."
                        }
                      ]
                    },
                    {
                      type: "button-secondary",
                      components: [{
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-4",
                          alignItems: "items-center",
                          alignContent: "content-center",
                          justifyContent: "justify-between"
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Book A Visit",
                            attributes: {
                              class: "m-0"
                            }
                          },
                          {

                            type: "icon",
                            content: '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5z"></path></svg>',
                            attributes: {
                              "mobile-width": "18px",
                            }
                          },

                        ]
                      },]
                    }

                  ]
                },

              ]
            }
          ]
        }
      ],
    },
    media: ``
  });

  bm.add("gallery-grid2", {
    label: "Gallery Grid 2",
    category: "Visuals",
    defaulttheme: true,
    media: "https://byte-ai.s3.us-east-1.amazonaws.com/preview/gallery-grid.png",
    content: {
      type: "masonry-grid",
      components: [
        {
          type: "card",
          attributes: {
            background: "false",
            bordered: "false",
            "mobile-height": "300px",
            "desktop-height": "320px"

          },

          components: [
            {
              type: "bg-box",
              attributes: {
                "bg-overlay": "top-gradient",
                "bg-image": "https://posten.in/wp-content/uploads/2022/12/0-Post-tensioned-I-Girders.jpeg",
              },
              components: [{
                type: "card-body",
                attributes: {
                  "mobile-height": "100%",
                },
                classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                components: [

                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-between",
                      attributes: {
                        "mobile-height": "100%",
                      },
                    },
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-2",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Post-tensioned I-Girders"
                          },
                        ]
                      },
                    ]
                  }
                ],
              }]
            },

          ],
        },
        {
          type: "card",
          attributes: {
            background: "false",
            bordered: "false",
            "mobile-height": "300px",
            "desktop-height": "200px"
          },

          components: [
            {
              type: "bg-box",
              attributes: {
                "bg-overlay": "top-gradient",
                "bg-image": "https://posten.in/wp-content/uploads/2022/12/0-Segmental-Post-tensioned-Box-Girders.jpeg",
              },
              components: [{
                type: "card-body",
                attributes: {
                  "mobile-height": "100%",
                },
                classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                components: [

                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-between",
                      attributes: {
                        "mobile-height": "100%",
                      },
                    },
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-2",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Segmental Post-tensioned Box Girders "
                          },
                        ]
                      },
                    ]
                  }
                ],
              }]
            },

          ],
        },
        {
          type: "card",
          attributes: {
            background: "false",
            bordered: "false",
            "mobile-height": "300px",
            "desktop-height": "252px"
          },

          components: [
            {
              type: "bg-box",
              attributes: {
                "bg-overlay": "top-gradient",
                "bg-image": "https://posten.in/wp-content/uploads/2022/12/0-Post-tensioning-of-Pier-Caps-Pre-tensioning-of-U-Girderss.jpeg",
              },
              components: [{
                type: "card-body",
                attributes: {
                  "mobile-height": "100%",
                },
                classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                components: [

                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-between",
                      attributes: {
                        "mobile-height": "100%",
                      },
                    },
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-2",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Post-tensioning of Pier Caps"
                          },
                        ]
                      },
                    ]
                  }
                ],
              }]
            },

          ],
        },
        {
          type: "card",
          attributes: {
            background: "false",
            bordered: "false",
            "mobile-height": "300px",
            "desktop-height": "370px"
          },

          components: [
            {
              type: "bg-box",
              attributes: {
                "bg-overlay": "top-gradient",
                "bg-image": "https://posten.in/wp-content/uploads/2022/12/0-Flat-Slab-Post-tensioning-for-Commercial-Buildings.jpeg",
              },
              components: [{
                type: "card-body",
                attributes: {
                  "mobile-height": "100%",
                },
                classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                components: [

                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-between",
                      attributes: {
                        "mobile-height": "100%",
                      },
                    },
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-2",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Flat Slab Post-tensioning for Commercial Buildings"
                          },
                        ]
                      },
                    ]
                  }
                ],
              }]
            },

          ],
        },
        {
          type: "card",
          attributes: {
            background: "false",
            bordered: "false",
            "mobile-height": "300px",
            "desktop-height": "472px"
          },

          components: [
            {
              type: "bg-box",
              attributes: {
                "bg-overlay": "top-gradient",
                "bg-image": "https://posten.in/wp-content/uploads/2022/12/0-Post-tensioning-of-Pier-Caps-Pre-tensioning-of-U-Girdersm.jpeg",
              },
              components: [{
                type: "card-body",
                attributes: {
                  "mobile-height": "100%",
                },
                classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                components: [

                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-between",
                      attributes: {
                        "mobile-height": "100%",
                      },
                    },
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-2",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Post-tensioning of Pier Caps & Pre-tensioning of U-Girders"
                          },
                        ]
                      },
                    ]
                  }
                ],
              }]
            },

          ],
        },
        {
          type: "card",
          attributes: {
            background: "false",
            bordered: "false",
            "mobile-height": "300px",
            "desktop-height": "774px"
          },

          components: [
            {
              type: "bg-box",
              attributes: {
                "bg-overlay": "top-gradient",
                "bg-image": "https://posten.in/wp-content/uploads/2022/12/0-Profiling-of-Round-Mettalic-Sheathing-Ducts.jpeg",
              },
              components: [{
                type: "card-body",
                attributes: {
                  "mobile-height": "100%",
                },
                classes: ["light-text", "z-10", "relative", "px-4", "py-6"],
                components: [

                  {
                    type: "flex",
                    attributes: {
                      flexDirection: "flex-col",
                      flexDirectionDesktop: "md:flex-col",
                      wrap: "no-wrap",
                      gap: "gap-2",
                      alignItems: "items-start",
                      alignContent: "content-start",
                      justifyContent: "justify-between",
                      attributes: {
                        "mobile-height": "100%",
                      },
                    },
                    components: [
                      {
                        type: "flex",
                        attributes: {
                          flexDirection: "flex-row",
                          flexDirectionDesktop: "md:flex-row",
                          wrap: "flex-wrap",
                          gap: "gap-2",
                          alignItems: "items-start",
                          alignContent: "content-start",
                          justifyContent: "justify-start",
                        },
                        components: [
                          {
                            type: "text-content",
                            content: "Profiling of Round Mettalic Sheathing Ducts"
                          },
                        ]
                      },
                    ]
                  }
                ],
              }]
            },

          ],
        },
      ]
    }
  });
  bm.add('hero-section-overlapping-card', {
    label: 'Hero Section',
    defaulttheme: true,
    sectionblocks: true,
    content: [{
      type: 'hero-section-bg',
      attributes: {
        id: 'section-n52xrolx',
        'bg-image': 'https://images.unsplash.com/photo-1606836591695-4d58a73eba1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2MjczNDh8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBtZWV0aW5nfGVufDB8fHx8MTc1NTExMDAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
      },
      components: [
        {
          type: "spacer",
          attributes: {
            "mobile-height": "560px",
            "mobile-width": "75%",
            "desktop-height": "36vh"
          }
        },
        {
          type: "overlap-container",
          attributes: {
            "desktop-width": "75%",
            "desktop-height": "530px",
            "mobile-height": "678px",
          },
          components: [
            {
              type: "flex",
              attributes: {
                flexDirection: "flex-col",
                flexDirectionDesktop: "md:flex-row",
                wrap: "no-wrap",
                gap: "no-gap",
                alignItems: "items-end",
                alignContent: "content-center",
                justifyContent: "justify-between",
                "mobile-height": "100%",

              },
              components: [
                // {
                //   type: "spacer",
                //   attributes: {
                //     "mobile-height": "236px",
                //   }
                // },
                {
                  type: "flex",
                  attributes: {
                    flexDirection: "flex-col",
                    flexDirectionDesktop: "md:flex-row",
                    wrap: "flex-wrap",
                    gap: "no-gap",
                    alignItems: "items-end",
                    alignContent: "content-end",
                    justifyContent: "justify-between",
                    "mobile-width": "100%",
                    "desktop-width": "50%"
                  },
                  components: [
                    {
                      type: "card",
                      attributes: {
                      },
                      components: [
                        {
                          type: "card-body",
                          classes: ["z-10", "relative", "px-4", "md:px-8", "py-6"],
                          components: [
                            {
                              type: "flex",
                              attributes: {
                                flexDirection: "flex-col",
                                flexDirectionDesktop: "md:flex-col",
                                wrap: "no-wrap",
                                gap: "gap-4",
                                alignItems: "items-start",
                                alignContent: "content-start",
                                justifyContent: "justify-start",
                              },
                              components: [
                                {
                                  type: "img-wrapper",
                                  attributes: {
                                    "mobile-width": "150px"
                                  },
                                  components: {
                                    type: "custom-image",
                                    attributes: {
                                      "src": "https://byte-ai.s3.us-east-1.amazonaws.com/013d2802-65bc-4bab-9488-874e52c80e20.png",
                                    }
                                  }
                                },
                                {
                                  type: "spacer",
                                  attributes: {
                                    "mobile-height": "24px",
                                  }
                                },
                                {
                                  type: "content-title",
                                  content: "Empowering Healthcare Businesses with Smart Global Solutions."
                                },

                                { type: "button-primary", content: "Work With Us" }

                              ]
                            }
                          ],
                        }
                      ],
                    },

                  ]
                },
                {
                  type: "img-wrapper",
                  attributes: {
                    "mobile-width": "60%",
                    "desktop-width": "50%",
                    "desktop-height": "100%",
                  },

                  components: {
                    type: "custom-image",
                    attributes: {
                      "src": "	https://byte-ai.s3.us-east-1.amazonaws.com/1ad2765d-eaa1-4c54-b271-ae902f0fdc90.png",

                    }
                  }
                },

              ]
            },

          ]
        }
      ],

    },
    {
      type: "section",
      components: [
        {
          type: "spacer",
          attributes: {
            "mobile-height": "286px",
            "mobile-width": "75%",
          }
        },
        {
          type: "container", attributes: { textalign: "center" }, components: [{
            type: "text-content",
            attributes: { textalign: "center" },
            content:
              "Section Content"
          }]
        }]
    }


    ]
  });

};

