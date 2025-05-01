Feladat- és időmenedzsment webalkalmazás

A projektemben egy olyan feladat- és időmenedzsment alkalmazást fejlesztek, ami a mindennapi teendőket segíti, felvehető feladatokkal, azok követésével. A rendszer lehetőséget biztosít feladatok létrehozására, időbeli ütemezésére, valamint vizuális áttekintésére.

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
