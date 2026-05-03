# FinSightIQ Phase 2: Market Data & Realtime Financial Dashboard

## Overview

Phase 2 implements a professional stock market experience with realtime data, financial charting, and comprehensive market analysis tools. This builds on Phase 1's foundation to deliver a TradingView-like interface.

## ✨ Features Implemented

### 1. **Market Module Architecture**

```
src/features/market/
├── api/                 # API integration layer
├── components/          # Reusable components
│   ├── charts/         # Financial charts
│   ├── dashboard/      # Dashboard widgets
│   ├── search/         # Search components
│   └── watchlist/      # Watchlist components
├── hooks/              # Custom React hooks
├── pages/              # Feature pages
├── services/           # Business logic (SignalR)
├── store/              # Zustand state management
├── types/              # TypeScript types
├── utils/              # Utility functions
├── mocks/              # Mock data for development
└── index.ts            # Feature exports
```

### 2. **Pages**

#### **Market Overview Page** (`/app/market`)

- Live market indexes (S&P 500, NASDAQ, Dow Jones, Russell 2000)
- Top gainers, losers, and most active stocks
- Trending stocks display
- Market status indicator
- Real-time updates (15-second refresh)

#### **Stock Details Page** (`/app/market/stock/:symbol`)

- Company name, symbol, exchange, live price
- Daily change and percentage
- Interactive candlestick charts with ApexCharts
- Timeframe selector (1D, 1W, 1M, 3M, 6M, 1Y, 5Y)
- Technical indicators (SMA, EMA, RSI, MACD, Bollinger Bands)
- Volume overlay chart
- Market statistics panel (Open, High, Low, Volume, Market Cap, PE, etc.)
- Company information (sector, industry, CEO, headquarters)
- Add to watchlist functionality
- Real-time price updates via SignalR

#### **Market Search Page** (`/app/market/search`)

- Professional search interface with autocomplete
- Symbol and company name search
- Search history (localStorage persisted)
- Match scoring
- Result previews with exchange/type info
- Search tips and guidance

### 3. **Chart Components**

- **CandlestickChart**: OHLC candlestick with zoom, pan, and crosshair
- **VolumeChart**: Trading volume visualization
- **SparklineChart**: Compact inline charts for watchlists
- All charts: Dark mode, responsive, realtime-compatible

### 4. **Search System**

- **StockSearchInput**:
  - Debounced API calls
  - Recent searches (localStorage)
  - Trending searches
  - Keyboard navigation (Escape, Enter)
  - Keyboard-accessible dropdown

### 5. **Watchlist System**

- **WatchlistPanel**: Multi-watchlist management
- **WatchlistTable**: Sortable watchlist with realtime prices
- **AddToWatchlistButton**: Star icon for quick add
- Features:
  - Create/update/delete watchlists
  - Add/remove stocks
  - Reorder items (drag-and-drop ready)
  - Price alerts
  - Realtime price updates
  - Favorite tracking

### 6. **Dashboard Widget System**

- **DashboardWidget**: Reusable widget container
  - Collapsible/expandable
  - Loading and error states
  - Settings button
  - Fullscreen mode
  - Removable option
- **MarketSummaryCard**: Index display card
- **TopMoverItem**: Stock card with change indicator
- **MarketStatisticsPanel**: Key metrics grid

### 7. **Realtime Integration (SignalR)**

- **SignalRService**:
  - Automatic reconnection with exponential backoff
  - Single connection manager
  - Symbol subscriptions
  - Event batching
  - Cleanup of unused listeners
- **Hooks**:
  - `useSignalR()`: Initialize connection
  - `useSubscribeToPrice()`: Single symbol
  - `useSubscribeToMultiplePrices()`: Multiple symbols
  - `useMarketEvents()`: Market events listener
  - `useWatchListSubscriptions()`: Auto-subscribe to watchlist
  - `useRealtimePrice()`: Get current price
  - `useSignalRConnection()`: Manual connection control

### 8. **API Layer**

```typescript
// Market Data
getStockQuote(symbol);
getStockQuotesBatch(symbols);
getMarketOverview();
getTopMovers();
getHistoricalPrices(symbol, timeframe, includeIndicators);
getMarketStatistics(symbol);
getCompanyInfo(symbol);
getStockDetails(symbol, includeHistorical);

// Search
searchSymbols(query, limit);
getSearchSuggestions();

// Watchlist
getWatchlists();
getWatchlist(watchlistId);
createWatchlist(name);
updateWatchlist(watchlistId, name);
deleteWatchlist(watchlistId);
addToWatchlist(watchlistId, symbol);
removeFromWatchlist(watchlistId, itemId);
reorderWatchlistItems(watchlistId, itemIds);
setPriceAlert(watchlistId, itemId, alertPrice);
```

### 9. **State Management**

#### **MarketStore** (Zustand)

- Realtime prices (Map-based for O(1) access)
- Selected symbol
- Watched symbols set
- Search query
- Chart timeframe and type
- Technical indicators visibility
- Market status
- Update timestamp

#### **WatchlistStore** (Zustand)

- Default watchlist ID
- Favorite symbols
- Price alerts
- Watchlist panel open/close state
- Active watchlist ID

#### **RealtimeStore** (Zustand)

- Connection status
- Subscription state
- Subscription errors
- Last connection time

### 10. **React Query Hooks**

```typescript
useStockQuote(symbol, options);
useStockQuotesBatch(symbols, options);
useMarketOverview(options);
useTopMovers(options);
useHistoricalPrices(symbol, timeframe, includeIndicators);
useMarketStatistics(symbol);
useCompanyInfo(symbol);
useStockDetails(symbol, includeHistorical);
useSearchSymbols(query, limit, options);
useSearchSuggestions(options);
useWatchlists(options);
useWatchlist(watchlistId, options);
useCreateWatchlist();
useUpdateWatchlist();
useDeleteWatchlist();
useAddToWatchlist(watchlistId);
useRemoveFromWatchlist(watchlistId);
useReorderWatchlist(watchlistId);
```

