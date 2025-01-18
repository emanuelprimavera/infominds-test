// CONTEXT
export interface appContext {
  openToast: boolean;
  setOpenToast: (value: boolean) => void;
  toastMessage: string;
  setToastMessage: (value: string) => void;
}

// SUPPLIER
export interface supplier {
  id: number;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

// EMPLOYEE
export interface employee {
  id: number;
  code?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  email?: string;
  phone?: string;
  department?: employee_department;
}
interface employee_department {
  code?: string;
  description?: string;
}

// CUSTOMERS
export interface customer {
  id: number;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  iban?: string;
  category?: customer_category;
}
interface customer_category {
  code?: string;
  description?: string;
}

// MODAL
export interface ModalInterface {
  open: boolean;
  close: (value: boolean) => void;
  title?: string;
  children?: React.ReactNode;
}
