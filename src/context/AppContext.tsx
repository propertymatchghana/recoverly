import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type {
  AppState,
  ParsedFile,
  ColumnMapping,
  AnalysisResult,
  AppSettings,
} from '@/types';
import { loadState, saveState, defaultState } from '@/lib/storage';
import { analyzeRecords } from '@/lib/analysis';
import { normalizeRecords } from '@/lib/columnDetection';
import { demoRecords } from '@/lib/demoData';
import { supabase } from '@/lib/supabase';

interface AppContextValue {
  state: AppState;
  setAuth: (user: { name: string; email: string }) => void;
  logout: () => void;
  setParsedFile: (file: ParsedFile) => void;
  setColumnMapping: (mapping: ColumnMapping) => void;
  runAnalysis: (rows: Record<string, unknown>[], mapping: ColumnMapping) => void;
  loadDemoData: () => void;
  clearData: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  markHandled: (id: string) => void;
  dismissAction: (id: string) => void;
  getAnalysisById: (id: string) => AnalysisResult | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState());

  useEffect(() => {
    const saved = loadState();

    if (saved) {
      setState((prev) => ({ ...prev, ...saved }));
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      const user = data.session?.user;

      if (user) {
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.business_name ||
          user.email?.split('@')[0] ||
          'User';

        setState((prev) => ({
          ...prev,
          isAuth: true,
          user: {
            name:
              displayName.charAt(0).toUpperCase() +
              displayName.slice(1),
            email: user.email || '',
          },
        }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (user) {
        const displayName =
          user.user_metadata?.full_name ||
          user.user_metadata?.business_name ||
          user.email?.split('@')[0] ||
          'User';

        setState((prev) => ({
          ...prev,
          isAuth: true,
          user: {
            name:
              displayName.charAt(0).toUpperCase() +
              displayName.slice(1),
            email: user.email || '',
          },
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isAuth: false,
          user: null,
        }));
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const setAuth = useCallback((user: { name: string; email: string }) => {
    setState((prev) => ({
      ...prev,
      isAuth: true,
      user,
    }));
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();

    setState((prev) => ({
      ...prev,
      isAuth: false,
      user: null,
    }));
  }, []);

  const setParsedFile = useCallback((file: ParsedFile) => {
    setState((prev) => ({
      ...prev,
      parsedFile: file,
    }));
  }, []);

  const setColumnMapping = useCallback((mapping: ColumnMapping) => {
    setState((prev) => ({
      ...prev,
      columnMapping: mapping,
    }));
  }, []);

  const runAnalysis = useCallback(
    (rows: Record<string, unknown>[], mapping: ColumnMapping) => {
      const records = normalizeRecords(rows, mapping);
      const analysis = analyzeRecords(records);

      setState((prev) => ({
        ...prev,
        records,
        analysis,
        isDemoData: false,
        columnMapping: mapping,
      }));
    },
    []
  );

  const loadDemoData = useCallback(() => {
    const analysis = analyzeRecords(demoRecords);

    setState((prev) => ({
      ...prev,
      records: demoRecords,
      analysis,
      isDemoData: true,
      parsedFile: null,
      columnMapping: null,
    }));
  }, []);

  const clearData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      parsedFile: null,
      columnMapping: null,
      records: [],
      analysis: [],
      isDemoData: false,
      handledActions: [],
      dismissedActions: [],
    }));
  }, []);

  const updateSettings = useCallback(
    (settings: Partial<AppSettings>) => {
      setState((prev) => ({
        ...prev,
        settings: {
          ...prev.settings,
          ...settings,
        },
      }));
    },
    []
  );

  const markHandled = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      handledActions: [...prev.handledActions, id],
    }));
  }, []);

  const dismissAction = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      dismissedActions: [...prev.dismissedActions, id],
    }));
  }, []);

  const getAnalysisById = useCallback(
    (id: string) => state.analysis.find((a) => a.recordId === id),
    [state.analysis]
  );

  return (
    <AppContext.Provider
      value={{
        state,
        setAuth,
        logout,
        setParsedFile,
        setColumnMapping,
        runAnalysis,
        loadDemoData,
        clearData,
        updateSettings,
        markHandled,
        dismissAction,
        getAnalysisById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }

  return ctx;
}
