import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, ShoppingBag, IndianRupee, CreditCard } from "lucide-react";
import { RegistrationData } from "./RegistrationDialog";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: RegistrationData[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

const CartSheet = ({
  open,
  onOpenChange,
  items,
  onRemoveItem,
  onCheckout,
}: CartSheetProps) => {
  const total = items.reduce((sum, item) => sum + item.course.fee, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-serif text-lg text-foreground mb-2">
                Your cart is empty
              </h3>
              <p className="text-muted-foreground text-sm">
                Browse our courses and add registrations to your cart.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-secondary/50 rounded-lg p-4 relative group"
                  >
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h4 className="font-semibold text-foreground mb-1 pr-6">
                      {item.course.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.course.subtitle}
                    </p>
                    <div className="text-sm text-foreground/80">
                      <p>
                        <span className="text-muted-foreground">Registrant:</span>{" "}
                        {item.name}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Type:</span>{" "}
                        {item.registrantType === "self" ? "Self" : "Others"}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-primary font-bold">
                      <IndianRupee className="w-4 h-4" />
                      {item.course.fee.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Cart Summary */}
              <div className="pb-4 space-y-4">
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <IndianRupee className="w-5 h-5" />
                    {total.toLocaleString()}
                  </span>
                </div>

                <Button
                  variant="orange"
                  size="lg"
                  className="w-full"
                  onClick={onCheckout}
                >
                  <CreditCard className="w-5 h-5" />
                  Pay with Razorpay
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
