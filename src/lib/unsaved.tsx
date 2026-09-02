import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Guard = { dirty: boolean; save?: () => void | Promise<void>; label?: string };

type Ctx = {
  setGuard: (g: Guard | null) => void;
  /** Returns true when navigation may proceed immediately. */
  attempt: (to: string) => boolean;
  isDirty: () => boolean;
};

const UnsavedContext = createContext<Ctx | null>(null);

export const UnsavedChangesProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const guardRef = useRef<Guard | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const setGuard = useCallback((g: Guard | null) => {
    guardRef.current = g;
  }, []);

  const attempt = useCallback((to: string) => {
    if (!guardRef.current?.dirty) return true;
    setPending(to);
    return false;
  }, []);

  const isDirty = useCallback(() => !!guardRef.current?.dirty, []);

  // Closing or reloading the tab.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!guardRef.current?.dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  const leave = (to: string) => {
    guardRef.current = null;
    setPending(null);
    navigate(to);
  };

  const saveAndLeave = async () => {
    const to = pending;
    if (!to) return;
    setSaving(true);
    try {
      await guardRef.current?.save?.();
      leave(to);
    } finally {
      setSaving(false);
    }
  };

  const label = guardRef.current?.label ?? "changes";
  const canSave = !!guardRef.current?.save;

  return (
    <UnsavedContext.Provider value={{ setGuard, attempt, isDirty }}>
      {children}
      <AlertDialog open={!!pending} onOpenChange={(o) => !o && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save your {label} before you go?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved {label} on this page. They are only kept once you save — leaving now discards them.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-2">
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <Button variant="outline" onClick={() => pending && leave(pending)} disabled={saving}>
              Leave without saving
            </Button>
            {canSave && (
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  void saveAndLeave();
                }}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save and leave"}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </UnsavedContext.Provider>
  );
};

export const useUnsavedNav = () => useContext(UnsavedContext);

/**
 * Register a page's unsaved state. `save` may be omitted for drafts that
 * cannot be saved automatically.
 */
export const useUnsavedGuard = (dirty: boolean, save?: () => void | Promise<void>, label?: string) => {
  const ctx = useContext(UnsavedContext);
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    ctx?.setGuard(
      dirty
        ? { dirty: true, label, save: saveRef.current ? () => saveRef.current?.() : undefined }
        : null,
    );
  }, [ctx, dirty, label]);

  useEffect(() => () => ctx?.setGuard(null), [ctx]);
};
