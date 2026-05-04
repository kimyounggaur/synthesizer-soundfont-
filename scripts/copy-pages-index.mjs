import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('dist/index.source.html');
const target = resolve('dist/index.html');

if (existsSync(source)) {
  copyFileSync(source, target);
}
