import { createContext, useReducer, type Dispatch, type ReactNode } from "react";
import type { Environment, Microservice } from "../index.js";

interface State {
    service: Microservice[];
    loading: boolean;
    error: string | null;
}

export type Action =
| { type: 'SET_AUTH'; payload: { user: any; token: string } }
| { type: 'LOGOUT' }
| { type: 'SET_ENV_FILTER'; payload: Environment | 'ALL' }
| { type: 'FETCH_SERVICES_SUCCESS'; payload: Microservice[] }
| { type: 'CREATE_SERVICE_SUCCESS'; payload: Microservice[] }
| { type: 'UPDATE_SERVICE_SUCCESS'; payload: Microservice[]}
| { type: 'DELETE_SERVICE_SUCCESS'; payload: string }
| { type: 'SET_ERROR'; payload: string | null };

const initialState: State = {
    service: [],
    loading: false,
    error: null,
}

const serviceReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_AUTH":
            return {...state,loading: true, error: null}
        case "LOGOUT"  :
            return {...state, loading:true , error: null}
        case "SET_ENV_FILTER":
            return { ...state, loading: true};
        case "FETCH_SERVICES_SUCCESS":
            return {...state, loading: false, service: action.payload};
        case "CREATE_SERVICE_SUCCESS":
            return {...state, loading: false, service: action.payload};
        case "DELETE_SERVICE_SUCCESS":
            return {...state, loading: false, error: action.payload};
        case "UPDATE_SERVICE_SUCCESS":
            return {...state, loading: true, service: action.payload};
          case "SET_ERROR":
            return {...state, loading: false, error: null};
        default:
            return state;

    }
};

export const serviceContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

export const serviceProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [state, dispatch] = useReducer(serviceReducer, initialState);

    return (
        <serviceContext.Provider value={{ state, dispatch }}>
            {children}
        </serviceContext.Provider>
    );
};