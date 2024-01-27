import create from "zustand";
const useStore = create((set) => ({
  approvePage: false,
  setApprovePage: (data) => set({ approvePage: data }),
  confirmPage: false,
  setConfirmPage: (data) => set({ confirmPage: data }),
  activatingPage: false,
  setActivatingPage: (data) => set({ activatingPage: data }),
  processingPage: false,
  setProcessingPage: (data) => set({ processingPage: data }),
  successPage: false,
  setSuccessPage: (data) => set({ successPage: data }),
  quotePage: false,
  setQuotePage: (data) => set({ quotePage: data }),
  settingPage: false,
  setSettingPage: (data) => set({ settingPage: data }),
  errorPage: { show: false, text: "" },
  setErrorPage: (data) => set({ errorPage: { ...data } }),
  BNBErrorPage: false,
  setBNBErrorPage: (data) => set({ BNBErrorPage: data }),
  slippage: 0.5,
  setSlippage: (data) => set({ slippage: data }),
}));

export default useStore;
