# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"cow-foot-app" (slug in `app.json`, package name `cow-foot-app`): an Expo / React Native app for bovine hoof-care (podología bovina). A hoof trimmer records farms (`fincas`), animals (`vacas`), per-hoof lesion history (`historial_vacas`), a disease catalogue (`lista_enfermedades`) and their own professional profile (`user`), then generates PDF reports and invoices. All data is **local SQLite on the device**; there is no backend. UI strings, table/column names and most identifiers are in Spanish.

## Commands

```bash
npm install
npx expo start --dev-client      # Metro for a dev-client build (npm start)
npx expo run:ios                 # build + run iOS (needs pod install; see fmt fix below)
npx expo run:android
npx expo prebuild --clean        # regenerate ios/ and android/ (ios/ is gitignored, android/ is tracked)
eas build --profile <development|preview|production|production-prebuild|local> --platform ios
```

There are no tests and no lint script. An `eslintConfig` (standard + standard-jsx + standard-react, `babel-eslint` parser) exists in `package.json` but eslint itself is not installed; run `npx eslint src` only if you add it.

Version bumps must be made in both `package.json` and `app.json` (`expo.version`); they are kept in sync manually.

### iOS build gotcha: `plugins/withFmtFix.js`

React Native 0.76 pulls in fmt 11 which fails to compile under Xcode 16+/26 (`consteval`). The config plugin registered in `app.json` injects a Podfile `post_install` patch that edits `Pods/fmt/include/fmt/base.h`. If iOS builds break on fmt after upgrading RN/Expo, look there first. It only takes effect through `expo prebuild` / EAS, not by editing `ios/Podfile` by hand.

### Inspecting the simulator database

The SQLite file is `cowdatabasetest5.db` (constant `databaseName` in `src/hooks/useRepositories.js`). On the iOS simulator it lives under `~/Library/Developer/CoreSimulator/Devices/<device>/data/Containers/Data/Application/<app>/Documents/ExponentExperienceData/@anders17/cow-foot-app/SQLite/`. Query it with `sqlite3 <path> '<sql>'`. Renaming the constant effectively wipes user data (a new empty DB is created).

## Architecture

### Entry and routing

`index.js` → `App.js` → `src/components/Main.jsx`. `App.js` wraps everything in `ApolloProvider` + `NativeRouter` (react-router-native v6). Routing is declared in `Main.jsx`:

| Path | Component | Purpose |
|---|---|---|
| `/` | `components/ItemsMenu.jsx` | Home menu |
| `/home` | `components/RepositoryList.jsx` | Farm list (`?isBill=true` switches it into "pick a farm for invoicing" mode) |
| `/pawpage` | `pages/PawPage.jsx` | Record a hoof-trimming case (the core screen, ~840 lines) |
| `/historial` | `components/HistorialFinca.jsx` | Case history for a farm |
| `/bill` | `pages/bill-page/Bill.jsx` | Invoice builder |
| `/user` | `pages/User.jsx` | Professional profile (name, bank, logo) |
| `/signin` | `pages/LogIn.jsx` | Unused in the normal flow |

**State is passed between screens via URL query strings**, not router state or context: callers build `URLSearchParams` and `navigate('/historial?...')`; receivers do `queryString.parse(useLocation().search)`. Keep that convention when adding screens.

The Apollo client (`src/utils/apolloClient.js`) points at a hard-coded LAN IP and **no component runs any GraphQL query**; it is leftover scaffolding. Likewise `src/data/menuData.js` and `src/data/repositories.js` are unused mock data from the tutorial the app was started from ("Repository*" component names come from there too, they now list farms/animals).

### Data layer: `src/hooks/useRepositories.js`

Despite the name and the `use*` export, these are **plain async functions, not React hooks**; components call them inside `useEffect`/handlers with `await`. Every function opens the DB with `SQLite.openDatabaseAsync(databaseName)`, runs `CREATE TABLE IF NOT EXISTS ...` for the table it touches, then executes its query. There are no migrations files: schema evolution is done with `add<Column>ColumnIfNotExists(db)` helpers (`extremidad` on `historial_vacas`, `logo` on `user`) that are called from each function touching that table. When adding a column, follow that pattern and call the helper from every reader/writer of the table, because any of them may be the first to run on an existing install.

