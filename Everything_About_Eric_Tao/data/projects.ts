export type ProjectCategory = "Frontend" | "UI/UX" | "Full-Stack" | "Docker"

export type Project = {
  id: number
  slug: string
  title: string
  description: string
  category: ProjectCategory
  image: string
  className: string
  detailedDescription: string
  technologies: string
  duration: string
  features: string[]
  additionalImages: string[]
  contentPath: string
}

export const projects: Project[] = [
  {
    id: 1,
    slug: "mobile-ui-framework",
    title: "Mobile UI Framework",
    description: "User interface architecture for food exchange application",
    category: "Frontend",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/iFoodie/WX20251212-203605.png",
    className: "w-[400px] h-[250px]",
    detailedDescription:
      "This mobile UI framework was designed to provide a seamless and intuitive user experience for a service-based application. It focuses on simplicity, accessibility, and scalability to accommodate various features and user needs.",
    technologies: "Figma, TailwindCSS",
    duration: "4 weeks",
    features: [
      "Modular component design",
      "Responsive layouts for various device sizes",
      "Customizable theming system",
      "Accessibility-first approach",
    ],
    additionalImages: [
      "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/iFoodie/Menu%20Page.png",
      "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/iFoodie/WX20251212-203605.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PLATES-rVTHgVnTltSIQgQsMfLfKyYkD7vJUI.png",
    ],
    contentPath: "/content/projects/mobile-ui-framework.mdx",
  },
  {
    id: 2,
    slug: "design-lab-branding",
    title: "Design Lab Branding",
    description: "Logo design for creative studio",
    category: "UI/UX",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/iFoodie/WX20251212-203632.png",
    className: "w-[350px] h-[220px]",
    detailedDescription:
      "The Design Lab logo was created to represent a creative studio that combines innovation with precision. The logo embodies the studio's core values of creativity, technology, and collaboration.",
    technologies: "Adobe Illustrator, Adobe InDesign",
    duration: "1 week",
    features: [
      "Versatile monogram design",
      "Scalable for various applications",
      "Color palette selection",
      "Typography integration",
    ],
    additionalImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    contentPath: "/content/projects/design-lab-branding.mdx",
  },
  {
    id: 3,
    slug: "sustainable-marketplace-platform",
    title: "Sustainable Marketplace Platform",
    description: "Frontend development with firebase backend project with user authentication",
    category: "Full-Stack",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/WechatIMG416.jpg",
    className: "w-[500px] h-[300px]",
    detailedDescription:
      "A modern e-commerce web app where users can upload, browse, and exchange products. Includes real-time chat, product gallery with zoom, authentication, and Firestore integration.",
    technologies: "React, D3.js, WebSocket, Three.js",
    duration: "6 weeks",
    features: [
      "Real-time new-released product status updates",
      "Real-time comment list function",
      "Navigator to seller's email",
      "Product searching and sorting",
    ],
    additionalImages: [
      "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/SustainableMarket/WechatIMG418.jpg",
      "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/SustainableMarket/WechatIMG423.jpg",
    ],
    contentPath: "/content/projects/sustainable-marketplace-platform.mdx",
  },
  {
    id: 4,
    slug: "real-time-chatbox",
    title: "Real-time chatbox",
    description: "Real-time messaging interface aimed for supporting customer seller communications",
    category: "Full-Stack",
    image: "https://i.pinimg.com/736x/00/12/f2/0012f2d4a49b01fcf1c47d9ae2c3dfaf.jpg",
    className: "w-[450px] h-[350px]",
    detailedDescription:
      "A real-time customer support chat experience built around Socket.io for instant message delivery, typing indicators, and presence updates. The UI prioritizes fast triage, clear conversation context, and smooth handoff between agents.",
    technologies: "Socket.io, Node.js, React, Figma",
    duration: "4 weeks",
    features: [
      "Socket.io event flow for live messaging and typing indicators",
      "Agent availability and presence status updates",
      "Message delivery/read states with lightweight acknowledgements",
      "Responsive layout with accessible contrast and keyboard navigation",
    ],
    additionalImages: ["https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/E2.png",
       "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/Chatbox/Enhanced.png",
       "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/Chatbox/Handshake.jpg"],
    contentPath: "/content/projects/real-time-chatbox.mdx",
  },
   {
    id: 5,
    slug: "Arknights-Resource-Planner",
    title: "Arknights Resource Planner",
    description: "A resource planning tool for the game Arknights",
    category: "Docker",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/Calculator/NewUI.jpg",
    className: "w-[450px] h-[350px]",
    detailedDescription:
      "A calculator and planner for managing in-game resources in Arknights. Users can input their current resources, set goals, and receive optimized farming plans to efficiently reach their targets.",
    technologies: "Java, Maven, Next.js, React, Jest, Docker",
    duration: "4 weeks",
    features: [
      "Real-time calculator on resource transactions and consumption",
      "Agent availability and presence status updates",
      "Message delivery/read states with lightweight acknowledgements",
      "Responsive layout with accessible contrast and keyboard navigation",
    ],
    additionalImages: ["https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/Calculator/clips.jpg",
       "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/Calculator/Result.jpg",
       "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/Chatbox/Handshake.jpg"],
    contentPath: "/content/projects/real-time-chatbox.mdx",
  },
]
