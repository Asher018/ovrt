# Ovrt

Projekt célja:

Egy böngészős játék, amely fix 16:9-es aspect ratio-val dolgozik, tehát teljesen mindegy, hogy a user hogyan méretezi az ablakot a játék effektíve ugyan az marad.

A játék célja, hogy rákattintsunk a képernyőben kék színű négyzetre, amely folyamatosan mozog egyre gyorsabban minden egyes kattintáskor egy bizonyos limitig. Továbbá egyre növekszik annak az esélye, hogy a négyzet véletlenszerűen vált irányt. Minden egyes kattintás egy pontot ér. A Játékban a kezdeti hátralévő idő 5 másodperc. Minden egyes kattintáskor 0.3 másodperc hozzáadódik a hátralévő időnkhöz. Ha kifutunk az időből vége a játéknak.

Projekt struktúrája:
Az alapja Angular 16. Egy fő komponensből áll, amiben meg van valósítva a UI és a logika nagy része. Tartalmaz observer mintát, amely azt a célt szolgálja, hogy a timer, illetve a score attribútumait módosítsa (szín, stb). A middleware minta szolgál a kattintás hatására történő dolgok elvégzéséért. 

Projekt futtatásához szükséges dolgok:

szükséges: node 18.16.0

angular cli: npm i @angular/cli

függőségek telepítése: npm install

program futtatása: ng serve