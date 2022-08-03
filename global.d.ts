namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    IS_DEV: boolean;
    ENABLE_SSL: boolean;
    PORT: number;
    DATABASE_URL: string;
    SECRET_KEY: string;
    X_API_KEY: string;
  }
}

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
