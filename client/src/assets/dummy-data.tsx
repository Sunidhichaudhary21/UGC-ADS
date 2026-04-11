import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Smart Upload',
        desc: 'Drag & Drop your assests.We auto-optimize formats and sizes.'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Instant Generation',
        desc: 'Optimized models deliver output in seconds with great fidelity.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Video Synthesis',
        desc: 'Bring product shots to life with short-form, social-ready videos.'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$10',
        desc: 'Try the platform at no cost.',
        credits: '25',
        features: [
            '25 credits',
            'Standard quality',
            'No watermark',
            'Slower generation speed',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '$29',
        desc: 'Creater and team.',
        credits: 80,
        features: [
            '80 credits',
            'HD quality',
            'No watermark',
            'Video generation',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Ultra',
        price: '$99',
        desc: 'Scale across teams and agencies',
        credits: 'Custom',
        features: [
            '300 credits',
            'FHD qualtiy',
            'No watermark',
            'Fast generation speed',
            'Chat + Email support'
        ]
    }
];

export const faqData = [
    {
        question: 'How does the AI generation work',
        answer: 'We leverage state-of-the-art diffusion models trained on millions of product images to blend your product into realistic scenes while preserving details, lighting and reflections.'
    },
    {
        question: 'Do I own the generated images?',
        answer: 'Yes - You receive full commercial rights to any images and video generated on the platform. Use them for ads, Ecommerce , social media and more.'
    },
    {
        question: 'Can I cancel anytime?',
        answer: 'Yes You can.'
    },
    {
        question: 'What input format do you support?',
        answer: 'We accept JPG, PNG and WEBP.Output ar high-resolution PNGs and MP4s optimized for social platform'
    }
];

export const footerLinks = [
    {
        title: "Quick access",
        links: [
            { name: "Home", url: "#" },
            { name: "Features", url: "#" },
            { name: "Pricing", url: "#" },
            { name: "FAQ", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];