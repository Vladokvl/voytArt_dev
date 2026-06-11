export type siteConfigType = {
    title: string;
    description: string;
    navItems: {
        name: string;
        href: string;
    }[];
}

export const siteConfig: siteConfigType = {
  title: 'VoytArt Gallery',
  description: 'Original paintings by Ukrainian artists',
  navItems: [
    { name: 'Art', href: '/art' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Art Shop', href: '/art-shop' },
  ],
}
