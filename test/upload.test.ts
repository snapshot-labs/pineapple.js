import path from 'path';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { upload } from '../src';

describe('upload()', () => {
  describe('when the file is valid', () => {
    it('uploads and return the provider and cid', async () => {
      const formData = new FormData();
      formData.append('file', createReadStream(path.join(__dirname, './fixtures/valid.png')));
      const receipt = await upload(formData);
      expect(receipt.provider).toBe('4everland');
      expect(receipt.cid).toBe('bafkreibenzwnm4pckgeqdyzlwnxemfavkofaynnpxj6o23oojcfe77hvte');
    }, 30e3);
  });

  describe('when the file is missing', () => {
    it('returns an error', async () => {
      const formData = new FormData();
      formData.append('test', 'test');
      const receipt = await upload(formData);
      expect(receipt.error.code).toBe(400);
      expect(receipt.error.message).toBe('No file submitted');
    }, 10e3);
  });

  describe('when the file is too big', () => {
    it('returns an error', async () => {
      const formData = new FormData();
      formData.append('file', createReadStream(path.join(__dirname, './fixtures/too-heavy.jpg')));
      const receipt = await upload(formData);
      expect(receipt.error.code).toBe(400);
      expect(receipt.error.message).toBe('File too large');
    }, 10e3);
  });

  describe('when the file is not an image', () => {
    it('returns an error', async () => {
      const formData = new FormData();
      formData.append('file', createReadStream(path.join(__dirname, './fixtures/file.json')));
      const receipt = await upload(formData);
      expect(receipt.error.code).toBe(415);
      expect(receipt.error.message).toBe('Unsupported file type');
    }, 10e3);
  });
});
