# Könyv Nyilvántartó Rendszer

Ez a projekt az Alkalmazásfejlesztés tantárgy beadandó feladataként készült. A rendszer egy e2e (end-to-end) automatizált megoldás könyvek nyilvántartására, fejlesztéstől a telepítésig.

Csapatmunkában végzett feladatmegosztás

**Frontend (Vaska Henrietta/GitHub:ahenus):** Angular keretrendszer, OpenAPI alapú API integráció, UI komponensek, Pagination kezelése.

**Backend & DevOps (Kovács Tamás/GitHub:pomodoro90):** ASP.NET Core API, MongoDB integráció, Dockerizáció, GitHub Actions CI Pipeline, Kubernetes manifest fájlok.

## Alkalmazott Technológiák
**Frontend**: Angular 21 (TypeScript)

**Backend**: ASP.NET Core 10 (C#)

**Adatbázis**: MongoDB 8

**Infrastruktúra & CI/CD**: Docker, Kubernetes (K8s), Helm, GitHub Actions, GHCR.io

## Telepítési Útmutató (Deployment Guide)
Ez az útmutató bemutatja, hogyan telepíthető a teljes rendszer egy helyi Kubernetes környezetben (pl. Docker Desktop Kubernetes vagy Minikube).

### 1. Előfeltételek
Működő helyi Kubernetes klaszter.

Telepített ***kubectl*** parancssori eszköz.

Telepített ***helm*** csomagkezelő.

### 2. Adatbázis telepítése (Helm)
A MongoDB-t a hivatalos Bitnami Helm chart segítségével telepítjük hitelesítés nélkül a helyi teszteléshez:
```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install book-db bitnami/mongodb --set auth.enabled=false
```

### 3. Alkalmazásmodulok telepítése
A backend és frontend manifestek alkalmazása:
```
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
# Frontend manifestek (a frontend elkészülte után):
# kubectl apply -f k8s/frontend-deployment.yaml
# kubectl apply -f k8s/frontend-service.yaml
```

## Felhasználói Kézikönyv (User Guide)

### Funkciók
Könyvek böngészése: A kezdőoldalon látható a könyvek listája.

Lapozás (Pagination): A lista alján található navigációval válthatunk az oldalak között.

Új könyv hozzáadása: Az űrlap segítségével új könyvet rögzíthetünk az adatbázisba.

Keresés és Szűrés: Lehetőség van szerző vagy cím alapján szűrni a listát.

### Használati lépések

Indítsa el a rendszert a Telepítési útmutató alapján.

Nyissa meg a böngészőben a *http://localhost* címet (vagy a megadott NodePortot).

A főoldalon azonnal láthatóvá válik a könyvtár tartalma.

Új elem rögzítéséhez kattintson a "Hozzáadás" gombra és töltse ki a mezőket.

### Backend API Tesztelés (Tesztelőknek)
A backend mappában található egy *BookCatalog.http* fájl, amely tartalmazza az összes CRUD műveletet (*GET*, *POST*, *PUT*, *DELETE*). Ez közvetlenül VS Code-ból futtatható az API teszteléséhez.