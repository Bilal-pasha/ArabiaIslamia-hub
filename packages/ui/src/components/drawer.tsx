'use client';

/**
 * Drawer: slide-in panel (typically from the side). Built on the same primitives as Sheet.
 * Use for mobile nav, filters, etc. Renders in a portal so it appears above other content.
 */
export {
  Sheet as Drawer,
  SheetTrigger as DrawerTrigger,
  SheetClose as DrawerClose,
  SheetContent as DrawerContent,
  SheetHeader as DrawerHeader,
  SheetFooter as DrawerFooter,
  SheetTitle as DrawerTitle,
  SheetDescription as DrawerDescription,
} from './sheet';
