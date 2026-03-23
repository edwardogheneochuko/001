
export type ScaryItem = {
  title: string
  description: string
}

export const scaryContent: ScaryItem[] = [
  {
    title: "Welcome",
    description: "Fvck around and find out!..",
  },
  {
    title: "Beware",
    description: "The ghosts are near!..Don't let them catch you!",
  },
  {
    title: "Haunted Pumpkin",
    description: "It watches you... Don't look into its eyes!",
  },
  {
    title: "Spooky Cat",
    description: "It has glowing eyes and a sinister grin!",
  },
  {
    title: "Creepy Ghost",
    description: "It floats silently through the air, whispering eerie sounds...",
  },
  {
    title: "Eerie Bat",
    description: "It flies in the night sky, its wings flapping ominously...",
  },
  {
    title: "Sinister Spider",
    description: "It spins its web in the darkest corners, waiting for its prey...",
  },
  {
    title: "Mysterious Skull",
    description: "It grins eerily in the moonlight, a symbol of death and darkness...",
  },
  {
    title: "Dark Forest",
    description: "Shadows lurk among the trees... It's a place of mystery and danger!",
  },
  {
    title: "Haunted House",
    description: "To do it is to Dare! Don't breathe... But beware of the spirits that may haunt its halls!",
  },
  {
    title: "Cursed Mirror",
    description: "It reflects your darkest fears... Don't look into it for too long, or you might see something you wish you hadn't!",
  },
  {
    title: "Grim Reaper",
    description: "It stands silently, waiting to claim its next victim... Don't let it catch you!",
  },
]

// ---------- Categories ----------
import {  GiPowder } from "react-icons/gi"
import type { IconType } from "react-icons" // for typing
import { AccessibilityIcon } from "lucide-react"

export interface Category {
  name: string
  image: string
  icon?: IconType
}

export const categories: Category[] = [
  {
    name: "Gun",
    image:
      "https://res.cloudinary.com/direjlzc6/image/upload/v1773787343/ni7dbxlkdjjczefl11lg.jpg",
  },
  {
    name: "Drugs",
    icon: GiPowder,
    image:
      "https://res.cloudinary.com/direjlzc6/image/upload/v1773786917/gpdmtwi5sewficoqfsk4.jpg",
  },
  {
    name: "Acessories",
    icon: AccessibilityIcon,
    image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773786901/v5xjuxbokpbl0ueaxd9b.jpg",
  }
]

// Items for each category
export interface Item {
  id: number
  name: string
  image: string
}

export const categoryItems: Record<string, Item[]> = {
  Gun: [
    { id: 1, name: "Pistol", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773786900/loxs8jx58df60zfodckw.jpg" },
    { id: 2, name: "AK-47", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773786873/i8i3zhdwbrvqratxdtyq.jpg" },
    {id: 3, name: "Revolver", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773954492/xzvqcfkzwy44zqdjqjf4.jpg"},
    {id: 4, name: "Rifle", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773954481/u9gowlnncgsb9drkbddh.jpg"}
  ],
  Drugs: [
    { id: 1, name: "Pills", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773786893/jzyomwhat1ol3foh4cui.jpg" },
    { id: 2, name: "Weed", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773786877/snpvxnx6xexkbflxw7ex.jpg" },
    {id: 3, name: "Cocaine", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773954489/lt5fqenj85tntceyfdjf.jpg"},
  ],
  Acessories: [
    { id: 1, name: "Money Exchange", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773787364/wbkcginacnbu932huqrb.jpg" },
    { id: 2, name: "Bullets", image: "https://res.cloudinary.com/direjlzc6/image/upload/v1773786844/aaqbawhz2myr7dnemcl1.jpg" },
  ],
}

export const depressionTalks: string[] = [
  "My ex-boyfriend said he would kill himself if I left him. I call him my ex because he's gone now...I have being feeling grief for two months now. I don't know how to move on.",
  "I've lost loved ones and I've also had friends who have struggled significantly with grief but i can never tell those friends that I'm often very suicidal....I maintain this sunny deposition to hide what i have been going through as they're coping with loss I'm coping with the effects that losing my own life might have on their life",
  "When i was like 12 years old, me and my brother were told that my grandfather had passed away from a heart attack, it was really sad, first like death that i had to go through and then fast forward like two years later, maybe more than that I'm snopping through my mom's phone and i find her reddit account and on her reddit account she detailed how my grandfather commited suicide",
  "So I've grown up in the bible belt my entire life and earlier this year...my cousin died by sucide... Previous to this, I removed myself from religion, it's probably been a year now when the time came for the funeral all people could keep saying and talking about was thank goodness he was saved two months before he died and they keep repeating it over and over and over again and in those moments i was so angry because i know that there was people at his funeral who thought that he prolly went to Hell",
  "My 15 year old brother took his own life three years ago, everyday I stuggle with forgiving him because it seemed like a very selfish and weak thing to do",
  "I lost my best friend from suicide when i was 23, i used to do a lot of drugs so i can see her again and it was just crazy times after i stopped doing drugs, I kinda forgot about her"
]