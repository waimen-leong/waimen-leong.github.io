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
     category: "engine" | "graphics" | "gameplay" | "software"
       (controls the coloured marker; colours match X/Y/Z gizmo axes)
     media:
       { type: "youtube", id: "VIDEO_ID" }   ← the part after watch?v=
       { type: "image",   src: "assets/senki.png" }
       null                                   ← no media
  */
  projects: [
    
    {
      title: "AnytimeReno",
      category: "software",
      role: "Tech Lead & Engine Champion, team of 7",
      period: "GAM300 (ongoing)",
      summary:
        "(WIP) Accessible interior planning for homeowners and residents",
      highlights: [
        "Data-driven 2D floor plan editor: edits mutate plan data, dirty-flag rebuild over pooled LineRenderers",
        "Runtime glTF (.glb) streaming into Unity WebGL via glTFast",
        "Auth: Argon2 password hashing, hashed session tokens, nginx per-route rate limiting, Turnstile CAPTCHA overlay on WebGL canvas",
        "Load-tested with k6: 4x less CPU per request, ~724 req/s at 800 concurrent users with 0% errors",
        "Node.js API + MariaDB in Docker Compose behind nginx/HTTPS, with SQL migrations and automated backups",
        "Per-user project & model storage with UUID-keyed assets and thumbnails, owner-scoped uploads",
        "CI/CD: GitHub Actions self-hosted runner builds WebGL; API shipped as container image to the VM"
      ],
      tech: ["C#", "Unity", "Node.js", "MariaDB", "Docker", "Nginx", "GitHub Actions", "glTF"],
      links: [{ label: "Website", url: "https://team35.dp-ext8.com/" }],
      media: { type: "image", src: "assets/anytimereno/sc1.png" },
      // Case study fields: tag, problem, constraint, tested, failed, changed, result.
      // Leave any field "" to hide that row. Delete the whole caseStudy block to hide it.
      // caseStudy can also be a list [ {...}, {...} ] to show several parts.
      caseStudy: [
        {
          tag: "Constrained: security",
          problem:
            "Bots could hit the register page and create masses of fake accounts, and every account holds private floor plans and uploaded models. First backend I've built where security was a real requirement.",
          constraint:
            "The client is Unity WebGL, so everything in the browser is public and nothing it sends can be trusted. A normal CAPTCHA widget can't render inside a WebGL canvas.",
          tested: // VERIFY: how did you check it worked?
            "",
          failed: // VERIFY: anything that didn't work first time? (e.g. the CAPTCHA inside the canvas)
            "",
          changed:
            "Cloudflare Turnstile on the register page, rendered as an HTML overlay on top of the WebGL canvas. nginx per-IP rate limits per route (register 3/min, login 10/min, API 10/s). Passwords hashed with Argon2, and session tokens stored hashed so a database leak doesn't hand out live sessions. Assets keyed by UUID and every upload checked against its owner.",
          result:
            "Mass sign-ups are blocked by the CAPTCHA and capped at 3 per minute per IP. Argon2 made stored passwords expensive to crack, but it also made every login CPU-heavy, which became the capacity problem below."
        },
        {
          tag: "Constrained: capacity",
          problem:
            "We didn't know how many people the server could handle at once, or what would break first.",
          constraint:
            "One school VM: 2 CPU cores, 3.7 GB RAM, a single Node.js process. Argon2 hashing is deliberately CPU-heavy and competes with every other request on those 2 cores.",
          tested:
            "Load-tested the live server with k6: fixed numbers of virtual users (100 to 800) hitting the model catalogue and the login endpoint, with docker stats open to watch per-container CPU and memory. Ran login and catalogue floods at the same time to see if one starved the other.",
          failed:
            "At 400 users the catalogue's p95 latency hit 5.7 s with timeouts, at ~5.5 ms of CPU per request (a ceiling of ~180 req/s). A login flood let Argon2 take both cores, slowing every other endpoint. The test itself also got blocked by our own rate limits until the nginx limit zones were re-keyed and the container restarted.",
          changed:
            "Cached the public model catalogue in memory, enabled nginx-to-Node keepalive, capped Argon2 to 1 hash at a time behind a 100-slot queue (503 + Retry-After past that), and gave each container a memory limit so one crash can't take the stack down.",
          result:
            "CPU per request dropped about 4x (5.5 ms to 1.3 ms). The catalogue now serves ~724 req/s at 800 users with 0% errors, and p95 at 400 users fell from 5.7 s to 39 ms. During a 100-user login flood the catalogue held 29 ms p95, unaffected. Estimated capacity is ~1,200 to 1,700 concurrent users, limited by bandwidth for the WebGL download, not the API."
        }
      ]
    },
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
        { label: "Source on GitHub", url: "https://github.com/waimen-leong/GAM200-250_UmapyoiEngine" },
        { label: "Release", url: "https://drive.google.com/file/d/1D6a6KMbOL1d4_uWAjAhwrerCR3GEBXKS/view?usp=sharing" }
      ],
      media: { type: "image", src: "assets/uma_engine/sc1.png" },
      caseStudy: {
        tag: "Flagship",
        problem:
          "Senki needed designers to build levels out of reusable pieces: an enemy prefab, a room prefab full of enemies, then many rooms in a scene, each tweaked slightly. That meant an ECS that could support nested prefabs and prefab instances inside scenes.",
        constraint:
          "First time building an ECS or a prefab system. Written from scratch in C++ over two semesters while the team was building Senki on top of it, so any engine change could break the game in progress.",
        tested: 
          "Built single-layer prefabs first, then nested them (prefabs inside prefabs) and placed instances in scenes, saving and reloading to check every value came back as set.",
        failed:
          "Single-layer prefabs worked fine. Once prefabs were nested more than one layer deep, their data started overwriting each other, and with several layers applying values to the same entity it was very hard to trace which layer was doing the overwriting.",
        changed: 
          "Split loading into two passes: create every entity first, then resolve hierarchy and apply overrides in a fixed order, from the innermost prefab out to the scene. Instances store a link to their prefab plus only the properties that differ, so each value has one clear owner.",
        result: 
          "Senki shipped on the engine, with levels assembled from nested prefabs by the whole team, not just programmers."
      }
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
        { label: "Source on GitHub", url: "https://github.com/waimen-leong/GAM200-250_UmapyoiEngine" },
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
        
        { label: "Source on GitHub", url: "https://github.com/waimen-leong/GAM100_DROOM" },
        { label: "Game", url: "https://drive.google.com/file/d/1NZi_sDUouOG3Rsj3D1OXAVRvwAyOr0JO/view?usp=sharing" }
      ],
      media: { type: "youtube", id: "Nwifpq_tkoA" },
      caseStudy: {
        tag: "Skill: A* pathfinding",
        problem:
          "Enemies in a raycast 2.5D world have to chase the player through corridors, not walk straight into walls.",
        constraint:
          "First-year project in plain C++, no engine. Pathfinding had to run on the same 2D grid the raycaster draws from, every frame, for every enemy in a wave.",
        tested: 
          "Grid A* with a Manhattan heuristic, checked with growing waves of enemies to see how it held up as the enemy count scaled.",
        failed: 
          "Recomputing every enemy's path every frame was wasteful, and enemies following identical paths bunched into one tile.",
        changed: 
          "Paths are recalculated only when the player moves to a new grid cell, and enemies spawn from different points so they approach from different directions.",
        result:
          "Enemies reliably navigate the map in every wave. The most fun project we've made: small scope, no stress, and room to play with the design."
      }
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
    { group: "Languages", items: ["C++", "C#", "C", "Lua", "GLSL", "MySQL"] },
    { group: "Engine", items: ["ECS architecture", "Scripting bindings", "Serialization", "Editor tooling", "Collision & physics"] },
    { group: "Graphics", items: ["OpenGL", "Shaders", "Culling", "Instancing", "BVH / spatial hashing"] },
    { group: "Tools & libs", items: ["ImGui", "Sol2", "FMOD", "PlayFab", "GLFW", "Git", "Docker", "Nginx"] }
  ],

  /* ---------- Education / experience timeline (newest first) ---------- */
  timeline: [
    {
      title: "BSc Computer Science in Real-Time Interactive Simulation",
      place: "DigiPen Institute of Technology Singapore",
      period: "Aug 2024 - Sept 2028"
    },
    {
      title: "Game Developer",
      place: "Metascape City",
      period: "May 2022 - Aug 2022"
    },
    {
      title: "Diploma in Game Development and Technology",
      place: "Nanyang Polytechnic",
      period: "April 2019 - Mar 2022"
    }
  ]
};
