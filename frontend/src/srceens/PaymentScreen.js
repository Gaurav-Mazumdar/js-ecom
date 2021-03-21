import CheckoutSteps from '../components/CheckoutSteps';
import { getUserInfo, setPayment} from '../localStorage';

const PaymentScreen = {
  after_render: () => {
    document
      .getElementById('payment-form')
      .addEventListener('submit', async (e) => {
        e.preventDefault();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        setPayment({
          paymentMethod
        });
        document.location.hash = '/placeOrder';
      });
  },
  render: () => {
    const { name } = getUserInfo();
    if (!name) {
      document.location.hash = '/';
    }

    return `
    ${CheckoutSteps.render({ step1:true, step2:true, step3:true})}
    <div class="form-container">
      <form id="payment-form">
        <ul class="form-items">
          <li>
            <h1>Payment</h1>
          </li>
          <li>
            <div>
              <input type="radio" id="paypal" name="payment-method" value="Paypal" checked/>
              <label for="paypal">Paypal</label>
            </div>
          </li>
          <li>
            <div>
              <input type="radio" id="stripe" name="payment-method" value="Stripe"/>
              <label for="stripe">Stripe</label>
            </div>
          </li>
          <li>
            <button type="submit" class="primary">Continue</button>
          </li>
        </ul>
      </form>
    </div>
    `;
  },
};
export default PaymentScreen;