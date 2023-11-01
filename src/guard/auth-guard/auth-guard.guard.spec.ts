import { AuthGuardGuard } from "./auth-guard.guard";

describe('IsAdminGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuardGuard()).toBeDefined();
  });
});
