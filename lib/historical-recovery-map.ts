/**
 * The Movie Trailer
 * Historical Domain Recovery Map
 *
 * Maps historical TMT movie subdomains to their modern canonical
 * movie pages.
 *
 * IMPORTANT:
 * This file is currently DATA ONLY.
 * Do not activate redirects from this map until the historical
 * domain/DNS configuration is under our control and has been tested.
 */

export type HistoricalRecoveryEntry = {
  historicalHost: string;
  destination: string;
  referringDomains: number;
  mozRows: number;
};

export const historicalRecoveryMap: HistoricalRecoveryEntry[] = [
  {
    historicalHost: "bridesmaids.the-movie-trailer.com",
    destination: "/movies/bridesmaids",
    referringDomains: 56,
    mozRows: 143,
  },
  {
    historicalHost: "abduction.the-movie-trailer.com",
    destination: "/movies/abduction",
    referringDomains: 55,
    mozRows: 131,
  },
  {
    historicalHost: "paul.the-movie-trailer.com",
    destination: "/movies/paul",
    referringDomains: 44,
    mozRows: 177,
  },
  {
    historicalHost: "looper.the-movie-trailer.com",
    destination: "/movies/looper",
    referringDomains: 44,
    mozRows: 159,
  },
  {
    historicalHost: "black-swan.the-movie-trailer.com",
    destination: "/movies/black-swan",
    referringDomains: 40,
    mozRows: 202,
  },
  {
    historicalHost: "dark-knight-rises.the-movie-trailer.com",
    destination: "/movies/the-dark-knight-rises",
    referringDomains: 40,
    mozRows: 158,
  },
  {
    historicalHost: "red-riding-hood.the-movie-trailer.com",
    destination: "/movies/red-riding-hood",
    referringDomains: 38,
    mozRows: 180,
  },
  {
    historicalHost: "mr-poppers-penguins.the-movie-trailer.com",
    destination: "/movies/mr-poppers-penguins",
    referringDomains: 35,
    mozRows: 157,
  },
  {
    historicalHost: "127-hours.the-movie-trailer.com",
    destination: "/movies/127-hours",
    referringDomains: 31,
    mozRows: 148,
  },
  {
    historicalHost: "water-for-elephants.the-movie-trailer.com",
    destination: "/movies/water-for-elephants",
    referringDomains: 30,
    mozRows: 147,
  },
  {
    historicalHost: "one-day.the-movie-trailer.com",
    destination: "/movies/one-day",
    referringDomains: 27,
    mozRows: 79,
  },
  {
    historicalHost: "unstoppable.the-movie-trailer.com",
    destination: "/movies/unstoppable",
    referringDomains: 26,
    mozRows: 168,
  },
  {
    historicalHost: "horns.the-movie-trailer.com",
    destination: "/movies/horns",
    referringDomains: 25,
    mozRows: 93,
  },
  {
    historicalHost: "harry-potter-8.the-movie-trailer.com",
    destination:
      "/movies/harry-potter-and-the-deathly-hallows-part-2",
    referringDomains: 24,
    mozRows: 130,
  },
  {
    historicalHost: "tinker-tailor-soldier-spy.the-movie-trailer.com",
    destination: "/movies/tinker-tailor-soldier-spy",
    referringDomains: 23,
    mozRows: 88,
  },
  {
    historicalHost: "tom-and-jerry.the-movie-trailer.com",
    destination: "/movies/tom-and-jerry",
    referringDomains: 23,
    mozRows: 117,
  },
  {
    historicalHost: "apparition.the-movie-trailer.com",
    destination: "/movies/the-apparition",
    referringDomains: 23,
    mozRows: 82,
  },
  {
    historicalHost: "lucky-one.the-movie-trailer.com",
    destination: "/movies/the-lucky-one",
    referringDomains: 23,
    mozRows: 94,
  },
  {
    historicalHost: "moneyball.the-movie-trailer.com",
    destination: "/movies/moneyball",
    referringDomains: 23,
    mozRows: 97,
  },
  {
    historicalHost:
      "twilight-breaking-dawn-2.the-movie-trailer.com",
    destination:
      "/movies/the-twilight-saga-breaking-dawn-part-2",
    referringDomains: 23,
    mozRows: 102,
  },
  {
    historicalHost: "zookeeper.the-movie-trailer.com",
    destination: "/movies/zookeeper",
    referringDomains: 23,
    mozRows: 122,
  },
  {
    historicalHost: "dream-house.the-movie-trailer.com",
    destination: "/movies/dream-house",
    referringDomains: 23,
    mozRows: 58,
  },
  {
    historicalHost: "beaver.the-movie-trailer.com",
    destination: "/movies/the-beaver",
    referringDomains: 22,
    mozRows: 105,
  },
  {
    historicalHost: "lincoln-lawyer.the-movie-trailer.com",
    destination: "/movies/the-lincoln-lawyer",
    referringDomains: 21,
    mozRows: 102,
  },
  {
    historicalHost: "true-grit.the-movie-trailer.com",
    destination: "/movies/true-grit",
    referringDomains: 21,
    mozRows: 132,
  },
  {
    historicalHost: "midnight-in-paris.the-movie-trailer.com",
    destination: "/movies/midnight-in-paris",
    referringDomains: 20,
    mozRows: 88,
  },
  {
    historicalHost: "conspirator.the-movie-trailer.com",
    destination: "/movies/the-conspirator",
    referringDomains: 20,
    mozRows: 125,
  },
  {
    historicalHost: "margin-call.the-movie-trailer.com",
    destination: "/movies/margin-call",
    referringDomains: 16,
    mozRows: 65,
  },
  {
    historicalHost: "take-shelter.the-movie-trailer.com",
    destination: "/movies/take-shelter",
    referringDomains: 13,
    mozRows: 64,
  },
  {
    historicalHost: "friends-with-kids.the-movie-trailer.com",
    destination: "/movies/friends-with-kids",
    referringDomains: 12,
    mozRows: 44,
  },
   {
    historicalHost: "tamara-drewe.the-movie-trailer.com",
    destination: "/movies/tamara-drewe",
    referringDomains: 11,
    mozRows: 45,
  },
  {
    historicalHost: "arthur.the-movie-trailer.com",
    destination: "/movies/arthur",
    referringDomains: 18,
    mozRows: 108,
  },
  {
    historicalHost: "coriolanus.the-movie-trailer.com",
    destination: "/movies/coriolanus",
    referringDomains: 17,
    mozRows: 81,
  },
  {
    historicalHost: "change-up.the-movie-trailer.com",
    destination: "/movies/the-change-up",
    referringDomains: 15,
    mozRows: 46,
  },
    {
    historicalHost: "trespass.the-movie-trailer.com",
    destination: "/movies/trespass",
    referringDomains: 21,
    mozRows: 106,
  },
  {
    historicalHost: "dont-be-afraid-of-the-dark.the-movie-trailer.com",
    destination: "/movies/dont-be-afraid-of-the-dark",
    referringDomains: 20,
    mozRows: 123,
  },
  {
    historicalHost: "contraband.the-movie-trailer.com",
    destination: "/movies/contraband",
    referringDomains: 20,
    mozRows: 87,
  },
  {
    historicalHost: "taken-2.the-movie-trailer.com",
    destination: "/movies/taken-2",
    referringDomains: 20,
    mozRows: 84,
  },
  {
    historicalHost: "friends-with-benefits.the-movie-trailer.com",
    destination: "/movies/friends-with-benefits",
    referringDomains: 20,
    mozRows: 82,
  },
  {
    historicalHost: "charlie-st-cloud.the-movie-trailer.com",
    destination: "/movies/charlie-st-cloud",
    referringDomains: 19,
    mozRows: 99,
  },
    {
    historicalHost: "next-three-days.the-movie-trailer.com",
    destination: "/movies/the-next-three-days",
    referringDomains: 16,
    mozRows: 116,
  },
  {
    historicalHost: "the-help.the-movie-trailer.com",
    destination: "/movies/the-help",
    referringDomains: 18,
    mozRows: 90,
  },
  {
    historicalHost: "son-of-no-one.the-movie-trailer.com",
    destination: "/movies/the-son-of-no-one",
    referringDomains: 18,
    mozRows: 91,
  },
  {
    historicalHost: "tower-heist.the-movie-trailer.com",
    destination: "/movies/tower-heist",
    referringDomains: 16,
    mozRows: 83,
  },
  {
    historicalHost: "blitz.the-movie-trailer.com",
    destination: "/movies/blitz",
    referringDomains: 16,
    mozRows: 83,
  },
  {
    historicalHost: "mr-peabody-and-sherman.the-movie-trailer.com",
    destination: "/movies/mr-peabody-and-sherman",
    referringDomains: 18,
    mozRows: 67,
  },
    {
    historicalHost: "my-idiot-brother.the-movie-trailer.com",
    destination: "/movies/our-idiot-brother",
    referringDomains: 16,
    mozRows: 81,
  },
  {
    historicalHost: "upside-down.the-movie-trailer.com",
    destination: "/movies/upside-down",
    referringDomains: 16,
    mozRows: 77,
  },
  {
    historicalHost: "rampart.the-movie-trailer.com",
    destination: "/movies/rampart",
    referringDomains: 15,
    mozRows: 76,
  },
  {
    historicalHost: "cosmopolis.the-movie-trailer.com",
    destination: "/movies/cosmopolis",
    referringDomains: 16,
    mozRows: 42,
  },
];

/**
 * Fast hostname lookup for the future redirect layer.
 *
 * Nothing currently imports or executes this lookup.
 */
export const historicalRecoveryLookup = new Map(
  historicalRecoveryMap.map((entry) => [
    entry.historicalHost,
    entry.destination,
  ]),
);

