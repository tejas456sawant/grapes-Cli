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
  bm.add("two-column-with-heading", {
    label: "2 Column w/ Heading",
    category: "Theme",
    content: {
      type: "section",
      "components": [
      {
        "attributes": {
          "desktop-width": "",
          "mobile-width": "",
          "textAlign": "center",
          "textalign": "left"
        },
        "classes": [
          "lg:max-w-5xl",
          "mx-auto",
          "flex",
          "flex-col",
          "gap-4",
          "px-3",
          "container",
          "text-left"
        ],
        "components": [
          {
            "attributes": {
              "desktop-width": "",
              "mobile-width": "",
              "textAlign": "center",
              "textalign": "left"
            },
            "classes": [
              "text-3xl",
              "max-w-xl",
              "lg:text-5xl",
              "mb-2",
              "font-bold",
              "capitalize",
              "font-heading",
              "text-left"
            ],
            "content": "Ready to Experience the Thrill?",
            "data-aos": "fade-up",
            "data-aos-duration": "1000",
            "data-aos-easing": "ease-in-out",
            "type": "content-title"
          },
          {
            "classes": [
              "h-4"
            ],
            "type": "spacer"
          },
          {
            "attributes": {
              "color": "textPrimarySectionText",
              "desktop-width": "",
              "mobile-width": "",
              "textAlign": "center",
              "textalign": "left"
            },
            "classes": [
              "mb-3",
              "para",
              "text-left"
            ],
            "content": "Schedule a test drive or visit our showroom to explore the Lamborghini dream.",
            "data-aos": "fade-up",
            "data-aos-delay": "200",
            "data-aos-duration": "1000",
            "data-aos-easing": "ease-in-out",
            "type": "text-content"
          },
          {
            "classes": [
              "h-8"
            ],
            "type": "spacer"
          },
          {
            "attributes": {
              "alignContent": "content-center",
              "alignItems": "items-center",
              "desktop-width": "",
              "flexDirection": "flex-row",
              "flexDirectionDesktop": "md:flex-row",
              "gap": "gap-4",
              "justifyContent": "center",
              "mobile-width": "",
              "wrap": "flex-wrap"
            },
            "classes": [
              "flex",
              "item-container",
              "flex-row",
              "md:flex-row",
              "flex-wrap",
              "gap-4",
              "items-center",
              "content-center",
              "center"
            ],
            "components": [
              {
                "attributes": {
                  "desktop-width": "",
                  "href": "#testdrive",
                  "mobile-width": ""
                },
                "classes": [
                  "button-primary",
                  "font-primary",
                  "relative",
                  "transition",
                  "flex",
                  "flex-row",
                  "justify-center",
                  "items-center",
                  "px-8",
                  "py-4",
                  "my-2"
                ],
                "content": "Schedule a Test Drive",
                "data-aos": "fade-up",
                "data-aos-delay": "300",
                "data-aos-duration": "1000",
                "data-aos-easing": "ease-in-out",
                "href": "",
                "type": "button-primary"
              },
              {
                "attributes": {
                  "desktop-width": "",
                  "href": "#showroom",
                  "mobile-width": ""
                },
                "classes": [
                  "button-secondary",
                  "font-primary",
                  "transition",
                  "flex",
                  "flex-row",
                  "justify-center",
                  "items-center",
                  "px-8",
                  "py-4",
                  "my-2"
                ],
                "content": "Visit Our Showroom",
                "data-aos": "fade-up",
                "data-aos-delay": "400",
                "data-aos-duration": "1000",
                "data-aos-easing": "ease-in-out",
                "type": "button-secondary"
              }
            ],
            "type": "flex"
          }
        ],
        "type": "container"
      }
    ],
    }
  });
  
};