Tables: `fincas`, `vacas` (FK `finca`), `historial_vacas` (one row **per hoof** per case; `extremidad` holds the hoof code, `fecha` is the case date, and "latest case" = all rows sharing the newest `date(fecha)` for that animal, see `ultimaHistoriaVaca`), `lista_enfermedades` (user-editable disease catalogue), `user`. `exportDatabase` / `importDatabase` dump/restore all five tables as JSON through `expo-file-system` + `expo-sharing` / `expo-document-picker`; that is the only backup mechanism.

Some queries interpolate ids into SQL strings; prefer the parameterised `db.runAsync(sql, ...params)` form used by the newer functions.

### Hoof recording (`PawPage.jsx` + SVG hoof components)

The case form is Formik-based. Hoof selection uses three interactive SVG components built on `react-native-svg`: `src/pata-svg/Hoof.js` (bottom view, zones from `hoofpaths.js`), `src/patas-lado-svg/Hoof.js` (side view) and `src/patas-lado-arriba-svg/Hoof.js` (top/side view). Each `Path` is a tappable zone whose fill colour toggles and which reports the selected zone/side back through setter props. Option lists (hoof codes `AI/AD/PI/PD`, treatments, severity `I/II/III`, zone numbers) live in `src/utils/pawOptions.js`; the built-in disease codes there are the defaults, but the live list comes from `lista_enfermedades`. The button-group folders `src/component-button*`, each with a `card/Card.jsx`, are the selectable chips for disease / treatment / severity.

`historial_vacas.enfermedades` stores the composed lesion string produced on this screen, so any change to how codes are concatenated affects the reports below.

### Reports and invoices

Documents are generated **remotely**: the app POSTs the data to `https://contractual.papeleo.co/api/generate-pawn-*` and the server creates a Google Doc (requires connectivity; the buttons watch `@react-native-community/netinfo`).

- `components/GenerateReport.jsx` (opened from the history screen): hoof-health report for a farm over a date range (`fetchHistorialVacas(id, startDate, endDate)`).
- `pages/bill-page/Bill.jsx` → `components/precio` (line items, defaults from `src/utils/initialValuePrice.js`) → `PDFGeneerate.jsx` / `PDFBillReport.jsx`, which today only render the `DocsBillReport.jsx` / `DocsReport.jsx` Google Docs buttons. Both PDF components still contain a local HTML → `expo-print` → WebView preview flow (`showPreview`/`printToFile`) but nothing triggers it. `PDFGeneerateReport.jsx` and the `sala` / `informe` / `modal-cow-list` sub-folders are unused. The professional's data and logo (base64 in `user.logo`) come from the `user` table.

The "Geneerate" misspelling is in the file names; do not "fix" it without updating imports.

### UI conventions

All screens are built on the design system in `src/ui/` (tokens live in `src/theme.js`): `Screen` (background, keyboard avoidance, capped/centred column on tablets, optional sticky `footer`), `Header` (back navigation via `backTo`), `Card`, `Button`, `IconButton`, `Chip` (selectable option tiles), `Badge` (+ `treatmentTone()` maps a tratamiento string to a colour), `Input` / `FormField` (Formik-bound) / `FormRow` (side-by-side on tablets), `Select` (themed `react-native-element-dropdown`, `onChange(value, label, sala, item)`), `Sheet` (modal: bottom sheet on phones, dialog on tablets; pass `scroll={false}` when the body is a FlatList), `SearchBar`, `SectionTitle`, `EmptyState`, `OptionGrid`, `Text`, `Icon` and the `useResponsive()` hook. Icons are `@expo/vector-icons`: Ionicons by default, MaterialCommunityIcons with the `mci:` prefix (`mci:cow`, `mci:barn`). `PressableScale` moves layout props (`flex`, `width`, margins) onto the outer Pressable, so passing `style={{ flex: 1 }}` to a `Button`/`Chip` inside a row works as expected.

`StyledText`, `StyledTextInput` and `ModalPaw` are thin compatibility wrappers over the new primitives; prefer the `src/ui` exports in new code. Dates are stored as ISO strings; use `formatDate` in `src/utils/transformDate.js` for display. The option-group components under `src/component-button*` keep their (duplicated) selection logic and only delegate rendering to `OptionGrid`/`Chip`.
