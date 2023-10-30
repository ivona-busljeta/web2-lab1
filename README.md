# [WEB2] Prva laboratorijska vježba

ZAHTJEVI
- neprijavljeni korisnik: vidi raspored i rezultate kola preko generirane poveznice
- prijavljeni korisnik: kreira natjecanje i unosi/uređuje rezultate utakmica

KREIRANJE NATJECANJA
- korisnik na početnoj stranici unosi naziv natjecanja, popis natjecatelja i sustav bodovanja
- broj natjecatelja: 4-8
- natjecatelji su odvojeni točkom zarez ili novim redom
- sustav bodovanja je u obliku pobjeda/remi/poraz
- provjera valjanosti podataka
- aplikacija generira raspored po jednokružnom sustavu natjecanja

PRIJAVA KORISNIKA
- odvija se korištenjem protokola OIDC i servisa Auth0
- pripremiti testni korisnički račun ili omogućiti prijavu putem Google računa

POHRANA PODATAKA
- PostgreSQL na Renderu
