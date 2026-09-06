import type { MetadataRoute } from "next";

const baseUrl = "https://phosdeepinternational.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/technology", "/training", "/about", "/contact", "/privacy"];
  const technologies = ["cybersecurity", "generative-ai", "quantum", "cloud", "blockchain", "research"];

  return [...routes, ...technologies.map((slug) => `/technology/${slug}`)].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
