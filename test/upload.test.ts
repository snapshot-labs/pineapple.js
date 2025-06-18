import path from 'path';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { upload } from '../src';

describe('upload()', () => {
  describe('when the file is valid', () => {
    it('uploads and return the provider and cid', async () => {
      const formData = new FormData();
      formData.append(
        'file',
        createReadStream(path.join(__dirname, './fixtures/valid.png'))
      );
      const receipt = await upload(formData);
      expect(receipt.provider).toBe('4everland');
      expect(receipt.cid).toBe(
        'bafkreidxvfyqu6l3tb3y5gi2nq5zqyincpev2rangnv7nmaocrk7q3o2fi'
      );
    });
  });

  describe('when the file is missing', () => {
    it('returns an error', async () => {
      const formData = new FormData();
      formData.append('test', 'test');

      expect.assertions(1);

      await expect(upload(formData)).rejects.toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 400,
            message: 'No file submitted'
          })
        })
      );
    });
  });

  describe('when the file is too big', () => {
    it('returns an error', async () => {
      const formData = new FormData();
      formData.append(
        'file',
        createReadStream(path.join(__dirname, './fixtures/too-heavy.jpg'))
      );

      expect.assertions(1);

      await expect(upload(formData)).rejects.toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 400,
            message: 'File too large'
          })
        })
      );
    });
  });

  describe('when the file is not an image', () => {
    it('returns an error', async () => {
      const formData = new FormData();
      formData.append(
        'file',
        createReadStream(path.join(__dirname, './fixtures/file.json'))
      );

      expect.assertions(1);

      await expect(upload(formData)).rejects.toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 415,
            message: 'Unsupported file type'
          })
        })
      );
    });
  });

  describe('on network error', () => {
    it('returns an error following the same format as server error', async () => {
      const formData = new FormData();
      formData.append(
        'file',
        createReadStream(path.join(__dirname, './fixtures/file.json'))
      );

      expect.assertions(1);

      await expect(
        upload(formData, 'https://pineapple.fyi/not-existing')
      ).rejects.toEqual(
        expect.objectContaining({
          error: expect.objectContaining({
            code: 404,
            message: 'Not Found'
          })
        })
      );
    });
  });
});
