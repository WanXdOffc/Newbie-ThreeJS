export const developer = {
  name: 'IKetut Dharmawan',
  monogram: 'Dev',
  role: 'AI Enthusiast',
  availability: 'Available for select projects',
  location: 'Manado, Indonesia',
  contactEmail: 'iketutdharrmawan2007@gmail.com',
  githubUsername: 'WanXdOffc',
  bio: 'I like my interfaces a little loud and my code a lot thoughtful. I turn curious questions into useful, tactile things for the web.',
  specialties: [
    'AI Enthusiast',
  ],
  cvUrl: '/cv.pdf',
  profileImages: [
    'https://i.ibb.co.com/8DfRYH2B/Whats-App-Image-2026-10-04-at-5-25-52-PM.jpg',
    'https://i.ibb.co.com/8DfRYH2B/Whats-App-Image-2026-10-04-at-5-25-52-PM.jpg',
  ],
}

export const projects = [
  {
    id: 'my-blog',
    title: 'Blog Pribadi',
    category: 'Website / 2026',
    summary: 'A calmer way to collect the little things worth remembering.',
    description: 'A pocket-sized digital garden for collecting observations, references, and half-formed ideas. Designed to feel tactile without getting in the way.',
    technologies: ['Laravel', 'Vite', 'Tailwind CSS', 'PostgreSQL'],
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=800&q=80',
    ],
    repositoryUrl: 'https://github.com/WanXdOffc/myBlog',
    liveUrl: 'https://example.com/',
  },
]

export const experience = [
  {
    id: 'wanyzx-prompt-engineer',
    organization: 'Wanyzx',
    role: 'Prompt Engineer',
    period: '2025 - NOW',
    description: 'Creating prompts for AI models.',
  },
  {
    id: 'wanyzx-ai-enthusiast',
    organization: 'Wanyzx',
    role: 'AI Enthusiast',
    period: '2024 - 2025',
    description: 'Sharing my thoughts and ideas about AI to the world.',
  },

]

export const education = [
  {
    id: 'university',
    institution: 'Universitas Pendidikan Ganesha',
    qualification: 'Start Study in Computer Science',
    period: '2025 - Now',
    detail: 'Focus in study and explore the world of technology and programming.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Logo_undiksha.png',
  },
  {
    id: 'SMA',
    institution: 'SMAS BUDI LUHUR KEMBANG MERTHA',
    qualification: 'Mathematics and Natural Sciences',
    period: '2022 - 2025',
    detail: 'Focus in study and explore the world of technology and programming.',
    logo: '/education/school-logo.svg',
  },
  {
    id: 'SMP',
    institution: 'SMPS BUDI LUHUR KEMBANG MERTHA',
    qualification: 'Junior High School',
    period: '2019 - 2022',
    detail: 'Focus sleeping in the class and playing games',
    logo: '/education/school-logo.svg',
  },
  {
    id: 'SD',
    institution: 'SDN 1 KEMBANG MERTHA',
    qualification: 'Elementary School',
    period: '2013 - 2019',
    detail: 'Just a normal elementary school student who likes to play and learn new things.',
    logo: '/education/school-logo.svg',
  },
]

export const leadership = [
  {
    id: 'usk-software-engineering',
    organization: 'No-Organization',
    badge: 'Not-Bad',
    role: 'Still Learning',
    period: '2025 - Now',
    logo: '',
    detail:
      '-',
    images: [],
  },
]

// Statistik angka di About section (bisa diatur bebas di sini)
export const stats = [
  { value: 2, suffix: '+', label: 'PROJECTS COMPLETED' },
  { value: 1, suffix: '+', label: 'YEARS EXPERIENCE' },
  { value: 4, suffix: '+', label: 'SKILLS IN TOOLKIT' },
  { value: 99, suffix: '%', label: 'PASSION FOR CODE' },
]

export const certifications = [
  {
    id: 'juara-vibecoding',
    name: 'Juara Vibe Coding',
    issuer: 'Google Develover Groups',
    year: '2026',
    credentialId: 'JVC2605-PXLM-MMC9',
    credentialUrl: '',
    image: 'https://i.ibb.co.com/5hzgL5Dx/Whats-App-Image-2026-10-04-at-5-37-32-PM.jpg',
    images: [
      'https://i.ibb.co.com/5hzgL5Dx/Whats-App-Image-2026-10-04-at-5-37-32-PM.jpg',
    ],
  },
]

export const skills = [
  { category: 'Frontend', items: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'] },
  { category: 'Tools', items: ['Git', 'Docker'] },
]

// Media sosial yang tampil di Footer & Contact section
// Tambah atau kurangi media sosial di sini, logo/ikon akan otomatis dinamis!
// ID yang didukung: github, linkedin, instagram, discord, twitter (atau x), youtube, tiktok, telegram, facebook, whatsapp, reddit, medium, dll.
export const socialLinks = [
  { id: 'github', label: 'GitHub', href: 'https://github.com/WanXdOffc' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/in/i-ketut-dharmawan' },
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/xwan.store_' },
]

export const links = [
  { id: 'blog', label: 'Blog', href: 'https://medium.com/', kind: 'writing' },
  { id: 'api', label: 'API', href: 'https://developer.mozilla.org/', kind: 'reference' },
  { id: 'code-library', label: 'Code Library', href: 'https://github.com/WanXdOffc', kind: 'code' },
  ...socialLinks.map((item) => ({ ...item, kind: 'social' })),
  { id: 'email', label: 'Email', href: 'mailto:iketutdharrmawan2007@gmail.com', kind: 'contact' },
]

export const navigation = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' },
]

export const albumPhotos = [
  {
    id: 'minikrep',
    image: 'https://i.ibb.co.com/1t3zvPG0/Whats-App-Image-2026-10-04-at-5-32-12-PM.jpg',
    alt: 'Minikrep',
    caption: 'Play Minecraft',
  },
  {
    id: 'gunungbatur',
    image: 'https://i.ibb.co.com/DgT3tB9C/Whats-App-Image-2026-10-04-at-5-33-12-PM.jpg',
    alt: 'Gunung Batur',
    caption: 'Sunrise at Batur',
  },
]

export const techStack = ['React', 'TypeScript', 'JavaScript', 'CSS', 'Node.js', 'Figma', 'Motion']