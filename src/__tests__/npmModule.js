import { connect, Provider } from '../';  // It's important we import the functions are they are being exported by the module

describe('NPM module', () => {
  test('exports connect()', () => {
    expect(connect).toBeTruthy();
    expect(connect).not.toBeUndefined();
  });

  test('exports Provider (from react redux)', () => {
    expect(Provider).toBeTruthy();
    expect(Provider).not.toBeUndefined();
  });
});
