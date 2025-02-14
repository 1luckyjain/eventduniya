import * as React from 'react';
import { STATUS } from '../utils/utils';

interface AuthState {
  user: any;
  token: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  status: string;
  verifyingToken: boolean;
}

const initialState: AuthState = {
  user: {},
  token: null,
  expiresAt: null,
  isAuthenticated: false,
  status: STATUS.PENDING,
  verifyingToken: false,
};

type AuthAction =
  | { type: 'login'; payload: { user: any; token: string; expiresAt: string } }
  | { type: 'logout' }
  | { type: 'updateUser'; payload: { user: any } }
  | { type: 'status'; payload: { status: string } };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'login': {
      return {
        user: action.payload.user,
        token: action.payload.token,
        expiresAt: action.payload.expiresAt,
        isAuthenticated: true,
        verifyingToken: false,
        status: STATUS.SUCCEEDED,
      };
    }
    case 'logout': {
      return {
        ...initialState,
        status: STATUS.IDLE,
      };
    }
    case 'updateUser': {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case 'status': {
      return {
        ...state,
        status: action.payload.status,
      };
    }
    default: {
      throw new Error(`Unhandled action type:`);
    }
  }
};

interface AuthContextType extends AuthState {
  login: (user: any, token: string, expiresAt: string) => void;
  logout: () => void;
  updateUser: (user: any) => void;
  setAuthenticationStatus: (status: string) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  const login = React.useCallback(
    (user: any, token: string, expiresAt: string) => {
      dispatch({
        type: 'login',
        payload: {
          user,
          token,
          expiresAt,
        },
      });
    },
    []
  );

  const logout = React.useCallback(() => {
    dispatch({
      type: 'logout',
    });
  }, []);

  const updateUser = React.useCallback((user: any) => {
    dispatch({
      type: 'updateUser',
      payload: { user },
    });
  }, []);

  const setAuthenticationStatus = React.useCallback((status: string) => {
    dispatch({
      type: 'status',
      payload: { status },
    });
  }, []);

  const value = React.useMemo(
    () => ({ ...state, login, logout, updateUser, setAuthenticationStatus }),
    [state, login, logout, updateUser, setAuthenticationStatus]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
