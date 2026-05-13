import * as migration_20260506_195733 from './20260506_195733';
import * as migration_20260512_063155 from './20260512_063155';

export const migrations = [
  {
    up: migration_20260506_195733.up,
    down: migration_20260506_195733.down,
    name: '20260506_195733',
  },
  {
    up: migration_20260512_063155.up,
    down: migration_20260512_063155.down,
    name: '20260512_063155'
  },
];
