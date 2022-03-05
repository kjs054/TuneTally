import { UserToObjectPipe } from './user-to-object.pipe';

describe('UserToObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new UserToObjectPipe();
    expect(pipe).toBeTruthy();
  });
});
