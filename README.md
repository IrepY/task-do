Feladat- és időmenedzsment webalkalmazás

A projektemben egy olyan feladat- és időmenedzsment alkalmazást fejlesztek, ami a mindennapi teendőket segíti, felvehető feladatokkal, azok követésével. A rendszer lehetőséget biztosít feladatok létrehozására, időbeli ütemezésére, valamint vizuális áttekintésére.

![Screenshot 2025-05-02 173408](https://github.com/user-attachments/assets/588f4e40-a137-432c-a9d8-5d6c2f080d91)
![Screenshot 2025-05-02 173419](https://github.com/user-attachments/assets/97d6bf1f-5aa1-4f8e-9d83-aa3fa7022df0)
![Screenshot 2025-05-02 173557](https://github.com/user-attachments/assets/51427263-e589-41eb-8965-b73eaa22097c)
![Screenshot 2025-05-02 173616](https://github.com/user-attachments/assets/403cad29-6815-4f99-918f-c6ce9104b1ac)
![Screenshot 2025-05-02 173624](https://github.com/user-attachments/assets/4ebc3374-6cd6-4ffa-8aed-bc6c64161431)


Alapvető funkciók:

Feladatok létrehozása, szerkesztése, törlése

Feladatokhoz határidő hozzárendelése

Feladatok állapotának módosítása (pl: függőben, kész)


Használt programnyelvek és keretrendszerek:

Backend: Python és FastAPI
Frontend: React.js + Tailwind CSS
Adatbázis: SQLite 

Fejlesztői környezet: GitHub, VS Code

A futtatáshoz szükség van pythonra és node.js-re!

Telepítési útmutató:

1. Hozzunk létre egy üres mappát valahol a saját gépen.
2. Futtassuk a mappában az alábbi parancsot: ```git clone https://github.com/IrepY/task-do/```
4. Hozzunk létre egy python virtuális környezetet: ```python -m venv venv```
5. Aktiváljuk a virtuális python környezetet: ```venv/Scripts/activate.bat``` -- Amennyiben a paracs windows környezetben nem fut le, futtassuk kézzel az "activate.bat" fájlt
6. Lépjünk be az alkalmazás mappájába: ```cd task-do```
7. Telepítsük a 2 szükséges pip modult: ```pip install fastapi, uvicorn```
8. Lépjünk be a backend mappájába: ```cd backend```
9. Futtassuk az uvicorn környezetet: ```uvicorn main:app --reload```
10. Egy új terminálban lépjünk be a frontend mappájába: ```cd task-manager-frontend```
11. Telepítsük a szükséges node modulokat: ```npm install```
12. Futtassuk a frontend szervert: ```npm run dev```
13. Lépjünk fel a ```http://localhost:5173/``` oldalra az alkalmazás eléréséhez
