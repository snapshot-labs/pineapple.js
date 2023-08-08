import path from 'path';
import { upload } from '../src';
import { createReadStream } from 'fs';
import FormData from 'form-data';

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
    it('returns a 400 error', async () => {
      const formData = new FormData();
      formData.append('test', 'test');
      const receipt = await upload(formData);
      expect(receipt.data).toBe('no file');
    }, 30e3);
  });

  describe('when the file is too big', () => {
    it('returns a 400 error', async () => {
      const formData = new FormData();
      formData.append('file', createReadStream(path.join(__dirname, './fixtures/too-heavy.jpg')));
      const receipt = await upload(formData);
      expect(receipt.data).toContain('large');
    }, 30e3);
  });

  describe('when the file is not an image', () => {
    it('returns a 400 error', async () => {
      const formData = new FormData();
      formData.append('file', createReadStream(path.join(__dirname, './fixtures/file.json')));
      const receipt = await upload(formData);
      expect(receipt.data).toContain('Unsupported file type');
    }, 30e3);
  });
});
