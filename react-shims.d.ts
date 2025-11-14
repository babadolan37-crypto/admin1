declare module 'react' {
  export function useEffect(effect: (args?: any) => any, deps?: any[]): void;
  export function useState(initial: any): [any, (value: any) => void];
  export interface ImgHTMLAttributes {
    src?: string;
    alt?: string;
    style?: any;
    className?: string;
    onError?: any;
    [key: string]: any;
  }
  const React: any;
  export default React;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'lucide-react' {
  export const DollarSign: any;
  export const TrendingUp: any;
  export const TrendingDown: any;
  export const Users: any;
  export const RefreshCw: any;
  export const AlertCircle: any;
}

declare module 'recharts' {
  export const BarChart: any;
  export const Bar: any;
  export const XAxis: any;
  export const YAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
  export const Legend: any;
  export const ResponsiveContainer: any;
  export const PieChart: any;
  export const Pie: any;
  export const Cell: any;
}

declare module 'sonner' {
  export const toast: any;
}

declare module 'jsr:@supabase/supabase-js@2.49.8' {
  export const createClient: any;
}

export {}