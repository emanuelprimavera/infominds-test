export interface SupplierListQuery {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface appContext {
  openToast: boolean;
  setOpenToast: (value: boolean) => void;
  toastMessage: string;
  setToastMessage: (value: string) => void;
}
