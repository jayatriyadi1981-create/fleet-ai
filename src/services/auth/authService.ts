/**
 * Fleet Intelligence Smart AI - AuthService Bridge
 * Centralized service instance delegating to the configured AuthProvider
 */

import { IAuthProvider, MockAuthProvider } from './authProvider';

class AuthService {
  private provider: IAuthProvider;

  constructor() {
    // Default to MockAuthProvider for robust development & demonstration
    this.provider = new MockAuthProvider();
  }

  public setProvider(provider: IAuthProvider) {
    this.provider = provider;
  }

  public get login() {
    return this.provider.login.bind(this.provider);
  }

  public get loginWithSSO() {
    return this.provider.loginWithSSO.bind(this.provider);
  }

  public get loginWithOTP() {
    return this.provider.loginWithOTP.bind(this.provider);
  }

  public get register() {
    return this.provider.register.bind(this.provider);
  }

  public get logout() {
    return this.provider.logout.bind(this.provider);
  }

  public get getSession() {
    return this.provider.getSession.bind(this.provider);
  }

  public get refreshSession() {
    return this.provider.refreshSession.bind(this.provider);
  }

  public get forgotPassword() {
    return this.provider.forgotPassword.bind(this.provider);
  }

  public get resetPassword() {
    return this.provider.resetPassword.bind(this.provider);
  }

  public get verifyEmail() {
    return this.provider.verifyEmail.bind(this.provider);
  }

  public get sendOTP() {
    return this.provider.sendOTP.bind(this.provider);
  }

  public get verifyOTP() {
    return this.provider.verifyOTP.bind(this.provider);
  }

  public get setup2FA() {
    return this.provider.setup2FA.bind(this.provider);
  }

  public get verify2FA() {
    return this.provider.verify2FA.bind(this.provider);
  }

  public get disable2FA() {
    return this.provider.disable2FA.bind(this.provider);
  }

  public get getActiveSessions() {
    return this.provider.getActiveSessions.bind(this.provider);
  }

  public get revokeSession() {
    return this.provider.revokeSession.bind(this.provider);
  }

  public get revokeAllSessions() {
    return this.provider.revokeAllSessions.bind(this.provider);
  }

  public get forceLogoutUser() {
    return this.provider.forceLogoutUser.bind(this.provider);
  }

  public get changePassword() {
    return this.provider.changePassword.bind(this.provider);
  }

  public get getSecurityLogs() {
    return this.provider.getSecurityLogs.bind(this.provider);
  }

  public get updateOrganization() {
    return this.provider.updateOrganization.bind(this.provider);
  }

  public get inviteTeamMember() {
    return this.provider.inviteTeamMember.bind(this.provider);
  }
}

export const authService = new AuthService();
