import * as migration_20251219_215102_initial from './20251219_215102_initial';
import * as migration_20251222_010523 from './20251222_010523';

export const migrations = [
  {
    up: migration_20251219_215102_initial.up,
    down: migration_20251219_215102_initial.down,
    name: '20251219_215102_initial',
  },
  {
    up: migration_20251222_010523.up,
    down: migration_20251222_010523.down,
    name: '20251222_010523'
  },
];
