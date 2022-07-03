import { useCallback, useState } from "react";


export function useModalState(defaultValue = false) {

    const [isOpen, setIsOpen] = useState(defaultValue);

    const openDrawer = useCallback(() => setIsOpen(true),[]);

    const closeDrawer = useCallback(() => setIsOpen(false),[]);

    return {isOpen,closeDrawer,openDrawer};

}  