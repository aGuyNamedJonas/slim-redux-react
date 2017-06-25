import { connect, Provider, subscription, calculation, changeTrigger, asyncChangeTrigger } from '../';  // It's important we import the functions are they are being exported by the module

describe('NPM module', () => {
  test('exports connect()', () => {
    expect(connect).toBeTruthy();
    expect(connect).not.toBeUndefined();
  });

  test('exports Provider (from react redux)', () => {
    expect(Provider).toBeTruthy();
    expect(Provider).not.toBeUndefined();
  });

  test('exports subscription()', () => {
    expect(subscription).toBeTruthy();
    expect(subscription).not.toBeUndefined();
  });

  test('exports calculation()', () => {
    expect(calculation).toBeTruthy();
    expect(calculation).not.toBeUndefined();
  });

  test('exports changeTrigger()', () => {
    expect(changeTrigger).toBeTruthy();
    expect(changeTrigger).not.toBeUndefined();
  });

  test('exports asyncChangeTrigger()', () => {
    expect(asyncChangeTrigger).toBeTruthy();
    expect(asyncChangeTrigger).not.toBeUndefined();
  });
});
