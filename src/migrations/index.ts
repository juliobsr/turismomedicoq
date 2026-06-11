import * as migration_20260506_195733 from './20260506_195733';
import * as migration_20260512_063155 from './20260512_063155';
import * as migration_20260522_041902 from './20260522_041902';
import * as migration_20260522_051302 from './20260522_051302';
import * as migration_20260605_055345 from './20260605_055345';
import * as migration_20260605_070500 from './20260605_070500';
import * as migration_20260610_191401 from './20260610_191401';
import * as migration_20260610_201500 from './20260610_201500';
import * as migration_20260610_212509 from './20260610_212509';
import * as migration_20260611_004908 from './20260611_004908';

export const migrations = [
  {
    up: migration_20260506_195733.up,
    down: migration_20260506_195733.down,
    name: '20260506_195733',
  },
  {
    up: migration_20260512_063155.up,
    down: migration_20260512_063155.down,
    name: '20260512_063155',
  },
  {
    up: migration_20260522_041902.up,
    down: migration_20260522_041902.down,
    name: '20260522_041902',
  },
  {
    up: migration_20260522_051302.up,
    down: migration_20260522_051302.down,
    name: '20260522_051302',
  },
  {
    up: migration_20260605_055345.up,
    down: migration_20260605_055345.down,
    name: '20260605_055345',
  },
  {
    up: migration_20260605_070500.up,
    down: migration_20260605_070500.down,
    name: '20260605_070500',
  },
  {
    up: migration_20260610_191401.up,
    down: migration_20260610_191401.down,
    name: '20260610_191401',
  },
  {
    up: migration_20260610_201500.up,
    down: migration_20260610_201500.down,
    name: '20260610_201500',
  },
  {
    up: migration_20260610_212509.up,
    down: migration_20260610_212509.down,
    name: '20260610_212509',
  },
  {
    up: migration_20260611_004908.up,
    down: migration_20260611_004908.down,
    name: '20260611_004908'
  },
];
