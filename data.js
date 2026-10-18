/* =====================================================================
   data.js  —  THIS IS THE ONLY FILE YOU NEED TO EDIT
   ---------------------------------------------------------------------
   Everything shown on your website comes from the PORTFOLIO object below.
   main.js reads this object and builds the page from it.

   How to edit:
     - Change text inside the quotes "like this".
     - To add a project / job / link, copy one { ... } block, paste it
       after the last one, and put a comma between blocks.
     - To remove something, delete its whole { ... } block (and the comma).
     - Leave a field as "" (empty) or [] (empty list) to hide it.

   Common mistakes that break the page:
     - Missing comma between two { } blocks
     - Forgetting a closing quote "
     - Using a " inside text  ->  use ' instead, or write \"
   If the page goes blank, press F12 → Console to see which line is wrong.
   ===================================================================== */

const PORTFOLIO = {

  /* ---------- Basic info (shown at the top) ---------- */
  name: "Wai Men",
  role: "Game & Engine Programmer",
  tagline:
    "Engine and game programmer: I build the systems underneath, then use them to make games people play.",
  location: "Singapore",
  status: "Looking for a game client or engine programming internship",

  /* Shown as buttons in the top section. Leave url as "" to hide one. */
  links: {
    email: "wai.men.leong@gmail.com",          // TODO: your real email
    github: "https://github.com/waimen-leong", // TODO
    linkedin: "https://www.linkedin.com/in/leong-wai-men/", // TODO
    resume: "assets/resume.pdf"                 // put your PDF in /assets
  },

  /* ---------- About ---------- */
  about: [
    "I'm a Year 2 Computer Science (Real-Time Interactive Simulation) student at DigiPen Institute of Technology Singapore.",
    "Most of my time goes into engine architecture: how entities, components and systems talk to each other, how scripts plug into C++, and how an editor turns that into something designers can use. I like problems where the bug is three systems away from the symptom."
  ],

  /* ---------- Projects ----------
     category: "engine" | "graphics" | "gameplay"
       (controls the coloured marker; colours match X/Y/Z gizmo axes)
     media:
       { type: "youtube", id: "VIDEO_ID" }   ← the part after watch?v=
       { type: "image",   src: "assets/senki.png" }
       null                                   ← no media
  */
  projects: [
    {
      title: "Umapyoi Engine",
      category: "engine",
      role: "Tech Lead & Engine Champion, team of 7",
      period: "GAM200 / GAM250 (6months)",
      summary:
        "Custom C++ engine built on an ECS architecture, with OpenGL rendering, Lua scripting through Sol2, an ImGui editor, FMOD audio and PlayFab cloud services.",
      highlights: [
        "Wrote the ECS core: EntityManager, ComponentArray, SystemManager and Coordinator, later moved to view-based system patterns",
        "Lua scripting with Sol2: multiple scripts per entity, inspector-exposed variables, hot reloading and collision event callbacks",
        "Swept-AABB collision with spatial hashing, fixed 60 Hz timestep and multi-shape colliders",
        "Prefab system with two-pass loading, property overrides and nested hierarchies",
        "Undo/redo from JSON entity snapshots, plus a tilemap editor with runtime collision generation"
      ],
      tech: ["C++", "OpenGL", "Lua / Sol2", "ImGui", "PlayFab", "RapidJSON"],
      links: [
        { label: "Source on GitHub", url: "https://github.com/Siestasies/UmapyoiEngine" }
      ],
      media: { type: "image", src: "assets/uma_engine/sc1.png" }
    },
    {
      title: "Senki",
      category: "gameplay",
      role: "Engine & enemy AI",
      period: "Built on Umapyoi Engine (6months)",
      summary:
        "2D top-down hack-and-slash set in mythological feudal Japan. A lone warrior fuses fire, water and wind abilities to defeat a demon.",
      highlights: [
        "Cloud database through Playfab",
        "controller input support",
        "Enemy AI behaviour",
        "Overall debugging"
      ],
      tech: ["C++", "Lua", "playfab", "json"],
      links: [
        { label: "Game", url: "https://drive.google.com/file/d/11YZPx1PwK7LOcOR-0EFIoA0tadWIr67W/view?usp=sharing" }
      ],
      media: { type: "image", src: "assets/senki/sc2.png" }
    },
    {
      title: "Droom",
      category: "gameplay",
      role: "Path finding and Frontend",
      period: "GAM100 (3months)",
      summary:
        "A Doom-style first-person shooter rendered in 2.5D with raycasting. The 3D view is built entirely from a 2D grid map, one screen column at a time.",
      highlights: [
        "Wave system controlling enemy spawns, wave progression and difficulty scaling",
        "Grid-based enemy pathfinding with A* so enemies navigate the map to reach the player",
        "Game UI: HUD for health and ammo, wave counter, and menu screens"
      ],
      tech: ["C++"],
      links: [
        { label: "Game", url: "https://drive.google.com/file/d/1NZi_sDUouOG3Rsj3D1OXAVRvwAyOr0JO/view?usp=sharing" }
      ],
      media: { type: "youtube", id: "Nwifpq_tkoA" }
    },
    {
      title: "Multi-pass Rendering Pipeline",
      category: "graphics",
      role: "Solo",
      period: "",
      summary:
        "School assignment project consists of a stack of render passes composited into a stylised final image, plus a set of GLSL experiments.",
      highlights: [
        "Blinn-Phong lighting, Gaussian blur, Sobel edge detection and cartoon shading feeding a composite pass",
        "Doom-style raycasting renderer and portal/tunnel effects in GLSL",
        "Mesh subdivision into spatial grids for occlusion culling (in progress)"
      ],
      tech: ["C++", "OpenGL", "GLSL", "GLM"],
      links: [],
      media: null
    }
  ],

  /* ---------- Skills (group name : list) ---------- */
  skills: [
    { group: "Languages", items: ["C++", "C#", "Lua", "GLSL", "JavaScript"] },
    { group: "Engine", items: ["ECS architecture", "Scripting bindings", "Serialization", "Editor tooling", "Collision & physics"] },
    { group: "Graphics", items: ["OpenGL", "Shaders", "Culling", "Instancing", "BVH / spatial hashing"] },
    { group: "Tools & libs", items: ["ImGui", "Sol2", "FMOD", "PlayFab", "GLFW", "Git"] }
  ],

  /* ---------- Education / experience timeline (newest first) ---------- */
  timeline: [
    {
      title: "BSc Computer Science in Real-Time Interactive Simulation",
      place: "DigiPen Institute of Technology Singapore",
      period: "Expected Sept 2028"
    },
    {
      title: "Game Developer",
      place: "Metascape City",
      period: ""
    },
    {
      title: "Diploma in Game Development and Technology",
      place: "Nanyang Polytechnic",
      period: "2022"
    }
  ]
};
