import { CompassIcon, CreditCard, Layout, Files, LayoutDashboard, Receipt, Upload } from "lucide-react";

export const features = [
  {
    iconName: "ArrowUpCircle",
    iconColor: "text-purple-500",
    title: "Easy File Upload",
    description:
      "Quickly upload your files with our intuitive drag-and-drop interface.",
  },
  {
    iconName: "Shield",
    iconColor: "text-green-500",
    title: "Secure Storage",
    description:
      "Your files are encrypted and stored securely in our cloud infrastructure.",
  },
  {
    iconName: "Share2",
    iconColor: "text-purple-600",
    title: "Simple Sharing",
    description:
      "Share files with anyone using secure links that you control.",
  },
  {
    iconName: "CreditCard",
    iconColor: "text-orange-500",
    title: "Flexible Pricing",
    description:
      "Choose a pricing plan that fits your needs with transparent billing.",
  },
  {
    iconName: "FileText",
    iconColor: "text-red-500",
    title: "File Management",
    description:
      "Organize, preview and manage your files from any device.",
  },
  {
    iconName: "Clock",
    iconColor: "text-blue-500",
    title: "Transaction History",
    description:
      "View your past transactions and billing details.",
  },
];

export const pricingPlans = [
    {
        name: "free",
        price: "0",
        description: "Basic plan for getting started",
        features: [
            "5 file uploads",
            "Basic file sharing features",
            "7 days file retention",
            "email support",
        ],
        cta: "Get Started",
        Highlighted: false,
    },

    {
        name: "Premium",
        price: "500",
        description: "for individual users with larger needs",
        features: [
            "500 file uploads",
            "Advanced file sharing features",
            "30 days file retention",
            "Priority email support",
            "File analytics",
        ],
        cta: "Go Premium",
        Highlighted: true,
    },

    {
        name: "Ultimate",
        price: "2500",
        description: "for large teams and enterprises",
        features: [
            "5000 file uploads",
            "All advanced sharing features & team sharing",
            "Custom retention policies",
            "24/7 email support",
            "Advanced analytics and reporting",
            "API access",
        ],
        cta: "Get Ultimate",
        Highlighted: false,
    },
]

export const testimonials = [
  {
    name: "Alice Johnson",
    role: "Freelancer",
    company: "Self-Employed",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "CloudShare has transformed the way I manage my files. The upload process is seamless, and I love the security features.",
    rating: 5,
  },
  {
    name: "Michael Brown",
    role: "Startup Founder",
    company: "TechNova",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote:
      "The simple sharing feature is a game changer. I can securely share files with my team and clients without any hassle.",
    rating: 5,
  },
  {
    name: "Sophia Martinez",
    role: "UI/UX Designer",
    company: "Designify",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    quote:
      "I really appreciate the clean interface and fast uploads. CloudShare makes file management feel effortless.",
    rating: 4,
  },
  {
    name: "Daniel Wilson",
    role: "Project Manager",
    company: "BuildRight Solutions",
    image: "https://randomuser.me/api/portraits/men/76.jpg",
    quote:
      "Secure storage and flexible pricing were the main reasons we chose CloudShare. It has exceeded our expectations.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Software Engineer",
    company: "CodeSphere",
    image: "https://randomuser.me/api/portraits/women/21.jpg",
    quote:
      "CloudShare fits perfectly into our workflow. The performance is excellent, and the platform feels very reliable.",
    rating: 4,
  },
  {
    name: "Rahul Verma",
    role: "Digital Marketer",
    company: "GrowthLabs",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    quote:
      "Sharing large marketing files used to be painful. With CloudShare, everything is fast, secure, and easy to manage.",
    rating: 5,
  },
];

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon:LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "02",
    label: "Upload",
    icon: Upload,
    path: "/upload",
  },
  {
    id: "03",
    label: "My Files",
    icon: Files,
    path: "/my-files",
  },
  {
    id: "04",
    label: "Subscription",
    icon: CreditCard,
    path: "/subscription",
  },
  {
    id: "05",
    label: "Transactions",
    icon: Receipt,
    path: "/transactions",
  },
];