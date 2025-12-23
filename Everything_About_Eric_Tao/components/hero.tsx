"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Hero() {
  const [blur, setBlur] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const ratio = Math.min(window.scrollY / 200, 1);
      setBlur(ratio * 8);
    };
    handleScroll();
    window.addEventListener("scroll",handleScroll,{passive: true});
    return () => window.removeEventListener("scroll", handleScroll);
  },[]);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl font-saffron">
          Hello, my name is{" "}
          <span className="group relative inline-block py-2 font-bold italic text-[#E77421]">
            <a href="/about">
            Eric Tao
            </a>
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </span>
        </h1>
        <p className="mb-6 max-w-2xl mx-auto text-xl sm:text-2xl font-inter">
          Software Engineer
        </p>
        <p className="mb-6 max-w-2xl mx-auto text-xl text-muted-foreground sm:text-md font-inter">
          I build clean, interactive web applications using React, Firebase, Node, and modern UI frameworks.
        </p>
        <Link href="/projects" passHref>
          <Button size="lg" className="group bg-[#E77421] hover:bg-[#E77421]/90 text-white">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
      <div className="absolute inset-0 z-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2819-%E7%BD%91%E6%A0%BC%E8%B5%84%E6%BA%90%205@4x-X4kxbmh56PGsiiRaUXDlN8PMObdrYl.png"
          alt="Technical grid background"
          fill
          className="opacity-90"
          style={{ objectFit: "cover", filter: `blur(${blur}px)`, transition: "filter 600ms ease-out" }}
          priority
        />
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
    </section>
  );
}
