
export interface CardData {
    id: number;
    title: string;
    description: string;
    image?: string;
    video?: string;
    color: string;
    accentColor: string;
}

export const CARDS_DATA: CardData[] = [
    {
        id: 1,
        title: "Artistic Vision",
        description: "Una exploración profunda de la estética minimalista y el diseño contemporáneo.",
        image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200",
        color: "#000000",
        accentColor: "rgba(0, 0, 0, 0.4)"
    },
    {
        id: 2,
        title: "Sumérgete en el mundo de la Realidad Aumentada",
        description: "Somos capaces de ayudarte a crear estas experiencias",
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800",
        video: "https://res.cloudinary.com/dztibxp9k/video/upload/q_auto,vc_auto/v1769144503/Screenrecorder-2026-01-22-16-05-13-400_2_ygqxun.mp4",
        color: "#FF0032",
        accentColor: "rgba(255, 0, 48, 0.4)"
    },
    {
        id: 3,
        title: "Digital Ecosystem",
        description: "Estilos de vanguardia que cubren tus sentidos",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
        video: "https://res.cloudinary.com/dztibxp9k/video/upload/q_auto,vc_auto/v1769144514/tu_iburin3_2_ceknni.mp4",
        color: "#0084FF",
        accentColor: "rgba(0, 132, 255, 0.4)"
    },
    {
        id: 4,
        title: "Visión en Realidad Aumentada",
        description: "Sumérgete en tus proyectos",
        image: "https://res.cloudinary.com/dztibxp9k/image/upload/v1767597149/ar-cdmx-1767067401075_iwz7xz.webp",
        color: "#7000FF",
        accentColor: "rgba(112, 0, 255, 0.4)"
    },
    {
        id: 5,
        title: "Global Connections",
        description: "Conectando ideas y personas a través de una red global de creatividad sin límites.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
        video: "https://res.cloudinary.com/dztibxp9k/video/upload/q_auto,vc_auto/v1769144527/crm_3_p0kkxa.mp4",
        color: "#00FFC2",
        accentColor: "rgba(0, 255, 194, 0.4)"
    },
    {
        id: 6,
        title: "Creative Horizon",
        description: "Descubre nuevos horizontes en el diseño visual y la narrativa digital interactiva.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200",
        color: "#FF6B35",
        accentColor: "rgba(255, 107, 53, 0.4)"
    }
];
