// Page Object de «Checkout: Your Information» (/checkout-step-one.html): los datos del comprador.
// En el checkout de Swag Labs no hay dirección ni login: esta pantalla equivale al «Billing» de la tienda del curso.
export class BillingPage {
  constructor(page) {
    this.page = page;
    this.title = page.getByTestId('title');
    // Los campos no tienen <label> visible, pero sí aria-label, que getByLabel reconoce.
    this.firstName = page.getByLabel('First Name');
    this.lastName = page.getByLabel('Last Name');
    this.postalCode = page.getByLabel('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.errorMessage = page.getByTestId('error');
  }

  // buyer = { firstName, lastName, postalCode } desde test-data/checkout-data.json.
  // Un campo que no viene en el dato se deja vacío (sirve para las validaciones).
  async fillBuyer(buyer) {
    await this.firstName.fill(buyer.firstName ?? '');
    await this.lastName.fill(buyer.lastName ?? '');
    await this.postalCode.fill(buyer.postalCode ?? '');
  }

  async continueToOverview() {
    await this.continueButton.click();
  }
}
