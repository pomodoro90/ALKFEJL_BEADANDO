# Könyvnyilvántartó Rendszer

Ez a projekt az Alkalmazásfejlesztés tantárgy beadandó feladataként készült. A rendszer egy e2e (end-to-end) automatizált megoldás könyvek nyilvántartására, fejlesztéstől a telepítésig.

### Csapatmunkában végzett feladatmegosztás

**Frontend (Vaska Henrietta / GitHub: ahenus):** Angular keretrendszer beállítása, OpenAPI (Swagger) alapú automatikus API kliens generálás, UI komponensek elkészítése, Zoneless architektúra és Signals alapú állapotkezelés, Kliensoldali Pagination (lapozás) megvalósítása.

**Backend & DevOps (Kovács Tamás / GitHub: pomodoro90):** ASP.NET Core API, MongoDB integráció CORS beállításokkal, Dockerizáció, GitHub Actions CI Pipeline, Kubernetes manifest fájlok.

---

## 🛠️ Alkalmazott technológiák
* **Frontend**: Angular 21 (TypeScript, Zoneless architektúra, Signals, ng-openapi-gen)
* **Backend**: ASP.NET Core 10 (C#)
* **Adatbázis**: MongoDB 8
* **Infrastruktúra & CI/CD**: Docker, Kubernetes (K8s), Helm, GitHub Actions, GHCR.io

---

## Fejlesztői Környezet (Lokális futtatás)
Ha a rendszert fejlesztési célból, Kubernetes nélkül szeretné futtatni:

1. **Adatbázis indítása (Docker):**
   ```bash
   docker run -d -p 27017:27017 --name book-mongo mongo:latest


Backend indítása: A backend könyvtárból kiadva:
Bash
dotnet run




Frontend indítása: A frontend könyvtárból kiadva:
Bash
npm install
ng serve -o





☸️ Telepítési Útmutató (Deployment Guide)
Ez az útmutató bemutatja, hogyan telepíthető a teljes rendszer egy helyi Kubernetes környezetben (pl. Docker Desktop Kubernetes vagy Minikube).
1. Előfeltételek
Működő helyi Kubernetes klaszter.
Telepített kubectl parancssori eszköz.
Telepített helm csomagkezelő.
2. Adatbázis telepítése (Helm)
A MongoDB-t a hivatalos Bitnami Helm chart segítségével telepítjük hitelesítés nélkül a helyi teszteléshez:
Bash
helm repo add bitnami [https://charts.bitnami.com/bitnami](https://charts.bitnami.com/bitnami)
helm repo update
helm install book-db bitnami/mongodb --set auth.enabled=false


3. Alkalmazásmodulok telepítése
A backend és frontend manifestek alkalmazása a k8s mappából:
Bash
# Backend telepítése
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# Frontend telepítése
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml



📖 Felhasználói Kézikönyv (User Guide)
Funkciók (Teljes CRUD)
Könyvek böngészése (Read): A kezdőoldalon látható a könyvek dinamikus listája.
Új könyv hozzáadása (Create): Az oldal tetején található űrlap segítségével új könyvet rögzíthetünk az adatbázisba (cím, szerző, kiadás éve).
Könyvek szerkesztése (Update): A könyvek melletti "Szerkesztés" gombbal az adatok visszatöltődnek az űrlapba, ahol módosíthatók és frissíthetők.
Könyvek törlése (Delete): A "Törlés" gombra kattintva, egy biztonsági kérdés jóváhagyása után az elem véglegesen törlődik.
Lapozás (Pagination): A lista alján található navigációval (Előző/Következő) válthatunk az oldalak között (oldalanként 5 elem). A rendszer automatikusan újraszámolja az oldalakat hozzáadáskor és törléskor.
Használati lépések
Indítsa el a rendszert a Telepítési útmutató alapján.
Nyissa meg a böngészőben a http://localhost:4200 (lokális) vagy a K8s által megadott NodePort/LoadBalancer címet.
A főoldalon azonnal láthatóvá válik a könyvtár tartalma (üres adatbázis esetén a rendszer ezt külön jelzi).
Használja az űrlapot és a gombokat az adatok manipulálásához. Az oldal Signal-alapú reaktivitásának köszönhetően a változások oldalfrissítés nélkül, azonnal megjelennek.
Backend API Tesztelés (Tesztelőknek)
A backend mappában található egy BookCatalog.http fájl, amely tartalmazza az összes CRUD műveletet (GET, POST, PUT, DELETE). Ez közvetlenül VS Code-ból (REST Client kiterjesztéssel) futtatható az API végpontok nyers teszteléséhez.
