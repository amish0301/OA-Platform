import React from "react";
import { Link } from "react-router-dom";
import { IoLogoGithub as GithubIcon } from "react-icons/io";
import { FaLinkedinIn as LinkedinIcon } from "react-icons/fa";

function Footer() {
  let date = new Date();
  let year = date.getFullYear();

  return (
    <section className="w-full flex flex-wrap items-center justify-between bg-black py-3 px-5">
      <div className="text-gray-400 text-base font-semibold">
      ❤️ designed and developed by Amish Pithva
      </div>
      <div className="text-gray-400 text-base font-semibold">
        Copyright © {year} AP
      </div>
      <div className="flex items-center gap-2">
        <Link to="https://github.com/amish0301" className="text-lg"><GithubIcon className="text-white" /></Link>
        <Link to="https://www.linkedin.com/in/amish-pithva-62b83b233/" className="text-lg"><LinkedinIcon className="text-white" /></Link>
      </div>
    </section>
  );
}

export default Footer;