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
};
