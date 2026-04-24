import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  priceId: string;
  packageId: number;
  coin: number;
  customerEmail?: string;
  piibelUserId: string;
  piibelUniqueToken: string;
  returnUrl?: string;
}

export function StripeEmbeddedCheckout({
  priceId,
  packageId,
  coin,
  customerEmail,
  piibelUserId,
  piibelUniqueToken,
  returnUrl,
}: Props) {
  const fetchClientSecret = async (): Promise<string> => {
    const finalReturnUrl =
      returnUrl ||
      `${window.location.origin}/profiil?checkout=success&session_id={CHECKOUT_SESSION_ID}`;

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        priceId,
        packageId,
        coin,
        customerEmail,
        piibelUserId,
        piibelUniqueToken,
        returnUrl: finalReturnUrl,
        environment: getStripeEnvironment(),
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "Maksesessiooni loomine ebaõnnestus");
    }
    return data.clientSecret;
  };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
