export const locationsByRegion = {
  "Sarajevo": [
    "Sarajevo - Centar", "Sarajevo - Novi Grad", "Sarajevo - Novo Sarajevo", 
    "Sarajevo - Stari Grad", "Hadžići", "Ilidža", "Ilijaš", "Trnovo", "Vogošća",
    "Istočna Ilidža", "Istočni Stari Grad", "Istočno Sarajevo"
  ],
  "Banja Luka Region": [
    "Banja Luka", "Čelinac", "Gradiška", "Jezero", "Kneževo", "Kostajnica", 
    "Kotor Varoš", "Kozarska Dubica", "Krupa na Uni", "Laktaši", "Mrkonjić Grad", 
    "Novi Grad", "Oštra Luka", "Prijedor", "Prnjavor", "Ribnik", "Šipovo", "Srbac"
  ],
  "Tuzla Region": [
    "Tuzla", "Banovići", "Čelić", "Doboj Istok", "Gračanica", "Gradačac", 
    "Kalesija", "Kladanj", "Lukavac", "Sapna", "Srebrenik", "Teočak", "Živinice"
  ],
  "Zenica-Doboj": [
    "Zenica", "Breza", "Doboj", "Doboj Jug", "Kakanj", "Maglaj", "Olovo", 
    "Tešanj", "Usora", "Vareš", "Visoko", "Zavidovići", "Žepče"
  ],
  "Mostar Region": [
    "Mostar", "Čapljina", "Čitluk", "Jablanica", "Konjic", "Neum", "Prozor", 
    "Ravno", "Stolac", "Grude", "Ljubuški", "Posušje", "Široki Brijeg", "Istočni Mostar"
  ],
  "Central Bosnia": [
    "Travnik", "Bugojno", "Busovača", "Dobretići", "Donji Vakuf", "Fojnica", 
    "Gornji Vakuf-Uskoplje", "Jajce", "Kiseljak", "Kreševo", "Novi Travnik", "Vitez"
  ],
  "Una-Sana": [
    "Bihać", "Bosanska Krupa", "Bosanski Petrovac", "Bužim", "Cazin", "Ključ", 
    "Sanski Most", "Velika Kladuša"
  ],
  "Posavina": [
    "Brčko", "Bijeljina", "Brod", "Derventa", "Domaljevac-Šamac", "Donji Žabar", 
    "Lopare", "Modriča", "Odžak", "Orašje", "Pelagićevo", "Petrovo", "Šamac", 
    "Stanari", "Teslić", "Ugljevik", "Vukosavlje"
  ],
  "Eastern Bosnia": [
    "Zvornik", "Bratunac", "Han Pijesak", "Milići", "Novo Goražde", "Osmaci", 
    "Pale", "Rogatica", "Rudo", "Šekovići", "Sokolac", "Srebrenica", "Višegrad", 
    "Vlasenica", "Goražde", "Ustikolina"
  ],
  "Herzegovina": [
    "Trebinje", "Berkovići", "Bileća", "Čajniče", "Foča", "Gacko", "Kalinovik", 
    "Ljubinje", "Nevesinje"
  ],
  "Western Bosnia": [
    "Livno", "Bosansko Grahovo", "Drvar", "Glamoč", "Kupres", "Tomislavgrad"
  ]
};

export const allLocations = Object.values(locationsByRegion).flat().sort();

export const yearBuiltOptions = [
  { value: "2025+", labelEn: "2025 or newer", labelBs: "2025 ili novije" },
  { value: "2020+", labelEn: "2020-2024", labelBs: "2020-2024" },
  { value: "2015+", labelEn: "2015-2019", labelBs: "2015-2019" },
  { value: "2010+", labelEn: "2010-2014", labelBs: "2010-2014" },
  { value: "2000 do 2009", labelEn: "2000-2009", labelBs: "2000 do 2009" },
  { value: "1990 do 1999", labelEn: "1990-1999", labelBs: "1990 do 1999" },
  { value: "1980 do 1989", labelEn: "1980-1989", labelBs: "1980 do 1989" },
  { value: "1970 do 1979", labelEn: "1970-1979", labelBs: "1970 do 1979" },
  { value: "1960 do 1969", labelEn: "1960-1969", labelBs: "1960 do 1969" },
  { value: "1950 do 1959", labelEn: "1950-1959", labelBs: "1950 do 1959" },
  { value: "Prije 1950", labelEn: "Before 1950", labelBs: "Prije 1950" }
];

export const conditionOptions = [
  { value: "Novogradnja", labelEn: "New Construction", labelBs: "Novogradnja" },
  { value: "Renoviran", labelEn: "Renovated", labelBs: "Renoviran" },
  { value: "Dobro stanje", labelEn: "Good Condition", labelBs: "Dobro stanje" },
  { value: "Parcijalno renoviran", labelEn: "Partially Renovated", labelBs: "Parcijalno renoviran" },
  { value: "Za renoviranje", labelEn: "Needs Renovation", labelBs: "Za renoviranje" },
  { value: "U izgradnji", labelEn: "Under Construction", labelBs: "U izgradnji" }
];

export const furnishedOptions = [
  { value: "Namješten", labelEn: "Furnished", labelBs: "Namješten" },
  { value: "Nenamješten", labelEn: "Unfurnished", labelBs: "Nenamješten" },
  { value: "Polunamješten", labelEn: "Semi-furnished", labelBs: "Polunamješten" }
];

export const heatingOptions = [
  { value: "Centralno (gradsko)", labelEn: "Central (City)", labelBs: "Centralno (gradsko)" },
  { value: "Centralno (Kotlovnica)", labelEn: "Central (Boiler Room)", labelBs: "Centralno (Kotlovnica)" },
  { value: "Centralno (Plin)", labelEn: "Central (Gas)", labelBs: "Centralno (Plin)" },
  { value: "Plin", labelEn: "Gas", labelBs: "Plin" },
  { value: "Struja", labelEn: "Electric", labelBs: "Struja" },
  { value: "Drva", labelEn: "Wood", labelBs: "Drva" },
  { value: "Ostalo", labelEn: "Other", labelBs: "Ostalo" }
];

export const getTranslatedLabel = (option: any, locale: string) => {
  return locale === 'bs' ? option.labelBs : option.labelEn;
};