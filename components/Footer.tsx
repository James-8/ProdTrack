import Image from 'next/image';
import Link from 'next/link';

const socialIcons = [
  { src: '/assets/icons/facebook.svg', alt: 'Facebook' },
  { src: '/assets/icons/twitter.svg', alt: 'Twitter' },
  { src: '/assets/icons/instagram.svg', alt: 'Instagram' },
];

const Footer = () => {
  return (
    <footer className="w-full mt-10 bg-gray-200 py-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1">
              <Image 
                src="/assets/icons/logo.svg"
                width={27}
                height={27}
                alt="logo"
              />
              <p className="nav-logo">
                Prod<span className='text-primary'>Track</span>
              </p>
            </Link>
          </div>

          <div className="flex gap-5">
            {socialIcons.map((icon) => (
              <Image 
                key={icon.alt}
                src={icon.src}
                alt={icon.alt}
                width={24}
                height={24}
                className="object-contain"
              />
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-center text-gray-600 text-sm">Contact us: dummyforproject@outlook.com</p>
          <p className="text-center text-gray-600 text-sm">&copy; 2024 ProdTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
