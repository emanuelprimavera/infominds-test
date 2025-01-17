// CONTEXT
export interface appContext {
  openToast: boolean;
  setOpenToast: (value: boolean) => void;
  toastMessage: string;
  setToastMessage: (value: string) => void;
}

// SUPPLIER
export interface SupplierListQuery {
  id: number;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
}

// EMPLOYEE
export interface EmployeeListQuery {
  id: number;
  code?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  email?: string;
  phone?: string;
  department?: EmployeeDepartment;
}
interface EmployeeDepartment {
  code?: string;
  description?: string;
}

// CUSTOMERS
export interface CustomersListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  iban: string;
  category: CustomersCategory;
}

interface CustomersCategory {
  code: string;
  description: string;
}

// MODAL
export interface ModalInterface {
  open: boolean;
  close: (value: boolean) => void;
  title?: string;
  children?: React.ReactNode;
}
