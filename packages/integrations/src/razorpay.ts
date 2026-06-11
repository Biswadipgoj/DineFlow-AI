import Razorpay from 'razorpay';

let _rzp: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!_rzp) {
    _rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });
  }
  return _rzp;
}

export async function createRazorpayOrder(amount_paise: number, receipt: string) {
  const rzp = getRazorpay();
  return rzp.orders.create({
    amount: amount_paise,
    currency: 'INR',
    receipt,
  });
}
