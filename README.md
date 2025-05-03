## Projekt célja és célkitűzései

A projektem célja egy modern, webes feladat- és időmenedzsment alkalmazás fejlesztése, amely lehetővé teszi a napi teendők rögzítését, kezelését, állapotuk követését és határidőhöz rendelését. Az alkalmazás főbb funkciói:
- Feladatok létrehozása, szerkesztése, törlése.
- Feladatokhoz határidő rendelése, állapot (függőben/kész) módosítása.
- Átlátható, felhasználóbarát felület.
- Több nyelv támogatása (magyar/angol).
- Sötét/világos mód támogatása.

## A használt szoftvereszközök, keretrendszerek és könyvtárak kiválasztásának indoklása

- **Frontend:**  
  - **React.js**: Modern, komponens-alapú felépítés.
  - **Tailwind CSS**: Utility-first CSS framework, gyors, reszponzív, könnyen testreszabható.
  - **react-i18next**: Egyszerű többnyelvűség támogatás.
- **Backend:**  
  - **Python + FastAPI**: Gyors fejlesztés, aszinkron támogatás, automatikus OpenAPI dokumentáció.
  - **SQLite**: Egyszerű, fejlesztéshez ideális, nincs szükség külön szerverre.
- **Egyéb:**  
  - **Vite**: Gyors fejlesztői szerver.
  - **Node.js**: Frontend fejlesztői környezethez.

## Telepítési és üzembe helyezési útmutató

1. **Környezeti előfeltételek:**  
   - Python 3.8+  
   - Node.js 16+  
   - Git

2. **Projekt klónozása:**  
   ```
   git clone https://github.com/IrepY/task-do/
   cd task-do
   ```

3. **Python virtuális környezet létrehozása és aktiválása:**  
   ```
   python -m venv venv
   # Windows:
   venv\Scripts\activate.bat
   # Linux/Mac:
   source venv/bin/activate
   ```

4. **Backend-hez szükséges modulok telepítése:**  
   ```
   pip install fastapi uvicorn
   ```

5. **Backend szerver indítása:**  
   ```
   cd backend
   uvicorn main:app --reload
   ```

6. **Frontend telepítése és indítása (új terminálban):**  
   ```
   cd task-manager-frontend
   npm install
   npm run dev
   ```

7. **Alkalmazás elérése:**  
   - Nyisd meg a böngészőben: [http://localhost:5173/](http://localhost:5173/)

## Rendszer architektúra és megvalósítás

### Áttekintés

A rendszer két fő komponensből áll:
- **Backend (API szerver):** REST API FastAPI-vel, SQLite adatbázissal.
- **Frontend:** React-alapú egyoldalas alkalmazás, Tailwind CSS-sel.

#### Backend

- **main.py**: FastAPI alkalmazás, CRUD végpontok `/tasks` útvonalon.
- **db.py**: SQLite kapcsolat és inicializálás.
- **Adatmodell:**  
  - `Task`: id, title, description, completed, due_date mezőkkel.
- **Funkciók:**  
  - Feladatok lekérdezése, létrehozása, módosítása (részleges PATCH), törlése.
  - Hibakezelés, státuszkódok, CORS támogatás.

#### Frontend

- **React komponensek:**  
  - `App.jsx`: Fő komponens, nézetváltás, állapotkezelés.
  - `TaskList`, `TaskItem`, `TaskDetailView`, `TaskForm`: Feladatok listázása, részletei, szerkesztése, hozzáadása.
  - `MenuPanel`, `MenuItem`: Oldalsó menü, navigáció.
  - `SettingsView`, `ProfileView`, `AboutView`: Beállítások, profil, névjegy.
- **Állapotkezelés:**  
  - React `useState`, `useEffect`, `useCallback` hookok.
  - Feladatok listája, kiválasztott feladat, animációs állapotok.
- **API kommunikáció:**  
  - `apiService.js`: REST hívások a FastAPI backendhez.
- **Nemzetköziesítés:**  
  - `i18n.js`, fordítási JSON-ok.
- **Reszponzivitás:**  
  - Saját `useMediaQuery` hook, Tailwind breakpoints.
- **Sötét/világos mód:**  
  - Tailwind dark mode, localStorage-ban tárolt beállítás.

#### Folyamatok

- **Feladat létrehozás:**  
  - Űrlap kitöltése → POST `/tasks` → lista frissül.
- **Feladat szerkesztés:**  
  - Részletek nézetben szerkesztés → PATCH `/tasks/{id}` → lista frissül.
- **Feladat törlés:**  
  - Törlés gomb → DELETE `/tasks/{id}` → animáció, lista frissül.
- **Állapotváltás:**  
  - Kész/függőben kapcsoló → PATCH `/tasks/{id}`.

#### Hibakezelés

- Backend oldalon HTTP státuszkódok, részletes hibaüzenetek.
- Frontenden felhasználóbarát hibaüzenetek, visszaállítás sikertelen művelet esetén.

#### Telepítés/üzemeltetés

- A rendszer fejlesztői és teszt környezetben SQLite-ot használ, így nem igényel külön adatbázis szervert.
- A frontend és backend külön fejlesztői szerveren fut, CORS beállításokkal.

---

![Screenshot 2025-05-02 173408](https://github.com/user-attachments/assets/588f4e40-a137-432c-a9d8-5d6c2f080d91)
![Screenshot 2025-05-02 173419](https://github.com/user-attachments/assets/97d6bf1f-5aa1-4f8e-9d83-aa3fa7022df0)
![Screenshot 2025-05-02 173557](https://github.com/user-attachments/assets/51427263-e589-41eb-8965-b73eaa22097c)
![Screenshot 2025-05-02 173616](https://github.com/user-attachments/assets/403cad29-6815-4f99-918f-c6ce9104b1ac)
![Screenshot 2025-05-02 173624](https://github.com/user-attachments/assets/4ebc3374-6cd6-4ffa-8aed-bc6c64161431)