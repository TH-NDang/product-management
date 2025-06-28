"use client";

import { createClient } from "@/lib/supabase/client";
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { getApiUrl } from "@/lib/config";

const supabase = createClient();

// The following types are used to make the hook type-safe. It extracts the database type from the supabase client.
type SupabaseClientType = typeof supabase;

// Utility type to check if the type is any
type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N;

// Extracts the database type from the supabase client. If the supabase client doesn't have a type, it will fallback properly.
type Database = SupabaseClientType extends SupabaseClient<infer U>
  ? IfAny<
      U,
      {
        public: {
          Tables: Record<string, any>;
          Views: Record<string, any>;
          Functions: Record<string, any>;
        };
      },
      U
    >
  : never;

// Change this to the database schema you want to use
type DatabaseSchema = Database["public"];

// Extracts the table names from the database type
type SupabaseTableName = keyof DatabaseSchema["Tables"];

// Extracts the table definition from the database type
type SupabaseTableData<T extends SupabaseTableName> =
  DatabaseSchema["Tables"][T]["Row"];

type SupabaseSelectBuilder<T extends SupabaseTableName> = ReturnType<
  PostgrestQueryBuilder<DatabaseSchema, DatabaseSchema["Tables"][T], T>["select"]
>;

// A function that modifies the query. Can be used to sort, filter, etc. If .range is used, it will be overwritten.
type SupabaseQueryHandler<T extends SupabaseTableName> = (
  query: SupabaseSelectBuilder<T>
) => SupabaseSelectBuilder<T>;

interface UseInfiniteQueryProps<
  T extends SupabaseTableName,
  Query extends string = "*"
> {
  // The table name to query
  tableName: T;
  // The columns to select, defaults to `*`
  columns?: string;
  // The number of items to fetch per page, defaults to `20`
  pageSize?: number;
  // A function that modifies the query. Can be used to sort, filter, etc. If .range is used, it will be overwritten.
  trailingQuery?: SupabaseQueryHandler<T>;
}

// API Types for REST API infinite query
interface UseInfiniteQueryAPIProps<TData> {
  // The API endpoint to query (without /api prefix)
  endpoint: string;
  // The number of items to fetch per page, defaults to `20`
  pageSize?: number;
  // Additional query parameters
  queryParams?: Record<string, string | number>;
}

interface StoreState<TData> {
  data: TData[];
  count: number;
  isSuccess: boolean;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  hasInitialFetch: boolean;
}

type Listener = () => void;

function createStore<
  TData extends SupabaseTableData<T>,
  T extends SupabaseTableName
>(props: UseInfiniteQueryProps<T>) {
  const { tableName, columns = "*", pageSize = 20, trailingQuery } = props;

  let state: StoreState<TData> = {
    data: [],
    count: 0,
    isSuccess: false,
    isLoading: false,
    isFetching: false,
    error: null,
    hasInitialFetch: false,
  };

  const listeners = new Set<Listener>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (newState: Partial<StoreState<TData>>) => {
    state = { ...state, ...newState };
    notify();
  };

  const fetchPage = async (skip: number) => {
    if (
      state.hasInitialFetch &&
      (state.isFetching || state.count <= state.data.length)
    )
      return;

    setState({ isFetching: true });

    let query = supabase
      .from(tableName)
      .select(columns, {
        count: "exact",
      }) as unknown as SupabaseSelectBuilder<T>;

    if (trailingQuery) {
      query = trailingQuery(query);
    }
    const {
      data: newData,
      count,
      error,
    } = await query.range(skip, skip + pageSize - 1);

    if (error) {
      console.error("An unexpected error occurred:", error);
      setState({ error });
    } else {
      const deduplicatedData = ((newData || []) as TData[]).filter(
        (item) => !state.data.find((old) => (old as any).id === (item as any).id)
      );

      setState({
        data: [...state.data, ...deduplicatedData],
        count: count || 0,
        isSuccess: true,
        error: null,
      });
    }
    setState({ isFetching: false });
  };

  const fetchNextPage = async () => {
    if (state.isFetching) return;
    await fetchPage(state.data.length);
  };

  const initialize = async () => {
    setState({ isLoading: true, isSuccess: false, data: [] });
    await fetchNextPage();
    setState({ isLoading: false, hasInitialFetch: true });
  };

  return {
    getState: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    fetchNextPage,
    initialize,
  };
}

