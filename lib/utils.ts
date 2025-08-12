import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const forbiddenWords = [
  // Mots vulgaires
  "fuck",
  "shit",
  "bitch",
  "cunt",
  "dick",
  "pussy",
  "asshole",
  "ass",
  "nsfw",
  "porn",
  // Dérivés et variations
  "fucking",
  "fucked",
  "fck",
  "stfu",
  "wtf",
  "fuk",
  "fucker",
  "shitting",
  "bullshit",
  // Autres termes inappropriés
  "whore",
  "slut",
  "bastard",
  "retard",
  "retarded",
  "cocksucker",
  "motherfucker",
  "piss",
  "anal",
  "vagina",
  "penis",
  "boobs",
  "tits",
  // Tags et indicateurs
  "nsfl",
  "gonewild",
  "xxx",
  "sexy",
  "nude",
  "naked",
  "18+",
];
