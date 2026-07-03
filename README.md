# Stellar+ — React Native (Expo) Advanced UI Clone

A high-fidelity, production-grade streaming app UI inspired by **Disney+ Hotstar**.
Built for the House of Edtech advanced front-end assignment, it demonstrates a
scalable React Native architecture with a fully data-driven UI, a mock service
layer, polished loading/error/empty states, and a light/dark theme engine.

> Reference app: **Disney+ Hotstar** — immersive hero banners, content carousels,
> and a rich media detail view.

---

## ✨ Features

**Navigation**
- Bottom-tab navigation (Home · Search · Profile) + native stack for the Detail screen
- Full safe-area handling on notched iOS and Android devices

**Home** (content-rich feed)
- Swipeable, auto-paging **hero carousel** with gradient scrims and page indicators
- Multiple horizontal rails: *Continue Watching* (with progress bars), *Trending*,
  *New Releases*, *Critically Acclaimed*, genre rows
- **Pull-to-refresh**

**Detail** (rich media view)
- **Parallax backdrop** + **animated sticky header** that fades in on scroll
  (driven on the UI thread by Reanimated)
- Rich metadata: rating, runtime/seasons, maturity, genres, tags, cast & crew
- Primary actions (Play / My List / Download / Share) and a *More Like This* rail
- One fluid, unified scroll combining every section

**Profile / Settings**
- Identity card with plan badge and stats
- **Theme engine**: Light / Dark / System segmented control + quick toggle on Home
- Settings list with values, switches, and sign-out

**State & UX completeness**
- Shimmer **skeleton loaders** tailored to each screen's layout
- **Error states** with retry, and **empty states** (e.g. no search results)
- Simulated network latency **and** injected failures so these states are real

**Bonus objectives implemented**
- Micro-interactions & animations via `react-native-reanimated`
- Pull-to-refresh
- Seamless light/dark theme switching

---

## 🧱 Tech Stack

| Concern            | Choice                                             |
| ------------------ | -------------------------------------------------- |
| Framework          | **Expo SDK 57** (managed workflow), New Architecture |
| Language           | **TypeScript** (strict + `noUncheckedIndexedAccess`) |
| Styling            | **NativeWind v4** (Tailwind) + themed `StyleSheet` tokens |
| Navigation         | **React Navigation 7** (Native Stack + Bottom Tabs) |
| Component library  | **React Native Paper** (MD3, theme-bridged)        |
| Animation          | **react-native-reanimated 4** + `react-native-worklets` |
| Images             | **expo-image** (blurhash placeholders, transitions, recycling) |

### Why React Native Paper?
Paper ships a mature, accessible MD3 component set and — crucially — a
first-class theming API. The app bridges its own design tokens into Paper's
theme (`App.tsx`), so any Paper primitive automatically inherits the active
light/dark palette. It also has zero native-config friction in the Expo managed
workflow.

---

## 🏛️ Architecture

Strict **separation of concerns** between data and UI. Screens never touch mock
data or transport details — they consume hooks, which consume a service, which
consumes a simulated network client.

```
UI (screens) → hooks (useContent) → contentService → client(request) → mock JSON
```

```
src/
├─ types/            # Domain models — single source of truth for data shapes
│  └─ content.ts
├─ data/mock/        # Static catalog "JSON" (titles, home feed, profile)
├─ services/
│  ├─ client.ts      # Simulated network: randomized latency + failure injection
│  └─ contentService.ts   # The only data API screens depend on
├─ hooks/
│  ├─ useAsync.ts    # Generic loading/error/refetch lifecycle (unmount-safe)
│  └─ useContent.ts  # useHomeFeed / useTitle / useRelated / useCatalog / useProfile
├─ theme/
│  ├─ palette.ts     # Semantic color tokens (light + dark) + spacing/radius
│  └─ ThemeProvider.tsx   # Context, resolved scheme, toggle, NativeWind sync
├─ navigation/
│  ├─ types.ts       # Typed param lists (fully typed navigation)
│  ├─ RootNavigator.tsx   # Native stack + themed NavigationContainer
│  └─ TabNavigator.tsx    # Bottom tabs
├─ components/
│  ├─ ui/            # Skeleton, StateViews (error/empty), Chip, SectionHeader
│  └─ media/         # HeroCarousel, PosterCard, LandscapeCard, ContentRow
├─ screens/          # HomeScreen, DetailScreen, SearchScreen, ProfileScreen
└─ utils/            # Pure formatters (runtime, meta lines)
```

**Data-driven UI** — the Home feed is described entirely by data
(`HomeFeed → ContentRow[]`), and `ContentRow` picks its card component from
`row.layout` (`poster | landscape | continue`). Adding a new rail is a data
change, not a UI change.

**Swap-in real API** — replace the bodies in `contentService.ts` with `fetch`
calls returning the same types and nothing upstream changes.

---

## ⚡ Performance Optimizations

- **List virtualization** — every rail and list is a `FlatList` tuned with
  `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`,
  `removeClippedSubviews`, and stable `keyExtractor`s. Fixed card widths feed
  `getItemLayout` so lists never measure during scroll.
- **Single vertical VirtualizedList** on Home (rows are the data, hero is the
  `ListHeaderComponent`) — not a `ScrollView` full of lists.
- **Re-render minimization** — cards and rows are wrapped in `React.memo`;
  callbacks are `useCallback`'d and derived data is `useMemo`'d (e.g. search
  filtering, theme value, navigator options).
- **UI-thread animations** — the skeleton shimmer and the Detail parallax/sticky
  header run via Reanimated worklets, staying smooth even while JS resolves data.
- **Image performance** — `expo-image` with blurhash placeholders, fade
  transitions, and `recyclingKey` for efficient reuse in horizontal lists.

---

## 🚀 Getting Started

### Prerequisites
- Node 18+ (developed on Node 25)
- The **Expo Go** app on your device, or an iOS Simulator / Android Emulator

### Install & run
```bash
npm install
npm start          # then press i (iOS), a (Android), or scan the QR in Expo Go
```

Platform shortcuts:
```bash
npm run ios
npm run android
npm run web
```

Type-check:
```bash
npm run typecheck
```

> **Note on demo failures:** the Home feed request has an ~8% injected failure
> rate so the error state is reachable in a demo. Pull-to-refresh or tap
> **Try again** to recover — this is intentional, not a bug.

---

## 🎨 Theming

`ThemeProvider` resolves `light | dark | system` into a concrete scheme, exposes
semantic tokens via `useTheme()`, and keeps NativeWind, React Navigation, and
React Native Paper all in sync. Switch modes from **Profile → Appearance** or the
toggle on the Home top bar.

---

## 📁 Project Notes

- `AGENTS.md` / `CLAUDE.md` are AI-assistant instruction files and are not part
  of the app.
- Images are served from `picsum.photos` (deterministic seeds) and
  `pravatar.cc` — no API keys required.