// API Store for REST API
function createAPIStore<TData extends { id: string }>(
  props: UseInfiniteQueryAPIProps<TData>
) {
  const { endpoint, pageSize = 20, queryParams = {} } = props;

  let state: StoreState<TData> = {
    data: [],
    count: 0,
    isSuccess: false,
    isLoading: false,
    isFetching: false,
    error: null,
    hasInitialFetch: false,
  };

  const listeners = new Set<Listener>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (newState: Partial<StoreState<TData>>) => {
    state = { ...state, ...newState };
    notify();
  };

  const fetchPage = async (skip: number) => {
    if (
      state.hasInitialFetch &&
      (state.isFetching || state.count <= state.data.length)
    )
      return;

    setState({ isFetching: true });

    try {
      const apiUrl = getApiUrl(endpoint);
      const url = new URL(apiUrl);
      url.searchParams.set("offset", skip.toString());
      url.searchParams.set("limit", pageSize.toString());

      // Add additional query parameters
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.set(key, value.toString());
      });

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData = await response.json();

      const deduplicatedData = (newData || []).filter(
        (item: TData) => !state.data.find((old) => old.id === item.id)
      );

      setState({
        data: [...state.data, ...deduplicatedData],
        count: state.count + deduplicatedData.length,
        isSuccess: true,
        error: null,
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setState({ error: error as Error });
    }

    setState({ isFetching: false });
  };

  const fetchNextPage = async () => {
    if (state.isFetching) return;
    await fetchPage(state.data.length);
  };

  const initialize = async () => {
    setState({ isLoading: true, isSuccess: false, data: [] });
    await fetchNextPage();
    setState({ isLoading: false, hasInitialFetch: true });
  };

  return {
    getState: () => state,
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    fetchNextPage,
    initialize,
  };
}

// Empty initial state to avoid hydration errors.
const initialState: any = {
  data: [],
  count: 0,
  isSuccess: false,
  isLoading: false,
  isFetching: false,
  error: null,
  hasInitialFetch: false,
};

function useInfiniteQuery<
  TData extends SupabaseTableData<T>,
  T extends SupabaseTableName = SupabaseTableName
>(props: UseInfiniteQueryProps<T>) {
  const storeRef = useRef(createStore<TData, T>(props));

  const state = useSyncExternalStore(
    storeRef.current.subscribe,
    () => storeRef.current.getState(),
    () => initialState as StoreState<TData>
  );

  useEffect(() => {
    // Recreate store if props change
    if (
      storeRef.current.getState().hasInitialFetch &&
      (props.tableName !== props.tableName ||
        props.columns !== props.columns ||
        props.pageSize !== props.pageSize)
    ) {
      storeRef.current = createStore<TData, T>(props);
    }

    if (!state.hasInitialFetch && typeof window !== "undefined") {
      storeRef.current.initialize();
    }
  }, [props.tableName, props.columns, props.pageSize, state.hasInitialFetch]);

  return {
    data: state.data,
    count: state.count,
    isSuccess: state.isSuccess,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    error: state.error,
    hasMore: state.count > state.data.length,
    fetchNextPage: storeRef.current.fetchNextPage,
  };
}

// API Hook for REST API
function useInfiniteQueryAPI<TData extends { id: string }>(
  props: UseInfiniteQueryAPIProps<TData>
) {
  const storeRef = useRef(createAPIStore<TData>(props));

  const state = useSyncExternalStore(
    storeRef.current.subscribe,
    () => storeRef.current.getState(),
    () => initialState as StoreState<TData>
  );

  useEffect(() => {
    // Recreate store if props change
    if (
      storeRef.current.getState().hasInitialFetch &&
      (props.endpoint !== props.endpoint || props.pageSize !== props.pageSize)
    ) {
      storeRef.current = createAPIStore<TData>(props);
    }

    if (!state.hasInitialFetch && typeof window !== "undefined") {
      storeRef.current.initialize();
    }
  }, [props.endpoint, props.pageSize, state.hasInitialFetch]);

  return {
    data: state.data,
    count: state.count,
    isSuccess: state.isSuccess,
    isLoading: state.isLoading,
    isFetching: state.isFetching,
    error: state.error,
    hasMore: state.count > state.data.length,
    fetchNextPage: storeRef.current.fetchNextPage,
  };
}

export {
  useInfiniteQuery,
  useInfiniteQueryAPI,
  type SupabaseQueryHandler,
  type SupabaseTableData,
  type SupabaseTableName,
  type UseInfiniteQueryProps,
  type UseInfiniteQueryAPIProps,
};
