// Page Object de la pantalla de login de Swag Labs.
// La clase hace (encuentra elementos y ejecuta acciones); los expect viven en el test.
export class LoginPage {
  constructor(page) {
    this.page = page;
    // Los campos no tienen <label> visible, pero sí aria-label, que getByLabel también reconoce.
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }
}
