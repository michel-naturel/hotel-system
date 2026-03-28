# Hotel System

System zarządzania hotelem (MVP) z podziałem na:

* panel publiczny (rezerwacje)
* panel recepcjonisty (kalendarz, rezerwacje)
* panel administratora (zarządzanie hotelami i pokojami)

---

# Uruchomienie projektu

## 1. Klonowanie repozytorium

```bash
git clone https://github.com/TWOJ_LOGIN/hotel-system.git
cd hotel-system
```

---

## 2. Instalacja zależności

```bash
npm install
```

---

## 3. Konfiguracja środowiska

Utwórz plik `.env` na podstawie `.env.example`:

```bash
cp .env.example .env
```

### Przykładowy `.env`:

```env
VITE_API_URL=http://localhost:3000
```

---

## 4. Uruchomienie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod:

```
http://localhost:5173
```

---

# Architektura projektu

```
/src
  /components     → komponenty UI (RoomDashboard, etc.)
  /pages          → widoki (Hotels, Calendar, etc.)
  /api            → komunikacja z backendem
```

---

# Backend / API

Frontend komunikuje się z backendem przez REST API.

## Base URL

```
http://localhost:3000
```

(ustawiane przez `.env` → `VITE_API_URL`)

---

# Endpointy API

## Hotele

### GET /hotels

Zwraca listę hoteli

```json
[
  {
    "id": 1,
    "name": "Hotel A",
    "address": "Warszawa"
  }
]
```

---

## Pokoje

### GET /rooms?hotelId=1

Pobiera pokoje dla hotelu

```json
[
  {
    "id": 1,
    "number": "101",
    "type": "double",
    "price": 200,
    "hotelId": 1
  }
]
```

---

### PUT /rooms/:id

Aktualizacja pokoju

```json
{
  "type": "single",
  "price": 150
}
```

---

## Rezerwacje

### GET /reservations

Lista wszystkich rezerwacji

```json
[
  {
    "id": 1,
    "roomId": 1,
    "hotelId": 1,
    "guestName": "Jan Kowalski",
    "fromDate": "2026-03-28",
    "toDate": "2026-03-30"
  }
]
```

---

### POST /reservations

```json
{
  "roomId": 1,
  "hotelId": 1,
  "guestName": "Jan Kowalski",
  "fromDate": "2026-03-28",
  "toDate": "2026-03-30"
}
```

---

### DELETE /reservations/:id

Usuwa rezerwację

---

# Role w systemie

## Public

* przeglądanie pokoi
* tworzenie rezerwacji

---

## Recepcjonista

* kalendarz rezerwacji
* zarządzanie rezerwacjami
* usuwanie rezerwacji

---

## Admin

* zarządzanie hotelami
* zarządzanie pokojami
* edycja danych pokoi

---

# Kalendarz

Kalendarz:

* wyświetla rezerwacje w układzie dni
* bazuje na:

  * `rooms`
  * `reservations`
* wymaga `hotelId`

---

# Ważne uwagi

## Zależność od `hotelId`

Większość widoków wymaga wybranego hotelu.

---

## API musi działać

Frontend NIE zadziała bez backendu.

---

## node_modules

Nie są wersjonowane — trzeba zrobić:

```bash
npm install
```

---

# 🛠️ Development

## Start dev servera

```bash
npm run dev
```

---

## Build (opcjonalnie)

```bash
npm run build
```

---

# Typowe problemy

## "Nie działa u mnie"

Sprawdź:

* czy działa backend (`localhost:3000`)
* czy `.env` jest poprawny
* czy zrobiłeś `npm install`

---

## Brak danych w kalendarzu

* sprawdź `hotelId`
* sprawdź endpoint `/reservations`

---

## Biały ekran

* sprawdź Console (F12)
* najczęściej crash w komponencie

---

# Współpraca

## Branching (prosty flow)

```bash
git checkout -b feature/nazwa
git commit -m "opis"
git push
```

---

# TODO (roadmap)

* [ ] logowanie (admin / recepcja)
* [ ] filtrowanie kalendarza
* [ ] tworzenie rezerwacji z kalendarza
* [ ] deploy (Vercel / Railway)

---

# Autorzy:
Hisaoka Oskar
Kostrzewa Michał
Kostyła Wiktoria
Nuckowski Michał
Ruczyńska Nikola

Projekt rozwijany jako system PMS (Property Management System) MVP.

---

Jeśli coś nie działa — sprawdź Console i API.