### 11. **Utility Functions**

```typescript
// Formatting
formatCurrency(value, decimals);
formatNumber(value, decimals); // K, M, B, T
formatPercentage(value, decimals);
formatMarketCap(marketCap);
formatVolume(volume);
formatPERatio(pe);
formatEPS(eps);
formatDividendYield(yield);

// Analysis
getPriceChangeColor(value);
calculatePercentageChange(current, previous);
calculateSupportResistance(high, low, close);
calculateRSI(prices, period);
classifyRSI(rsi);
getRSIColor(rsi);

// Status
getMarketStatusColor(status);
getMarketStatusLabel(status);
isMarketOpen(status);
getCandleColor(open, close);

// Dates
formatDate(timestamp, format);
calculatePriceTarget(price, percentage);
```

### 12. **Performance Optimizations**

✅ **Implemented:**

- Route-based code splitting (lazy loading)
- Memoized chart rendering (React.memo)
- Debounced search (built into React Query)
- Virtualized tables (component ready)
- Efficient websocket updates
- Map-based realtime store (O(1) price lookup)
- Stale time management in React Query
- Automatic garbage collection (gcTime)

**Target Metrics:**

- Chart render: < 200ms
- Live update latency: < 1s
- Search response: < 150ms
- Lighthouse: > 90

### 13. **UI/UX Design**

**Design System:**

- Premium dark-first UI
- Glassmorphism panels (border + backdrop blur)
- Subtle gradients
- Animated realtime updates
- Smooth hover transitions
- Financial SaaS aesthetics
- Color coding: Green (+), Red (-)
- Proper white space and typography

**Components:**

- Responsive grid layouts
- Touch-friendly buttons
- Accessible focus states
- Loading skeletons
- Error boundaries
- Empty states

### 14. **Accessibility**

✅ **WCAG 2.1 Level AA:**

- Keyboard navigation throughout
- Screen reader support via semantic HTML
- Proper ARIA labels
- Focus management
- Color not only medium
- Sufficient contrast ratios
- Skip to content patterns

### 15. **Testing**

**Test Coverage:**

- Component tests (CandlestickChart, StockSearchInput, WatchlistTable)
- Hook tests (useStockQuote, useWatchlist)
- Integration tests (search flow, watchlist management)
- Chart rendering tests
- SignalR integration tests

**Tools:**

- Vitest
- React Testing Library
- Mock data helpers

## 🚀 Quick Start

### 1. **Install Dependencies**

```bash
pnpm install
```

### 2. **Configure Environment**

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SIGNALR_URL=https://localhost:5000/market-hub
```

### 3. **Start Development Server**

```bash
pnpm dev
```

### 4. **Using Mock Data** (Development)

```typescript
import {
  generateMockStockDetails,
  generateMockTopMovers,
} from "@/features/market/mocks";

// Use during development before backend is ready
const mockData = generateMockStockDetails("AAPL");
```

### 5. **Access Pages**

- Market Overview: `/app/market`
- Stock Details: `/app/market/stock/AAPL`
- Market Search: `/app/market/search`

## 📊 Architecture Patterns

### **Data Flow**

```
API Layer (axios)
    ↓
React Query (caching & state)
    ↓
Zustand Store (UI state)
    ↓
Components (render)
    ↓
SignalR (realtime updates)
```

### **Realtime Updates**

```
1. Component mounts
2. useSubscribeToPrice(symbol) subscribates
3. SignalR connects/subscribes
4. Price update received
5. Store updated
6. Component re-renders
7. Component unmounts
8. Unsubscribe cleans up
```

### **Search Flow**

```
User types
    ↓
useSearchSymbols debounces
    ↓
API call
    ↓
Results cached in React Query
    ↓
Dropdown shows results
    ↓
User selects
    ↓
Add to recent searches (localStorage)
    ↓
Navigate to stock details
```

## 🔧 Development Tips

### **Enable Debug Logging**

```typescript
const { data, isLoading, error } = useStockQuote("AAPL");
console.log("Quote:", { data, isLoading, error });
```

### **Invalidate Cache**

```typescript
const queryClient = useQueryClient();
queryClient.invalidateQueries({
  queryKey: marketQueryKeys.quotes.detail("AAPL"),
});
```

### **Use Mock Data**

```typescript
import { generateMockStockDetails } from "@/features/market/mocks";
const mockStock = generateMockStockDetails("AAPL");
```

### **Check Realtime Connection**

```typescript
const { isConnected } = useSignalRConnection();
console.log("Connected:", isConnected);
```

## 📈 Next Steps

1. **Backend Integration**
   - Connect real market data APIs (Alpha Vantage, IEX Cloud, etc.)
   - Implement SignalR hub on backend
   - Setup WebSocket infrastructure

2. **Advanced Features**
   - Portfolio tracking
   - Price alerts
   - Trading capabilities
   - News integration
   - Technical analysis tools

3. **Performance**
   - Implement virtual scrolling for large lists
   - Add service workers for offline support
   - Implement progressive image loading

4. **Analytics**
   - Setup PostHog tracking
   - Monitor performance metrics
   - Track user engagement

## 📚 Resources

- [ApexCharts Documentation](https://apexcharts.com/)
- [React Query Documentation](https://tanstack.com/query/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [SignalR JavaScript Documentation](https://docs.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🎨 Design Inspirations

- TradingView.com
- Bloomberg Terminal
- Yahoo Finance Pro
- Stripe Analytics
- Linear Design System

## 📝 License

FinSightIQ © 2024. All rights reserved.
