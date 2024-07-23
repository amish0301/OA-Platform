import React from "react";
import { Link } from "react-router-dom";
import { IoLogoGithub as GithubIcon } from "react-icons/io";
import { FaLinkedinIn as LinkedinIcon } from "react-icons/fa";

const socialMedia = [
  {
    src: <LinkedinIcon />,
    href: "https://www.linkedin.com/in/amish-pithva-62b83b233/",
    alt: "linkedin-icon",
  },
  {
    src: <GithubIcon />,
    href: "https://github.com/amish0301",
    alt: "github-icon",
  }
]

const footerLinks = [
  {
    title: "Navigation",
    links: [
      {
        title: "Home",
        url: "/",
      },
      {
        title: "About Us",
        url: "/about",
      },
      {
        title: "Contact Us",
        url: "/contact",
      },
    ],
  },
  {
    'title': 'Social Media',
    'links': [
      {
        'title': 'Github',
        'url': 'https://github.com/amish0301'
      },
      {
        'title': 'LinkedIn',
        'url': 'https://www.linkedin.com/in/amish-pithva-62b83b233/'
      }
    ]
  },
]

function Footer() {
  return (
    <footer className='max-w-full bg-gray-100 py-10 max-md:px-10 px-20'>
      <div className='flex justify-between items-start gap-20 flex-wrap max-lg:flex-col'>
        <div className='flex flex-col items-start'>
          <Link to={"/"}>
            <span className='text-xl font-medium text-black'>YourPrepPartner</span>
          </Link>
          <p className='mt-6 text-base leading-7 font-montserrat text-gray-700 sm:max-w-sm'>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Architecto soluta porro illo ex ipsa suscipit? Facere in quo ipsa perferendis laborum
          </p>
          <div className='flex items-center gap-3 mt-5'>
            {
              socialMedia.map((item, index) => (
                <div key={index} className='flex justify-center items-center bg-gray-50 w-8 h-8 rounded-full'>
                  <Link to={item.href} className="text-xl scale-110 text-gray-800 hover:text-gray-700" target='_blank'>
                    {item.src}
                  </Link>
                </div>
              ))
            }
          </div>
        </div>

        <div className='flex flex-1 justify-around items-start md:gap-10 gap-5 flex-wrap'>
          {
            footerLinks.map((section,index) => {
              return (
                <div key={index}>
                  <h4 className='text-[#6c5d53] text-lg md:text-md leading-normal font-semibold'>{section.title.toUpperCase()}</h4>
                  <ul>
                    {
                      section.links.map((link,index) => (
                        <li key={index} className='text-[rgb(141, 144, 159)]  mt-3 text-base leading-normal hover:text-[#494f5d]'>
                          <Link to={link.url}>{link.title}</Link>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              )
            })
          }
        </div>
      </div>
      
      <div className="mt-12 border-t border-gray-700 pt-8">
        <p className="text-gray-400 text-center text-sm">
          © YourPrepPartner™ 2024.All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer;