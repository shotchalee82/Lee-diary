"use client";
import { useState, useEffect, useCallback } from "react";

// ─── Task data ────────────────────────────────────────────────────────────────
const DAILY_TASKS = [
  { id: "d1",  cat: "morning",  label: "7AM cold water" },
  { id: "d2",  cat: "food",     label: "Coffee + egg + Thai fruit" },
  { id: "d3",  cat: "morning",  label: "Shower + tongue scraper" },
  { id: "d4",  cat: "nicotine", label: "Morning nicotine gum" },
  { id: "d5",  cat: "nicotine", label: "One cigarette only (after work)" },
  { id: "d6",  cat: "evening",  label: "8PM walk" },
  { id: "d7",  cat: "evening",  label: "9PM dark cocoa" },
  { id: "d8",  cat: "nicotine", label: "Nicotine patch" },
  { id: "d9",  cat: "food",     label: "Soda water only" },
];

const DOW_TASKS = {
  1: [
    { id: "m1", cat: "work",    label: "Assembly + nicotine gum" },
    { id: "m2", cat: "writing", label: "Screenplay/novel writing" },
    { id: "m3", cat: "food",    label: "Green tea + chicken + sweet potato" },
    { id: "m4", cat: "health",  label: "Hospital dental enquiry" },
    { id: "m5", cat: "study",   label: "7PM Thai study" },
    { id: "m6", cat: "clean",   label: "🧹 30-min clean: wipe surfaces + sweep floors + empty bins" },
    { id: "m7", cat: "gym",     label: "💪 Warm-up: arm circles + leg swings + hip rotations | Treadmill 20-min walk incline 3 speed 5 | 3x10 curls + shoulder press | Cool-down: quad + hamstring stretch" },
    { id: "m8", cat: "study",   label: "🎓 1hr Masters: research 2 programmes / draft personal statement / email admissions" },
  ],
  2: [
    { id: "t1", cat: "food",    label: "Green tea/coffee morning" },
    { id: "t2", cat: "food",    label: "6PM chicken + avocado + nuts" },
    { id: "t3", cat: "social",  label: "Museum or art night" },
    { id: "t4", cat: "clean",   label: "🧽 DEEP CLEAN: scrub bathroom + mop floors + clean kitchen + change bedding + wipe windows" },
    { id: "t5", cat: "gym",     label: "💪 Rest day — cleaning counts! Or 15-min gentle walk outside" },
    { id: "t6", cat: "health",  label: "💊 Krusapha: check stock, reorder if under 2 weeks supply" },
  ],
  3: [
    { id: "w1", cat: "work",    label: "Assembly + nicotine gum" },
    { id: "w2", cat: "social",  label: "Swimming" },
    { id: "w3", cat: "food",    label: "6PM chicken + avocado + nuts" },
    { id: "w4", cat: "study",   label: "7PM Thai study" },
    { id: "w5", cat: "clean",   label: "🧹 30-min clean: tidy living room + wipe kitchen + vacuum" },
    { id: "w6", cat: "gym",     label: "💪 Warm-up: jumping jacks + shoulder rolls | Treadmill 20-min jog speed 7-8 | 3x12 squats + lat pulldown | Cool-down: calf + hip flexor stretch" },
    { id: "w7", cat: "gym",     label: "🏊 Pool: 2 laps backstroke warm-up | 10 laps freestyle + 5 breaststroke | 1 slow lap cool-down + 2-min float" },
  ],
  4: [
    { id: "th1", cat: "food",   label: "Green tea + chicken + sweet potato" },
    { id: "th2", cat: "social", label: "British Club cricket" },
    { id: "th3", cat: "clean",  label: "🧹 30-min clean: bathroom wipe-down + sweep + tidy bedroom" },
    { id: "th4", cat: "gym",    label: "💪 Warm-up: high knees + torso twists | Treadmill 25-min intervals (1 min fast / 1 min walk x10) | 3x10 chest press + tricep pushdown | Cool-down: chest + tricep stretch" },
    { id: "th5", cat: "study",  label: "🎓 1hr Masters/Krusapha: 300 words personal statement OR grant research OR email 1 professor" },
  ],
  5: [
    { id: "f1", cat: "work",    label: "Assembly + nicotine gum" },
    { id: "f2", cat: "writing", label: "Screenplay/novel writing" },
    { id: "f3", cat: "food",    label: "6PM chicken + avocado + nuts" },
    { id: "f4", cat: "social",  label: "Evening smoke (no alcohol)" },
    { id: "f5", cat: "clean",   label: "🧹 30-min clean: mop kitchen floor + clear clutter + wipe fridge shelves" },
    { id: "f6", cat: "gym",     label: "💪 Warm-up: ankle circles + glute bridges | Treadmill 20-min speed 6 incline 2 | 3x10 dumbbell rows + 3x15 calf raises | Cool-down: forward fold + pigeon pose" },
  ],
  6: [
    { id: "s1", cat: "gym",     label: "Morning gym" },
    { id: "s2", cat: "health",  label: "Sauna (10-15 min after gym)" },
    { id: "s3", cat: "food",    label: "6PM chicken + avocado + nuts" },
    { id: "s4", cat: "study",   label: "7PM Thai study" },
    { id: "s5", cat: "social",  label: "Explore Bangkok walk" },
    { id: "s6", cat: "social",  label: "Evening smoke" },
    { id: "s7", cat: "clean",   label: "🧽 DEEP CLEAN: vacuum all rooms + scrub toilet & sink + clean mirrors + wipe skirting + take out all rubbish" },
    { id: "s8", cat: "gym",     label: "💪 Warm-up: slow walk + arm swings + light squats | Treadmill 30-min run speed 8-9 | 3x8 deadlifts + 3x10 leg press | Cool-down: child's pose + spinal twist + hamstring stretch" },
  ],
  0: [
    { id: "su1", cat: "gym",    label: "Gym afternoon" },
    { id: "su2", cat: "social", label: "Swimming" },
    { id: "su3", cat: "food",   label: "Green tea + chicken + sweet potato" },
    { id: "su4", cat: "social", label: "Explore Bangkok walk" },
    { id: "su5", cat: "clean",  label: "🧹 30-min clean: quick reset + wipe surfaces + prep for the week" },
    { id: "su6", cat: "gym",    label: "💪 Warm-up: slow walk + neck rolls | Treadmill 20-min easy walk | 3x10 seated row + overhead press | Cool-down: full body 10-min stretch" },
    { id: "su7", cat: "gym",    label: "🏊 Pool: 3 laps breaststroke warm-up | 8 freestyle + 4 breaststroke + 2 backstroke | 2 slow laps + 5-min float cool-down" },
  ],
};

const KRUSAPHA_MONTHS = new Set(["March 2026","May 2026","July 2026","September 2026","November 2026","January 2027"]);

const ADMIN_REMINDERS = {
  "March 2026":     "📋 90-day TM47 report due this month — immigration.go.th",
  "April 2026":     "🦷 Hospital dental enquiry — book or follow up",
  "June 2026":      "📋 90-day TM47 report due — file online or Chaengwattana/Suan Phlu",
  "July 2026":      "📄 Check work permit expiry — renewal takes 3-4 weeks",
  "September 2026": "📋 90-day TM47 report due this month",
  "October 2026":   "📄 Review visa + work permit — ensure all docs current before year end",
  "December 2026":  "📋 90-day TM47 due — file before holiday period. Review all 2027 dates.",
  "January 2027":   "📋 Set all 2027 immigration reminders in phone now",
  "February 2027":  "📋 90-day TM47 report due this month",
};

const MONTH_EXTRAS = {
  "March 2026": {
    sport: ["🥊 Muay Thai nightly — Rajadamnern THB 200 terrace (best: Sat RWS 7PM)","🥊 Lumpinee Stadium Fri & Sat — general seats THB 200","🏇 RBSC Horse Racing: Sun 1, 15 & 29 Mar — THB 100 Gate 3","🏏 British Club cricket Saturdays — free to spectate"],
    galleries: ["🎨 BACC — free entry Tue-Sun 10AM-8PM, BTS National Stadium","🖼️ Jim Thompson Art Center — THB 50, Soi Kasemsan 2","🏛️ National Gallery Bangkok — free Wednesdays / THB 30"],
    picnics: ["🌳 Lumpini Park — rice + grilled chicken ~THB 80, shade near the lake","🌳 Benjakitti Forest Park — fruit + coconut water ~THB 60, BTS Asok"],
    soups: ["🍲 Boat noodles, Victory Monument alley — 5-10 bowls for THB 60-80","🍲 Tom kha kai from any market stall — THB 40-50 with rice"],
    stories: ["✍️ Reedsy.com free contest submissions (cash prizes)","✍️ Bangkok Expat Writers group — Meetup.com"],
  },
  "April 2026": {
    sport: ["🥊 Muay Thai nightly — Rajadamnern THB 200. Songkran week special cards","🏇 RBSC: Sun 12 Apr (Chakri Cup) & Sun 26 Apr (Magic Millions) — THB 100","🏏 British Club cricket Saturdays — free to watch","🥊 7 Apr — Thailand Kickboxing World Cup, Thai-Japanese Stadium"],
    galleries: ["🎨 BACC — new post-Songkran exhibition cycle, free","🖼️ Warehouse 30 (Charoenkrung 30) — free gallery walk Tue-Sun","🏛️ Museum Pier — riverside Thai art, ferry access"],
    picnics: ["🌳 Rot Fai Park — wide lawns, grab fried rice from weekend market ~THB 60","💦 Songkran 13-15 Apr: water fights on Silom/Khao San — water gun THB 30"],
    soups: ["🍲 Jok (rice congee) from street cart — THB 35-45, open from 6AM","🍲 Tom yum noodle soup — Or Tor Kor Market ~THB 50-70"],
    stories: ["✍️ Mekong Review (SE Asia focus, pays USD)","✍️ Medium Partner Programme — set up and earn per read"],
  },
  "May 2026": {
    sport: ["🥊 Muay Thai nightly — Rajadamnern THB 200 (hot season = intense atmosphere)","🏇 RBSC: Sun 10 May & Sat 23 May — THB 100 Gate 3","⚽ Thai Premier League — Port FC or Muang Thong ~THB 100-200","🏏 British Club cricket Saturdays"],
    galleries: ["🎨 BACC — new rotation, free, great air-con midweek visit","🖼️ Lido Connect (Siam Square) — art + film screenings, lidoconnect.com","🏛️ Bank of Thailand Learning Centre — free, near Sanam Luang"],
    picnics: ["🌳 Benjakitti — early morning before 9AM only (heat!). Fruit + iced tea ~THB 70","🌳 Bang Krachao Green Lung — ferry THB 4 + bike ~THB 50/hr, street food inside"],
    soups: ["🍲 Yen ta fo (pink noodle soup) — Chinatown stall ~THB 50-60","🍲 Khao tom (rice soup) — any local coffee shop mornings, THB 35-50"],
    stories: ["✍️ The Kenyon Review + Granta — both accept online unsolicited submissions","✍️ Pitch Bangkok essay to Coconuts Bangkok or BK Magazine — both pay"],
  },
  "June 2026": {
    sport: ["⚽ UEFA Euro 2026 group stage — every expat bar. England: Sportsman or Bull's Head Soi 33","🏇 RBSC: Sun 7 Jun & Sun 21 Jun (Queen's Cup) — THB 100","⚽ Thai Premier League midseason — Port FC at PAT Stadium ~THB 100-200","🏏 British Club cricket — confirm britishclubbangkok.org (rainy season)"],
    galleries: ["🎨 BACC — rainy season afternoon refuge, free, BTS National Stadium","🖼️ Warehouse 30 (Charoenkrung 30) — free gallery walk + riverside evening","🏛️ Artist's House / Baan Silapin — canal-side, free/donation, puppet shows Sat/Sun"],
    picnics: ["🌳 Lumpini Park after 5PM — pad thai from market ~THB 50 + watch monitor lizards","🌳 Chatuchak Park — 5-6 market snacks on way in ~THB 100, bench by the lake"],
    soups: ["🍲 Gaeng jued (clear broth, tofu + glass noodles) — any rice shop THB 35-50","🍲 Kuay teow reua (boat noodles) — Victory Monument. THB 12-15 per bowl, have 8"],
    stories: ["✍️ Catapult (catapult.co, pays USD 200-600)","✍️ Amazon Kindle Vella — serialised fiction, earns per read"],
  },
  "July 2026": {
    sport: ["🥊 Muay Thai nightly — Rajadamnern THB 200 (arrive 30 min early Sat)","🏇 RBSC: Sun 5 Jul & Sun 19 Jul — THB 100 Gate 3","🥊 Lumpinee Stadium Fri ONE + Sat Super Champ — THB 200","⚽ UEFA Euro 2026 semi-finals & FINAL — every sports bar"],
    galleries: ["🎨 BACC — mid-year new cycle, free. Rainy afternoons = perfect gallery day","🖼️ MOCA Bangkok — THB 280, 800+ Thai artworks, near Chatuchak","🏛️ National Museum Bangkok — free Wednesdays / THB 30, near Grand Palace"],
    picnics: ["🌳 Rot Fai Park — khao man gai from Chatuchak vendors ~THB 60","🌳 Suan Luang Rama IX Park — rice boxes from Or Tor Kor ~THB 80, taxi from On Nut"],
    soups: ["🍲 Khao soi — Northern Thai curry noodle, Cherng Doi Sukhumvit ~THB 90-110","🍲 Clear fish ball soup — Yaowarat night market ~THB 50-60"],
    stories: ["✍️ Ploughshares (pshares.org)","✍️ Wattpad — post serialised stories, large SE Asia audience"],
  },
  "August 2026": {
    sport: ["🥊 Muay Thai — Rajadamnern THB 200. Aug has top-ranked fight cards","🏇 RBSC: Sun 2, 16 & 30 Aug (3 meetings!) — THB 100. Queen's Birthday period","⚽ EPL 2026/27 season kicks off mid-August — Sportsman or Bull's Head, free entry","🏏 British Club cricket — confirm britishclubbangkok.org"],
    galleries: ["🎨 BACC — Queen's Birthday period (12 Aug) Thai art installations, free","🖼️ Jim Thompson Art Center — THB 50, summer residency shows in Aug","🏛️ Siam Serpentarium (Bangna) — snakes + insects + multimedia, THB 200"],
    picnics: ["🌳 Benjakitti — Saturday farmers market (some weeks). Fresh produce + food stalls","🌳 King Rama IX Park — grilled corn + papaya salad from vendors outside ~THB 80"],
    soups: ["🍲 Tom yum goong (hot & sour prawn soup) — street stalls THB 50-70","🍲 Wonton soup — any Chinatown coffee shop, Silom/Yaowarat, THB 40-60"],
    stories: ["✍️ The Iowa Review + Glimmer Train — prestigious US journals, online","✍️ Narratively (narratively.com) — pays USD 400-1,000, Bangkok expat angle is strong"],
  },
  "September 2026": {
    sport: ["🥊 Muay Thai — Rajadamnern THB 200. Rainy season peak = electric atmosphere","🏇 RBSC: Sat 13 Sep & Sat 27 Sep — THB 100 Gate 3","⚽ EPL + Champions League group stages midweek — Bull's Head or Sportsman, free","🏏 British Club cricket — confirm britishclubbangkok.org (rain may affect)"],
    galleries: ["🎨 BACC — student/graduate shows in Sept, fresh Thai talent, free","🖼️ bangkokartcity.org — check all live exhibitions this month","🏛️ Romaneenart Park (Old City jail turned park) — free, atmospheric"],
    picnics: ["🌳 Lumpini Park — buy 2-3 street skewers + sticky rice outside south gate ~THB 60","🌳 Bang Krachao — lushest month. Ferry THB 4 + bikes. Local market inside for food"],
    soups: ["🍲 Luk chin soup (fishball soup) — street carts THB 40-50","🍲 Jok moo (pork congee) — any street side shop THB 35-45 + soft-boiled egg"],
    stories: ["✍️ Bellevue Literary Review + Mekong Review — both paid","✍️ Reedsy weekly contest — USD 50-150 prizes, 30 mins to enter"],
  },
  "October 2026": {
    sport: ["🥊 Muay Thai — Rajadamnern THB 200. Oct often has ranked title fights","🏇 RBSC: Sat 10 Oct & Sun 25 Oct — THB 100. Check rbsc.org to confirm","⚽ EPL + UCL continuing midweek — Sportsman / Shaftesbury / O'Reilly's, free","🏏 British Club cricket — dry season returns, better pitches"],
    galleries: ["🎨 Bangkok Art Biennale (BAB) OPENS — FREE at Wat Pho, Wat Arun, Central Embassy, ICONSIAM","🖼️ BACC — BAB launch exhibition, free","🏛️ Baan Silapin (Artist's House) — free/donation, puppet shows weekends"],
    picnics: ["🌳 Benjakitti — post-rainy season, beautiful October evenings. Fruit + cold drinks","🌳 Sanam Luang (Royal Field) — mat + food from nearby market after temple visit, free"],
    soups: ["🍲 Gaeng keow wan (green curry soup) — market stall THB 50-70","🍲 Clear noodle soup with crab — Yaowarat Chinatown ~THB 60-80"],
    stories: ["✍️ Tin House + Electric Literature — well-regarded, paid submissions","✍️ Outline your Bangkok novel for NaNoWriMo in November"],
  },
  "November 2026": {
    sport: ["🥊 Muay Thai — peak season, biggest fight cards of year, THB 200","🏇 RBSC: Sun 8 Nov & Sun 22 Nov — THB 100. Cool weather = great atmosphere","⚽ EPL + UCL knockouts — fierce competition, big midweek nights","🏹 Bangkok Rugby Sevens — check bangkokrugby.com for 2026 dates (~THB 200-400/day)"],
    galleries: ["🎨 BAB continues FREE — Loy Krathong week: special night art walks at riverside temples","🖼️ BACC — new November show. Open til 8PM, great evening visit in cool weather","🏛️ MOCA Bangkok — THB 280, rotating international loan shows in Nov"],
    picnics: ["🌳 Lumpini Park — perfect picnic weather! Mango sticky rice from market ~THB 60","🏮 25 Nov Loy Krathong — mat + krathong at Lumpini or Benjasiri Park ~THB 30-50"],
    soups: ["🍲 Tom kha gai (coconut galangal) — any local restaurant THB 50-70","🍲 Yen ta fo (pink fermented tofu noodle) — Silom/Chinatown stalls THB 40-55"],
    stories: ["✍️ NaNoWriMo — write your Bangkok novel. Join Bangkok group on nanowrimo.org","✍️ Necessary Fiction + Joyland Magazine — keep submission habit going"],
  },
  "December 2026": {
    sport: ["🥊 Muay Thai — biggest fight nights of year, peak season. Book Sat RWS online","🏇 RBSC: Sun 6 Dec (KING'S CUP — unmissable!) & Sun 20 Dec (End of Year) — THB 100","⚽ EPL festive fixtures 26-30 Dec — multiple games daily, sports bars show all","🏏 British Club cricket — dry season peak, best conditions"],
    galleries: ["🎨 BAB continues FREE — night walks at Wat Arun especially beautiful in Dec","🖼️ BACC — year-end retrospective shows, free","🏛️ Suan Luang Rama IX Park — flower festival + light displays, free, taxi from On Nut BTS"],
    picnics: ["🌳 Chatuchak Park + Weekend Market — best weather of year. 8-10 snacks under THB 200","🌳 Benjakitti — cool dry mornings. Mango + papaya + sticky snacks ~THB 80"],
    soups: ["🍲 Pork bone congee / khao tom moo — local rice shop, cool morning air. THB 40-50","🍲 Tom yum goong — sit-down at local Thai restaurant. THB 60-80 with rice"],
    stories: ["✍️ Submit 2 polished pieces before year end while editors clear queues","✍️ Bridport Prize — flash fiction GBP 9, short story GBP 10. bridportprize.org.uk"],
  },
  "January 2027": {
    sport: ["🥊 Muay Thai — Rajadamnern THB 200. January cool evenings = electric atmosphere","🏇 RBSC: Sat 17 Jan — THB 100. Check rbsc.org","⚽ FA Cup 3rd & 4th rounds + EPL — cup giant killings every weekend","🏹 Bangkok Rugby Tens — check bangkokrugby.com for 2027 dates (~THB 300-500/day)"],
    galleries: ["🎨 BACC — new January cycle, quieter crowds, free","🖼️ Bangkok Design Week 2027 (last week Jan) — free design + art + food, Charoenkrung/Silom","🏛️ BAB final month — last chance, free at Wat Pho, Central Embassy, ICONSIAM"],
    picnics: ["🌳 Rot Fai Park — absolute best picnic month. Fruit + coconut water ~THB 70, rent a bike","🌳 Benjasiri Park (Phrom Phong BTS) — sculpture garden, smoothie + rice box ~THB 80"],
    soups: ["🍲 Khao soi gai (chicken khao soi) — best time of year for it. Cherng Doi ~THB 90-110","🍲 Tom kha hed (mushroom coconut) — vegetarian cafes THB 50-70"],
    stories: ["✍️ AGNI + Missouri Review + Virginia Quarterly Review — all open Jan submissions","✍️ QueryTracker.net — query a literary agent for your Bangkok novel (free)"],
  },
  "February 2027": {
    sport: ["🥊 Muay Thai — Rajadamnern THB 200. Valentine's week themed fight nights","🏇 RBSC: Sun 14 Feb & Sun 28 Feb — horse racing on Valentine's Day! THB 100","⚽ Champions League Round of 16 first legs — midweek, Bull's Head or Sportsman","🏹 Bangkok Rugby Tens 2027 — usually February, bangkokrugby.com (~THB 300-500)"],
    galleries: ["🎨 BACC — Valentine's period identity-themed art, free","🖼️ Bangkok Design Week 2027 (if into Feb) — street art + pop-ups, Charoenkrung, free","🏛️ Jim Thompson Art Center — THB 50, major new Q1 show, jimthompsonartcenter.org"],
    picnics: ["🌳 Lumpini Park — last month of perfect weather. Full market meal under THB 100/person","🌳 Bang Krachao — best time of year! Ferry + bikes + jungle lunch with Supak"],
    soups: ["🍲 Boat noodles, Victory Monument — sit outside, 8-10 bowls THB 70-90 total","🍲 Clear ginger broth with pork — local coffee shop THB 40-55"],
    stories: ["✍️ Narrative Magazine (pays USD 150-1,000+) + SmokeLong Quarterly","✍️ Commonwealth Short Story Prize — free entry, major prize. Review your year."],
  },
};

const MONTHS = [
  { name: "March 2026",     year: 2026, month: 2,  days: 31 },
  { name: "April 2026",     year: 2026, month: 3,  days: 30 },
  { name: "May 2026",       year: 2026, month: 4,  days: 31 },
  { name: "June 2026",      year: 2026, month: 5,  days: 30 },
  { name: "July 2026",      year: 2026, month: 6,  days: 31 },
  { name: "August 2026",    year: 2026, month: 7,  days: 31 },
  { name: "September 2026", year: 2026, month: 8,  days: 30 },
  { name: "October 2026",   year: 2026, month: 9,  days: 31 },
  { name: "November 2026",  year: 2026, month: 10, days: 30 },
  { name: "December 2026",  year: 2026, month: 11, days: 31 },
  { name: "January 2027",   year: 2027, month: 0,  days: 31 },
  { name: "February 2027",  year: 2027, month: 1,  days: 28 },
];

const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAY_NAMES_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const getTasksForDow = (dow) => [...DAILY_TASKS, ...(DOW_TASKS[dow] || [])];

const dateKey = (year, month, day) =>
  `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

const CAT_COLORS = {
  morning:  { bg: "#FFF8E1", dot: "#F59E0B", text: "#92400E" },
  food:     { bg: "#F0FDF4", dot
