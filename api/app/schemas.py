from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum

class LocationEnum(str, Enum):
    bihac = "Bihać"
    bosanska_krupa = "Bosanska Krupa"
    bosanski_petrovac = "Bosanski Petrovac"
    buzim = "Bužim"
    cazin = "Cazin"
    kljuc = "Ključ"
    sanski_most = "Sanski Most"
    velika_kladusa = "Velika Kladuša"
    domaljevac_samac = "Domaljevac-Šamac"
    odzaci = "Odžak"
    orasje = "Orašje"
    banovici = "Banovići"
    celic = "Čelić"
    doboj_istok = "Doboj Istok"
    gracanica = "Gračanica"
    gradacac = "Gradačac"
    kalesija = "Kalesija"
    kladan_j = "Kladanj"
    lukavac = "Lukavac"
    sapna = "Sapna"
    srebrenik = "Srebrenik"
    teocak = "Teočak"
    tuzla = "Tuzla"
    zivinice = "Živinice"
    breza = "Breza"
    doboj_jug = "Doboj Jug"
    kakan_j = "Kakanj"
    maglaj = "Maglaj"
    olovo = "Olovo"
    tesanj = "Tešanj"
    usora = "Usora"
    vares = "Vareš"
    visoko = "Visoko"
    zavidovici = "Zavidovići"
    zenica = "Zenica"
    zepce = "Žepče"
    gorazde = "Goražde"
    ustikolina = "Ustikolina"
    bugojno = "Bugojno"
    busovaca = "Busovača"
    dobretici = "Dobretići"
    donji_vakuf = "Donji Vakuf"
    fojnica = "Fojnica"
    gornji_vakuf_uskoplje = "Gornji Vakuf-Uskoplje"
    jajce = "Jajce"
    kiseljak = "Kiseljak"
    kresevo = "Kreševo"
    novi_travnik = "Novi Travnik"
    travnik = "Travnik"
    vitez = "Vitez"
    capljina = "Čapljina"
    citluk = "Čitluk"
    jablanica = "Jablanica"
    konjic = "Konjic"
    mostar = "Mostar"
    neum = "Neum"
    prozor = "Prozor"
    ravno = "Ravno"
    stolac = "Stolac"
    grude = "Grude"
    ljubuski = "Ljubuški"
    posusje = "Posušje"
    siroki_brijeg = "Široki Brijeg"
    hadzici = "Hadžići"
    ilidza = "Ilidža"
    ilijas = "Ilijaš"
    sarajevo_centar = "Sarajevo - Centar"
    sarajevo_novi_grad = "Sarajevo - Novi Grad"
    sarajevo_novo_sarajevo = "Sarajevo - Novo Sarajevo"
    sarajevo_stari_grad = "Sarajevo - Stari Grad"
    trnovo = "Trnovo"
    vogosca = "Vogošća"
    bosansko_grahovo = "Bosansko Grahovo"
    drvar = "Drvar"
    glamoc = "Glamoč"
    kupres = "Kupres"
    livno = "Livno"
    tomislavgrad = "Tomislavgrad"
    banja_luka = "Banja Luka"
    celinac = "Čelinac"
    gradiska = "Gradiška"
    jezero = "Jezero"
    knezevo = "Kneževo"
    kostajnica = "Kostajnica"
    kotor_varos = "Kotor Varoš"
    kozarska_dubica = "Kozarska Dubica"
    krupa_na_uni = "Krupa na Uni"
    laktasi = "Laktaši"
    mrkonjic_grad = "Mrkonjić Grad"
    novi_grad = "Novi Grad"
    ostra_luka = "Oštra Luka"
    prijedor = "Prijedor"
    prnjavor = "Prnjavor"
    ribnik = "Ribnik"
    sipovo = "Šipovo"
    srbac = "Srbac"
    bijeljina = "Bijeljina"
    brod = "Brod"
    derventa = "Derventa"
    doboj = "Doboj"
    donji_zabar = "Donji Žabar"
    lopare = "Lopare"
    modrica = "Modriča"
    pelagicevo = "Pelagićevo"
    petrovo = "Petrovo"
    samac = "Šamac"
    stanari = "Stanari"
    teslic = "Teslić"
    ugljevik = "Ugljevik"
    vukosavlje = "Vukosavlje"
    bratunac = "Bratunac"
    han_pijesak = "Han Pijesak"
    istocna_ilidza = "Istočna Ilidža"
    istocni_stari_grad = "Istočni Stari Grad"
    istocno_sarajevo = "Istočno Sarajevo"
    milici = "Milići"
    novo_gorazde = "Novo Goražde"
    osmaci = "Osmaci"
    pale = "Pale"
    rogatica = "Rogatica"
    rudo = "Rudo"
    sekovici = "Šekovići"
    sokolac = "Sokolac"
    srebrenica = "Srebrenica"
    visegrad = "Višegrad"
    vlasenica = "Vlasenica"
    zvornik = "Zvornik"
    berkovici = "Berkovići"
    bileca = "Bileća"
    cajnice = "Čajniče"
    foca = "Foča"
    gacko = "Gacko"
    istocni_mostar = "Istočni Mostar"
    kalinovik = "Kalinovik"
    ljubinje = "Ljubinje"
    nevesinje = "Nevesinje"
    trebinje = "Trebinje"
    brcko = "Brčko"

