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
        components: [
          {
            type: "container", attributes: { textalign: "center" }, components: [{
              type: "text-content",
              attributes: { textalign: "center" },
              content:
                "Section Content"
            }]
          }
        ],
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



  bm.add("bg-box", {
    label: "Background",
    category: "Buttons",
    content: { type: "bg-box", content: "Button Text" }
  });
};