class ConditionEnum(str, Enum):
    novogradnja = "Novogradnja"
    renoviran = "Renoviran"
    dobro_stanje = "Dobro stanje"
    parcijalno_renoviran = "Parcijalno renoviran"
    za_renoviranje = "Za renoviranje"
    u_izgradnji = "U izgradnji"

class FurnishedEnum(str, Enum):
    namjesten = "Namješten"
    nenamjesten = "Nenamješten"
    polunamjesten = "Polunamješten"

class HeatingEnum(str, Enum):
    struja = "Struja"
    plin = "Plin"
    drva = "Drva"
    centralno_gradsko = "Centralno (gradsko)"
    centralno_kotlovnica = "Centralno (Kotlovnica)"
    centralno_plin = "Centralno (Plin)"
    ostalo = "Ostalo"

class YearBuiltEnum(str, Enum):
    y2025_plus = "2025+"
    y2020_plus = "2020+"
    y2015_plus = "2015+"
    y2010_plus = "2010+"
    y2000_2009 = "2000 do 2009"
    y1990_1999 = "1990 do 1999"
    y1980_1989 = "1980 do 1989"
    y1970_1979 = "1970 do 1979"
    y1960_1969 = "1960 do 1969"
    y1950_1959 = "1950 do 1959"
    prije_1950 = "Prije 1950"


class ApartmentPredictionRequest(BaseModel):
    """Defines the user-friendly input schema for apartment predictions."""
    location: LocationEnum
    size_m2: float = Field(..., ge=15)
    rooms: float = Field(..., ge=1)
    floor: int = Field(..., gt = -5)
    bathrooms: Optional[int] = Field(default=1, ge=1)
    year_built: YearBuiltEnum
    condition: ConditionEnum
    furnished: FurnishedEnum
    heating_type: HeatingEnum
    has_balcony: bool = False
    has_garage: bool = False
    has_parking: bool = False
    has_elevator: bool = False
    is_registered: bool = True
    has_armored_door: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "location": "Sarajevo - Novi Grad",
                "size_m2": 65.0,
                "rooms": 2.0,
                "floor": 5,
                "bathrooms": 1,
                "year_built": "2010+",
                "condition": "Novogradnja",
                "furnished": "Namješten",
                "heating_type": "Centralno (gradsko)",
                "has_balcony": True,
                "has_parking": True,
                "has_elevator": True,
                "has_garage": True,
                "is_registered": True,
                "has_armored_door": True
            }
        }